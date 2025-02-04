/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Offcanvas, Toast } from 'bootstrap';
import {useAuth} from '../../../app/modules/auth'
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { useLayout } from '../../../_metronic/layout/core'
import { deleteTask } from './core/_requests';
import { useIntl } from 'react-intl';

type Props = {
    sortByOnChange?: any,
    layoutOnChange?: any,
    count?: any,
    selectedTasks?: any,
    body?: any,
    taskOnSelectAll?: any,
    taskOnUnselectAll?: any,
}

const TaskToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const [actionValue, setActionValue] = useState<any>('');
  const [layout, setLayout] = useState(1);
  var roleId = currentUser?.designation;

    const {
        sortByOnChange, layoutOnChange, count, selectedTasks, body, taskOnSelectAll, taskOnUnselectAll
      } = props

  const {classes} = useLayout()
  let location = useLocation();
  

  const actionChange = async (e:any) => {
    let taskVal = selectedTasks.join(',')
    let val = e.target.value;
    setActionValue(e.target.value);
    if(val == 'import') {
      document.getElementById('kt_task_import_toggle')?.click();
      setActionValue("");
    }
    if(e.target.value == "select") {  
      taskOnSelectAll(); 
      setActionValue("");
    }
    if(e.target.value == "unselect") {
      taskOnUnselectAll();
      setActionValue("");
    }    
    if(e.target.value == "reAssign") {
      if(selectedTasks.length > 0) {
        document.getElementById('kt_task_reassign_pop_toggle')?.click();
      } else {
        var toastEl = document.getElementById('taskNotSelectedToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
      setActionValue("");
    }
    if(val == 'delete' && taskVal != '') {
      const respone = await deleteTask(taskVal);
      if(respone.status == 200) {
        document.getElementById('task_reload')?.click();
        setActionValue("");
        var toastEl = document.getElementById('myToastDeleteStatus');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
  }
  }

  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
          {isMenu &&
              <>
              <div className='d-flex button_bar'>
                {/* <input disabled value={intl.formatMessage({id: 'total'})+' '+'>'+' '+count} className="me-3 btn btn-sm d-none d-md-block"/> */}
                <span className="me-3 btn btn-sm text-center text-nowrap d-none d-md-block fs-8 disabled" >{intl.formatMessage({id: 'total'})+' '+'='+' '+count}</span>
                <span className="mx-3 btn btn-sm text-center text-nowrap d-md-none fs-8 pt-3 px-2 disabled">{intl.formatMessage({id: 'total'})+' '+'='+' '+count}</span>
                <a className="me-3 btn btn-sm d-none d-md-block" id='kt_task_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_task_import_toggle'>{intl.formatMessage({id: 'import'})}+</a>
                <select className="form-control me-3 btn btn-sm text-center" name="sort" id="sort" onChange={(e) => {sortByOnChange(e.target.value)}}>
                    <option value="">{intl.formatMessage({id: 'sort_by'})}</option>
                    <option value="created_at|asc">{intl.formatMessage({id: 'created_ascending'})}</option>
                    <option value="created_at|desc">{intl.formatMessage({id: 'created_descending'})}</option>
                    <option value="updated_at|asc">{intl.formatMessage({id: 'updated_ascending'})}</option>
                    <option value="updated_at|desc">{intl.formatMessage({id: 'updated_descending'})}</option>
                    {/* <option value="reset">{intl.formatMessage({id: 'reset'})}</option> */}
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none d-md-block" name="views" id="views" onChange={layoutOnChange}>
                  <option value="grid">{intl.formatMessage({id: 'grid_view'})}</option>
                  <option value="calendar">{intl.formatMessage({id: 'Calendar_view'})}</option>
                  <option value="pipe">{intl.formatMessage({id: 'pipeline_view'})}</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center" value={actionValue} onChange={actionChange} name="action" id="action">
                  <option disabled value="">{intl.formatMessage({id: 'action'})}</option>
                  {roleId == 1 && <option value="delete">{intl.formatMessage({id: 'delete'})}</option>}
                  <option value="select">{intl.formatMessage({id: 'select_all'})}</option>                  
                  <option value="unselect">{intl.formatMessage({id: 'unselect_all'})}</option>                  
                  <option value="reAssign">{intl.formatMessage({id: 're_assign'})}</option>
                  {/* <option value="archive">{intl.formatMessage({id: 'archive'})}</option> */}
                </select>                
              </div>
              <button className="me-3 btn btn-sm d-md-none px-3" id='kt_task_toggle'>
                <span className="svg-icon svg-icon-3 m-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="currentColor"/>
                <path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="currentColor"/>
                </svg>
                </span>
              </button>
              <a className="me-3 btn btn-sm px-3 d-md-none">
                <span className="svg-icon svg-icon-3 m-0" onClick={() => {
                  if(layout == 1) {setLayout(2)}
                  else if(layout == 2) {setLayout(3)}
                  else {setLayout(1)}
                  layoutOnChange(layout == 1 ? {"target": {"value": "calendar"}} : layout == 2 ? {"target": {"value": "pipe"}} : {"target": {"value": "grid"}});
                  }}>
                  {layout == 1 ?
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.3" d="M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z" fill="black"/>
                  <path d="M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z" fill="black"/>
                  <path d="M8.8 13.1C9.2 13.1 9.5 13 9.7 12.8C9.9 12.6 10.1 12.3 10.1 11.9C10.1 11.6 10 11.3 9.8 11.1C9.6 10.9 9.3 10.8 9 10.8C8.8 10.8 8.59999 10.8 8.39999 10.9C8.19999 11 8.1 11.1 8 11.2C7.9 11.3 7.8 11.4 7.7 11.6C7.6 11.8 7.5 11.9 7.5 12.1C7.5 12.2 7.4 12.2 7.3 12.3C7.2 12.4 7.09999 12.4 6.89999 12.4C6.69999 12.4 6.6 12.3 6.5 12.2C6.4 12.1 6.3 11.9 6.3 11.7C6.3 11.5 6.4 11.3 6.5 11.1C6.6 10.9 6.8 10.7 7 10.5C7.2 10.3 7.49999 10.1 7.89999 10C8.29999 9.90003 8.60001 9.80003 9.10001 9.80003C9.50001 9.80003 9.80001 9.90003 10.1 10C10.4 10.1 10.7 10.3 10.9 10.4C11.1 10.5 11.3 10.8 11.4 11.1C11.5 11.4 11.6 11.6 11.6 11.9C11.6 12.3 11.5 12.6 11.3 12.9C11.1 13.2 10.9 13.5 10.6 13.7C10.9 13.9 11.2 14.1 11.4 14.3C11.6 14.5 11.8 14.7 11.9 15C12 15.3 12.1 15.5 12.1 15.8C12.1 16.2 12 16.5 11.9 16.8C11.8 17.1 11.5 17.4 11.3 17.7C11.1 18 10.7 18.2 10.3 18.3C9.9 18.4 9.5 18.5 9 18.5C8.5 18.5 8.1 18.4 7.7 18.2C7.3 18 7 17.8 6.8 17.6C6.6 17.4 6.4 17.1 6.3 16.8C6.2 16.5 6.10001 16.3 6.10001 16.1C6.10001 15.9 6.2 15.7 6.3 15.6C6.4 15.5 6.6 15.4 6.8 15.4C6.9 15.4 7.00001 15.4 7.10001 15.5C7.20001 15.6 7.3 15.6 7.3 15.7C7.5 16.2 7.7 16.6 8 16.9C8.3 17.2 8.6 17.3 9 17.3C9.2 17.3 9.5 17.2 9.7 17.1C9.9 17 10.1 16.8 10.3 16.6C10.5 16.4 10.5 16.1 10.5 15.8C10.5 15.3 10.4 15 10.1 14.7C9.80001 14.4 9.50001 14.3 9.10001 14.3C9.00001 14.3 8.9 14.3 8.7 14.3C8.5 14.3 8.39999 14.3 8.39999 14.3C8.19999 14.3 7.99999 14.2 7.89999 14.1C7.79999 14 7.7 13.8 7.7 13.7C7.7 13.5 7.79999 13.4 7.89999 13.2C7.99999 13 8.2 13 8.5 13H8.8V13.1ZM15.3 17.5V12.2C14.3 13 13.6 13.3 13.3 13.3C13.1 13.3 13 13.2 12.9 13.1C12.8 13 12.7 12.8 12.7 12.6C12.7 12.4 12.8 12.3 12.9 12.2C13 12.1 13.2 12 13.6 11.8C14.1 11.6 14.5 11.3 14.7 11.1C14.9 10.9 15.2 10.6 15.5 10.3C15.8 10 15.9 9.80003 15.9 9.70003C15.9 9.60003 16.1 9.60004 16.3 9.60004C16.5 9.60004 16.7 9.70003 16.8 9.80003C16.9 9.90003 17 10.2 17 10.5V17.2C17 18 16.7 18.4 16.2 18.4C16 18.4 15.8 18.3 15.6 18.2C15.4 18.1 15.3 17.8 15.3 17.5Z" fill="black"/>
                  </svg>
                  : layout == 2 ?
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21H8C7.4 21 7 20.6 7 20V4C7 3.4 7.4 3 8 3H16C16.6 3 17 3.4 17 4V20C17 20.6 16.6 21 16 21Z" fill="black"/>
                  <path opacity="0.3" d="M2 3H4C4.6 3 5 3.4 5 4V20C5 20.6 4.6 21 4 21H2V3ZM20 21H22V3H20C19.4 3 19 3.4 19 4V20C19 20.6 19.4 21 20 21Z" fill="black"/>
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
              <a className={body.task_type || body.assign_to || body.project || body.reminder || body.priority || body.task_status || body.created_date || body.filter_name || body.created_by ?  "me-3 btn btn-sm bg_primary px-3 px-md-4" : "me-3 btn btn-sm px-3 px-md-4"} id='kt_task_filter_toggle'>
                <KTSVG path='/media/custom/header-icons/filter.svg' className='svg-icon-5 svg-icon-gray-500 m-0'/>
              </a>
              </>
          }
        </div>
      </div>
      {/* end::Container */}
    </div>
  )
}

export {TaskToolbar}