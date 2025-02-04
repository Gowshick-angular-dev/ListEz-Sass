/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'

import { useLocation } from 'react-router-dom'
import { KTSVG } from '../../../../_metronic/helpers'
import { useLayout } from '../../../../_metronic/layout/core'
import { useIntl } from 'react-intl'


type Props = {
    sortByOnChange?: any,
    layoutOnChange?: any,
    tab?: any,
    layoutOnChangeAttendance?: any
}

const UserToolbar: FC<Props> = (props) => {

    const {
        sortByOnChange, layoutOnChange, tab, layoutOnChangeAttendance
      } = props
  const intl = useIntl();
  const {classes} = useLayout()

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">                     
            {tab == 'manage_users' && <> 
            <div className='d-flex button_bar'>
              <select className="me-4 btn_secondary btn btn-sm" name="views" id="views" onChange={(e) => layoutOnChange(e.target.value)}>
                  <option value="grid">{intl.formatMessage({id: 'grid'})}</option>
                  <option value="list">{intl.formatMessage({id: 'list'})}</option>
              </select> 
            </div>
            <div className='d-flex button_bar'>
                <a className="me-4 btn btn_secondary btn-sm" id='kt_addusersettings_toggle'>{intl.formatMessage({id: 'add_user'})}+</a>
            </div></>}
            {tab == 'manage_teams' &&
            <div className='d-flex button_bar'>
                {/* <a className="me-4 btn btn_secondary btn-sm" onClick={() => document.getElementById("teamd_add_popup0071234")?.click()}>{intl.formatMessage({id: 'add_team'})}+</a> */}
            </div>} 
            {tab == 'attendance' &&
            <div className='d-flex button_bar'>
            <select className="me-4 btn_secondary btn btn-sm p-3" name="views" id="views" onChange={(e) => layoutOnChangeAttendance(e.target.value)}>
                <option value="1">{intl.formatMessage({id: 'calender'})}</option>
                <option value="2">{intl.formatMessage({id: 'list'})}</option>
            </select> 
          </div>} 
        </div>
      </div>
    </div>
  )
}

export {UserToolbar}