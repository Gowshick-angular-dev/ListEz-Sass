import {useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {RightToolbar} from '../partials/layout/RightToolbar'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider} from './core'
import {useLocation} from 'react-router-dom'
import {DrawerMessenger, ActivityDrawer, Main, InviteUsers, UpgradePlan} from '../partials'
import { AddContact } from '../partials/layout/drawers/addDrawer'
import { FilterDrawer } from '../partials/layout/drawers/filterDrawer'

import {MenuComponent} from '../assets/ts/components'
import { ExpandDrawer } from '../partials/layout/drawers/expandDrawer'

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  return (
    <PageDataProvider>
      <div className='page d-flex flex-row flex-column-fluid'>
        <AsideDefault />
        <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
          <HeaderWrapper />

          <div id='kt_content' className='content d-flex flex-column flex-column-fluid pb-2'>
            {/* <Toolbar /> */}
            <div className='post d-flex flex-column-fluid' id='kt_post'>
              <Content>
                <Outlet />
              </Content>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />
      <FilterDrawer/>
      <ExpandDrawer/>
      <RightToolbar />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <Main />
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
