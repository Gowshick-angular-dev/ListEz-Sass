import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import { Toast, Offcanvas } from 'bootstrap';
import { useLocation } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import { useLayout } from '../../../_metronic/layout/core'
import { bulkReassignContact, deleteContact, getContsctDropList, getContactsCSV } from './core/_requests';
import {useAuth} from '../../../app/modules/auth';
import {useIntl} from 'react-intl';

type Props = {
    setSortBy?: any,
    layoutOnChange?: any,
    selectedContacts?: any,
    setContactList?: any,
    count?: any,
    setContactCheckList?: any,
    requestBody?: any,
    contactOnSelectAll?: any,
    contactOnUnselectAll?: any,
}

const ContactToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {
    setSortBy, layoutOnChange, selectedContacts, setContactList, count, setContactCheckList, requestBody, contactOnSelectAll, contactOnUnselectAll
    } = props

  const {classes} = useLayout()
  const {currentUser, logout} = useAuth();
  const [dropList, setContactDropdowns] = useState<any>({});
  const [actionValue, setActionValue] = useState<any>('');
  const [layout, setLayout] = useState(1);
  let location = useLocation();
  const permis:any = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);

  var roleId = currentUser?.designation;

  const contactDropdowns = async () => {
    const response = await getContsctDropList()
    setContactDropdowns(response.output);
  }

  const actionChange = async (e:any) => {
    setActionValue(e.target.value);
    if(e.target.value == "import") {
      document.getElementById('kt_contact_import_toggle')?.click();
      setActionValue("");
    }
    if(e.target.value == "select") {  
      contactOnSelectAll(); 
      setActionValue("");   
    }
    if(e.target.value == "unselect") {
      contactOnUnselectAll();
      setActionValue("");
    }
    if(e.target.value == "export") {
      const response = await getContactsCSV(requestBody);
        document.getElementById('contact_data_csv')?.click();
        setActionValue("");
        var toastEl = document.getElementById('contactExportToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
    }
    if(e.target.value == "reAssign") {
      // const response = await bulkReassignContact(contactVal);
      if(selectedContacts.length > 0) {
        document.getElementById('kt_contact_reassign_pop_toggle')?.click();
      } else {
        var toastEl = document.getElementById('contactNotSelectedToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
      setActionValue("");
    }
    let contactVal = selectedContacts?.join(',')
    let val = e.target.value;
    if(val == 'delete'){
      if(contactVal != ''){
        document.getElementById('rkhw8egrijebrkuwiegr8giu34587gfbjk')?.click();
      } else {
        var toastEl = document.getElementById('contactNotSelectedToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
      }
      setActionValue("");
    }
  }

  useEffect(() => {
    contactDropdowns();
}, []);

  const isMenu = location.pathname.includes('menu');

  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <button type='button' id='rkhw8egrijebrkuwiegr8giu34587gfbjk' data-bs-toggle='modal' data-bs-target={'#delete_multi_contact_popup'} className='d-none'>dlt</button>
      <a href={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/csv/output.csv'} className='d-none' id='contact_data_csv' />
      <div
        id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex justify-content-end w-100 overflow-auto p-0 px-md-5')}
      >

        <div  className="menu_bar d-flex align-items-center justify-content-end">
          {isMenu &&
              <>
              <div className=''>
                <div className='d-flex'>
                <span className="me-3 btn btn-sm text-center text-nowrap d-none d-md-block fs-8 disabled" >{intl.formatMessage({id: 'total'})+' '+'='+' '+count}</span>
                <span className="mx-3 btn btn-sm text-center text-nowrap d-md-none fs-8 pt-4 px-2 disabled">{intl.formatMessage({id: 'total'})+' '+'='+' '+count}</span>
                <button className="me-3 btn btn-sm d-none d-md-block" id='kt_contact_toggle'>{intl.formatMessage({id: 'add'})}+</button>
                
                <a className="me-4 btn btn-sm d-none" id='kt_lead_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <a className="me-4 btn btn-sm d-none" id='kt_task_toggle'>{intl.formatMessage({id: 'add'})}+</a>
                <button className="me-3 btn btn-sm d-none" id='kt_contact_import_toggle'>{intl.formatMessage({id: 'import'})}+</button>

                <select className="form-control me-3 btn btn-sm text-center px-2" name="sort" id="sort" onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">{intl.formatMessage({id: 'sort_by'})}</option>
                  <option value="created_at|asc">{intl.formatMessage({id: 'created_ascending'})}</option>
                  <option value="created_at|desc">{intl.formatMessage({id: 'created_descending'})}</option>
                  <option value="updated_at|asc">{intl.formatMessage({id: 'updated_ascending'})}</option>
                  <option value="updated_at|desc">{intl.formatMessage({id: 'updated_descending'})}</option>
                  <option value="first_name|asc">{intl.formatMessage({id: 'first_name'})} A - Z</option>
                  <option value="first_name|desc">{intl.formatMessage({id: 'first_name'})} Z - A</option>
                </select>                

                <select className="form-control me-3 btn btn-sm text-center d-none d-md-block" name="views" id="views" onChange={layoutOnChange}>
                  <option value="grid">{intl.formatMessage({id: 'grid_view'})}</option>
                  <option value="list">{intl.formatMessage({id: 'list_view'})}</option>
                  <option value="pipe">{intl.formatMessage({id: 'pipeline_view'})}</option>
                </select>                

                {/* <select className="form-control me-3 btn btn-sm text-center" name="catagory" id="catagory" onChange={(e) => setCategory(e.target.value)}>
                  {dropList.contact_category?.map((contactCategoryValue:any,i:any)=> {
                    return (
                      <option value={contactCategoryValue.id} key={i}>{contactCategoryValue.opt_value}</option>
                    ) 
                  })}
                </select> */}
                
                <select className="form-control me-3 btn btn-sm text-center px-2" value={actionValue} name="action" onChange={(e) => actionChange(e)} id="action">
                  <option value="">{intl.formatMessage({id: 'action'})}</option>
                  {roleId == 1 &&
                  <option value="delete">{intl.formatMessage({id: 'delete'})}</option>}                
                  <option value="select">{intl.formatMessage({id: 'select_all'})}</option>                  
                  <option value="unselect">{intl.formatMessage({id: 'unselect_all'})}</option>                  
                  <option value="reAssign">{intl.formatMessage({id: 're_assign'})}</option>                  
                  {/* <option value="archive">{intl.formatMessage({id: 'archive'})}</option> */}
                  {permissions.export == 1 && <option value="export">{intl.formatMessage({id: 'export'})}</option>}
                  <option value="import">{intl.formatMessage({id: 'import'})}</option>
                </select>

                {/* {selectedContacts.length > 0 && <button className="me-3 btn btn-sm text-nowrap" onClick={async () => {
                    let contactVal = selectedContacts.join(',')
                      if(contactVal != ''){
                        const deleteRes = await deleteContact(contactVal);
                        if(deleteRes.status == 200) {
                          document.getElementById('contactReload')?.click();
                          setContactCheckList([]);
                          var toastEl = document.getElementById('contactDeletedToast');
                          const bsToast = new Toast(toastEl!);
                          bsToast.show();
                        }
                    }
                }}>
                  {intl.formatMessage({id: 'delete'})}
                <span className="svg-icon svg-icon-4 ms-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></button>} */}
                <button className="me-3 btn btn-sm d-md-none px-3" id='kt_contact_toggle'>
                  <span className="svg-icon svg-icon-2 m-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    layoutOnChange(layout == 1 ? {"target": {"value": "list"}} : layout == 2 ? {"target": {"value": "pipe"}} : {"target": {"value": "grid"}});
                    }}>
                    {layout == 1 ?
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 11H3C2.4 11 2 10.6 2 10V9C2 8.4 2.4 8 3 8H13C13.6 8 14 8.4 14 9V10C14 10.6 13.6 11 13 11ZM22 5V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4V5C2 5.6 2.4 6 3 6H21C21.6 6 22 5.6 22 5Z" fill="black"/>
                      <path opacity="0.3" d="M21 16H3C2.4 16 2 15.6 2 15V14C2 13.4 2.4 13 3 13H21C21.6 13 22 13.4 22 14V15C22 15.6 21.6 16 21 16ZM14 20V19C14 18.4 13.6 18 13 18H3C2.4 18 2 18.4 2 19V20C2 20.6 2.4 21 3 21H13C13.6 21 14 20.6 14 20Z" fill="black"/>
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
                <a className={requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code ? "me-3 btn btn-sm px-4 bg_primary" : "me-3 btn btn-sm px-4"} id='kt_filter_toggle'>
                  <KTSVG path='/media/custom/header-icons/filter.svg' className='svg-icon-5 svg-icon-gray-500 me-0'/>
                </a>                
                </div>
              </div>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export {ContactToolbar}