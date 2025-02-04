/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {Dropdown1} from '../../../_metronic/partials'
import {useLocation} from 'react-router'
import { getUser, updateProfileImage } from '../../pages/settings/userManagement/core/_requests'
import { useAuth } from '../auth'
import {useIntl} from 'react-intl'

const AccountHeader: React.FC = () => {
  const intl = useIntl();
  const location = useLocation()

  const [userInfo, setUserInfo] = useState<{[key: string]: any}>({});
  const [changeClicked, setChangeClicked] = useState(false);
  const [profilePer, setProfilePer] = useState<number>(0);
  const {currentUser, logout} = useAuth();

  var userId = currentUser?.id;
  var orgId = currentUser?.org_id;
  var roleId = currentUser?.designation;

  const FetchContactDetails =  async () => {    
    const response = await getUser(userId)
    setUserInfo(response.output[0]);

    let n = 0;
    let length = 0;
    let percentage = 0;

    for(let a in response.output[0]) {
      length++;
      if(response.output[0][a] != null) {
        n++;
      }
    }
    percentage = (n/90)*100;
    setProfilePer(percentage);
  }

  const changeImage = async (id:any, image:any) => {
    let image_as_files:any = image.target.files[0];
    var formData = new FormData(); 
    formData.append('profile_image', image_as_files);
    
    const saveUserData = await updateProfileImage(id, formData)
    if(saveUserData != null){                
        setChangeClicked(false);
        setTimeout(function() {
          FetchContactDetails()          
        }, 2000);                                     
    }
}
const removeImage = async (id:any) => {
    var formData = new FormData(); 
    formData.append('profile_image', '');
    
    const saveUserData = await updateProfileImage(id, formData)
    if(saveUserData != null){                
        setChangeClicked(false);
        setTimeout(function() {
          FetchContactDetails()          
        }, 2000);                                     
    }
}

  useEffect(() => {
    FetchContactDetails();
    // DeptList();
    // BranchList();
  }, []);

  return (
    <div className='card mb-5 mb-xl-10'>
      <button type='button' className='d-none' onClick={() => FetchContactDetails()} id='erhwrgiwuriwurtwyergjwerbw87r' />
      <div className='card-body pt-9 pb-0'>
        <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
          <div className='me-7 mb-4'>
            <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userInfo.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+userInfo.id+'/'+userInfo.profile_image : ''} className="user_img" alt='' />
            </div>
            {changeClicked &&
            <div>
            <div className='text-center'>
              <span  onClick={(e) => removeImage(userInfo.id)} title='Remove Image'>
                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-muted svg-icon-1 btn-icon btn btn-sm btn-active-color-danger btn-active-bg-gray-400" />
              </span>
              <span onClick={() => setChangeClicked(false)} title='Cancel'>
                <KTSVG path="/media/icons/duotune/general/gen040.svg" className="svg-icon-muted svg-icon-1 btn-icon btn btn-sm btn-active-color-danger btn-active-bg-gray-400" />
              </span>
            </div>
            </div>
            }
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
              <div className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-2'>
                  <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                  {userInfo.first_name+' '+userInfo.last_name}
                  </a>
                  {/* <a href='#'>
                    <KTSVG
                      path='/media/icons/duotune/general/gen026.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </a> */}
                  {/* <a
                    href='#'
                    className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                    data-bs-toggle='modal'
                    data-bs-target='#kt_modal_upgrade_plan'
                  >
                    Upgrade to Pro
                  </a> */}
                </div>

                <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com006.svg'
                      className='svg-icon-4 me-1'
                    />
                    {orgId != 1 && <>
                    {userInfo.designation == 1 ? 'Admin' : userInfo.designation == 2 ? "Team Leader" : userInfo.designation == 3 ? 'Sub TL' : userInfo.designation == 4 ? 'Excecutive' : userInfo.designation == 5 ? 'HR' : userInfo.designation == 6 ? 'Channel Partner' : 'Employee'}</>}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen018.svg'
                      className='svg-icon-4 me-1'
                    />
                    {userInfo.correspondence_address}
                  </a>
                  <a
                    href='#'
                    className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                  >
                    <KTSVG
                      path='/media/icons/duotune/communication/com011.svg'
                      className='svg-icon-4 me-1'
                    />
                    {userInfo.email}
                  </a>
                </div>
              </div>

              {/* <div className='d-flex my-4'>
                <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr012.svg'
                    className='svg-icon-3 d-none'
                  />

                  <span className='indicator-label'>Follow</span>
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </a>
                <a
                  href='#'
                  className='btn btn-sm btn-primary me-3'
                  data-bs-toggle='modal'
                  data-bs-target='#kt_modal_offer_a_deal'
                >
                  Hire Me
                </a>
                <div className='me-0'>
                  <button
                    className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    data-kt-menu-flip='top-end'
                  >
                    <i className='bi bi-three-dots fs-3'></i>
                  </button>
                  <Dropdown1 />
                </div>
              </div> */}
            </div>

            <div className='d-flex flex-wrap flex-stack'>
              <div className='d-flex flex-column flex-grow-1 pe-8'>
                <div className='d-flex flex-wrap'>
                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      {/* <KTSVG
                        path='/media/icons/duotune/arrows/arr066.svg'
                        className='svg-icon-3 svg-icon-success me-2'
                      /> */}
                      <div className='fs-4 fw-bolder'>{userInfo.p_phone_number}</div>
                    </div>

                    <div className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: 'phone'})}</div>
                  </div>

                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      {/* <KTSVG
                        path='/media/icons/duotune/arrows/arr065.svg'
                        className='svg-icon-3 svg-icon-danger me-2'
                      /> */}
                      <div className='fs-4 fw-bolder'>{userInfo.employee_id}</div>
                    </div>

                    <div className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: 'employee_id'})}</div>
                  </div>

                  <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                    <div className='d-flex align-items-center'>
                      {/* <KTSVG
                        path='/media/icons/duotune/arrows/arr066.svg'
                        className='svg-icon-3 svg-icon-success me-2'
                      /> */}
                      <div className='fs-4 fw-bolder'>{userInfo.department_name}</div>
                    </div>

                    <div className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: 'department'})}</div>
                  </div>
                </div>
              </div>

              <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                  <span className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: 'profile_compleation'})}</span>
                  <span className='fw-bolder fs-6'>{Math.round(profilePer)}%</span>
                </div>
                <div className='h-5px mx-3 w-100 bg-light mb-3'>
                  <div
                    className='bg-success rounded h-5px'
                    role='progressbar'
                    style={{width: profilePer+"%"}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/account/overview' && 'active')
                }
                to='/crafted/account/overview'
              >
                {intl.formatMessage({id: 'overview'})}
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/crafted/account/settings' && 'active')
                }
                to='/crafted/account/settings'
              >
                {intl.formatMessage({id: 'settings'})}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {AccountHeader}
