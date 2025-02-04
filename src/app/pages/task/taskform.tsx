import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { getTaskDropdowns, saveTask } from './core/_requests'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useIntl } from 'react-intl'
import moment from 'moment';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
    task_type: "",
    task_time: "",
    finish_time: "",  
    project: "",
    contact: "",
    reminder: "",
    task_status: "156",
    priority: "146",
    agenda: "",
    assign_to: "",
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

type Props = {
    setTasks?: any,
    contact?: any,
}

const TaskForm:  FC<Props> = (props) => {

    const { setTasks, contact } = props
    const theme = useTheme(); 
    const intl = useIntl();

    const taskSaveSchema = Yup.object().shape({
        task_type: Yup.string().required('Task type is required'),
        task_time: Yup.string().required('start time is required'),
        finish_time: Yup.string(),
        agenda: Yup.string().required('Task Description is required'),
        project: Yup.string(),
        reminder: Yup.string(),
        status: Yup.string(),
        priority: Yup.string(),
        contact: Yup.string(),
        assign_to: Yup.array(),
    })

    const [loading, setLoading] = useState(false);
    const [taskTime, setTaskTime] = useState<any>('');
    const [finishTime, setTaskFinishTime] = useState<any>('');
    const [assignToName, setAssignToName] = useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<any[]>([]);
    const [contactList, setContactList] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState<any>({});
    const [contactData, setContactData] = useState<any>({});
    const [contactId, setContactId] = useState<any>('');
    const [propertyId, setPropertyId] = useState<any>('');
    const {currentUser, logout} = useAuth();
    
    useEffect(() => {
        dropdownsTask();        
    }, []);

    useEffect(() => {
        if(contact?.id) {
          setContactData(contact);
          setContactId(contact.id);
          formik.setFieldValue('contact', contact.id == 0 ? '' : contact.id);
          setPropertyId(contact.property_id);
          formik.setFieldValue('project', contact.property_id == 0 ? '' : contact.property_id);
          setAssignToId(dropdowns?.assign_to?.filter((item:any) => contact.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));
        //   setAssignToName(contact.assign_to_name?.split(',') ?? []);
          console.log("qpeirhfghwjebr", contact);
        }
      },[contact]);

      const contactDropSelect = (id:any, type:any) => {
        formik.setFieldValue('contact', id ?? '');
        setContactId(id);
      }

      const propertyDropSelect = (id:any, type:any) => {
        formik.setFieldValue('project', id ?? '');
        setPropertyId(id);
      }

    const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {            
            var body = {
                    "task_type": values.task_type,
                    "task_time": moment(taskTime).format('YYYY-MM-DD hh:mm a'),
                    "finish_time": moment(finishTime).format('YYYY-MM-DD hh:mm a') == "Invalid date" ? "" : moment(finishTime).format('YYYY-MM-DD hh:mm a'),
                    "project": values.project,
                    "contact": values.contact,
                    "agenda": values.agenda,
                    "reminder": values.reminder,
                    "task_status": values.task_status,
                    "priority": values.priority,
                    "assign_to": assignToId?.map((item:any) => item.id)?.join(',').toString(),
                }

            const saveTaskData = await saveTask(body);
    
            if(saveTaskData.status == 200){
                // setTasks(saveTaskData.output);
                document.getElementById('kt_task_close')?.click();
                document.getElementById('task_reload')?.click();
                if(contact) {
                    document.getElementById('ewioyruihrenroiwehrjnuiqh2wkemqd')?.click();
                }
                setLoading(false);
                resetForm();
                setPropertyId('');
                setContactId('');
                setAssignToName([]);
                setAssignToId([]);
                setTaskTime('');
                setTaskFinishTime('');                
                var toastEl = document.getElementById('taskAddToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();                
            }    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
            var toastEl = document.getElementById('taskErrToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show(); 
          }
    }})

    const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }

    const dropdownsTask = async () => {
        const response = await getTaskDropdowns()
        setDropdowns(response.output);
        const data = response.output?.contact;
    
        let contact:any[] = [];
        for(let key in data) {
            let body = {
                id: data[key].id,
                name: data[key].first_name+ ' '+data[key].last_name
            }
            contact.push(body);
        }
        setContactList(contact);
    }
    
    return(
        
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_task_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_task'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_task_close'
                    onClick={() => formik.resetForm()}
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>
            <div className='card-body position-relative' id='kt_task_body'>
            <form noValidate onSubmit={formik.handleSubmit} >
                <div className="accordion" id="accordionExample"> 
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'task_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_type'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('task_type')}>
                                            <option value=''>Select</option>
                                                {dropdowns.task_type?.map((task:any,i:any) =>{
                                                
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                        {formik.touched.task_type && formik.errors.task_type && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.task_type}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3 date_time_white">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_date'})}</label>
                                        <LocalizationProvider className="w-100" dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                            renderInput={(props) => {
                                                delete props.inputProps?.value
                                                return(<TextField {...formik.getFieldProps('task_time')} className='w-100' {...props} />)} }
                                            value={taskTime}
                                            onChange={(newValue) => {
                                                setTaskTime(newValue);
                                                formik.setFieldValue('task_time', newValue ?? '');
                                            }}
                                            />
                                        </LocalizationProvider>
                                        {formik.touched.task_time && formik.errors.task_time && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.task_time}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3 date_time_white">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_date'})}</label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                        renderInput={(props) => {
                                                delete props.inputProps?.value
                                                return(
                                                    <TextField {...formik.getFieldProps('finish_time')} className='w-100' {...props} />)} }
                                            value={finishTime}
                                            onChange={(newValue) => {
                                                setTaskFinishTime(newValue);
                                                formik.setFieldValue('finish_time', newValue ?? '');
                                            }}
                                            />
                                        </LocalizationProvider>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_person'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='autocomplete_field w-100'>
                                                {/* <ReactSearchAutocomplete
                                                    items={contactList}
                                                    {...formik.getFieldProps('contact')}
                                                    onSelect={(val:any) => formik.setFieldValue('contact', val.id ?? '')}
                                                    placeholder="choose contact"
                                                    styling={mystyle}
                                                    autoFocus
                                                    formatResult={formatResult}
                                                /> */}
                                                <ReactSelect
                                                options={contactList}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.name}
                                                getOptionValue={(option:any) => option.id}
                                                value={contactList?.find((item:any) => contactId == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    contactDropSelect(val.id, val.name);
                                                }}
                                                placeholder={"contact.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('project')}>
                                            <option value=''>Select</option>
                                            {dropdowns.project?.map((taskProject:any,i:any) =>{
                                                if(taskProject.name_of_building) {
                                                    return (
                                                        <option value={taskProject.id} key={i}>{taskProject.name_of_building}</option> 
                                                    )}})}
                                            </select>      
                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='autocomplete_field w-100'>
                                                {/* <ReactSearchAutocomplete
                                                    items={contactList}
                                                    {...formik.getFieldProps('contact')}
                                                    onSelect={(val:any) => formik.setFieldValue('contact', val.id ?? '')}
                                                    placeholder="choose contact"
                                                    styling={mystyle}
                                                    autoFocus
                                                    formatResult={formatResult}
                                                /> */}
                                                <ReactSelect
                                                options={dropdowns.project}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.project?.find((item:any) => propertyId == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => propertyDropSelect(val.id, val.name_of_building)}
                                                placeholder={"Project.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'reminder'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('reminder')}>
                                            <option value=''>Select</option>
                                                {dropdowns.reminder?.map((task:any,i:any) =>{
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'priority'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('priority')}>
                                            <option value=''>Select</option>
                                                {dropdowns.priority?.map((task:any,i:any) =>{
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                        {formik.touched.priority && formik.errors.priority && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.priority}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('task_status')}>
                                            <option value=''>Select</option>
                                                {dropdowns.task_status?.map((task:any,i:any) =>{
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>                                    
                                        {/* <FormControl sx={{ m: 0, width: 300, mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={assignToName}
                                                onChange={(e) => {
                                                    const {
                                                        target: { value },
                                                      } = e;
                                              
                                                      var name = [];
                                                      var id = [];
                                                  
                                                      for(let i = 0; i < value.length; i++){
                                                        var fields = value[i].split('-');
                                                  
                                                        var n = fields[0];
                                                        var d = fields[1];
                                                  
                                                        name.push(n);
                                                        id.push(d);
                                                      }
                                                  
                                                      setAssignToId(id);                                              
                                                      setAssignToName(
                                                        typeof value === 'string' ? value.split(',') : value,
                                                      );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'assign_to'})}</p>;
                                                    }
                                                    return(
                                                        <ul className='m-0'>
                                                          {name?.map((data, i) => {
                                                            return(
                                                              <li key={i}>{data}</li>
                                                            )
                                                          })}                                          
                                                        </ul>
                                                    )
                                                }}
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                                </MenuItem>
                                                {dropdowns.assign_to?.map((assignVal:any) => (
                                                    <MenuItem
                                                    key={assignVal.id}
                                                    value={assignVal.first_name+' '+assignVal.last_name+'-'+assignVal.id}
                                                    style={getStyles(assignVal.first_name+' '+assignVal.last_name, assignToName, theme)}
                                                    >
                                                    {assignVal.first_name ?? '--No Name--'}{' '}{assignVal.last_name ?? ''}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl> */}
                                        <div className="input-group mb-3">
                                            <ReactSelect
                                            isMulti
                                            options={dropdowns.assign_to}
                                            closeMenuOnSelect={false}
                                            components={makeAnimated()}
                                            getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                            getOptionValue={(option:any) => option.id}
                                            value={dropdowns.assign_to?.filter((item:any) => assignToId.indexOf(item) !== -1)}
                                            classNamePrefix="border-0 "
                                            className={"w-100 "}
                                            onChange={(val:any) => {  
                                                setAssignToId(val);                                              
                                            }}
                                            placeholder={"Assign-to.."}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_description'})}</label>
                                        <div className='input-group mb-3'>
                                            <textarea
                                            className='form-control border-0 p-2 resize-none min-h-25px br_10' {...formik.getFieldProps('agenda')}
                                            data-kt-autosize='true'
                                            rows={8}
                                            placeholder='Enter your Notes' />
                                        </div>
                                        {formik.touched.agenda && formik.errors.agenda && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.agenda}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                                      
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-5 text-center' id='kt_task_footer'>
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

export {TaskForm}
