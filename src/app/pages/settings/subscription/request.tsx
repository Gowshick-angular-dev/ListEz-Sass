import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

//Language
export const GET_SUBSCRIPTION_URL = `${API_URL}subscription/get/subscription`
export const SAVE_SUBSCRIPTION_URL = `${API_URL}subscription/save/subscription`
export const UPDATE_SUBSCRIPTION_URL = `${API_URL}subscription/update/subscription`
export const DELETE_SUBSCRIPTION_URL = `${API_URL}subscription/delete/subscription`
export const UPDATE_SUBSCRIPTION_STATUS_URL = `${API_URL}subscription/update_subscription_status/subscription`

export function getSubscriptions() {
    return axios.get(GET_SUBSCRIPTION_URL)
    .then((response => response.data))
}

export function saveSubscriptions(body:any) {
    return axios.post(SAVE_SUBSCRIPTION_URL, body)
    .then((response => response.data))
}

export function updateSubscriptions(id:any ,body:any) {
    return axios.put(UPDATE_SUBSCRIPTION_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteSubscriptions(id:any) {
    return axios.put(DELETE_SUBSCRIPTION_URL+'/'+id)
    .then((response => response.data))
}

export function updateSubscriptionStatus(id:any, body:any) {
    return axios.put(UPDATE_SUBSCRIPTION_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

//Translations
export const GET_CUSTOMER_SUBSCRIPTION_URL = `${API_URL}client_subscription/get/client_subscription`
export const SAVE_CUSTOMER_SUBSCRIPTION_URL = `${API_URL}client_subscription/save/client_subscription`
export const UPDATE_CUSTOMER_SUBSCRIPTION_URL = `${API_URL}client_subscription/update/client_subscription`
export const DELETE_CUSTOMER_SUBSCRIPTION_URL = `${API_URL}client_subscription/delete/client_subscription`
export const GET_CUSTOMER_SUBSCRIPTION_DROPDOWNS_URL = `${API_URL}dropdown/subscription_organization_dropdown`
export const GET_PAYMENT_DETAILS_URL = `${API_URL}client_subscription/get_razor_payment/client_subscription`
export const GET_BY_ORG_URL = `${API_URL}client_subscription/get_by_org/client_subscription`
export const GET_CLIENT_SUB_STATUS_UPDATE_URL = `${API_URL}client_subscription/update_client_subscription_Status/client_subscription`

export function getCustomerSubscriptions() {
    return axios.get(GET_CUSTOMER_SUBSCRIPTION_URL)
    .then((response => response.data))
}

export function saveCustomerSubscriptions(body:any) {
    return axios.post(SAVE_CUSTOMER_SUBSCRIPTION_URL, body)
    .then((response => response.data))
}

export function updateCustomerSubscriptions(id:any ,body:any) {
    return axios.put(UPDATE_CUSTOMER_SUBSCRIPTION_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteCustomerSubscriptions(id:any) {
    return axios.put(DELETE_CUSTOMER_SUBSCRIPTION_URL+'/'+id)
    .then((response => response.data))
}

export function updateCustomerSubscriptionStatus(id:any, body:any) {
    return axios.put(GET_CLIENT_SUB_STATUS_UPDATE_URL+'/'+id, body)
    .then((response => response.data))
}

export function getCustomerSubscriptionDropdown() {
    return axios.get(GET_CUSTOMER_SUBSCRIPTION_DROPDOWNS_URL)
    .then((response => response.data))
}


export function getPaymentDetails(key:any) {
    return axios.get(GET_PAYMENT_DETAILS_URL+'/'+key)
    .then((response => response.data))
}

export function getPaymentDetailsByOrg(key:any) {
    return axios.get(GET_BY_ORG_URL+'/'+key)
    .then((response => response.data))
}