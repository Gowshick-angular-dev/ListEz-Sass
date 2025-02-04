/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {Languages} from './Languages'
import {toAbsoluteUrl} from '../../../helpers'
import { getUser } from '../../../../app/pages/settings/userManagement/core/_requests'
import {useIntl} from 'react-intl'

const HeaderUserMenu: FC = () => {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const [userInfo, setUserInfo] = useState<{[key: string]: any}>({});

  var userId = currentUser?.id;
  var roleId = currentUser?.designation;

  const FetchContactDetails =  async () => {    
    const fetchDetails = await getUser(userId)
    setUserInfo(fetchDetails.output[0]);
  }

  useEffect(() => {
    FetchContactDetails();
  },[]);

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <button type='button' className='d-none' onClick={() => FetchContactDetails()} id='erhwrgiwuriwurtwyergjwerbw87r345345345345' />
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
          <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userInfo.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+userInfo.id+'/'+userInfo.profile_image : ''} className="user_img" alt='' />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.first_name ?? ''} {currentUser?.last_name ?? ''}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>{ roleId == 1 ? 'Admin' : roleId == 2 ? 'TeamLeader' : roleId == 3 ? 'Sub TL' : roleId == 4 ? 'Executive' : roleId == 5 ? 'HR' : roleId == 6 ? 'Channel Partner' : 'Employee'}</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      {/* <div className='menu-item px-5'>
        <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
          My Profile
        </Link>
      </div> */}

      {/* <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          <span className='menu-text'>My Projects</span>
          <span className='menu-badge'>
            <span className='badge badge-light-danger badge-circle fw-bolder fs-7'>3</span>
          </span>
        </a>
      </div> */}

      {/* <div
        className='menu-item px-5'
        data-kt-menu-trigger='hover'
        data-kt-menu-placement='left-start'
        data-kt-menu-flip='bottom'
      >
        <a href='#' className='menu-link px-5'>
          <span className='menu-title'>My Subscription</span>
          <span className='menu-arrow'></span>
        </a>

        <div className='menu-sub menu-sub-dropdown w-175px py-4'>
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Referrals
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Billing
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Payments
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link d-flex flex-stack px-5'>
              Statements
              <i
                className='fas fa-exclamation-circle ms-2 fs-7'
                data-bs-toggle='tooltip'
                title='View your statements'
              ></i>
            </a>
          </div>

          <div className='separator my-2'></div>

          <div className='menu-item px-3'>
            <div className='menu-content px-3'>
              <label className='form-check form-switch form-check-custom form-check-solid'>
                <input
                  className='form-check-input w-30px h-20px'
                  type='checkbox'
                  value='1'
                  defaultChecked={true}
                  name='notifications'
                />
                <span className='form-check-label text-muted fs-7'>Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          My Statements
        </a>
      </div> */}

      {/* <div className='separator my-2'></div> */}

      <Languages />

      <div className='menu-item px-5 my-1'>
        <Link to='crafted/account' className='menu-link px-5'>
          {intl.formatMessage({id: 'profile_setting'})}
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          {intl.formatMessage({id: 'sign_out'})}
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
