/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Offcanvas, Toast } from 'bootstrap';
import {useAuth} from '../../../../app/modules/auth'
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useLayout } from '../../../../_metronic/layout/core'
import { useIntl } from 'react-intl';
import Payment from './razorPay';
import StripePay from './stripePay';

type Props = {
    mod?: any
}

const SubscriptionsToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const [actionValue, setActionValue] = useState<any>('');

    const {
        mod
      } = props

  const {classes} = useLayout()
  let location = useLocation();
  
  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
              <>
                <div className='d-flex button_bar'>
                    {mod == "subscription" && <a className="me-4 btn btn-sm me-4" data-bs-toggle='modal' data-bs-target={'#subscription_form'}>{intl.formatMessage({id: 'add'})}+</a>}
                    {mod == "client" && <a className="me-4 btn btn-sm me-4" data-bs-toggle='modal' data-bs-target={'#customer_subscription_form'}>{intl.formatMessage({id: 'add'})}+</a>}                    
                </div>                
              </>
            
            {/* <Payment/> */}
        </div>
      </div>
    </div>
  )
}

export {SubscriptionsToolbar}