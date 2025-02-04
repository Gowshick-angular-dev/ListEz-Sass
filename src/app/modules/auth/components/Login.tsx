/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'
import {useIntl} from 'react-intl';
import moment from 'moment'
import { getOrganizationTheme } from '../../../pages/settings/ThemeBuilder/request'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
  
}

export function Login() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [location, setLocation] = useState<any>({})
  const {saveAuth, setCurrentUser} = useAuth()
  var x: any;

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const response = await login(values.email, values.password)
        if(response.data?.status == 200) {
        const auth = response.data;
        let userData:any = {...auth.output, api_token: auth.access_token, approval: auth.approval, subscription: auth.subscription, att_status: auth.check_in}
        
        if(auth.approval == 1) {
        sessionStorage.setItem('usersData', JSON.stringify(userData));
        sessionStorage.setItem('language', JSON.stringify(auth.language));  
        saveAuth(userData)
        setCurrentUser(userData)
        document.documentElement.style.setProperty('--terlogo-color', `${auth.theme?.tertiary_color}`);
        document.documentElement.style.setProperty('--seclogo-color', `${auth.theme?.secondary_color}`);
        document.documentElement.style.setProperty('--logo-color', `${auth.theme?.primary_color}`);
        const kjergiwer:any = {font: auth.theme?.font_family, primary_color: auth.theme?.primary_color, secondary_color: auth.theme?.secondary_color, tertiary_color: auth.theme?.tertiary_color}
        localStorage.setItem('themeData', JSON.stringify(kjergiwer)) 
          if(auth.subscription?.status == 1) {    
            let endDate = moment(auth.subscription?.start_date).add(auth.subscription?.no_of_days, 'days').format("DD-MM-YYYY");    
          } else {
            if(userData?.org_id != 1) {               
            document.getElementById("user_subscription_popup_trigger")?.click();
            }
          }
        } else {
          saveAuth(undefined);
          setStatus('Access denied');
          setSubmitting(false);
          setLoading(false);
          setTimeout(() => setStatus(''), 5000);
        }
        } else if(response.data?.status == 403) {
          saveAuth(undefined);
          setStatus('The login detail is incorrect!');
          setSubmitting(false);
          setLoading(false);
          setTimeout(() => setStatus(''), 5000);
        } else if(response.data?.status == 404) {
          saveAuth(undefined);
          setStatus('The login detail is incorrect!');
          setSubmitting(false);
          setLoading(false);
          setTimeout(() => setStatus(''), 5000);
        }       
      } catch (error) {
        saveAuth(undefined)
        setStatus('server error!')
        setTimeout(() => setStatus(''), 5000);
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed } = position.coords;
          console.log("eorwieurwer", latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed); 
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC62dH2lir6G7ychhBqeSoANaK5IhhSnDw`;
          fetch(url)
          .then(response => response.json())
          .then(data => {
            const address = data.results[0].formatted_address;
            setLocation({latitude, longitude, address});
          })
          .catch(error => {
            console.log(error);
          });             
        },
        error => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [])

  return (
    <div>      
      <form
        className='form w-100'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center mb-10'>
          <h1 className='text-dark mb-3'>Sign in to ListEz</h1>
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
              Forgot password?
            </Link>
          </div>

        </div>
        <div className='text-center'>
          <button
            type='submit'
            id='kt_sign_in_submit'
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
    </div>
  )
}
