import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Toast } from 'bootstrap';
import { useLocation } from 'react-router-dom'
import { KTSVG } from '../../../_metronic/helpers'
import { useLayout } from '../../../_metronic/layout/core'
import { deleteProperty } from './core/_requests'
import { useAuth } from '../../modules/auth';
import { useIntl } from 'react-intl';

type Props = {
  sortByOnChangeProperty?: any,
    layoutOnChange?: any,
    selectedProps?: any,
    setPropList?: any,
    propertiesCount?: any,
    body?: any,
}

const PropertyToolbar: FC<Props> = (props) => {

  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const [actionValue, setActionValue] = useState<any>('');
  const [layout, setLayout] = useState(true);
  var roleId = currentUser?.designation;

    const {
      sortByOnChangeProperty, layoutOnChange, selectedProps, propertiesCount, body
      } = props

  const {classes} = useLayout()
  let location = useLocation();
  const isMenu = location.pathname.includes('menu');

  const actionChange = async (e:any) => {
    setActionValue(e.target.value); 
    let propVal = selectedProps.join(',')
    let val = e.target.value;
    if(val == 'import') {
      document.getElementById('kt_property_import_toggle')?.click();
      setActionValue("default");
    }
    if(val == 'delete') {
      if(propVal != ''){
        const deleteRes = await deleteProperty(propVal);
        if(deleteRes.status == 200) {
          setActionValue("default");
          document.getElementById('propertyReloadBtn')?.click();
          var toastEl = document.getElementById('myToastUpdate');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
  }}}}

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex justify-content-end w-100 overflow-auto p-0 px-md-5')}
      >
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
          {isMenu && <>
              <div className='d-flex button_bar'>
                <span className="me-3 btn btn-sm text-center text-nowrap d-none d-md-block fs-8 disabled" >{intl.formatMessage({id: 'total'})+' '+'='+' '+propertiesCount}</span>
                <span className="mx-3 btn btn-sm text-center text-nowrap d-md-none fs-8 pt-3 px-2 disabled">{intl.formatMessage({id: 'total'})+' '+'='+' '+propertiesCount}</span>
                <a className="me-3 btn btn-sm d-none d-md-block" id='kt_property_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_contact_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm me-4 d-none" id='kt_property_import_toggle'>{intl.formatMessage({id: 'import'})}+</a>
                <select className="form-control me-3 btn btn-sm text-center" name="sort" id="sort" onChange={(e) => {sortByOnChangeProperty(e.target.value)}}>
                    <option value="">{intl.formatMessage({id: 'sort_by'})}</option>
                    <option value="created_at|asc">{intl.formatMessage({id: 'created_ascending'})}</option>
                    <option value="created_at|desc">{intl.formatMessage({id: 'created_descending'})}</option>
                    <option value="updated_at|asc">{intl.formatMessage({id: 'updated_ascending'})}</option>
                    <option value="updated_at|desc">{intl.formatMessage({id: 'updated_descending'})}</option>
                    <option value="name_of_building|asc">{intl.formatMessage({id: 'project_name'})} A - Z</option>
                    <option value="name_of_building|desc">{intl.formatMessage({id: 'project_name'})} Z - A</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none d-md-block" name="views" id="views" onChange={layoutOnChange}>
                    <option value='grid'>{intl.formatMessage({id: 'grid_view'})}</option>
                    <option value='list'>{intl.formatMessage({id: 'list_view'})}</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center d-none" name="type" id="type">
                  <option value="default">{intl.formatMessage({id: 'type'})}</option>
                  <option value="date">{intl.formatMessage({id: 'residential'})}</option>
                  <option value="dob">{intl.formatMessage({id: 'commercial'})}</option>
                  <option value="Plot">{intl.formatMessage({id: 'plot'})}</option>
                  <option value="developer">{intl.formatMessage({id: 'developer'})}</option>
                </select>
                <select className="form-control me-3 btn btn-sm text-center" value={actionValue} onChange={actionChange} name="action" id="action">
                  <option value="default">{intl.formatMessage({id: 'action'})}</option>
                  {roleId == 1 && <option value="delete">{intl.formatMessage({id: 'delete'})}</option>}
                </select>                
              </div>
              <button className="me-3 btn btn-sm d-md-none px-3" id='kt_property_toggle'>
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
              <a className={body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by ? "me-3 btn btn-sm bg_primary px-3 px-md-4" : "me-3 btn btn-sm px-3 px-md-4"} id='kt_property_filter_toggle'>
                <KTSVG path='/media/custom/header-icons/filter.svg' className='svg-icon-5 svg-icon-gray-500 m-0'/>
              </a>
              </>}
        </div>
      </div>
    </div>
  )
}

export {PropertyToolbar}