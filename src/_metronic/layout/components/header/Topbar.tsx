import { Toast } from 'bootstrap';
import clsx from 'clsx';
import React, {FC, useEffect, useState} from 'react';
import { useAuth } from '../../../../app/modules/auth';
import { getUserIP, saveAttendanceCheckin } from '../../../../app/pages/dashboard/core/requests';
import { getUser } from '../../../../app/pages/settings/userManagement/core/_requests';
import {KTSVG, toAbsoluteUrl} from '../../../helpers';
import {HeaderNotificationsMenu, HeaderUserMenu} from '../../../partials';
import { attendanceCheckin, getNotifications } from '../../../partials/layout/header-menus/core/_request';
import {useLayout} from '../../core';
import {useIntl} from 'react-intl';
import { Link } from 'react-router-dom';
import moment from "moment";

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC = () => {
  const intl = useIntl();
  const {config} = useLayout()

  const {currentUser, setCurrentUser, logout} = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [checkinButton, setCheckinButton] = useState<any>('');
  const [search, setSearch] = useState<any>('');
  const [userInfo, setUserInfo] = useState<{[key: string]: any}>({});
  const [location, setLocation] = useState<{[key: string]: any}>({});
  
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const attSts = currentUser?.att_status;

  console.log("ejweiurgoweui", location);
  
  
  const notificationList =  async () => {   
    const contactStatusResponse = await getNotifications(userId)
    setNotifications(contactStatusResponse);
}

const getAttendanceCheckin = async () => {
  const response = await attendanceCheckin(userId, roleId)
  setCheckinButton(response)
}

const handleClick = () => {
  notificationList();
}

const FetchContactDetails =  async () => {    
  const fetchDetails = await getUser(userId)
  setUserInfo(fetchDetails.output[0]);
}

const onSearch = () => {
  <Link
      to={'menu/'+search+'/*'}
    />
}

const handleCheckin = async () => {
  const ipAddress = await getUserIP();
  const body = {
    "start" : moment().format('YYYY-MM-DD HH:mm:ss'),
    "user_ip": ipAddress,
    "user_latitude": location.latitude,
    "user_longitude": location.longitude,
    "user_address": location.address                            
}

const attendanceData = await saveAttendanceCheckin(body);

if(attendanceData.status == 200){
  let jhf:any = {...currentUser, att_status: '1'}
  sessionStorage.setItem('usersData', JSON.stringify(jhf));
  setCurrentUser(jhf);
  var toastEl = document.getElementById('myToastAttendance');
  const bsToast = new Toast(toastEl!);
  bsToast.show();                        
}
}

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

useEffect(() => {
  // getAttendanceCheckin();
  // notificationList();
  FetchContactDetails();  
},[]);

  return (
    <div className='d-flex align-items-center flex-shrink-0'>
      <button type='button' className='d-none' onClick={() => FetchContactDetails()} id='jrht7tryiubou6fgdfbsdfuegwheoweug' />
      {roleId != 1 && attSts != '1' &&
        <button className="btn btn-sm btn_primary me-4 checkin_btn" onClick={handleCheckin}>Check-in</button>}

      {/* Search */}
      {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <Search />
      </div> */}

      {/* Search */}
      <form className={clsx('d-flex align-items-stretch d-none', toolbarButtonMarginClass)}>
          <div className="input-group search_btn">
            {/* <input type="text" id="search_val" className="form-control d-none d-sm-block" placeholder="Search..."/> */}
            <input type="text" id="search_val" className="form-control w-100px w-sm-auto" onChange={(e) => {
              let dnfkugeiur = e.target.value?.toLowerCase();
              if(dnfkugeiur == 'user' || dnfkugeiur == 'users' || dnfkugeiur == 'user management' || dnfkugeiur == 'user settings') {
                setSearch('menu/settings/user-settings?1')
              } else if(dnfkugeiur == 'attendance' || dnfkugeiur == 'check in') {
                setSearch('menu/settings/user-settings?3')
              } else if(dnfkugeiur == 'teams' || dnfkugeiur == 'team') {
                setSearch('menu/settings/user-settings?2')
              } else if(dnfkugeiur == 'performance' || dnfkugeiur == 'user performance' || dnfkugeiur == 'team performance' || dnfkugeiur == 'work done') {
                setSearch('menu/settings/user-settings?4')
              } else if(dnfkugeiur == 'time sheet' || dnfkugeiur == 'attendance sheet' || dnfkugeiur == 'checkin sheet' || dnfkugeiur == 'chickin list' || dnfkugeiur == 'checkins') {
                setSearch('menu/settings/user-settings?5')
              } else if(dnfkugeiur == 'log' || dnfkugeiur == 'log sheet' || dnfkugeiur == 'logins' || dnfkugeiur == 'login list' || dnfkugeiur == 'login details' || dnfkugeiur == 'loged in members') {
                setSearch('menu/settings/user-settings?6')
              } else if(dnfkugeiur == 'role' || dnfkugeiur == 'role setting' || dnfkugeiur == 'role profile' || dnfkugeiur == 'role access' || dnfkugeiur == 'permissions' || dnfkugeiur == 'permissions' || dnfkugeiur == 'permission details') {
                setSearch('menu/settings/user-settings?7')
              } else if(dnfkugeiur == 'organization' || dnfkugeiur == 'organization details' || dnfkugeiur == 'organization profile' || dnfkugeiur == 'company' || dnfkugeiur == 'company profile' || dnfkugeiur == 'company settings' || dnfkugeiur == 'organization settings' || dnfkugeiur == 'logo' || dnfkugeiur == 'change logo' || dnfkugeiur == 'watermark' || dnfkugeiur == 'edit company details') {
                setSearch('menu/settings/organization-settings')
              } else if(dnfkugeiur == 'subscriptions' || dnfkugeiur == 'subscription' || dnfkugeiur == 'subscription plans' || dnfkugeiur == 'plans' || dnfkugeiur == 'plan' || dnfkugeiur == 'recharge' || dnfkugeiur == 'suscribe' || dnfkugeiur == 'current plan' || dnfkugeiur == 'plan details' || dnfkugeiur == 'plan page') {
              setSearch('menu/settings/organization-settings?2')
              } else if(dnfkugeiur == 'master' || dnfkugeiur == 'masters' || dnfkugeiur == 'master List') {
                setSearch('menu/settings/org_masters')
              } else if(dnfkugeiur == 'integrations' || dnfkugeiur == 'integration' || dnfkugeiur == 'mail settings' || dnfkugeiur == 'mail setting' || dnfkugeiur == 'mail configurations' || dnfkugeiur == 'email configuration' || dnfkugeiur == 'email configurations' || dnfkugeiur == 'email integration' || dnfkugeiur == 'email integrations') {
                setSearch('menu/settings/integrations')
              } else if(dnfkugeiur == 'alerts and notification settings' || dnfkugeiur == 'alerts' || dnfkugeiur == 'alerts and notification settings' || dnfkugeiur == 'notification settings' || dnfkugeiur == 'alerts and notifications' || dnfkugeiur == 'notifications' || dnfkugeiur == 'alert and notifications' || dnfkugeiur == 'alerts and notification' || dnfkugeiur == 'alert and notification' || dnfkugeiur == 'alert notification' ) {
                setSearch('menu/settings/alertsAndNotificationSettings')
              } else if(dnfkugeiur == 'email templates' || dnfkugeiur == 'mail templates' || dnfkugeiur == 'templates' || dnfkugeiur == 'template') {
                setSearch('menu/settings/Templates') 
              } else if(dnfkugeiur == 'whatsapp templates' || dnfkugeiur == 'whatsapp template') {
                setSearch('menu/settings/Templates?2')
              } else if(dnfkugeiur == 'themes' || dnfkugeiur == 'theme' || dnfkugeiur == 'font change' || dnfkugeiur == 'font' || dnfkugeiur == 'theme builder' || dnfkugeiur == 'theme setup' || dnfkugeiur == 'theme settings' || dnfkugeiur == 'theme setting' || dnfkugeiur == 'colours' || dnfkugeiur == 'colour settings' || dnfkugeiur == 'primary colour' || dnfkugeiur == 'secondary colour' || dnfkugeiur == 'teritiary colour' || dnfkugeiur == 'primary color' || dnfkugeiur == 'secondary color' || dnfkugeiur == 'teritiary color' || dnfkugeiur == 'font family' || dnfkugeiur == 'font style' || dnfkugeiur == 'reset theme' || dnfkugeiur == 'reset' || dnfkugeiur == 'reset style') {
                setSearch('menu/settings/themeBuilder')
              } else if(dnfkugeiur == 'contact setting' || dnfkugeiur == 'contact settings' || dnfkugeiur == 'contact assign setting' || dnfkugeiur == 'assign to' || dnfkugeiur == 'assign to settings' || dnfkugeiur == 'assign settings' || dnfkugeiur == 'rotational assign') {
                setSearch('menu/settings/contactSettings')
              } else if(dnfkugeiur == 'setting' || dnfkugeiur == 'settings') {
                setSearch('menu/settings/')
              } else {
                setSearch('menu/'+dnfkugeiur+'/')
              }
              }} placeholder={intl.formatMessage({id: 'search'})}/>
            <div className="input-group-append">
            <Link to={search ? search : window.location}>
              <button className="btn btn-secondary" type="submit" onClick={() => (document.getElementById('search_val') as HTMLInputElement).value = ''}>                
                <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
              </button>
            </Link>
            </div>
          </div>
      </form>
      {/* <a className="text-dark" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
          <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
      </a>
      <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
          <li>w</li>
          <li>e</li>
          <li>r</li>
          <li>r</li>
          <li>t</li>
          <li>yh</li>
          <li>4r</li>
          <li>g</li>
          <li>b</li>
          <li>h</li>
      </ul> */}
     
      {/* Activities */}
        {/* begin::Drawer toggle */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary btn-custom',
            toolbarButtonHeightClass
          )}
          id='kt_activities_toggle'
        >
          <KTSVG
            path='/media/icons/duotune/general/gen032.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div>
      </div> */}
        {/* end::Drawer toggle */}


      {/* NOTIFICATIONS */}
        {/* begin::Menu- wrapper */}
      <div className={clsx('d-flex align-items-center position-relative d-none', toolbarButtonMarginClass)}>
        <div onClick={handleClick}
          className={clsx(
            'btn btn-icon btn-custom',
            toolbarButtonHeightClass
          )}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <KTSVG
            path='/media/custom/header-icons/notification.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div>
        {notifications.length > 0 &&
        <span className='bullet bullet-dot notification_indicator h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>}
        <HeaderNotificationsMenu />
        
      </div>
        {/* end::Menu wrapper */}


      {/* CHAT */}
      <div className={clsx('d-flex align-items-center position-relative d-none', toolbarButtonMarginClass)}>
        {/* begin::Menu wrapper */}
        <div
          className={clsx(
            'btn btn-icon btn-custom',
            toolbarButtonHeightClass
          )}
          // id='kt_drawer_chat_toggle'
        >
          <KTSVG
            path='/media/custom/menu-icons/message.svg'
            className={toolbarButtonIconSizeClass}
          />

          <span className='bullet bullet-dot notification_indicator h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>
        </div>
        {/* end::Menu wrapper */}
      </div>

      {/* Quick links */}
        {/* begin::Menu wrapper */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary btn-custom',
            toolbarButtonHeightClass
          )}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <KTSVG
            path='/media/icons/duotune/general/gen025.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div>
        <QuickLinks />
      </div> */}
        {/* end::Menu wrapper */}
      {/* begin::User */}
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          
           {/* <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userInfo.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+ userInfo.id +'/'+ userInfo.profile_image : ''} className="user_img" alt='' /> */}
           <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userInfo.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+userInfo.id+'/'+userInfo.profile_image : ''} className="user_img" alt='' />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
          </div>
        </div>
      )}
    </div>
  )
}

export {Topbar}
