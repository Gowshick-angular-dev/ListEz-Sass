/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Offcanvas, Toast } from 'bootstrap';
import { useLocation } from 'react-router-dom'
import {useAuth} from '../../../app/modules/auth'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { useLayout } from '../../../_metronic/layout/core'
import { deleteLead, deleteMultipleLeads, getLeadsByRole } from './core/_requests'
import {useIntl} from 'react-intl';

type Props = {
    sortByOnChangeLead?: any,
    layoutOnChange?: any,
    selectedLeads?: any,
    leadCount?: any,
    body?: any,
    leadOnUnselectAll?: any,
    leadOnSelectAll?: any,
}

const LeadToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {
    sortByOnChangeLead, layoutOnChange, selectedLeads, leadCount, body, leadOnSelectAll, leadOnUnselectAll
  } = props

  const {classes} = useLayout()
  let location = useLocation();
  console.log("location",location)
  const {currentUser, logout} = useAuth();
  const [actionValue, setActionValue] = useState<any>('');
  const [lead, setLead] = useState<any[]>([]);
  const [layout, setLayout] = useState(true);

  var roleId = currentUser?.designation;

  const leadList = async () => {
    var userId = currentUser?.id;
    var roleId = currentUser?.designation;
    const characterResponse = await getLeadsByRole(userId, roleId)
    setLead(characterResponse);
  }

  const actionChange = async (e:any) => {
    setActionValue(e.target.value);
    let leadVal = selectedLeads.join(',')
    let val = e.target.value;
    if(val == 'import') {
      document.getElementById('kt_lead_import_toggle')?.click();
      setActionValue("default");
    }
    if(e.target.value == "select") {  
      leadOnSelectAll(); 
      setActionValue("");   
    }
    if(e.target.value == "unselect") {
      leadOnUnselectAll();
      setActionValue("");
    }    
    if(e.target.value == "reAssign") {
      // const response = await bulkReassignContact(contactVal);
      if(selectedLeads.length > 0) {
        document.getElementById('kt_lead_reassign_pop_toggle')?.click();
      } else {
        var toastEl = document.getElementById('leadNotSelectedToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }      
      setActionValue("");
    }
    if(val == 'delete'){
      console.log('deletedddd');
      if(leadVal != ''){
        document.getElementById('erghoieurtgto3487giug3u4yg3u4y5ghb')?.click();
      } else {
        var toastEl = document.getElementById('leadNotSelectedToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
    setActionValue("");
    }
  }

  useEffect(() => {
    // leadList();
}, []);

  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <button type='button' id='erghoieurtgto3487giug3u4yg3u4y5ghb' data-bs-toggle='modal' data-bs-target={'#delete_multi_lead_popup'} className='d-none'>dlt</button>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex justify-content-end w-100 overflow-auto p-0 px-md-5')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end">
          {isMenu &&
              <>
              <div className='d-flex button_bar'>
                {/* <input disabled value={`${intl.formatMessage({id: 'total'})}`+' '+'='+' '+leadCount} className="me-3 btn btn-sm"/> */}
                <span className="me-3 btn btn-sm text-center text-nowrap d-none d-md-block fs-8 disabled" >{intl.formatMessage({id: 'total'})+' '+'='+' '+leadCount}</span>
                <span className="mx-3 btn btn-sm text-center text-nowrap d-md-none fs-8 pt-3 px-2 disabled">{intl.formatMessage({id: 'total'})+' '+'='+' '+leadCount}</span>
                <a className="me-3 btn btn-sm d-none d-md-block" id='kt_lead_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_contact_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_task_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_transaction_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_lead_import_toggle'>{intl.formatMessage({id: 'import'})}+</a>
                <select className="form-control me-3 btn btn-sm text-center" name="sort" id="sort" onChange={(e) => {sortByOnChangeLead(e.target.value)}}>
                    <option value="">{intl.formatMessage({id: 'sort_by'})}</option>
                    <option value="created_at|asc">{intl.formatMessage({id: 'created_ascending'})}</option>
                    <option value="created_at|desc">{intl.formatMessage({id: 'created_descending'})}</option>
                    <option value="updated_at|asc">{intl.formatMessage({id: 'updated_ascending'})}</option>
                    <option value="updated_at|desc">{intl.formatMessage({id: 'updated_descending'})}</option>
                    <option value="lead_priority|asc">{intl.formatMessage({id: 'priority'})} High - Low</option>
                    <option value="lead_priority|desc">{intl.formatMessage({id: 'priority'})} Low - High</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none d-md-block" name="views" id="views" onChange={layoutOnChange}>
                  <option value="grid">{intl.formatMessage({id: 'grid_view'})}</option>
                  <option value="list">{intl.formatMessage({id: 'list_view'})}</option>
                  {/* <option value="pipe">{intl.formatMessage({id: 'pipeline_view'})}</option> */}
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none" name="type" id="type">
                  <option value="default">{intl.formatMessage({id: 'type'})}</option>
                  <option value="date">{intl.formatMessage({id: 'residential'})}</option>
                  <option value="dob">{intl.formatMessage({id: 'commercial'})}</option>
                  <option value="Plot">{intl.formatMessage({id: 'plot'})}</option>
                  <option value="developer">{intl.formatMessage({id: 'developer'})}</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center" value={actionValue} onChange={actionChange} name="action" id="action">
                  <option value="">{intl.formatMessage({id: 'action'})}</option>
                  {roleId == 1 && (<option value="delete">{intl.formatMessage({id: 'delete'})}</option>)}
                  <option value="select">{intl.formatMessage({id: 'select_all'})}</option>                  
                  <option value="unselect">{intl.formatMessage({id: 'unselect_all'})}</option>                  
                  <option value="reAssign">{intl.formatMessage({id: 're_assign'})}</option>
                  {/* <option value="archive">{intl.formatMessage({id: 'archive'})}</option>
                  <option value="export">{intl.formatMessage({id: 'export'})}</option> */}
                  <option value="import">{intl.formatMessage({id: 'import'})}</option>
                </select>

              </div>
              <button className="me-3 btn btn-sm d-md-none px-3" id='kt_lead_toggle'>
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
                <a className={body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.lead_unit_type || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by ? "me-3 btn btn-sm bg_primary px-3 px-md-4" : "me-3 btn btn-sm px-3 px-md-4"} id='kt_filter_toggle'>
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

export {LeadToolbar}