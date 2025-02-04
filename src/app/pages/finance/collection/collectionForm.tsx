import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getContacts, getProjects } from '../../task/core/_requests';
import { getExpenses, getFeeConfirmations, getInvoice, saveCollection } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Toast } from 'bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getFinanceInvoiceStatus } from '../../settings/masters/core/_requests';
import { getTrnsactions } from '../../transaction/core/_requests';
import { useIntl } from 'react-intl';

const initialValues = {
    transaction_id: '',
    fee_confirmation_id: '',
    invoice_number: '',
    invoice_date: '',
    total_invoiced_value: '',
    total_collection_value: '',
    total_due_value: '',
    bad_debts: '',
    notes: '',
    status: '',
    created_by: ''
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
    transId?:any,
    dropdowns?:any,
    }

const CollectionForm: FC<props> = (props) => {
    const intl = useIntl();
    const{ transId, dropdowns } = props

    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [financeCollectionStatus, setFinanceCollectionStatus] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [expnse, setExpnse] = useState<any[]>([]);
    const [feeConfirmations, setFeeConfirmations] = useState<any[]>([]);
    const [expenseId, setExpenseId] = useState<any>('');
    const [expenseName, setExpenseName] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [contactId, setContactId] = useState<any>('');
    const {currentUser, logout} = useAuth();

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
                "transaction_id": values.transaction_id,
                "fee_confirmation_id": values.fee_confirmation_id,
                "invoice_number": values.invoice_number,
                "invoice_date": values.invoice_date,
                "total_invoiced_value": values.total_invoiced_value,
                "total_collection_value": values.total_collection_value,
                "total_due_value": values.total_due_value,
                "bad_debts": values.bad_debts,
                "notes": values.notes,
                "collection_status": values.status
                }
          
            const saveTaskData = await saveCollection(body);
    
            console.log('saveTaskData');
            console.log(saveTaskData);
            // document.getElementById('kt_contact')?.classList.remove('drawer-on');
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_Collections_form_close')?.click();
                document.getElementById('collectionReload')?.click();
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

    const FinanceInvoiceStatusList =  async () => {
        const FinanceCollectionStatusResponse = await getFinanceInvoiceStatus()
        setFinanceCollectionStatus(FinanceCollectionStatusResponse);
    }

    const expensesChange = (event: SelectChangeEvent<typeof expenseName>) => {
        const {
          target: { value },
        } = event;
    
        console.log('assign event');
        console.log(value);
    
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
    
        setExpenseId(id.join(',').toString());
    
        setExpenseName(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const feeConfirmationList = async () => {
        const response = await getFeeConfirmations()
        setFeeConfirmations(response)        
    }

    const invoiceList = async () => {
        const response = await getInvoice()
        setInvoices(response)
        console.log('getInvoice342342343', response)
    }

    useEffect(() => {
        // projectList();
        // invoiceList();
        // TransactionsList();
        // feeConfirmationList();
        // contactsList();
        // expenseList();
        // FinanceInvoiceStatusList();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_collection'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_Collections_form_close'
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
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('transaction_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.transaction?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.contact_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fee_confirmation'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('fee_confirmation_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.fee_confirmation?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.developer_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('invoice_number')}>
                                            <option value=''>Select</option>
                                                {dropdowns.invoices.map((trans,i) =>{
                                                    return (<>
                                                    {trans.id != null &&
                                                    <option value={trans.id} key={i}>{trans.developer_name}</option>} </>
                                                )})}
                                            </select>
                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_number'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('invoice_number')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('invoice_date')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_invoiced_value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" {...formik.getFieldProps('total_invoiced_value')} className="form-control" placeholder="Invoice..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_collection_value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('total_collection_value')} className="form-control" placeholder="Collection..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_due_value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('total_due_value')} className="form-control" placeholder="Due..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bad_debits'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('bad_debts')} className="form-control" placeholder="Bad Debits..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'notes'})}</label>
                                        <div className="input-group mb-3">
                                            <textarea {...formik.getFieldProps('notes')} className="form-control" placeholder="description..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('status')}>
                                            <option value=''>Select</option>
                                                {dropdowns.collection_status?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
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

export {CollectionForm}