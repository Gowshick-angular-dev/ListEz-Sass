import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const EXPENSE_DROPDOWNS_URL = `${API_URL}orgDropdown/finance_dropdown`


export const SAVE_EXPENSE_URL = `${API_URL}orgExpenses/save/expenses`
export const GET_EXPENSE_URL = `${API_URL}orgExpenses/get/expenses`
export const GET_EXPENSE_ID_URL = `${API_URL}orgExpenses/edit/expenses`
export const GET_EXPENSE_TRANSACTION_ID_URL = `${API_URL}/get_expense_transaction_id`
export const UPDATE_EXPENSE_URL = `${API_URL}orgExpenses/update/expenses`
export const UPDATE_EXPENSE_DETAILS_URL = `${API_URL}orgExpenses/update_expense_details/expenses`
export const DELETE_EXPENSE_URL = `${API_URL}orgExpenses/delete/expenses`

export const GET_FEE_CONFIRMATION_LIST_URL = `${API_URL}orgFinance/get_fee_confirmation`
export const GET_FEE_CONFIRMATION_TRANSACTION_URL = `${API_URL}/get_fee_confirmation_transaction_id`
export const GET_FEE_CONFIRMATION_URL = `${API_URL}orgFinance/edit_fee_confirmation`
export const SAVE_FEE_CONFIRMATION_LIST_URL = `${API_URL}orgFinance/save_fee_confirmation`
export const UPDATE_FEE_CONFIRMATION_LIST_URL = `${API_URL}orgFinance/update_fee_confirmation`
export const UPDATE_FEE_CONFIRMATION_STATUS_URL = `${API_URL}/put_fee_confirmation_status`
export const DELETE_FEE_CONFIRMATION_URL = `${API_URL}orgFinance/delete_fee_confirmation`

export const GET_ALL_PROINVOICES_URL = `${API_URL}orgFinance/get_pro_invoice`
export const GET_PROINVOICE_URL = `${API_URL}orgFinance/edit_pro_invoice`
export const SAVE_PROINVOICE_URL = `${API_URL}orgFinance/save_pro_invoice`
export const UPDATE_PROINVOICE_URL = `${API_URL}orgFinance/update_pro_invoice`
export const GET_PROINVOICE_BY_CONTACT_URL = `${API_URL}/get_finance_pro_invoice_contact_id`
export const GET_PROINVOICE_BY_TRANSACTION_URL = `${API_URL}/get_finance_pro_invoice_transaction_id`
export const DELETE_PROINVOICE_URL = `${API_URL}orgFinance/delete_pro_invoice`

export const GET_ALL_INVOICE_URL = `${API_URL}orgFinance/get_invoice`
export const GET_INVOICE_BY_ID_URL = `${API_URL}orgFinance/edit_invoice`
export const SAVE_INVOICE_URL = `${API_URL}orgFinance/save_invoice`
export const UPDATE_INVOICE_URL = `${API_URL}orgFinance/update_invoice`
export const DELETE_INVOICE_URL = `${API_URL}orgFinance/delete_invoice`
export const GET_INVOICE_BY_TRANSACTION_URL = `${API_URL}/get_finance_invoice_transaction_id`
export const UPDATE_INVOICE_STATUS_URL = `${API_URL}/put_finance_invoice_statuss`

export const GET_ALL_COLLECTION_URL = `${API_URL}orgFinance/get_invoice_collection`
export const GET_COLLECTION_BY_ID_URL = `${API_URL}orgFinance/edit_invoice_collection`
export const SAVE_COLLECTION_URL = `${API_URL}orgFinance/save_invoice_collection`
export const UPDATE_COLLECTION_URL = `${API_URL}orgFinance/update_invoice_collection`
export const DELETE_COLLECTION_URL = `${API_URL}orgFinance/delete_invoice_collection`
export const GET_COLLECTION_BY_INVOICE_ID_URL = `${API_URL}/get_finance_invoice_collectionbyinvoiceid`
export const GET_COLLECTION_BY_TRANSACTION_ID_URL = `${API_URL}/get_finance_invoice_collectionbytransactionid`
export const UPDATE_COLLECTION_PAYMENT_STATUS_URL = `${API_URL}/put_finance_invoice_collection_paymentStatus`

export const GET_INCENTIVE_URL = `${API_URL}orgFinance/get/finance`
export const GET_INCENTIVE_BY_ID_URL = `${API_URL}orgFinance/edit/finance`
export const SAVE_INCENTIVE_URL = `${API_URL}orgFinance/save/finance`
export const UPDATE_INCENTIVE_URL = `${API_URL}orgFinance/update/finance`
export const DELETE_INCENTIVE_URL = `${API_URL}orgFinance/delete/finance`

export const GET_CASHBACK_URL = `${API_URL}orgFinance/get_cashback`
export const GET_CASHBACK_BY_ID_URL = `${API_URL}orgFinance/edit_cashback`
export const SAVE_CASHBACK_URL = `${API_URL}orgFinance/save_cashback`
export const UPDATE_CASHBACK_URL = `${API_URL}orgFinance/update_cashback`
export const DELETE_CASHBACK_URL = `${API_URL}orgFinance/delete_cashback`



// getCashback fetch api
export function getFinanceDropdowns() {
    return axios.get(EXPENSE_DROPDOWNS_URL)
    .then((response => response.data))
}




// getCashback fetch api
export function getCashback() {
    return axios.get(GET_CASHBACK_URL)
    .then((response => response.data))
}
// getCashBackById fetch api
export function getCashBackById(id:any) {
    return axios.get(GET_CASHBACK_BY_ID_URL+'/'+id)
    .then((response => response.data))
}
// saveCashback fetch api
export function saveCashback(data:any) {
    return axios.post(SAVE_CASHBACK_URL, data)
    .then((response => response.data))
}
// updateCashback fetch api
export function updateCashback(id:any, data:any) {
    return axios.put(UPDATE_CASHBACK_URL+'/'+id, data)
    .then((response => response.data))
}
// deleteCashback fetch api
export function deleteCashback(id:any) {
    return axios.put(DELETE_CASHBACK_URL+'/'+id)
    .then((response => response.data))
}


// getIncentives fetch api
export function getIncentives() {
    return axios.get(GET_INCENTIVE_URL)
    .then((response => response.data))
}
// getIncentiveById fetch api
export function getIncentiveById(id:any) {
    return axios.get(GET_INCENTIVE_BY_ID_URL+'/'+id)
    .then((response => response.data))
}
// saveIncentive fetch api
export function saveIncentive(data:any) {
    return axios.post(SAVE_INCENTIVE_URL, data)
    .then((response => response.data))
}
// updateIncentive fetch api
export function updateIncentive(id:any, data:any) {
    return axios.put(UPDATE_INCENTIVE_URL+'/'+id, data)
    .then((response => response.data))
}
// deleteIncenive fetch api
export function deleteIncenive(id:any) {
    return axios.put(DELETE_INCENTIVE_URL+'/'+id)
    .then((response => response.data))
}


// getCollection fetch api
export function getCollections() {
    return axios.get(GET_ALL_COLLECTION_URL)
    .then((response => response.data))
}
// getCollectionByTransactionId fetch api
export function getCollectionByTransactionId(id:any) {
    return axios.get(GET_COLLECTION_BY_TRANSACTION_ID_URL+'/'+id)
    .then((response => response.data))
}
// getCollectionByInvoiceId fetch api
export function getCollectionByInvoiceId(id:any) {
    return axios.get(GET_COLLECTION_BY_INVOICE_ID_URL+'/'+id)
    .then((response => response.data))
}
// getCollectionById fetch api
export function getCollectionById(id:any) {
    return axios.get(GET_COLLECTION_BY_ID_URL+'/'+id)
    .then((response => response.data))
}
// saveCollection fetch api
export function saveCollection(data:any) {
    return axios.post(SAVE_COLLECTION_URL, data)
    .then((response => response.data))
}
// updateCollection fetch api
export function updateCollection(id:any, data:any) {
    return axios.put(UPDATE_COLLECTION_URL+'/'+id, data)
    .then((response => response.data))
}
// updateCollectionPaymentStatus fetch api
export function updateCollectionPaymentStatus(id:any, data:any) {
    return axios.put(UPDATE_COLLECTION_PAYMENT_STATUS_URL+'/'+id, data)
    .then((response => response.data))
}
// deleteCollection fetch api
export function deleteCollection(id:any) {
    return axios.put(DELETE_COLLECTION_URL+'/'+id)
    .then((response => response.data))
}


// getInvoice fetch api
export function getInvoice() {
    return axios.get(GET_ALL_INVOICE_URL)
    .then((response => response.data))
}
// getInvoiceById fetch api
export function getInvoiceById(id:any) {
    return axios.get(GET_INVOICE_BY_ID_URL+'/'+id)  
    .then((response => response.data))
}
// getInvoiceByTransactionId fetch api
export function getInvoiceByTransactionId(id:any) {
    return axios.get(GET_INVOICE_BY_TRANSACTION_URL+'/'+id)
    .then((response => response.data))
}
// saveInvoice fetch api
export function saveInvoice(data:any) {
    return axios.post(SAVE_INVOICE_URL, data)
    .then((response => response.data))
}
// updateInvoice fetch api
export function updateInvoice(id:any, data:any) {
    return axios.put(UPDATE_INVOICE_URL+'/'+id, data)
    .then((response => response.data))
}
// deleteInvoice fetch api
export function deleteInvoice(id:any) {
    return axios.put(DELETE_INVOICE_URL+'/'+id)
    .then((response => response.data))
}
// updateInvoiceStatus fetch api
export function updateInvoiceStatus(id:any, data:any) {
    return axios.put(UPDATE_INVOICE_STATUS_URL+'/'+id, data)
    .then((response => response.data))
}
// getProformaInvoice fetch api
export function getProformaInvoice() {
    return axios.get(GET_ALL_PROINVOICES_URL)
    .then((response => response.data))
}
// getProformaInvoice fetch api
export function getProformaInvoiceById(id:any) {
    return axios.get(GET_PROINVOICE_URL+'/'+id)
    .then((response => response.data))
}
// saveProformaInvoice fetch api
export function saveProformaInvoice(postData:any) {
    return axios.post(SAVE_PROINVOICE_URL, postData)
    .then((response => response.data))
}
// updateProformaInvoice fetch api
export function updateProformaInvoice(id:any, postData:any) {
    return axios.put(UPDATE_PROINVOICE_URL+'/'+id, postData)
    .then((response => response.data))
}
// getProformaInvoiceByContact fetch api
export function getProformaInvoiceByContact(id:any) {
    return axios.get(GET_PROINVOICE_BY_CONTACT_URL+'/'+id)
    .then((response => response.data))
}
// getProformaInvoiceByTransaction fetch api
export function getProformaInvoiceByTransaction(id:any) {
    return axios.post(GET_PROINVOICE_BY_TRANSACTION_URL+'/'+id)
    .then((response => response.data))
}
// deleteProinvoice fetch api
export function deleteProinvoice(id:any) {
    return axios.put(DELETE_PROINVOICE_URL+'/'+id)
    .then((response => response.data))
}
// saveExpenses fetch api
export function saveExpenses(postData:any) {
    return axios.post(SAVE_EXPENSE_URL, postData)
    .then((response => response.data))
}

// getExpenses fetch api
export function getExpenses() {
    return axios.get(GET_EXPENSE_URL)
    .then((response => response.data))
}

// getExpense fetch api
export function getExpense(id:any) {
    return axios.get(GET_EXPENSE_ID_URL+'/'+id)
    .then((response => response.data))
}

// getExpenseTransaction fetch api
export function getExpenseTransaction(id:any) {
    return axios.get(GET_EXPENSE_TRANSACTION_ID_URL+'/'+id)
    .then((response => response.data))
}

// updateExpense fetch api
export function updateExpense(id:any, postData:any) {
    return axios.put(UPDATE_EXPENSE_URL+'/'+id, postData)
    .then((response => response.data))
}

// updateExpensesDetails fetch api
export function updateExpensesDetails(id:any, postData:any) {
    return axios.put(UPDATE_EXPENSE_DETAILS_URL+'/'+id, postData)
    .then((response => response.data))
}

// updateExpensesDetails fetch api
export function deleteExpense(id:any) {
    return axios.put(DELETE_EXPENSE_URL+'/'+id)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function getFeeConfirmations() {
    return axios.get(GET_FEE_CONFIRMATION_LIST_URL)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function getFeeConfirmationTransaction(id:any) {
    return axios.get(GET_FEE_CONFIRMATION_TRANSACTION_URL+'/'+id)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function getFeeConfirmation(id:any) {
    return axios.get(GET_FEE_CONFIRMATION_URL+'/'+id)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function saveFeeConfirmation(body:any) {
    return axios.post(SAVE_FEE_CONFIRMATION_LIST_URL, body)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function updateFeeConfirmation(id:any, body:any) {
    return axios.put(UPDATE_FEE_CONFIRMATION_LIST_URL+'/'+id, body)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function updateFeeConfirmationStatus(id:any, body:any) {
    return axios.put(UPDATE_FEE_CONFIRMATION_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// getFeeConfirmation fetch api
export function deleteFeeConfirmation(feeId:any) {
    return axios.put(DELETE_FEE_CONFIRMATION_URL+'/'+feeId)
    .then((response => response.data))
}