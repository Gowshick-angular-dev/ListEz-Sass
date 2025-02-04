import React,{FC, useState, useEffect} from 'react';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useDropzone } from 'react-dropzone'
import Moment from 'moment';
import { Toast, Offcanvas } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import {useIntl} from 'react-intl';


const initialValues = {
    contact_id: '',
    lead_source: '',
    lead_priority: '',
    lead_group: '',
    segment: '',
    status: '',
    sales_manager: '',
    project_facing: '',
    assign_to: [],
    possession_status: [],
    age_of_property: '',
    vasthu_compliant:'',
    furnishing:[],
    looking_for: '',
    property_type: '',
    city: '',
    fee_oppurtunity: '',
    property_id: '',
    requirement_location: '',
    budget_min: '',
    budget_max: '',
    no_of_bedrooms_min: '',
    no_of_bedrooms_max: '',
    no_of_bathrooms_min: '',
    no_of_bathrooms_max: '',
    built_up_area_min: '',
    built_up_area_max: '',
    plot_area_min: '',
    plot_area_max: '',   
    car_park_min:'',
    car_park_max:'',
    timeline_for_closure_min:'',
    timeline_for_closure_max:'',
    amenities:[],
    reply:'',
    title: "",
    subject: "",
    share_with: "",
    module_id: "",
    body: "",
}


const LeadRequirForm = () => {
    const intl = useIntl();

    const leadUpdateSchema = Yup.object().shape({
        contact_id: Yup.string()
            .required('Contact name is required'),
        looking_for: Yup.string(),
        property_type: Yup.string(),
        city: Yup.string(),
        lead_source: Yup.string(),
        lead_priority: Yup.string(),
        sales_manager: Yup.string(),
        lead_group: Yup.string(),
        segment: Yup.string(),
        fee_oppurtunity: Yup.string(),
        property_id: Yup.string(),
        status: Yup.string(),
        assign_to: Yup.array(),
    })
    const leadUpdateSchema2 = Yup.object().shape({
        requirement_location: Yup.string(),
        budget_min: Yup.string(),
        budget_max: Yup.string(),
        project_facing: Yup.string(),
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
    })

    const [bedroomsMin, setBedroomsMin] = useState(null);
    const [bedroomsMax, setBedroomsMax] = useState(null);
    const [bathroomsMin, setBathroomsMin] = useState(null);
    const [bathroomsMax, setBathroomsMax] = useState(null);
    const [plotAreaMin, setPlotAreaMin] = useState(null);
    const [plotAreaMax, setPlotAreaMax] = useState(null);
    const [builtAreaMin, setBuiltAreaMin] = useState(null);
    const [builtAreaMax, setBuiltAreaMax] = useState(null);
    const [carParkMin, setCarParkMin] = useState(null);
    const [carParkMax, setCarParkMax] = useState(null);
    const [budgetMin, setBudgetMin] = useState(null);
    const [budgetMax, setBudgetMax] = useState(null);
    const [timeCloseMin, setTimeCloseMin] = useState(null);
    const [timeCloseMax, setTimeCloseMax] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aminityName, setAminityName] = useState([]);
    const [aminityId, setAminityId] = useState([]);
    const [furnishName, setFurnishName] = useState([]);
    const [furnishId, setFurnishId] = useState([]);
    const [posessionName, setPosName] = useState([]);
    const [posId, setPosId] = useState([]);
    const [requirementLocationName, setRequirementLocationName] = useState([]);
    const [requirementLocationId, setRequirementLocationId] = useState([]);

    const formik = useFormik({
        initialValues,
        validationSchema: leadUpdateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
        //   console.log('lead form body');
        //   console.log(values);
        try {
        const body = {
            "contact_id": values.contact_id,
            "looking_for": values.looking_for,
            "property_type": values.property_type,
            "sales_manager": values.sales_manager,
            "city": values.city,
            "lead_source": values.lead_source,
            "lead_priority": values.lead_priority,
            "lead_group": values.lead_group,
            "segment": values.segment,
            "fee_oppurtunity": values.fee_oppurtunity,
            "property_id": values.property_id,
            "status": values.status,
            // "assign_to": assignToId.length > 0 ? assignToId : [userId],
            // "created_by": userId,
        }

        // const updateLeadData = await updateLead(leadId ,body);

        // console.log('updateLeadData');
        // console.log(updateLeadData);
        // document.getElementById('kt_contact')?.classList.remove('drawer-on');
        // if(updateLeadData != null){
        //     setLoading(false);
        //     setDetailClicked(false);
        //     document.getElementById('kt_expand_close')?.click();
        //     var toastEl = document.getElementById('myToastUpdate');
        //     const bsToast = new Toast(toastEl!);
        //     bsToast.show();
        //     const characterResponse = await getLeadsByRole(userId, roleId)
        //     setLeadList(characterResponse);

           
        // }

        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

    const formik2 = useFormik({
        initialValues,
        validationSchema: leadUpdateSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
        try {
        const body = {
            "requirement_location": requirementLocationId,
            "budget_min": values.budget_min,
            "budget_max": values.budget_max,
            "no_of_bedrooms_min": values.no_of_bedrooms_min,
            "no_of_bedrooms_max": values.no_of_bedrooms_max,
            "no_of_bathrooms_min": values.no_of_bathrooms_min,
            "no_of_bathrooms_max": values.no_of_bathrooms_max,
            "built_up_area_min": values.built_up_area_min,
            "built_up_area_max": values.built_up_area_max,
            "plot_area_min": values.plot_area_min,
            "plot_area_max": values.plot_area_max,
            "property_facing": values.project_facing,
            "possession_status": posId,
            "age_of_property": values.age_of_property,
            "vasthu_compliant": values.vasthu_compliant,
            "furnishing": furnishId,
            "car_park_min": values.car_park_min,
            "car_park_max": values.car_park_max,
            "timeline_for_closure_min": values.timeline_for_closure_min,
            "timeline_for_closure_max": values.timeline_for_closure_max,
            "amenities": aminityId,
            // "created_by": userId,
        }

        // const updateLeadData = await updateLeadReq(leadId ,body);

        // console.log('updateLeadData');
        // console.log(updateLeadData);
        // document.getElementById('kt_contact')?.classList.remove('drawer-on');
        // if(updateLeadData != null){
        //     setLoading(false);
        //     setDetailClicked(false);
        //     document.getElementById('kt_expand_close')?.click();
        //     var toastEl = document.getElementById('myToastUpdate');
        //     const bsToast = new Toast(toastEl!);
        //     bsToast.show();
        //     const characterResponse = await getLeadsByRole(userId, roleId)
        //     setLeadList(characterResponse);
        //     // resetForm();
        //     // setAminityName([]);
        //     // setAssignToName([]);
        //     // setFurnishName([]);
        //     // setPosName([]);
        // }

        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

    return(
        <>
        <div className='position-relative'
        style={{backgroundImage:'url(https://dev.listez.io/media/illustrations/sketchy-1/14.png)',backgroundSize:"100%",backgroundRepeat: 'no-repeat',
        backgroundPositionY:'100%',height:'100%' }}
        >
       <div className="">      
            <div className={'card mt-15 mx-5 shadow-sm req_form_height br_15'} id={"requirements"}>
                <div className='card-body'>
                    <div className='d-flex flex-center flex-column flex-column-fluid mb-5'>
                        <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.png')} className='h-45px' />
                    </div>
                    <div className='text-center mb-12'>
                        <h1 className='text-dark mb-3'>{intl.formatMessage({id: 'requirement_form'})}</h1>
                    </div>
                    <form noValidate onSubmit={formik2.handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bedrooms'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bedrooms_min')} 
                                            onChange={(e) => {
                                        setBedroomsMin(e.target.value)
                                        formik2.setFieldValue('no_of_bedrooms_min', e.target.value ?? '')
                                    }} value={bedroomsMin} placeholder="Min"
                                    />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bedrooms_max')} onChange={(e) => {
                                        setBedroomsMax(e.target.value)
                                        formik2.setFieldValue('no_of_bedrooms_max', e.target.value ?? '')
                                    }} value={bedroomsMax} placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bathrooms'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bathrooms_min')} onChange={(e) => {
                                        setBathroomsMin(e.target.value)
                                        formik2.setFieldValue('no_of_bathrooms_min', e.target.value ?? '')
                                    }} value={bathroomsMin} placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bathrooms_max')} onChange={(e) => {
                                        setBathroomsMax(e.target.value)
                                        formik2.setFieldValue('no_of_bathrooms_max', e.target.value ?? '')
                                    }} value={bathroomsMax} placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div>  
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_facing'})}</label>
                                <div className="input-group mb-3 input_prepend py-1">
                                    <select className="btn btn-sm w-100 text-start form-select border border-secondary" {...formik.getFieldProps('project_facing')}>
                                    <option value=''>Select</option>
                                        {/* {projectFacing.map((Facing,i) =>{
                                            return (
                                                <option value={Facing.id} selected={Facing.id == leadDetail.project_facing} key={i}>{Facing.name}</option> 
                                        )})} */}
                                    </select>
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'budget_range'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('budget_min')} onChange={(e) => {
                                        setBudgetMin(e.target.value)
                                        formik2.setFieldValue('budget_min', e.target.value ?? '')
                                    }} value={budgetMin} className="form-control" placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('budget_max')} onChange={(e) => {
                                        setBudgetMax(e.target.value)
                                        formik2.setFieldValue('budget_max', e.target.value ?? '')
                                    }} value={budgetMax} className="form-control" placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'built_area_range'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('built_up_area_min')} onChange={(e) => {
                                        setBuiltAreaMin(e.target.value)
                                        formik2.setFieldValue('built_up_area_min', e.target.value ?? '')
                                    }} value={builtAreaMin} placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('built_up_area_max')} onChange={(e) => {
                                        setBuiltAreaMax(e.target.value)
                                        formik2.setFieldValue('built_up_area_max', e.target.value ?? '')
                                    }} value={builtAreaMax} placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area_range'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('plot_area_min')} onChange={(e) => {
                                        setPlotAreaMin(e.target.value)
                                        formik2.setFieldValue('plot_area_min', e.target.value ?? '')
                                    }} value={plotAreaMin} className="form-control" placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('plot_area_max')} onChange={(e) => {
                                        setPlotAreaMax(e.target.value)
                                        formik2.setFieldValue('plot_area_max', e.target.value ?? '')
                                    }} value={plotAreaMax} className="form-control" placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_car_park'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('car_park_min')} onChange={(e) => {
                                        setCarParkMin(e.target.value)
                                        formik2.setFieldValue('car_park_min', e.target.value ?? '')
                                    }} value={carParkMin} className="form-control" placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('car_park_max')} onChange={(e) => {
                                                setCarParkMax(e.target.value)
                                                formik2.setFieldValue('car_park_max', e.target.value ?? '')
                                            }} value={carParkMax} className="form-control" placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'timeline_for_closure'})}</label>
                                <div className='row mx-0'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('timeline_for_closure_min')} onChange={(e) => {
                                                setTimeCloseMin(e.target.value)
                                                formik2.setFieldValue('timeline_for_closure_min', e.target.value ?? '')
                                            }} value={timeCloseMin} className="form-control" placeholder="Min"/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" {...formik2.getFieldProps('timeline_for_closure_max')} onChange={(e) => {
                                                setTimeCloseMax(e.target.value)
                                                formik2.setFieldValue('timeline_for_closure_max', e.target.value ?? '')
                                            }} value={timeCloseMax} className="form-control" placeholder="Max"/>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'requirement_location'})}</label>
                                <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                    <Select
                                        className='input_prepend border border-secondary'
                                        multiple
                                        displayEmpty
                                        value={requirementLocationName}
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
                                                return <p>Requirement location</p>;
                                            }

                                            return name.join(', ');
                                        }}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                    </Select>
                                </FormControl>
                            </div>                                                
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_property'})}</label>
                                <div className="input-group mb-3 input_prepend py-1">
                                    <select 
                                    {...formik2.getFieldProps('age_of_property')} 
                                    className="btn btn-sm w-100 text-start form-select border border-secondary">
                                        <option value="">Select</option>
                                    </select>
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'vasthu_feng_sui_compliant'})}</label>
                                <div className="input-group mb-3 input_prepend py-1">
                                    <select 
                                    {...formik2.getFieldProps('vasthu_compliant')} 
                                    className="btn btn-sm w-100 text-start form-select border border-secondary">
                                        <option value="" >Select</option>
                                        {/* {vasthu.map((vasthuVal,i) =>{
                                            return (
                                                <option value={vasthuVal.id} selected={vasthuVal.id == leadDetail.vasthu_compliant_id} key={i}>{vasthuVal.name}</option> 
                                        )})} */}
                                    </select>
                                </div> 
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                    <Select
                                        className='input_prepend border border-secondary'
                                        multiple
                                        displayEmpty
                                        value={aminityName}
                                        renderValue={(selected) => {
                                            selected = aminityName;
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
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                    </Select>
                                </FormControl>
                            </div> 
                            <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing_status'})}</label>
                                <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
                                    <Select
                                        multiple
                                        displayEmpty
                                        value={furnishName}
                                        renderValue={(selected) => {
                                            selected = furnishName;
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
                                        className='multi_select_field border border-secondary'
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'posession_status'})}</label>
                                <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
                                    <Select
                                        multiple
                                        displayEmpty
                                        value={posessionName}
                                        renderValue={(selected) => {
                                            selected = posessionName;
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
                                        className='multi_select_field border border-secondary'
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                        {/* <MenuItem disabled value="">
                                            <em>Posession</em>
                                        </MenuItem>
                                        {posesStatus.map((posesStatusVal) => (
                                            <MenuItem
                                            key={posesStatusVal.id}
                                            value={posesStatusVal.name+'-'+posesStatusVal.id}
                                            style={getStyles(posesStatusVal.name, posessionName, theme)}
                                            >
                                            {posesStatusVal.name}
                                            </MenuItem>
                                        ))} */}
                                    </Select>
                                </FormControl>
                            </div> 
                            
                            <div className="col-12 d-flex justify-content-center mb-4">
                            <button
                                type='submit'
                                
                                className='btn btn_primary text-primary'
                                disabled={formik2.isSubmitting}
                                >
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'save'})}
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
                        </div>
                    </form>
                </div>                     
            </div>
        </div> 
            </div>
        </>
    )
}


export {LeadRequirForm}