import React,{FC, useState,useEffect} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../../app/modules/auth';
import { Toast } from 'bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { getAllOrganozationCompany, getOrgDropList, saveOrganozationCompany } from './core/_requests';
import {useIntl} from 'react-intl';

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
    'first_name':"",
    'last_name':"",
    'email':"",
    'password':"",
    'pass':"",
    'created_by':"",
    'water_mark':"",
    'logo':"",
}

type Props = {
    setOrgsList:any;
}

const OrganizationForm:  FC<Props> = (props) => {
    
    const {setOrgsList} = props
    
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
    const [dropList, setDropList] = useState<any>({});
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [logoErrMsg, setLogoErrMsg] = useState('');
    const [waterMarkErrMsg, setWaterMarkErrMsg] = useState('');
    const [approval, setApproval] = useState(false);

    console.log("adjkfgjyrgeigte", approval);    
    
    const orgDropList = async () => {
        const response = await getOrgDropList()
        setDropList(response.output)        
    }

    useEffect(() => {
        if(roleId == 1) {
            orgDropList();
        }
    }, [roleId]);

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
        first_name: Yup.string().required('First Name is required').max(50, "First Name must be 50 Digits"),
        last_name: Yup.string().max(50, "Last Name must be 50 Digits"),
        email: Yup.string().required('Email is required').email("Invalid Email format"),
        pass: Yup.string().required('Password is required')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        password: Yup.string().required().oneOf([Yup.ref("pass"), null], "Passwords must match"),        
    })

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
                formData.append('address', values.registered_address);  
                formData.append('city', values.city);
                formData.append('state', values.state);  
                formData.append('country', values.country);  
                formData.append('currency', values.currency);
                formData.append('website', values.website);  
                formData.append('facebook_url', values.facebook_url);
                formData.append('linkindin_url', values.linkindin_url);  
                formData.append('twitter_url', values.twitter_url);
                formData.append('instagram_url', values.instagram_url);  
                formData.append('youtube_url', values.youtube_url);
                formData.append('approval', approval ? '1' : '0');  
                formData.append('user_name', values.first_name); 
                formData.append('email', values.email);
                formData.append('password', values.password);
                formData.append('water_mark', watermarkFile!);
                formData.append('logo', imageFile!);  

            const saveTemplateMailData = await saveOrganozationCompany(formData);
            if(saveTemplateMailData.status == 200) {
                setApproval(false);
                setLoading(false);
                document.getElementById('kt_organization_add_close')?.click();
                document.getElementById('orgReload')?.click();
                // setOrgsList(saveTemplateMailData.output?.slice(0, -1))
                var toastEl = document.getElementById('myToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                resetForm();
                setWatermarkFile(null);
                setWatermarkPreview(null);
                setWatermarkPre(false);
                setImageFile(null);
                setImagePreview(null);
                setImgPre(false);                
            } else if(saveTemplateMailData.status == 400) {
                setLoading(false);
                var toastEl = document.getElementById('mailAlreadyExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            var toastEl = document.getElementById('mailErrorMsg');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
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
            var toastEl = document.getElementById('imgSizeErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            (document.getElementById('logo_image_add') as HTMLInputElement).value = '';
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
            var toastEl = document.getElementById('imgSizeErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            (document.getElementById('watermark_image_add') as HTMLInputElement).value = '';
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
            setWaterMarkErrMsg('Upload a valid Watermark Image!!!');
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

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_task_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_new_organization'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_organization_add_close'
                    onClick={() => formik.resetForm()}
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>
            
            <div className='card-body position-relative' id='kt_task_body'>
            <form noValidate onSubmit={formik.handleSubmit} >
                <div className="accordion" id="accordionExample"> 
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'organization_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 p-3">
                                        <div className='d-flex justify-content-center flex-wrap bg-secondary p-5 br_10'>
                                        {logoErrMsg && <p role='alert' className='fs-10px text-danger'>{logoErrMsg}</p>}
                                        {imgPre &&
                                        <><div className='position-relative'><img src={imagePreview} alt="image preview" className='logo_pre' />
                                        <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a></div></>}
                                            <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3">
                                                <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_logo'})}
                                                <input type="file" accept="image/*" id='logo_image_add' onChange={handleImagePreview}/>
                                            </span>
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='fs-10px text-danger'>Note: use jpg, jpeg, png only and Size must below 2 MB!</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 p-3">
                                        <div className='d-flex justify-content-center flex-wrap bg-secondary p-5 br_10'>
                                            {waterMarkErrMsg && <p role='alert' className='fs-10px text-danger'>{waterMarkErrMsg}</p>}
                                            {watermarkPre &&
                                            <><div className='position-relative'><img src={watermarkPreview} alt="image preview" className='logo_pre' />
                                            <a onClick={(e) => {
                                                setWatermarkFile(null);
                                                setWatermarkPreview(null);
                                                setWatermarkPre(false);
                                                (document.getElementById('watermark_image_add') as HTMLInputElement).value = '';
                                            }} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="white"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="white"></rect></svg></span></a></div></>}
                                            <span className="btn btn-file d-flex flex-md-row p-2 p-md-4 w-75 my-3">
                                                <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_watermark'})}
                                                <input type="file" accept="image/*" id='watermark_image_add' onChange={handleWatermarkPreview}/>
                                            </span>
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='fs-10px text-danger'>Note: use jpg, jpeg, png only and Size must below 2 MB!</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'organization_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter Company name..." maxLength={50} {...formik.getFieldProps('organization_name')}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'phone'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter Phone Number..." {...formik.getFieldProps('phone_number')} onChange={(e) => formik.setFieldValue("phone_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst_number'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter GST Number..." {...formik.getFieldProps('gst_number')} onChange={(e) => formik.setFieldValue("gst_number", e.target?.value.replace(/[^0-9A-Za-z]/g, ""))} maxLength={15}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'cin_number'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter CIN Number..." {...formik.getFieldProps('cin_number')} onChange={(e) => formik.setFieldValue("cin_number", e.target?.value.replace(/[^0-9A-Za-z]/g, ""))} maxLength={21}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'tan_number'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter TAN Number..." {...formik.getFieldProps('tan_number')} onChange={(e) => formik.setFieldValue("tan_number", e.target?.value.replace(/[^0-9A-Za-z]/g, ""))} maxLength={10}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pan_number'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter PAN Number..." {...formik.getFieldProps('pan_number')} onChange={(e) => formik.setFieldValue("pan_number", e.target?.value.replace(/[^0-9A-Za-z]/g, ""))} maxLength={10}/> 
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'registered_address'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Registered Address..." {...formik.getFieldProps('registered_address')}/> 
                                            </div>
                                            {formik.touched.registered_address && formik.errors.registered_address && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.registered_address}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                                formik.setFieldValue("country", e.target.value);
                                                formik.setFieldValue("state", '');
                                                formik.setFieldValue("city", '');
                                                let states = dropList.state?.filter((state:any) => e.target.value == state.country_id);
                                                setState(states);
                                            }} >
                                                <option selected value="">Select</option>
                                                {dropList.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>
                                    {state.length != 0 &&
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                formik.setFieldValue("state", e.target.value);   
                                                formik.setFieldValue("city", '');                                            
                                                let states = dropList.city?.filter((city:any) => e.target.value == city.state_id);
                                                setCity(states);
                                            }} >
                                                <option selected value="">Select</option>
                                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select>
                                            </div>  
                                        </div>
                                    </div>}
                                    {city.length != 0 &&
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                <option selected value="">Select</option>
                                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>}
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'currency'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('currency')}>
                                                <option selected value="">Select</option>
                                                {dropList.currency?.map((data:any, i:any) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name + ' (' + data.symbol + ')'}</option>
                                                )})}
                                            </select> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'approval'})}</label>
                                            <div className="">
                                                <input type="checkbox" className='form-check-input' checked={approval} onChange={(e) => setApproval(e.target.checked)}/> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'first_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter First Name..." {...formik.getFieldProps('first_name')}/> 
                                            </div>
                                            {formik.touched.first_name && formik.errors.first_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.first_name}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Enter Last Name..." {...formik.getFieldProps('last_name')}/> 
                                            </div>
                                            {formik.touched.last_name && formik.errors.last_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.last_name}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div> */}
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'password'})}</label>
                                            <div className="input-group">
                                                <input type="password" className="form-control" placeholder="Enter Password..." {...formik.getFieldProps('pass')}/> 
                                            </div>
                                            {formik.touched.pass && formik.errors.pass && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.pass}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'confirm_password'})}</label>
                                            <div className="input-group">
                                                <input type="password" className="form-control" placeholder="Confirm Password..." {...formik.getFieldProps('password')}/> 
                                            </div>
                                            {formik.touched.password && formik.errors.password && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.password}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            {intl.formatMessage({id: 'social_media_links'})}
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">                                
                                <div className="row">                                    
                                    <div className="col-6">
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
                                    <div className="col-6">
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
                                    <div className="col-6">
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
                                    <div className="col-6">
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
                                    <div className="col-6">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            <div className='card-footer py-5 text-center' id='kt_task_footer'>
                <button
                  type='submit'
                  id='kt_add_org_submit'
                  className='btn btn_primary text-primary'
                  disabled={formik.isSubmitting}
                >
                  {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
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
    )
}

export {OrganizationForm}