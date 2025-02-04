import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_URL


export const GET_NOTIFICATION_URL = `${API_URL}/get_notification`
export const UPDATE_NOTIFICATION_URL = `${API_URL}/put_notification`
export const ATTENDANCE_CHECKIN_URL = `${API_URL}/get_attendance_checkin`


export function getNotifications(id:any) {
    return axios.get(GET_NOTIFICATION_URL+'/'+id)
    .then((response => response.data))
  }

  // update contact
export function updateNotifications(id:any) {
    return axios.put(UPDATE_NOTIFICATION_URL+'/'+id)
    .then((response => response.data))
  }
  // update contact
export function attendanceCheckin(id:any, role:any) {
    return axios.get(ATTENDANCE_CHECKIN_URL+'/'+id+'/'+role+'/'+id)
    .then((response => response.data))
  }


  export const GET_LANGUAGE_SESSION_URL = `${API_URL}/get_language_session`

  export function getLanguagesSession(lang:any) {
    return axios.get(GET_LANGUAGE_SESSION_URL+'/'+lang)
    .then((response => response.data))
  }