/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import { useLayout } from '../../../_metronic/layout/core'
import {useAuth} from '../../../app/modules/auth';
import { useIntl } from 'react-intl';
import { deleteTrnsaction } from './core/_requests';
import { Toast } from 'bootstrap';

type Props = {
  sortByOnChange?: any,
  body?: any,
  transactionCheckList?: any,
  layoutOnChange?: any,
  transactionsCount?: any,
}

const TransactionToolbar: FC<Props> = (props) => {
  const {
    sortByOnChange, body, transactionCheckList, layoutOnChange, transactionsCount
    } = props

  const intl = useIntl();
  const {classes} = useLayout()
  const {currentUser, logout} = useAuth();
  const [layout, setLayout] = useState(true);
  let location = useLocation();
  var roleId = currentUser?.designation;

  const actionChange = async (e:any) => {
    if(e == 'delete' && transactionCheckList != null) {
      const response = await deleteTrnsaction(transactionCheckList.join(',')?.toString())
      if(response.status == 200) {
        document.getElementById('transactionReload')?.click();
        (document.getElementById('action') as HTMLInputElement).value = "default";
        var toastEl = document.getElementById('deleteTransaction');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
    } else {
      (document.getElementById('action') as HTMLInputElement).value = "default";
    }
  }
  
  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex justify-content-end w-100 overflow-auto p-0 px-md-5')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
          {isMenu &&
              <>
              <div className='d-flex button_bar'>
              {/* <input disabled value={`${intl.formatMessage({id: 'total'})}`+' '+'='+' '+transactionsCount} className="me-3 btn btn-sm"/> */}
              <span className="me-3 btn btn-sm text-center text-nowrap d-none d-md-block fs-8 disabled" >{intl.formatMessage({id: 'total'})+' '+'='+' '+transactionsCount}</span>
              <span className="mx-3 btn btn-sm text-center text-nowrap d-md-none fs-8 pt-3 px-2 disabled">{intl.formatMessage({id: 'total'})+' '+'='+' '+transactionsCount}</span>
                <a className="btn btn-sm me-3 d-none d-md-block" id='kt_transaction_add_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <select className="form-control me-3 btn btn-sm text-center" name="sort" id="sort" onChange={(e) => {sortByOnChange(e.target.value)}}>
                  <option value="">{intl.formatMessage({id: 'sort_by'})}</option>
                  <option value="created_at|asc">{intl.formatMessage({id: 'created_ascending'})}</option>
                  <option value="created_at|desc">{intl.formatMessage({id: 'created_descending'})}</option>
                  <option value="updated_at|asc">{intl.formatMessage({id: 'updated_ascending'})}</option>
                  <option value="updated_at|desc">{intl.formatMessage({id: 'updated_descending'})}</option>
                  <option value="c.first_name|asc">{intl.formatMessage({id: 'first_name'})} A - Z</option>
                  <option value="c.first_name|desc">{intl.formatMessage({id: 'first_name'})} Z - A</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none d-md-block" name="views" id="views" onChange={(e) => layoutOnChange(e.target.value)}>
                    <option value="grid">{intl.formatMessage({id: 'grid'})}</option>
                    <option value="list">{intl.formatMessage({id: 'list'})}</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center" name="action" id="action" onChange={(e) => actionChange(e.target.value)} >
                  <option value="default">{intl.formatMessage({id: 'action'})}</option>
                  {roleId == 1 && <option value="delete">{intl.formatMessage({id: 'delete'})}</option>}
                  {/* <option value="archive">Archive</option>
                  <option value="export">Export</option> */}
                </select>
                {/* <a href={toAbsoluteUrl('/sheets/contacts.xlsx')} title='Download sample file for import' className="me-4 btn btn-sm me-4 d-block" download="contacts_sheet.xlsx">
                  <KTSVG path='/media/icons/duotune/files/fil021.svg' className='svg-icon-4 svg-icon-dark me-1'/>
                  Sample File
                </a> */}
              </div>
              <button className="me-3 btn btn-sm d-md-none px-3" id='kt_transaction_add_toggle'>
                <span className="svg-icon svg-icon-3 m-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="currentColor"/>
                <path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="currentColor"/>
                </svg>
                </span>
              </button>
              <a className="me-3 btn btn-sm px-3 d-md-none">
                <span className="svg-icon svg-icon-3 m-0" onClick={() => {
                  setLayout(!layout);
                  layoutOnChange(layout ? {"target":{"value":"list"}} : {"target":{"value":"grid"}});
                  }}>
                  {layout ?
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 11H3C2.4 11 2 10.6 2 10V9C2 8.4 2.4 8 3 8H13C13.6 8 14 8.4 14 9V10C14 10.6 13.6 11 13 11ZM22 5V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4V5C2 5.6 2.4 6 3 6H21C21.6 6 22 5.6 22 5Z" fill="black"/>
                    <path opacity="0.3" d="M21 16H3C2.4 16 2 15.6 2 15V14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14V15C22 15.6 21.6 16 21 16ZM14 20V19C14 18.4 13.6 18 13 18H3C2.4 18 2 18.4 2 19V20C2 20.6 2.4 21 3 21H13C13.6 21 14 20.6 14 20Z" fill="black"/>
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="5" y="5" width="5" height="5" rx="1" fill="black"/>
                        <rect x="14" y="5" width="5" height="5" rx="1" fill="black" opacity="0.3"/>
                        <rect x="5" y="14" width="5" height="5" rx="1" fill="black" opacity="0.3"/>
                        <rect x="14" y="14" width="5" height="5" rx="1" fill="black" opacity="0.3"/>
                    </g>
                  </svg>}
                </span>
              </a>
              <a className={body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by ?  "me-3 btn btn-sm bg_primary px-3 px-md-4" : "me-3 btn btn-sm px-3 px-md-4"} id='kt_transaction_filter_toggle'>
                <KTSVG path='/media/custom/header-icons/filter.svg' className='svg-icon-5 svg-icon-gray-500 m-0'/>
              </a>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export {TransactionToolbar}