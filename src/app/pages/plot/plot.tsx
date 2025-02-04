import React,{FC, useState,useEffect} from 'react'
import Moment from 'moment';
import { Offcanvas, Toast } from 'bootstrap';
import { PropertyDrawer } from './propertyDrawers';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../modules/auth'
import { PropertyDetails } from './propertyDetails'
import { PropertyListView } from './propertyListView'
import { PropertyToolbar } from './propertyToolbar';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { deleteProperty, getProperties, savePropertyNotes, updatePropertyStatus } from './core/_requests';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useIntl} from 'react-intl';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import { getMasters } from '../settings/orgMasters/core/_requests';

const initialValues = {
    reply: '',
    reason: '',
}

const PlotList: FC = () => {

    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [detailData, setDetailData] = useState('');
    const [detailTab, setDetailTab] = useState('');
    const [detailsClicked, setDetailsClicked] = useState(false);
    const [propertiesCount, setPropertiesCount] = useState<any>();
    const [propertyId, setPropertyId] = useState<any>({});
    const [detailClick, setDetailClick] = useState(false);
    const [propCheckList, setPropCheckList] = useState<any[]>([]);
    const [statusDrop, setStatusDrop] = useState<any[]>([]);
    const [propertyStatus, setPropertyStatus] = useState<any[]>([]);
    const [propertiesList, setPropertiesList] = useState<any[]>([]);
    const [toggle, setToggle] = useState('grid');
    const [body, setBody] = useState({
        "available_for": '',
        "project": '',
        "amenities": '',
        "commission_min": '',
        "commission_max": '',
        "property_type": '',
        "created_by": '',
        "property_source": '',
        "property_status": '',
        "legal_approval": '',
        "property_indepth": '',
        "country": '',
        "state": '',
        "city": '',
        "segment": '260',
        "zip_code": '', 
        "locality": '',
        "age_of_property": '',
        "property_facing": '',
        "project_stage": '',
        "gated_community": '',
        "vasthu_compliant": '',
        "no_of_units_min": '',                      
        "no_of_units_max": '',
        "no_of_floors_min": '',
        "no_of_floors_max": '',
        "rera_registered": '',
        "created_date": '',
        "created_end_date": '',
        "available_start_date": '',
        "available_end_date": '',
        "filter_name": '',
        "limit": 0,
        "sortBy": '',
    });

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Enter a note to change the status..'),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setIsLoading(true)
          try {

            var notesBody = {
                "reply": values.reply,
                "reason_id": values.reason,
                "module_id": propertyId.id,
                "status_id": propertyId.status,
                "module_name": 3,
                "property_id": propertyId.id,
                "parent_id": 0
            };
                           
            const leadNotesData = await savePropertyNotes(notesBody)
    
            if(leadNotesData.status == 200){
              resetForm();  

            const body = {
                "property_status": propertyId.status
            }
            const updateTask = await updatePropertyStatus(propertyId.id, body);
            if(updateTask.status == 200){
                setProperties(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === propertyId.id);
                    
                    if (objectToUpdate) {
                      objectToUpdate.property_status = propertyId.status;
                    }
                    
                    return updatedData;
                  });
                  setPropertiesList(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === propertyId.id);
                    
                    if (objectToUpdate) {
                      objectToUpdate.property_status = propertyId.status;
                    }
                    
                    return updatedData;
                  });
                document.getElementById('property_status_pop')?.click();
                var toastEl = document.getElementById('myToastStatus');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
            }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
    })

    const handleHideData = (e:any) => {
        setToggle(e.target.value);
    };

    const propertyStatusChange = async (e:any, prop:any) => {        
        setPropertyId({
            'status': e.target.value,
            'id': prop.id
        });
        document.getElementById('property_status_pop')?.click(); 
        if(toggle == 'grid') {
            (document.getElementById('property_statusnkjkjb_rgkbj'+prop.id) as HTMLInputElement).value = prop.property_status?.toString();       
        }
    }

    const deleteModel = async (id:any) => {
        const response = await deleteProperty(id);
        if(response.status == 200) {
            propertyList();
        }
    } 

    const mastersList = async() => {
        const response = await getMasters("property_status")
        setPropertyStatus(response.output);
    }

    const propertyList = async () => {
        setIsLoading(true);
        const response = await getProperties({...body, "limit": 0})
        setBody({...body, "limit": 12})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        setIsLoading(false);
    }

    const propertyReload = async () => {
        let vbhsj = {
            "available_for": '',
            "project": '',
            "amenities": '',
            "commission_min": '',
            "commission_max": '',
            "property_type": '',
            "created_by": '',
            "property_source": '',
            "property_status": '',
            "legal_approval": '',
            "property_indepth": '',
            "country": '',
            "state": '',
            "city": '',
            "segment": '260',
            "zip_code": '', 
            "locality": '',
            "age_of_property": '',
            "property_facing": '',
            "project_stage": '',
            "gated_community": '',
            "vasthu_compliant": '',
            "no_of_units_min": '',                      
            "no_of_units_max": '',
            "no_of_floors_min": '',
            "no_of_floors_max": '',
            "rera_registered": '',
            "created_date": '',
            "created_end_date": '',
            "available_start_date": '',
            "available_end_date": '',
            "filter_name": '',
            "limit": 0,
            "sortBy": '',
        }
        const response = await getProperties(vbhsj)
        setBody({...vbhsj, "limit": 12})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        const respondsfsfsse = await getProperties({...vbhsj, "limit": ''})
        setPropertiesList(respondsfsfsse.output);
    }

    const propertyReloadFilter = async () => {
        const response = await getProperties({...body, limit: 0})
        setBody({...body, "limit": 12})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        const respondsfsfsse = await getProperties({...body, "limit": ''})
        setPropertiesList(respondsfsfsse.output);
    }

    const propertyListView = async () => {
        const response = await getProperties({...body, "limit": ''})
        setPropertiesList(response.output);
    }

    const projectListLazyLoad = async () => {
        const response = await getProperties(body)
        setBody({...body, "limit": body.limit+12})
        setPropertiesCount(response.count);
        setProperties((data) => [...data, ...response.output]);
        setStatusDrop(response.property_status);
    }
    

    const openModal = (propId:any, tabType:any) => {
        setDetailsClicked(true);
        setDetailData(propId);
        setDetailTab(tabType);
    }

    const cancelStatusChange = async () => {       
        setIsLoading(true);
        const response = await getProperties({...body, "limit": 0})
        setBody({...body, "limit": 12})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        setIsLoading(false);
    }

    const sortByChange = async (e:any) => {       
        setIsLoading(true);
        const response = await getProperties({...body, "limit": 0, "sortBy": e})
        setBody({...body, "limit": 12, "sortBy": e})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        setIsLoading(false);
    }

    const propertyFiltered = async (filterbody:any) => {
        setIsLoading(true);
        const response = await getProperties({...filterbody, "sortBy": body.sortBy})
        setBody({...filterbody, "limit": 12, "sortBy": body.sortBy})
        setPropertiesCount(response.count);
        setProperties(response.output);
        setStatusDrop(response.property_status);
        setIsLoading(false);
    }

    const propOnSelect = (e:any, id:any) => {
        const newArr = [...propCheckList];
        if(e.target.checked != false){
            setPropCheckList(propCheckList => [...propCheckList, id]);
        } else {
            newArr.splice(newArr.findIndex(item => item === id), 1);
            setPropCheckList(newArr);
        }
    }

    useEffect(() => {
        propertyList();
        propertyListView();
        mastersList();
    }, []);

    return (
        <div className="property_list">
            <div className='d-none'>
                <ThemeBuilder/>
            </div>
            <PropertyToolbar sortByOnChangeProperty={sortByChange} selectedProps={propCheckList} setPropList={setProperties} layoutOnChange={handleHideData} propertiesCount={propertiesCount} body={body} />
            <PropertyDrawer setPropList={setProperties} count={setPropertiesCount} filteredProperties={propertyFiltered}/>            
            <button className='d-none' type='button' id='propertyReloadBtn' onClick={propertyReload}>reload</button>
            <button className='d-none' type='button' id='propertyReloadBtnFilter' onClick={propertyReloadFilter}>reload</button>
            <a className="d-none" href="#" data-bs-toggle='modal' id='property_status_pop' data-bs-target={'#contact_status_change'}></a> 

            <div className="contact_page d-block">
                {/* <div
                    id='kt_property_form'
                    className='bg-opacity-0'
                    data-kt-drawer='true'
                    data-kt-drawer-name='property_filter'
                    data-kt-drawer-activate='true'
                    data-kt-drawer-overlay='true'
                    data-kt-drawer-width="{default:'100%', 'md': '95%'}"
                    data-kt-drawer-direction='end'
                    data-kt-drawer-toggle='#kt_property_add_form_toggle'
                    data-kt-drawer-close='#kt_property_add_form_close'
                >
                    <PropertyDetails propertyId={detailData} setPropertyList={setProperties} tabInfo={detailTab} setDetailClicked={setDetailClick}/>
                </div> */}
                {detailsClicked && 
                <div
                    id={'kt_expand'+detailData}
                    className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                >
                    <PropertyDetails propertyId={detailData} setPropertyList={setProperties} tabInfo={detailTab} setDetailClicked={setDetailClick} setDetailsClicked={setDetailsClicked} body={body} />
                </div>}
            </div>
            <div className='modal fade' id={'contact_status_change'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form noValidate onSubmit={formikNotes.handleSubmit}>
                                <textarea
                                    {...formikNotes.getFieldProps('reply')} 
                                    className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10'
                                    data-kt-autosize='true' id='property_status_change_note'
                                    rows={7}
                                    placeholder='Reason..'
                                />
                                {formikNotes.touched.reply && formikNotes.errors.reply && (
                                    <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                    </div>
                                    </div>
                                )}
                                <div className='d-flex align-items-center justify-content-end'>
                                    <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={(e) => {
                                        // cancelStatusChange();
                                    }}>
                                        {intl.formatMessage({id: 'no'})}
                                    </button>
                                    <button type='submit' disabled={formikNotes.isSubmitting} className='btn btn-sm btn_primary text-primary mt-3'>
                                        {intl.formatMessage({id: 'yes'})}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading ? 
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> :<>
                {toggle == 'grid' && 
                <InfiniteScroll
                    dataLength={properties.length}
                    next={projectListLazyLoad}
                    hasMore={propertiesCount > properties.length}
                    loader={<>
                    <div className='w-100 h-100'>
                        <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                            <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                            <div className="spinner-border taskloader" role="status">                                    
                                <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                            </div>
                        </div> 
                    </div>
                    </>}
                    endMessage={<>
                    {properties.length == 0 ?
                    <div className='w-100 d-flex justify-content-center'>
                        <div>
                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                            <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                        </div>
                    </div> : 
                    <div className='w-100 d-flex justify-content-center'>
                        <div>
                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" />
                            <h4>{intl.formatMessage({id: 'no_more_projects_to_show'})}!!!</h4>
                        </div>
                    </div>}</>}
                >
                <div className="overflow-hidden">
                <div className="row">
                    <div className="card-group">
                    {properties?.map((propertyData, i) => {
                        return(
                        <div className="col-sm-6 col-md-4 col-lg-4 col-xxl-3 col-xl-3 mb-4" key={i} id={"sdfksjfgbuicrgfiurnfegbfwffb"+propertyData.id}>
                            <div className="card h-100 mb-5 mb-xl-8 mx-2 bs_1 property_card">
                                <div className='card-body px-3 pt-3 pb-2 pb-md-0'>
                                    <div className="d-flex align-items-center justify-content-between mb-5">
                                        <div className="d-flex align-items-center">
                                            <form action="">
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" onClick={(e) => propOnSelect(e, propertyData.id)} id={"contact"+propertyData.id}/>
                                                    <label className="form-check-label id_label" htmlFor={"contact"+propertyData.id}>
                                                        {propertyData.id}
                                                    </label>
                                                </div>
                                            </form>
                                            <div className="ms-3 ml-2 d-flex align-items-center">
                                                <p className="mb-0 contact_name pb-1">{propertyData.developer_name}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <a href='#' onClick={() => openModal(propertyData, 'overview')} id="kt_property_add_form_toggle"><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>
                                            <div className="btn-group">
                                                <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                    <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                    <li><a className="dropdown-item" href="#" id="kt_property_add_form_toggle" onClick={() => openModal(propertyData, 'overview')}>{intl.formatMessage({id: 'edit'})}</a></li>
                                                    {currentUser?.designation == 1 && <li><a className="dropdown-item" href="#" data-bs-toggle='modal'
                                                        data-bs-target={'#delete_confirm_popup418'+propertyData.id}>{intl.formatMessage({id: 'delete'})}</a></li>}
                                                </ul>
                                            </div>
                                            <div className='modal fade' id={'delete_confirm_popup418'+propertyData.id} aria-hidden='true'>
                                                <div className='modal-dialog modal-dialog-centered'>
                                                    <div className='modal-content'>
                                                        <div className='modal-header'>
                                                            <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                                                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                                            </div>
                                                        </div>
                                                        <div className='modal-body py-lg-10 px-lg-10'>
                                                            <p>{intl.formatMessage({id: 'are_you_sure_want_to_delete'})}?</p>
                                                            <div className='d-flex align-items-center justify-content-end'>
                                                                <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
                                                                    {intl.formatMessage({id: 'no'})}
                                                                </button>
                                                                <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteModel(propertyData.id)}>
                                                                    {intl.formatMessage({id: 'yes'})}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                        
                                    <div className='mb-3'>
                                        <div className="d-flex gap-3 p-2">
                                            <div className="w-85px h-75px">                                                
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/propertySample.jpg') }} src={propertyData.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/property/profile_image/'+propertyData.id+'/'+propertyData.profile_image : ''} className="br_10 w-100 h-100" alt='' />
                                            </div>
                                            <div className="">
                                                <div>
                                                    <p className="mb-1 fs-8">
                                                        <img src={toAbsoluteUrl('/media/custom/project_type.svg')} className="svg_icon me-1" alt='' />
                                                        {propertyData.name_of_building ?? 'Property Name'}
                                                    </p>
                                                    <p className="mb-1 fs-8">
                                                        <img src={toAbsoluteUrl('/media/custom/lead/location_10.svg')} className="svg_icon me-1" alt='' />{propertyData.locality ?? 'No Address'}</p>
                                                    <div className="d-flex">
                                                        <p className="me-2 fs-8">
                                                            <img src={toAbsoluteUrl('/media/custom/residential.svg')} className="svg_icon me-1" alt='' />
                                                            {propertyData.segment_name ?? 'No Segment'}
                                                        </p>
                                                        <p className='fs-8'>
                                                            <img src={toAbsoluteUrl('/media/custom/flat.svg')} className="svg_icon me-1" alt='' />
                                                            {propertyData.property_type_name ?? 'No type'}
                                                        </p>
                                                    </div>
                                                </div>  
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                                    {propertyData.plot_unit_type != null ? 
                                                    <div className="accordion-item border-0">
                                                        <p className="accordion-header" id="panelsStayOpen-headingOne">
                                                            <button className="accordion-button collapsed py-2 px-xxl-5 px-md-4 px-3 text-dark fw-bold fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_features"+propertyData.id} aria-expanded="true" aria-controls={"property_features"+propertyData.id}>
                                                                {intl.formatMessage({id: 'project_features'})}
                                                            </button>
                                                        </p>                                                        
                                                        <div id={"property_features"+propertyData.id} className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                                                            <div className="accordion property_accordion px-2 py-1" id="property_accordion2">
                                                            {JSON.parse(propertyData.plot_unit_type)?.map((unitData:any, index:any) => {
                                                                if(unitData.quoted_rent_price || unitData.escalation || unitData.security_deposit || unitData.lock_in) {
                                                            return (
                                                                <>
                                                                <div className="accordion-item px-xxl-4" key={index}>
                                                                    <p className="accordion-header d-flex justify-content-between fs-8" id={"headingTwo"}>
                                                                        <button className="accordion-button collapsed fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_info"} aria-expanded="false" aria-controls={"property_info"}>
                                                                        <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon me-1" alt='' />
                                                                        <span className='fs-8'>quote ₹ {unitData.quoted_rent_price}/{unitData.quoted_rent_price_ut}</span>
                                                                        </button>
                                                                        <p className='mb-0 fs-8'>Escalation {unitData.escalation}</p>         
                                                                    </p>
                                                                    <div id={"property_info"} className="accordion-collapse collapse" aria-labelledby={"headingTwo"} data-bs-parent="#property_accordion2">
                                                                        <div className="accordion-body px-0 py-2">
                                                                            <div className="d-flex justify-content-between">
                                                                            <p className='mb-0 fs-8'>deposit ₹ {unitData.security_deposit}</p>
                                                                                <p className='mb-0 fs-8'>lock-in {unitData.lock_in}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                </>
                                                                )} else { return(
                                                                    <div className='accordion-item px-xxl-4 mb-1 fs-8'>
                                                                        {intl.formatMessage({id: 'no_features_available'})}
                                                                    </div>
                                                                )}})}
                                                            </div>
                                                        </div>
                                                    </div> 
                                                    : <>
                                                    <div className="accordion-item border-0">
                                                        <p className="accordion-header" id="panelsStayOpen-headingOne">
                                                            <button className="accordion-button collapsed py-2 px-xxl-5 px-md-4 px-3 text-dark fw-bold fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_features"+propertyData.id} aria-expanded="true" aria-controls={"property_features"+propertyData.id}>
                                                                {intl.formatMessage({id: 'poject_features'})}
                                                            </button>
                                                        </p>
                                                        <div id={"property_features"+propertyData.id} className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                                                            <div className='accordion-item px-xxl-4 mb-1 fs-8'>
                                                            {intl.formatMessage({id: 'no_features_available'})}
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </>}                                        
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <div className="d-flex align-items-center me-2 mb-2">
                                                        <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} alt="" className="icon me-2"/>
                                                        <p className="ml-2 mb-0 fixed_text fs-8">{propertyData.assign_to_name?.split(',').map((data:any) => data.split('-')[0]).join(', ') ?? '--'}</p>
                                                    </div>
                                                    <div className="d-flex align-items-center me-2 mb-2"> 
                                                        <img src={toAbsoluteUrl('/media/custom/calendar.svg')} alt="" className="icon me-2"/>
                                                        <p className="ml-2 mb-0 fixed_text fs-8">{Moment(propertyData.created_at).format('DD-MMMM-YYYY')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer border-0 p-1">
                                        <div className="row">
                                            <div className="col-7 col-xl-8 icons_bar d-flex justify-content-start flex-wrap">
                                                <a href="#" onClick={() => openModal(propertyData, 'notes')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Notes">
                                                    <img src={toAbsoluteUrl('/media/custom/notes.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                        {propertyData.notes_count}
                                                    </span>
                                                </a>
                                                <a href="#" onClick={() => openModal(propertyData, 'files')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="file">
                                                    <img src={toAbsoluteUrl('/media/custom/file.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                        {propertyData.files_count}
                                                    </span>
                                                </a>
                                                {/* <a href="#" onClick={() => openModal(propertyData, 'message')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Message">
                                                    <img src={toAbsoluteUrl('/media/custom/message.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                         0
                                                    </span>
                                                </a> */}
                                                {/* <a href="#" onClick={() => openModal(propertyData, 'sec_contact')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="SecContact">
                                                    <img src={toAbsoluteUrl('/media/custom/sec_contact.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                        {propertyData.}
                                                    </span>
                                                </a> */}
                                                <a href="#" onClick={() => openModal(propertyData, 'leads')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Lead">
                                                    <img src={toAbsoluteUrl('/media/custom/lead.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                        {propertyData.lead_count}
                                                    </span>
                                                </a>
                                                <a href="#" onClick={() => openModal(propertyData, 'tasks')} id="kt_property_add_form_toggle" className="btn btn-sm icon_primary rounded-circle position-relative me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task">
                                                    <img src={toAbsoluteUrl('/media/custom/task.svg')} className="svg_icon" alt='' />
                                                    <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                        {propertyData.task_count}
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
                                                <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn fs-8" aria-label="Default select example" id={'property_statusnkjkjb_rgkbj'+propertyData.id} onChange={(e) => propertyStatusChange(e, propertyData)}>
                                                    {propertyStatus.map((propStatus, i) => {
                                                        return (
                                                        <option value={propStatus.id} selected={propStatus.id == propertyData.property_status} key={i}>{propStatus.option_value}</option>
                                                    )})}
                                            </select>
                                            </div>                                                                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                    </div>
                </div>
                </div>
                </InfiniteScroll>}
                { toggle == 'list' &&
                    <div className="card table_card p-3">
                        <PropertyListView propertyListView={propertiesList} propertyStatus={propertyStatus} propertyStatusChange={propertyStatusChange} propertyList={propertyList} propertyId={propertyId} formikNotes={formikNotes} cancelStatusChange={cancelStatusChange} openModal={openModal} />
                    </div>
                }</>
            }
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_updated_successfully'})}!
                </div>
            </div>
             <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastStatus">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_status_updated_successfully'})}!
                </div>
            </div>
             <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastDeleteStatus">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_status_deleted_successfully'})}!
                </div>
            </div>
             <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastUpdate">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastAdd">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_created_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastUpload">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'project_imported_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="propertyFilterFull">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'filter_limit_reached__delete_any_existing_filter_to_save_a_new_filter'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="propertyErrMsg">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'something_went_wrong'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastAddexist">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'property_name_already_exist'})}!
                </div>
            </div>
        </div>
    )
}

export {PlotList}
