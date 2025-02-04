import {Suspense, useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth';
import IdleTimeOutHandler from './setTimeoutHandler'

const App = () => {
  const[isActive,setIsActive]=useState(true)
  const[isLogout,setLogout]=useState(false)
  
  const userData:any = localStorage.getItem('themeData')
  const djfghsfj = JSON.parse(userData);
  let timer2:any = localStorage.getItem('logoutIn') ? localStorage.getItem('logoutIn') : '1';
  
  useEffect(() => {    
    if(djfghsfj) {
      document.documentElement.style.setProperty('--terlogo-color', djfghsfj?.tertiary_color);
      document.documentElement.style.setProperty('--seclogo-color', djfghsfj?.secondary_color);
      document.documentElement.style.setProperty('--logo-color', djfghsfj?.primary_color);      
    }
  }, [djfghsfj]);
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>      
      <IdleTimeOutHandler 
      timer={timer2}
      onActive={()=>{setIsActive(true)}} 
      onIdle={()=>{setIsActive(false)}}
      onLogout={()=>{setLogout(true)}}
      />
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
