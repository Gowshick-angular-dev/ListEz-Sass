import React,{FC} from 'react'
import {Link} from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { useAuth } from '../../modules/auth';
import {useIntl} from 'react-intl'
import { ThemeBuilder } from './ThemeBuilder/themeBuilder';

const Settings: FC = () => {
    const intl = useIntl();
    const {currentUser, logout} = useAuth();

    const userId = currentUser?.id;

    return(
        <div className="settings_page p-4 h-100">
            <div className='d-none'>
                <ThemeBuilder/>
            </div>
            <section>
                <div className="row">
                    <div className="card-group">                        
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/organization-settings'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl('/media/custom/project.svg')} alt="" className="icon mb-4"/>   
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'organization'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>                       
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/user-settings'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="icon mb-4"/>   
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'user_management'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/org_masters'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/abstract/abs027.svg")} className="icon mb-4" />   
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'masters'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/emailSettingsTrigger'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center mb-4">
                                        <div className='position-relative px-7'>
                                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/com011.svg")} className="icon" />   
                                        <span className="svg-icon svg-icon svg-icon-muted svg-icon-2hx position-absolute" style={{left:75, bottom: 10}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M22.1 11.5V12.6C22.1 13.2 21.7 13.6 21.2 13.7L19.9 13.9C19.7 14.7 19.4 15.5 18.9 16.2L19.7 17.2999C20 17.6999 20 18.3999 19.6 18.7999L18.8 19.6C18.4 20 17.8 20 17.3 19.7L16.2 18.9C15.5 19.3 14.7 19.7 13.9 19.9L13.7 21.2C13.6 21.7 13.1 22.1 12.6 22.1H11.5C10.9 22.1 10.5 21.7 10.4 21.2L10.2 19.9C9.4 19.7 8.6 19.4 7.9 18.9L6.8 19.7C6.4 20 5.7 20 5.3 19.6L4.5 18.7999C4.1 18.3999 4.1 17.7999 4.4 17.2999L5.2 16.2C4.8 15.5 4.4 14.7 4.2 13.9L2.9 13.7C2.4 13.6 2 13.1 2 12.6V11.5C2 10.9 2.4 10.5 2.9 10.4L4.2 10.2C4.4 9.39995 4.7 8.60002 5.2 7.90002L4.4 6.79993C4.1 6.39993 4.1 5.69993 4.5 5.29993L5.3 4.5C5.7 4.1 6.3 4.10002 6.8 4.40002L7.9 5.19995C8.6 4.79995 9.4 4.39995 10.2 4.19995L10.4 2.90002C10.5 2.40002 11 2 11.5 2H12.6C13.2 2 13.6 2.40002 13.7 2.90002L13.9 4.19995C14.7 4.39995 15.5 4.69995 16.2 5.19995L17.3 4.40002C17.7 4.10002 18.4 4.1 18.8 4.5L19.6 5.29993C20 5.69993 20 6.29993 19.7 6.79993L18.9 7.90002C19.3 8.60002 19.7 9.39995 19.9 10.2L21.2 10.4C21.7 10.5 22.1 11 22.1 11.5ZM12.1 8.59998C10.2 8.59998 8.6 10.2 8.6 12.1C8.6 14 10.2 15.6 12.1 15.6C14 15.6 15.6 14 15.6 12.1C15.6 10.2 14 8.59998 12.1 8.59998Z" fill="black"></path><path d="M17.1 12.1C17.1 14.9 14.9 17.1 12.1 17.1C9.30001 17.1 7.10001 14.9 7.10001 12.1C7.10001 9.29998 9.30001 7.09998 12.1 7.09998C14.9 7.09998 17.1 9.29998 17.1 12.1ZM12.1 10.1C11 10.1 10.1 11 10.1 12.1C10.1 13.2 11 14.1 12.1 14.1C13.2 14.1 14.1 13.2 14.1 12.1C14.1 11 13.2 10.1 12.1 10.1Z" fill="black"></path></svg></span></div>
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'email_settings'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/localization'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/general/gen018.svg")} className="icon mb-4" />   
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'localization'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/integrations'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/general/arrow.svg")} className="icon mb-4" /> 
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'integrations'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/translations'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/general/lang.svg")} className="icon mb-4" />  
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'languages'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/alertsAndNotificationSettings'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/com004.svg")} className="icon mb-4" />  
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'alerts_and_notification_settings'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/Templates'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/art/art002.svg")} className="icon mb-4" />   
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'templates'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/themeBuilder'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/abstract/abs047.svg")} className="icon mb-4" />  
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'theme_builder'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/crafted/account/settings'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/com006.svg")} className="icon mb-4" />  
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'my_profile'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div> */}
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-6">
                            <Link to='/menu/settings/contactSettings'>
                                <div className="card h-100 bs_1 mx-3">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center mb-4">
                                        <div className='position-relative px-7'>
                                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/com005.svg")} className="icon" /> 
                                        <span className="svg-icon svg-icon svg-icon-muted svg-icon-2hx position-absolute end-0 bottom-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M22.1 11.5V12.6C22.1 13.2 21.7 13.6 21.2 13.7L19.9 13.9C19.7 14.7 19.4 15.5 18.9 16.2L19.7 17.2999C20 17.6999 20 18.3999 19.6 18.7999L18.8 19.6C18.4 20 17.8 20 17.3 19.7L16.2 18.9C15.5 19.3 14.7 19.7 13.9 19.9L13.7 21.2C13.6 21.7 13.1 22.1 12.6 22.1H11.5C10.9 22.1 10.5 21.7 10.4 21.2L10.2 19.9C9.4 19.7 8.6 19.4 7.9 18.9L6.8 19.7C6.4 20 5.7 20 5.3 19.6L4.5 18.7999C4.1 18.3999 4.1 17.7999 4.4 17.2999L5.2 16.2C4.8 15.5 4.4 14.7 4.2 13.9L2.9 13.7C2.4 13.6 2 13.1 2 12.6V11.5C2 10.9 2.4 10.5 2.9 10.4L4.2 10.2C4.4 9.39995 4.7 8.60002 5.2 7.90002L4.4 6.79993C4.1 6.39993 4.1 5.69993 4.5 5.29993L5.3 4.5C5.7 4.1 6.3 4.10002 6.8 4.40002L7.9 5.19995C8.6 4.79995 9.4 4.39995 10.2 4.19995L10.4 2.90002C10.5 2.40002 11 2 11.5 2H12.6C13.2 2 13.6 2.40002 13.7 2.90002L13.9 4.19995C14.7 4.39995 15.5 4.69995 16.2 5.19995L17.3 4.40002C17.7 4.10002 18.4 4.1 18.8 4.5L19.6 5.29993C20 5.69993 20 6.29993 19.7 6.79993L18.9 7.90002C19.3 8.60002 19.7 9.39995 19.9 10.2L21.2 10.4C21.7 10.5 22.1 11 22.1 11.5ZM12.1 8.59998C10.2 8.59998 8.6 10.2 8.6 12.1C8.6 14 10.2 15.6 12.1 15.6C14 15.6 15.6 14 15.6 12.1C15.6 10.2 14 8.59998 12.1 8.59998Z" fill="black"></path><path d="M17.1 12.1C17.1 14.9 14.9 17.1 12.1 17.1C9.30001 17.1 7.10001 14.9 7.10001 12.1C7.10001 9.29998 9.30001 7.09998 12.1 7.09998C14.9 7.09998 17.1 9.29998 17.1 12.1ZM12.1 10.1C11 10.1 10.1 11 10.1 12.1C10.1 13.2 11 14.1 12.1 14.1C13.2 14.1 14.1 13.2 14.1 12.1C14.1 11 13.2 10.1 12.1 10.1Z" fill="black"></path></svg></span>
                                        </div>
                                        <h3 className="text-capitalize mt-3 mb-3 text-center">{intl.formatMessage({id: 'contact_settings'})}</h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export {Settings}