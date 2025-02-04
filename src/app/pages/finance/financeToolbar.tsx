import clsx from 'clsx'
import React, {FC} from 'react'
import { useLocation } from 'react-router-dom'
import { useLayout } from '../../../_metronic/layout/core'
import {useAuth} from '../../../app/modules/auth';
import { useIntl } from 'react-intl';

type props = {
  tabDetails?:any
  }

const FinanceToolbar: FC<props> = (props) => {
  const intl = useIntl();
  const{tabDetails} = props

  const {classes} = useLayout()
  const {currentUser, logout} = useAuth();
  let location = useLocation();

  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div id='kt_toolbar_container' className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')} >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
          {isMenu &&
            <div className='d-flex button_bar'>
              {tabDetails == 'expenses' &&
              <a className="me-4 btn btn-sm me-4" id='kt_expense_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'feeConfirmation' &&
              <a className="me-4 btn btn-sm me-4" id='kt_feeconfirmation_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'proformaInvoice' &&
              <a className="me-4 btn btn-sm me-4" id='kt_proformaInvoice_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'invoice' &&
              <a className="me-4 btn btn-sm me-4" id='kt_Invoice_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'collection' &&
              <a className="me-4 btn btn-sm me-4" id='kt_Collections_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'incentive' &&
              <a className="me-4 btn btn-sm me-4" id='kt_Incentives_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
              {tabDetails == 'cashback' &&
              <a className="me-4 btn btn-sm me-4" id='kt_cashback_form_toggle'>{intl.formatMessage({id: 'add'})}+</a>}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export {FinanceToolbar}