import bootstrap, { Offcanvas, Toast } from 'bootstrap';
import React,{FC, useEffect, useState} from 'react'
import { ContactSettingsDrawer } from './contactSettingDrawer';
import { ContactSettingToolbar } from './contactSettingToolbar';
import { getContactSetting, getDeleteContactSetting } from './core/_requests';
import moment from 'moment';
import { useAuth } from '../../../modules/auth';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { ContactSettingEdit } from './contactSettingEdit';
import { useIntl } from 'react-intl';


const ContactSettings: FC = () => {

    const [contactSetting, setContactSetting] = useState<any[]>([]);
    const [contactEditData, setContactEditData] = useState<any[]>([]);
    const [contactEditClicked, setContactEditClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contactSettingId, setContactSettingId] = useState<any>('');
    const {currentUser, logout} = useAuth();
    const intl = useIntl();

    const contactSettingList =  async () => {  
        setLoading(true) 
        const Response = await getContactSetting()
        setContactSetting(Response.output);
        setLoading(false)
    }

    const contactSettingDetails = (data:any) => {
        setContactEditData(data);
        setContactEditClicked(true);
    }

    const deleteContactSetting = async (deleteid:any) => {
        setLoading(true)
        await getDeleteContactSetting(contactSettingId);
        contactSettingList();
        setContactSettingId('')
        var toastEl = document.getElementById('contact_setting_delete');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setLoading(false)
    }

      useEffect(() => {
        contactSettingList();
    }, []);
    
    return(
        <>
            <ContactSettingsDrawer />
            <ContactSettingToolbar/>
               <div>
               <div
                    id='kt_editcontactsettings'
                    className='bg-white side_drawer'
                    data-kt-drawer='true'
                    data-kt-drawer-name='contact_setting'
                    data-kt-drawer-activate='true'
                    data-kt-drawer-overlay='true'
                    data-kt-drawer-width="{default:'100%', 'md': '700px'}"
                    data-kt-drawer-direction='end'
                    data-kt-drawer-toggle='#kt_contact_setting_edit_toggle'
                    data-kt-drawer-close='#kt_contact_setting_edit_close'
                >
                    <ContactSettingEdit ContactSettingData={contactEditData} EditClickedCS={contactEditClicked}/>
                </div> 
                {loading ? 
                    <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div>:
                <div>
                    <button className='d-none' id='contactSetting_reload' onClick={contactSettingList}></button>  
                    {contactSetting?.length > 0 ? <>
                    <div className="row">
                        <div className="card-group">
                        {contactSetting?.map((CSData, i) => {
                                return(
                            <div className="col-sm-6 col-xxl-3 col-xl-4 mb-3" key={CSData.id}>
                                <div className="card h-100 mb-5 mb-xl-8 mx-2 bs_1">
                                    <div className='card-body px-3 pt-3 pb-0'>
                                        <div className="d-flex align-items-center justify-content-between mb-5">
                                            <div className="d-flex align-items-center">                                                
                                                <form action="">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id={"exampleCheck"+CSData.id}/>
                                                        <label className="form-check-label id_label" htmlFor={"exampleCheck"+CSData.id}>
                                                            {CSData.id}
                                                        </label>
                                                    </div>
                                                </form>                                                
                                            </div>
                                            <div className="d-flex">
                                            <a href='#'><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="leadicon me-2" id='kt_contact_setting_edit_toggle' onClick={(e) => contactSettingDetails(CSData)}/></a>
                                            <div className="btn-group">
                                                <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                    <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="leadicon me-2"/>
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                    <li><a className="dropdown-item" id='kt_contact_setting_edit_toggle' onClick={(e) => contactSettingDetails(CSData)}>{intl.formatMessage({id: 'edit'})}</a></li>
                                                    <li><a className="dropdown-item" href="#" data-bs-toggle='modal'
                                                        data-bs-target={'#delete_confirm_popup41eryheryhrh8'} onClick={() => setContactSettingId(CSData.id)}>{intl.formatMessage({id: 'delete'})}</a></li>
                                                </ul>
                                            </div>
                                            <div className='modal fade' id={'delete_confirm_popup41eryheryhrh8'} aria-hidden='true'>
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
                                                                <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteContactSetting(CSData.id)}>
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
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="row">                                                        
                                                        <div className="col-sm-6 col-6 mb-3">
                                                            <div className="task_content_single">
                                                                <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/google_ads.svg')} alt="" className="leadicon me-2"/>
                                                                    <div className="d-flex flex-column">
                                                                        <small className="text_light">{intl.formatMessage({id: 'source'})}</small>
                                                                        <p className="mb-0 fw-500">{CSData.source_name}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-6 mb-3">
                                                            <div className="task_content_single">
                                                                <div className="d-flex align-items-start single_item">
                                                                    <img src={toAbsoluteUrl('/media/custom/calendar.svg')} alt="" className="leadicon me-2"/>
                                                                    <div className="d-flex flex-column">
                                                                        <small className="text_light">{intl.formatMessage({id: 'ceated_at'})}</small>
                                                                        <p className="mb-0 fw-500">{moment(CSData.created_at).format('DD-MMMM-YYYY')}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-6 mb-3">
                                                            <div className="task_content_single">
                                                                <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/google_ads.svg')} alt="" className="leadicon me-2"/>
                                                                    <div className="d-flex flex-column">
                                                                        <small className="text_light">{intl.formatMessage({id: 'project'})}</small>
                                                                        {/* <p className="mb-0 fw-500">{CSData.property_name.replace(/,/g, ', ')}</p> */}
                                                                        <ul className="mb-0 fw-500 ps-0">{CSData.property_name?.split(',').map((data:any, i:any) => {
                                                                                return(
                                                                                <li key={i}>{data.split('-')[0]}</li>
                                                                                )
                                                                            })}</ul> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-6 mb-3" title={CSData.user_name}>
                                                            <div className="task_content_single overflow-hidden">
                                                                <div className="d-flex align-items-start single_item">
                                                                    <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="leadicon me-2"/>
                                                                    <div className="d-flex flex-column">
                                                                        <small className="text_light">{intl.formatMessage({id: 'members'})}</small>
                                                                        <ul className="mb-0 fw-500 ps-0">{CSData.user_name?.split(',').map((data:any, i:any) => {
                                                                                return(
                                                                                <li key={i}>{data.split('-')[0]}</li>
                                                                                )
                                                                            })}</ul>                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>                                                        
                                                    </div>  
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                            )})}
                        </div>
                    </div> </> : 
                    <div className='w-100 d-flex justify-content-center'>
                        <div className=''>
                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                            <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                        </div>
                    </div>}
                </div>} 
                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contact_setting_update">
                    <div className="toast-header">
                            <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                            <button aria-label="Close" className="btn-close" 
                                    data-bs-dismiss="toast" type="button">
                            </button>
                    </div>
                    <div className="toast-body">
                        {intl.formatMessage({id: 'contact_setting_updated_successfully'})}!
                    </div>
                </div>
                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contact_setting_save">
                    <div className="toast-header">
                            <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                            <button aria-label="Close" className="btn-close" 
                                    data-bs-dismiss="toast" type="button">
                            </button>
                    </div>
                    <div className="toast-body">
                        {intl.formatMessage({id: 'contact_setting_created_successfully'})}!
                    </div>
                </div>
                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contact_setting_delete">
                    <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                    </div>
                    <div className="toast-body">
                        {intl.formatMessage({id: 'contact_setting_deleted_successfully'})}!
                    </div>
                </div>           
                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contact_setting_error">
                    <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                    </div>
                    <div className="toast-body">
                        {intl.formatMessage({id: 'something_went_wrong'})}!
                    </div>
                </div>           
                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contact_setting_exist">
                    <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                    </div>
                    <div className="toast-body">
                        {intl.formatMessage({id: 'contact_setting_already_exist'})}!
                    </div>
                </div>           
            </div>
            </>
    )
}

export {ContactSettings}