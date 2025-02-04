import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import { useFormik } from 'formik';
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { getOrganizationTheme, updateOrganizationTheme } from '../ThemeBuilder/request';

const initialValues = {
    contact_save_timer: '',
    logout_timer: '',
    attendance_half_day: '',
    attendance_absent_day: '',
    daily_report: '',
    weekly_report: '',
    monthly_report: '',
    check_in_time: '',
}

const OrgSettingsPage: FC = () => {
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [projectDuplicate, setProjectDuplicate] = useState(false);

    const bussinessSettings = async () => {
        const response = await getOrganizationTheme()
        console.log("lhfieuriurgwe", response.output);
        if(response.status == 200) {
            formik.setFieldValue('contact_save_timer', response.output?.contact_save_timer);
            formik.setFieldValue('logout_timer', response.output?.logout_timer);
            formik.setFieldValue('attendance_half_day', response.output?.attendance_half_day);
            formik.setFieldValue('attendance_absent_day', response.output?.attendance_absent_day);
            formik.setFieldValue('daily_report', response.output?.daily_report);
            formik.setFieldValue('weekly_report', response.output?.weekly_report);
            formik.setFieldValue('monthly_report', response.output?.monthly_report);
            formik.setFieldValue('check_in_time', response.output?.check_in_time);
            setProjectDuplicate(() => {
                return response.output?.project_duplicate == '1' ? true : false;
            });
        }         
    }

    useEffect(() => {
        bussinessSettings();
    }, []);

    const formik = useFormik({
        initialValues,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            setLoading(true);
            try {
                var formData = new FormData();
                formData.append('contact_save_timer', values.contact_save_timer);
                formData.append('logout_timer', values.logout_timer);
                formData.append('attendance_half_day', values.attendance_half_day);
                formData.append('attendance_absent_day', values.attendance_absent_day);
                formData.append('daily_report', values.daily_report);
                formData.append('weekly_report', values.weekly_report);
                formData.append('monthly_report', values.monthly_report);
                formData.append('check_in_time', values.check_in_time);
                formData.append('project_duplicate', projectDuplicate ? '1' : '0');

                const updatethemeData = await updateOrganizationTheme(formData);
                if (updatethemeData.status == 200) {
                    setLoading(false);
                    localStorage.setItem('logoutIn', values.logout_timer);
                    var toastEl = document.getElementById('orgBSUpdate');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } catch (error) {
                console.error(error)
                setStatus('The registration details is incorrect')
                setSubmitting(false)
                setLoading(false)
            }
        }
    })
    
    return(
        <div>
            <form noValidate onSubmit={formik.handleSubmit}>
                <div className="">
                    <div className="card-group">
                        <div className="w-100 w-md-75 w-xl-50 mx-auto">
                            <div className="card h-100 bs_1 mx-2 mb-2">
                                <div className="card-header d-flex align-items-center">
                                    <h3>{intl.formatMessage({id: 'organization_settings'})}</h3>
                                </div>
                                <div className="card-body">                                                                       
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'system_will_automatically_logged_out_if_the_system_idle_for_more_than_this_timer'})}>
                                        <span className=''>{intl.formatMessage({id: 'logout_timer'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='text'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('logout_timer')}
                                                onChange={(e) => formik.setFieldValue("logout_timer", e.target?.value.replace(/[^0-9]/g, ""))}
                                                maxLength={3}
                                            />
                                            <span className="">Minutes</span>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'absent_will_be_saved_after_checking_in_this_time'})}>
                                        <span className=''>{intl.formatMessage({id: 'check_in_button_enable_time'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('check_in_time')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                   
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'half_day_attendance_will_be_saved_after_checking_in_this_time'})}>
                                        <span className=''>{intl.formatMessage({id: 'half_day_if_checked_in_after'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('attendance_half_day')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                   
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'absent_will_be_saved_after_checking_in_this_time'})}>
                                        <span className=''>{intl.formatMessage({id: 'absent_if_checked_in_after'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('attendance_absent_day')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                     
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'daily_report'})}>
                                        <span className=''>{intl.formatMessage({id: 'daily_report'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('daily_report')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                     
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'weekly_report'})}>
                                        <span className=''>{intl.formatMessage({id: 'weekly_report'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('weekly_report')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                     
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'monthly_report'})}>
                                        <span className=''>{intl.formatMessage({id: 'monthly_report'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='time'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('monthly_report')}
                                            />
                                            </div>
                                        </div>
                                    </div>                                     
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'contact_with_same_phone_number_and_same_email_was_not_saved_before_this_day_count'})}>
                                        <span className=''>{intl.formatMessage({id: 'duplicate_contact_save_after'})}</span>                                            
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='d-flex flex-nowrap align-items-center border p-3 br_5'>
                                            <input
                                                type='text'
                                                className='form-control border-0 p-0'
                                                {...formik.getFieldProps('contact_save_timer')}
                                                onChange={(e) => formik.setFieldValue("contact_save_timer", e.target?.value.replace(/[^0-9]/g, ""))}
                                                maxLength={3}
                                            />
                                            <span className="">Days</span>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className='row mb-6'>
                                        <label className='col-lg-6 col-form-label fw-bold fs-6' title={intl.formatMessage({id: 'absent_will_be_saved_after_checking_in_this_time'})}>
                                            <span className=''>{intl.formatMessage({id: 'property_duplicate'})}</span>    
                                        </label>
                                        <div className='col-lg-6'>
                                            <div className='h-100 d-flex justify-content-end align-items-center' >
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={projectDuplicate} onChange={(e) => setProjectDuplicate(e.target.checked)}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-end'>
                                        <button
                                            type='submit'
                                            id='kt_add_org_submit'
                                            className='btn btn_primary text-primary'
                                            disabled={formik.isSubmitting}
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
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="orgBSUpdate">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'organization_settings_updated_successfully'})}!
                </div>
            </div>
        </div>
    )
}

export {OrgSettingsPage}
