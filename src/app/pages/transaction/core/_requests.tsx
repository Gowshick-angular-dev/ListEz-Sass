import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL


export const GET_TRANSACTIONS_URL = `${API_URL}orgTransaction/get/transaction`
export const DELETE_TRANSACTION_URL = `${API_URL}orgTransaction/delete/transaction`
export const SAVE_TRANSACTIONS_URL = `${API_URL}orgTransaction/save/transaction`
export const EDIT_TRANSACTIONS_URL = `${API_URL}orgTransaction/edit/transaction`
export const PUT_TRANSACTIONS_URL = `${API_URL}orgTransaction/update/transaction`
export const UPDATE_TRANSACTION_STATUS_URL = `${API_URL}orgTransaction/update_transaction_status/transaction`
export const PUT_TRANSACTIONS_BROKERAGE_URL = `${API_URL}orgTransaction/update_brokerage_details/transaction`
export const PUT_TRANSACTIONS_INVOICE_URL = `${API_URL}orgTransaction/update_invoicing_details/transaction`
export const GET_TRANSACTION_DROPDOWN_URL = `${API_URL}orgDropdown/transaction_dropdown`
export const GET_LOGS_URL = `${API_URL}orgLogs/get/logs`
export const SAVE_LEAD_NOTES = `${API_URL}orgNotes/save/notes`
export const GET_LEAD_NOTES = `${API_URL}orgNotes/get/notes`
export const UPDATE_LEAD_NOTES_URL = `${API_URL}orgNotes/update/notes`
export const DELETE_LEAD_NOTES_URL = `${API_URL}orgNotes/delete/notes`
export const UPLOAD_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/save/files`
export const GET_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/get/files`
export const DELETE_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/delete/files`
export const SAVE_TRANSACTION_FILTER_URL = `${API_URL}orgTransaction/save_filter/transaction`
export const GET_FILTER_LIST_URL = `${API_URL}orgTransaction/get_filter/transactions`
export const DELETE_FILTER_URL = `${API_URL}orgTransaction/delete_filter/transactions`



export function getTrnsactions(body:any) {
    return axios.get(GET_TRANSACTIONS_URL+'?booking_from_date='+body.booking_from_date+'&booking_to_date='+body.booking_to_date+'&city='+body.city+'&source='+body.source+'&team_leader='+body.team_leader+'&shared_with='+body.shared_with+'&closed_by='+body.closed_by+'&developer_name='+body.developer_name+'&project_id='+body.project_id+'&bhk_type_min='+body.bhk_type_min+'&bhk_type_max='+body.bhk_type_max+'&agreement_value_min='+body.agreement_value_min+'&agreement_value_max='+body.agreement_value_max+'&brokerage_min='+body.brokerage_min+'&brokerage_max='+body.brokerage_max+'&brokerage_value_min='+body.brokerage_value_min+'&brokerage_value_max='+body.brokerage_value_max+'&discount_min='+body.discount_min+'&discount_max='+body.discount_max+'&discount_value_min='+body.discount_value_min+'&discount_value_max='+body.discount_value_max+'&revenue_min='+body.revenue_min+'&revenue_max='+body.revenue_max+'&transaction_status='+body.status+'&created_by='+body.created_by+'&limit='+body.limit+'&order_by='+body.sortby)
    .then((response => response.data))
}

export function getTrnsaction(id:any) {
    return axios.get(EDIT_TRANSACTIONS_URL+'/'+id)
    .then((response => response.data))
}

export function deleteTrnsaction(Id:any) {
    return axios.put(DELETE_TRANSACTION_URL+'/'+Id)
    .then((response => response.data))
}

export function updateTransactionStatus(Id:any, body:any) {
    return axios.put(UPDATE_TRANSACTION_STATUS_URL+'/'+Id, body)
    .then((response => response.data))
}

export function saveTransactionFilter(postData:any) {
    return axios.post(SAVE_TRANSACTION_FILTER_URL, postData)
    .then((response => response.data))
}

export function saveTrnsactions(postData:any) {
    return axios.post(SAVE_TRANSACTIONS_URL, postData)
    .then((response => response.data))
}

export function updateTrnsactions(Id:any ,body:any) {
    return axios.put(PUT_TRANSACTIONS_URL+'/'+Id, body)
    .then((response => response.data))
}

export function updateTrnsactionsBD(Id:any ,body:any) {
    return axios.put(PUT_TRANSACTIONS_BROKERAGE_URL+'/'+Id, body)
    .then((response => response.data))
}

export function getTransactionDropdowns() {
    return axios.get(GET_TRANSACTION_DROPDOWN_URL)
    .then((response => response.data))
}

export function getLog(Id:number) {
    return axios.get(GET_LOGS_URL+'/'+Id+'/5')
    .then((response => response.data))
}

export function saveTransactionNotes(body:any) {
    return axios.post(SAVE_LEAD_NOTES,body)
    .then((response => response.data))
}

export function getTransactionNotes(Id:number) {
    return axios.get(GET_LEAD_NOTES+'/'+Id+'/5')
    .then((response => response.data))
} 

export function updateTransactionNotes(Id:any, body:any) {
    return axios.put(UPDATE_LEAD_NOTES_URL+'/'+Id, body)
    .then((response => response.data))
}

export function deleteTransactionNotes(noteId:any, parentId:any, id:any) {
    return axios.put(DELETE_LEAD_NOTES_URL+'/'+noteId+'/'+parentId, {"module_id": id, "module_name": 5})
    .then((response => response.data))
}

export function uploadMultipleFileTransaction(id:any ,postData:any) {
    return axios.post(UPLOAD_MULITI_IMAGES_LEAD_URL+'/'+id, postData)
    .then((response => response.data))
}

export function getMultiImageTransaction(Id:number) {
    return axios.get(GET_MULITI_IMAGES_LEAD_URL+'/'+Id+'/'+5)
    .then((response => response.data))
}

export function getTransactionFilters() {
    return axios.get(GET_FILTER_LIST_URL)
    .then((response => response.data))
}

export function deleteMultipleImagesTransaction(fileId:any, leadId:any) {
    return axios.put(DELETE_MULITI_IMAGES_LEAD_URL+'/'+fileId, {"module_id": leadId, "module_name": 5})
    .then((response => response.data))
}

export function updateTrnsactionsID(Id:any ,body:any) {
    return axios.put(PUT_TRANSACTIONS_INVOICE_URL+'/'+Id, body)
    .then((response => response.data))
}

export function deleteFilter(Id:any) {
    return axios.put(DELETE_FILTER_URL+'/'+Id)
    .then((response => response.data))
}








export const GET_TRANSACTION_URL = `${API_URL}/get_transaction`
export const GET_USERS_ALL_URL = `${API_URL}/get_users_all`
export const GET_COMPANU_NAME_URL = `${API_URL}/get_properties_companyname`
export const GET_PROJECT_NAME_URL = `${API_URL}/get_properties_projectname`
export const USER_TRANSACTION_DD_URL = `${API_URL}/get_users_reassign_dropdown`

// getTrnsactions fetch api
export function getTrnsactionTLDrop(id:any, role:any) {
    return axios.get(USER_TRANSACTION_DD_URL+'/'+id+'/'+role+'/'+id)
    .then((response => response.data))
}




// getAllUsers fetch api
export function getAllUsers() {
    return axios.get(GET_USERS_ALL_URL)
    .then((response => response.data))
}

// getAllUsers fetch api
export function getCompanyName() {
    return axios.get(GET_COMPANU_NAME_URL)
    .then((response => response.data))
}

// getAllUsers fetch api
export function getProjectName() {
    return axios.get(GET_PROJECT_NAME_URL)
    .then((response => response.data))
}