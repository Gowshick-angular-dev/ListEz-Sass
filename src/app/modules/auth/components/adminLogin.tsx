import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'
import { adminLogin } from '../core/_requests'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
  
}

export function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const [toggle, setToggle] = useState(false)
  const {saveAuth, setCurrentUser, currentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      
      try {
        const response =  await adminLogin(values.email, values.password)
        if(response.data?.status == 200) {
          localStorage.setItem('role', "1");
          sessionStorage.setItem('language', JSON.stringify(response.data?.language))
          document.documentElement.style.setProperty('--terlogo-color', "#ffffff");
          document.documentElement.style.setProperty('--seclogo-color', "#444444");
          document.documentElement.style.setProperty('--logo-color', "#ff6700");
          sessionStorage.setItem('usersData', JSON.stringify({...response.data?.output, api_token: response.data?.access_token, designation: 1, logo_color: "#ff6700", seclogo_color: "#444444", terlogo_color: "#ffffff", font: 'Open Sans'}))
          saveAuth({...response.data?.output, api_token: response.data?.access_token, designation: 1})
          setCurrentUser({...response.data?.output, api_token: response.data?.access_token, designation: 1})
        } else if(response.data?.status == 404) {
          saveAuth(undefined);
          setStatus('The login detail is incorrect!');
          setSubmitting(false);
          setLoading(false);
          setTimeout(() => setStatus(''), 5000);
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Server Error!')
        setSubmitting(false)
        setLoading(false)
        setTimeout(() => setStatus(''), 5000);
      }
    },
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--terlogo-color', "#ffffff");
    document.documentElement.style.setProperty('--seclogo-color', "#444444");
    document.documentElement.style.setProperty('--logo-color', "#ff6700");
  }, [currentUser])

  return (
    <> 
      <div
        className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat Login_bg'
        style={{
          backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/Banner/LoginBg.jpg')})`,
        }}
      >
        <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20 bgi-position-y-bottom bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
        style={{
          backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/adminPage.png')})`,
        }}
        >
          <a href='#' className='mb-12'>
            <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.png')} className='h-45px' />
          </a>
          <div className='card rounded_30 bs_2'>
            <div className='card-body w-md-500px w-350px bg-white rounded_30 shadow-sm p-10 mx-auto'>               
            <form
              className='form w-100'
              onSubmit={formik.handleSubmit}
              noValidate
              id='kt_login_admin_form'
            >
              <div className='text-start mb-10'>
                <h1 className='text-dark mb-3'>ListEz Admin</h1>
                <div>
                  <p className={formik.status ? 'link-primary text-white fs-9 fw-bolder bg-red br_10' : 'd-none'}><KTSVG path="/media/icons/duotune/general/gen044.svg" className="svg-icon text-white svg-icon-2hx me-3" />{formik.status}</p>
                </div>
              </div>
              <div className='fv-row mb-10'>
                <label className='form-label fs-6 fw-bolder text-dark'>Email</label>
                <input
                  placeholder='Email'
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {'is-invalid': formik.touched.email && formik.errors.email},
                    {
                      'is-valid': formik.touched.email && !formik.errors.email,
                    }
                  )}
                  type='email'
                  name='email'
                  autoComplete='off'
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='fv-plugins-message-container text_primary'>
                    <span role='alert'>{formik.errors.email}</span>
                  </div>
                )}
              </div>
              <div className='fv-row mb-7'>
                <div className='d-flex justify-content-between mt-n5'>
                  <div className='d-flex flex-stack mb-2'>
                    <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                  </div>
                </div>
                <div className='input-group first mb-3 input_prepend bg-gray-100 br_10'>
                <input
                  placeholder='Password'
                  type={!toggle ? 'password' : 'text'}
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control form-control-lg border-0 bg-transparent',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                <span className='d-flex align-items-center px-3' onClick={() => setToggle(!toggle)}>
                  {!toggle ? <i className="fa fa-eye"></i> : 
                  <i className="fa fa-eye-slash"></i>}
                </span>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block text_primary'>
                      <span role='alert'>{formik.errors.password}</span>
                    </div>
                  </div>
                )}

                <div className="d-flex mt-4 justify-content-end">
                  <Link
                    to='/auth/forgot-password'
                    className='link-primary text_primary fs-6 fw-bolder'
                    style={{marginLeft: '5px'}}
                  >
                    forgot password?
                  </Link>
                </div>

              </div>
              <div className='text-center'>
                <button
                  type='submit'
                  id='kt_sign_in_admin'
                  className='btn btn-lg btn_primary w-100 mb-5'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && <span className='indicator-label'>Login</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
                
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="loginToast">
          <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" 
                          data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>Login Successfully!!!</div>
          </div>
      </div>
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="loginFaildToast">
          <div className="toast-header">
              <strong className="me-auto">Error</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" 
                          data-bs-dismiss="toast" type="button">
              </button> 
          </div>
          <div className="toast-body">
              <div>Invalid Credentials!!!</div>
          </div>
      </div>
    </>
  )
}
