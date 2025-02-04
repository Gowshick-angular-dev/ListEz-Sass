/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'

import { useLocation } from 'react-router-dom'
import { KTSVG } from '../../../_metronic/helpers'
import { useLayout } from '../../../_metronic/layout/core'


type Props = {
    sortByOnChange?: any,
    layoutOnChange?: any
}

const ReportToolbar: FC<Props> = (props) => {

    const {
        sortByOnChange, layoutOnChange
      } = props

  const {classes} = useLayout()

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      {/* begin::Container */}
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        {/* <DefaultTitle /> */}
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
            <div className='d-flex button_bar'>
                <a className="me-4 btn btn-sm me-4" id='kt_usersettings_toggle'>Create Chart+</a>
            </div>
            <div className="d-flex">
                <a className="me-4 btn btn-sm me-4" id='kt_filter_toggle'>
                    <KTSVG path='/media/custom/header-icons/filter.svg' className='svg-icon-5 svg-icon-gray-500 me-1'/>
                </a>
            </div>
        </div>
      </div>
      {/* end::Container */}
    </div>
  )
}



export {ReportToolbar}