import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {useAuth} from '../../app/modules/auth'
import { TaskPage } from '../pages/task/task'
import { PropertyList } from '../pages/property/property'
import {LeadPage} from '../pages/lead/lead'
import { Settings } from '../pages/settings/settings'
import { TransactionList } from '../pages/transaction/transactionList'
import { File } from '../pages/file/file'
import { Finance } from '../pages/finance/finance'
import { Support } from '../pages/support/support'
import { Reports } from '../pages/reports/reports'
import { Console } from '../pages/console/console'
import { MessagePage } from '../pages/message/message'
import { OrgSettings } from '../pages/settings/organization/orgSettings'
import { UserManagement } from '../pages/settings/userManagement/userManagement'
import { Masters } from '../pages/settings/masters/masters'
import { AlertsAndNotificationSettings } from '../pages/settings/alertsAndNotificationSettings/alertsAndNotificationSettings'
import { Integrations } from '../pages/settings/Integrations/integrations'
import { ThemeBuilder } from '../pages/settings/ThemeBuilder/themeBuilder'
import { Templates } from '../pages/settings/templates/Templates'
import { ContactSettings } from '../pages/settings/ContactSettings/contactSettings'
import { ContactPageClone } from '../pages/contact/contact'
import { OrganizationList } from '../pages/settings/organization/organizations'
import { Localization } from '../pages/settings/Localization/localization'
import { LocalizationORG } from '../pages/settings/Localization/orgLocalization'
import { Translation } from '../pages/settings/Translations/translations'
import { Subscriptions } from '../pages/settings/subscription/subscriptions'
import { SupportTickets } from '../pages/supportTicket/support_ticket'
import { ClientSubscriptions } from '../pages/settings/subscription/clientSubscriptions'
import { AdminUsers } from '../pages/adminUsers/adminUsers'
import { SiteSetting } from '../pages/settings/siteSettings/siteSetting'
import { MailSetting } from '../pages/settings/siteSettings/emailSettings'
import { PaymentGatewaySetting } from '../pages/settings/siteSettings/paymentGatewaySetting'
import { UserSubscriptionPage } from '../pages/settings/organization/clientSubscriptionPage'
import { OrgMasters } from '../pages/settings/orgMasters/org_masters'
import { Overview } from '../modules/accounts/components/Overview'
import { Settingswfheiuh } from '../modules/accounts/components/settings/Settings'
import AccountPage from '../modules/accounts/AccountPage'
import { CommercialList } from '../pages/commercial/commercial'
import { PlotList } from '../pages/plot/plot'
import { IntegrationsPage } from '../pages/settings/Integrations/integrationsPage'
import { EmailSettingsPage } from '../pages/settings/emailSettings/emailSettingsTrigger'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  
  const {currentUser, logout} = useAuth();
  var access = currentUser?.designation;
  
  return (<>
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        <Route path='admin/*' element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardWrapper />} />

        {/* {access != 6 ? <>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        <Route path='admin/*' element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardWrapper />} />
        </> : <>
        <Route path='auth/*' element={<Navigate to='/menu/contact/' />} />
        <Route path='admin/*' element={<Navigate to='/menu/contact/' />} />
        <Route path='contact/' element={<ContactPageClone />} />
        </>} */}
        
        <Route path='menu-test' element={<MenuTestPage />} />
        <Route
          path='crafted/pages/profile/'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='menu/lead/'
          element={
            <SuspensedView>
              <LeadPage/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/contact/'
          element={
            <SuspensedView>
              <ContactPageClone/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/task/'
          element={
            <SuspensedView>
              <TaskPage/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/project/residential'
          element={
            <SuspensedView>
              <PropertyList/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/project/commercial'
          element={
            <SuspensedView>
              <CommercialList/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/project/plot'
          element={
            <SuspensedView>
              <PlotList/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/settings/'
          element={
            <SuspensedView>
              <Settings/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/transaction/'
          element={
            <SuspensedView>
              <TransactionList/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/file/'
          element={
            <SuspensedView>
              <File/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/finance/'
          element={
            <SuspensedView>
              <Finance/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/support/'
          element={
            <SuspensedView>
              <Support/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/reports/'
          element={
            <SuspensedView>
              <Reports/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/console/'
          element={
            <SuspensedView>
              <Console/>
            </SuspensedView>
          }
        />                            
        <Route
          path='menu/message/'
          element={
            <SuspensedView>
              <MessagePage/>
            </SuspensedView>
          }
        />                            
        <Route
          path='crafted/widgets/'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/organization-settings'
          element={
            <SuspensedView> 
              <OrgSettings/>              
            </SuspensedView>
          }
        />
        <Route
          path='/admin-organization'
          element={
            <SuspensedView> 
              <OrganizationList/>             
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/user-settings'
          element={
            <SuspensedView>
              <UserManagement/>
            </SuspensedView>
          }
        />
        <Route
          path='/masters'
          element={
            <SuspensedView>
              <Masters/>
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/localization'
          element={
            <SuspensedView>
              <Localization/>
            </SuspensedView>
          }
        />
        <Route
          path='/localizationorg'
          element={
            <SuspensedView>
              <LocalizationORG/>
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/translations'
          element={
            <SuspensedView>
              <Translation/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/alertsAndNotificationSettings'
          element={
            <SuspensedView>
              <AlertsAndNotificationSettings/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/integrations'
          element={
            <SuspensedView>
              <IntegrationsPage/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/emailSettingsTrigger'
          element={
            <SuspensedView>
              <EmailSettingsPage/>
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/themeBuilder'
          element={
            <SuspensedView>
              <ThemeBuilder/>
            </SuspensedView>
          }
        />
        <Route
          path='/subscriptions'
          element={
            <SuspensedView>
              <Subscriptions/>
            </SuspensedView>
          }
        />
        <Route
          path='/clientSubscription'
          element={
            <SuspensedView>
              <ClientSubscriptions/>
            </SuspensedView>
          }
        />
        <Route
          path='/SupportTicket'
          element={
            <SuspensedView>
              <SupportTickets/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/Templates'
          element={
            <SuspensedView>
              <Templates/>
            </SuspensedView>
          }
        />
        <Route
          path='/AdminUsers'
          element={
            <SuspensedView>
              <AdminUsers/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/contactSettings'
          element={
            <SuspensedView>
              <ContactSettings/>
            </SuspensedView>
          }
        />
        <Route
          path='/siteSettings'
          element={
            <SuspensedView>
              <SiteSetting/>
            </SuspensedView>
          }
        />
        <Route
          path='/mailSetting'
          element={
            <SuspensedView>
              <MailSetting/>
            </SuspensedView>
          }
        />
        <Route
          path='/paymentGatewaySetting'
          element={
            <SuspensedView>
              <PaymentGatewaySetting/>
            </SuspensedView>
          }
        />
        <Route
          path='menu/settings/userSubscriptionPage'
          element={
            <SuspensedView>
              <UserSubscriptionPage/>
            </SuspensedView>
          }
        />
        <Route
          path='/userSubscriptionPage'
          element={
            <SuspensedView>
              <UserSubscriptionPage/>
            </SuspensedView>
          }
        />
        <Route
          path='/crafted/account/overview'
          element={
            <SuspensedView>
              <Overview/>
            </SuspensedView>
          }
        />
        <Route
          path='/crafted/account/settings'
          element={
            <SuspensedView>
              <Settingswfheiuh/>
            </SuspensedView>
          }
        />
        <Route
          path='/menu/settings/org_masters'
          element={
            <SuspensedView>
              <OrgMasters/>
            </SuspensedView>
          }
        />
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  </>)
}

const SuspensedView: FC = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}