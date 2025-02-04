import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getContacts, getProjects } from '../../task/core/_requests';
import { getExpenses, getCashback, updateCashback, getCashBackById } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Toast } from 'bootstrap';
import Moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getFinanceInvoiceStatus, getFinancePaymentMode } from '../../settings/masters/core/_requests';
import { getTrnsactions } from '../../transaction/core/_requests';
import { getDeveloperNameList } from '../../contact/core/_requests';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";

const initialValues = {
    transaction_id : '',
    invoice_id : '',
    client_name : '',
    transaction_amount : '',
    due_date : '',
    release_amount : '',
    release_mode : '',
    description : '',
    created_by : '',
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, aminityName: string[], theme: Theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const mystyle = {
    padding: "0px",
    height: "34px",
    maxHeight: "200px",
    overflowY: "scroll",
};

type props = {
    cashbacksId:any,
    dropdowns:any,
}


const CashbackEditForm: FC<props> = (props) => {

    const {cashbacksId, dropdowns} = props
    const intl = useIntl();
    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [financeCashbackStatus, setFinanceCashbackStatus] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [cashbackDetails, setCashbackDetails] = useState<any[]>([]);
    const [expnse, setExpnse] = useState<any[]>([]);
    const [clientId, setClientId] = useState<any>('');
    const [expenseName, setExpenseName] = useState<any[]>([]);
    const [developerNameList, setDeveloperNameList] = useState<any[]>([]);
    const [contactId, setContactId] = useState<any>('');
    const {currentUser, logout} = useAuth();
    const [financePaymentMode, setFinancePaymentMode] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [cashbacks, setCashbacks] = useState<any[]>([]);

    const theme = useTheme(); 

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var userId = currentUser?.id;
            var roleId = currentUser?.designation;

            let body = {
                "transaction_id" : values.transaction_id,
                "invoice_id" : values.invoice_id,
                "client_name" : contactId,
                "transaction_amount" : values.transaction_amount,
                "due_date" : values.due_date,
                "release_amount" : values.release_amount,
                "release_mode" : values.release_mode,
                "description" : values.description,
                "created_by" : userId
                }
          
            const saveTaskData = await updateCashback(cashbacksId, body);
    
            console.log('saveTaskData');
            console.log(saveTaskData);
            // document.getElementById('kt_contact')?.classList.remove('drawer-on');
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_Cashback_details_close')?.click();
                document.getElementById('cashbackReload')?.click();
                var toastEl = document.getElementById('myToastExpenseAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                resetForm();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const proformaCashbackById = async (id:any) => {
        const response = await getCashBackById(id)
        setCashbackDetails(response.output[0])
        setClientId(response.output[0]?.client_name);
        formik.setFieldValue('transaction_id', response.output[0]?.transaction_id ?? '')
        formik.setFieldValue('invoice_id', response.output[0]?.invoice_id ?? '')
        formik.setFieldValue('transaction_amount', response.output[0]?.transaction_amount ?? '')
        formik.setFieldValue('release_amount', response.output[0]?.release_amount ?? '')
        formik.setFieldValue('due_date',Moment(response.output[0]?.due_date).format('YYYY-MM-DD') ?? '')
        formik.setFieldValue('description', response.output[0]?.description ?? '')
        formik.setFieldValue('release_mode', response.output[0]?.release_mode ?? '')
        setContactId(response.output[0]?.client_name)
    }

    const projectList =  async () => {
        var userId = currentUser?.id;
        var roleId = currentUser?.designation;
        const projectResponse = await getProjects(userId, roleId);
        setProjects(projectResponse);
    } 

    const expenseList = async () => {
        const response = await getExpenses()
        setExpnse(response)
    }

    const contactsList =  async () => {   
        var userId = currentUser?.id;
        var roleId = currentUser?.designation;
        const contactsResponse = await getContacts(userId, roleId)
    
        console.log('leads contactsResponse');
        console.log(contactsResponse);
    
        var contactDropList = [];
    
        for(let i = 0; i < contactsResponse.length; i++) {
            var data = { "id": contactsResponse[i].id, "name": contactsResponse[i].first_name + ' '+ contactsResponse[i].last_name, "contact_type": contactsResponse[i].contact_type }
            contactDropList.push(data);
        }
    
        console.log(contactDropList);
        setContactsLead(contactDropList);
      }

      const contactDropSelect = (id:any, type:any) => {
        formik.setFieldValue('client', id ?? '');
        setContactId(id)
      }

      const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }

    const FinanceCashbackStatusList =  async () => {
        const FinanceCashbackStatusResponse = await getFinanceInvoiceStatus()
        setFinanceCashbackStatus(FinanceCashbackStatusResponse);
    }

    const FinancePaymentModeList =  async () => {
        const FinancePaymentModeResponse = await getFinancePaymentMode()
        setFinancePaymentMode(FinancePaymentModeResponse);
    }

    const cashbackList = async () => {
        const response = await getCashback()
        setCashbacks(response)
        console.log('getCashback342342343', response)
    }
    
    const developerNames =  async () => {  
        var userId = currentUser?.id;
        var roleId = currentUser?.designation;   
        const contactDropResponse = await getDeveloperNameList(userId, roleId)
        setDeveloperNameList(contactDropResponse);
    }

    useEffect(() => {
        // projectList();
        // developerNames();
        // cashbackList();
        // TransactionsList();
        // FinancePaymentModeList();
        // contactsList();
        // expenseList();
        // FinanceCashbackStatusList();
        cashbacksId && proformaCashbackById(cashbacksId);
    }, [cashbacksId]);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'edit_cashback'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_Cashback_details_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_proforma_body'>
                <form noValidate onSubmit={formik.handleSubmit}>
                <div className="accordion" id="accordionExample"> 
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'basic_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row">
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('transaction_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.transaction?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option  value={trans.id} key={i}>{trans.contact_name}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('invoice_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.invoice?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option  value={trans.id} key={i}>{trans.contact_name}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'due_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('due_date')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_name'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='autocomplete_field w-100'>
                                                <ReactSelect
                                                options={dropdowns.client_name}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.contact_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.client_name?.find((item:any) => item.id?.toString() == clientId)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setClientId(val.id);
                                                    formik.setFieldValue('client_name', val.id);
                                                }}
                                                placeholder={"Brokers.."}
                                                />                                      
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction_amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" {...formik.getFieldProps('transaction_amount')} className="form-control" placeholder="Transaction Amount..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'release_mode'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('release_mode')}>
                                            <option value=''>Select</option>
                                                {dropdowns.release_mode?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.option_value}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'release_amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('release_amount')} className="form-control" placeholder="Release Amount..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'description'})}</label>
                                        <div className="input-group mb-3">
                                            <textarea {...formik.getFieldProps('description')} className="form-control" placeholder="Description..."/> 
                                        </div>
                                    </div>                                                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
                <div className='d-flex justify-content-center'>           
                    <button
                    type='submit'
                    
                    className='btn btn_primary text-primary'
                    disabled={formik.isSubmitting}
                    >
                    {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                    <KTSVG
                    path='/media/custom/save_white.svg'
                    className='svg-icon-3 svg-icon-primary ms-2'
                    />
                    </span>}
                    {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                    </button>
                </div>
            </form> 
            </div>
        </div>        
    )
}

export {CashbackEditForm}