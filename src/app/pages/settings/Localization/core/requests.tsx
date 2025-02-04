import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

//City
export const GET_CITY_URL = `${API_URL}orgCity/get`
export const SAVE_CITY_URL = `${API_URL}orgCity/save`
export const UPDATE_CITY_URL = `${API_URL}orgCity/update`
export const DELETE_CITY_URL = `${API_URL}orgCity/delete`

export function getLocalizationCity() {
    return axios.get(GET_CITY_URL)
    .then((response => response.data))
}

export function saveLocalizationCity(body:any) {
    return axios.post(SAVE_CITY_URL, body)
    .then((response => response.data))
}

export function updateLocalizationCity(id:any ,body:any) {
    return axios.put(UPDATE_CITY_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLocalizationCity(id:any) {
    return axios.put(DELETE_CITY_URL+'/'+id)
    .then((response => response.data))
}

//State
export const GET_STATE_URL = `${API_URL}orgState/get`
export const SAVE_STATE_URL = `${API_URL}orgState/save`
export const UPDATE_STATE_URL = `${API_URL}orgState/update`
export const DELETE_STATE_URL = `${API_URL}orgState/delete`

export function getLocalizationState() {
    return axios.get(GET_STATE_URL)
    .then((response => response.data))
}

export function saveLocalizationState(body:any) {
    return axios.post(SAVE_STATE_URL, body)
    .then((response => response.data))
}

export function updateLocalizationState(id:any ,body:any) {
    return axios.put(UPDATE_STATE_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLocalizationState(id:any) {
    return axios.put(DELETE_STATE_URL+'/'+id)
    .then((response => response.data))
}

//Country
export const GET_COUNTRY_URL = `${API_URL}orgCountry/get`
export const SAVE_COUNTRY_URL = `${API_URL}orgCountry/save`
export const UPDATE_COUNTRY_URL = `${API_URL}orgCountry/update`
export const DELETE_COUNTRY_URL = `${API_URL}orgCountry/delete`

export function getLocalizationCountry() {
    return axios.get(GET_COUNTRY_URL)
    .then((response => response.data))
}

export function saveLocalizationCountry(body:any) {
    return axios.post(SAVE_COUNTRY_URL, body)
    .then((response => response.data))
}

export function updateLocalizationCountry(id:any ,body:any) {
    return axios.put(UPDATE_COUNTRY_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLocalizationCountry(id:any) {
    return axios.put(DELETE_COUNTRY_URL+'/'+id)
    .then((response => response.data))
}

//Currency
export const GET_CURRENCY_URL = `${API_URL}orgCurrency/get`
export const SAVE_CURRENCY_URL = `${API_URL}orgCurrency/save`
export const UPDATE_CURRENCY_URL = `${API_URL}orgCurrency/update`
export const DELETE_CURRENCY_URL = `${API_URL}orgCurrency/delete`

export function getLocalizationCurrency() {
    return axios.get(GET_CURRENCY_URL)
    .then((response => response.data))
}

export function saveLocalizationCurrency(body:any) {
    return axios.post(SAVE_CURRENCY_URL, body)
    .then((response => response.data))
}

export function updateLocalizationCurrency(id:any ,body:any) {
    return axios.put(UPDATE_CURRENCY_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLocalizationCurrency(id:any) {
    return axios.put(DELETE_CURRENCY_URL+'/'+id)
    .then((response => response.data))
}


// Locality
export const GET_LOCALITY_URL = `${API_URL}orgLocality/get`
export const SAVE_LOCALITY_URL = `${API_URL}orgLocality/save`
export const UPDATE_LOCALITY_URL = `${API_URL}orgLocality/update`
export const DELETE_LOCALITY_URL = `${API_URL}orgLocality/delete`

export function getLocality() {
    return axios.get(GET_LOCALITY_URL)
    .then((response => response.data))
}

export function saveLocality(body:any) {
    return axios.post(SAVE_LOCALITY_URL, body)
    .then((response => response.data))
}

export function updateLocality(id:any ,body:any) {
    return axios.put(UPDATE_LOCALITY_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLocality(id:any) {
    return axios.put(DELETE_LOCALITY_URL+'/'+id)
    .then((response => response.data))
}