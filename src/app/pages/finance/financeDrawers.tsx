import React,{FC, useState, useEffect} from 'react'
import { CashbackForm } from './cashback/cashbackForm'
import { CollectionForm } from './collection/collectionForm'
import { ExpenseForm } from './expense/expenseAddForm'
import { FeeConfirmationForm } from './fee confirmation/feeConfirmationForm'
import { IncentiveForm } from './incentive/incentiveForm'
import { InvoiceForm } from './invoice/addInvoice'
import { ProformaInvoiceForm } from './proforma_invoice/proformaInvoiceAddForm'

type props = {
tabDetails?:any,
tId?:any,
dropdowns?:any,
}

const FinanceDrawer: FC<props> = (props) => {

  const{tabDetails, tId, dropdowns} = props
  
  return(
  <div>

    {/* Add Contact Drawer */}
    <div
        id='kt_finance'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='expense_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_expense_form_toggle'
        data-kt-drawer-close='#kt_expense_form_close'
      >
       <ExpenseForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_feeconfirmation'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='feeconfirmation_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_feeconfirmation_form_toggle'
        data-kt-drawer-close='#kt_feeconfirmation_form_close'
      >
       <FeeConfirmationForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_proformaInvoice'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='proformaInvoice_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_proformaInvoice_form_toggle'
        data-kt-drawer-close='#kt_proformaInvoice_form_close'
      >
       <ProformaInvoiceForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_Invoice'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='Invoice_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_Invoice_form_toggle'
        data-kt-drawer-close='#kt_Invoice_form_close'
      >
       <InvoiceForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_Collections'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='Collections_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_Collections_form_toggle'
        data-kt-drawer-close='#kt_Collections_form_close'
      >
       <CollectionForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_Incentives'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='Incentives_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_Incentives_form_toggle'
        data-kt-drawer-close='#kt_Incentive_form_close'
      >
       <IncentiveForm transId={tId} dropdowns={dropdowns}/>
    </div>
    <div
        id='kt_finance_Cashback'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='Cashback_form'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_cashback_form_toggle'
        data-kt-drawer-close='#kt_cashback_form_close'
      >
       <CashbackForm transId={tId} dropdowns={dropdowns}/>
    </div>
    
  </div>
  )
}

export {FinanceDrawer}
// export default AddContact