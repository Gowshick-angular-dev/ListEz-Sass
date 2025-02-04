import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Offcanvas, Toast } from 'bootstrap';
import { getOrganozationCompany, getOrgDropList, updateOrganozation } from './core/_requests'
import { useAuth } from '../../../modules/auth';
import {useIntl} from 'react-intl'
import { getSubscriptions } from '../subscription/request';
import { UserSubscriptionPage } from './clientSubscriptionPage';
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import makeAnimated from "react-select/animated";
import { OrgSettingsPage } from './orgSettingsTab';
const initialValues = {
    'organization_name':"",
    'phone_number':"",
    'gst_number':"",
    'cin_number':"",
    'tan_number':"",
    'pan_number':"",
    'registered_address':"",
    'city':"0",
    'state':"0",
    'country':"0",
    'currency':"0",
    'website':"",
    'facebook_url':"",
    'linkindin_url':"",
    'twitter_url':"",
    'instagram_url':"",
    'youtube_url':"",
    'approval':"",
    'user_name':"",
    'last_name':"",
    'email':"",
    'password':"",
    'pass':"",
    'water_mark':"",
    'logo':"",
}

const OrgSettings: FC = () => {
    const intl = useIntl();

    const {currentUser, logout} = useAuth();

    const orgId = currentUser?.org_id;

    const teamsSaveSchema = Yup.object().shape({        
        organization_name: Yup.string().required('Organization Name is required').max(50, "Organization Name must be 50 Digits"),
        phone_number: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").required('Phone Number is required').min(7, "Phone Number must be at least 7 characters").max(15, "Phone Number must be at most 15 characters"),
        gst_number: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").min(15, "GST number must be 15 Digits").max(15, "GST number must be 15 Digits"),
        cin_number: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").min(21, "CIN number must be 21 Digits").max(21, "CIN number must be 21 Digits"),
        tan_number: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").min(10, "TAN number must be 10 Digits").max(10, "TAN number must be 10 Digits"),
        pan_number: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").min(10, "PAN number must be 10 Digits").max(10, "PAN number must be 10 Digits"),
        registered_address: Yup.string().max(100, "Registered Address must be at most 100 characters"),
        city: Yup.string(),
        state: Yup.string(),
        country: Yup.string(),
        currency: Yup.string(),
        website: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        facebook_url: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        linkindin_url: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        twitter_url: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        instagram_url: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        youtube_url: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        approval: Yup.string(),
        user_name: Yup.string().required('First Name is required').max(50, "First Name must be 50 Digits"),
        last_name: Yup.string().max(50, "Last Name must be 50 Digits"),        
    })

    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [subscription, setSubscription] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<any>(null);
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [watermarkFile, setWatermarkFile] = useState<any>(null);
    const [watermarkPre, setWatermarkPre] = useState(false);
    const [watermarkPreview, setWatermarkPreview] = useState<any>(null);
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [dropList, setDropList] = useState<any>({});
    const [logoErrMsg, setLogoErrMsg] = useState('');
    const [waterMarkErrMsg, setWaterMarkErrMsg] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [params, setParams] = useState<any>('');

    useEffect(() => {
        const queryString = window.location.search;
        if(queryString) {        
        setParams(queryString.split('?')[1]); 
        }   
    }, [window.location.search])


    const orgDropList = async () => {
        const response = await getOrgDropList()
        setDropList(response.output) 
        setState(response.output?.state)       
        setCity(response.output?.city)       
    }

    const formik = useFormik({
        initialValues,
        validationSchema: teamsSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
                let formData = new FormData();  

                formData.append('organization_name', values.organization_name);
                formData.append('phone_number',  values.phone_number);  
                formData.append('gst_number', values.gst_number);
                formData.append('cin_number', values.cin_number);  
                formData.append('tan_number', values.tan_number);
                formData.append('pan_number', values.pan_number);  
                formData.append('registered_address', values.registered_address);  
                formData.append('city', selectedCity);
                formData.append('state', selectedState);  
                formData.append('country', selectedCountry);  
                formData.append('currency', values.currency);
                formData.append('website', values.website);  
                formData.append('facebook_url', values.facebook_url);
                formData.append('linkindin_url', values.linkindin_url);  
                formData.append('twitter_url', values.twitter_url);
                formData.append('instagram_url', values.instagram_url);  
                formData.append('youtube_url', values.youtube_url);  
                formData.append('user_name', values.user_name);
                formData.append('last_name', values.last_name);               
                formData.append('email', values.email);
                watermarkFile && formData.append('water_mark', watermarkFile!);
                imageFile && formData.append('logo', imageFile!); 
                !watermarkPreview && !watermarkFile && formData.append('water_mark', watermarkFile!);
                !imagePreview && !imageFile && formData.append('logo', imageFile!); 
                
            const saveTemplateMailData = await updateOrganozation(orgId, formData);
           
            if(saveTemplateMailData != null){
                setLoading(false);
                document.getElementById('kt_team_close')?.click();
                document.getElementById('logo_reload')?.click();
                var toastEl = document.getElementById('myToastOrgUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();               
            }    
          } catch (error) {
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['png','jpeg','jpg']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
      }
      
      const handleImagePreview = (e:any) => {
        if(e.target.files[0].size > 2097152){
            setLogoErrMsg('File size exceeded!!!');
            (document.getElementById('logo_image_admin') as HTMLInputElement).value = '';
            setTimeout(() => setLogoErrMsg(''), 5000);
            return;
          } else {
          const file = e.target.files[0];
          if(isValidFileUploaded(file)){
            let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
            let image_as_files:any = e.target.files[0];
            setImagePreview(image_as_base64);
            setImageFile(image_as_files);
            setImgPre(true);
          }else{
            setLogoErrMsg('Upload a valid Logo!!!');
            (document.getElementById('logo_image_admin') as HTMLInputElement).value = '';
            setTimeout(() => setLogoErrMsg(''), 5000);
          }}
      }
      
      const handleWatermarkPreview = (e:any) => {
        if(e.target.files[0].size > 2097152){
            setWaterMarkErrMsg('File size exceeded!!!');
            (document.getElementById('watermark_image_admin') as HTMLInputElement).value = '';
            setTimeout(() => setWaterMarkErrMsg(''), 5000);
            return;
          } else {
          const file = e.target.files[0];
          if(isValidFileUploaded(file)){
            let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
            let image_as_files:any = e.target.files[0];
            setWatermarkPreview(image_as_base64);
            setWatermarkFile(image_as_files);
            setWatermarkPre(true); 
          }else{
            setWaterMarkErrMsg('Upload a valid Watermark Image!!!');
            (document.getElementById('watermark_image_admin') as HTMLInputElement).value = '';
            setTimeout(() => setWaterMarkErrMsg(''), 5000);
          }}
      }

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview(null);
        setImgPre(false);
        (document.getElementById('logo_image_admin') as HTMLInputElement).value = '';
    }

    const loadOrg = async () => {
        setLoading(true);
        const response = await getOrganozationCompany(orgId);
        if(response.status == 200) {
            setSelectedCountry(response.output?.country);   
            setSelectedState(response.output?.state);   
            setSelectedCity(response.output?.city);   
            formik.setFieldValue('organization_name', response.output.organization_name ?? "");
            formik.setFieldValue('phone_number', response.output.phone_number ?? "");
            formik.setFieldValue('gst_number', response.output.gst_number ?? "");
            formik.setFieldValue('cin_number', response.output.cin_number ?? "");
            formik.setFieldValue('tan_number', response.output.tan_number ?? "");
            formik.setFieldValue('pan_number', response.output.pan_number ?? "");
            // formik.setFieldValue('city', response.output.city ?? "");
            // formik.setFieldValue('state', response.output.state ?? "");
            // formik.setFieldValue('country', response.output.country ?? "");
            formik.setFieldValue('currency', response.output.currency ?? "");
            formik.setFieldValue('website', response.output.website ?? "");
            formik.setFieldValue('facebook_url', response.output.facebook_url ?? "");
            formik.setFieldValue('linkindin_url', response.output.linkindin_url ?? "");
            formik.setFieldValue('twitter_url', response.output.twitter_url ?? "");
            formik.setFieldValue('instagram_url', response.output.instagram_url ?? "");
            formik.setFieldValue('youtube_url', response.output.youtube_url ?? "");
            formik.setFieldValue('user_name', response.output.user_name ?? "");
            formik.setFieldValue('last_name', response.output.last_name ?? "");
            formik.setFieldValue('email', response.output.email ?? "");


            setImagePreview(process.env.REACT_APP_API_BASE_URL+"uploads/organization/logo/"+orgId+'/'+response.output?.logo);
            response.output?.logo && setImgPre(true);
            response.output?.water_mark && setWatermarkPre(true);
            setWatermarkPreview(process.env.REACT_APP_API_BASE_URL+"uploads/organization/water_mark/"+orgId+'/'+response.output?.water_mark);

            // process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_logo/"+businessSettings?.site_logo
        }
        setTimeout(() => {setLoading(false)}, 500)
    }

    const subscriptionRequest =  async () => {
        const Response = await getSubscriptions()
        setSubscription(Response.output);
    }

    useEffect(() => {
        subscriptionRequest();
        orgDropList();
        if(orgId) {
            loadOrg();
        }      
    }, [orgId]);

    return(
        <div className="org_settings bg_white p-3 h-100">            
            <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className={params == 2 ? "nav-link" : "nav-link active"} id="pills-org-tab" data-bs-toggle="pill" data-bs-target="#pills-org" type="button" role="tab" aria-controls="pills-org" aria-selected="true">{intl.formatMessage({id: 'company_details'})}</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={params == 2 ? "nav-link active" : "nav-link"} id="pills-personal-tab" data-bs-toggle="pill" data-bs-target="#pills-personal" type="button" role="tab" aria-controls="pills-personal" aria-selected="false">{intl.formatMessage({id: 'plan_details'})}</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={params == 2 ? "nav-link active" : "nav-link"} id="settings-tab" data-bs-toggle="pill" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">{intl.formatMessage({id: 'settings'})}</button>
                </li>
            </ul>
            
            <div className="tab-content" id="pills-tabContent">
                <div className={params == 2 ? "tab-pane fade" : "tab-pane fade show active"} id="pills-org" role="tabpanel" aria-labelledby="pills-org-tab">
                    {loading ? 
                    <div className='w-100 h-100'>
                        <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                            <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                            <div className="spinner-border taskloader" role="status">                                    
                                <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                            </div>
                        </div> 
                    </div>:
                    <form noValidate onSubmit={formik.handleSubmit} >
                        <div className="row">
                            <div className="col-lg-12 col-xxl-12">
                                <div className="p-6">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6 col-xl-3">
                                                <div className='p-5 br_10 w-100'>
                                                    {logoErrMsg && <p role='alert' className='fs-10px text-danger text-center'>{logoErrMsg ?? '+'}</p>}
                                                    <div className='position-relative border border-2 favi_pre_box br_10 d-flex align-items-center justify-content-center mx-auto'>
                                                    {imgPre &&
                                                    <><img src={imagePreview} alt="image preview" className='favi_pre' />
                                                    {/* <a onClick={(e) => {
                                                        imgRemove()
                                                    }} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg  height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a> */}
                                                    </>}</div>
                                                    <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3 mx-auto">
                                                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_logo'})}
                                                        <input type="file" accept="image/*" id='logo_image_admin' onChange={handleImagePreview}/>
                                                    </span>
                                                    <div className='fv-plugins-message-container text-center'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='fs-7 text-danger'>Note: use jpg, jpeg, png, ico only and Size must below 2 MB!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-xl-3">
                                                <div className='p-5 br_10 w-100'>
                                                    {waterMarkErrMsg && <p role='alert' className='fs-10px text-danger text-center'>{waterMarkErrMsg}</p>}
                                                    <div className='position-relative border border-2 favi_pre_box br_10 d-flex align-items-center justify-content-center mx-auto'>
                                                    {watermarkPre &&
                                                    <><img src={watermarkPreview} alt="image preview" className='favi_pre' />
                                                    {/* <a onClick={(e) => {
                                                        setWatermarkFile(null);
                                                        setWatermarkPreview(null);
                                                        setWatermarkPre(false);
                                                        (document.getElementById('watermark_image_admin') as HTMLInputElement).value = '';
                                                    }} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg  height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a> */}
                                                    </>}</div>
                                                    <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3 mx-auto">
                                                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_watermark'})}
                                                        <input type="file" accept="image/*" id='watermark_image_admin' onChange={handleWatermarkPreview}/>
                                                    </span>
                                                    <div className='fv-plugins-message-container text-center'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='fs-7 text-danger'>Note: use jpg, jpeg, png, ico only and Size must below 2 MB!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-xl-6">
                                                <div className="row">
                                                    <div className="col-10">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'organization_name'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter Company name..." {...formik.getFieldProps('organization_name')}/> 
                                                            </div>
                                                            {formik.touched.organization_name && formik.errors.organization_name && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.organization_name}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-10">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'phone_number'})}</label>
                                                            <div className="input-group">
                                                                <input type="number" className="form-control" placeholder="Enter Phone Number..." {...formik.getFieldProps('phone_number')}/> 
                                                            </div>
                                                            {formik.touched.phone_number && formik.errors.phone_number && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.phone_number}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-10">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst_number'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter GST Number..." {...formik.getFieldProps('gst_number')}/> 
                                                            </div>
                                                            {formik.touched.gst_number && formik.errors.gst_number && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.gst_number}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-9 col-xl-11 col-12 mt-4">
                                                <div className="row">
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'cin_number'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter CIN Number..." {...formik.getFieldProps('cin_number')}/> 
                                                            </div>
                                                            {formik.touched.cin_number && formik.errors.cin_number && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.cin_number}</span>
                                                                </div>
                                                            </div>
                                                            )}  
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'tan_number'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter TAN Number..." {...formik.getFieldProps('tan_number')}/> 
                                                            </div>
                                                            {formik.touched.tan_number && formik.errors.tan_number && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.tan_number}</span>
                                                                </div>
                                                            </div>
                                                            )}  
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pan_number'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter PAN Number..." {...formik.getFieldProps('pan_number')}/> 
                                                            </div>
                                                            {formik.touched.pan_number && formik.errors.pan_number && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.pan_number}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'user_name'})}</label>
                                                            <div className="input-group">
                                                                <input type="text" className="form-control" placeholder="Enter First Name..." {...formik.getFieldProps('user_name')}/> 
                                                            </div>
                                                            {formik.touched.user_name && formik.errors.user_name && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.user_name}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                            <div className="input-group">
                                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                                                formik.setFieldValue("country", e.target.value);
                                                                let states = dropList.state?.filter((state:any) => e.target.value == state.country_id);
                                                                setState(states);
                                                            }} >
                                                                <option disabled value="">Select</option>
                                                                {dropList.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                    return(
                                                                        <option value={data.id} key={i}>{data.name}</option>
                                                                )})}
                                                            </select> 
                                                            </div> 
                                                        </div>
                                                    </div> */}
                                                    <div className="col-6 col-xl-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="form-group mb-4 border border-secondary br_5">
                                                        <Select
                                                        options={dropList.country}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name}
                                                        getOptionValue={(option:any) => option.id}
                                                        defaultValue={dropList.country?.find((item:any) => selectedCountry == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={""}
                                                        // theme={(theme) => ({
                                                        //     ...theme,
                                                        //     border: 0,
                                                        //     borderRadius: 5,
                                                        //     colors: {
                                                        //       ...theme.colors,
                                                        //       primary25: '#ff670035',
                                                        //       primary50: '#ff670035',
                                                        //       primary: '#ff6700',
                                                        //     },
                                                        //   })}
                                                        onChange={(val:any) => {
                                                            setSelectedCountry(val.id);
                                                            setSelectedState('');
                                                            setSelectedCity('');
                                                            formik.setFieldValue('country', val.id);
                                                            let states = dropList.state?.filter((state:any) => val.id == state.country_id);
                                                            setState(states);
                                                        }}
                                                        placeholder={"country"}
                                                        />
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                        <div className="form-group mb-4 border border-secondary br_5">
                                                        <Select
                                                        options={state?.filter((item) => item.country_id == selectedCountry)}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name}
                                                        getOptionValue={(option:any) => option.id}
                                                        defaultValue={dropList.state?.find((item:any) => selectedState == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={""}
                                                        // theme={(theme) => ({
                                                        //     ...theme,
                                                        //     border: 0,
                                                        //     borderRadius: 5,
                                                        //     colors: {
                                                        //       ...theme.colors,
                                                        //       primary25: '#ff670035',
                                                        //       primary50: '#ff670035',
                                                        //       primary: '#ff6700',
                                                        //     },
                                                        //   })}
                                                        onChange={(val:any) => {
                                                            setSelectedState(val.id)
                                                            formik.setFieldValue('state', val.id);
                                                            let states = dropList.city?.filter((city:any) => val.id == city.state_id);
                                                            setCity(states);
                                                        }}
                                                        placeholder={"State"}
                                                        />
                                                    </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                        <div className="form-group mb-4 border border-secondary br_5">
                                                        <Select
                                                        options={city?.filter((item) => item.state_id == selectedState)}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name}
                                                        getOptionValue={(option:any) => option.id}
                                                        defaultValue={dropList.city?.find((item:any) => selectedCity == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={""}
                                                        // theme={(theme) => ({
                                                        //     ...theme,
                                                        //     border: 0,
                                                        //     borderRadius: 5,
                                                        //     colors: {
                                                        //       ...theme.colors,
                                                        //       primary25: '#ff670035',
                                                        //       primary50: '#ff670035',
                                                        //       primary: '#ff6700',
                                                        //     },
                                                        //   })}
                                                        onChange={(val:any) => {
                                                            setSelectedCity(val.id)
                                                            formik.setFieldValue('city', val.id);
                                                        }}
                                                        placeholder={"city"}
                                                        />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                            <div className="input-group">
                                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                                formik.setFieldValue("state", e.target.value);                                               
                                                                let states = dropList.city?.filter((city:any) => e.target.value == city.state_id);
                                                                setCity(states);
                                                            }} >
                                                                <option disabled value="">Select</option>
                                                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                    return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                                )})}
                                                            </select>
                                                            </div>  
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                            <div className="input-group">
                                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                                <option disabled value="">Select</option>
                                                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                    return(
                                                                        <option value={data.id} key={i}>{data.name}</option>
                                                                )})}
                                                            </select> 
                                                            </div> 
                                                        </div>
                                                    </div> */}
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'currency'})}</label>
                                                            <div className="input-group">
                                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('currency')}>
                                                                <option selected value="">Select</option>
                                                                {dropList.currency?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                    return(
                                                                        <option value={data.id} key={i}>{data.name}</option>
                                                                )})}
                                                            </select> 
                                                            </div> 
                                                        </div>
                                                    </div>                                                    
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'website'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('website')}/> 
                                                            </div>
                                                            {formik.touched.website && formik.errors.website && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.website}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-group my-4">
                                                            <h4>{intl.formatMessage({id: 'social_media_links'})}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'facebook'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('facebook_url')}/> 
                                                            </div>
                                                            {formik.touched.facebook_url && formik.errors.facebook_url && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.facebook_url}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'linkedin'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('linkindin_url')}/> 
                                                            </div>
                                                            {formik.touched.linkindin_url && formik.errors.linkindin_url && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.linkindin_url}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'twitter'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('twitter_url')}/> 
                                                            </div>
                                                            {formik.touched.twitter_url && formik.errors.twitter_url && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.twitter_url}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'instagram'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('instagram_url')}/> 
                                                            </div>
                                                            {formik.touched.instagram_url && formik.errors.instagram_url && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.instagram_url}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-xl-4">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'youtube'})}</label>
                                                            <div className="input-group">
                                                                <input type="url" className="form-control" placeholder="URL..." {...formik.getFieldProps('youtube_url')}/> 
                                                            </div>
                                                            {formik.touched.youtube_url && formik.errors.youtube_url && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.youtube_url}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                   <div className="col-6 col-xl-4 d-none">
                                                        <div className="form-group mb-4">
                                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'email'})}</label>
                                                            <div className="input-group">
                                                                <input type="email" className="form-control" placeholder="Enter Email..." {...formik.getFieldProps('email')}/> 
                                                            </div>
                                                            {formik.touched.email && formik.errors.email && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='card-footer py-5 text-center' id='kt_task_footer'>
                                            <button
                                            type='submit'
                                            id='kt_add_teams_submit'
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
                        
                    </form>}                                       
                </div>
                <div className={params == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="pills-personal" role="tabpanel" aria-labelledby="pills-personal-tab"> 
                    <UserSubscriptionPage/>                  
                </div>
                <div className={params == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="settings" role="tabpanel" aria-labelledby="settings-tab"> 
                    <OrgSettingsPage/>                  
                </div>
            </div>            
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastOrgUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'organization_updated_successfully'})}!
                </div>
            </div>            
        </div>
    )
}

export {OrgSettings}