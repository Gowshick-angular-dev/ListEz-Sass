import React,{FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { TransactionDetails } from './transactionDetails';
import { TransactionForm } from './transactionForm';
import { TransactionFilter } from './transactionFilter';

type Props = {
  body?: any,
  setBody?: any,
  setTransactions?: any,
  setTransactionsCount?: any,
  
}

const TransactionDrawer: FC<Props> = (props) => {
  const {
    body, setBody, setTransactions, setTransactionsCount
  } = props

  return(
  <div>

    {/* Add Contact Drawer */}
    <div
        id='kt_transaction_module'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='transaction_module'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_transaction_add_toggle'
        data-kt-drawer-close='#kt_transaction_close'
      >
        <TransactionForm />
    </div>

    <div
        id='kt_transaction_filter'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='transaction_module_filter'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_transaction_filter_toggle'
        data-kt-drawer-close='#kt_transaction_filter_close'
      >
        <TransactionFilter body={body} setBody={setBody} setTransactions={setTransactions} setTransactionsCount={setTransactionsCount} />
    </div>
    
  </div>
  )
}

export {TransactionDrawer}
// export default AddContact