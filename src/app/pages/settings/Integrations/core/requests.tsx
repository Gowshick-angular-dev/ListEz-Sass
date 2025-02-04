import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_SETTINGS_URL = `${API_URL}/get_settings`
export const GET_SAVE_SETTINGS_URL = `${API_URL}/save_settings`
export const GET_UPDATE_SETTINGS_URL = `${API_URL}/put_settings`

export function getSettings(val:any) {
    return axios.get(GET_SETTINGS_URL+'/'+val)
    .then((response => response.data))
}

export function saveSettings(body:any) {
    return axios.post(GET_SAVE_SETTINGS_URL, body)
    .then((response => response.data))
}

export function updateSettings(id:any ,body:any) {
    return axios.put(GET_UPDATE_SETTINGS_URL+'/'+id, body)
    .then((response => response.data))
}