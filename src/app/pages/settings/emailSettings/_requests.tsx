import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const UPDATE_TRIGGER_SETTINGS_URL = `${API_URL}emailTrigger/update`
export const GET_TRIGGER_SETTINGS_URL = `${API_URL}emailTrigger/list`

export function updateEmailSwitchSettings(val:any, status:any) {
    return axios.put(UPDATE_TRIGGER_SETTINGS_URL+'/'+val, {"status": status})
    .then((response => response.data))
}

export function getEmailSwitchSettings() {
    return axios.get(GET_TRIGGER_SETTINGS_URL)
    .then((response => response.data))
}