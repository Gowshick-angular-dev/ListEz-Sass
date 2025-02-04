import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const CHANGE_PASSWORD_URL = `${API_URL}auth/change_password/users`
export const CHANGE_ORG_PASSWORD_URL = `${API_URL}auth/change_org_password/users`
export const UPDATE_PROFILE_URL = `${API_URL}OrgUser/update_profile/user`

// update Password
export function updateContact(postData:any) {
  return axios.put(CHANGE_PASSWORD_URL, postData)
  .then((response => response.data))
}
// update Password
export function updateORGContact(postData:any) {
  return axios.put(CHANGE_ORG_PASSWORD_URL, postData)
  .then((response => response.data))
}

// update Profile
export function updateProfile(postData:any, id:any) {
  return axios.put(UPDATE_PROFILE_URL+'/'+id, postData)
  .then((response => response.data))
}