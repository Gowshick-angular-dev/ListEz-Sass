import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

// user api's
export const GET_ALL_ORGANIZATION_COMPANY_URL = `${API_URL}organization/get/organization`
export const GET_ORGANIZATION_COMPANY_URL = `${API_URL}organization/org_edit/organization`
export const GET_ORGANIZATION_ADMIN_URL = `${API_URL}organization/edit/organization`
export const SAVE_ORGANIZATION_COMPANY_URL = `${API_URL}organization/save/organization`
export const UPDATE_ORGANIZATION_ADMIN_URL = `${API_URL}organization/update/organization`
export const UPDATE_ORGANIZATION_COMPANY_URL = `${API_URL}organization/org_update/organization`
export const DELETE_ORGANIZATION_COMPANY_URL = `${API_URL}organization/delete/organization`
export const GET_ORGANIZATION_DROPDOWNS_URL = `${API_URL}organization/organization_dropdown/organization`
export const UPDATE_APPROVAL_URL = `${API_URL}organization/approval_update/organization`


export function getAllOrganozationCompany() {
    return axios.get(GET_ALL_ORGANIZATION_COMPANY_URL)
    .then((response => response.data))
}

export function getAllOrganozationCompanyLazy(limit:any) {
    return axios.get(GET_ALL_ORGANIZATION_COMPANY_URL+'?offset='+limit)
    .then((response => response.data))
}

export function getOrganozationCompany(id:any) {
    return axios.get(GET_ORGANIZATION_COMPANY_URL+'/'+id)
    .then((response => response.data))
}

export function getOrganozationAdmin(id:any) {
    return axios.get(GET_ORGANIZATION_ADMIN_URL+'/'+id)
    .then((response => response.data))
}

export function saveOrganozationCompany(body:any) {
    return axios.post(SAVE_ORGANIZATION_COMPANY_URL, body)
    .then((response => response.data))
}

export function updateOrganozationCompany(id:any ,body:any) {
    return axios.put(UPDATE_ORGANIZATION_ADMIN_URL+'/'+id, body)
    .then((response => response.data))
}

export function updateOrganozation(id:any ,body:any) {
    return axios.put(UPDATE_ORGANIZATION_COMPANY_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteOrganozationCompany(id:any) {
    return axios.put(DELETE_ORGANIZATION_COMPANY_URL+'/'+id)
    .then((response => response.data))
}

export function getOrgDropList() {
    return axios.get(GET_ORGANIZATION_DROPDOWNS_URL)
    .then((response => response.data))
}

export function updateApproval(id:any, approval:any) {
    return axios.put(UPDATE_APPROVAL_URL+'/'+id, {"approval": approval})
    .then((response => response.data))
}
