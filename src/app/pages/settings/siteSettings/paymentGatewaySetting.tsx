import React,{FC, useEffect, useState} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { Toast } from 'bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getBusinessSettings, updateBusinessSettings } from './core/_requests';
import Payment from '../subscription/razorPay';
import { useAuth } from '../../../modules/auth';

const initialValues = {
    "razor_key": "",
    "razor_secret": "",
    "stripe_key": "",
    "stripe_secret": "",
}

const PaymentGatewaySetting:FC = () => {

    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const roleId = currentUser?.id;
    const [loading, setLoading] = useState(false);
    const [businessSettings, setBusinessSettings] = useState<any>({});
    const [payment, setPayment] = useState<any>('1');

    const siteSchema = Yup.object().shape({
        razor_key: Yup.string(),
        razor_secret: Yup.string(),
        stripe_key: Yup.string(),
        stripe_secret: Yup.string(),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: siteSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          
          try {    
            let formData = new FormData();
                formData.append("razor_key", values.razor_key)
                formData.append("razor_secret", values.razor_secret)
                formData.append("stripe_key", values.stripe_key)
                formData.append("stripe_secret", values.stripe_secret)
                formData.append("payment_gateway", payment)

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

    const getBusinessSetting = async () => {
        const response = await getBusinessSettings();
        setBusinessSettings(response.output)
        setPayment(response.output?.payment_gateway)
        formik.setFieldValue("razor_key", response.output?.razor_key);
        formik.setFieldValue("razor_secret", response.output?.razor_secret);
        formik.setFieldValue("stripe_key", response.output?.stripe_key);
        formik.setFieldValue("stripe_secret", response.output?.stripe_secret);
    }

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
                        <h3>{intl.formatMessage({id: 'payment_gateway_settings'})}</h3>
                        <div className='card-toolbar'>
                            <ul className="nav nav-pills mb-3 d-flex justify-content-center row admin_tab_switch bg-gray-300 py-2 br_30" id="pills-tab" role="tablist">
                                <li className="nav-item col m-0" role="presentation">
                                    <button className={payment == 1 ? "nav-link active w-100 h-100 m-0 py-2 br_25" : "nav-link w-100 h-100 m-0 py-2 br_25"} id="razor-tab" data-bs-toggle="pill" data-bs-target="#razor" type="button" role="tab" aria-controls="razor" aria-selected="false" onClick={() => setPayment("1")}>
                                    Razor
                                    </button>
                                </li>
                                <li className="nav-item col m-0" role="presentation">
                                    <button className={payment == 0 ? "nav-link active w-100 h-100 m-0 py-2 br_25" : "nav-link w-100 h-100 m-0 py-2 br_25"} id="stripe-tab" data-bs-toggle="pill" data-bs-target="#stripe" type="button" role="tab" aria-controls="stripe" aria-selected="false" onClick={() => setPayment("0")}>
                                    Stripe
                                    </button>
                                </li>
                            </ul>
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
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className={payment == 1 ? "tab-pane fade show active" : "tab-pane fade"} id="razor" role="tabpanel" aria-labelledby="razor-tab">
                                                <h4 className='mb-6 text-center'>{intl.formatMessage({id: 'razor_pay'})}</h4>
                                                <div className="row mb-6">
                                                    <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'razor_key'})}</label>
                                                    <div className="col-lg-8 fv-row">
                                                        <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('razor_key')}/> 
                                                    </div>
                                                    {formik.touched.razor_key && formik.errors.razor_key && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.razor_key}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div> 
                                                <div className="row mb-6">
                                                    <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'razor_secret'})}</label>
                                                    <div className="col-lg-8 fv-row">
                                                        <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('razor_secret')}/> 
                                                    </div>
                                                    {formik.touched.razor_secret && formik.errors.razor_secret && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.razor_secret}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div> 
                                            </div>
                                            <div className={payment == 0 ? "tab-pane fade show active" : "tab-pane fade"} id="stripe" role="tabpanel" aria-labelledby="stripe-tab">
                                                <h4 className='mb-6 text-center'>{intl.formatMessage({id: 'stripe_pay'})}</h4>
                                                <div className="row mb-6">
                                                    <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'stripe_key'})}</label>
                                                    <div className="col-lg-8 fv-row">
                                                        <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('stripe_key')}/> 
                                                    </div>
                                                    {formik.touched.stripe_key && formik.errors.stripe_key && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.stripe_key}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div> 
                                                <div className="row mb-6">
                                                    <label htmlFor="basic-url" className="col-lg-4 col-form-label fw-bold fs-6">{intl.formatMessage({id: 'stripe_secret'})}</label>
                                                    <div className="col-lg-8 fv-row">
                                                        <input type="text" className="form-control form-control-lg form-control-solid" placeholder="" {...formik.getFieldProps('stripe_secret')}/> 
                                                    </div>
                                                    {formik.touched.stripe_secret && formik.errors.stripe_secret && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.stripe_secret}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>
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
                    <div>{intl.formatMessage({id: `payment_gateway_settings_updated_successfully`})}!</div>
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

export {PaymentGatewaySetting};