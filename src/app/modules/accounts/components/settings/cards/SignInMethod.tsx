/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'
import {KTSVG} from '../../../../../../_metronic/helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {IUpdatePassword, IUpdateEmail, updatePassword, updateEmail} from '../SettingsModel'
import { useAuth } from '../../../../auth'
import { updateContact, updateORGContact } from './_requests'
import {useIntl} from 'react-intl'
import { Toast } from 'bootstrap'


const passwordFormValidationSchema = Yup.object().shape({  

  currentPassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  newPassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
})

const SignInMethod: React.FC = () => {

  const intl = useIntl();
  const {currentUser, logout} = useAuth();

  var rolemail = currentUser?.email;
  const orgId = currentUser?.org_id;
  const [passwordUpdateData, setPasswordUpdateData] = useState<IUpdatePassword>(updatePassword)
  const [showPasswordForm, setPasswordForm] = useState<boolean>(false)  
  const [loading2, setLoading2] = useState(false)
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(false)
  const [toggle3, setToggle3] = useState(false)

  const formik = useFormik<IUpdatePassword>({
    initialValues: {
      ...passwordUpdateData,
    },
    validationSchema: passwordFormValidationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading2(true)
      try {
        var body = {
          "email": rolemail,
          "oldpassword": values.currentPassword,
          "password": values.passwordConfirmation
      }

      let saveContactData;

      if(orgId == 1) {
        saveContactData = await updateContact(body);
      } else {
        saveContactData = await updateORGContact(body)
      }
      
      if(saveContactData.status == 200){
        setLoading2(false);
        document.getElementById('kt_password_cancel')?.click();
        var toastEl = document.getElementById('successMsg');
        const bsToast = new Toast(toastEl!);
        bsToast.show();        
        resetForm();        
      } else {
        setLoading2(false);
        var toastEl = document.getElementById('wrongPassErr');
        const bsToast = new Toast(toastEl!);
        bsToast.show(); 
      }
    } catch (error) {
      console.error(error)
      var toastEl = document.getElementById('errmsgsdghrthr');
      const bsToast = new Toast(toastEl!);
      bsToast.show();
      setLoading2(false)
    }
    //   setTimeout((values) => {
    //     setPasswordUpdateData(values)
    //     setLoading2(false)
    //     setPasswordForm(false)
    //   }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_signin_method'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{intl.formatMessage({id: 'sign_in_method'})}</h3>
        </div>
      </div>

      <div id='kt_account_signin_method' className='collapse show'>
        <div className='card-body border-top p-9'>
          <div className='d-flex flex-wrap align-items-center'>
            <div id='kt_signin_email' 
            // className={' ' + (showEmailForm && 'd-none')}
            >
              <div className='fs-6 fw-bolder mb-1'>{intl.formatMessage({id: 'email_address'})}</div>
              <div className='fw-bold text-gray-600'>{rolemail}</div>
            </div>

            <div
              id='kt_signin_email_edit'
              // className={' ' + (!showEmailForm && 'd-none')}
            >
              {/* <form
                onSubmit={formik1.handleSubmit}
                id='kt_signin_change_email'
                className='form'
                noValidate
              >
                <div className='row mb-6'>
                  <div className='col-lg-6 mb-4 mb-lg-0'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='emailaddress' className='form-label fs-6 fw-bolder mb-3'>
                        Enter New Email Address
                      </label>
                      <input
                        type='email'
                        className='form-control form-control-lg border-0 bg-transparent'
                        id='emailaddress'
                        placeholder='Email Address'
                        {...formik1.getFieldProps('newEmail')}
                      />
                      {formik1.touched.newEmail && formik1.errors.newEmail && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.newEmail}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='fv-row mb-0'>
                      <label
                        htmlFor='confirmemailpassword'
                        className='form-label fs-6 fw-bolder mb-3'
                      >
                        Confirm Password
                      </label>
                      <input
                        type='password'
                        className='form-control form-control-lg border-0 bg-transparent'
                        id='confirmemailpassword'
                        {...formik1.getFieldProps('confirmPassword')}
                      />
                      {formik1.touched.confirmPassword && formik1.errors.confirmPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik1.errors.confirmPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  <button
                    id='kt_signin_submit'
                    type='submit'
                    className='btn btn-primary  me-2 px-6'
                  >
                    {!loading1 && 'Update Email'}
                    {loading1 && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    id='kt_signin_cancel'
                    type='button'
                    onClick={() => {
                      setShowEmailForm(false)
                    }}
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    Cancel
                  </button>
                </div>
              </form> */}
            </div>

            {/* <div id='kt_signin_email_button' className={'ms-auto ' + (showEmailForm && 'd-none')}>
              <button
                onClick={() => {
                  setShowEmailForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                Change Email
              </button>
            </div> */}
          </div>

          <div className='separator separator-dashed my-6'></div>

          <div className='d-flex flex-wrap align-items-center mb-10'>
            <div id='kt_signin_password' className={' ' + (showPasswordForm && 'd-none')}>
              <div className='fs-6 fw-bolder mb-1'>{intl.formatMessage({id: 'password'})}</div>
              <div className='fw-bold text-gray-600'>************</div>
            </div>

            <div
              id='kt_signin_password_edit'
              className={'flex-row-fluid ' + (!showPasswordForm && 'd-none')}
            >
              <form
                onSubmit={formik.handleSubmit}
                id='kt_signin_change_password'
                className='form'
                noValidate
              >
                <div className='row mb-1'>
                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='currentpassword' className='form-label fs-6 fw-bolder mb-3'>
                        {intl.formatMessage({id: 'current_password'})}
                      </label>
                      <div className='input-group first mb-3 input_prepend bg-gray-100 br_10'>
                        <input
                          type={!toggle1 ? 'password' : 'text'}
                          className='form-control form-control-lg border-0 bg-transparent '
                          id='currentpassword'
                          {...formik.getFieldProps('currentPassword')}
                        />
                        <span className='d-flex align-items-center px-3' onClick={() => setToggle1(!toggle1)}>
                          {!toggle1 ? <i className="fa fa-eye"></i> : 
                          <i className="fa fa-eye-slash"></i>}
                        </span>
                      </div>
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.currentPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='newpassword' className='form-label fs-6 fw-bolder mb-3'>
                        {intl.formatMessage({id: 'new_password'})}
                      </label>
                      <div className='input-group first mb-3 input_prepend bg-gray-100 br_10'>
                        <input
                          type={!toggle2 ? 'password' : 'text'}
                          className='form-control form-control-lg border-0 bg-transparent '
                          id='newpassword'
                          {...formik.getFieldProps('newPassword')}
                        />
                        <span className='d-flex align-items-center px-3' onClick={() => setToggle2(!toggle2)}>
                          {!toggle2 ? <i className="fa fa-eye"></i> : 
                          <i className="fa fa-eye-slash"></i>}
                        </span>
                      </div>
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.newPassword}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='col-lg-4'>
                    <div className='fv-row mb-0'>
                      <label htmlFor='confirmpassword' className='form-label fs-6 fw-bolder mb-3'>
                        {intl.formatMessage({id: 'confirm_new_password'})}
                      </label>
                      <div className='input-group first mb-3 input_prepend bg-gray-100 br_10'>
                        <input
                          type={!toggle3 ? 'password' : 'text'}
                          className='form-control form-control-lg border-0 bg-transparent'
                          id='confirmpassword'
                          {...formik.getFieldProps('passwordConfirmation')}
                        />
                        <span className='d-flex align-items-center px-3' onClick={() => setToggle3(!toggle3)}>
                          {!toggle3 ? <i className="fa fa-eye"></i> : 
                          <i className="fa fa-eye-slash"></i>}
                        </span>
                      </div>
                      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.passwordConfirmation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='form-text mb-5'>
                  {intl.formatMessage({id: 'password_must_be_at_least_8_character_and_contain_symbols'})}
                </div>

                <div className='d-flex'>
                  <button
                    id='kt_password_submit'
                    type='submit'
                    className='btn btn_primary me-2 px-6'
                  >
                    {!loading2 && intl.formatMessage({id: 'update_password'})}
                    {loading2 && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPasswordForm(false)
                    }}
                    id='kt_password_cancel'
                    type='button'
                    className='btn btn-color-gray-400 btn-active-light-primary px-6'
                  >
                    {intl.formatMessage({id: 'cancel'})}
                  </button>
                </div>
              </form>
            </div>

            <div
              id='kt_signin_password_button'
              className={'ms-auto ' + (showPasswordForm && 'd-none')}
            >
              <button
                onClick={() => {
                  setPasswordForm(true)
                }}
                className='btn btn-light btn-active-light-primary'
              >
                {intl.formatMessage({id: 'change_password'})}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="successMsg">
          <div className="toast-header">
              <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" 
                          data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>{intl.formatMessage({id: 'password_changed_successfully'})}!</div>
          </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="wrongPassErr">
          <div className="toast-header">
              <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" 
                          data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>{intl.formatMessage({id: 'wrong_old_password'})}!</div>
          </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="errmsgsdghrthr">
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

export {SignInMethod}
