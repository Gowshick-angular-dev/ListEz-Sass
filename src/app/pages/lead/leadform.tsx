import React,{FC, useState, useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { saveLead, getLeadDropdowns } from './core/_requests'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {useIntl} from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import AsyncSelect from 'react-select/async';
import { getLocalityByPIN } from '../contact/core/_requests';

const initialValues = {
    contact_id: '',
    looking_for: '',
    property_type: '',
    city: '',
    locality: '',
    zipcode: '',
    state: '',
    country: '',
    currency: '',
    lead_source: '',
    lead_group: '',
    lead_priority: '',
    segment: '',
    fee_oppurtunity: '',
    property_id: '',
    project_facing: '',
    status: '52',
    sales_manager: '',
    assign_to: '',
    // requirement_location: [],
    budget_min: '',
    budget_max: '',
    lead_unit_type: '',
    no_of_bedrooms_min: '',
    no_of_bedrooms_max: '',
    no_of_bathrooms_min: '',
    no_of_bathrooms_max: '',
    built_up_area_min: '',
    built_up_area_max: '',
    plot_area_min: '',
    plot_area_max: '',
    possession_status: '',
    age_of_property: '',
    vasthu_compliant:'',
    furnishing: '',
    car_park_min:'',
    car_park_max:'',
    timeline_for_closure_min:'',
    timeline_for_closure_max:'',
    amenities: '',
    budget_min_ut: '',
    budget_max_ut: '',
    built_up_area_min_ut: '',
    built_up_area_max_ut: '',
    plot_area_min_ut: '',
    plot_area_max_ut: '',
    timeline_for_closure_min_ut: '',
    timeline_for_closure_max_ut: '',
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
        aminityName?.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

type Props = {
    setLeads?: any,
    contact?: any,
    checkleadClick?: any
}

const LeadForm:  FC<Props> = (props) => {
const intl = useIntl();
const theme = useTheme();
const {
    setLeads, contact, checkleadClick
    } = props

  //form submit
  const registrationSchema = Yup.object().shape({
    contact_id: Yup.string().required('Contact name is required'),
    property_id: Yup.string().required('Property Id is required'),
    fee_oppurtunity: Yup.string().matches(/^[0-9]+(?:[\.,][0-9]+)*$/, "Enter a valid number"),
  })

  const [loading, setLoading] = useState(false);
  const [aminityName, setAminityName] = useState<string[]>([]);
  const [assignToName, setAssignToName] = useState<string[]>([]);
  const [assignToId, setAssignToId] = useState<string[]>([]);
  const [furnishName, setFurnishName] = useState<string[]>([]);
  const [furnishId, setFurnishId] = useState<string[]>([]);
  const [posName, setPosName] = useState<string[]>([]);
  const [posId, setPosId] = useState<string[]>([]);
  const [amenitiesId, setAmenitiesId] = useState<string[]>([]);
  const [dropdowns, setDropdowns] = useState<any>({});
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [requirementLocationName, setRequirementLocationName] = useState<any[]>([]);
  const [requirementLocationId, setRequirementLocationId] = useState<any[]>([]);
  const [contactList, setContactList] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>({});
  const [contactId, setContactId] = useState<any>('');
  const [propertyId, setPropertyId] = useState<any>('');
  const [localityID, setLocalityID] = useState('')
  const [salesId, setSalesId] = useState<any>('');
  const [localityList, setLocalityList] = useState<any[]>([]);
  const {currentUser, logout} = useAuth();
  
  
  useEffect(() => {
    if(contact?.id != undefined) {
      setContactData(contact);
      setContactId(contact.id);
      setPropertyId(contact.property_id);
      formik.setFieldValue('contact_id', contact.id == 0 && contact.id == null ? '' : contact.id);
      formik.setFieldValue('property_id', contact.property_id == 0 && contact.property_id == null ? '' : contact.property_id);
      formik.setFieldValue('lead_source', contact.source == 0 && contact.source == null ? '' : contact.source);
      formik.setFieldValue('segment', contact.segment == 0 && contact.segment == null ? '' : contact.segment);
      formik.setFieldValue('lead_group', contact.contact_group == 0 && contact.contact_group == null ? '' : contact.contact_group);
    //   setAssignToId(contact.assign_to?.split(',') ?? []);
    //   setAssignToName(contact.assign_to_name?.split(',') ?? []);
      setAssignToId(dropdowns?.assign_to_verify?.filter((item:any) => contact.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));
    }
  },[contact]);

   
const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading(true)
      try {
        var userId = currentUser?.id;
        let body = {
            "contact_id": values.contact_id,
            "looking_for": values.looking_for,
            "property_type": values.property_type,
            "city": values.city,
            "zipcode": values.zipcode,
            "locality": values.locality,
            "state": values.state,
            "country": values.country,
            "currency": values.currency,
            "lead_source": values.lead_source,
            "lead_group": values.lead_group,
            "lead_priority": values.lead_priority,
            "segment": values.segment,
            "sales_manager": values.sales_manager,
            "fee_oppurtunity": values.fee_oppurtunity.replace(/,/g, ""),
            "property_id": values.property_id,
            "property_facing": values.project_facing,
            "lead_status": values.status,
            "created_by": userId,
            "assign_to": assignToId.length > 0 ? assignToId?.map((item:any) => item.id)?.join(',').toString(): userId,
            // "requirement_location": requirementLocationId.join(',').toString(),
            // "budget_min": values.budget_min_ut == '0' ? (parseFloat(values.budget_min) * 100000).toString() : (parseFloat(values.budget_min) * 10000000).toString(),
            // "budget_max": values.budget_max_ut == '0' ? (parseFloat(values.budget_max) * 100000).toString() : (parseFloat(values.budget_max) * 10000000).toString(),
            "budget_min": values.budget_min_ut == '1' ? (parseFloat(values.budget_min) * 10000000).toString() : values.budget_min_ut == '2' ? (parseFloat(values.budget_min) * 100000).toString() : values.budget_min_ut == '3' ? (parseFloat(values.budget_min) * 1000).toString() : (parseFloat(values.budget_min) * 10000000).toString(),
            "budget_max": values.budget_max_ut == '1' ? (parseFloat(values.budget_max) * 10000000).toString() : values.budget_max_ut == '2' ? (parseFloat(values.budget_max) * 100000).toString() : values.budget_max_ut == '3' ? (parseFloat(values.budget_max) * 1000).toString() : (parseFloat(values.budget_max) * 10000000).toString(),
            "lead_unit_type": values.lead_unit_type,
            "no_of_bedrooms_min": values.no_of_bedrooms_min,
            "no_of_bedrooms_max": values.no_of_bedrooms_max,
            "no_of_bathrooms_min": values.no_of_bathrooms_min,
            "no_of_bathrooms_max": values.no_of_bathrooms_max,
            "built_up_area_min": values.built_up_area_min,
            "built_up_area_max": values.built_up_area_max,
            "plot_area_min": values.plot_area_min,
            "plot_area_max": values.plot_area_max,
            "possession_status": posId.join(',').toString(),
            "age_of_property": values.age_of_property,
            "vasthu_compliant": values.vasthu_compliant,
            "furnishing": furnishId.join(',').toString(),
            "car_park_min": values.car_park_min,
            "car_park_max": values.car_park_max,
            "timeline_for_closure_min": values.timeline_for_closure_min,
            "timeline_for_closure_max": values.timeline_for_closure_max,
            "budget_min_ut": values.budget_min_ut,
            "budget_max_ut": values.budget_max_ut,
            "built_up_area_min_ut": values.built_up_area_min_ut,
            "built_up_area_max_ut": values.built_up_area_max_ut,
            "plot_area_min_ut": values.plot_area_min_ut,
            "plot_area_max_ut": values.plot_area_max_ut,
            "timeline_for_closure_min_ut": values.timeline_for_closure_min_ut,
            "timeline_for_closure_max_ut": values.timeline_for_closure_max_ut,
            "amenities": amenitiesId.join(',').toString()
        }

        const saveLeadData = await saveLead(body);

        if(saveLeadData.status == 200){
            setLoading(false);            
            document.getElementById('leadReload')?.click();
            document.getElementById('kt_lead_close')?.click();
            if(contact) {
                document.getElementById('ewioyruihrenroiwehrjnuiqh2wkemqd')?.click();
            }
            resetForm();
            setSalesId('');
            setContactId('');
            setPropertyId('');
            setAminityName([]);
            setAmenitiesId([]);
            setAssignToName([]);
            setAssignToId([]);
            setFurnishName([]);
            setFurnishId([]);
            setPosName([]);
            setPosId([]);
            var toastEl = document.getElementById('leadAddToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
      } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('errMsgToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
}})   

const leadDropdowns = async () => {
    const response = await getLeadDropdowns();
    setDropdowns(response.output);
    const data = response.output?.contact_list;
    const val = response.output?.property;
    
    let contact:any[] = [];
    let propertyies:any[] = [];

    for(let key in data) {
        let body = {
            id: data[key].id,
            name: data[key].first_name+' '+data[key].last_name
        }
        contact.push(body);
    }
    setContactList(contact);
}

useEffect(() => {
    leadDropdowns();
    console.log("soitheiourtuiergturt", '13,33,34,43,44,43,333.5000'.replace(/,/g, ""));
    
}, []);

const openContactFrom = () => {
document.getElementById('kt_lead_close')?.click();
document.getElementById('kt_contact_toggle')?.click();
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
    setAminityName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const locationHandleChange = (event: SelectChangeEvent<typeof requirementLocationName>) => {
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

    setRequirementLocationId(id);
    setRequirementLocationName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const assingToChange = (event: SelectChangeEvent<typeof assignToName>) => {
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

    setAssignToId(id);
    setAssignToName(
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

  const handlelstorage = () => {
    localStorage.removeItem("contactLeadId");
  }

  const contactDropSelect = (id:any, type:any) => {
    formik.setFieldValue('contact_id', id ?? '');
    setContactId(id);
  }

  const salesDropSelect = (id:any) => {
    formik.setFieldValue('sales_manager', id ?? '');
    setSalesId(id);
  }

  const propertyDropSelect = (id:any, type:any) => {
    formik.setFieldValue('property_id', id ?? '');
    setPropertyId(id);
  }

    return(
        <div className='card shadow-none rounded-0 w-100'>
        <div className='card-header w-100' id='kt_lead_header'>
          <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_lead'})}</h3>

          <div className='card-toolbar'>
            <button
              type='button'
              className='btn btn-sm btn-icon btn-active-light-primary me-n5'
              id='kt_lead_close' onClick={handlelstorage}
            >
                <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
            </button>
          </div>
        </div>
        <div className='card-body position-relative' id='kt_lead_body'>        
        <div className="accordion" id="leadAccordion"> 
            <form noValidate onSubmit={formik.handleSubmit} className='lead_form'>
                 <div className="accordion-item">
                    <h2 className="accordion-header" id="leadheadingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        {intl.formatMessage({id: 'basic_details'})}
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="leadheadingOne" data-bs-parent="#leadAccordion">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label required">{intl.formatMessage({id: 'contact_person'})}</label>
                                    {/* {checkleadClick ?                                                                    
                                    <div className="input-group mb-3">
                                        <input type="text" value={contactName['name']} disabled name="contact_id" className='form-control form-control-lg form-control-solid' placeholder="Contact Person" aria-label="Search a contact"/>
                                    </div>
                                    :  */}
                                    <div className="input-group mb-3">
                                    <div className='autocomplete_field'>                                       
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
                                    <button className="btn btn-outline-secondary addContact_btn" type="button" onClick={openContactFrom}>
                                        <i className="fa fa-plus-circle text_primary"></i>
                                    </button>
                                </div> 
                                    {formik.touched.contact_id && formik.errors.contact_id && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.contact_id}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'looking_for'})}</label>
                                    <div className="input-group mb-3">
                                        <select 
                                            {...formik.getFieldProps('looking_for')}
                                            className={clsx(
                                            'form-select btn btn-sm w-100',
                                            {
                                                'is-invalid': formik.touched.looking_for && formik.errors.looking_for,
                                            },
                                            {
                                                'is-valid': formik.touched.looking_for && !formik.errors.looking_for,
                                            }
                                            )}
                                            name="looking_for"
                                            >
                                                <option value=''>{intl.formatMessage({id: 'looking_for'})}</option>
                                            {dropdowns.looking_for?.map((lookingForVal:any,i:any) =>{
                                                return (
                                                    <option value={lookingForVal.id} key={i}>{lookingForVal.option_value}</option> 
                                            )})}
                                        </select>   
                                    </div>
                                    {formik.touched.looking_for && formik.errors.looking_for && (
                                        <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.looking_for}</span>
                                        </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'segment'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('segment')}
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>select</option>
                                            {dropdowns.segment?.map((segmentVal:any,i:any) =>{
                                                return (
                                                    <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div>  
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'property_type'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('property_type')}
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Property Type</option>
                                            {dropdowns.property_type?.map((propertyVal:any,i:any) =>{
                                                return (
                                                    <option value={propertyVal.id} key={i}>{propertyVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div>  
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sales_manager'})}</label>
                                    <div className="input-group mb-3">
                                        {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('sales_manager')}>
                                        <option value=''>Select</option>
                                            {dropdowns.sales_manager?.map((manager:any,i:any) =>{
                                                return (
                                                    <option value={manager.id} key={i}>{manager.first_name +' '}{manager.last_name ?? '' }</option>  
                                            )})}
                                        </select> */}
                                        <div className='w-100'>
                                            <ReactSelect
                                            options={dropdowns.sales_manager}
                                            components={makeAnimated()}
                                            getOptionLabel={(option:any) => (option.first_name ?? '--No Name--') + ' ' + (option.last_name ?? '')}
                                            getOptionValue={(option:any) => option.id}
                                            value={dropdowns.sales_manager?.find((item:any) => salesId == item.id) ?? []}
                                            classNamePrefix="border-0 "
                                            className={""}
                                            onChange={(val:any) => {
                                                salesDropSelect(val.id);
                                            }}
                                            placeholder={"Sales Manager.."}
                                            /> 
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'lead_priority'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('lead_priority')}
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>select</option>                                            
                                            {dropdowns.lead_priority?.map((priorityVal:any,i:any) =>{
                                                return (
                                                    <option value={priorityVal.id} key={i}>{priorityVal.option_value}</option> 
                                            )})}                                            
                                        </select>
                                    </div>  
                                </div>                                 
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'lead_source'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('lead_source')}
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Lead Source</option>
                                            {dropdowns.source?.map((sourceVal:any,i:any) =>{
                                                return (
                                                    <option value={sourceVal.id} key={i}>{sourceVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div> 
                                </div> 
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'lead_group'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('lead_group')}
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Lead Group</option>
                                            {dropdowns.lead_group?.map((groupVal:any,i:any) =>{
                                                return (
                                                    <option value={groupVal.id} key={i}>{groupVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div> 
                                </div> 
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'opportunity_value'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <input type="text" {...formik.getFieldProps('fee_oppurtunity')} name="fee_oppurtunity" className="form-control" placeholder="0" onChange={(e) => formik.setFieldValue("fee_oppurtunity", e.target?.value.replace(/[^0-9,.]/g, ""))}/>
                                        <select 
                                        {...formik.getFieldProps('currency')}
                                        className="px-0 py-2 btn_secondary text-center form-control btn btn-sm prepend">
                                            <option value=''>&#9660;</option>
                                            {dropdowns.currency?.map((groupVal:any,i:any) =>{
                                                return (
                                                    <option value={groupVal.id} key={i}>{groupVal.name + ' - ' +groupVal.symbol}</option> 
                                            )})}
                                        </select>
                                    </div>
                                    {formik.touched.fee_oppurtunity && formik.errors.fee_oppurtunity && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.fee_oppurtunity}</span>
                                        </div>
                                    </div>
                                    )}
                                </div> 
                                <div className="col-md-6 col-12 mb-3">
                                <label className="form-label required">{intl.formatMessage({id: 'property'})}</label>     
                                    <div className="input-group mb-3">
                                        <div className='w-100'>                                      
                                            <ReactSelect
                                            options={dropdowns.property}
                                            components={makeAnimated()}
                                            getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                                            getOptionValue={(option:any) => option.id}
                                            value={dropdowns.property?.find((item:any) => propertyId == item.id) ?? []}
                                            classNamePrefix="border-0 "
                                            className={""}
                                            onChange={(val:any) => propertyDropSelect(val.id, val.name_of_building)}
                                            placeholder={"Project.."}
                                            />
                                        </div>
                                    </div>
                                    {formik.touched.property_id && formik.errors.property_id && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.property_id}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('status')}
                                        className="btn_secondary btn btn-sm w-100">
                                            {dropdowns.lead_status?.map((statusVal:any,i:any) =>{
                                                return (
                                                    <option value={statusVal.id} key={i}>{statusVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div> 
                                </div> 
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>                                    
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

                                                for(let i = 0; i < selected?.length; i++){
                                                    var fields = selected[i].split('-');

                                                    var n = fields[0];
                                                    var d = fields[1];

                                                    name.push(n);
                                                    id.push(d);
                                                }

                                                if (selected?.length === 0) {
                                                return <p>Assign To</p>;
                                                }

                                                return name.join(', ');
                                            }}
                                            className='multi_select_field'
                                            MenuProps={MenuProps}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                            <MenuItem disabled value="">
                                                <em>Assign To</em>
                                            </MenuItem>
                                            {dropdowns.assign_to?.map((assignVal:any) => (
                                                <MenuItem
                                                key={assignVal.id}
                                                value={assignVal.first_name+' '+assignVal.last_name+'-'+assignVal.id}
                                                style={getStyles(assignVal.first_name+' '+assignVal.last_name, assignToName, theme)}
                                                >
                                                {(assignVal.first_name ?? '--No Name--') + ' ' }{assignVal.last_name ?? '' }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
                                    <div className="input-group mb-3 input_prepend">
                                        <ReactSelect
                                        isMulti
                                        options={contact?.id != undefined && contact?.id != null ? dropdowns?.assign_to_verify : dropdowns?.assign_to}
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                        getOptionValue={(option:any) => option.id}
                                        value={dropdowns[contact?.id != undefined && contact?.id != null ? 'assign_to_verify' : 'assign_to']?.filter((item:any) => assignToId.indexOf(item) !== -1)}
                                        classNamePrefix="border-0 "
                                        className={"w-100 "}
                                        onChange={(val:any) => {  
                                            setAssignToId(val);                                              
                                        }}
                                        placeholder={"Assign-to.."}
                                        />
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="leadheadingtwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsetwo" aria-expanded="false" aria-controls="collapsetwo">
                        {intl.formatMessage({id: 'requirement'})}
                        </button>
                    </h2>
                    <div id="collapsetwo" className="accordion-collapse collapse" aria-labelledby="leadheadingtwo" data-bs-parent="#leadAccordion">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bedrooms'})}</label>
                                    <div className="row">
                                        {/* <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('no_of_bedrooms_min')} name="no_of_bedrooms_min" className="form-control" placeholder="Min" onChange={(e) => formik.setFieldValue("no_of_bedrooms_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2}/>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('no_of_bedrooms_max')}  name="no_of_bedrooms_max" className="form-control" placeholder="Max" onChange={(e) => formik.setFieldValue("no_of_bedrooms_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2}/>
                                            </div>
                                        </div> */}

                                        <div className="col-12">
                                            <div className="input-group first mb-3 input_prepend">
                                                <select 
                                                    {...formik.getFieldProps('lead_unit_type')} 
                                                    className="btn_secondary btn btn-sm w-100">
                                                        <option value=''>Bedrooms</option>
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
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_facing'})}</label>
                                    <div className="input-group mb-3">
                                        <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('project_facing')}>
                                        <option value=''>Select</option>
                                            {dropdowns.project_facing?.map((project:any,i:any) =>{
                                                return (
                                                    <option value={project.id} key={i}>{project.option_value}</option> 
                                            )})}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bathrooms'})}</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('no_of_bathrooms_min')}  name='no_of_bathrooms_min' className="form-control" placeholder="Min" onChange={(e) => formik.setFieldValue("no_of_bathrooms_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2}/>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('no_of_bathrooms_max')}  name='no_of_bathrooms_max' className="form-control" placeholder="Max" onChange={(e) => formik.setFieldValue("no_of_bathrooms_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'budget_range'})}</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">                                                
                                                <input type="text" {...formik.getFieldProps('budget_min')} name='budget_min' className="form-control" placeholder="Min" onChange={(e) => {
                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                    const inputValue = e.target.value;
                                                    var area;
                                                    if (!regex.test(inputValue)) {
                                                        area = inputValue.slice(0, -1);
                                                    } else {
                                                        area = inputValue;
                                                    }
                                                 formik.setFieldValue("budget_min",area)}} maxLength={12}/>
                                                <select 
                                                {...formik.getFieldProps('budget_min_ut')}
                                                className="px-0 py-2 btn_secondary text-center form-control btn btn-sm prepend">
                                                    <option value=''>&#9660;</option>
                                                    {dropdowns.currency?.map((groupVal:any,i:any) =>{
                                                        return (
                                                            <option value={groupVal.id} key={i}>{groupVal.symbol}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">                                            
                                                <input type="text" {...formik.getFieldProps('budget_max')} name='budget_max' className="form-control" placeholder="Max" onChange={(e) => {
                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                    const inputValue = e.target.value;
                                                    var area;
                                                    if (!regex.test(inputValue)) {
                                                        area = inputValue.slice(0, -1);
                                                    } else {
                                                        area = inputValue;
                                                    }
                                                 formik.setFieldValue("budget_max", area)}} maxLength={12}/>
                                                <select 
                                                {...formik.getFieldProps('budget_max_ut')}
                                                className="px-0 py-2 btn_secondary text-center form-control btn btn-sm prepend">
                                                    <option value=''>&#9660;</option>
                                                    {dropdowns.currency?.map((groupVal:any,i:any) =>{
                                                        return (
                                                            <option value={groupVal.id} key={i}>{groupVal.symbol}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'built_area_range'})}</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('built_up_area_min')} name='built_up_area_min' className="form-control" placeholder="Min" onChange={(e) => formik.setFieldValue("built_up_area_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={12}/>
                                                {/* <span className="input-group-text">Sqft</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('built_up_area_min_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('built_up_area_max')} name='built_up_area_max' className="form-control" placeholder="Max" onChange={(e) => { 
                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                    const inputValue = e.target.value;
                                                    var area;
                                                    if (!regex.test(inputValue)) {
                                                        area = inputValue.slice(0, -1);
                                                    } else {
                                                        area = inputValue;
                                                    }
                                                    formik.setFieldValue("built_up_area_max", area)}} maxLength={12}/>
                                                {/* <span className="input-group-text">Sqft</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('built_up_area_max_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
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
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('plot_area_min')} name='plot_area_min' className="form-control" placeholder="Min"
                                                 onChange={(e) => { 
                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                    const inputValue = e.target.value;
                                                    var area;
                                                    if (!regex.test(inputValue)) {
                                                        area = inputValue.slice(0, -1);
                                                    } else {
                                                        area = inputValue;
                                                    }
                                                    formik.setFieldValue("plot_area_min", area)}} maxLength={12}/>
                                                {/* <span className="input-group-text">Sqft</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('plot_area_min_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('plot_area_max')} name='plot_area_max' className="form-control" placeholder="Max"
                                                 onChange={(e) => {
                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                    const inputValue = e.target.value;
                                                    var area;
                                                    if (!regex.test(inputValue)) {
                                                        area = inputValue.slice(0, -1);
                                                    } else {
                                                        area = inputValue;
                                                    }
                                                    formik.setFieldValue("plot_area_max", area)}} maxLength={12}/>
                                                {/* <span className="input-group-text">Sqft</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('plot_area_max_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_car_park'})}</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('car_park_min')} name="car_park_min" className="form-control" placeholder="Min" onChange={(e) => formik.setFieldValue("car_park_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5}/>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('car_park_max')} name="car_park_max" className="form-control" placeholder="Max" onChange={(e) => formik.setFieldValue("car_park_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'timeline_for_closure'})}</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('timeline_for_closure_min')} name="timeline_for_closure_min" className="form-control" placeholder="Min" onChange={(e) => formik.setFieldValue("timeline_for_closure_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={3}/>
                                                {/* <span className="input-group-text">Months</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('timeline_for_closure_min_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.timeline_duration?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="input-group first mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('timeline_for_closure_max')} name="timeline_for_closure_max" className="form-control" placeholder="Max" onChange={(e) => 
                                                    formik.setFieldValue("timeline_for_closure_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={3}/>
                                                {/* <span className="input-group-text">Months</span> */}
                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik.getFieldProps('timeline_for_closure_max_ut')}>
                                                <option value=''>&#9660;</option>
                                                    {dropdowns.timeline_duration?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                
                                <div className="col-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                        <div className="input-group">
                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                            formik.setFieldValue("country", e.target.value);
                                            let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                            setState(states);
                                        }} >
                                            <option disabled value="">Select</option>
                                            {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select> 
                                        </div> 
                                    </div>
                                </div>
                                {/* {state.length != 0 && */}
                                <div className="col-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                        <div className="input-group">
                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                            formik.setFieldValue("state", e.target.value);                                               
                                            let states = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                            setCity(states);
                                        }} >
                                            <option disabled value="">Select</option>
                                            {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select>
                                        </div>  
                                    </div>
                                </div>
                                {/* } */}
                                {/* {city.length != 0 && */}
                                <div className="col-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                        <div className="input-group">
                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                            <option disabled value="">Select</option>
                                            {/* {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                            )})} */}
                                            {dropdowns.city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select> 
                                        </div> 
                                    </div>
                                </div>
                                {/* } */}
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zipcode'})}</label>
                                    <div className="input-group">
                                        <input type="text" {...formik.getFieldProps('zipcode')} name="zipcode" className="form-control" placeholder="Enter Zip Code" onChange={async(e) => { 
                                        formik.setFieldValue("zipcode", e.target?.value.replace(/[^0-9]/g, ""));
                                        if(e.target?.value.length == 6) {
                                            const response = await getLocalityByPIN(e.target?.value)
                                            setLocalityList(response.output)
                                        }                                  
                                    }} maxLength={6} />
                                    </div>
                                </div> 
                                {/* {localityList .length > 0 &&                         
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                    <div className="input-group mb-3">
                                    <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('locality')}>
                                    <option value="">Select</option>
                                        {localityList?.map((localityValue,i)=> {
                                        return (
                                            <option value={localityValue.Name} key={i}>{localityValue.Name}</option>
                                        )
                                        })} 
                                    </select>    
                                    </div>
                                </div>} */}
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                    <div className="input-group mb-3">
                                    {/* <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('locality')}>
                                    <option value="">Select</option>
                                        {dropdowns?.locality?.map((localityValue:any,i:any)=> {
                                        return (
                                            <option value={localityValue.name} key={i}>{localityValue.name}</option>
                                        )
                                        })} 
                                    </select>     */}
                                      <ReactSelect
                                        options={dropdowns?.locality}
                                        // closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                        getOptionValue={(option:any) => option.id}
                                        value={dropdowns?.locality?.find((item:any) => localityID == item.id) ?? []}
                                        classNamePrefix="border-0 "
                                        className={"w-100"}
                                        placeholder={"Locality"}
                                        onChange={(val:any) => {
                                        setLocalityID(val.id)
                                        formik.setFieldValue("locality", val.id);                                               
                                        }}
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'requirement_location'})}</label>
                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                        <Select
                                            multiple
                                            displayEmpty
                                            value={requirementLocationName}
                                            onChange={locationHandleChange}
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
                                                    return <p>Requirement location</p>;
                                                }

                                                return name.join(', ');
                                            }}
                                            MenuProps={MenuProps}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                            <MenuItem disabled value="">
                                                <em>Requirement location</em>
                                            </MenuItem>
                                            {dropdowns.requirement_location?.map((reqLocationVal:any) => (
                                                <MenuItem
                                                key={reqLocationVal.id}
                                                value={reqLocationVal.option_value +'-'+ reqLocationVal.id}
                                                >
                                                {reqLocationVal.option_value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div> */}
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'age_of_property'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('age_of_property')} 
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Age of Property</option>
                                            {dropdowns.age_of_property?.map((ageOfPropVal:any,i:any) =>{
                                                return (
                                                    <option value={ageOfPropVal.id} key={i}>{ageOfPropVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div> 
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label className="form-label">{intl.formatMessage({id: 'vasthu_feng_sui_compliant'})}</label>
                                    <div className="input-group mb-3 input_prepend">
                                        <select 
                                        {...formik.getFieldProps('vasthu_compliant')} 
                                        className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Vasthu Complient</option>
                                            {dropdowns.vasthu_compliant?.map((vasthuVal:any,i:any) =>{
                                                return (
                                                    <option value={vasthuVal.id} key={i}>{vasthuVal.option_value}</option> 
                                            )})}
                                        </select>
                                    </div> 
                                </div>
                                <div className="col-md-6 col-12 mb-3">
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
                                                {amenity.option_value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-md-6 col-12 mb-3">
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
                                                value={furnish.option_value+ '-' +furnish.id}
                                                style={getStyles(furnish.option_value, furnishName, theme)}
                                                >
                                                {furnish.option_value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                   
                                </div> 
                                <div className="col-md-6 col-12 mb-3">
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
                                            {dropdowns.possession_status?.map((posession:any, i:any) => (
                                            <MenuItem
                                            key={posession.id}
                                            value={posession.option_value+ '-' +posession.id}
                                            style={getStyles(posession.option_value, posName, theme)}
                                            >
                                            {posession.option_value}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>                                   
                                </div>                                 
                            </div>
                        </div>
                    </div>
                </div> 
                <div className='card-footer py-5 text-center' id='kt_contact_footer'>
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
          
      </div>
    )
}


export {LeadForm}