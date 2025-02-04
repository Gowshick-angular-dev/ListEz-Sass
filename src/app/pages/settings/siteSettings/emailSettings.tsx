import React,{FC, useEffect, useState} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { Toast } from 'bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getBusinessSettings, updateBusinessSettings } from './core/_requests';
import { useAuth } from '../../../modules/auth';

const initialValues = {
    "mail_driver": "",
    "mail_host": "",
    "mail_port": "",
    "mail_username": "",
    "mail_password": "",
    "mail_encryption": "",
    "mail_from_address": "",
    "mail_from_name": "",
}

const MailSetting:FC = () => {

    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const roleId = currentUser?.id;
    const [loading, setLoading] = useState(false);
    const [businessSettings, setBusinessSettings] = useState<any>({});

    const siteSchema = Yup.object().shape({
        mail_driver: Yup.string(),
        mail_host: Yup.string(),
        mail_port: Yup.string(),
        mail_username: Yup.string(),
        mail_password: Yup.string(),
        mail_encryption: Yup.string(),
        mail_from_address: Yup.string(),
        mail_from_name: Yup.string(),
    })

    const getBusinessSetting = async () => {
        const response = await getBusinessSettings();
        setBusinessSettings(response.output)
        formik.setFieldValue("mail_driver", response.output?.mail_driver);
        formik.setFieldValue("mail_host", response.output?.mail_host);
        formik.setFieldValue("mail_port", response.output?.mail_port);
        formik.setFieldValue("mail_username", response.output?.mail_username);
        formik.setFieldValue("mail_password", response.output?.mail_password);
        formik.setFieldValue("mail_encryption", response.output?.mail_encryption);
        formik.setFieldValue("mail_from_address", response.output?.mail_from_address);
        formik.setFieldValue("mail_from_name", response.output?.mail_from_name);
    }

    const formik = useFormik({
        initialValues,
        validationSchema: siteSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          
          try {    
            let formData = new FormData();
                formData.append("mail_driver", values.mail_driver)
                formData.append("mail_host", values.mail_host)
                formData.append("mail_port", values.mail_port)
                formData.append("mail_username", values.mail_username)
                formData.append("mail_password", values.mail_password)
                formData.append("mail_encryption", values.mail_encryption)
                formData.append("mail_from_address", values.mail_from_address)
                formData.append("mail_from_name", values.mail_from_name)
                  
                const updateData = await updateBusinessSettings(formData);
                setBusinessSettings(updateData.output);
                setLoading(false)
                var toastEl = document.getElementById('siteSettingUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    useEffect(() => {
        if(roleId == 1) {
            getBusinessSetting();
        }
    }, [roleId]);
    
    return(
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>
            <div className='flex-lg-row-fluid'>                     
                <div className="card bs_2 w-xl-50 w-md-75 w-100 mx-auto"> 
                    <div className='card-header w-100 d-flex align-items-center'>
                        <h3>{intl.formatMessage({id: 'email_settings'})}</h3>
                        <div className='card-toolbar'>
                            {/* <span onClick={() => editCancel()} data-bs-toggle='modal' data-bs-target={'#subscription_form'}>
                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted svg-icon-2hx" />
                            </span> */}
                        </div>
                    </div> 
                    <div className='card-body sus_height'>
                        {loading ? 
                        <div className='w-100 h-100'>
                            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                <div className="spinner-border taskloader" role="status">                                    
                                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                </div>
                            </div> 
                        </div> : <>
                            <div className=''>
                                <div className=''>
                                    <form className='w-100' noValidate onSubmit={formik.handleSubmit}>
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_driver'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_driver')}/> 
                                            </div>
                                            {formik.touched.mail_driver && formik.errors.mail_driver && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_driver}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_host'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_host')}/> 
                                            </div>
                                            {formik.touched.mail_host && formik.errors.mail_host && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_host}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_port'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_port')}/> 
                                            </div>
                                            {formik.touched.mail_port && formik.errors.mail_port && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_port}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_username'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_username')}/> 
                                            </div>
                                            {formik.touched.mail_username && formik.errors.mail_username && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_username}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_password'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_password')}/> 
                                            </div>
                                            {formik.touched.mail_password && formik.errors.mail_password && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_password}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_encryption'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_encryption')}/> 
                                            </div>
                                            {formik.touched.mail_encryption && formik.errors.mail_encryption && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_encryption}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_from_address'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_from_address')}/> 
                                            </div>
                                            {formik.touched.mail_from_address && formik.errors.mail_from_address && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_from_address}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className="row mb-6">
                                            <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'mail_from_name'})}</label>
                                            <div className="col-lg-8 fv-row">
                                                <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('mail_from_name')}/> 
                                            </div>
                                            {formik.touched.mail_from_name && formik.errors.mail_from_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mail_from_name}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                        <div className='card-footer py-5 text-end' id='kt_task_footer'>
                                            <button
                                            type='submit'
                                            id='kt_site_settings_submit'
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
                                    </form>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="siteSettingUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `email_setting_updated_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="localError">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
                </div>
            </div>
        </div>
    )
}

export {MailSetting};