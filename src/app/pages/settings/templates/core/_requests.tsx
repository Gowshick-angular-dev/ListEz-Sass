import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL


export const SAVE_TEMPLATE_MAIL_URL = `${API_URL}orgEmailTemplate/save/emailTemplate`
export const PUT_TEMPLATE_MAIL_URL = `${API_URL}orgEmailTemplate/update/emailTemplate`
export const GET_ALL_TENPLATES_MAIL_URL = `${API_URL}orgEmailTemplate/get/emailTemplate`
export const GET_TEMPLATE_MAIL_URL = `${API_URL}orgEmailTemplate/edit/emailTemplate`
export const DELETE_TEMPLATE_MAIL_URL = `${API_URL}orgEmailTemplate/delete/emailTemplate`
export const GET_ALL_TEMPLATE_WATSAPP_URL = `${API_URL}orgWhatsappTemplate/get`
export const SAVE_TEMPLATE_WATSAPP_URL = `${API_URL}orgWhatsappTemplate/save`
export const PUT_TEMPLATE_WATSAPP_URL = `${API_URL}orgWhatsappTemplate/update`
export const DELETE_TEMPLATE_WATSAPP_URL = `${API_URL}orgWhatsappTemplate/delete`



export function saveTemplateMail(body:any) {
    return axios.post(SAVE_TEMPLATE_MAIL_URL, body)
    .then((response => response.data))
}

export function updateTemplateMail(id:any ,body:any) {
    return axios.put(PUT_TEMPLATE_MAIL_URL+'/'+id, body)
    .then((response => response.data))
}

export function getAllTemplatesMail() {
    return axios.get(GET_ALL_TENPLATES_MAIL_URL)
    .then((response => response.data))
}

export function getTemplateMail(id:any) {
    return axios.get(GET_TEMPLATE_MAIL_URL+'/'+id)
    .then((response => response.data))
}

export function deleteTemplateMail(id:any) {
    return axios.put(DELETE_TEMPLATE_MAIL_URL+'/'+id)
    .then((response => response.data))
}

export function getAllTemplatesWatsapp() {
    return axios.get(GET_ALL_TEMPLATE_WATSAPP_URL)
    .then((response => response.data))
}

export function saveTemplateWatsapp(body:any) {
    return axios.post(SAVE_TEMPLATE_WATSAPP_URL, body)
    .then((response => response.data))
}

export function updateTemplateWatsapp(id:any ,body:any) {
    return axios.put(PUT_TEMPLATE_WATSAPP_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteTemplateWatsapp(id:any) {
    return axios.put(DELETE_TEMPLATE_WATSAPP_URL+'/'+id)
    .then((response => response.data))
}



// user api's
export const GET_ALL_TEMPLATES_SMS_URL = `${API_URL}/get_all_template_sms`
export const GET_TEMPLATE_SMS_URL = `${API_URL}/get_template_sms`
export const SAVE_TEMPLATE_SMS_URL = `${API_URL}/save_template_sms`
export const PUT_TEMPLATE_SMS_URL = `${API_URL}/put_template_sms`
export const DELETE_TEMPLATE_SMS_URL = `${API_URL}/delete_template_sms`
export const GET_TEMPLATE_WATSAPP_URL = `${API_URL}/get_template_whatsapp`








export function getAllTemplatesSMS() {
    return axios.get(GET_ALL_TEMPLATES_SMS_URL)
    .then((response => response.data))
}

export function getTemplateSMS(id:any) {
    return axios.get(GET_TEMPLATE_SMS_URL+'/'+id)
    .then((response => response.data))
}

export function saveTemplateSMS(body:any) {
    return axios.post(SAVE_TEMPLATE_SMS_URL, body)
    .then((response => response.data))
}

export function updateTemplateSMS(id:any ,body:any) {
    return axios.put(PUT_TEMPLATE_SMS_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteTemplateSMS(id:any) {
    return axios.put(DELETE_TEMPLATE_SMS_URL+'/'+id)
    .then((response => response.data))
}

export function getTemplateWatsapp(id:any) {
    return axios.get(GET_TEMPLATE_WATSAPP_URL+'/'+id)
    .then((response => response.data))
}