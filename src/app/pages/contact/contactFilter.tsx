import React,{FC, useState,useEffect} from 'react'
import {getFilteredContact, saveContactFilter, getContactFilter, getContactFilterById, getContsctDropList, getContacts, contactFilterDelete} from './core/_requests'
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {useAuth} from '../../../app/modules/auth'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import Moment from 'moment';
import {useIntl} from 'react-intl'
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
    contact_type: '',
    contact_category: '',
    gender: '',
    status: '',
    assign_to: '',
    source: '',
    created_by: '',
    locality: '',
    city: '',
    state: '',
    country: '',
    date_of_birth: '',
    nationality: '',
    contact_group: '',
    created_date: '',
    created_end_date: '',
    filter_name: '',
    property: '',
    include_archived: false,
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
    setContacts?: any,
    setContactsCount?: any,    
    setBody?: any,    
    body?: any,    
    contactListView?: any,    
}

const ContactFilter:  FC<Props> = (props) => {
    const intl = useIntl();   
  const {
    setContacts, setContactsCount, setBody, body, contactListView
  } = props

    const filterSchema = Yup.object().shape({
        contact_type: Yup.string(),
        status: Yup.string(),
        source: Yup.string(),
        locality: Yup.string(),
        city: Yup.string(),
        nationality: Yup.string(),
        property: Yup.string(),
        contact_group: Yup.string(),
        created_date: Yup.string(),
        filter_name: Yup.string(),
        include_archived: Yup.bool(),
    });

    const theme = useTheme();
    
    const [loading, setLoading] = useState(false)
    const [save, setSave] = useState(false)
    const {currentUser, logout} = useAuth();
    const [assignToName, setAssignToName] = useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<any[]>([]);
    const [statusId, setStatusId] = useState<any[]>([]);
    const [sourceId, setSourceId] = useState<any[]>([]);
    const [assignTostr, setAssignTostr] = useState<any>('');
    const [createdDate, setCreatedDate] = useState<any>('');
    const [property, setProperty] = useState<any>('');

    const searchFilter = () => {
        setSave(false);
    }

    const resetFilter = async () => {
        let body ={
        'contact_type': '',
        'contact_category': '',
        'contact_status': '',
        'assign_to': '',
        'source': '',
        'gender': '',
        'locality': '',
        'city': '',
        'state': '',
        'country': '',
        'property_id': '',
        'contact_group': '',
        'created_date': '',
        'created_end_date': '',
        'created_by': '',
        'zip_code': '',
        'date_of_birth': '',
        'filter_name': '',
        'limit': 0,
        'nationality': '',
        'sortBy': ''
        }

        const saveFilteredContactData = await getContacts(body)
        if(saveFilteredContactData.status == 200) {
            setLoading(false);
            contactListView({...body, limit: ''});
            setContacts(saveFilteredContactData.output);
            setContactsCount(saveFilteredContactData.count);
            setBody({...body, 'limit': 12});            
            document.getElementById('kt_filter_close')?.click();
            document.getElementById('contactListReload')?.click();
            formik.resetForm();
            setProperty('');
            setAssignToId([]);
            setStatusId([]);
            setSourceId([]);
            setAssignToName([]);                    
            var toastEl = document.getElementById('myToastUnFiltered');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: filterSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        setLoading(true)
          try {
            var formBody = {
                ...body,
                'contact_type': values.contact_type,
                'contact_category': values.contact_category,
                'gender': values.gender,
                'contact_status': statusId?.map((item:any) => item.id)?.join(',').toString(),
                'assign_to': assignToId?.map((item:any) => item.id)?.join(',').toString(),
                'source': sourceId?.map((item:any) => item.id)?.join(',').toString(),
                'created_by': values.created_by,
                'city': values.city,
                'country': values.country,
                'state': values.state,
                'property_id': values.property,
                'contact_group': values.contact_group,
                'created_date': values.created_date,
                'created_end_date': values.created_end_date,
                'filter_name': values.filter_name,
                'limit': 0,
            };         
            
            if (save) {
                const saveFilteredContactData = await saveContactFilter(formBody)            

                if(saveFilteredContactData.status == 200){
                    setLoading(false);
                    resetForm();
                    setProperty('');
                    ContactFilterList();
                    setAssignToId([]);
                    setStatusId([]);
                    setSourceId([]);
                    setAssignToName([]);
                    var toastEl = document.getElementById('contactFilterSave');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(saveFilteredContactData.status == 400) {
                    var toastEl = document.getElementById('contactFilterLimit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                const saveFilteredContactData = await getContacts(formBody)

                if(saveFilteredContactData.status == 200) {
                    setLoading(false);
                    contactListView({...formBody, limit: ''});
                    // document.getElementById('contactListReload')?.click();
                    setContacts(saveFilteredContactData.output);
                    setContactsCount(saveFilteredContactData.count);
                    setBody({...formBody, limit: 12});
                    resetForm();
                    setProperty('');
                    document.getElementById('kt_filter_close')?.click();
                    setAssignToId([]);
                    setStatusId([]);
                    setSourceId([]);
                    setAssignToName([]);                    
                    var toastEl = document.getElementById('contactFilterToast');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }    
          }
          catch (error) {
            console.error(error)
            setLoading(false)
          }  
        },
      })

    const [contactFilter, setContactFilter] = useState<any[]>([]);
    const [dropdowns, setContactDropdowns] = useState<any>({});
    const [city, setCity] = useState<any[]>([]);
    const [state, setState] = useState<any[]>([]);
    const [filterDetail, setFilterDetail] = useState<{[key: string]: any}>({});

    const ContactFilterList =  async () => {   
        const ContactFilterResponse = await getContactFilter()
        setContactFilter(ContactFilterResponse.output);
    }

    const contactDropdowns = async () => {
        const response = await getContsctDropList()
        setContactDropdowns(response.output);
    }

    const contactFilterListDelete = async (data:any) => {
        const response = await contactFilterDelete(data.id);
        if(response.status == 200) {
            ContactFilterList();
        }
    }

    const filterTap =  async (data:any) => {
        setLoading(true);
        const response = await getContsctDropList()
        setContactDropdowns(response.output);
        setState(response.output?.state)       
        setCity(response.output?.city)
        setProperty(data.property_id ?? '');
        setAssignToId(response.output?.assign_to?.filter((item:any) => data.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));
        setStatusId(response.output?.contact_status?.filter((item:any) => data.contact_status?.split(',')?.indexOf(item.id?.toString()) !== -1));
        setSourceId(response.output?.source?.filter((item:any) => data.source?.split(',')?.indexOf(item.id?.toString()) !== -1));
        formik.setFieldValue('contact_type', data.contact_type != 0 ? data.contact_type : '')
        // formik.setFieldValue('status', data.contact_status != 0 ? data.contact_status : '')
        // formik.setFieldValue('source', data.source != 0 ? data.source : '')
        formik.setFieldValue('created_by', data.created_by != 0 ? data.created_by : '')
        formik.setFieldValue('contact_category', data.contact_category != 0 ? data.contact_category : '')
        formik.setFieldValue('city', data.city != 0 ? data.city : '')
        formik.setFieldValue('gender', data.gender != 0 ? data.gender : '')
        formik.setFieldValue('country', data.country != 0 ? data.country : '')
        formik.setFieldValue('state', data.state != 0 ? data.state : '')
        formik.setFieldValue('locality', data.locality != 0 ? data.locality : '')
        formik.setFieldValue('property', data.property_id != 0 ? data.property_id : '')
        formik.setFieldValue('nationality', data.nationality != 0 ? data.nationality : '')
        formik.setFieldValue('contact_group', data.contact_group != 0 ? data.contact_group : '')
        formik.setFieldValue('created_date', data.created_date != "0000-00-00" ? Moment(data.created_date).format("YYYY-MM-DD") : '')
        formik.setFieldValue('created_end_date', data.created_end_date != "0000-00-00" ? Moment(data.created_end_date).format("YYYY-MM-DD") : '')
        
        setCreatedDate(Moment(data.created_date).format("YYYY-MM-DD") ?? '')
        // var assignArray = [];
        // var assignNameArray = [];
        // if(data.assign_to != null){
        //     assignArray = data.assign_to?.split(",").map((e:any) => {
        //         return e;
        //     });
        // }
        // if(data.assign_to_name != null){
        //     assignNameArray = data.assign_to_name?.split(",").map((e:any) => {
        //         return e;                
        //     });
        // }
        
        // setAssignToId(assignArray)
        // setAssignToName(assignNameArray)
        setLoading(false);
    }      

    useEffect(() => {
        contactDropdowns();
        ContactFilterList();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_filter_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'contact_filter'})}</h3>
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
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_type'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('contact_type')}>
                                    <option value=''>Select</option>
                                    {dropdowns.contact_type?.map((contactTypeValue:any,i:any)=> {
                                        return (
                                            <option selected={contactTypeValue.id == filterDetail.contact_type} value={contactTypeValue.id} key={i}>{contactTypeValue.option_value}</option>
                                        )
                                    })} 
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group mb-3 bs_2">
                                {/* <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('status')}>
                                <option value=''>Select</option>
                                    {dropdowns.contact_status?.map((statusListValue:any,i:any)=> {
                                        return (
                                            <option selected={statusListValue.id == filterDetail.status} value={statusListValue.id} key={i}>{statusListValue.option_value}</option>
                                        )
                                    })}
                                </select> */}
                                <ReactSelect
                                isMulti
                                options={dropdowns.contact_status}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.contact_status?.filter((item:any) => statusId?.indexOf(item) !== -1)}
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
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gender'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('gender')}>
                                <option value=''>Select</option>
                                    {dropdowns.gender?.map((statusListValue:any,i:any)=> {
                                        return (
                                            <option selected={statusListValue.id == filterDetail.status} value={statusListValue.id} key={i}>{statusListValue.option_value}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_category'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('contact_category')}>
                                <option value=''>Select</option>
                                    {dropdowns.contact_category?.map((statusListValue:any,i:any)=> {
                                        return (
                                            <option selected={statusListValue.id == filterDetail.status} value={statusListValue.id} key={i}>{statusListValue.option_value}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3 edit_page_form">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>                            
                            <div className="input-group mb-3 bs_2">
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
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_by'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('created_by')}>
                                <option value=''>Select</option>
                                    {dropdowns.assign_to?.map((source:any,i:any)=> {
                                        return (
                                            <option selected={source.id == filterDetail.created_by} value={source.id} key={i}>{source.assign_to_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'source'})}</label>
                            <div className="input-group mb-3 bs_2">
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
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <ReactSelect
                                options={dropdowns.property}
                                // closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.property?.find((item:any) => property == item.id) ?? []}
                                classNamePrefix="border-0 "
                                className={"w-100"}
                                onChange={(val:any) => {
                                    setProperty(val.id)
                                    formik.setFieldValue("property", val.id);
                                }}
                                placeholder={"Project.."}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <div className="form-group mb-4">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                <div className="input-group mb-3 bs_2">
                                <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                    formik.setFieldValue("country", e.target.value);
                                    let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                    setState(states);
                                }} >
                                    <option selected value="">Select</option>
                                    {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                            <option value={data.id} key={i}>{data.name}</option>
                                    )})}
                                </select> 
                                </div> 
                            </div>
                        </div>
                        {state.length != 0 &&
                        <div className="col-md-6 col-12 mb-3">
                            <div className="form-group mb-4">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                <div className="input-group mb-3 bs_2">
                                <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                    formik.setFieldValue("state", e.target.value);                                               
                                    let states = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                    setCity(states);
                                }} >
                                    <option selected value="">Select</option>
                                    {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                        <option value={data.id} key={i}>{data.name}</option>
                                    )})}
                                </select>
                                </div>  
                            </div>
                        </div>}
                        {city.length != 0 &&
                        <div className="col-md-6 col-12 mb-3">
                            <div className="form-group mb-4">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                <div className="input-group mb-3 bs_2">
                                <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                    <option selected value="">Select</option>
                                    {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                            <option value={data.id} key={i}>{data.name}</option>
                                    )})}
                                </select> 
                                </div> 
                            </div>
                        </div>} 
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_group'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('contact_group')}>
                                <option value=''>Select</option>
                                {dropdowns.contact_group?.map((contactGrp:any,i:any)=> {
                                    return (
                                    <option selected={contactGrp.id == filterDetail.contact_group} value={contactGrp.id} key={i}>{contactGrp.option_value}</option>)
                                    
                                })}                                            
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_from_date'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <input type="date" className="form-control" {...formik.getFieldProps('created_date')} onChange={(e) => {
                                    setCreatedDate(e.target.value);
                                    formik.setFieldValue('created_date', e.target.value);
                                }} placeholder="date"/> 
                            </div>
                        </div>
                        {createdDate &&
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_to_date'})}</label>
                            <div className="input-group mb-3 bs_2">
                                <input type="date" min={createdDate} className="form-control" {...formik.getFieldProps('created_end_date')} placeholder="date"/> 
                            </div>
                        </div>}
                    </div>
                    <div className='card-footer py-5 text-center filter_footer d-flex flex-column flex-md-row align-items-center justify-content-end' id='kt_filter_footer'>
                    <div className="mb-3 mb-md-0">
                        <button data-bs-toggle='modal'
                            data-bs-target={'#contact_filter_save_popup'} className='btn btn-sm btn_soft_primary save_btn p-3 pr-0 mx-3 br_10' title="Save" type='button'>
                            <KTSVG
                                path='/media/custom/save_orange.svg'
                                className='svg-icon-3 svg-icon-primary me-0'
                            />
                        </button>
                        <button className='btn btn-sm reset_btn mx-3 br_10' type='button' onClick={resetFilter}>
                            <i className="fas fa-undo"></i>
                            {intl.formatMessage({id: 'reset'})}
                        </button>
                        <button className='btn btn-sm btn_primary mx-3 br_10' type='submit' onClick={searchFilter}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z" fill="currentColor"></path></svg>
                            {intl.formatMessage({id: 'filter'})}
                        </button>
                    </div>
                    <div className='modal fade' id={'contact_filter_save_popup'} aria-hidden='true'>
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
                                        <div className="input-group mb-3 bs_2">
                                            <input type="text" className="form-control" {...formik.getFieldProps('filter_name')} placeholder=""/> 
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
                                            {intl.formatMessage({id: 'no'})}
                                        </button>
                                        <button type='submit' className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={() => setSave(true)}>
                                            {intl.formatMessage({id: 'yes'})}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {contactFilter.length > 0 &&
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
                                {contactFilter.map((Data, i) => {
                                return(
                                    <div className='col-12'>
                                        <div className='row'>
                                            <div onClick={(e) => filterTap(Data)} className="col-11 d-sm-flex cursor_pointer align-items-center justify-content-between bg_soft rounded py-5 px-4 mb-7">
                                                <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">{Data.filter_name}</a>
                                                <span className="text-muted fw-semibold d-block">{Moment(Data.created_at).format("DD-MMMM-YYYY hh:mm a")}</span>
                                            </div>
                                            <span className="col-1 svg-icon svg-icon-4 px-md-5 bg_soft mb-7 d-flex align-items-center rounded-end cursor_pointer px-0" title='delete' onClick={() => contactFilterListDelete(Data)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
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

export {ContactFilter}