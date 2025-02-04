import React,{FC, useState, useEffect} from 'react'
import { ContactForm } from '../contact/contactform';
import { LeadFilter } from './leadFilter';
import { LeadForm } from './leadform';
import { LeadImportForm } from './leadImport';
import { TaskForm } from '../task/taskform';
import { TransactionForm } from '../transaction/transactionForm';


type Props = {
  setLeadList?: any
  setLeadsCount?: any,
  setBody?: any,
  body?: any,
  leadId?: any,
  currentContactName?: any,
  leadDetails?: any,
}

const LeadDrawer: FC<Props> = (props) => {
 
  const {
    setLeadList, setLeadsCount, body, setBody, leadId, currentContactName, leadDetails
   } = props

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
        <ContactForm />
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
        <LeadForm setLeads={setLeadList}/>
    </div>
    {/* Import Lead Drawer */}
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
        <LeadImportForm setLeads={setLeadList}/>
    </div>
    {/* Filter Lead Drawer */}
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
      <LeadFilter setLeads={setLeadList} setLeadsCount={setLeadsCount} reqBody={body} setBody={setBody}/>
    </div>
    <div
        id='kt_task'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='task_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_task_toggle'
        data-kt-drawer-close='#kt_task_close'
    >
        <TaskForm contact={currentContactName} />
    </div>
    <div
        id='kt_transaction'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='transaction'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_transaction_toggle'
        data-kt-drawer-close='#kt_transaction_close'
      >
        <TransactionForm leadDetails={leadDetails} />
    </div>
  </div>
  )
}


export {LeadDrawer}
// export default AddContact