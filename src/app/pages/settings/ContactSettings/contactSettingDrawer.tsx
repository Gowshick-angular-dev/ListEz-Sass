import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { ContactSettingSave } from './contactSettingsSave'

type Props = {
  setContactSettingList?: any,
}
const ContactSettingsDrawer: FC<Props> = (props) => {
  const {
    setContactSettingList
  } = props

  console.log('setContactSettingList')
  console.log(setContactSettingList)
  return(
  <div>
    {/* Add Contact Drawer */}
    <div
        id='kt_addcontactsettings'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='contact_setting'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_contact_setting_form_toggle'
        data-kt-drawer-close='#kt_contact_setting_form_close'
      >
        <ContactSettingSave />
    </div>   

  </div>
  )
}

export {ContactSettingsDrawer}
// export default TaskDrawer