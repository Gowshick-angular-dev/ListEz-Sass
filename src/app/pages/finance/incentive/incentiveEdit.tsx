import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getContacts, getProjects } from '../../task/core/_requests';
import { getExpenses, getIncentiveById, getInvoice, updateIncentive } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Toast } from 'bootstrap';
import Moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getAllUsers } from '../../transaction/core/_requests';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";

const initialValues = {
    invoice_number : '',
    select_brokers : '',
    total_incentive : '',
    incentive_payable : '',
    paid_amount : '',
    incentive_due : '',
    description : '',
    created_by : ''
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
    incentivesId:any,
    dropdowns:any,
}


const IncentiveEditForm: FC<props> = (props) => {

    const {incentivesId, dropdowns} = props
    const intl = useIntl();
    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [financeIncentiveStatus, setFinanceIncentiveStatus] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [incentiveDetails, setIncentiveDetails] = useState<any[]>([]);
    const [expnse, setExpnse] = useState<any[]>([]);
    const [expenseId, setExpenseId] = useState<any>('');
    const [expenseName, setExpenseName] = useState<any[]>([]);
    const [contactId, setContactId] = useState<any>('');
    const {currentUser, logout} = useAuth();
    const [sharedWithName, setSharedWithName] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [sharedWithId, setSharedWithId] = useState<any>('');
    const [users, setUsers] = useState<any[]>([]);
    const [brokers, setBrokers] = useState<any[]>([]);

    const theme = useTheme(); 

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            let body = {
                "invoice_number" : values.invoice_number,
                "select_brokers" : brokers?.map((item:any) => item.id)?.join(','),
                "total_incentive" : values.total_incentive,
                "incentive_payable" : values.incentive_payable,
                "paid_amount" : values.paid_amount,
                "incentive_due" : values.incentive_due,
                "description" : values.description
                }
          
            const saveTaskData = await updateIncentive(incentivesId, body);
    
            console.log('saveTaskData');
            console.log(saveTaskData);
            // document.getElementById('kt_contact')?.classList.remove('drawer-on');
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_Incentive_details_close')?.click();
                document.getElementById('incentiveReload')?.click();
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

    const proformaIncentiveById = async (id:any) => {
        const response = await getIncentiveById(id)
        setIncentiveDetails(response.output[0])
        
        setBrokers(dropdowns.users?.filter((item:any) => response.output[0]?.select_brokers?.split(',')?.indexOf(item.id?.toString()) !== -1))
        formik.setFieldValue('invoice_number', response.output[0]?.invoice_number ?? '')
        formik.setFieldValue('total_incentive', response.output[0]?.total_incentive ?? '')
        formik.setFieldValue('incentive_payable', response.output[0]?.incentive_payable ?? '')
        formik.setFieldValue('paid_amount', response.output[0]?.paid_amount ?? '')
        formik.setFieldValue('incentive_due', response.output[0]?.incentive_due ?? '')
        formik.setFieldValue('description', response.output[0]?.description ?? '')
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

    
    const sharedWithChange = (event: SelectChangeEvent<typeof sharedWithName>) => {
        const {
          target: { value },
        } = event;

        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        console.log(name);
        console.log(id);
    
        setSharedWithId(id.join(',').toString());

        setSharedWithName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const usersList =  async () => {
        const Response = await getAllUsers()
        setUsers(Response);
    }

    const invoiceList = async () => {
        const response = await getInvoice()
        setInvoices(response)
        console.log('getInvoice342342343', response)
    }

    const selectedBroker = async (val:any) => {
        formik.setFieldValue('select_brokers', val);
        setBrokers(val);
    }

    useEffect(() => {
        // projectList();
        // invoiceList();
        // contactsList();
        // usersList();
        // expenseList();
        incentivesId && proformaIncentiveById(incentivesId);
    }, [incentivesId]);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'edit_incentive'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_Incentive_details_close'
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('invoice_number')}>
                                            <option value=''>Select</option>
                                                {dropdowns.invoice?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.developer_name ?? "--No Name--"}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_incentive'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('total_incentive')} className="form-control" placeholder="Total Incentive..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'payable_incentive'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('incentive_payable')} className="form-control" placeholder="Payable Incentive..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'paid_amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('paid_amount')} className="form-control" placeholder="Paid Amount..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive_due'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('incentive_due')} className="form-control" placeholder="Incentive Due..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'description'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('description')} className="form-control" placeholder="description..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokers'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='autocomplete_field w-100'>
                                                <ReactSelect
                                                isMulti
                                                options={dropdowns.users}
                                                closeMenuOnSelect={false}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.user_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.users?.filter((item:any) => brokers?.indexOf(item) !== -1)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    selectedBroker(val);
                                                }}
                                                placeholder={"Brokers.."}
                                                />                                      
                                            </div>
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

export {IncentiveEditForm}