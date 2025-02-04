import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { OrganizationForm } from './addOrganization'
import { OrganizationEdit } from './editOrganization'
import {useIntl} from 'react-intl'
import { getOrganozationAdmin } from './core/_requests'

type Props = {
  setList?: any,
}

const OrganizationDrawer: FC<Props> = (props) => {
  const intl = useIntl();
  const [data, setData] = useState({});
  const [adminData, setAdminData] = useState({});
  const {
    setList
  } = props

  const superadmin = async () => {
    const response = await getOrganozationAdmin(1);
    setAdminData(response.output);
  }

  useEffect(() => {
    superadmin();
  }, [])

  return(
  <div>

    <div
        id='kt_organization'
        className='bg-opacity-0'
        data-kt-drawer='true'
        data-kt-drawer-name='organization'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_organization_add_toggle'
        data-kt-drawer-close='#kt_organization_add_close'
      >
        <OrganizationForm setOrgsList={setList}/>
    </div>
    <div
        id='kt_organization_admin'
        className='bg-opacity-0'
        data-kt-drawer='true'
        data-kt-drawer-name='organization_admin'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true' 
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_admin_edit_toggle'
        data-kt-drawer-close='#kt_organization_edit_close'
      >
        <OrganizationEdit orgId={adminData} setList={setList} />
    </div>
  </div>
  )
}

export {OrganizationDrawer}