import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const GET_BUSINESS_SETTINGS_URL = `${API_URL}business_settings/get/business_settings`
export const UPDATE_BUSINESS_SETTINGS_URL = `${API_URL}business_settings/update/business_settings`

export function getBusinessSettings() {
    return axios.get(GET_BUSINESS_SETTINGS_URL)
    .then((response => response.data))
}

export function updateBusinessSettings(body:any) {
    return axios.put(UPDATE_BUSINESS_SETTINGS_URL, body)
    .then((response => response.data))
}