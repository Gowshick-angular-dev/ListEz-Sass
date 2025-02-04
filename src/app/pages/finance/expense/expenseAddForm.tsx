import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getCity, getExpenseType, getLeadSource, getSource, getUnitType } from '../../settings/masters/core/_requests';
import { getContacts,} from '../../task/core/_requests';
import { saveExpenses } from '../core/_requests';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { getTeamsList } from '../../settings/userManagement/core/_requests';
import { Toast } from 'bootstrap';
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";
import { getTrnsaction } from '../../transaction/core/_requests';

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
    note: '',
    date: '',
    campaign_name: '',
    campaign_source_id: '',
    cost_of_campaign: '',
    total_value: '',
    gst_value: '',
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

const ExpenseForm: FC<props> = (props) => {

    const{ transId, dropdowns } = props
    const intl = useIntl();
    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),
       
    })

    const [loading, setLoading] = useState(false);
    const [assignToName, setAssignToName] = React.useState<string[]>([]);
    const [assignToId, setAssignToId] = React.useState<string[]>([]);
    const [taskType, setTaskType] = useState<any[]>([]);    
    const [leadSource, setLeadSource] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [unitType, setUnitType] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [expenseType, setExpenseType] = useState<any[]>([]);
    const [contacts, setContactsLead] = useState<any[]>([]);
    const [teamLeader, setTeams] = useState<any[]>([]);
    const [developer, setDeveloper] = useState<any[]>([]);
    const [source, setSource] = useState<any[]>([]);
    const [client, setClient] = useState<any>('');
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState(null);
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

            var formData = new FormData();

            formData.append('transaction_id', values.transaction_id);
            formData.append('expense_type', values.expense_type);
            formData.append('expense_date', values.expense_date);
            formData.append('add_amount', values.add_amount);
            formData.append('billable', values.billable);
            formData.append('notes', values.notes);
            formData.append('client', values.client);
            formData.append('amount', values.amount);
            formData.append('city_id', values.city_id);
            formData.append('tl_id', values.tl_id);
            formData.append('builder_id', values.builder_id);
            formData.append('project_id', values.project_id);
            formData.append('month', values.month);
            formData.append('note', values.note);
            formData.append('date', values.date);
            formData.append('campaign_name', values.campaign_name);
            formData.append('campaign_source_id', values.campaign_source_id);
            formData.append('cost_of_campaign', values.cost_of_campaign);
            formData.append('total_value', values.total_value);
            formData.append('gst_value', values.gst_value);
            formData.append('created_by', userId!.toString());
            formData.append('receipt_name', imageFile!);
          
            const saveTaskData = await saveExpenses(formData);
    
            console.log('saveTaskData');
            console.log(saveTaskData);
            // document.getElementById('kt_contact')?.classList.remove('drawer-on');
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_expense_form_close')?.click();
                document.getElementById('expenseReload')?.click();
                var toastEl = document.getElementById('myToastExpenseAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                imgRemove(); 
                formik.setFieldValue('client', '');               
                resetForm();
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

      const contactDropSelect = (val:any) => {
        formik.setFieldValue('client', val.id ?? '');
        setClient(val.id);
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
      
        setImageFile(image_as_files);
        setImagePreview(image_as_base64);
        setImgPre(true);
    }

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
    }

    const transactionDetail =  async (id:any) => {
        formik.setFieldValue('transaction_id', id);
        const Response = await getTrnsaction(id)
        dropdowns.client_name?.find((item:any) => Response.output?.project_name == item.id?.toString())
        formik.setFieldValue('project_id', Response.output?.project_name ?? '');
    }

    useEffect(() => {
        transId && transactionDetail(transId)
    }, [transId])

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_expense_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_expense'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_expense_form_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_expense_body'>
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
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('transaction_id')} onChange={(e) => transactionDetail(e.target.value)}>
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
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('expense_type')}>
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
                                            <input type="date" {...formik.getFieldProps('expense_date')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('add_amount')} className="form-control" placeholder="Amount..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'billable'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('billable')}>
                                                <option value="">select</option>
                                                <option value="1">Yes</option>
                                                <option value="2">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'receipt'})}</label>
                                        <div className='d-flex'>
                                        <span className="btn btn-file">
                                            <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload'})} <input type="file"
                                                onChange={handleImagePreview}
                                                name={'profile_image'} />                                                
                                        </span>
                                        {imgPre &&
                                        <><div className='position-relative'><img src={imagePreview} alt="image preview" height={100} width={100} />
                                        <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></div></>}
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='autocomplete_field w-100'>
                                                <ReactSelect
                                                options={dropdowns.client_name}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.contact_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.client_name?.find((item:any) => client == item.id?.toString())}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    contactDropSelect(val);
                                                }}
                                                placeholder={"client.."}
                                                />                                      
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'team_leader_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('tl_id')}>
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
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('project_id')}>
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
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('campaign_source_id')}>
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
                                            <input type="number" {...formik.getFieldProps('cost_of_campaign')} className="form-control" placeholder="Cost of Campaign"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" {...formik.getFieldProps('amount')} className="form-control" placeholder="Amount..."/> 
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
                                            <input type="number" {...formik.getFieldProps('total_value')} className="form-control" placeholder="Total value..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst_value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" {...formik.getFieldProps('gst_value')} className="form-control" placeholder="GST value..."/> 
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

export {ExpenseForm}