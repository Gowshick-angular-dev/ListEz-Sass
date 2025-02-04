import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword, resetPassword} from '../core/_requests'
import { Toast } from 'bootstrap'
import {useIntl} from 'react-intl';

const initialValues = {
    pass: '',
    password: '',
}

const forgotPasswordSchema = Yup.object().shape({
    pass: Yup.string().required('Password is required')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
    password: Yup.string().required().oneOf([Yup.ref("pass"), null], "Passwords must match"), 
})

export function ResetPassword() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async(values, {setStatus, setSubmitting}) => {
       
        setLoading(true);
        try {
          const response = await resetPassword(window.location.search.slice(7, ), values.password)
          if(response != null) {
            var toastEl = document.getElementById('passResetToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show(); 
            setTimeout(() => document.getElementById('kt_login_password_reset_form_cancel_button')?.click(), 1000);
          }
        } catch {
          var toastEl = document.getElementById('passErrToast');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        }
    },
  })

  useEffect(() => {
    console.log(window);
    console.log(window.location.search.slice(7, ));
  }, []);

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          <h1 className='text-dark mb-3'>Reset password</h1>
        </div>
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>New password</label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('pass')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.pass && formik.errors.pass},
              {
                'is-valid': formik.touched.pass && !formik.errors.pass,
              }
            )}
          />
          {formik.touched.pass && formik.errors.pass && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert' className='text-danger'>{formik.errors.pass}</span>
              </div>
            </div>
          )}
        </div>
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm password</label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.password && formik.errors.password},
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert' className='text-danger'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_passwordreset_submit'
            className='btn btn-lg btn_primary fw-bolder me-4'
          >
            <span className='indicator-label'>Submit</span>
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn_light_primary fw-bolder'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>{' '}
        </div>
      </form>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="passResetToast">
          <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>Password reseted successfully!</div>
          </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="passErrToast">
          <div className="toast-header">
              <strong className="me-auto">Error</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" 
                          data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>Something went wrong!</div>
          </div>
      </div>
    </>
  )
}
