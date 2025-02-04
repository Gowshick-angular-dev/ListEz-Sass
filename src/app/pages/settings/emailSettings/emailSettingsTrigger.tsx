import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import { useFormik } from 'formik';
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { getOrganizationTheme, updateOrganizationTheme } from '../ThemeBuilder/request';
import { getEmailSwitchSettings, updateEmailSwitchSettings } from './_requests';

const initialValues = {
    whatsapp_api: '',
    whatsapp_token: '',
    smtp_user_name: '',
    smtp_password: '',
    smtp_host: '',
    smtp_port: '',
}

const EmailSettingsPage: FC = () => {
    const intl = useIntl();
    const {currentUser, setCurrentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [emailTriggers, setEmailTriggers] = useState<any>({});

    const emailTiggerList = async () => {
        const response = await getEmailSwitchSettings()
        setEmailTriggers(response.output);
    }

    useEffect(() => {
        emailTiggerList();
    }, []);
    
    return(
        <div>
            <form noValidate>
            <div className="">
                <div className="card-group">
                    <div className="w-100 w-md-75 w-xl-50 mx-auto">
                        <div className="card h-100 bs_1 mx-2 mb-2">
                            <div className="card-header d-flex align-items-center">
                                <h3>{intl.formatMessage({id: 'email_trigger_settings'})}</h3>
                            </div>
                            <div className="card-body">
                                <div className="accordion" id="prop_accordion"> 
                                    <div className="accordion-item" id='bassicDetails'>
                                        <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            {intl.formatMessage({id: 'basic_settings'})}
                                            </button>
                                        </h2>
                                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'organization_welcome'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="organization_welcome" defaultChecked={emailTriggers.organization_welcome == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("organization_welcome", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="organization_welcome"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'forget_password'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="forget_password" defaultChecked={emailTriggers.forget_password == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("forget_password", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="forget_password"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'change_password'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="change_password" defaultChecked={emailTriggers.change_password == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("change_password", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="change_password"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'user_registration'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="user_registration" defaultChecked={emailTriggers.user_registration == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("user_registration", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="user_registration"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'birthday_wish'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="birthday_wish" defaultChecked={emailTriggers.birthday_wish == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("birthday_wish", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="birthday_wish"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'anniversary_wish'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="anniversary_wish" defaultChecked={emailTriggers.anniversary_wish == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("anniversary_wish", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="anniversary_wish"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'milestone_wish'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="milestone_wish" defaultChecked={emailTriggers.milestone_wish == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("milestone_wish", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="milestone_wish"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'attendance_remainder'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="attendance_remainder" defaultChecked={emailTriggers.attendance_remainder == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("attendance_remainder", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="attendance_remainder"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'task_due_remainder'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="task_due_remainder" defaultChecked={emailTriggers.task_due_remainder == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("task_due_remainder", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="task_due_remainder"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'lead_registration'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="lead_registration" defaultChecked={emailTriggers.lead_registration == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("lead_registration", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="lead_registration"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item" id='locationDetails'>
                                        <h2 className="accordion-header" id="headingtwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#two" aria-expanded="false" aria-controls="two">
                                            {intl.formatMessage({id: 'creation_settings'})}
                                            </button>
                                        </h2>
                                        <div id="two" className="accordion-collapse collapse" aria-labelledby="headingtwo" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'contact_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="contact_created" defaultChecked={emailTriggers.contact_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("contact_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="contact_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'lead_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="lead_created" defaultChecked={emailTriggers.lead_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("lead_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="lead_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'project_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="project_created" defaultChecked={emailTriggers.project_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("project_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="project_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'transaction_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="transaction_created" defaultChecked={emailTriggers.transaction_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("transaction_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="transaction_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'task_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="task_created" defaultChecked={emailTriggers.task_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("task_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="task_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'note_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="note_created" defaultChecked={emailTriggers.note_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("note_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="note_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'fee_confirmation_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="fee_confirmation_created" defaultChecked={emailTriggers.fee_confirmation_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("fee_confirmation_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="fee_confirmation_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'invoice_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="invoice_created" defaultChecked={emailTriggers.invoice_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("invoice_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="invoice_created"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'ticket_created'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="ticket_created" defaultChecked={emailTriggers.ticket_created == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("ticket_created", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="ticket_created"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item" id='residential'>
                                        <h2 className="accordion-header" id="headingthree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#three" aria-expanded="false" aria-controls="three">
                                                {intl.formatMessage({id: 'assign_settings'})}
                                            </button>
                                        </h2>
                                        <div id="three" className="accordion-collapse collapse" aria-labelledby="headingthree" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">                                                
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'contact_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="contact_assigned" defaultChecked={emailTriggers.contact_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("contact_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="contact_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'lead_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="lead_assigned" defaultChecked={emailTriggers.lead_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("lead_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="lead_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'project_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="project_assigned" defaultChecked={emailTriggers.project_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("project_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="project_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'transaction_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="transaction_assigned" defaultChecked={emailTriggers.transaction_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("transaction_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="transaction_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'task_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="task_assigned" defaultChecked={emailTriggers.task_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("task_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="task_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'notes_tagging'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="notes_tagging" defaultChecked={emailTriggers.notes_tagging == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("notes_tagging", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="notes_tagging"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'fee_confirmation_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="fee_confirmation_assigned" defaultChecked={emailTriggers.fee_confirmation_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("fee_confirmation_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="fee_confirmation_assigned"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'invoice_assigned'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="invoice_assigned" defaultChecked={emailTriggers.invoice_assigned == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("invoice_assigned", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="invoice_assigned"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item" id='residentialUnits'>
                                        <h2 className="accordion-header" id="headingfour">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#four" aria-expanded="false" aria-controls="four">
                                                {intl.formatMessage({id: 'edit_settings'})}
                                            </button>
                                        </h2>
                                        <div id="four" className="accordion-collapse collapse" aria-labelledby="headingfour" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">                                                
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'phone_number_changed'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="phone_number_changed" defaultChecked={emailTriggers.phone_number_changed == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("phone_number_changed", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="phone_number_changed"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'mail_changed'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="mail_changed" defaultChecked={emailTriggers.mail_changed == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("mail_changed", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="mail_changed"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'name_changed'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="name_changed" defaultChecked={emailTriggers.name_changed == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("name_changed", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="name_changed"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'project_edit'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="project_edit" defaultChecked={emailTriggers.project_edit == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("project_edit", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="project_edit"></label>
                                                            </div>
                                                        </div>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item" id='projectDescription'>
                                        <h2 className="accordion-header" id="headingfive">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#five" aria-expanded="false" aria-controls="five">
                                                {intl.formatMessage({id: 'downloads_settings'})}
                                            </button>
                                        </h2>
                                        <div id="five" className="accordion-collapse collapse" aria-labelledby="headingfive" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'downloads'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="downloads" defaultChecked={emailTriggers.downloads == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("downloads", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="downloads"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item" id='projectFilesUpload'>
                                        <h2 className="accordion-header" id="headingsix">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#six" aria-expanded="false" aria-controls="six">
                                        {intl.formatMessage({id: 'finance_settings'})}
                                            </button>
                                        </h2>
                                        <div id="six" className="accordion-collapse collapse" aria-labelledby="headingsix" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'invoice_change'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="invoice_change" defaultChecked={emailTriggers.invoice_change == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("invoice_change", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="invoice_change"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'new_collection'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="new_collection" defaultChecked={emailTriggers.new_collection == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("new_collection", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="new_collection"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'new_expense'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="new_expense" defaultChecked={emailTriggers.new_expense == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("new_expense", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="new_expense"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'due_payment_remainder'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="due_payment_remainder" defaultChecked={emailTriggers.due_payment_remainder == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("due_payment_remainder", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="due_payment_remainder"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                    
                                    <div className="accordion-item" id='reassign_settings'>
                                        <h2 className="accordion-header" id="headingseven">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seven" aria-expanded="false" aria-controls="seven">
                                        {intl.formatMessage({id: 'reassign_settings'})}
                                            </button>
                                        </h2>
                                        <div id="seven" className="accordion-collapse collapse" aria-labelledby="headingseven" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'reassign_notification'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="reassign_notification" defaultChecked={emailTriggers.reassign_notification == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("reassign_notification", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="reassign_notification"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                    
                                    <div className="accordion-item" id='drop_settings'>
                                        <h2 className="accordion-header" id="headingeight">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#eight" aria-expanded="false" aria-controls="eight">
                                        {intl.formatMessage({id: 'drop_settings'})}
                                            </button>
                                        </h2>
                                        <div id="eight" className="accordion-collapse collapse" aria-labelledby="headingeight" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'drop'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="drop" defaultChecked={emailTriggers.drop == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("drop", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="drop"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                    
                                    <div className="accordion-item" id='update_settings'>
                                        <h2 className="accordion-header" id="headingnine">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#nine" aria-expanded="false" aria-controls="nine">
                                        {intl.formatMessage({id: 'update_settings'})}
                                            </button>
                                        </h2>
                                        <div id="nine" className="accordion-collapse collapse" aria-labelledby="headingnine" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'status_update'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="status_update" defaultChecked={emailTriggers.status_update == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("status_update", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="status_update"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'notes_reply_update'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="notes_reply_update" defaultChecked={emailTriggers.notes_reply_update == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("notes_reply_update", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="notes_reply_update"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'file_upload'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="file_upload" defaultChecked={emailTriggers.file_upload == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("file_upload", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="file_upload"></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                    
                                    <div className="accordion-item" id='reports_settings'>
                                        <h2 className="accordion-header" id="headingten">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ten" aria-expanded="false" aria-controls="ten">
                                        {intl.formatMessage({id: 'reports_settings'})}
                                            </button>
                                        </h2>
                                        <div id="ten" className="accordion-collapse collapse" aria-labelledby="headingten" data-bs-parent="#prop_accordion">
                                            <div className="accordion-body">
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'daily_report'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="daily_report" defaultChecked={emailTriggers.daily_report == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("daily_report", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="daily_report"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'weekly_report'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="weekly_report" defaultChecked={emailTriggers.weekly_report == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("weekly_report", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="weekly_report"></label>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3'>
                                                            <span>{intl.formatMessage({id: 'monthly_report'})}</span>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="monthly_report" defaultChecked={emailTriggers.monthly_report == 1 ? true : false} onChange={async (e) => {
                                                                    await updateEmailSwitchSettings("monthly_report", e.target.value)
                                                                }}/>
                                                                <label className="form-check-label" htmlFor="monthly_report"></label>
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
                    <div className="col-lg-6 col-sm-6 d-none">
                        <div className="card h-100 bs_1 mx-2 mb-2">
                            <div className="card-header d-flex align-items-center">
                                <h3>{intl.formatMessage({id: 'module_setting'})}</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-group d-flex flex-column mb-4">
                                    <label htmlFor="contactColor" className="form-label">{intl.formatMessage({id: 'contact'})}:</label>
                                    <input type="color" id="contactColor" name="contactColor" defaultValue="#ff6700"/>
                                </div>
                                <div className="form-group d-flex flex-column mb-4">
                                    <label htmlFor="leadColor" className="form-label">{intl.formatMessage({id: 'lead'})}</label>
                                    <input type="color" id="leadColor" name="leadColor" defaultValue="#e6e6e6"/>
                                </div>
                                <div className="form-group d-flex flex-column mb-4">
                                    <label htmlFor="projectColor" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                    <input type="color" id="projectColor" name="projectColor" defaultValue="#f5f8fa"/>
                                </div>
                                <div className="form-group d-flex flex-column mb-4">
                                    <label htmlFor="taskColor" className="form-label">{intl.formatMessage({id: 'task'})}</label>
                                    <input type="color" id="taskColor" name="taskColor" defaultValue="#f6f6f6"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </form>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="orgBSUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'integrations_updated_successfully'})}!
                </div>
            </div>
        </div>
    )
}

export {EmailSettingsPage}
