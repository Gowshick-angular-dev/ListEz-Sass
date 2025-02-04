import React, {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'
import { getOrganozationCompany } from '../../../../app/pages/settings/organization/core/_requests'
import { useAuth } from '../../../../app/modules/auth'
import { getBusinessSettings } from '../../../../app/pages/settings/siteSettings/core/_requests'

const AsideDefault: FC = () => {
  const {config, classes} = useLayout();
  const {aside} = config;
  const [businessSettings, setBusinessSettings] = useState<any>({});
  const [orgResponse, setOrgResponse] = useState<any>({});
  const {currentUser, logout} = useAuth();

    const roleId = currentUser?.id;
    const orgId = currentUser?.org_id;
    const role = currentUser?.designation;

    const getBusinessSetting = async () => {
      const response = await getBusinessSettings();
      setBusinessSettings(response.output)
      document.title = response.output.site_title;
      const link:any = document.querySelector('link[rel="shortcut icon"]');
      link.href = process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_favicon/"+response.output?.site_favicon;
  }

  const organization = async () => {
    const response = await getOrganozationCompany(orgId);
    setOrgResponse(response.output);
  }

  useEffect(() => {
    if(orgId == 1) {
      getBusinessSetting();
    } else {
      organization();
    }
  }, [currentUser]);

  return (
    <div
      id='kt_aside'
      className={clsx('aside', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
    >
      <button id='logo_reload' className='d-none' onClick={() => {
        if(role == 1) {
          getBusinessSetting();
        } else {
          organization();
        }
        }}>reload</button>
      <div className='aside-logo flex-column-auto px-3' id='kt_aside_logo'>
        {aside.theme === 'dark' && (<>
        {orgId == 1 ?
          <Link to='/dashboard'>  
          <div className='d-flex align-items-center justify-content-center mx-auto'>         
            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/logos/dark-01.svg') }} src={process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_logo/"+businessSettings?.site_logo} className="logo" alt='' />
          </div>
          </Link> : 
          <Link to='/dashboard'>
            <div className='d-flex align-items-center justify-content-center mx-auto'>           
              <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/logos/dark-01.svg') }} src={process.env.REACT_APP_API_BASE_URL+"uploads/organization/logo/"+orgId+'/'+orgResponse?.logo} className="logo" alt='' />
            </div>
          </Link>
        }</>)}
        {aside.theme === 'light' && (<>
          {orgId == 1 ?
          <Link to='/dashboard'>
            <div className='d-flex align-items-center justify-content-center mx-auto'>
              <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/logos/light-01.svg') }} src={process.env.REACT_APP_API_BASE_URL+"uploads/business_settings/option_value/site_logo/"+businessSettings?.site_logo} className="logo" alt='' />
            </div>
          </Link> :
          <Link to='/dashboard'>
            <div className='d-flex align-items-center justify-content-center mx-auto'>
              <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/logos/light-01.svg') }} src={process.env.REACT_APP_API_BASE_URL+"uploads/organization/logo/"+orgId+'/'+orgResponse?.logo} className="logo" alt='' />
            </div>
          </Link>}
        </>)}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
          >
            <KTSVG
              path={'/media/custom/menu-icons/arrow.svg'}
              className={'svg-icon-1 rotate-180'}
            />
          </div>
        )}
      </div>
      <div className='aside-menu flex-column-fluid w-100'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
    </div>
  )
}

export {AsideDefault}
