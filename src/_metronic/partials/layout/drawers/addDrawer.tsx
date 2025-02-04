import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
// import { Accordion } from 'react-bootstrap'

import {ProjectForm} from '../../../../app/pages/property/propertyform'
import { TaskForm } from '../../../../app/pages/task/taskform';
import { ContactForm } from '../../../../app/pages/contact/contactform';
import { ContactImportForm } from '../../../../app/pages/contact/contactImport';
import { LeadForm } from '../../../../app/pages/lead/leadform';
import { LeadImportForm } from '../../../../app/pages/lead/leadImport';
import { TaskImportForm } from '../../../../app/pages/task/taskImport';
import { PropertyImportForm } from '../../../../app/pages/property/propertyImport';
import {AddUserSettings} from '../../../../app/pages/settings/userManagement/addUser'

type Props = {
  setContactList?: any
}

const AddContact: FC<Props> = (props) => {
  const {
   setContactList
  } = props
// function AddContact(){

  let location = useLocation();
  console.log("location",location)

  const isContact = location.pathname.includes('contact');
  const isTask = location.pathname.includes('task');
  const isProperty = location.pathname.includes('property');
  const isLead = location.pathname.includes('lead');
  const isUserSettings = location.pathname.includes('user-settings');

  return(
  <div>

    {/* Add Contact Drawer */}
    {isContact &&
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
    }

    {isContact &&
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
    }

    {isLead &&
    <div
        id='kt_lead_import'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='lead_import'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_lead_import_toggle'
        data-kt-drawer-close='#kt_lead_import_close'
      >
        <LeadImportForm />
    </div>
    }

    {isLead &&
      <div
          id='kt_contact'
          className='bg-white d-none'
          data-kt-drawer='true'
          data-kt-drawer-name='contact'
          data-kt-drawer-activate='true'
          data-kt-drawer-overlay='true'
          data-kt-drawer-width="{default:'100%', 'md': '700px'}"
          data-kt-drawer-direction='end'
          data-kt-drawer-toggle='#kt_contact_toggle'
          data-kt-drawer-close='#kt_contact_close'
        >
          <ContactForm/>
      </div>
    }

    {isProperty &&
      <div
          id='kt_contact'
          className='bg-white d-none'
          data-kt-drawer='true'
          data-kt-drawer-name='contact'
          data-kt-drawer-activate='true'
          data-kt-drawer-overlay='true'
          data-kt-drawer-width="{default:'100%', 'md': '700px'}"
          data-kt-drawer-direction='end'
          data-kt-drawer-toggle='#kt_contact_toggle'
          data-kt-drawer-close='#kt_contact_close'
        >
          <ContactForm/>
      </div>
    }

    {/* Add Task Drawer */}
    {isTask &&
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
           <TaskForm/>
        </div>
    }

  {isTask &&
    <div
        id='kt_task_import'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='task_import'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_task_import_toggle'
        data-kt-drawer-close='#kt_task_import_close'
      >
        <TaskImportForm />
    </div>
    }

    {/* Add Property Drawer */}
    {isProperty &&
          <div
            id='kt_property'
            className='bg-white'
            data-kt-drawer='true'
            data-kt-drawer-name='property'
            data-kt-drawer-activate='true'
            data-kt-drawer-overlay='true'
            data-kt-drawer-width="{default:'100%', 'md': '700px'}"
            data-kt-drawer-direction='end'
            data-kt-drawer-toggle='#kt_property_toggle'
            data-kt-drawer-close='#kt_property_close'
          >
            <ProjectForm/>
          </div>
    }

  {isProperty &&
    <div
        id='kt_property_import'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='property_import'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_property_import_toggle'
        data-kt-drawer-close='#kt_property_import_close'
      >
        <PropertyImportForm />
    </div>
    }

    {/* Add Lead Drawer */}
    {isLead &&
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
            <LeadForm/>
          </div>
    }

    {/* User Settings Drawer */}
    {isUserSettings &&
          <div
            id='kt_usersettings'
            className='bg-white'
            data-kt-drawer='true'
            data-kt-drawer-name='contact'
            data-kt-drawer-activate='true'
            data-kt-drawer-overlay='true'
            data-kt-drawer-width="{default:'100%', 'md': '700px'}"
            data-kt-drawer-direction='end'
            data-kt-drawer-toggle='#kt_usersettings_toggle'
            data-kt-drawer-close='#kt_usersettings_close'
          >
            <AddUserSettings/>
          </div>
    }
  </div>
  )
}


export {AddContact}
// export default AddContact