import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import { useFormik } from 'formik';
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { getOrganizationTheme, updateOrganizationTheme } from '../ThemeBuilder/request';

const initialValues = {
    whatsapp_api: '',
    whatsapp_token: '',
    smtp_user_name: '',
    smtp_password: '',
    smtp_host: '',
    smtp_port: '',
    whatsapp_status: '',
    gallabox: '',
}

const IntegrationsPage: FC = () => {
    const intl = useIntl();
    const {currentUser, setCurrentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [watsappStatus, setWatsappStatus] = useState(false);
    const [gallaboxStatus, setGallaboxStatus] = useState(false);

    const bussinessSettings = async () => {
        const response = await getOrganizationTheme()
        console.log("lhfieuriurgwe", response.output);
        if(response.status == 200) {
            formik.setFieldValue('whatsapp_api', response.output?.whatsapp_api);
            formik.setFieldValue('whatsapp_token', response.output?.whatsapp_token);
            formik.setFieldValue('smtp_user_name', response.output?.smtp_user_name);
            formik.setFieldValue('smtp_password', response.output?.smtp_password);
            formik.setFieldValue('smtp_host', response.output?.smtp_host);
            formik.setFieldValue('smtp_port', response.output?.smtp_port);
            formik.setFieldValue('whatsapp_status', response.output?.whatsapp_status);
            formik.setFieldValue('gallabox', response.output?.gallabox);
            setGallaboxStatus(response.output?.gallabox == 1 ? true : false);
            setWatsappStatus(response.output?.whatsapp_status == 1 ? true : false);
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
                formData.append('whatsapp_api', values.whatsapp_api);
                formData.append('whatsapp_token', values.whatsapp_token);
                formData.append('smtp_user_name', values.smtp_user_name);
                formData.append('smtp_password', values.smtp_password);
                formData.append('smtp_host', values.smtp_host);
                formData.append('smtp_port', values.smtp_port);                
                formData.append('whatsapp_status', values.whatsapp_status);                
                formData.append('gallabox', values.gallabox);                

                const updatethemeData = await updateOrganizationTheme(formData);
                if (updatethemeData.status == 200) {
                    setLoading(false);
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
                                    <h3>{intl.formatMessage({id: 'integrations'})}</h3>
                                </div>
                                <div className="card-body">
                                    <div className='row mb-6'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                            <span className=''>{intl.formatMessage({id: 'whatsapp'})}</span>    
                                        </label>
                                        <div className="col-lg-8 fv-row d-flex align-items-center">
                                            <div className='form-switch'>
                                                <input
                                                    type='checkbox' checked={watsappStatus}
                                                    className='form-check-input int-switch'
                                                    // {...formik.getFieldProps('whatsapp_status')}
                                                    onChange={(e) => {
                                                        setWatsappStatus(e.target.checked);
                                                        formik.setFieldValue('whatsapp_status', e.target.checked ? '1' : '0')
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>                                   
                                    <div className='row mb-6 d-none'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                            <span className=''>{intl.formatMessage({id: 'gallabox'})}</span>    
                                        </label>
                                        <div className="col-lg-8 fv-row d-flex align-items-center">
                                            <div className='form-switch'>
                                                <input
                                                    type='checkbox' checked={gallaboxStatus}
                                                    className='form-check-input int-switch'
                                                    // {...formik.getFieldProps('gallabox')}
                                                    onChange={(e) => {
                                                        setGallaboxStatus(e.target.checked);
                                                        formik.setFieldValue('gallabox', e.target.checked ? '1' : '0')
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>                                   
                                    <div className={watsappStatus ? 'row mb-6' : 'row mb-6 blur_show'}>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'whatsapp_api'})}</span>    
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <input
                                            type='text'
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('whatsapp_api')}
                                        />
                                        </div>
                                    </div>                                   
                                    <div className={watsappStatus ? 'row mb-6' : 'row mb-6 blur_show'}>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'whatsapp_token'})}</span>
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <textarea
                                            rows={3}
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('whatsapp_token')}
                                        />
                                        </div>
                                    </div>                                    
                                    <div className='row mb-6'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'smtp_user_name'})}</span>
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <input
                                            type='text'
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('smtp_user_name')}
                                        />
                                        </div>
                                    </div>
                                    <div className='row mb-6'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'smtp_password'})}</span>
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <input
                                            type='text'
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('smtp_password')}
                                        />
                                        </div>
                                    </div>
                                    <div className='row mb-6'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'smtp_host'})}</span>
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <input
                                            type='text'
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('smtp_host')}
                                        />
                                        </div>
                                    </div>
                                    <div className='row mb-6'>
                                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                        <span className=''>{intl.formatMessage({id: 'smtp_port'})}</span>
                                        </label>
                                        <div className='col-lg-8 fv-row'>
                                        <input
                                            type='text'
                                            className='form-control form-control-lg form-control-solid'
                                            {...formik.getFieldProps('smtp_port')}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
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
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'integrations_updated_successfully'})}!
                </div>
            </div>
        </div>
    )
}

export {IntegrationsPage}
