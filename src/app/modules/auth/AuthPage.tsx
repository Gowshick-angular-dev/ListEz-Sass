/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import { ResetPassword } from './components/reasetPassword'
import { AdminLogin } from './components/adminLogin'

const AuthLayout = () => {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <a href='#' className='mb-12'>
          <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.png')} className='h-45px' />
        </a>
        <div className='card rounded_30 bs_2'>
          <div className='card-body w-md-500px w-350px bg-white rounded_30 shadow-sm p-10 mx-auto'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset-password' element={<ResetPassword />} />  
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
