import React,{FC, useEffect, useState} from 'react'
import Moment from 'moment';
import * as Yup from 'yup'
import { Theme, useTheme } from '@mui/material/styles';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { Toast } from 'bootstrap';
import { getContacts, } from '../../task/core/_requests';
import {getProjects,getProperties} from '../../property/core/_requests'
import { useAuth } from '../../../modules/auth';
import { useFormik } from 'formik';
import { getExpenses, getFeeConfirmations, getProformaInvoiceById, updateProformaInvoice } from '../core/_requests';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getTrnsactions } from '../../transaction/core/_requests';
import { getDeveloperNameList } from '../../contact/core/_requests';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";
import { SplitButton } from 'react-bootstrap';

const initialValues = {
    transaction_id: '',
    date: '',
    fee_confirmation_id: '',
    contact_name: '',
    developer_name: '',
    project_name: '',
    due_date: '',
    expense_id: '',
    tax: '',
    total_amount: '',
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
    proformaInvoiceId:any,
    dropdowns:any,
}

const ProformaInvoiceEdit: FC<props> = (props) => {
    const intl = useIntl();
    const {proformaInvoiceId, dropdowns} = props

    const theme = useTheme();

    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const {currentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [expnse, setExpnse] = useState<any[]>([]);
    const [feeConfirmations, setFeeConfirmations] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [developerNameList, setDeveloperNameList] = useState<any[]>([]);
    const [expenseId, setExpenseId] = useState<any>('');
    const [expenseName, setExpenseName] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [proformaInvoiceDetails, setProformaInvoiceDetails] = useState<{[key: string]: any}>({});

    const proformaInvoiceById = async () => {
        const response = await getProformaInvoiceById(proformaInvoiceId)
        setProformaInvoiceDetails(response.output[0])
        formik.setFieldValue('contact_name', response.output[0].contact_name ?? '')
        formik.setFieldValue('developer_name', response.output[0].developer_name ?? '')   
        formik.setFieldValue('project_name', response.output[0].project_name ?? '')
        formik.setFieldValue('Brokerage_value', response.output[0].Brokerage_value ?? '')
        formik.setFieldValue('due_date',Moment(response.output[0].due_date).format('YYYY-MM-DD') ?? '')
        formik.setFieldValue('expense_id', response.output[0].expense_id ?? '')
        formik.setFieldValue('tax', parseInt(response.output[0].tax ?? 0) == 0 ? '' : parseInt(response.output[0].tax))
        formik.setFieldValue('total_amount', parseInt(response.output[0].total_amount ?? 0) == 0 ? '' : parseInt(response.output[0].total_amount))
        formik.setFieldValue('transaction_id', response.output[0].transaction_id ?? '')
        formik.setFieldValue('fee_confirmation_id', response.output[0].fee_confirmation_id ?? '')
        formik.setFieldValue('date', Moment(response.output[0].date).format('YYYY-MM-DD') ?? '')
        setExpenses(dropdowns.expense_type?.filter((item:any) => response.output[0].expense_id?.split(',')?.indexOf(item.id?.toString()) !== -1))

        var expenseArray = [];
        var expenseNameArray = [];
        if(response.expense_id != null){
            expenseArray = response.expense_id.split(",").map((e:any) => {
                return parseInt(e);
            });
        }
        if(response.expense_drop_name != null){
            expenseNameArray = response.expense_drop_name.split(",").map((e:any) => {
                return e;
            });
        }
        setExpenseId(expenseArray.join(',').toString());
        setExpenseName(expenseNameArray);
    }

    const expenseList = async () => {
        const response = await getExpenses()
        setExpnse(response)
        console.log('expenseList', response)
    }

    const projectList =  async () => {
        var userId = currentUser?.id;
        var roleId = currentUser?.designation;
        const projectResponse = await getProperties(userId);
        setProjects(projectResponse);
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
        formik.setFieldValue('contact_name', id ?? '');
      }

      const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var userId = currentUser?.id;

            var body ={
                "transaction_id": values.transaction_id,
                "date": values.date,
                "fee_confirmation_id": values.fee_confirmation_id,
                "contact_name": values.contact_name,
                "developer_name": values.developer_name,
                "project_name": values.project_name,
                "due_date": values.due_date,
                "expense_id": expenses.map((item:any) => item.id)?.join(','),
                "tax": values.tax,
                "total_amount": values.total_amount,
                "created_by": userId
                }
          
            const saveTaskData = await updateProformaInvoice(proformaInvoiceId, body);
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_proInvoice_details_close')?.click();
                document.getElementById('proformaInvoiceReload')?.click();
                var toastEl = document.getElementById('myToastProformaInvoiceUpdate ');
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

    const expensesChange = (event: SelectChangeEvent<typeof expenseName>) => {
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
    
        setExpenseId(id.join(',').toString());    
        setExpenseName(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const feeConfirmationList = async () => {
        const response = await getFeeConfirmations()
        setFeeConfirmations(response)        
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
        // TransactionsList();
        // feeConfirmationList();
        // contactsList(); 
        proformaInvoiceId && proformaInvoiceById();
        // expenseList();
    }, [proformaInvoiceId]);

    return(
        <>
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proformaInvoice_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'edit_proforma_invoice'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_proInvoice_details_close'>
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_proformaInvoice_body'>
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
                                            <select className="form-control w-100" {...formik.getFieldProps('transaction_id')}>
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
                                            <select className="form-control w-100" {...formik.getFieldProps('fee_confirmation_id')}>
                                            <option value=''>Select</option>
                                                {dropdowns.fee_confirmation?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.developer_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('date')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('contact_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.client_name?.map((task:any,i:any) => {
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
                                                {dropdowns.developer_name?.map((task:any,i:any) => {
                                                    if(task.developer_name) {
                                                    return (
                                                    <option value={task.developer_name} key={i}>{task.developer_name}</option>
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
        </>
    )

}

export {ProformaInvoiceEdit}