import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import MenuItem from '@mui/material/MenuItem';
import { Toast } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAuth } from '../../modules/auth';
import Moment from 'moment';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getPropertyFilters, savePropertyFilter, getPropertyDropdowns, projectFilterDelete } from './core/_requests';
import { useIntl } from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
    available_for: '',
    commission_min: '',
    commission_max: '',
    property_type: '',
    property: '',
    property_source: '',
    property_status : '',
    country : '',
    state : '',
    city : '',
    zip_code : '',
    locality : '',
    age_of_property: '',
    property_facing : '',
    project_stage : '',
    gated_community : '',
    vasthu_compliant : '',
    no_of_units_min: '',
    no_of_units_max: '',
    no_of_floors_min: '',
    no_of_floors_max: '',
    rera_registered: '',
    created_date: '',
    created_end_date: '',
    available_start_date: '',
    available_end_date: '',
    created_by: '',
    filter_name: '',
    property_indepth: '',
    segment: '',
    legal_approval: '',
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
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
    getPropertiesFiltered?: any,
}

const PropertyFilter:  FC<Props> = (props) => {
    const theme = useTheme(); 
    const {
        getPropertiesFiltered
        } = props

    const intl = useIntl();
    const [availableForId, setavailableForId] = useState<any[]>([]);
    const [availableForName, setavailableForName] = useState<any[]>([]);
    const [projectId, setProjectId] = useState<any[]>([]);
    const [sourceId, setSourceId] = useState<any[]>([]);
    const [statusId, setStatusId] = useState<any[]>([]);
    const [amenitiesId, setAmenitiesId] = useState<any[]>([]);
    const [amenitiesName, setAmenitiesName] = useState<any[]>([]);
    const [propertyFilters, setPropertyFilters] = useState<any[]>([]);
    const [droplists, setDroplists] = useState<any>({});
    const [save, setSave] = useState(false);
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [property, setProperty] = useState<any[]>([]);
    const [createdDate, setCreatedDate] = useState<any>('');
    const [availableDate, setAvailableDate] = useState<any>('');

    const propertyFilterSchema = Yup.object().shape({
        commission_min : Yup.string(),
        commission_max : Yup.string(),
        property_type : Yup.string(),
        property : Yup.string(),
        property_source : Yup.string(),
        property_status : Yup.string(),
        country : Yup.string(),
        age_of_property : Yup.string(),
        property_facing : Yup.string(),
        project_stage : Yup.string(),
        gated_community : Yup.string(),
        vasthu_compliant : Yup.string(),
        buildup_area_min : Yup.string(),
        buildup_area_max : Yup.string(),
        uds_min: Yup.string(),
        uds_max: Yup.string(),
        no_of_units_min : Yup.string(),
        no_of_units_max : Yup.string(),
        no_of_floors_min : Yup.string(),
        no_of_floors_max : Yup.string(),
        rera_registered : Yup.string(),
        created_date : Yup.string(),
        created_by : Yup.string(),
        filter_name : Yup.string(),
    })
    
    const ProjectFilterList =  async () => {
        const Response = await getPropertyFilters();
        setPropertyFilters(Response.output);
    }

    const availableForChange = (event: SelectChangeEvent<typeof availableForName>) => {
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

        setavailableForId(id);
        setavailableForName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const amenitiesChange = (event: SelectChangeEvent<typeof amenitiesName>) => {
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

    const formik = useFormik({
        initialValues,
        validationSchema: propertyFilterSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        try {
        const body = {
            "available_for" : availableForId.join(',').toString(),
            "project" : projectId.join(',').toString(),
            "amenities" : amenitiesId.join(',').toString(),
            "commission_min": values.commission_min,
            "commission_max": values.commission_max, 
            "property_type": values.property_type,
            "created_by": values.created_by,
            "property": values.property,
            "property_source": sourceId?.map((item:any) => item.id).join(',').toString(),
            "property_status" : statusId?.map((item:any) => item.id).join(',').toString(),
            "property_indepth" : values.property_indepth,
            "legal_approval" : values.legal_approval,
            "country" : values.country,
            "state" : values.state,
            "city" : values.city,
            "segment" : '260',
            "zip_code" : values.zip_code,
            "locality" : values.locality,
            "age_of_property": values.age_of_property,
            "property_facing" : values.property_facing,
            "project_stage" : values.project_stage,
            "gated_community" : values.gated_community,
            "vasthu_compliant" : values.vasthu_compliant,
            "no_of_units_min": values.no_of_units_min,
            "no_of_units_max": values.no_of_units_max,
            "no_of_floors_min": values.no_of_floors_min,
            "no_of_floors_max": values.no_of_floors_max,
            "rera_registered": values.rera_registered,
            "created_date": Moment(values.created_date).format("YYYY-MM-DD") == "Invalid date" ? '' : Moment(values.created_date).format("YYYY-MM-DD"),
            "created_end_date": Moment(values.created_end_date).format("YYYY-MM-DD") == "Invalid date" ? '' : Moment(values.created_end_date).format("YYYY-MM-DD"),
            "available_start_date": Moment(values.available_start_date).format("YYYY-MM-DD") == "Invalid date" ? '' : Moment(values.available_start_date).format("YYYY-MM-DD"),
            "available_end_date": Moment(values.available_end_date).format("YYYY-MM-DD") == "Invalid date" ? '' : Moment(values.available_end_date).format("YYYY-MM-DD"),
            "filter_name": values.filter_name,
            "limit": 0,
            "sortBy": ""
        }

          if(save) {

            const filterLeadData = await savePropertyFilter(body);

                if(filterLeadData.status == 200){
                    document.getElementById('kt_filter_close')?.click();
                    ProjectFilterList();
                    resetForm();
                    setavailableForName([]);
                    setSourceId([]);
                    setStatusId([]);
                    var toastEl = document.getElementById('myToastAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(filterLeadData.status == 400) {
                    var toastEl = document.getElementById('propertyFilterFull');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                    getPropertiesFiltered(body);
                    document.getElementById('kt_property_filter_close')?.click();
                    resetForm();
                    setavailableForName([]);
                    setSourceId([]);
                    setStatusId([]);
                    var toastEl = document.getElementById('myToastAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();                    
            }
        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        }
    }})

    const resetFilter = async () => {
        formik.resetForm();
        setavailableForName([]);
        setSourceId([]);
        setStatusId([]);
        document.getElementById('kt_property_filter_close')?.click();
        document.getElementById('propertyReloadBtn')?.click();
        var toastEl = document.getElementById('myToastAdd');
        const bsToast = new Toast(toastEl!);
        bsToast.show();        
    }

    const filterTap =  async (Id : any) => {
        const fetchDetails = Id;      
        formik.setFieldValue('commission_min', fetchDetails.commission_min ?? '')
        formik.setFieldValue('commission_max', fetchDetails.commission_max ?? '')
        formik.setFieldValue('property_type', fetchDetails.property_type ?? '')
        formik.setFieldValue('created_by', fetchDetails.created_by ?? '')
        formik.setFieldValue('property_indepth', fetchDetails.property_indepth ?? '')
        formik.setFieldValue('country', fetchDetails.country ?? '')
        formik.setFieldValue('age_of_property', fetchDetails.age_of_property ?? '')
        formik.setFieldValue('property_facing', fetchDetails.property_facing ?? '')
        formik.setFieldValue('project_stage', fetchDetails.project_stage ?? '')
        formik.setFieldValue('gated_community', fetchDetails.gated_community ?? '')
        formik.setFieldValue('vasthu_compliant', fetchDetails.vasthu_compliant ?? '')
        formik.setFieldValue('no_of_units_min', fetchDetails.no_of_units_min ?? '')
        formik.setFieldValue('no_of_units_max', fetchDetails.no_of_units_max ?? '')
        formik.setFieldValue('no_of_floors_min', fetchDetails.no_of_floors_min ?? '')
        formik.setFieldValue('no_of_floors_max', fetchDetails.no_of_floors_max ?? '')
        formik.setFieldValue('rera_registered', fetchDetails.rera_registered ?? '')
        formik.setFieldValue('created_date', Moment(fetchDetails.created_date ?? '').format("YYYY-MM-DD"))
        setProperty(droplists.project?.filter((item:any) => fetchDetails.property?.split(',')?.indexOf(item.id?.toString()) !== -1));
        setStatusId(droplists?.property_status?.filter((item:any) => fetchDetails.property_status?.split(',')?.indexOf(item.id?.toString()) !== -1));
        setSourceId(droplists?.property_source?.filter((item:any) => fetchDetails.property_source?.split(',')?.indexOf(item.id?.toString()) !== -1));

        var availableArray = [];
        var availableNameArray = [];
        if(fetchDetails.available_for != null){
            availableArray = fetchDetails.available_for.split(",").map((e:any) => {
                return e;
            });
        }
        if(fetchDetails.available_for_name != null){
            availableNameArray = fetchDetails.available_for_name.split(",").map((e:any) => {
                return e;
            });
        }

        setavailableForId(availableArray)
        setavailableForName(availableNameArray)
    }

    const dropdowns = async () => {
        const response = await getPropertyDropdowns()
        setDroplists(response.output)
    }

    const projectFilterListDelete = async (data:any) => {
        const response = await projectFilterDelete(data.id);
        if(response.status == 200) {
            ProjectFilterList();
        }
    }

    useEffect(() => {
        dropdowns();
        ProjectFilterList();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_filter_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'project_filter'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-icon btn-active-light-primary me-n5'
                    id='kt_property_filter_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>                            
                <div className='card-body position-relative' id='kt_filter_body'>
                <form noValidate onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_for'})}</label>
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={availableForName}
                                    onChange={availableForChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => {
                                        var name = [];
                                        for(let i = 0; i < selected.length; i++){
                                            var fields = selected[i].split('-');
                                            var n = fields[0];
                                            name.push(n);
                                        }
                                        if (selected.length === 0) {
                                        return <p>{intl.formatMessage({id: 'available_for'})}</p>;
                                        }
                                        return(
                                            <ul className='m-0'>
                                              {name?.map((data, i) => {
                                                return(
                                                  <li key={i}>{data}</li>
                                                )
                                              })}                                          
                                            </ul>
                                        )}}
                                    className='multi_select_field btn w-100 text-start form-select bg-gray-100 rounded'
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>{intl.formatMessage({id: 'available_for'})}</em>
                                    </MenuItem>
                                    {droplists.available_for?.map((Val:any) => (
                                        <MenuItem
                                        key={Val.id}
                                        value={Val.option_value+'-'+Val.id}
                                        style={getStyles(Val.option_value, availableForName, theme)}
                                        >
                                        {Val.option_value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div> 
                        <div className="col-md-6 col-12 mb-3 edit_page_form d-none">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>                            
                            <div className="input-group mb-3 bs_2 br_10">
                                <ReactSelect
                                isMulti
                                options={droplists.project}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={droplists.project?.filter( (item:any) => property?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setProperty(val);                                              
                                }}
                                placeholder={"Project.."}
                                />
                            </div>
                        </div> 
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={amenitiesName}
                                    onChange={amenitiesChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => {
                                        var name = [];
                                        for(let i = 0; i < selected.length; i++){
                                            var fields = selected[i].split('-');
                                            var n = fields[0];
                                            name.push(n);
                                        }
                                        if (selected.length === 0) {
                                        return <p>{intl.formatMessage({id: 'amenities'})}</p>;
                                        }
                                        return(
                                            <ul className='m-0'>
                                              {name?.map((data, i) => {
                                                return(
                                                  <li key={i}>{data}</li>
                                                )
                                              })}                                          
                                            </ul>
                                        )}}
                                    className='multi_select_field btn w-100 text-start form-select bg-gray-100 rounded'
                                    MenuProps={MenuProps}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    <MenuItem disabled value="">
                                        <em>{intl.formatMessage({id: 'amenities'})}</em>
                                    </MenuItem>
                                    {droplists.amenities?.map((Val:any) => (
                                        <MenuItem
                                        key={Val.id}
                                        value={Val.option_value+'-'+Val.id}
                                        style={getStyles(Val.option_value, amenitiesName, theme)}
                                        >
                                        {Val.option_value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div> 
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'commission'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('commission_min')}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('commission_max')}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_by'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('created_by')}>
                                    <option value=''>select</option>
                                    {droplists.assign_to?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.first_name+ ' '}{Data.last_name ?? ''}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_type'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('property_type')}>
                                    <option value=''>select</option>
                                    {droplists.property_type?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_stage'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('project_stage')}>
                                <option value=''>select</option>
                                    {droplists.project_stage?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_source'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <ReactSelect
                                isMulti
                                options={droplists.property_source}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={droplists.property_source?.filter((item:any) => sourceId?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setSourceId(val);                                              
                                }}
                                placeholder={"Source..."}
                                />      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'legal_approval'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('legal_approval')}>
                                <option value=''>select</option>
                                    {droplists.legal_approval?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_indepth'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('property_indepth')}>
                                <option value=''>select</option>
                                    {droplists.property_indepth?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <ReactSelect
                                isMulti
                                options={droplists.property_status}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={droplists.property_status?.filter((item:any) => statusId?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setStatusId(val);                                              
                                }}
                                placeholder={"Status..."}
                                />      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                            <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('country')} onChange={async (e) => {
                                formik.setFieldValue("country", e.target.value);
                                let states = droplists.state?.filter((state:any) => e.target.value == state.country_id);
                                setState(states);
                            }} >
                                <option value="">Select</option>
                                {droplists.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                    return(
                                        <option value={data.id} key={i}>{data.name}</option>
                                )})}
                            </select> 
                            </div>
                        </div>
                        {state.length != 0 &&
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                            <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('state')} onChange={async (e) => {
                                formik.setFieldValue("state", e.target.value);                                               
                                let states = droplists.city?.filter((city:any) => e.target.value == city.state_id);
                                setCity(states);
                            }} >
                                <option value="">Select</option>
                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                    return(
                                    <option value={data.id} key={i}>{data.name}</option>
                                )})}
                            </select>
                            </div>
                        </div>}
                        {city.length != 0 &&
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                            <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('city')}>
                                <option value="">Select</option>
                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                    return(
                                        <option value={data.id} key={i}>{data.name}</option>
                                )})}
                            </select> 
                            </div>
                        </div>}
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zipcode'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="number" className="form-control bg-gray-100 border-0" placeholder='zipcode' {...formik.getFieldProps('zipcode')}/>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="text" className="form-control bg-gray-100 border-0" placeholder='locality' {...formik.getFieldProps('locality')}/>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'facing'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('property_facing')}>
                                <option value=''>select</option>
                                    {droplists.project_facing?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gated_community'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('gated_community')}>
                                <option value=''>Select</option>
                                    <option value='1'>Yes</option>
                                    <option value='0'>No</option>
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_project'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('age_of_property')}>
                                <option value=''>Select</option>
                                {droplists.age_of_property?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'vasthu'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('vasthu_compliant')}>
                                <option value=''>select</option>
                                    {droplists.vasthu_complaint?.map((Data:any, i:any) => {
                                return(
                                    <option value={Data.id} key={i}>{Data.option_value}</option>
                                    )})}
                                </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_units'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('no_of_units_min')}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('no_of_units_max')}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floors'})}</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('no_of_floors_min')}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                        <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('no_of_floors_max')}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'RERA_registered'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('rera_registered')}>
                                    <option value=''>Select</option>
                                    <option value='1'>Yes</option>
                                    <option value='0'>No</option>
                                </select>      
                            </div>
                        </div>
                        <div className={createdDate ? "col-md-3 col-6 mb-3" : "col-md-6 col-12 mb-3"}>
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_from_date'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="date" className="form-control bg-gray-100 border-0" {...formik.getFieldProps('created_date')} onChange={(e) => {
                                    setCreatedDate(e.target.value);
                                    formik.setFieldValue('created_date', e.target.value);
                                }} placeholder="date"/> 
                            </div>
                        </div>
                        {createdDate &&
                        <div className="col-md-3 col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_to_date'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="date" min={createdDate} className="form-control bg-gray-100 border-0" {...formik.getFieldProps('created_end_date')} placeholder="date"/> 
                            </div>
                        </div>}
                        <div className={availableDate ? "col-md-3 col-6 mb-3" : "col-md-6 col-12 mb-3"}>
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_from_date'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="date" className="form-control bg-gray-100 border-0" {...formik.getFieldProps('available_start_date')} onChange={(e) => {
                                    setAvailableDate(e.target.value);
                                    formik.setFieldValue('available_start_date', e.target.value);
                                }} placeholder="date"/> 
                            </div>
                        </div>
                        {availableDate && 
                        <div className="col-md-3 col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_to_date'})}</label>
                            <div className="input-group mb-3 bs_2 br_10">
                                <input type="date" min={availableDate} className="form-control bg-gray-100 border-0" {...formik.getFieldProps('available_end_date')} placeholder="date"/> 
                            </div>
                        </div>}
                    </div> 
                    <div className='text-end'>
                        <div className="mb-3 mb-md-0">
                            <button type='button' data-bs-toggle='modal' data-bs-target={'#property_filter_save_popup'} className='btn btn_soft_primary save_btn p-3 pr-0 mx-3 br_10' title="Save">
                                <KTSVG
                                    path='/media/custom/save_orange.svg'
                                    className='svg-icon-3 svg-icon-primary me-0'
                                />
                            </button>
                            <button className='btn reset_btn mx-3 br_10' onClick={resetFilter}>
                                <i className="fas fa-undo"></i>
                                {intl.formatMessage({id: 'reset'})}
                            </button>
                            <button className='btn btn_primary mx-3 br_10' onClick={(e) => setSave(false)}>
                                <KTSVG path='/media/custom/search_white.svg' className='svg-icon-5 svg-icon-gray-500 me-1'/>
                                {intl.formatMessage({id: 'search'})}
                            </button>
                        </div>
                        <div className='modal fade' id={'property_filter_save_popup'} aria-hidden='true'>
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
                                            <div className="input-group mb-3 bs_2 br_10">
                                                <input type="text" className="input-group btn w-100 text-start input_prepend bg-gray-100 rounded" placeholder="" {...formik.getFieldProps('filter_name')}/> 
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
                    <div className='mt-5'>
                    {propertyFilters.length > 0 &&
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
                                        {propertyFilters.map((Data, i) => {
                                        return(
                                            <div className='col-12'>
                                                <div className='row'>
                                                    <div onClick={(e) => filterTap(Data)} className="col-11 d-sm-flex cursor_pointer align-items-center justify-content-between bg_soft rounded py-5 px-4 mb-7">
                                                        <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">{Data.filter_name}</a>
                                                        <span className="text-muted fw-semibold d-block">{Moment(Data.created_at).format("DD-MMMM-YYYY hh:mm a")}</span>
                                                    </div>
                                                    <span className="col-1 svg-icon svg-icon-4 px-md-5 bg_soft mb-7 d-flex align-items-center rounded-end cursor_pointer px-0" title='delete' onClick={() => projectFilterListDelete(Data)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
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
        </div>
    )}

export {PropertyFilter}