import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getContacts, } from '../../task/core/_requests';
import {getProjects,getProperties} from '../../property/core/_requests'
import { getExpenses, getFeeConfirmations, saveInvoice } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Toast } from 'bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getFinanceInvoiceStatus } from '../../settings/masters/core/_requests';
import { getTrnsaction, getTrnsactions } from '../../transaction/core/_requests';
import { getDeveloperNameList } from '../../contact/core/_requests';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";

const initialValues = {
    "transaction_id": '',
    "fee_confirmation_id": '',
    "brokerage_value": '',
    "contact_name": '',
    "developer_name": '',
    "project_name": '',
    "due_date": '',
    "description": '',
    "status": '',
    "tax": '',
    "expense_id": '',
    "total_amount": '',
    "created_by": ''
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

const InvoiceForm: FC<props> = (props) => {
    const intl = useIntl();
    const{ transId, dropdowns } = props

    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [financeInvoiceStatus, setFinanceInvoiceStatus] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [expnse, setExpnse] = useState<any[]>([]);
    const [expenseId, setExpenseId] = useState<any>('');
    const [expenseName, setExpenseName] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [feeConfirmations, setFeeConfirmations] = useState<any[]>([]);
    const [developerNameList, setDeveloperNameList] = useState<any[]>([]);
    const [trnsaction, setTrnsaction] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [contactId, setContactId] = useState<any>('');
    const {currentUser, logout} = useAuth();

    const theme = useTheme(); 

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            let body = {
                "transaction_id": transId ? transId : values.transaction_id,
                "fee_confirmation_id": values.fee_confirmation_id,
                "pro_invoice_id": 1,
                "contact_name": values.contact_name,
                "developer_name": values.developer_name,
                "project_name": values.project_name,
                "due_date": values.due_date,
                "expense_id": values.expense_id,
                "invoice_status": values.status,
                "tax": values.tax,
                "total_amount": values.total_amount
                }
          
            const saveTaskData = await saveInvoice(body);
    
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_Invoice_form_close')?.click();
                document.getElementById('invoiceReload')?.click();
                setExpenses([]);
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

    const transactionDetail =  async (id:any) => {
        formik.setFieldValue('transaction_id', id);
        const Response = await getTrnsaction(id)
        setTrnsaction(Response.output);

        formik.setFieldValue('contact_name', Response.output?.client_name ?? '');
        formik.setFieldValue('developer_name', Response.output?.developer_name ?? '');
        formik.setFieldValue('project_name', Response.output?.project_name ?? '');
    }

    useEffect(() => {
        transId && transactionDetail(transId)
    }, [transId])

    useEffect(() => {
        // projectList();
        // developerNames();
        // feeConfirmationList();
        // TransactionsList();
        // contactsList();
        // expenseList();
        // FinanceInvoiceStatusList();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_invoice'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_Invoice_form_close'
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
                                    {!transId &&
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="form-control w-100" {...formik.getFieldProps('transaction_id')} onChange={(e) => transactionDetail(e.target.value)}>
                                            <option value=''>Select</option>
                                                {dropdowns.transaction?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.contact_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fee_confirmation'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="form-control w-100" {...formik.getFieldProps('fee_confirmation_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.fee_confirmation?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.contact_id} key={i}>{trans.developer_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('contact_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.client_name?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.contact_name ?? '--No Name--'}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('developer_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.developer_name?.map((task:any,i:any) =>{
                                                    if(task.developer_name) {
                                                    return (
                                                    <option value={task.developer_name} key={i}>{task.developer_name ?? '--No Name--'}</option>
                                                )}})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('project_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.project?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.property_id} key={i}>{task.name_of_building ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'tax'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('tax')} className="form-control" placeholder="Tax..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'due_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" min="0" {...formik.getFieldProps('due_date')} className="form-control" placeholder="Due Date..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('total_amount')} className="form-control" placeholder="Total Amount..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('status')}>
                                            <option value=''>Select</option>
                                                {dropdowns.invoice_status?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'expenses'})}</label>
                                        {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={expenseName}
                                                onChange={expensesChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => {
                                                    var name = [];
                                                    var id = [];

                                                    for(let i = 0; i < selected.length; i++){
                                                    var fields = selected[i].split('-');

                                                    var n = fields[0];
                                                    var d = fields[1];

                                                    name.push(n);
                                                    id.push(d);
                                                    }

                                                    if (selected.length === 0) {
                                                        return <p>{intl.formatMessage({id: 'expenses'})}</p>;
                                                    }

                                                    return name.join(', ');
                                                }}
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'expenses'})}</em>
                                                </MenuItem>
                                                {expnse.map((exp) => (
                                                    <MenuItem
                                                    key={exp.id}
                                                    value={exp.expense_drop_name+'-'+exp.id}
                                                    style={getStyles(exp.expense_drop_name, expenseName, theme)}
                                                    >
                                                    {exp.expense_drop_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl> */}
                                        <div className="input-group mb-3">
                                            <div className='w-100'>
                                                <ReactSelect
                                                isMulti
                                                options={dropdowns.expense_type}
                                                components={makeAnimated()}
                                                closeMenuOnSelect={false}
                                                getOptionLabel={(option:any) => option.option_value}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.expense_type?.filter((item:any) => expenses.indexOf(item) !== -1)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setExpenses(val);
                                                    formik.setFieldValue('expense_id', val?.map((item:any) => item.id)?.join(','))
                                                }}
                                                placeholder={"expenses.."}
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

export {InvoiceForm}