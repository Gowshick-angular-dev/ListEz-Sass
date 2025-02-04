import React, {useState} from 'react'
import { useLocation} from 'react-router-dom'
// import { Accordion } from 'react-bootstrap'

import { ProjectForm } from '../../../../app/pages/property/propertyform'
import { TaskForm } from '../../../../app/pages/task/taskform';
import { ContactForm } from '../../../../app/pages/contact/contactform';
import { TaskFilter } from '../../../../app/pages/task/taskfilter';
import { PropertyFilter } from '../../../../app/pages/property/propertyFilter';
import { ContactFilter } from '../../../../app/pages/contact/contactFilter';
import { LeadFilter } from '../../../../app/pages/lead/leadFilter';
import { ContactDetails } from '../../../../app/pages/contact/contactDetails';
import { TaskDetails } from '../../../../app/pages/task/taskDetails';
import { PropertyDetails } from '../../../../app/pages/property/propertyDetails';
import { LeadDetails } from '../../../../app/pages/lead/leadDetails';
import { TransactionDetails } from '../../../../app/pages/transaction/transactionDetails';

// const ExpandDrawer: FC = () => (
function ExpandDrawer(){

  let location = useLocation();
  console.log("location",location)

  const isContact = location.pathname.includes('contact');
  const isTask = location.pathname.includes('task');
  const isProperty = location.pathname.includes('property');
  const isLead = location.pathname.includes('lead');
  const isTransaction = location.pathname.includes('transaction');

  const openContactFrom = () => {
    document.getElementById('kt_expand_toggle')?.click();
  }

  return(
  <div>
    {/* {isContact &&
    <div>
      <div
        id='kt_expand'
        className='bg-white expand_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'96%', 'md': '75%'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expand_toggle'
        data-kt-drawer-close='#kt_expand_close'
      >
        <ContactDetails/>
      </div>
      <div className="card bg_primary minimize_card d-none">
          <div className="card-body d-flex justify-content-between">
              <div>
                  <h5 className='text-white mb-0'>Contact Details</h5>
              </div>
              <a href="#" className="mx-3">
                  <i className="fas fa-window-minimize text-white"></i>
              </a>
              <a href="#" className="mx-3">
                  <i className="fas fa-times text-white"></i>
              </a>
          </div>
      </div>
    </div>    
    } */}


    {/* {isTask &&
    <div>
      <div
        id='kt_expand'
        className='bg-white expand_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'96%', 'md': '75%'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expand_toggle'
        data-kt-drawer-close='#kt_expand_close'
      >
        <TaskDetails/>
      </div>
      <div className="card bg_primary minimize_card d-none">
          <div className="card-body d-flex justify-content-between">
              <div>
                  <h5 className='text-white mb-0'>Contact Details</h5>
              </div>
              <a href="#" className="mx-3">
                  <i className="fas fa-window-minimize text-white"></i>
              </a>
              <a href="#" className="mx-3">
                  <i className="fas fa-times text-white"></i>
              </a>
          </div>
      </div>
    </div>    
    } */}

    {/* {isProperty &&
    <div>
      <div
        id='kt_expand'
        className='bg-white expand_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'96%', 'md': '75%'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expand_toggle'
        data-kt-drawer-close='#kt_expand_close'
      >
        <PropertyDetails/>
      </div>
      <div className="card bg_primary minimize_card d-none">
          <div className="card-body d-flex justify-content-between">
              <div>
                  <h5 className='text-white mb-0'>Contact Details</h5>
              </div>
              <a href="#" className="mx-3">
                  <i className="fas fa-window-minimize text-white"></i>
              </a>
              <a href="#" className="mx-3">
                  <i className="fas fa-times text-white"></i>
              </a>
          </div>
      </div>
    </div>    
    } */}

    {/* {isLead &&
    <div>
      <div
        id='kt_expand'
        className='bg-white expand_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'96%', 'md': '75%'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expand_toggle'
        data-kt-drawer-close='#kt_expand_close'
      >
        <LeadDetails/>
      </div>
      <div className="card bg_primary minimize_card d-none">
          <div className="card-body d-flex justify-content-between">
              <div>
                  <h5 className='text-white mb-0'>Contact Details</h5>
              </div>
              <a href="#" className="mx-3">
                  <i className="fas fa-window-minimize text-white"></i>
              </a>
              <a href="#" className="mx-3">
                  <i className="fas fa-times text-white"></i>
              </a>
          </div>
      </div>
    </div>    
    } */}

    {/* {isTransaction &&
    <div>
      <div
        id='kt_expand'
        className='bg-white expand_area'
        data-kt-drawer='true'
        data-kt-drawer-name='filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'96%', 'md': '75%'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expand_toggle'
        data-kt-drawer-close='#kt_expand_close'
      >
        <TransactionDetails/>
      </div>
      <div className="card bg_primary minimize_card d-none">
          <div className="card-body d-flex justify-content-between">
              <div>
                  <h5 className='text-white mb-0'>Contact Details</h5>
              </div>
              <a href="#" className="mx-3">
                  <i className="fas fa-window-minimize text-white"></i>
              </a>
              <a href="#" className="mx-3">
                  <i className="fas fa-times text-white"></i>
              </a>
          </div>
      </div>
    </div>    
    } */}

    
  </div>
  )
}


export {ExpandDrawer}
// export default ExpandDrawer