import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { LeadForm } from '../lead/leadform';
import { TaskForm } from '../task/taskform';
import { ContactFilter } from './contactFilter';
import {useIntl} from 'react-intl'
import { ContactForm } from './contactform';
import { ContactImportForm } from './contactImport';

type Props = {
  setContactList?: any,
  setContactsCount?: any,
  setBody?: any,
  body?: any,
  contactData?: any,
  contactListView?: any,
}

const ContactDrawer: FC<Props> = (props) => {
  const {
   setContactList, setContactsCount, setBody, body, contactData, contactListView 
  } = props
 
  const location = useLocation();
  const intl = useIntl();
  return(
  <div>

    {/* Add Contact Drawer */}
    <div
        id='kt_contact'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='contact'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_contact_toggle'
        data-kt-drawer-close='#kt_contact_close'
      >
        <ContactForm setContacts={setContactList}/>
    </div>
    {/* Import Contact Drawer */}
    <div
        id='kt_contact_import'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='contact_import'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_contact_import_toggle'
        data-kt-drawer-close='#kt_contact_import_close'
      >
        <ContactImportForm setContacts={setContactList}/>
    </div>
    {/* Filter Contact Drawer */}
    <div
        id='kt_filter'
        className='bg-white filter_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_filter_toggle'
        data-kt-drawer-close='#kt_filter_close'
      >
        <ContactFilter setContacts={setContactList} setContactsCount={setContactsCount} setBody={setBody} body={body} contactListView={contactListView} />
    </div>
    {/* Add Lead Drawer */}
    <div
        id='kt_lead'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='lead'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_lead_toggle'
        data-kt-drawer-close='#kt_lead_close'
    >
        <LeadForm contact={contactData} />
    </div>
    <div
        id='kt_task'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='contact'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_task_toggle'
        data-kt-drawer-close='#kt_task_close'
    >
        <TaskForm contact={contactData}/>
    </div>

  </div>
  )
}


export {ContactDrawer}
// export default AddContact