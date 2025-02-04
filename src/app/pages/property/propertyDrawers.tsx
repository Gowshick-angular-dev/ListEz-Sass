import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

import { ContactForm } from '../contact/contactform';
import { PropertyFilter } from './propertyFilter';
import { ProjectForm } from './propertyform';
import { PropertyImportForm } from './propertyImport';

type Props = {
  count?: any,
  setPropList?: any,
  filteredProperties?: any,
}

const PropertyDrawer: FC<Props> = (props) => {
  const {
    count, setPropList, filteredProperties
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
    {/* Add Property Drawer */}
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
        <ProjectForm setProperty={setPropList} setPropertyCount={count}/>
    </div>
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
        <PropertyImportForm setProperty={setPropList}/>
    </div>

    <div
        id='kt_property_filter'
        className='bg-white side_drawer'
        data-kt-drawer='true'
        data-kt-drawer-name='property_filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_property_filter_toggle'
        data-kt-drawer-close='#kt_property_filter_close'
    >
        <PropertyFilter getPropertiesFiltered={filteredProperties}/>
    </div>

  </div>
  )
}

export {PropertyDrawer}