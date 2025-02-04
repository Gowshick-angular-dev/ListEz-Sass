/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'
import { getRoleManagementList } from '../../../../app/pages/settings/userManagement/core/_requests'

export function AsideMenuMain() {
  
  const intl = useIntl();
  // var dataeee = localStorage.getItem('role');
  const {currentUser, logout} = useAuth();
  const [designation, setDesignation] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any>({})
  console.log("djfguyfuiwegrw", designation, permissions);
  

  var orgId = currentUser?.org_id;
  var access = currentUser?.designation;

  const DesignationList =  async () => {
    const DesignationResponse = await getRoleManagementList()
    setDesignation(DesignationResponse.output);
    sessionStorage.setItem('permissions', JSON.stringify(DesignationResponse.output?.find((item:any) => item.id == access)));
    setPermissions(DesignationResponse.output?.find((item:any) => item.id == access));
}

useEffect(() => {
  DesignationList();
}, []);
  
 
  return (
    <>{orgId == 1 ? <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/custom/menu-icons/dashboard.svg'
        title={intl.formatMessage({id: 'dashboard'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/admin-organization'
        icon='/media/custom/project.svg'
        title={intl.formatMessage({id: 'organization'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/AdminUsers'
        icon='/media/custom/buyer.svg'
        title={intl.formatMessage({id: 'users'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItemWithSub className="mb-2 pe-3" icon='/media/custom/menu-icons/transaction.svg' to='' title={intl.formatMessage({id: 'subscription'})} hasBullet={false}>
        <AsideMenuItem className="mb-0 fs-7" to='/subscriptions' icon='/media/custom/menu-icons/arrow123.svg' title={intl.formatMessage({id: 'plans'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7" to='/clientSubscription' icon='/media/custom/menu-icons/arrow123.svg' title={intl.formatMessage({id: 'subscriptions'})} hasBullet={false} />
      </AsideMenuItemWithSub>
      <AsideMenuItem
        to='/SupportTicket'
        icon='/media/custom/menu-icons/support.svg'
        title={intl.formatMessage({id: 'support_ticket'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItemWithSub className="mb-2 pe-3" icon='/media/custom/menu-icons/settings.svg' to='' title={intl.formatMessage({id: 'settings'})} hasBullet={false}>
        <AsideMenuItem className="mb-0 fs-7 text-nowrap" icon='/media/custom/menu-icons/arrow123.svg' to='/siteSettings' title={intl.formatMessage({id: 'site_settings'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7 text-nowrap" icon='/media/custom/menu-icons/arrow123.svg' to='/mailSetting' title={intl.formatMessage({id: 'email_settings'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7" icon='/media/custom/menu-icons/arrow123.svg' to='/paymentGatewaySetting' title={intl.formatMessage({id: 'payment'})} hasBullet={false} />
        {/* <AsideMenuItem className="mb-0 fs-7" icon='/media/custom/menu-icons/arrow123.svg' to='/localization' title={intl.formatMessage({id: 'localization'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7" icon='/media/custom/menu-icons/arrow123.svg' to='/translations' title={intl.formatMessage({id: 'language'})} hasBullet={false} /> */}
        <AsideMenuItem className="mb-0 fs-7" icon='/media/custom/menu-icons/arrow123.svg' to='/masters' title={intl.formatMessage({id: 'masters'})} hasBullet={false} />
        {/* <AsideMenuItem className="mb-0 fs-7" icon='/media/custom/menu-icons/arrow123.svg' to='/themeBuilder' title={intl.formatMessage({id: 'themes'})} hasBullet={false} /> */}
      </AsideMenuItemWithSub></> : 
      
      
      
    //users  
      <>
      {access != 6 &&
      <AsideMenuItem
        to='/dashboard'
        icon='/media/custom/menu-icons/dashboard.svg'
        title={intl.formatMessage({id: 'dashboard'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.contact == 1 &&
      <AsideMenuItem
        to='menu/contact/'
        icon='/media/custom/menu-icons/contact.svg'
        title={intl.formatMessage({id: 'contact'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.leads == 1 &&   
       <AsideMenuItem
        to='menu/lead/'
        icon='/media/custom/menu-icons/lead.svg'
        title={intl.formatMessage({id: 'lead'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.project == 1 &&
       <AsideMenuItemWithSub
        to=''
        icon='/media/custom/menu-icons/project.svg'
        title={intl.formatMessage({id: 'project'})}
        fontIcon='bi-app-indicator'
        hasBullet={false}
      >
        <AsideMenuItem className="mb-0 fs-7 text-nowrap" icon='/media/custom/menu-icons/arrow123.svg' to='menu/project/residential' title={intl.formatMessage({id: 'residential'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7 text-nowrap" icon='/media/custom/menu-icons/arrow123.svg' to='menu/project/commercial' title={intl.formatMessage({id: 'commercial'})} hasBullet={false} />
        <AsideMenuItem className="mb-0 fs-7 text-nowrap" icon='/media/custom/menu-icons/arrow123.svg' to='menu/project/plot' title={intl.formatMessage({id: 'plot'})} hasBullet={false} />
        </AsideMenuItemWithSub>}
      {permissions.transaction == 1 &&      
       <AsideMenuItem
        to='menu/transaction/'
        icon='/media/custom/menu-icons/transaction.svg'
        title={intl.formatMessage({id: 'transaction'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.task == 1 &&    
       <AsideMenuItem
        to='menu/task/'
        icon='/media/custom/menu-icons/task.svg'
        title={intl.formatMessage({id: 'task'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.finance == 1 &&
      <AsideMenuItem
        to='menu/finance/'
        icon='/media/custom/menu-icons/finance.svg'
        title={intl.formatMessage({id: 'finance'})}
        fontIcon='bi-app-indicator'
      />}
      {/* <AsideMenuItem
        to='menu/file/'
        icon='/media/custom/menu-icons/file.svg'
        title={intl.formatMessage({id: 'file'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='menu/message/'
        icon='/media/custom/menu-icons/message.svg'
        title={intl.formatMessage({id: 'message'})}
        fontIcon='bi-app-indicator'
      /> */}
      {permissions.report == 1 &&
      <AsideMenuItem
        to='menu/reports/'
        icon='/media/custom/menu-icons/report.svg'
        title={intl.formatMessage({id: 'report'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions?.console == 1 &&
      <AsideMenuItem
        to='menu/console/'
        icon='/media/custom/menu-icons/dashboard.svg'
        title={intl.formatMessage({id: 'console'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.support == 1 &&
      <AsideMenuItem
        to='menu/support/'
        icon='/media/custom/menu-icons/support.svg'
        title={intl.formatMessage({id: 'support'})}
        fontIcon='bi-app-indicator'
      />}
      {permissions.settings == 1 &&
        <AsideMenuItem
        to='menu/settings/'
        icon='/media/custom/menu-icons/settings.svg'
        title={intl.formatMessage({id: 'settings'})}
        fontIcon='bi-app-indicator'
      />}
      </>}
      {/* <AsideMenuItemWithSub
        to='/subscriptions'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub> */}
      


       {/* <AsideMenuItem
        to='/transactions'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.TRANSACTION'})}
        fontIcon='bi-app-indicator'
      />     
       <AsideMenuItem
        to='/finance'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.FIANCE'})}
        fontIcon='bi-app-indicator'
      />  
        <AsideMenuItem
        to='/communication'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.COMMUNICATION'})}
        fontIcon='bi-app-indicator'
      />  
       <AsideMenuItem
        to='/channel'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.CAHNNEL'})}
        fontIcon='bi-app-indicator'
      />
        <AsideMenuItem
        to='/support'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.SUPPORT'})}
        fontIcon='bi-app-indicator'
      />
       <AsideMenuItem
        to='/report'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.REPORT'})}
        fontIcon='bi-app-indicator'
      />       
        <AsideMenuItem
        to='/team'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.TEAM'})}
        fontIcon='bi-app-indicator'
      />  
      <AsideMenuItem
        to='/settings'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.SETTINGS'})}
        fontIcon='bi-app-indicator'
      />                                                   
      <AsideMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Layout Builder'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItem
        to='/apps/user-management/users'
        icon='/media/icons/duotune/general/gen051.svg'
        title='User management'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}
