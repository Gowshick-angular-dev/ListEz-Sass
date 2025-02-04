import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const UPDATE_THEME_SETTINGS_URL = `${API_URL}orgBs/update`
export const GET_THEME_SETTINGS_URL = `${API_URL}orgBs/get`


export function updateOrganizationTheme(body:any) {
    return axios.put(UPDATE_THEME_SETTINGS_URL, body)
    .then((response => response))
}

export function getOrganizationTheme() {
    return axios.get(GET_THEME_SETTINGS_URL)
    .then((response => response.data))
}