import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast } from 'bootstrap';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAuth } from '../../modules/auth';
import Moment from 'moment';
import { getTaskDropdowns, getTaskFilters, getTasks, saveTaskFilter, taskFilterDelete } from './core/_requests';
import FormControl from '@mui/material/FormControl';
import { useIntl } from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
    task_type: '',
    project: '',
    created_date: '',
    assign_to: '',  
    filter_name: '',   
    priority: '',   
    task_status: '',   
    created_by: '',   
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

type Props = {
    setTasks?: any,
    setBody?: any,
    sortBy?: any,
    setTaskLength?: any,
}

const TaskFilter:  FC<Props> = (props) => {

    const {
        setTasks, setBody, sortBy, setTaskLength
    } = props        
    const intl = useIntl();
    const theme = useTheme(); 
    const {currentUser, logout} = useAuth();
    const [assignToId, setAssignToId] = useState<any[]>([]); 
    const [save, setSave] = useState(false); 
    const [assignToName, setAssignToName] = useState<any[]>([]);
    const [statusId, setStatusId] = useState<any[]>([]);
    const [taskFilters, setTaskFilters] = useState<any[]>([]); 
    const [filterDetail, setFilterDetail] = useState<any[]>([]);  
    const [dropdowns, setDropdowns] = useState<any>({});
    const [propertyId, setPropertyId] = useState<any>('');

    const taskFilterSchema = Yup.object().shape({
        task_type: Yup.string(),
        property: Yup.string(),
        created_date: Yup.string(),        
        filter_name: Yup.string(),        
        priority: Yup.string(),        
        status: Yup.string(),        
    })

    const taskFilterListDelete = async (data:any) => {
        const response = await taskFilterDelete(data.id);
        if(response.status == 200) {
            taskFiltersList();
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: taskFilterSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        try {
        const body = {
            "task_type" : values.task_type,
            "assign_to" : assignToId?.map((item:any) => item.id)?.join(',').toString(),
            "project": values.project,
            "priority": values.priority,
            "task_status": statusId?.map((item:any) => item.id)?.join(',').toString(),
            "created_date": values.created_date, 
            "created_by": values.created_by, 
            "filter_name": values.filter_name,
            "sort_by": sortBy.sort_by,
            "limit": 0
        } 

          if(save) {
            const filterLeadData = await saveTaskFilter(body);
                if(filterLeadData.status == 200) {
                    // setTaskFilters(filterLeadData.output)
                    resetForm();
                    setPropertyId('');
                    setAssignToName([])                    
                    setStatusId([])                    
                    setAssignToId([])
                    taskFiltersList(); 
                    formik.setFieldValue('filter_name', '')                   
                    var toastEl = document.getElementById('taskFilterSave');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(filterLeadData.status == 400) {
                    var toastEl = document.getElementById('taskFilterLimit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } 
            else {
                const filterPropertyData = await getTasks(body);
                if(filterPropertyData.status == 200) {
                    setBody(body)                    
                    document.getElementById('kt_task_filter_close')?.click();                   
                    document.getElementById('calender_reload')?.click();                   
                    document.getElementById('kanban_reload')?.click();                   
                    resetForm();
                    setPropertyId('');
                    setAssignToName([])                    
                    setStatusId([])                    
                    setAssignToId([])                    
                    setTasks(filterPropertyData.output);
                    setTaskLength(filterPropertyData.count);
                    var toastEl = document.getElementById('taskFilter');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        }
    }})

    const dropdownsTask = async () => {
        const response = await getTaskDropdowns()
        setDropdowns(response.output)
    }

    const taskFiltersList =  async () => { 
        const assignToResponse = await getTaskFilters();
        setTaskFilters(assignToResponse.output);
    }

    const filterTap =  async (data : any) => {          
        formik.setFieldValue('task_type', data.task_type != 0 ? data.task_type : '')
        formik.setFieldValue('priority', data.priority != 0 ? data.priority : '')
        formik.setFieldValue('created_by', data.created_by != 0 ? data.created_by : '')
        setPropertyId(data.project != 0 ? data.project : '')
        formik.setFieldValue('created_date', data.created_date != "0000-00-00" ? Moment(data.created_date).format("YYYY-MM-DD") : '')
        formik.setFieldValue('task_status', data.task_status != 0 ? data.task_status : '')
        setAssignToId(dropdowns.assign_to?.filter((item:any) => data.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));

        // var assignArray = [];
        // var assignNameArray = [];
        // if(data.assign_to != null){
        //     assignArray = data.assign_to.split(",").map((e:any) => {
        //         return e;
        //     });
        // }
        // if(data.assign_to_name != null){
        //     assignNameArray = data.assign_to_name.split(",").map((e:any) => {
        //         return e;
        //     });
        // }
        // setAssignToId(assignArray)
        // setAssignToName(assignNameArray)        
    }

    const resetFilter = async () => {
        const filterPropertyData = await getTasks({
            "task_type": '',
            "assign_to": '',
            "project": '',
            "reminder": '',
            "priority": '',
            "task_status": '',
            "created_date": '',
            "created_by": '',
            "filter_name": '',
            "sort_by": '',
            "limit": 0
        });
            if(filterPropertyData.status == 200) {
                setBody({
                    "task_type": '',
                    "assign_to": '',
                    "project": '',
                    "reminder": '',
                    "priority": '',
                    "task_status": '',
                    "created_date": '',
                    "created_by": '',
                    "filter_name": '',
                    "sort_by": '',
                    "limit": 0
                })
                setTaskLength(filterPropertyData.count);
                document.getElementById('kt_task_filter_close')?.click();                   
                formik.resetForm();
                setPropertyId('');
                setAssignToName([])                    
                setStatusId([])                    
                setAssignToId([])                    
                setTasks(filterPropertyData.output);
                document.getElementById('calender_reload')?.click();                   
                document.getElementById('kanban_reload')?.click();
                var toastEl = document.getElementById('taskFilterReset');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }        
    }

    useEffect(() => {  
        dropdownsTask();  
        taskFiltersList();  
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
                <div className='card-header w-100' id='kt_filter_header'>
                    <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'task_filter'})}</h3>
                    <div className='card-toolbar'>
                        <button
                        type='button'
                        className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                        id='kt_task_filter_close'
                        >
                            <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                        </button>
                    </div>
                </div>
                <div className='card-body position-relative' id='kt_filter_body'>
                <form noValidate onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'task_type'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="btn w-100 text-start form-select bg-gray-100 rounded" {...formik.getFieldProps('task_type')}>
                                    <option value="">Select</option>
                                    {dropdowns.task_type?.map((data:any,i:any) =>{
                                        return (
                                            <option value={data.id} key={i}>{data.option_value}</option> 
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'priority'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="btn w-100 text-start form-select bg-gray-100 rounded" {...formik.getFieldProps('priority')}>
                                    <option value="">Select</option>
                                    {dropdowns.priority?.map((data:any,i:any) =>{
                                        return (
                                            <option value={data.id} key={i}>{data.option_value}</option> 
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_by'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="btn w-100 text-start form-select bg-gray-100 rounded" {...formik.getFieldProps('created_by')}>
                                    <option value="">Select</option>
                                    {dropdowns.assign_to?.map((data:any,i:any) =>{
                                        return (
                                            <option value={data.id} key={i}>{data.first_name + ' '}{data.last_name ?? ''}</option> 
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_date'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="date" className="input-group btn w-100 text-start input_prepend bg-gray-100 rounded" placeholder="date" {...formik.getFieldProps('created_date')}/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                            {/* <select className="btn w-100 text-start form-select bg-gray-100 rounded" {...formik.getFieldProps('project')}>
                                <option value="">Select</option>
                                {dropdowns.project?.map((value:any,i:any)=> {
                                    if(value.id && value.name_of_building) {
                                  return (
                                    <option value={value.id} key={i}>{value.name_of_building}</option>
                                  )}
                                })}   
                            </select> */}
                            <ReactSelect
                            options={dropdowns.project}
                            components={makeAnimated()}
                            getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                            getOptionValue={(option:any) => option.id}
                            value={dropdowns.project?.find((item:any) => propertyId == item.id) ?? []}
                            classNamePrefix="border-0 "
                            className={"w-100 "}
                            onChange={(val:any) => {
                                formik.setFieldValue('project', val.id ?? '');
                                setPropertyId(val.id);
                            }}
                            placeholder={"Project.."}
                            />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>
                            {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={assignToName}
                                    onChange={assingToChange}
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

                                        return name.join(', ');
                                    }}
                                    className='multi_select_field form-control btn w-100 text-start form-select bg-gray-100 rounded'
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                    </MenuItem>
                                    {dropdowns.assign_to?.map((assignVal:any) => (
                                        <MenuItem
                                        key={assignVal.id}
                                        value={assignVal.first_name+'-'+assignVal.id}
                                        style={getStyles(assignVal.first_name, assignToName, theme)}
                                        >
                                        {assignVal.first_name ?? '--No Name--'}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            <div className="input-group mb-3 bs_2 br_10">
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
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                {/* <select className="btn w-100 text-start form-select bg-gray-100 rounded" {...formik.getFieldProps('task_status')}>
                                    <option value="">Select</option>
                                    {dropdowns.task_status?.map((data:any,i:any) =>{
                                        return (
                                            <option value={data.id} key={i}>{data.option_value}</option> 
                                    )})}
                                </select>  */}
                                <ReactSelect
                                isMulti
                                options={dropdowns.task_status}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.task_status?.filter((item:any) => statusId.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {  
                                    setStatusId(val);                                              
                                }}
                                placeholder={"Status.."}
                                />     
                            </div>
                        </div>
                    </div>
                <div className='card-footer py-5 text-center filter_footer d-flex flex-column flex-md-row align-items-center justify-content-end'>
                    {/* <div className="mb-3 mb-md-0">
                        <div className="form-check d-flex">
                            <input className="form-check-input" type="checkbox" value="" id="filterCheck"/>
                            <label className="form-check-label mx-3" htmlFor="filterCheck">
                                {intl.formatMessage({id: 'include_archived_records'})}
                            </label>
                        </div>
                    </div> */}
                    <div className="mb-3 mb-md-0">
                        <button type='button' className='btn btn-sm btn_soft_primary save_btn p-3 pr-0 mx-3 br_10' data-bs-toggle='modal' data-bs-target={'#task_filter_save_popup'} title="Save">
                            <KTSVG
                                path='/media/custom/save_orange.svg'
                                className='svg-icon-3 svg-icon-primary me-0'
                            />
                        </button>
                        <button type='button' className='btn btn-sm reset_btn mx-3 br_10' onClick={resetFilter}>
                            <i className="fas fa-undo"></i>
                            {intl.formatMessage({id: 'reset'})}
                        </button>
                        <button className='btn btn-sm btn_primary mx-3 br_10' onClick={(e) => setSave(false)}>
                            <KTSVG path='/media/custom/search_white.svg' className='svg-icon-5 svg-icon-gray-500 me-1'
                            />
                            {intl.formatMessage({id: 'search'})}
                        </button>
                    </div>
                    <div className='modal fade' id={'task_filter_save_popup'} aria-hidden='true'>
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h3>{intl.formatMessage({id: 'want_to_save_filter'})}?</h3>
                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                    </div>
                                </div>
                                <div className='modal-body py-lg-10 px-lg-10'>
                                    <div className="mb-3 text-start">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'filter_name'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" className="input-group btn w-100 text-start input_prepend bg-gray-100 rounded" {...formik.getFieldProps('filter_name')}/> 
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' onClick={() => formik.setFieldValue('filter_name', '')} data-bs-dismiss='modal'>
                                            {intl.formatMessage({id: 'no'})}
                                        </button>
                                        <button type='submit' className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => setSave(true)}>
                                            {intl.formatMessage({id: 'yes'})}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {taskFilters.length > 0 &&
            <div className='row'>
                <div className='col-12'>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'saved_filters'})}
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className='row'>
                                {taskFilters.slice(0, 5)?.map((Data, i) => {
                                return(
                                    <div className='col-x12' key={i}>
                                        <div className='row'>
                                            <div onClick={(e) => filterTap(Data)} className="col-11 d-sm-flex cursor_pointer align-items-center justify-content-between bg_soft rounded py-5 px-4 mb-7">
                                                <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">{Data.filter_name}</a>
                                                <span className="text-muted fw-semibold d-block">{Moment(Data.created_at).format("DD-MMMM-YYYY hh:mm a")}</span>
                                            </div>
                                            <span className="col-1 svg-icon svg-icon-4 px-md-5 bg_soft mb-7 d-flex align-items-center rounded-end cursor_pointer px-0" title='delete' onClick={() => taskFilterListDelete(Data)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>
                    </div>
                </div>                    
                </div>
            </div>}
            </div>
        </div>
    )
}

export {TaskFilter}