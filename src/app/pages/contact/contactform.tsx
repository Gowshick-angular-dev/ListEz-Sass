import React,{FC, useState, useEffect, useRef} from 'react'
import { saveContact, getContsctDropList, getLocalityByPIN, saveContactAutoAssign } from './core/_requests'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useIntl} from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

const initialValues = {
  salutation: '1',
  first_name: '',
  last_name: '',
  code: '',
  phone_number_type: '1',
  mobilePhone: '',
  email: '',
  source: '',
  contact_group: '',
  contact_type: '',
  contact_category: '',
  status: '2',
  is_secondary_contact: '0',
  secondary_contact_id: '',
  company_name: '',
  developer_name: '',
  property_id: '',
  designation:'',
  assign_to: '',
  address_1: '',
  address_2: '',
  locality: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  country_code: '',
  national_id: '',
  do_not_disturb: '',
  marital_status: '',
  gender: '',
  number_of_children: '',
  wedding_anniversary: '',
  nationality: '',
  language: '',
  pet_owner: '',
  dob: '',
  facebook:'',
  instagram:'',
  linkedin:'',
  twitter:'',
  remarks: '',
  invoice_name: '',
  gst_number: '',
  documents_count: '',
  id_document1: '',
  id_document2: '',
  id_document3: '',
  id_document4: '',
  id_document5: '',
  document1: '',
  document2: '',
  document3: '',
  document4: '',
  document5: '',
  id_number1: '',
  id_number2: '',
  id_number3: '',
  id_number4: '',
  id_number5: '',
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, aminityName: string[], theme: Theme) {
  return {
      fontWeight:
      aminityName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
  };
}

type Props = {
  setContacts?: any
}

const ContactForm:  FC<Props> = (props) => {

  const intl = useIntl();
  const {
    setContacts
  } = props
   
  const {currentUser, logout} = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(false)  
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [imagePreview4, setImagePreview4] = useState(null);
  const [imagePreview5, setImagePreview5] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [imageFile4, setImageFile4] = useState(null);
  const [imageFile5, setImageFile5] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [assignToName, setAssignToName] = useState<string[]>([]);
  const [assignToId, setAssignToId] = useState<string[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [localityList, setLocalityList] = useState<any[]>([]);
  const [dropList, setContactDropdowns] = useState<any>({});
  const [secSelected, setSecSelected] = useState(false)
  const [property, setProperty] = useState('')
  const [localityID, setLocalityID] = useState('')
  const profileView = useRef<HTMLInputElement>(null);
  const [documentList, setDocumentList] = useState<any[]>([{ document: "" }]);

   
  const registrationSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    email: Yup.string().email("Invalid Email format"),
    mobilePhone: Yup.string().required('Phone number is required').min(7, 'Min 7 characters'),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    salutation: Yup.string(),
    code: Yup.string(),
    contact_type: Yup.string(),
    source: currentUser?.designation == 6 ? Yup.string().required('Source is required') : Yup.string(),
    property_id: currentUser?.designation == 6 ? Yup.string().required('Project is required') : Yup.string(),
    phone_number_type: Yup.string(),
    contact_group: Yup.string(),
    contact_category: Yup.string(),
    status: Yup.string(),
    is_secondary_contact: Yup.string(),
    secondary_contact_id: Yup.string(),
    company_name: Yup.string(),
    developer_name: Yup.string(),
    designation: Yup.string(),
    assign_to: Yup.array(),
    address_1: Yup.string(),
    address_2: Yup.string(),
    locality: Yup.string(),
    zip_code: Yup.string(),
    country_code: Yup.string(),
    national_id: Yup.string(),
    do_not_disturb: Yup.string(),
    marital_status: Yup.string(),
    gender: Yup.string(),
    number_of_children: Yup.string(),
    wedding_anniversary: Yup.string(),
    nationality: Yup.string(),
    language: Yup.string(),
    pet_owner: Yup.string(),
    dob: Yup.string(),
    facebook: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
    instagram: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
    linkedin: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
    twitter: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
    remarks: Yup.string(),
    invoice_name: Yup.string(),
    gst_number: Yup.string().min(15, "GST number must be 15 Digits"),
    documents_count: Yup.string(),
    id_document1: Yup.string(),
    id_document2: Yup.string(),
    id_document3: Yup.string(),
    id_document4: Yup.string(),
    id_document5: Yup.string(),
    document1: Yup.string(),
    document2: Yup.string(),
    document3: Yup.string(),
    document4: Yup.string(),
    document5: Yup.string(),
    profile_image: Yup.string(),
    id_number1: Yup.string(),
    id_number2: Yup.string(),
    id_number3: Yup.string(),
    id_number4: Yup.string(),
    id_number5: Yup.string(),
  })
  
  const contactDropdowns = async () => {
    const response = await getContsctDropList()
    setContactDropdowns(response.output);
    if(currentUser?.designation == 6) {
    formik.setFieldValue('source', 63);
    }
  }

  const assingToChange = (event: SelectChangeEvent<typeof assignToName>) => {
    const {
      target: { value },
    } = event;

    var name = [];
    var id = [];

    for(let i = 0; i < value.length; i++){
      var fields = value[i].split('-');

      var n = fields[0];
      var d = fields[1];

      name.push(n);
      id.push(d);
    }

    setAssignToId(id);
    setAssignToName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading(true)
      try {
        var formData = new FormData();
        var userId = currentUser?.id;
        var assto:any = [];
        if (assignToId.length > 0) {
          assto = assignToId.length ? assignToId?.map((item:any) => item.id) : ''; 
        } else if(currentUser?.designation == 6) {
          assto = [];
        } else {
          assto = [userId];
        }
        
        formData.append('salutation', values.salutation);
        formData.append('first_name', values.first_name != '' ? values.first_name : 'Customer' );
        formData.append('last_name', values.last_name);
        formData.append('email', values.email);
        formData.append('mobile', values.mobilePhone);
        formData.append('country', values.country);
        formData.append('state', values.state);
        formData.append('city', values.city);
        formData.append('contact_type', values.contact_type);
        formData.append('company_name', values.company_name);
        formData.append('developer_name', values.developer_name);
        formData.append('designation', values.designation);
        formData.append('assign_to', assto.join(',').toString());
        formData.append('source', values.source);
        formData.append('property_id', values.property_id);
        formData.append('code', values.code);
        formData.append('phone_number_type', values.phone_number_type);
        formData.append('contact_group', values.contact_group);
        formData.append('contact_category', values.contact_category);
        formData.append('contact_status', values.status);
        formData.append('is_secondary_contact', values.is_secondary_contact);
        formData.append('secondary_contact_id', values.secondary_contact_id);
        formData.append('address_1', values.address_1);
        formData.append('address_2', values.address_2);
        formData.append('zip_code', values.zip_code);
        formData.append('country_code', values.country_code);
        formData.append('national_id', values.national_id);
        formData.append('do_not_disturb', values.do_not_disturb);
        formData.append('marital_status', values.marital_status);
        formData.append('gender', values.gender);
        formData.append('number_of_children', values.number_of_children);
        formData.append('wedding_anniversary', values.wedding_anniversary);
        formData.append('nationality', values.nationality);
        formData.append('language', values.language);
        formData.append('pet_owner', values.pet_owner);
        formData.append('dob', values.dob);
        formData.append('locality', values.locality);
        formData.append('facebook', values.facebook);
        formData.append('instagram', values.instagram);
        formData.append('linkedin', values.linkedin);
        formData.append('twitter', values.twitter);
        formData.append('remarks', values.remarks);
        formData.append('invoice_name', values.invoice_name);
        formData.append('gst_number', values.gst_number);
        formData.append('documents_count', documentList.length.toString());
        formData.append('id_document1', values.id_document1);
        formData.append('id_document2', values.id_document2);
        formData.append('id_document3', values.id_document3);
        formData.append('id_document4', values.id_document4);
        formData.append('id_document5', values.id_document5);
        formData.append('document1', imageFile1!);
        formData.append('document2', imageFile2!);
        formData.append('document3', imageFile3!);
        formData.append('document4', imageFile4!);
        formData.append('document5', imageFile5!);
        formData.append('profile_image', profileImage!);
        formData.append('id_number1', values.id_number1);
        formData.append('id_number2', values.id_number2);
        formData.append('id_number3', values.id_number3);
        formData.append('id_number4', values.id_number4);
        formData.append('id_number5', values.id_number5);
        
        const headers = {
          headers: {
              "Content-type": "multipart/form-data",
          },                    
        }

        let saveContactData:any;
        if(currentUser?.designation == 6) {
          saveContactData = await saveContactAutoAssign(formData, headers)
        } else {
          saveContactData = await saveContact(formData, headers)
        }

        if(saveContactData.status == 200){
          setLoading(false);
          document.getElementById('kt_contact_close')?.click();
          document.getElementById('contactReload')?.click();
          resetForm();
          setProperty('');
          setLocalityID('');
          setDocumentList([{ document: "" }]);
          setProfileImage(null);
          setAssignToId([]);
          setAssignToName([]);
          setImagePreview1(null);
          setImagePreview2(null);
          setImagePreview3(null);
          setImagePreview4(null);
          setImagePreview5(null);
          if(currentUser?.designation == 6) {
            formik.setFieldValue('source', 63);
          }
          var toastEl = document.getElementById('contactSaveToast');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        } else {
          setLoading(false);
          var toastEl = document.getElementById('contactSaveCPToast');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        }
      } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('contactErrorToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    contactDropdowns();
  }, []);


  const handleDocumentRemove = (index:any) => {
    const list = [...documentList];
    list.splice(index, 1);
    setDocumentList(list);
  };

  const handleDocumentAdd = () => {
    setDocumentList([...documentList, { document: "" }]);
  };

  const secOnChange = (val:any) => {
    formik.setFieldValue('is_secondary_contact', val);
    if(val == 1){
      setSecSelected(true);
    }
    else {
      setSecSelected(false);
    }
  }

  const handleImagePreview1 = (e:any) => {
    if(e.target.files[0].size > 2097152){
      var toastEl = document.getElementById('contactImgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      (document.getElementById('idDocument1') as HTMLInputElement).value = '';
      return;
    } else {
    const file = e.target.files[0];
    if(isValidDocumentUploaded(file)){
      let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
      let image_as_files:any = e.target.files[0];
      setImagePreview1(image_as_base64);
      setImageFile1(image_as_files);
    }else{
      (document.getElementById('idDocument1') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('contactImgFormatErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
    }}
  }

  const handleImagePreview2 = (e:any) => {
    if(e.target.files[0].size > 2097152){
      var toastEl = document.getElementById('contactImgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      (document.getElementById('idDocument2') as HTMLInputElement).value = '';
      return;
    } else {
    const file = e.target.files[0];
    if(isValidDocumentUploaded(file)){
      let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
      let image_as_files:any = e.target.files[0];
      setImagePreview2(image_as_base64);
      setImageFile2(image_as_files);
    }else{
      (document.getElementById('idDocument2') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('contactImgFormatErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
    }}
  }

  const isValidFileUploaded=(file:any)=>{
    const validExtensions = ['jpeg','jpg']
    const fileExtension = file.type.split('/')[1]
    return validExtensions.includes(fileExtension)
  }

  const isValidDocumentUploaded=(file:any)=>{
    const validExtensions = ['jpeg','jpg', 'pdf']
    const fileExtension = file.type.split('/')[1]
    return validExtensions.includes(fileExtension)
  }
  
  const handleProfileImagePreview = (e:any) => {
      if(e.target.files[0].size > 2097152){
        var toastEl = document.getElementById('contactImgSizeErr');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        (document.getElementById('contact_image_add') as HTMLInputElement).value = '';
        return;
      } else {
      const file = e.target.files[0];
      if(isValidFileUploaded(file)){
        let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
        let image_as_files:any = e.target.files[0];
        setProfileImagePreview(image_as_base64);
        setProfileImage(image_as_files);
      }else{
        (document.getElementById('contact_image_add') as HTMLInputElement).value = '';
        var toastEl = document.getElementById('contactImgFormatErr');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }}
  }

  const removeProfile = () => {
    if(profileView.current != null){
      setProfileImagePreview(null);
      setProfileImage(null);
      profileView.current.value = "";
    }
  }

  const imgRemove = (i:any) => {
    if(i == 1) {
      setImagePreview1(null);
      setImageFile1(null);
      (document.getElementById('idDocument1') as HTMLInputElement).value = '';
    } else if (i == 2) {
      setImagePreview2(null);
      setImageFile2(null);
      (document.getElementById('idDocument2') as HTMLInputElement).value = '';
    } else if (i == 2) {
      setImagePreview3(null);
      setImageFile3(null);
      (document.getElementById('idDocument3') as HTMLInputElement).value = '';
    } else if (i == 2) {
      setImagePreview4(null);
      setImageFile4(null);
      (document.getElementById('idDocument4') as HTMLInputElement).value = '';
    } else {
      setImagePreview5(null);
      setImageFile5(null);
      (document.getElementById('idDocument5') as HTMLInputElement).value = '';
    }
  }

  const handleImagePreview3 = (e:any) => {
    if(e.target.files[0].size > 2097152){
      var toastEl = document.getElementById('contactImgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      (document.getElementById('idDocument3') as HTMLInputElement).value = '';
      return;
    } else {
    const file = e.target.files[0];
    if(isValidDocumentUploaded(file)){
      let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
      let image_as_files:any = e.target.files[0];
      setImagePreview3(image_as_base64);
      setImageFile3(image_as_files);
    }else{
      (document.getElementById('idDocument3') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('contactImgFormatErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
    }}
  }

  const handleImagePreview4 = (e:any) => {
    if(e.target.files[0].size > 2097152){
      var toastEl = document.getElementById('contactImgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      (document.getElementById('idDocument4') as HTMLInputElement).value = '';
      return;
    } else {
    const file = e.target.files[0];
    if(isValidDocumentUploaded(file)){
      let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
      let image_as_files:any = e.target.files[0];
      setImagePreview4(image_as_base64);
      setImageFile4(image_as_files);
    }else{
      (document.getElementById('idDocument4') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('contactImgFormatErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
    }}
  }

  const handleImagePreview5 = (e:any) => {
    if(e.target.files[0].size > 2097152){
      var toastEl = document.getElementById('contactImgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      (document.getElementById('idDocument5') as HTMLInputElement).value = '';
      return;
    } else {
    const file = e.target.files[0];
    if(isValidDocumentUploaded(file)){
      let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
      let image_as_files:any = e.target.files[0];
      setImagePreview5(image_as_base64);
      setImageFile5(image_as_files);
    }else{
      (document.getElementById('idDocument5') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('contactImgFormatErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
    }}
  }
      
    return(        
        <div className='card shadow-none rounded-0 w-100'>
          <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_contact_header'>
            <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_contact'})}</h3>            
            <div className='card-toolbar'>
              <div>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                id='kt_contact_close'
              >
                  <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
              </button>
            </div>
          </div>
          <div aria-atomic="true" aria-live="assertive" className="toast bg-success text-white position-absolute end-0 bottom-0 m-3" id="myToast">
            <div className="toast-header">
              <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
              <button aria-label="Close" className="btn-close" 
                data-bs-dismiss="toast" type="button">
              </button>
            </div>
            <div className="toast-body">
                {intl.formatMessage({id: 'contact_added_successfully'})}!
            </div>
          </div>
          <div className='card-body position-relative' id='kt_contact_body'>          
          <div className="accordion" id="accordionExample"> 
          <form noValidate onSubmit={formik.handleSubmit} className='contact_form'>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    {intl.formatMessage({id: 'basic_details'})}
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                      <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                         {profileImagePreview != null && (
                          <div className='profile_preview position-relative image-input image-input-outline'>
                            <img src={profileImagePreview} alt="image preview" className='image-input-wrapper w-125px h-125px' height={100} width={100}/>
                            <div onClick={removeProfile} className="p-1">
                              <KTSVG
                                path='/media/icons/duotune/general/gen040.svg'
                                className='svg-icon-3 cursor_pointer bg-white position-absolute p-0 top-0 m-2 end-0 rounded-circle svg-icon-danger pe-auto ms-2'
                              />
                            </div>
                          </div>
                         )}
                        </div>
                          <div className="d-flex justify-content-center">
                              <span className="btn btn-file">
                                <KTSVG
                                path='/media/icons/duotune/files/fil022.svg'
                                className='svg-icon-1 text_primary ms-2'
                                />
                                <p className='text_primary'>{intl.formatMessage({id: 'upload_profile_image'})}</p>
                                <small className='text-dark required' >Note: jpg, jpeg only acceptable</small>
                                <input type="file" accept="image/*" className='form-control' id='contact_image_add' name="profile_image" ref={profileView} onChange={handleProfileImagePreview}/>
                              </span>
                          </div>
                      </div>
                        <div className="col-md-6 col-12 mb-3">                          
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'first_name'})}</label>
                            <div className="input-group first mb-3 input_prepend">
                              <select {...formik.getFieldProps('salutation')} className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                  <option selected value="1">Mr</option>
                                  <option value="2">Ms</option>
                                  <option value="3">Mrs</option>
                                  <option value="4">Dr</option>
                              </select>
                              <input type="text" {...formik.getFieldProps('first_name')} className='form-control form-control-lg form-control-solid' placeholder="Firstname" autoComplete='off' maxLength={50}/>                             
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_name'})}</label>
                          <div className="input-group mb-3">
                              <input type="text" {...formik.getFieldProps('last_name')} className='form-control form-control-lg form-control-solid' placeholder="Lastname" maxLength={50} autoComplete='off'/>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'phone_number_type'})}</label>
                          <div className="input-group mb-3">
                            <select className="form-select btn btn-sm w-100"
                              {...formik.getFieldProps('phone_number_type')}
                            >
                              {dropList.phone_number_type?.map((value:any,i:any)=> {
                                  return (
                                <option value={value.id} key={i}>{value.option_value}</option>)
                              })}
                            </select>      
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'phone_number'})}</label>
                            <div className="input-group mb-3 input_prepend">
                              <select
                              {...formik.getFieldProps('code')}
                              className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                  {dropList.country_code?.map((value:any,i:any)=> {
                                  return (
                                <option value={value.id} key={i}>{value.option_value}</option>)
                              })}
                              </select>
                              <input type="text" {...formik.getFieldProps('mobilePhone')}
                              className={clsx('form-control form-control-lg form-control-solid',
                                {'is-invalid': formik.touched.mobilePhone && formik.errors.mobilePhone,},
                                {'is-valid': formik.touched.mobilePhone && !formik.errors.mobilePhone,}
                              )}
                              onChange={(e) => formik.setFieldValue("mobilePhone", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} placeholder="Enter your Phone Number"/>
                            </div>
                            {formik.touched.mobilePhone && formik.errors.mobilePhone && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formik.errors.mobilePhone}</span>
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'email_address'})}</label>
                            <div className="input-group mb-3">
                              <input type="text" 
                              {...formik.getFieldProps('email')}
                              className={clsx(
                                'form-control form-control-lg form-control-solid',
                                {
                                  'is-invalid': formik.touched.email && formik.errors.email,
                                },
                                {
                                  'is-valid': formik.touched.email && !formik.errors.email,
                                }
                              )}                              
                              placeholder="Enter your email"/>
                            </div>
                            {formik.touched.email && formik.errors.email && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                </div>
                              </div>
                            )}
                        </div>                        
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className={currentUser?.designation == 6 ? "form-label required" : "form-label"}>{intl.formatMessage({id: 'source'})}</label>
                            <div className="input-group mb-3">
                            <select className={currentUser?.designation == 6 ? "form-select btn btn-sm w-100 disabled" : "form-select btn btn-sm w-100"} 
                            {...formik.getFieldProps('source')}
                            >
                              <option value="">Select</option>
                                {dropList.source?.map((sourceValue:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={sourceValue.id} key={i}>{sourceValue.option_value}</option>
                                  )
                                })}   
                            </select>
                            </div>
                            {formik.touched.source && formik.errors.source && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formik.errors.source}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className={currentUser?.designation == 6 ? "form-label required" : "form-label"}>{intl.formatMessage({id: 'project_name'})}</label>
                            <div className="input-group mb-3">
                            {/* <select className="form-select btn btn-sm w-100" 
                            {...formik.getFieldProps('property_id')}
                            >
                            <option value="">Select</option>
                                {dropList.property?.map((value:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={value.id} key={i}>{value.name_of_building}</option>
                                  )
                                })}   
                            </select> */}
                            <ReactSelect
                              options={dropList.property}
                              // closeMenuOnSelect={false}
                              components={makeAnimated()}
                              getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                              getOptionValue={(option:any) => option.id}
                              value={dropList.property?.find((item:any) => property == item.id) ?? []}
                              classNamePrefix="border-0 "
                              className={"w-100"}
                              onChange={(val:any) => {
                                setProperty(val.id)
                                formik.setFieldValue("property_id", val.id);                                               
                              }}
                              placeholder={"Project.."}
                              />
                            </div>
                            {formik.touched.property_id && formik.errors.property_id && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formik.errors.property_id}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_group'})}</label>
                            <div className="input-group mb-3">
                            <select className="form-select btn btn-sm w-100" 
                            {...formik.getFieldProps('contact_group')}
                            >
                            <option value="">Select</option>
                                {dropList.contact_group?.map((contactGroupVal:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={contactGroupVal.id} key={i}>{contactGroupVal.option_value}</option>
                                  )
                                })}   
                            </select>            
                            </div>
                          </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_type'})}</label>
                            <div className="input-group mb-3">
                              <select 
                              {...formik.getFieldProps('contact_type')} 
                              name="contact_type" className='form-select btn btn-sm w-100'>
                                <option value="">Select</option>
                                {dropList.contact_type?.map((contactTypeValue:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={contactTypeValue.id} key={i}>{contactTypeValue.option_value}</option>
                                  )
                                })} 
                              </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_category'})}</label>
                            <div className="input-group mb-3">
                              <select 
                              {...formik.getFieldProps('contact_category')} 
                              className="form-select btn btn-sm w-100">
                              <option value="">Select</option>
                                {dropList.contact_category?.map((contactCategoryValue:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={contactCategoryValue.id} key={i}>{contactCategoryValue.option_value}</option>
                                  ) 
                                })} 
                              </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group mb-3">
                              <select 
                              {...formik.getFieldProps('status')} 
                              className="form-select btn btn-sm w-100"> 
                              <option value="">Select</option>
                                {dropList.contact_status?.map((contactStatusValue:any,i:any)=> {
                                  return (
                                    <option selected={i == 0 ? true: false} value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                  )
                                })} 
                              </select>      
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                          <div className="input-group">
                              <input type="text" {...formik.getFieldProps('developer_name')} name="developer_name" className="form-control" placeholder="Enter developer Name" maxLength={50}/>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'company_name'})}</label>
                          <div className="input-group">
                              <input type="text" {...formik.getFieldProps('company_name')} name="company_name" className="form-control" placeholder="Enter company Name" maxLength={50}/>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'designation'})}</label>
                          <div className="input-group">
                              <input type="text" {...formik.getFieldProps('designation')} name="designation" className="form-control" placeholder="Enter Company Name" maxLength={50}/>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>
                          {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                              <Select
                                  multiple
                                  displayEmpty
                                  value={assignToName}
                                  onChange={assingToChange}
                                  input={<OutlinedInput />}
                                  renderValue={(selected) => {
                                    var name = [];
                                    var id = [];

                                    for(let i = 0; i < selected.length; i++){
                                      var fields = selected[i].split('-');

                                      var n = fields[0];
                                      var d = fields[1];

                                      name.push(n);
                                      id.push(d);
                                    }
                                      if (selected.length === 0) {
                                        return <p>{intl.formatMessage({id: 'assign_to'})}</p>;
                                      }

                                      return(
                                        <ul className='m-0'>
                                          {name?.map((data, i) => {
                                            return(
                                              <li key={i}>{data}</li>
                                            )
                                          })}                                          
                                        </ul>
                                      )
                                  }}
                                  className='multi_select_field'
                                  MenuProps={MenuProps}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                  >
                                  <MenuItem disabled value="">
                                      <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                  </MenuItem>
                                  {dropList.assign_to?.map((assignVal:any) => (
                                    <MenuItem
                                      key={assignVal.id}
                                      value={assignVal.assign_to_name+'-'+assignVal.id}
                                      style={getStyles(assignVal.assign_to_name, assignToName, theme)}
                                      >
                                      {assignVal.assign_to_name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl> */}
                            <div className="input-group mb-3">
                              <ReactSelect
                                isMulti
                                options={dropList.assign_to}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropList.assign_to?.filter((item:any) => assignToId.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {  
                                    setAssignToId(val);                                              
                                }}
                                placeholder={"Assign-to.."}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                          <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'is_secondary_contact'})}</label>
                          <div className="input-group mb-3 input_prepend">
                              <select className="btn_secondary btn btn-sm w-100" onChange={(e) => {
                                secOnChange(e.target.value);
                              }}>
                                  <option selected value="0">No</option>
                                  <option value="1">Yes</option>
                              </select>
                          </div>
                        </div>
                        {secSelected &&
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'secondary_contact'})}</label>
                            <div className="input-group mb-3">
                            {/* <select className="form-select btn btn-sm w-100" 
                            {...formik.getFieldProps('secondary_contact_id')}
                            >
                              <option value=''>select</option>
                              {dropList.secondary_contact?.map((contactDropVal:any,i:any)=> {
                                return (
                                  <option value={contactDropVal.id} key={i}>{contactDropVal.secondary_contact_name}</option>
                                )
                              })}
                            </select> */}
                            <ReactSelect
                              options={dropList.secondary_contact}
                              // closeMenuOnSelect={false}
                              components={makeAnimated()}
                              getOptionLabel={(option:any) => option.secondary_contact_name ?? '--No Name--'}
                              getOptionValue={(option:any) => option.id}
                              classNamePrefix="border-0 "
                              className={"w-100"}
                              onChange={(val:any) => {
                                formik.setFieldValue("secondary_contact_id", val.id);                                               
                              }}
                              placeholder={"secondary_contact.."}
                              />
                            </div>
                          </div>
                          }
                      </div>                    
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    {intl.formatMessage({id: 'address_details'})}
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                      <div className="row">
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_1'})}</label>
                            <div className="input-group">
                                <input type="text" {...formik.getFieldProps('address_1')} name="address_1" className="form-control" placeholder="Enter Address" maxLength={50}/>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_2'})}</label>
                            <div className="input-group">
                                <input type="text" {...formik.getFieldProps('address_2')} name="address_2" className="form-control" placeholder="Enter Address" maxLength={50}/>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <div className="form-group mb-4">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                <div className="input-group">
                                <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                    formik.setFieldValue("country", e.target.value);
                                    let states = dropList.state?.filter((state:any) => e.target.value == state.country_id);
                                    setState(states);
                                }} >
                                    <option disabled selected value="">Select</option>
                                    {dropList.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                            <option value={data.id} key={i}>{data.name}</option>
                                    )})}
                                </select> 
                                </div> 
                            </div>
                        </div>
                        {/* {state.length != 0 && */}
                        <div className="col-md-6 col-12 mb-3">
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
                        {/* } */}
                        {/* {city.length != 0 && */}
                        <div className="col-md-6 col-12 mb-3">
                            <div className="form-group mb-4">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                <div className="input-group">
                                <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                    <option disabled value="">Select</option>
                                    {/* {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                            <option value={data.id} key={i}>{data.name}</option>
                                    )})} */}
                                      {dropList.city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                        return(
                                            <option value={data.id} key={i}>{data.name}</option>
                                    )})}
                                </select> 
                                </div> 
                            </div>
                        </div>
                        {/* } */}
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zip_code'})}</label>
                            <div className="input-group">
                                <input type="text" {...formik.getFieldProps('zip_code')} name="zip_code" className="form-control" placeholder="Enter Zip Code" onChange={async(e) => { 
                                  formik.setFieldValue("zip_code", e.target?.value.replace(/[^0-9]/g, ""));
                                  if(e.target?.value.length == 6) {
                                    const response = await getLocalityByPIN(e.target?.value)
                                    setLocalityList(response.output)
                                  }                                  
                              }} maxLength={6} />
                            </div>
                          </div> 
                          {/* {localityList .length > 0 &&                         
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                            <div className="input-group mb-3">
                              <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('locality')}>
                              <option value="">Select</option>
                                {localityList?.map((localityValue,i)=> {
                                  return (
                                    <option value={localityValue.Name} key={i}>{localityValue.Name}</option>
                                  )
                                })} 
                              </select>    
                            </div>
                          </div>} */}
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                            <div className="input-group mb-3">
                              {/* <select className="btn_secondary btn bt100" {...formik.getFieldProps('locality')}>
                              <option value="">Select</option>
                                {dropList?.locality?.map((localityValue:any,i:any)=> {
                                  return (
                                    <option value={localityValue.name} key={i}>{localityValue.name}</option>
                                  )
                                })} 
                              </select>     */}
                              <ReactSelect
                                options={dropList?.locality}
                                // closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropList?.locality?.find((item:any) => localityID == item.id) ?? []}
                                classNamePrefix="border-0 "
                                className={"w-100"}
                                placeholder={"Locality"}
                                onChange={(val:any) => {
                                  setLocalityID(val.id)
                                  formik.setFieldValue("locality", val.id);                                               
                                }}
                                />
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  {intl.formatMessage({id: 'more_details'})}
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body">
                      <div className="row">
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_name'})}</label>
                            <div className="input-group mb-3">
                                <input type="text" {...formik.getFieldProps('invoice_name')} name="invoice_name" className="form-control" maxLength={50} placeholder="Enter invoice name"/>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst_number'})}</label>
                            <div className="input-group mb-3">
                                <input type="text" {...formik.getFieldProps('gst_number')} name="gst_number" className="form-control" onChange={(e) => formik.setFieldValue("gst_number", e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} maxLength={15} placeholder="Enter GST No."/>
                            </div>
                            {formik.touched.gst_number && formik.errors.gst_number && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formik.errors.gst_number}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'national_id'})}</label>
                            <div className="input-group">
                                <input type="text" {...formik.getFieldProps('national_id')} name="national_id" className="form-control" placeholder="Enter National ID"/>
                            </div>
                          </div>                         
                          <div className="col-md-6 col-12 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'do_not_disturb'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                    {...formik.getFieldProps('do_not_disturb')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.do_not_disturb?.map((doNotDisturbValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={doNotDisturbValue.id} key={i}>{doNotDisturbValue.option_value}</option>
                                      )
                                    })} 
                                    </select>      
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'marital_status'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                    {...formik.getFieldProps('marital_status')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.marital_status?.map((maritalStatusValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={maritalStatusValue.id} key={i}>{maritalStatusValue.option_value}</option>
                                      )
                                    })} 
                                    </select>
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gender'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                     {...formik.getFieldProps('gender')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.gender?.map((genderValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={genderValue.id} key={i}>{genderValue.option_value}</option>
                                      )
                                    })} 
                                    </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_children'})}</label>
                                  <div className="input-group">
                                      <input type="text" {...formik.getFieldProps('number_of_children')} name="number_of_children" className="form-control" onChange={(e) => formik.setFieldValue("number_of_children", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder=""/>
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'wedding_anniversary'})}</label>
                            <div className="input-group mb-3">
                                <input type="date" {...formik.getFieldProps('wedding_anniversary')} name="wedding_anniversary" className="form-control" placeholder="date"/> 
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'nationality'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                    {...formik.getFieldProps('nationality')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.nationality?.map((nationalityValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={nationalityValue.id} key={i}>{nationalityValue.option_value}</option>
                                      )
                                    })} 
                                    </select>
                                  </div>
                              </div>
                              {/* <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'language'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                    {...formik.getFieldProps('language')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.customer_language?.map((languageValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={languageValue.id} key={i}>{languageValue.option_value}</option>
                                      )
                                    })} 
                                    </select>
                                  </div>
                              </div> */}
                              <div className="col-md-6">
                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'language'})}</label>
                                <div className="input-group mb-3">
                                    <input type="text" {...formik.getFieldProps('language')} name="language" className="form-control" placeholder="language"/> 
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12 mb-3">
                            <div className="row">
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pet_owner'})}</label>
                                  <div className="input-group mb-3">
                                    <select 
                                    {...formik.getFieldProps('pet_owner')}
                                    className="form-select btn btn-sm w-100">
                                    <option  >Select</option>
                                    {dropList.pet_owner?.map((petOwnerValue:any,i:any)=> {
                                      return (
                                        <option selected={i == 0 ? true: false} value={petOwnerValue.id} key={i}>{petOwnerValue.option_value}</option>
                                      )
                                    })} 
                                    </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'dob'})}</label>
                                  <div className="input-group mb-3">
                                      <input type="date" {...formik.getFieldProps('dob')} name="dob" className="form-control" placeholder="dob"/> 
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 col-12 mb-3 px-md-0">
                            {documentList.map((singleService, index) => { 
                              var i = index + 1; 
                              return (
                            <div className="bg_white br_15 p-4 upload_part position-relative mb-3" key={index}>
                              <div className='d-flex justify-content-end py-3'>
                                {documentList.length !== 1 && (
                                  <button className="btn btn-transparent upload_remove" onClick={() => handleDocumentRemove(index)}>
                                    <i className="fa fa-minus-circle text_primary" aria-hidden="true"></i>
                                  </button>
                                )}
                                {documentList.length - 1 === index && documentList.length < 5 && (
                                  <button className="btn btn-transparent upload_add" onClick={handleDocumentAdd}>
                                    <i className="fa fa-plus-circle text_primary" aria-hidden="true"></i>
                                  </button>
                                )}
                              </div>
                              <div className="row">
                                  <div className="col-md-6">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'person_id_documents'})}</label>
                                    <div className="input-group mb-3">
                                      <select 
                                      {...formik.getFieldProps('id_document'+i)}
                                      className="form-select btn btn-sm w-100">
                                        <option  >Select</option>
                                        {dropList.id_documents?.map((idDocumentValue:any,i:any)=> {
                                          return (
                                          <option selected={i == 0 ? true: false} value={idDocumentValue.id} key={i}>{idDocumentValue.option_value}</option>
                                          )
                                        })} 
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'id_number'})}</label>
                                    <div className="input-group mb-3">
                                      <input type="text" {...formik.getFieldProps('id_number'+i)} name={'id_number'+i} className="form-control" onChange={(e) => formik.setFieldValue('id_number'+i, e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder={"ID Number "+i}/>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                      <div className="d-flex justify-content-center py-5">
                                        <div className='position-relative'>
                                          {i == 1 && imagePreview1 != null ? (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview1} alt="image preview" height={100} width={100}/>
                                          <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                          {i == 2 ? imagePreview2 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview2} alt="image preview" height={100} width={100}/>
                                          <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                          {i == 3 ? imagePreview3 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview3} alt="image preview" height={100} width={100}/>
                                          <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                          {i == 4 ? imagePreview4 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview4} alt="image preview" height={100} width={100}/>
                                          <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                          {i == 5 ? imagePreview5 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview5} alt="image preview" height={100} width={100}/>
                                          <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}                                          
                                          
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-center">
                                        <span className="btn btn-file">
                                          <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload'})}
                                          <small className='text-dark required' >Note: jpg, jpeg, pdf only acceptable</small>
                                          <input type="file" id={"idDocument"+i}
                                          onChange={i == 1 ? handleImagePreview1: i == 2 ? handleImagePreview2: i == 3 ? handleImagePreview3 : i == 4 ? handleImagePreview4: handleImagePreview5}
                                           name={'document'+i}/>
                                        </span>
                                      </div>                                      
                                  </div>
                                </div>
                            </div>
                            )})}
                          </div>
                          <div className="col-12 mb-3">
                            <div className="row">
                              <div className="col-md-12 mb-2">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'social_links'})}</label>
                                  <div className="row mx-0">
                                    <div className="col-md-6">
                                      <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'facebook'})}</label>
                                      <div className="input-group mb-3">
                                        <input type="text" {...formik.getFieldProps('facebook')} name='facebook' className="form-control" placeholder=""/>
                                      </div>
                                      {formik.touched.facebook && formik.errors.facebook && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.facebook}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'instagram'})}</label>
                                      <div className="input-group mb-3">
                                        <input type="text" {...formik.getFieldProps('instagram')} name='instagram' className="form-control" placeholder=""/>
                                      </div>
                                      {formik.touched.instagram && formik.errors.instagram && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.instagram}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'linkedin'})}</label>
                                      <div className="input-group mb-3">
                                        <input type="text" {...formik.getFieldProps('linkedin')} name='linkedin' className="form-control" placeholder=""/>
                                      </div>
                                      {formik.touched.linkedin && formik.errors.linkedin && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.linkedin}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-6">
                                      <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'twitter'})}</label>
                                      <div className="input-group mb-3">
                                        <input type="text" {...formik.getFieldProps('twitter')} name='twitter' className="form-control" placeholder=""/>
                                      </div>
                                      {formik.touched.twitter && formik.errors.twitter && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.twitter}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                              </div>
                              {/* <div className="col-md-12">
                                  <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'remarks'})}</label>
                                  <div className="input-group mb-3">
                                      <input type="text" {...formik.getFieldProps('remarks')} name="remarks" className="form-control" maxLength={50} placeholder=""/>
                                  </div>
                              </div> */}
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className='card-footer py-5 text-center' id='kt_contact_footer'>
                  <button
                  type='submit'
                  
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
        </div>
    )
}

export {ContactForm}