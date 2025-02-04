import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL   

// Source

export const SAVE_CONTACT_SETTING_URL = `${API_URL}orgContactSettings/save_contact_settings`
export const GET_CONTACT_SETTING_URL = `${API_URL}orgContactSettings/get_contact_settings`
export const PUT_CONTACT_SETTING_URL = `${API_URL}orgContactSettings/update_contact_settings`
export const GET_CONTACT_SETTING_BYID_URL = `${API_URL}orgContactSettings/edit_contact_settings`
export const DELETE_CONTACT_SETTING_URL = `${API_URL}orgContactSettings/delete_contact_settings`
export const GET_CONTACT_SETTING_DROPDOWNS_URL = `${API_URL}orgDropdown/contact_settings_dropdown`

export function saveContactSetting(obj:any) {
    return axios.post(SAVE_CONTACT_SETTING_URL,obj)
    .then((response => response.data))
}

export function getContactSetting() {
    return axios.get(GET_CONTACT_SETTING_URL)
    .then((response => response.data))
}

export function getContactSettingById(id:any) {
    return axios.get(GET_CONTACT_SETTING_BYID_URL+'/'+id)
    .then((response => response.data))
}

export function updateContactSetting(Id:any, postData:any) {
    return axios.put(PUT_CONTACT_SETTING_URL+'/'+Id, postData)
    .then((response => response.data))
}

export function getDeleteContactSetting(deleteid:any) {
    return axios.put(DELETE_CONTACT_SETTING_URL+'/'+deleteid)
    .then((response => response.data))
}

export function getContactSettingDropdowns() {
    return axios.get(GET_CONTACT_SETTING_DROPDOWNS_URL)
    .then((response => response.data))
}