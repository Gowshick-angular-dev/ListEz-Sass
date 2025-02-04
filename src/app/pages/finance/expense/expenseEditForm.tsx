import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getCity, getExpenseType, getLeadSource, getSource, getUnitType } from '../../settings/masters/core/_requests';
import { getContacts,} from '../../task/core/_requests';
import {getProjects,getProperties} from '../../property/core/_requests'
import { getExpense, updateExpense, updateExpensesDetails } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { getTeamsList } from '../../settings/userManagement/core/_requests';
import Moment from 'moment';
import { Toast } from 'bootstrap';
import { getTrnsactions } from '../../transaction/core/_requests';
import { useIntl } from 'react-intl';

const initialValues = {
    transaction_id: '',
    expense_type: '',
    expense_date: '',
    add_amount: '',
    billable: '',
    receipt_name: '',
    receipt_original_name: '',
    notes: '',
    created_by: '',
    expense_id: '',
    client: '',
    amount: '',
    city_id: '',
    tl_id: '',
    builder_id: '',
    project_id: '',
    month: '',
    date: '',
    campaign_name: '',
    campaign_source_id: '',
    cost_of_campaign: '',
    total_value: '',
    gst_value: '',
}

const ITEM_HEIGHT = 50;
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
    expenseId:any,
    dropdowns:any,
}

const ExpenseEditForm: FC<props> = (props) => {

    const {expenseId, dropdowns} = props
    const intl = useIntl();
    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),       
    })

    const [loading, setLoading] = useState(false);    
    const [isLoading, setisLoading] = useState(false);    
    const [leadSource, setLeadSource] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [unitType, setUnitType] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [expenseType, setExpenseType] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [teamLeader, setTeams] = useState<any[]>([]);
    const [source, setSource] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState(null);
    const [tabInfo, info] = useState<string>('basicDetails');
    const [expenseDetails, setExpenseDetails] = useState<{[key: string]: any}>({});
    const {currentUser, logout} = useAuth();

    const theme = useTheme(); 

    const expense = async () => {
        setLoading(true);
        const response = await getExpense(expenseId)
        setExpenseDetails(response.output)

        formik2.setFieldValue('expense_type', response.output?.expense_type ?? '')
        formik2.setFieldValue('expense_date', Moment(response.output?.expense_date).format('YYYY-MM-DD') == "Invalid date" ? '' : Moment(response.output?.expense_date).format('YYYY-MM-DD'))
        formik2.setFieldValue('add_amount', parseInt(response.output?.add_amount) == 0 ? '' : parseInt(response.output?.add_amount))
        formik2.setFieldValue('billable', response.output?.billable ?? '')
        formik2.setFieldValue('transaction_id', response.output?.transaction_id ?? '')
        formik.setFieldValue('client', response.output?.client ?? '')
        formik.setFieldValue('amount', parseInt(response.output?.amount) == 0 ? '' : parseInt(response.output?.amount))
        formik.setFieldValue('tl_id', response.output?.TL_id ?? '')
        formik.setFieldValue('builder_id', response.output?.builder_id ?? '')
        formik.setFieldValue('project_id', response.output?.project_id ?? '')
        formik.setFieldValue('date', Moment(response.output?.date).format('YYYY-MM-DD') ?? '')
        formik.setFieldValue('cost_of_campaign', parseInt(response.output?.cost_of_campaign) == 0 ? '' : parseInt(response.output?.cost_of_campaign))
        formik.setFieldValue('total_value', parseInt(response.output?.total_value) == 0 ? '' : parseInt(response.output?.total_value))
        formik.setFieldValue('gst_value', parseInt(response.output?.gst_value) == 0 ? '' : parseInt(response.output?.gst_value))
        formik.setFieldValue('campaign_source_id', response.output?.campaign_source_id ?? '')
        formik.setFieldValue('campaign_name', response.output?.campaign_name ?? '')
        setLoading(false);
    }

    useEffect(() => {
        expenseId && expense();
    }, [expenseId])

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var body = {
                "client": values.client,
                "amount": values.amount,
                "city_id": values.city_id,
                "tl_id": values.tl_id,
                "builder_id": values.builder_id,
                "project_id": values.project_id,
                "date": values.date,
                "campaign_name": values.campaign_name,
                "campaign_source_id": values.campaign_source_id,
                "cost_of_campaign": values.cost_of_campaign,
                "total_value": values.total_value,
                "gst_value": values.gst_value 
                }
          
            const saveTaskData = await updateExpensesDetails(expenseId, body);
    
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_expense_details_close')?.click();
                document.getElementById('expenseReload')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formik2 = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var userId = currentUser?.id;
            var roleId = currentUser?.designation;
            
            var body = {
                "transaction_id": '',
                "expense_type":  values.expense_type,
                "expense_date":  values.expense_date,
                "add_amount":  values.add_amount,
                "billable": values.billable,
                "created_by": userId!
                }
          
            const saveTaskData = await updateExpense(expenseId, body);
    
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_expense_details_close')?.click();
                document.getElementById('expenseReload')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const LeadSourceList =  async () => {
        const LeadSourceResponse = await getLeadSource()        
        setLeadSource(LeadSourceResponse);
    }

    const UnitTypeList =  async () => {
        const UnitTypeResponse = await getUnitType()        
        setUnitType(UnitTypeResponse);
    }  
    
    const CityList =  async () => {
        const CityResponse = await getCity()
        setCity(CityResponse);
    }
    const ExpenseTypeList =  async () => {
        const ExpenseTypeResponse = await getExpenseType()
        setExpenseType(ExpenseTypeResponse);
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
        console.log('type');
        console.log(type);
      }

      const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }

    const teamsList =  async () => {
        var usersId = currentUser?.id;
        var roleId = currentUser?.designation;
        const Response = await getTeamsList(usersId, roleId)
        setTeams(Response);
    }

    const SourceList =  async () => {
        const SourceResponse = await getSource()
        setSource(SourceResponse);
    }

    const handleImagePreview = (e:any) => {
        let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
        let image_as_files:any = e.target.files[0];
      
        // setImagePreview(image_as_base64);
        setImageFile(image_as_files);
        setImagePreview(image_as_base64);
        setImgPre(true);
    }

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
    }

    useEffect(() => {
        // LeadSourceList();
        // projectList();
        // UnitTypeList();
        // CityList();
        // TransactionsList();
        // ExpenseTypeList();
        // contactsList();
        // teamsList();
        // SourceList();        
    }, []);

    return(<>
        {loading ? 
        <div className='w-100 h-100'>
            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                <div className="spinner-border taskloader" role="status">                                    
                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                </div>
            </div> 
        </div> : 
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_expense_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'edit_expense'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_expense_details_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_expense_body'>
            <div className="row">
                <div className="card-group">
                    <div className="col-12 mb-3">
                        <div className="card bs_1 name_card h-100 mx-2 position-relative">
                            <div className="card-body p-3">
                                <div className="d-flex">
                                    <a href={expenseDetails.receipt_name ? process.env.REACT_APP_API_BASE_URL+'uploads/expenses/receipt_name/'+expenseDetails.id+'/'+expenseDetails.receipt_name : ''} className="flex-shrink-0 position-relative" target="new">
                                        <img onError={e => {e.currentTarget.src = toAbsoluteUrl('/media/avatars/recipt.jpg') }} src={expenseDetails.receipt_name ? process.env.REACT_APP_API_BASE_URL+'uploads/expenses/receipt_name/'+expenseDetails.id+'/'+expenseDetails.receipt_name : ''} className="w-150px" alt='' />
                                    </a>                                    
                                    <div className="flex-grow-1 ms-9">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">                         
                                                <div className="mt-xxl-3">
                                                    <small className="mb-0">{intl.formatMessage({id: 'expense_type'})}</small>
                                                    <p className="mb-0">{expenseDetails.expense_type_name}</p>
                                                </div>                                                
                                            </div>
                                            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">                                   
                                                <div className="mt-xxl-3">
                                                    <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                    <p className="mb-0">{expenseDetails.created_name}</p>
                                                </div>                                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                            <ul className="nav nav-pills border-0 position-absolute bottom-0 end-0 pe-2" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="basicDetails-tab" data-bs-toggle="pill" data-bs-target={"#basicDetails"} type="button" role="tab" aria-controls={"basicDetails"} aria-selected="true">{intl.formatMessage({id: 'bassic_details'})}</button>
                                </li>                                                                        
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="personalDetails-tab" data-bs-toggle="pill" data-bs-target={"#personalDetails"} type="button" role="tab" aria-controls={"personalDetails"} aria-selected="false">{intl.formatMessage({id: 'expense'})}</button>
                                </li>
                            </ul>
                        </div>
                    </div>                    
                </div>
            </div>
            <div className="user_manage_page bg_white br_10 bs_1">
                <div className="row mt-4">
                    <div className="col-12">                        
                        <div className="tab-content pt-5" id="pills-tabContent">
                            <div className="tab-pane fade show active" id={"basicDetails"} role="tabpanel" aria-labelledby="basicDetails-tab">
                                <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                    <form noValidate className='p-5' onSubmit={formik.handleSubmit}>
                                        <div className='row'>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik.getFieldProps('client')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.client_name?.map((task:any,i:any) =>{
                                                            return (
                                                            <option value={task.id} key={i}>{task.contact_name ?? '--No Name--'}</option> 
                                                        )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'team_leader'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik.getFieldProps('tl_id')}>
                                                        <option disabled value="">Select</option>
                                                        {dropdowns.team_leader?.map((team:any,i:any)=> {
                                                            return (
                                                            <option value={team.id} key={i}>{team.first_name ?? '--No Name--'}</option>
                                                            )
                                                            })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'builder_name'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="text" {...formik.getFieldProps('builder_id')} className="form-control" placeholder="Builder Name..."/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik.getFieldProps('project_id')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.project?.map((task:any,i:any) =>{
                                                            return (
                                                            <option value={task.property_id} key={i}>{task.name_of_building ?? '--No Name--'}</option>
                                                        )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'campaign_source'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-control w-100" {...formik.getFieldProps('campaign_source_id')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.source?.map((task:any,i:any) =>{
                                                            return (
                                                            <option value={task.id} key={i}>{task.option_value}</option> 
                                                        )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'campaign_name'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="text" {...formik.getFieldProps('campaign_name')} className="form-control" placeholder="Campaign..."/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'cost_of_campaign'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min="0" {...formik.getFieldProps('cost_of_campaign')} className="form-control" placeholder="Cost of Campaign"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min="0" {...formik.getFieldProps('amount')} className="form-control" placeholder="Amount..."/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="date" {...formik.getFieldProps('date')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_value'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min="0" {...formik.getFieldProps('total_value')} className="form-control" placeholder="Total value..."/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">GST {intl.formatMessage({id: 'value'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min="0" {...formik.getFieldProps('gst_value')} className="form-control" placeholder="GST value..."/> 
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <button
                                                type='submit'
                                                id='kt_sign_up_submit1'
                                                className='btn btn_primary text-primary'
                                                disabled={formik.isSubmitting}
                                            >
                                                {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                    <KTSVG
                                                        path='/media/custom/save_white.svg'
                                                        className='svg-icon-3 svg-icon-primary ms-2' />
                                                </span>}
                                                {isLoading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="tab-pane fade" id={"personalDetails"} role="tabpanel" aria-labelledby="personalDetails-tab">
                                <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                    <form noValidate className='p-5' onSubmit={formik2.handleSubmit}>
                                        <div className='row'>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik2.getFieldProps('transaction_id')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.transaction?.map((trans:any,i:any) =>{
                                                            return (
                                                            <option value={trans.id} key={i}>{trans.contact_name ?? '--No Name--'}</option>
                                                        )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'expense_type'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik2.getFieldProps('expense_type')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.expense_type?.map((exp:any,i:any) =>{
                                                            return (
                                                            <option value={exp.id} key={i}>{exp.option_value}</option> 
                                                        )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'expense_date'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="date" {...formik2.getFieldProps('expense_date')} className="form-control" placeholder="date"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'add_amount'})}</label>
                                                <div className="input-group mb-3">
                                                    <input type="number" min="0" {...formik2.getFieldProps('add_amount')} className="form-control" placeholder="Amount..."/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'billable'})}</label>
                                                <div className="input-group mb-3">
                                                    <select className="form-select w-100" {...formik2.getFieldProps('billable')}>
                                                        <option value="">select</option>
                                                        <option value="1">Yes</option>
                                                        <option value="2">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                            </div>
                                            <div className='text-center'>
                                                <button
                                                    type='submit'
                                                    id='kt_sign_up_submit2'
                                                    className='btn btn_primary text-primary'
                                                    disabled={formik2.isSubmitting}
                                                >
                                                    {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                        <KTSVG
                                                            path='/media/custom/save_white.svg'
                                                            className='svg-icon-3 svg-icon-primary ms-2' />
                                                    </span>}
                                                    {isLoading && (
                                                        <span className='indicator-progress' style={{ display: 'block' }}>
                                                            {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>                                      
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>}        
    </>)
}

export {ExpenseEditForm}