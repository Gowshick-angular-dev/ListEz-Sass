import clsx from 'clsx'
import React, {FC, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import { useLayout } from '../../../_metronic/layout/core'
import {useAuth} from '../../../app/modules/auth';
import { saveAttendanceCheckin } from './core/requests';
import { Toast } from 'bootstrap';
import { useIntl } from 'react-intl'
import { DefaultTitle } from '../../../_metronic/layout/components/header/page-title/DefaultTitle';

type Props = {
  name?: any,
}

const DashboardToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {name} = props

  const {classes} = useLayout()
  const {currentUser, logout} = useAuth();
  const roleId = currentUser?.designation;
  const orgId = currentUser?.org_id;

  const rangeSelect = async (val:any) => {
    if(val == 1) {document.getElementById('overAllCustomDateOverviewToday')?.click();} 
    if(val == 2) {document.getElementById('overAllCustomDateOverviewYesterDay')?.click();} 
    if(val == 3) {document.getElementById('overAllCustomDateOverviewLastWeek')?.click();} 
    if(val == 4) {document.getElementById('overAllCustomDateOverviewLastMonth')?.click();} 
    if(val == 5) {document.getElementById('overAllCustomDateOverviewThisMonth')?.click();} 
    if(val == 6) {document.getElementById('overAllCustomDateOverviewThisYear')?.click();} 
    if(val == 7) {document.getElementById('overAllCustomDateOverview')?.click();} 
  }

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      
      {/* begin::Container */}
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
         {orgId != 1 &&
        <div className="menu_bar d-flex align-items-center justify-content-end w-100">
          { roleId != 4 &&
          <input className="form-select dash_btn m-2 fs-9" type="button" value={name} data-bs-toggle='modal' data-bs-target='#brgfuegviuengweriggivehniuggebuhb' id='jmgeigvbertbgcjnrlgjrtbgoehtbgurgtb'/>}
          <select className="form-select dash_btn m-2 fs-9" onChange={(e) => rangeSelect(e.target.value)}>
              <option selected value="1">{intl.formatMessage({id: 'today'})}</option>
              <option value="2">{intl.formatMessage({id: 'yesterday'})}</option>
              <option value="3">{intl.formatMessage({id: 'last_week'})}</option>
              <option value="4">{intl.formatMessage({id: 'last_month'})}</option>
              <option value="5">{intl.formatMessage({id: 'this_month'})}</option>
              <option value="6">{intl.formatMessage({id: 'this_year'})}</option>
              <option value="7">{intl.formatMessage({id: 'custom_date'})}</option>
          </select>
        </div>}
      </div>
    </div>
  )
}
export {DashboardToolbar}