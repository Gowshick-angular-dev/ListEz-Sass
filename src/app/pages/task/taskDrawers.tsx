import React,{FC, useState, useEffect} from 'react'

import { ContactForm } from '../contact/contactform';
import { TaskFilter } from './taskfilter';
import { TaskForm } from './taskform';
import { TaskImportForm } from './taskImport';

type Props = {
  setTaskList?: any,
  task_body?: any,
  sort_by?: any,
  count?: any,
}

const TaskDrawer: FC<Props> = (props) => {
  const {
    setTaskList, task_body, sort_by, count
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
        data-kt-drawer-toggle='#kt_property_toggle'
        data-kt-drawer-close='#kt_contact_close'
      >
        <ContactForm />
    </div>
    {/* Add Task Drawer */}
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
        <TaskForm setTasks={setTaskList}/>
    </div>
    {/* Import Lead Drawer */}
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
        <TaskImportForm setTasks={setTaskList}/>
    </div>
 {/* task filter Drawer */}
    <div
       id='kt_task_filter'
       className='bg-white side_drawer'
       data-kt-drawer='true'
       data-kt-drawer-name='task_filter'
       data-kt-drawer-activate='true'
       data-kt-drawer-overlay='true'
       data-kt-drawer-width="{default:'100%', 'md': '700px'}"
       data-kt-drawer-direction='end'
       data-kt-drawer-toggle='#kt_task_filter_toggle'
       data-kt-drawer-close='#kt_task_filter_close'
    >
        <TaskFilter setTasks={setTaskList} setBody={task_body} sortBy={sort_by} setTaskLength={count} />
    </div>


  </div>
  )
}

export {TaskDrawer}