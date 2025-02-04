import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useAuth } from '../../../../auth'
import { getBranch, getDept, getUser, getUsersDropdown, updateUser } from '../../../../../pages/settings/userManagement/core/_requests'
import { Toast } from 'bootstrap'
import Moment from 'moment'
import {useIntl} from 'react-intl'
import { updateProfile } from './_requests'

const initialValues = {
  first_name: "",
  last_name: "",
  p_phone_number: "",
  email: "",
  sec_mobile: "",
  o_phone_number: "",
  o_email: "",
  emergency_contact_no: "",
  aadhar_number: "",
  pan_number: "",
  dob: "",
  marital_status: "",
  anniversary_date: "",
  date_of_joining: "",
  permenent_address: "",
  correspondant_address: "",
  profile_image: "",
  kid_2: "",
  kid_3: "",
  emergency_contact_person_name: "",
  emergency_contact_person_relation: "",
  emergency_contact_number: "",
  account_no: "",
  ifsc_code: "",
  bank_name: "",
  name_as_per_bank_record: "",
  branch_name: "",
  sec_phone_number: "",
  kid_1: "",
  no_of_kids: "",
  spouse_dob: "",
  spouse_name: "",
  fathers_name: "",
  blood_group: "",
  gender: "",
  bank_record_name: "",
  last_company: "",
  years_of_experience: "",
}

const profileDetailsSchema = Yup.object().shape({
  first_name: Yup.string()
      .required('First Name is required')
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
  last_name: Yup.string()            
      .max(50, 'Maximum 50 characters'),  
  p_phone_number: Yup.string()
      .min(7, 'Minimum 7 characters')
      .required('Phone Number is required'),
  sec_mobile: Yup.string()
      .min(7, 'Minimum 7 characters'),
  emergency_contact_no: Yup.string()
      .min(7, 'Minimum 7 characters'),
  aadhar_number: Yup.string()
      .min(12, 'Minimum 12 characters')
      .max(12, 'Maximum 12 characters'),
  pan_number: Yup.string()
      .min(10, 'Minimum 10 characters')
      .max(10, 'Minimum 10 characters'),
  dob: Yup.string(),
  marital_status: Yup.string(),
  anniversary_date: Yup.string(),
  date_of_joining: Yup.string(),
  permenent_address: Yup.string(),
  correspondant_address: Yup.string(),
  o_phone_number: Yup.string()
      .min(7, 'Minimum 7 characters'),
  o_email: Yup.string(),
  kid_2: Yup.string(),
  kid_3: Yup.string(),
  emergency_contact_person_name: Yup.string(),
  emergency_contact_person_relation: Yup.string(),
  account_no: Yup.string(),
  ifsc_code: Yup.string(),
  bank_name: Yup.string(),
  name_as_per_bank_record: Yup.string(),
  branch_name: Yup.string(),
  sec_phone_number: Yup.string()
      .min(7, 'Minimum 7 characters'),
  kid_1: Yup.string(),
  no_of_kids: Yup.string(),
  spouse_dob: Yup.string(),
  spouse_name: Yup.string(),
  fathers_name: Yup.string(),
  blood_group: Yup.string(),
  gender: Yup.string(),          
})

const ProfileDetails: React.FC = () => {

  const intl = useIntl();
  
  const {currentUser, logout} = useAuth();
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [imageFile, setImageFile] = useState(null);
  const [imgPre, setImgPre] = useState(false);
  const [userInfo, setUserInfo] = useState<{[key: string]: any}>({});
  const [dropdowns, setDropdowns] = useState<any>({});  
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('p_phone_number', values.p_phone_number);
        formData.append('o_phone_number', values.o_phone_number);
        formData.append('o_email', values.o_email);
        formData.append('aadhar_number', values.aadhar_number);
        formData.append('pan_number', values.pan_number);
        formData.append('dob', values.dob == "Invalid date" ? '' : values.dob);
        formData.append('date_of_joining', values.date_of_joining == "Invalid date" ? '' : values.date_of_joining);
        formData.append('gender', values.gender);
        formData.append('blood_group', values.blood_group);
        formData.append('sec_mobile', values.sec_phone_number);
        formData.append('fathers_name', values.fathers_name);
        formData.append('marital_status', values.marital_status);
        formData.append('spouse_name', values.spouse_name);
        formData.append('emergency_contact_no', values.emergency_contact_number);
        formData.append('emergency_contact_person_name', values.emergency_contact_person_name);
        formData.append('relation_person', values.emergency_contact_person_relation);
        formData.append('no_of_kids', values.no_of_kids);
        formData.append('kid_name_1', values.kid_1);
        formData.append('kid_name_2', values.kid_2);
        formData.append('kid_name_3', values.kid_3);
        formData.append('acc_number', values.account_no);
        formData.append('ifsc_code', values.ifsc_code);
        formData.append('permenent_address', values.permenent_address);
        formData.append('correspondence_address', values.correspondant_address);
        formData.append('spouse_dob', values.spouse_dob);
        formData.append('anniversary_date', values.anniversary_date);
        formData.append('bank_record_name', values.bank_record_name);
        formData.append('last_company', values.last_company);
        formData.append('branch_name', values.branch_name);
        formData.append('years_of_experience', values.years_of_experience);
        formData.append('profile_image', imageFile!);


        const updateUserData = await updateProfile(formData, userId)

        if(updateUserData.status == 200){
          setLoading(false)
          imgRemove();
          document.getElementById('erhwrgiwuriwurtwyergjwerbw87r')?.click();
          document.getElementById('jrht7tryiubou6fgdfbsdfuegwheoweug')?.click();
          document.getElementById('erhwrgiwuriwurtwyergjwerbw87r345345345345')?.click();
          var toastEl = document.getElementById('userProfileUpdate');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        } 

      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setLoading(false);
        setStatus('The registration details is incorrect');
        var toastEl = document.getElementById('profileErrMsg');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
    },
  })

const FetchContactDetails =  async () => {
  const response = await getUser(userId)
  setUserInfo(response.output[0]);
  
  formik.setFieldValue('first_name', response.output[0].first_name ?? '')
  formik.setFieldValue('last_name', response.output[0].last_name ?? '')
  formik.setFieldValue('gender', response.output[0].gender ?? '')
  formik.setFieldValue('blood_group', response.output[0].blood_group ?? '')
  formik.setFieldValue('p_phone_number', response.output[0].p_phone_number ?? '')
  formik.setFieldValue('o_phone_number', response.output[0].o_phone_number ?? '')
  formik.setFieldValue('fathers_name', response.output[0].fathers_name ?? '')
  formik.setFieldValue('spouse_name', response.output[0].spouse_name ?? '')
  formik.setFieldValue('spouse_dob', response.output[0].spouse_dob ?? '')
  formik.setFieldValue('anniversary_date', response.output[0].anniversary_date ?? '')
  formik.setFieldValue('o_email', response.output[0].o_email ?? '')
  formik.setFieldValue('aadhar_number', response.output[0].aadhar_number ?? '')
  formik.setFieldValue('pan_number', response.output[0].pan_number ?? '')
  formik.setFieldValue('dob', Moment(response.output[0].dob).format('YYYY-MM-DD') ?? '')
  formik.setFieldValue('date_of_joining', Moment(response.output[0].date_of_joining).format('YYYY-MM-DD') ?? '')
  formik.setFieldValue('team_leader', response.output[0].team_leader ?? '')
  formik.setFieldValue('total_ctc', response.output[0].total_ctc ?? '')
  formik.setFieldValue('portfolio_head', response.output[0].portfolio_head ?? '')
  formik.setFieldValue('marital_status', response.output[0].marital_status ?? '')
  formik.setFieldValue('no_of_kids', response.output[0].no_of_kids ?? '')
  formik.setFieldValue('kid_1', response.output[0].kid_name_1 ?? '')
  formik.setFieldValue('kid_2', response.output[0].kid_name_2 ?? '')
  formik.setFieldValue('kid_3', response.output[0].kid_name_3 ?? '')
  formik.setFieldValue('emergency_contact_person_name', response.output[0].emergency_contact_person_name ?? '')
  formik.setFieldValue('emergency_contact_person_relation', response.output[0].relation_person ?? '')
  formik.setFieldValue('emergency_contact_number', response.output[0].emergency_contact_no ?? '')
  formik.setFieldValue('account_no', response.output[0].acc_number ?? '')
  formik.setFieldValue('ifsc_code', response.output[0].ifsc_code ?? '')
  formik.setFieldValue('bank_name', response.output[0].bank_name ?? '')
  formik.setFieldValue('bank_record_name', response.output[0].bank_record_name ?? '')
  formik.setFieldValue('branch_name', response.output[0].branch_name ?? '')
  formik.setFieldValue('sec_phone_number', response.output[0].sec_mobile ?? '')  
  formik.setFieldValue('years_of_experience', response.output[0].years_of_experience ?? '')  
  formik.setFieldValue('last_company', response.output[0].last_company ?? '')  
  formik.setFieldValue('correspondant_address', response.output[0].correspondence_address ?? '')  
  formik.setFieldValue('permenent_address', response.output[0].permenent_address ?? '')  
}

const dropdownsList = async () => {
  const response = await getUsersDropdown(roleId)
  setDropdowns(response.output);
}

const isValidFileUploaded=(file:any)=>{
  const validExtensions = ['png','jpeg','jpg']
  const fileExtension = file.type.split('/')[1]
  return validExtensions.includes(fileExtension)
}

const handleImagePreview = (e:any) => {
  if(e.target.files[0].size > 2097152){
      (document.getElementById('userProfileImgUdt') as HTMLInputElement).value = '';
      var toastEl = document.getElementById('profileimgSizeErr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      return;
    } else {
      const file = e.target.files[0];
      if(isValidFileUploaded(file)){
          let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
          let image_as_files:any = e.target.files[0];
      
          setImageFile(image_as_files);
          setImagePreview(image_as_base64);
          setImgPre(true);        
      } else { 
          (document.getElementById('userProfileImgUdt') as HTMLInputElement).value = '';
          var toastEl = document.getElementById('profileimgFileErr');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
      } 
    }
}

const imgRemove = () => {
  (document.getElementById('userProfileImgUdt') as HTMLInputElement).value = '';
  setImageFile(null);
  setImagePreview('');
  setImgPre(false);
}

useEffect(() => {
  FetchContactDetails();
  dropdownsList();
}, []);

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{intl.formatMessage({id: 'profile_details'})}</h3>
        </div>
      </div>    
      <div id='kt_account_profile_details' className='collapse show row border-top'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='col-xxl-8 col-xl-8 col-lg-9 col-md-12 col-sm-12'>
            <div className='card-body p-9'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'avatar'})}</label>
                  <div className={imgPre ? 'col-lg-6 fv-row' : 'col-lg-8 fv-row'}>
                    <input
                    type='file' id='userProfileImgUdt'
                    onChange={handleImagePreview}
                    name={'profile_image'}
                    className='form-control form-control-lg form-control-solid'
                  />
                  </div>                  
                    {imgPre && <div className='col-lg-2'>
                    <div className='position-relative'><img className='w-100px h-100px' src={imagePreview} alt="image preview"/>
                    <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></div>
                    </div>}                                 
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'full_name'})}</label>
                <div className='col-lg-8'>
                  <div className='row'>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        placeholder='First name'
                        {...formik.getFieldProps('first_name')}
                      />
                      {formik.touched.first_name && formik.errors.first_name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.first_name}</div>
                        </div>
                      )}
                    </div>
                    <div className='col-lg-6 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Last name'
                        {...formik.getFieldProps('last_name')}
                      />
                      {formik.touched.last_name && formik.errors.last_name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.last_name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'employee_id'})}</label>
                  <div className='col-lg-8 fv-row'>
                    <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Employee ID'
                    {...formik.getFieldProps('employee_id')}
                  />
                  </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'gender'})}</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid form-select-lg'
                    {...formik.getFieldProps('gender')}
                  >
                    <option value=''>Select</option>
                      {dropdowns.gender?.map((deptValue:any,i:any)=> {
                      return (
                      <option value={deptValue.id} key={i}>{deptValue.option_value}</option>
                      )
                      })}                  
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.gender}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'blood_group'})}</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid form-select-lg'
                    {...formik.getFieldProps('blood_group')}
                  >
                    <option value=''>Select</option>
                    {dropdowns.blood_group?.map((branchValue:any,i:any)=> {
                      return (
                      <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                      )
                      })}                  
                  </select>
                  {formik.touched.blood_group && formik.errors.blood_group && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.blood_group}</div>
                    </div>
                  )}
                </div>
              </div>              
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'personal_contact_number'})}</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={15}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Phone number'
                    {...formik.getFieldProps('p_phone_number')}
                    onChange={(e) => formik.setFieldValue("p_phone_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.p_phone_number && formik.errors.p_phone_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.p_phone_number}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'official_mobile_number'})}</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={15}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Phone number'
                    {...formik.getFieldProps('o_phone_number')}
                    onChange={(e) => formik.setFieldValue("o_phone_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.o_phone_number && formik.errors.o_phone_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.o_phone_number}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'fathers_name'})}</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder="Father's Name"
                    {...formik.getFieldProps('fathers_name')}
                  />
                  {formik.touched.fathers_name && formik.errors.fathers_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.fathers_name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>{intl.formatMessage({id: 'marital_status'})}</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid form-select-lg'
                    {...formik.getFieldProps('marital_status')}
                  >
                    <option value=''>Select</option>
                    {dropdowns.marital_status?.map((branchValue:any,i:any)=> {
                      return (
                      <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                      )
                      })}                  
                  </select>
                  {formik.touched.marital_status && formik.errors.marital_status && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.marital_status}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'spouse_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Spouse Name'
                    {...formik.getFieldProps('spouse_name')}
                  />
                  {formik.touched.spouse_name && formik.errors.spouse_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.spouse_name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'spouse_dob'})}</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Spouse DOB'
                    {...formik.getFieldProps('spouse_dob')}
                  />
                  {formik.touched.spouse_dob && formik.errors.spouse_dob && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.spouse_dob}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'no_of_kids'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={1}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='No. of Kids'
                    {...formik.getFieldProps('no_of_kids')}
                    onChange={(e) => formik.setFieldValue("no_of_kids", e.target?.value.replace(/[^0-3]/g, ""))}
                  />
                  {formik.touched.no_of_kids && formik.errors.no_of_kids && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.no_of_kids}</div>
                    </div>
                  )}
                </div>
              </div>
              {formik.values.no_of_kids > '0' &&
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'kid_1_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Kid 1'
                    {...formik.getFieldProps('kid_1')}
                  />
                  {formik.touched.kid_1 && formik.errors.kid_1 && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.kid_1}</div>
                    </div>
                  )}
                </div>
              </div>}
              {formik.values.no_of_kids > '1' &&
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'kid_2_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Kid 2'
                    {...formik.getFieldProps('kid_2')}
                  />
                  {formik.touched.kid_2 && formik.errors.kid_2 && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.kid_2}</div>
                    </div>
                  )}
                </div>
              </div>}
              {formik.values.no_of_kids > '2' &&
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'kid_3_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Kid 3'
                    {...formik.getFieldProps('kid_3')}
                  />
                  {formik.touched.kid_3 && formik.errors.kid_3 && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.kid_3}</div>
                    </div>
                  )}
                </div>
              </div>}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'anniversary_date'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Anniversary Date'
                    {...formik.getFieldProps('anniversary_date')}
                  />
                  {formik.touched.anniversary_date && formik.errors.anniversary_date && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.anniversary_date}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'emergency_contact_person_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Emergency Contact Person Name'
                    {...formik.getFieldProps('emergency_contact_person_name')}
                  />
                  {formik.touched.emergency_contact_person_name && formik.errors.emergency_contact_person_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.emergency_contact_person_name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'emergency_contact_person_relation'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Emergency Contact Person Relation'
                    {...formik.getFieldProps('emergency_contact_person_relation')}
                  />
                  {formik.touched.emergency_contact_person_relation && formik.errors.emergency_contact_person_relation && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.emergency_contact_person_relation}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'emergency_contact_number'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={15}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Emergency Contact Number'
                    {...formik.getFieldProps('emergency_contact_number')}
                    onChange={(e) => formik.setFieldValue("emergency_contact_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.emergency_contact_number && formik.errors.emergency_contact_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.emergency_contact_number}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'account_no'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Account number'
                    {...formik.getFieldProps('account_no')}
                  />
                  {formik.touched.account_no && formik.errors.account_no && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.account_no}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'ifsc_code'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='IFSC Code'
                    {...formik.getFieldProps('ifsc_code')}
                  />
                  {formik.touched.ifsc_code && formik.errors.ifsc_code && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.ifsc_code}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'bank_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Bank Name'
                    {...formik.getFieldProps('bank_name')}
                  />
                  {formik.touched.bank_name && formik.errors.bank_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.bank_name}</div>
                    </div>
                  )}
                </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'bank_record_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Name'
                    {...formik.getFieldProps('bank_record_name')}
                  />
                  {formik.touched.bank_record_name && formik.errors.bank_record_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.bank_record_name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'bank_name'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Bank Name'
                    {...formik.getFieldProps('branch_name')}
                  />
                  {formik.touched.branch_name && formik.errors.branch_name && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.branch_name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'sec_phone_number'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={15}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Sec Phone number'
                    {...formik.getFieldProps('sec_phone_number')}
                    onChange={(e) => formik.setFieldValue("sec_phone_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.sec_phone_number && formik.errors.sec_phone_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.sec_phone_number}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'official_mail'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='email' disabled
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Email'
                    {...formik.getFieldProps('o_email')}
                  />
                  {formik.touched.o_email && formik.errors.o_email && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.o_email}</div>
                    </div>
                  )}
                </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'aadhar_number'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={12}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Aadhar Number'
                    {...formik.getFieldProps('aadhar_number')}
                    onChange={(e) => formik.setFieldValue("aadhar_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.aadhar_number && formik.errors.aadhar_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.aadhar_number}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'pan_number'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text' maxLength={10}
                    className='form-control form-control-lg form-control-solid'
                    placeholder='PAN Number'
                    {...formik.getFieldProps('pan_number')}
                    onChange={(e) => formik.setFieldValue("pan_number", e.target?.value.replace(/[^0-9]/g, ""))}
                  />
                  {formik.touched.pan_number && formik.errors.pan_number && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.pan_number}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'date_of_birth'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Date of Birth'
                    {...formik.getFieldProps('dob')}
                  />
                  {formik.touched.dob && formik.errors.dob && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.dob}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'date_of_joining'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Date of Joining'
                    {...formik.getFieldProps('date_of_joining')}
                  />
                  {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.date_of_joining}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'last_company'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Last Company'
                    {...formik.getFieldProps('last_company')}
                  />
                  {formik.touched.last_company && formik.errors.last_company && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.last_company}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'years_of_experience'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Years of Experiance'
                    {...formik.getFieldProps('years_of_experience')}
                  />
                  {formik.touched.years_of_experience && formik.errors.years_of_experience && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.years_of_experience}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'permenent_address'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <textarea
                    rows={4}
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('permenent_address')}
                  />
                  {formik.touched.permenent_address && formik.errors.permenent_address && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.permenent_address}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>{intl.formatMessage({id: 'correspondant_address'})}</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <textarea
                    rows={4}
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('correspondant_address')}
                  />
                  {formik.touched.correspondant_address && formik.errors.correspondant_address && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.correspondant_address}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn_primary' disabled={loading}>
              {!loading && 'Save Changes'}
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
  )
}

export {ProfileDetails}
