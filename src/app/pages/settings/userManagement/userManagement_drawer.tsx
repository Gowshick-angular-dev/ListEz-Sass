import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { AddUserSettings } from './addUser'
import { EditUser } from './EditUser'

type Props = {
    setUserList?: any
  }

const UserManagementDrawer: FC<Props> = (props) => {
    const {
        setUserList
      } = props
  
  return(
  <div>

    {/* Add Contact Drawer */}
    <div
        id='kt_usersettings'
        className='bg-opacity-0 m-0'
        data-kt-drawer='true'
        data-kt-drawer-name='usermanagement'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_addusersettings_toggle'
        data-kt-drawer-close='#kt_usersettings_close'
      >
        <AddUserSettings setUser={setUserList}/>
    </div>    

  </div>
  )
}


export {UserManagementDrawer}
// export default TaskDrawer