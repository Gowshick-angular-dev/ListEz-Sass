import React,{FC, useEffect, useState} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { Toast } from 'bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getBusinessSettings, updateBusinessSettings } from './core/_requests';
import { useAuth } from '../../../modules/auth';

const initialValues = {
    "title": "",
}

const SiteSetting:FC = () => {

    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    var roleId = currentUser?.id;
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<any>(null);
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [watermarkFile, setWatermarkFile] = useState<any>(null);
    const [watermarkPre, setWatermarkPre] = useState(false);
    const [watermarkPreview, setWatermarkPreview] = useState<any>(null);
    const [logoErrMsg, setLogoErrMsg] = useState('');
    const [waterMarkErrMsg, setWaterMarkErrMsg] = useState('');
    const [businessSettings, setBusinessSettings] = useState<any>({});

    const siteSchema = Yup.object().shape({
        title: Yup.string().required(`title name is required`),
    })

    const getBusinessSetting = async () => {
        const response = await getBusinessSettings();
        setBusinessSettings(response.output)
        formik.setFieldValue("title", response.output?.site_title);       
        setImagePreview(process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_logo/"+response.output?.site_logo);
        response.output?.site_logo && setImgPre(true);
        response.output?.site_favicon && setWatermarkPre(true);
        setWatermarkPreview(process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_favicon/"+response.output?.site_favicon);
    }

    const formik = useFormik({
        initialValues,
        validationSchema: siteSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          try {    
            let formData = new FormData();
            formData.append('site_title', values.title);
            imageFile && formData.append('site_logo', imageFile);
            watermarkFile && formData.append('site_favicon', watermarkFile);
                const updateData = await updateBusinessSettings(formData);
                setBusinessSettings(updateData.output);
                document.getElementById("logo_reload")?.click();
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
          }
    }})

    const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['png','jpeg','jpg','x-icon']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
      }
      
      const handleImagePreview = (e:any) => {
          if(e.target.files[0].size > 2097152){
            setLogoErrMsg('File size exceeded!!!');
            (document.getElementById('logo_image_add') as HTMLInputElement).value = '';
            setTimeout(() => setLogoErrMsg(''), 5000);
            return;
          } else {
          const file = e.target.files[0];
          if(isValidFileUploaded(file)){
            let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
            let image_as_files:any = e.target.files[0];
            setImagePreview(image_as_base64);
            setImageFile(image_as_files);
            setImagePreview(image_as_base64);
            setImgPre(true);
          }else{
            setLogoErrMsg('Upload a valid Logo!!!');
            (document.getElementById('logo_image_add') as HTMLInputElement).value = '';
            setTimeout(() => setLogoErrMsg(''), 5000);
          }}
      }
      
      const handleWatermarkPreview = (e:any) => {
          if(e.target.files[0].size > 2097152){
            setWaterMarkErrMsg('File size exceeded!!!');
            (document.getElementById('watermark_image_add') as HTMLInputElement).value = '';
            setTimeout(() => setWaterMarkErrMsg(''), 5000);
            return;
          } else {
          const file = e.target.files[0];
          if(isValidFileUploaded(file)){
            let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
            let image_as_files:any = e.target.files[0];
            setWatermarkPreview(image_as_base64);
            setWatermarkFile(image_as_files);
            setWatermarkPreview(image_as_base64);
            setWatermarkPre(true); 
          }else{
            setWaterMarkErrMsg('Upload a valid favicon Image!!!');
            (document.getElementById('watermark_image_add') as HTMLInputElement).value = '';
            setTimeout(() => setWaterMarkErrMsg(''), 5000);
          }}
      }

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview(null);
        setImgPre(false);
        (document.getElementById('logo_image_add') as HTMLInputElement).value = '';
    }

    useEffect(() => {
        if(roleId == 1) {
            getBusinessSetting();
        }
    }, [roleId]);
    
    return(
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>             
            {/* <div className='modal fade' id={'subscription_form'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'subscription'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' id='subscriptionForm' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form className='w-100' noValidate onSubmit={formikSubscription.handleSubmit}>
                                <div className='row'>
                                    <div className="col-12 form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'subscription_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="subscription name" {...formikSubscription.getFieldProps('subscription_name')}/> 
                                        </div>
                                        {formikSubscription.touched.subscription_name && formikSubscription.errors.subscription_name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.subscription_name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                             
                                    <div className="col-md-6 form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" placeholder="Amount" {...formikSubscription.getFieldProps('amount')}/> 
                                        </div>
                                        {formikSubscription.touched.amount && formikSubscription.errors.amount && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.amount}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="col-md-6 form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'no_of_days'})}</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" placeholder="No. of days" {...formikSubscription.getFieldProps('no_of_days')}/> 
                                        </div>
                                        {formikSubscription.touched.no_of_days && formikSubscription.errors.no_of_days && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.no_of_days}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={() => editCancel()}>
                                            {intl.formatMessage({id: 'cancel'})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit1'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikSubscription.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>  */}
            {/* <div className='modal fade' id={'delete_confirm_popup453453453453534534534'} aria-hidden='true'>
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
                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(editId)}>
                                {intl.formatMessage({id: 'yes'})}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>            */}
            <div className='flex-lg-row-fluid'>  
                <div>
                <div className="card bs_2 w-xl-50 w-md-75 w-100 mx-auto"> 
                    <div className='card-header w-100 d-flex align-items-center'>
                        <h3>{intl.formatMessage({id: 'site_settings'})}</h3>
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
                                        <div className="row">
                                            <div className="col-12 form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'title'})}</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Enter Title" {...formik.getFieldProps('title')}/> 
                                                </div>
                                                {formik.touched.title && formik.errors.title && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.title}</span>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                            <div className="col-md-6 p-3">
                                                <div className='d-flex justify-content-center flex-wrap p-5'>
                                                {logoErrMsg && <p role='alert' className='fs-10px text-danger'>{logoErrMsg}</p>}
                                                <div className='position-relative border border-2 logo_pre_box br_10 d-flex align-items-center justify-content-center'>
                                                {imgPre &&
                                                <><img src={imagePreview} alt="image preview" className='logo_pre' />
                                                {/* <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0 br_10"><span className="svg-icon svg-icon-muted"><svg height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a> */}
                                                </>}</div>
                                                    <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3">
                                                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_logo'})}
                                                        <input type="file" accept="image/*" id='logo_image_add' onChange={handleImagePreview}/>
                                                    </span>
                                                    <div className='fv-plugins-message-container text-center'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='fs-8 text-danger'>Note: use jpg, jpeg, png only and Size must below 2 MB!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 p-3 d-flex align-items-end justify-content-center">
                                                <div className='p-5 br_10 w-100'>
                                                    {waterMarkErrMsg && <p role='alert' className='fs-10px text-danger text-center'>{waterMarkErrMsg}</p>}
                                                    <div className='position-relative border border-2 favi_pre_box br_10 d-flex align-items-center justify-content-center mx-auto'>
                                                    {watermarkPre &&
                                                    <><img src={watermarkPreview} alt="image preview" className='favi_pre' />
                                                    {/* <a onClick={(e) => {
                                                        setWatermarkFile(null);
                                                        setWatermarkPreview(null);
                                                        setWatermarkPre(false);
                                                        (document.getElementById('watermark_image_add') as HTMLInputElement).value = '';
                                                    }} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg  height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a> */}
                                                    </>}</div>
                                                    <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3 mx-auto">
                                                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_favicon'})}
                                                        <input type="file" accept="image/*" id='watermark_image_add' onChange={handleWatermarkPreview}/>
                                                    </span>
                                                    <div className='fv-plugins-message-container text-center'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='fs-8 text-danger'>Note: use jpg, jpeg, png, ico only and Size must below 2 MB!</span>
                                                        </div>
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
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>}
                    </div>
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
                    <div>{intl.formatMessage({id: `site_setting_updated_successfully`})}!</div>
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
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="imgSizeErr">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'image_size_exceeded'})}!</div>
                </div>
            </div>
        </div>
    )
}

export {SiteSetting};