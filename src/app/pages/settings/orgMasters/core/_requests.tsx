import axios, {AxiosResponse}  from 'axios'
import {ID, Response} from '../../../../../_metronic/helpers'

const API_URL = process.env.REACT_APP_API_BASE_URL   

// Masters
export const GET_MASTERS_URL = `${API_URL}orgMasters/get/masters`
export const SAVE_MASTERS_URL = `${API_URL}orgMasters/save/masters`
export const UPDATE_MASTERS_URL = `${API_URL}orgMasters/update/masters`
export const DELETE_MASTERS_URL = `${API_URL}orgMasters/delete/masters`

export function getMasters(val:any) {
    return axios.get(GET_MASTERS_URL+'?option_type='+val)
    .then((response => response.data))
}

export function saveMasters(body:any) {
    return axios.post(SAVE_MASTERS_URL, body)
    .then((response => response.data))
}

export function updateMasters(id:any ,body:any) {
    return axios.put(UPDATE_MASTERS_URL+'/'+body.option_type+'/'+id, body)
    .then((response => response.data))
}

export function deleteMasters(id:any) {
    return axios.put(DELETE_MASTERS_URL+'/'+id)
    .then((response => response.data))
}