import React, {useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {KTSVG} from '../../../helpers'
import ReactDOM from "react-dom";
// import { Accordion } from 'react-bootstrap'

import { ProjectForm } from '../../../../app/pages/property/propertyform'
import { TaskForm } from '../../../../app/pages/task/taskform';
import { ContactForm } from '../../../../app/pages/contact/contactform';
import { TaskFilter } from '../../../../app/pages/task/taskfilter';
import { PropertyFilter } from '../../../../app/pages/property/propertyFilter';
import { ContactFilter } from '../../../../app/pages/contact/contactFilter';
import { LeadFilter } from '../../../../app/pages/lead/leadFilter';

// const FilterDrawer: FC = () => (
function FilterDrawer(){

  let location = useLocation();
  console.log("location",location)

  const isContact = location.pathname.includes('contact');
  const isTask = location.pathname.includes('task');
  const isProperty = location.pathname.includes('property');
  const isLead = location.pathname.includes('lead');

  return(
  <div>

    {isTask &&
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
           <TaskFilter/>
        </div>
    }
    {isProperty &&
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
            <PropertyFilter/>
          </div>
    }
  </div>
  )
}


export {FilterDrawer}
// export default FilterDrawer