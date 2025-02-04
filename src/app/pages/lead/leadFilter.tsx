import React,{FC, useState, useEffect} from 'react'
import { saveLeadFilter, getLeadsByRole, getLeadFilters, getLeadDropdowns, getLeads, leadFilterDelete} from './core/_requests'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useAuth } from '../../modules/auth';
import Moment from 'moment';
import {useIntl} from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
    looking_for: '',
    requirement_location: '',
    lead_source: '',
    lead_group: '',
    fee_oppurtunity: '',
    status: '',
    property_type: '',
    property: '',
    priority: '',
    assign_to: '',
    budget_min: '',
    budget_max: '',
    budget_min_ut: '',
    budget_max_ut: '',
    lead_unit_type: '',
    no_of_bedrooms_min: '',
    no_of_bedrooms_max: '',
    no_of_bathrooms_min: '',
    no_of_bathrooms_max: '',
    built_up_area_min: '',
    built_up_area_max: '',
    built_up_area_min_ut: '',
    built_up_area_max_ut: '',
    plot_area_min: '',
    plot_area_max: '',
    plot_area_min_ut: '',
    plot_area_max_ut: '',
    possession_status: '',
    age_of_property: '',
    vasthu_compliant:'',
    furnishing:'',
    car_park_min:'',
    car_park_max:'',
    created_date:'',
    created_end_date:'',
    created_by:'',
    filter_name:'',
    timeline_for_closure_min:'',
    timeline_for_closure_max:'',
    timeline_for_closure_min_ut:'',
    timeline_for_closure_max_ut:'',
    amenities:'',
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
    setLeads?: any,
    setLeadsCount?: any,
    reqBody?: any,
    setBody?: any,
}

const LeadFilter:  FC<Props> = (props) => {
    const intl = useIntl();
    const {
        setLeads, setLeadsCount, reqBody, setBody 
        } = props        

    const theme = useTheme(); 

    const leadFilterSchema = Yup.object().shape({
        looking_for: Yup.string(),
        requirement_location: Yup.string(),
        lead_source: Yup.string(),
        lead_group: Yup.string(),
        fee_oppurtunity: Yup.string(),
        status: Yup.string(),
        property_type: Yup.string(),
        property: Yup.string(),
        priority: Yup.string(),
        budget_min: Yup.string(),
        budget_max: Yup.string(),
        no_of_bedrooms_min: Yup.string(),
        no_of_bedrooms_max: Yup.string(),
        no_of_bathrooms_min: Yup.string(),
        no_of_bathrooms_max: Yup.string(),
        built_up_area_min: Yup.string(),
        built_up_area_max: Yup.string(),
        plot_area_min: Yup.string(),
        plot_area_max: Yup.string(),
        age_of_property: Yup.string(),
        vasthu_compliant: Yup.string(),
        car_park_min: Yup.string(),
        car_park_max: Yup.string(),
        timeline_for_closure_min: Yup.string(),
        timeline_for_closure_max: Yup.string(),
        created_date: Yup.string(),
        created_end_date: Yup.string(),
        filter_name: Yup.string(),
    })
    
    const [save, setSave] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amenitiesId, setAmenitiesId] = useState<string[]>([]);
    const [aminityName, setAmenitiesName] = useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<string[]>([]);
    const [statusId, setStatusId] = useState<string[]>([]);
    const [sourceId, setSourceId] = useState<string[]>([]);
    const [assignToName, setAssignToName] = useState<string[]>([]);
    const [furnishId, setFurnishId] = useState<string[]>([]);
    const [furnishName, setFurnishName] = useState<string[]>([]);
    const [posId, setPosId] = useState<string[]>([]);
    const [posName, setPosName] = useState<string[]>([]);
    const [leadFilter, setLeadFilter] = useState<any[]>([]);
    const [propertyId, setPropertyId] = useState<any>('');
    const [filterDetail, setFilterDetail] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState<any>({});
    const {currentUser, logout} = useAuth();

    const LeadFilterList =  async () => {
        const Response = await getLeadFilters();
        setLeadFilter(Response.output);
    }

    const filterTap =  async (data:any) => {
        setLoading(true);
        setFilterDetail(data)          
        setPropertyId(data.property ?? '');
        formik.setFieldValue('looking_for', data.looking_for ?? '')
        formik.setFieldValue('lead_source', data.lead_source ?? '')
        formik.setFieldValue('lead_group', data.lead_group ?? '')
        formik.setFieldValue('status', data.status ?? '')
        formik.setFieldValue('property_type', data.property_type ?? '')
        formik.setFieldValue('property', data.property ?? '')
        formik.setFieldValue('priority', data.priority ?? '')
        formik.setFieldValue('requirement_location', data.requirement_location ?? '')
        formik.setFieldValue('budget_min', data.budget_min ?? '')
        formik.setFieldValue('budget_max', data.budget_max ?? '')
        formik.setFieldValue('budget_min_ut', data.budget_min_ut ?? '')
        formik.setFieldValue('budget_max_ut', data.budget_max_ut ?? '')
        formik.setFieldValue('lead_unit_type', data.lead_unit_type ?? '')
        formik.setFieldValue('no_of_bedrooms_min', data.no_of_bedrooms_min ?? '')
        formik.setFieldValue('no_of_bedrooms_max', data.no_of_bedrooms_max ?? '')
        formik.setFieldValue('no_of_bathrooms_min', data.no_of_bathrooms_min ?? '')
        formik.setFieldValue('no_of_bathrooms_max', data.no_of_bathrooms_max ?? '')
        formik.setFieldValue('built_up_area_min', data.built_up_area_min ?? '')
        formik.setFieldValue('built_up_area_max', data.built_up_area_max ?? '')
        formik.setFieldValue('built_up_area_min_ut', data.built_up_area_min_ut ?? '')
        formik.setFieldValue('built_up_area_max_ut', data.built_up_area_max_ut ?? '')
        formik.setFieldValue('plot_area_min', data.plot_area_min ?? '')
        formik.setFieldValue('plot_area_max', data.plot_area_max ?? '')
        formik.setFieldValue('plot_area_min_ut', data.plot_area_min_ut ?? '')
        formik.setFieldValue('plot_area_max_ut', data.plot_area_max_ut ?? '')
        formik.setFieldValue('age_of_property', data.age_of_property ?? '')
        formik.setFieldValue('vasthu_compliant', data.vasthu_compliant ?? '')
        formik.setFieldValue('car_park_min', data.car_park_min ?? '')
        formik.setFieldValue('car_park_max', data.car_park_max ?? '')
        formik.setFieldValue('timeline_for_closure_min', data.timeline_for_closure_min ?? '')
        formik.setFieldValue('timeline_for_closure_max', data.timeline_for_closure_max ?? '')
        formik.setFieldValue('timeline_for_closure_min_ut', data.timeline_for_closure_min_ut ?? '')
        formik.setFieldValue('timeline_for_closure_max_ut', data.timeline_for_closure_max_ut ?? '')
        formik.setFieldValue('created_by', data.created_by ?? '')
        formik.setFieldValue('created_date', Moment(data.created_date ?? '').format("YYYY-MM-DD"))
        formik.setFieldValue('created_end_date', Moment(data.created_end_date ?? '').format("YYYY-MM-DD"))
        formik.setFieldValue('fee_oppurtunity', data.fee_oppurtunity ?? '')  

        setAssignToId(dropdowns?.assign_to?.filter((item:any) => data.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));      
        setSourceId(dropdowns?.source?.filter((item:any) => data.source?.split(',')?.indexOf(item.id?.toString()) !== -1));      
        setStatusId(dropdowns?.lead_status?.filter((item:any) => data.lead_status?.split(',')?.indexOf(item.id?.toString()) !== -1));      

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

        var possArray = [];
        var possNameArray = [];
        if(data.possession_status != null){
            possArray = data.possession_status.split(",").map((e:any) => {
                return e;
            });
        }
        if(data.posession_name != null){
            possNameArray = data.posession_name.split(",").map((e:any) => {
                return e;
            });
        }

        setPosId(possArray)
        setPosName(possNameArray)

        var furnishArray = [];
        var furnishNameArray = [];
        if(data.assign_to != null){
            furnishArray = data.assign_to.split(",").map((e:any) => {
                return e;
            });
        }
        if(data.furnishing_name != null){
            furnishNameArray = data.furnishing_name.split(",").map((e:any) => {
                return e;
            });
        }

        setFurnishId(furnishArray)
        setFurnishName(furnishNameArray)

        var amenitiesArray = [];
        var amenitiesNameArray = [];
        if(data.assign_to != null){
            amenitiesArray = data.assign_to.split(",").map((e:any) => {
                return e;
            });
        }
        if(data.amenities_name != null){
            amenitiesNameArray = data.amenities_name.split(",").map((e:any) => {
                return e;
            });
        }

        setAmenitiesId(amenitiesArray)
        setAmenitiesName(amenitiesNameArray)
        setLoading(false);
    }

    const handleChange = (event: SelectChangeEvent<typeof aminityName>) => {
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

        setAmenitiesId(id);
        setAmenitiesName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };
    
      const furnishingChange = (event: SelectChangeEvent<typeof furnishName>) => {
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

        setFurnishId(id);
        setFurnishName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };
    
      const possessionChange = (event: SelectChangeEvent<typeof posName>) => {
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
    
        setPosId(id);
        setPosName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const formik = useFormik({
        initialValues,
        validationSchema: leadFilterSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        setLoading(true)
        try {
        const body = {
            ...reqBody,
            "looking_for": values.looking_for,
            "lead_source": sourceId?.map((item:any) => item.id).join(',').toString(),
            "lead_group": values.lead_group,
            // "fee_oppurtunity": values.fee_oppurtunity,
            "fee_oppurtunity": values.budget_min_ut == '1' ? (parseFloat(values.fee_oppurtunity) * 10000000).toString() : values.budget_min_ut == '2' ? (parseFloat(values.fee_oppurtunity) * 100000).toString() : values.budget_min_ut == '3' ? (parseFloat(values.fee_oppurtunity) * 1000).toString() : '',
            "status": statusId?.map((item:any) => item.id).join(',').toString(),
            "assign_to": assignToId?.map((item:any) => item.id).join(',').toString(),
            // "budget_min": values.budget_min,
            // "budget_max": values.budget_max,
            "budget_min": values.budget_min_ut == '1' ? (parseFloat(values.budget_min) * 10000000).toString() : values.budget_min_ut == '2' ? (parseFloat(values.budget_min) * 100000).toString() : values.budget_min_ut == '3' ? (parseFloat(values.budget_min) * 1000).toString() : '',
            "budget_max": values.budget_max_ut == '1' ? (parseFloat(values.budget_max) * 10000000).toString() : values.budget_max_ut == '2' ? (parseFloat(values.budget_max) * 100000).toString() : values.budget_max_ut == '3' ? (parseFloat(values.budget_max) * 1000).toString() : '',
            "budget_min_ut": values.budget_min_ut,
            "budget_max_ut": values.budget_max_ut,
            "lead_unit_type": values.lead_unit_type,
            "no_of_bedrooms_min": values.no_of_bedrooms_min,
            "no_of_bedrooms_max": values.no_of_bedrooms_max,
            "no_of_bathrooms_min": values.no_of_bathrooms_min,
            "no_of_bathrooms_max": values.no_of_bathrooms_max,
            "built_up_area_min": values.built_up_area_min,
            "built_up_area_max": values.built_up_area_max,
            "built_up_area_min_ut": values.built_up_area_min_ut,
            "built_up_area_max_ut": values.built_up_area_max_ut,
            "plot_area_min": values.plot_area_min,
            "plot_area_max": values.plot_area_max,
            "plot_area_min_ut": values.plot_area_min_ut,
            "plot_area_max_ut": values.plot_area_max_ut,
            "possession_status": posId.join(',').toString(),
            "age_of_property": values.age_of_property,
            "vasthu_compliant": values.vasthu_compliant,
            "property": values.property,
            "priority": values.priority,
            "property_type": values.property_type,
            "furnishing": furnishId.join(',').toString(),
            "car_park_min": values.car_park_min,
            "car_park_max": values.car_park_max,
            "timeline_for_closure_min": values.timeline_for_closure_min,
            "timeline_for_closure_max": values.timeline_for_closure_max,
            "timeline_for_closure_min_ut": values.timeline_for_closure_min_ut,
            "timeline_for_closure_max_ut": values.timeline_for_closure_max_ut,
            "amenities": amenitiesId.join(',').toString(),
            "created_date" : values.created_date,
            "created_end_date" : values.created_end_date,
            "created_by" : values.created_by,
            "filter_name" : values.filter_name,
            "limit" : 0,
        }

        if(save) {
        const filterLeadData = await saveLeadFilter(body);

        if(filterLeadData.status == 200) {
            setLoading(false);
            LeadFilterList();
            resetForm();
            setPropertyId('');
            setAssignToId([]);
            setStatusId([]);
            setSourceId([]);
            setAmenitiesName([]);
            setAmenitiesName([]);
            setAssignToName([]);
            setFurnishName([]);
            setPosName([]);
            var toastEl = document.getElementById('myToastAdd');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(filterLeadData.status == 400) {
            resetForm();
            var toastEl = document.getElementById('taskFilterLimit');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    } else {
        const filterLeadData = await getLeads(body);
        if(filterLeadData.status == 200){
            setLoading(false);
            document.getElementById('kt_filter_close')?.click();
            setLeads(filterLeadData.output);
            setLeadsCount(filterLeadData.count);
            setBody({...body, limit:12})
            resetForm();
            setPropertyId('');
            setAssignToId([]);
            setStatusId([]);
            setSourceId([]);
            setAmenitiesName([]);
            setAssignToName([]);
            setFurnishName([]);
            setPosName([]);
            var toastEl = document.getElementById('myToastAdd');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }
        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

    const resetFilter = async () => {
        let reqRody = {
            "looking_for": '',
            "lead_source": '',
            "lead_group": '',
            "fee_oppurtunity": '',
            "status": '',
            "assign_to": '',
            "budget_min": '',
            "budget_max": '',
            "budget_min_ut": '',
            "budget_max_ut": '',
            "lead_unit_type": '',
            "no_of_bedrooms_min": '',
            "no_of_bedrooms_max": '',
            "no_of_bathrooms_min": '',
            "no_of_bathrooms_max": '',
            "built_up_area_min": '',
            "built_up_area_max": '',
            "built_up_area_min_ut": '',
            "built_up_area_max_ut": '',
            "plot_area_min": '',
            "plot_area_max": '',
            "plot_area_min_ut": '',
            "plot_area_max_ut": '',
            "possession_status": '',
            "age_of_property": '',
            "vasthu_compliant": '',
            "property": '',
            "priority": '',
            "property_type": '',
            "furnishing": '',
            "car_park_min": '',
            "car_park_max": '',
            "timeline_for_closure_min": '',
            "timeline_for_closure_max": '',
            "timeline_for_closure_min_ut": '',
            "timeline_for_closure_max_ut": '',
            "amenities": '',
            "created_date": '',
            "created_end_date": '',
            "created_by": '',
            "filter_name": '',
            "limit": 0,
            "sortBy": ''
        }
        const Response = await getLeads(reqRody);
        if(Response.status == 200) {
            setLeads(Response.output);        
            setLeadsCount(Response.count);  
            setBody({...reqRody, limit:12});      
            formik.resetForm();
            setPropertyId('');
            setAssignToId([]);
            setStatusId([]);
            setSourceId([]);
            setAmenitiesName([]);
            setAssignToName([]);
            setFurnishName([]);
            setPosName([]);
            document.getElementById('kt_filter_close')?.click();
            var toastEl = document.getElementById('myToastAdd');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const leadFilterListDelete = async (data:any) => {
        const response = await leadFilterDelete(data.id);
        if(response.status == 200) {
            LeadFilterList();
        }
    }    

    const dropDowns = async () => {        
        const response = await getLeadDropdowns();
        setDropdowns(response.output);
    }

    useEffect(() => {
        LeadFilterList();
        dropDowns();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>            
                <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_filter_header'>
                    <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'lead_filter'})}</h3>
                    <div className='card-toolbar'>
                        <button
                        type='button'
                        className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                        id='kt_filter_close'
                        >
                            <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                        </button>
                    </div>
                </div>
                <div className='card-body position-relative' id='kt_filter_body'>                    
                    <form noValidate onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'looking_for'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select 
                                    {...formik.getFieldProps('looking_for')}
                                    className={clsx(
                                    'btn btn-sm w-100 text-start form-select',
                                    {
                                        'is-invalid': formik.touched.looking_for && formik.errors.looking_for,
                                    },
                                    {
                                        'is-valid': formik.touched.looking_for && !formik.errors.looking_for,
                                    }
                                    )}
                                    name="looking_for"
                                    >
                                        <option value=''>select</option>
                                    {dropdowns.looking_for?.map((lookingForVal:any,i:any) =>{
                                    return (
                                        <option value={lookingForVal.id} key={i}>{lookingForVal.option_value}</option> 
                                    )})}
                                </select>
                            </div>
                        </div>
                        {/* <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'requirement_location'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('requirement_location')} >
                                <option value=''>select</option>
                                    {dropdowns.city?.map((cityVal:any,i:any) =>{
                                        return (
                                            <option value={cityVal.id} key={i}>{cityVal.name}</option> 
                                    )})}
                                </select>
                            </div>
                        </div> */}
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_source'})}</label>
                            <div className="input-group bs_2 mb-3">
                                {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('lead_source')}>
                                <option value=''>select</option>
                                    {dropdowns.source?.map((sourceVal:any,i:any) =>{
                                    return (
                                        <option value={sourceVal.id} key={i}>{sourceVal.option_value}</option> 
                                    )})}
                                </select> */}
                                <ReactSelect
                                isMulti
                                options={dropdowns.source}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.source?.filter((item:any) => sourceId?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setSourceId(val);                                              
                                }}
                                placeholder={"Source.."}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_group'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('lead_group')}>
                                <option value=''>select</option>
                                    {dropdowns.lead_group?.map((groupVal:any,i:any) =>{
                                        return (
                                            <option value={groupVal.id} key={i}>{groupVal.option_value}</option> 
                                    )})}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label className="form-label">{intl.formatMessage({id: 'opportunity_value'})}</label>
                            <div className="input-group bs_2 mb-3 input_prepend">
                                <input type="text" {...formik.getFieldProps('fee_oppurtunity')} name="fee_oppurtunity" className="form-control" placeholder="0" onChange={(e) => formik.setFieldValue("fee_oppurtunity", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={12}/>
                                <select {...formik.getFieldProps('currency')} className="px-2 py-2 btn_secondary bg_secondary btn btn-sm prepend">
                                <option value=''>&#9660;</option>
                                    {dropdowns.currency?.map((groupVal:any,i:any) =>{
                                    return (
                                        <option value={groupVal.id} key={i}>{groupVal.symbol}</option> 
                                    )})}
                                </select>
                            </div>
                        </div> 
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group bs_2 mb-3">
                            {/* <select 
                            {...formik.getFieldProps('status')}
                            className="btn btn-sm w-100 text-start form-select">
                                <option value=''>select</option>
                                {dropdowns.lead_status?.map((statusVal:any,i:any) =>{
                                return (
                                    <option value={statusVal.id} key={i}>{statusVal.option_value}</option> 
                                )})}
                            </select> */}
                                <ReactSelect
                                isMulti
                                options={dropdowns.lead_status}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.lead_status?.filter((item:any) => statusId?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setStatusId(val);                                              
                                }}
                                placeholder={"Status.."}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_by'})}</label>
                            <div className="input-group bs_2 mb-3">
                            <select 
                            {...formik.getFieldProps('created_by')}
                            className="btn btn-sm w-100 text-start form-select">
                                <option value=''>select</option>
                                {dropdowns.assign_to?.map((statusVal:any,i:any) =>{
                                return (
                                    <option value={statusVal.id} key={i}>{statusVal.assign_to_name}</option> 
                                )})}
                            </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>                            
                            <div className="input-group bs_2 mb-3">
                                <ReactSelect
                                isMulti
                                options={dropdowns.assign_to}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.assign_to?.filter((item:any) => assignToId?.indexOf(item) !== -1)}
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
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_unit_type'})}</label>
                            <div className="row">
                                {/* <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('no_of_bedrooms_min')} placeholder="Min"/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('no_of_bedrooms_max')} placeholder="Max"/>
                                    </div>
                                </div> */}

                                <div className="col-md-12 col-xxl-4 col-12 mb-3">
                                    {/* <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_unit_type'})}</label> */}
                                    <div className="input-group mb-3 bs_2 py-1">
                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('lead_unit_type')}>
                                        <option value=''>select</option>
                                            {dropdowns.unit_type?.map((unitTypePro:any,i:any) =>{
                                                return (
                                                    <option value={unitTypePro.id} key={i}>{unitTypePro.option_value}</option>
                                            )})}
                                        </select>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bathroom'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('no_of_bathrooms_min')} placeholder="Min"/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('no_of_bathrooms_max')} placeholder="Max"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'price_range'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('budget_min')} placeholder="Min"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('budget_min_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.currency?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.symbol}</option> 
                                            )})}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('budget_max')} placeholder="Max"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('budget_max_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.currency?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.symbol}</option> 
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'builtup_area_range'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('built_up_area_min')} placeholder="Min"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('built_up_area_min_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.area_units?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('built_up_area_max')} placeholder="Max"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('built_up_area_max_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.area_units?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area_range'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('plot_area_min')} placeholder="Min"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('plot_area_min_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.area_units?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="text" className="form-control" {...formik.getFieldProps('plot_area_max')} placeholder="Max"/>
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('plot_area_max_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.area_units?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_car_park'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="number" min="0" {...formik.getFieldProps('car_park_min')} name="car_park_min" className="form-control" placeholder="Min"/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="number" min="0" {...formik.getFieldProps('car_park_max')} name="car_park_max" className="form-control" placeholder="Max"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label className="form-label">{intl.formatMessage({id: 'property_type'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select 
                                {...formik.getFieldProps('property_type')}
                                className="btn btn-sm w-100 text-start form-select">
                                    <option value=''>select</option>
                                    {dropdowns.property_type?.map((propertyVal:any,i:any) =>{
                                        return (
                                            <option value={propertyVal.id} key={i}>{propertyVal.option_value}</option> 
                                    )})}
                                </select>
                            </div>  
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label className="form-label">{intl.formatMessage({id: 'lead_priority'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select 
                                {...formik.getFieldProps('priority')}
                                className="btn btn-sm w-100 text-start form-select">
                                    <option value=''>select</option>                                            
                                    {dropdowns.lead_priority?.map((priorityVal:any, i:any) =>{
                                        return (
                                            <option value={priorityVal.id} key={i}>{priorityVal.option_value}</option> 
                                    )})}                                            
                                </select>
                            </div>  
                        </div>
                        <div className="col-md-6 col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'timeline_for_closure'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="number" min="0" {...formik.getFieldProps('timeline_for_closure_min')} name="timeline_for_closure_min" className="form-control" placeholder="Min"/>
                                        {/* <span className="input-group-text">{intl.formatMessage({id: 'months'})}</span> */}
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('timeline_for_closure_min_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.timeline_duration?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                        <input type="number" min="0" {...formik.getFieldProps('timeline_for_closure_max')} name="timeline_for_closure_max" className="form-control" placeholder="Max"/>
                                        {/* <span className="input-group-text">{intl.formatMessage({id: 'months'})}</span> */}
                                        <select className="px-0 ps-1 py-2 btn-light btn btn-sm btn_secondary prepend text-center" {...formik.getFieldProps('timeline_for_closure_max_ut')}>
                                        <option value=''>&#9660;</option>
                                            {dropdowns.timeline_duration?.map((currencyVal:any,i:any) =>{
                                                console.log('currencyVal', currencyVal);
                                                return (
                                                    <option value={currencyVal.id} key={i}>{currencyVal.option_value}</option>
                                            )})}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label className="form-label">{intl.formatMessage({id: 'age_of_property'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select 
                                {...formik.getFieldProps('age_of_property')} 
                                className="btn btn-sm w-100 text-start form-select">
                                    <option value=''>select</option>
                                    {dropdowns.age_of_property?.map((ageOfPropVal:any, i:any) =>{
                                        return (
                                            <option value={ageOfPropVal.id} key={i}>{ageOfPropVal.option_value}</option> 
                                    )})}
                                </select>
                            </div> 
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property'})}</label>
                            <div className="input-group bs_2 mb-3">
                            <ReactSelect
                            options={dropdowns.property}
                            components={makeAnimated()}
                            getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                            getOptionValue={(option:any) => option.id}
                            value={dropdowns.property?.find((item:any) => propertyId == item.id) ?? []}
                            classNamePrefix="border-0 "
                            className={"w-100 "}
                            onChange={(val:any) => {
                                setPropertyId(val.id);
                                formik.setFieldValue('property', val.id ?? '');
                            }}
                            placeholder={"Project.."}
                            />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label className="form-label">{intl.formatMessage({id: 'vasthu_feng_sui_compliant'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <select 
                                {...formik.getFieldProps('vasthu_compliant')} 
                                className="btn btn-sm w-100 text-start form-select">
                                    <option value=''>select</option>
                                    {dropdowns.vasthu_compliant?.map((vasthuVal:any, i:any) =>{
                                        return (
                                            <option value={vasthuVal.id} key={i}>{vasthuVal.option_value}</option> 
                                    )})}
                                </select>
                            </div> 
                        </div>
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={aminityName}
                                    onChange={handleChange}
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
                                            return <p>Amenities</p>;
                                        }

                                        return name.join(', ');
                                    }}
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>Amenities</em>
                                    </MenuItem>
                                    {dropdowns.amenities?.map((amenity:any) => (
                                        <MenuItem
                                        key={amenity.id}
                                        value={amenity.option_value +'-'+ amenity.id}
                                        style={getStyles(amenity.option_value, aminityName, theme)}
                                        >
                                        {amenity.option_value ?? ''}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label className="form-label">{intl.formatMessage({id: 'furnishing_status'})}</label>
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={furnishName}
                                    onChange={furnishingChange}
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
                                        return <p>Furnishing</p>;
                                        }

                                        return name.join(', ');
                                    }}
                                    className='multi_select_field'
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>Furnishing</em>
                                    </MenuItem>
                                    {dropdowns.furnishing_status?.map((furnish:any) => (
                                        <MenuItem
                                        key={furnish.id}
                                        value={furnish.option_value+'-'+furnish.id}
                                        style={getStyles(furnish.option_value, furnishName, theme)}
                                        >
                                        {furnish.option_value ?? ''}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                        </div> 
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label className="form-label">{intl.formatMessage({id: 'posession_status'})}</label>
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={posName}
                                    onChange={possessionChange}
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
                                        return <p>Posession</p>;
                                        }

                                        return name.join(', ');
                                    }}
                                    className='multi_select_field'
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>Posession</em>
                                    </MenuItem>
                                    {dropdowns.possession_status?.map((posession:any) => (
                                    <MenuItem
                                    key={posession.id}
                                    value={posession.option_value+ '-' +posession.id}
                                    style={getStyles(posession.option_value, posName, theme)}
                                    >
                                    {posession.option_value ?? ''}
                                    </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>                            
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_from_date'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <input type="date" className="form-control" {...formik.getFieldProps('created_date')} placeholder="Min"/>
                            </div>                                
                        </div>
                        {formik.values?.created_date &&
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_end_date'})}</label>
                            <div className="input-group bs_2 mb-3">
                                <input type="date" className="form-control" min={formik.values?.created_date} {...formik.getFieldProps('created_end_date')} placeholder="Max"/>
                            </div>                                
                        </div>}
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
                        <button data-bs-toggle='modal' data-bs-target={'#lead_filter_save_popup'} className='btn btn-sm btn_soft_primary save_btn p-3 pr-0 mx-3 br_10' type='button' title="Save">
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
                            <KTSVG path='/media/custom/search_white.svg' className='svg-icon-5 svg-icon-gray-500 me-1'/>
                            {intl.formatMessage({id: 'search'})}
                        </button>
                    </div>
                    <div className='modal fade' id={'lead_filter_save_popup'} aria-hidden='true'>
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
                                        <div className="input-group bs_2 mb-3">
                                            <input type="text" className="form-control" {...formik.getFieldProps('filter_name')} placeholder=""/> 
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
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
                {leadFilter.length > 0 &&
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
                                {leadFilter.map((Data, i) => {
                                return(
                                    <div className='col-12'>
                                        <div className='row'>
                                            <div onClick={(e) => filterTap(Data)} className="col-11 d-sm-flex cursor_pointer align-items-center justify-content-between bg_soft rounded py-5 px-4 mb-7">
                                                <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">{Data.filter_name}</a>
                                                <span className="text-muted fw-semibold d-block">{Moment(Data.created_at).format("DD-MMMM-YYYY hh:mm a")}</span>
                                            </div>
                                            <span className="col-1 svg-icon svg-icon-4 px-md-5 bg_soft mb-7 d-flex align-items-center rounded-end cursor_pointer px-0" title='delete' onClick={() => leadFilterListDelete(Data)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
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
)}

export {LeadFilter}