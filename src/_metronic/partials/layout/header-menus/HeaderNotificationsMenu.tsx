import { Toast } from 'bootstrap'
import clsx from 'clsx'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../../../../app/modules/auth'
import {KTSVG, toAbsoluteUrl, defaultAlerts, defaultLogs} from '../../../helpers'
import { getNotifications, updateNotifications } from './core/_request'
import {useIntl} from 'react-intl'

const HeaderNotificationsMenu: FC = () => {
  const intl = useIntl();
  
  const {currentUser, logout} = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  var userId = currentUser?.id;
  var roleId = currentUser?.designation;
  console.log("userId");
  console.log(userId);
  
  const notificationList =  async () => {   
    const notificationStatusResponse = await getNotifications(userId)
    setNotifications(notificationStatusResponse);
}

const handleChange = async (id:any) => {
  const updateNotficationData = await updateNotifications(id);
  const contactStatusResponse = await getNotifications(userId)
  setNotifications(contactStatusResponse);           
 }  


useEffect(() => {
  // notificationList();
},[]);
  
  return (
  <div
    className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
    data-kt-menu='true'
  >
    <div
      className='d-flex flex-column bgi-no-repeat rounded-top bg_primary'
      style={{ backgroundImage: `url('${toAbsoluteUrl('/media/misc/patteren-123.png')}')` }}
    >
      <div className='d-flex justify-content-between'>
      <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
        {intl.formatMessage({id: 'notifications'})} 
      </h3>
      <span className='fs-8 p-5 pe-9 icon_pulse' title={notifications.length?.toString()}><i className="bi bi-bell fs-1 text-white text-strong"></i></span>
      </div>
       
      <ul className='nav nav-pills nav-stretch fw-bold px-9' id="pills-tab" role="tablist">
      
        {/* <li className='nav-item' role="presentation">
          <a
            className='nav-link active text-white bg-opacity-75 opacity-state-100 pb-4' data-bs-toggle="pill" data-bs-target="#notification" 
             aria-selected="true" aria-controls="notification" type="button" role="tab"
            id='#kt_topbar_notifications_1'
          >
            Alerts
          </a>
        </li> */}

        {/* <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4 active'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_2'
          >
            Updates
          </a>
        </li>

        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_3'
          >
            Logs
          </a>
        </li> */}
      </ul>
    </div>

    <div className='tab-content' id="pills-tabContent">
      <div className='tab-pane fade show active' id='notification' role='tabpanel' aria-labelledby="notification-tab">
        <div className='scroll-y mh-325px my-5 px-8'>
          {notifications.length > 0 ?
        <>
          {notifications.map((alert, index) => (
            <div key={`alert${index}`} className='d-flex flex-stack py-4' 
            onClick={() => handleChange(alert.id)}
            >
              <div className='d-flex align-items-center'>
                <div className='symbol symbol-35px me-4'>
                  <span className={clsx('symbol-label', `bg-light-${alert.state}`)}>
                    {' '}
                    <KTSVG
                      path={`/media/${alert.icon}`}
                      className={`svg-icon-2 svg-icon-${alert.state}`} />
                  </span>
                </div>

                <div className='mb-0 me-2'>
                  <div className='text-gray-800 fs-7'>{alert.description}</div>
                </div>
              </div>
              <span className='badge badge-light fs-8'>{alert.updated_at}</span>
            </div>
          ))}
          </>:<p>{intl.formatMessage({id: 'no_notifications'})}!!!</p>}
        </div>

        {/* <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
          </Link>
        </div> */}
      </div>

      {/* <div className='tab-pane fade show active' id='kt_topbar_notifications_2' role='tabpanel'>
        <div className='d-flex flex-column px-9'>
          <div className='pt-10 pb-0'>
            <h3 className='text-dark text-center fw-bolder'>Get Pro Access</h3>

            <div className='text-center text-gray-600 fw-bold pt-1'>
              Outlines keep you honest. They stoping you from amazing poorly about drive
            </div>

            <div className='text-center mt-5 mb-9'>
              <a
                href='#'
                className='btn btn-sm btn-primary px-6'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_upgrade_plan'
              >
                Upgrade
              </a>
            </div>
          </div>

          <div className='text-center px-4'>
            <img
              className='mw-100 mh-200px'
              alt='metronic'
              src={toAbsoluteUrl('/media/illustrations/sketchy-1/1.png')} />
          </div>
        </div>
      </div> */}

      <div className='tab-pane fade' id='kt_topbar_notifications_3' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {defaultLogs.map((log, index) => (
            <div key={`log${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center me-2'>
                <span className={clsx('w-70px badge', `badge-light-${log.state}`, 'me-4')}>
                  {log.code}
                </span>

                <a href='#' className='text-gray-800 text-hover-primary fw-bold'>
                  {log.message}
                </a>

                <span className='badge badge-light fs-8'>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
          </Link>
        </div>
      </div>
    </div>
  </div>
)}

export {HeaderNotificationsMenu}
