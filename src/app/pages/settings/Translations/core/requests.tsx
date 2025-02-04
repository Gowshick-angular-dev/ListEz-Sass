import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

//Language
export const GET_LANGUAGE_URL = `${API_URL}orgLanguage/get/language`
export const SAVE_LANGUAGE_URL = `${API_URL}orgLanguage/save/language`
export const UPDATE_LANGUAGE_URL = `${API_URL}orgLanguage/update/language`
export const DELETE_LANGUAGE_URL = `${API_URL}orgLanguage/delete/language`

export function getLanguage() {
    return axios.get(GET_LANGUAGE_URL)
    .then((response => response.data))
}

export function saveLanguage(body:any) {
    return axios.post(SAVE_LANGUAGE_URL, body)
    .then((response => response.data))
}

export function updateLanguage(id:any ,body:any) {
    return axios.put(UPDATE_LANGUAGE_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteLanguage(id:any) {
    return axios.put(DELETE_LANGUAGE_URL+'/'+id)
    .then((response => response.data))
}

//Translations
export const GET_TRANSLATIONS_URL = `${API_URL}orgTranslations/get/translation`
export const SAVE_TRANSLATIONS_URL = `${API_URL}orgTranslations/save/translation`
export const UPDATE_TRANSLATIONS_URL = `${API_URL}orgTranslations/update/translation`
export const DELETE_TRANSLATIONS_URL = `${API_URL}orgTranslations/delete/translation`
export const GET_TRANSLATION_URL = `${API_URL}orgTranslations/translation_session/translation`

export function getTranslation() {
    return axios.get(GET_TRANSLATIONS_URL)
    .then((response => response.data))
}

export function getTranslationById(id:any) {
    return axios.get(GET_TRANSLATION_URL+'/'+id)
    .then((response => response.data))
}

export function saveTransaction(body:any) {
    return axios.post(SAVE_TRANSLATIONS_URL, body)
    .then((response => response.data))
}

export function updateTransaction(id:any ,body:any) {
    return axios.put(UPDATE_TRANSLATIONS_URL+'/'+id, body)
    .then((response => response.data))
}

export function deleteTransaction(id:any) {
    return axios.put(DELETE_TRANSLATIONS_URL+'/'+id)
    .then((response => response.data))
}