import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth';
import {LeadRequirForm} from '../pages/lead/leadRequirment';
import {App} from '../App'
import { AdminRoutes } from './AdminRoutes';

const {PUBLIC_URL} = process.env
const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  var access = currentUser?.designation;

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>          
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser ? (
            <>             
              <Route path='/*' element={<PrivateRoutes />} />
              {/* {access != 6 ?
              <Route index element={<Navigate to='/dashboard' />} /> : 
              <Route index element={<Navigate to='menu/contact/' />} />}       */}
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='admin/*' element={<AdminRoutes />} />
              <Route path='*' element={<Navigate to='/auth' />} />              
              <Route path='menu/lead/leadReq/*' element={<LeadRequirForm/>} />         
            </>
          )}          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
