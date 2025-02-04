/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Offcanvas, Toast } from 'bootstrap';
import {useAuth} from '../../../../app/modules/auth'
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useLayout } from '../../../../_metronic/layout/core'
import {useIntl} from 'react-intl'

type Props = {
  layoutOnChange?: any
}

const OrgToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();

    const {
      layoutOnChange
      } = props

  const {classes} = useLayout()
  let location = useLocation();

  useEffect(() => {
    
}, []);

  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >

        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
              <>
              <div className='d-flex button_bar'>
                <a className="me-4 btn btn-sm me-4" id='kt_admin_edit_toggle'>{intl.formatMessage({id: 'edit_admin'})}</a>
                <select className="form-control me-3 btn btn-sm text-center" name="views" id="views" onChange={(e) => layoutOnChange(e.target.value)}>
                    <option value="grid">{intl.formatMessage({id: 'grid_view'})}</option>
                    <option value="list">{intl.formatMessage({id: 'list_view'})}</option>
                </select>
                <a className="me-4 btn btn-sm me-4" id='kt_organization_add_toggle'>{intl.formatMessage({id: 'add'})}+</a>
              </div>
              </>
        </div>
      </div>
    </div>
  )
}

export {OrgToolbar}