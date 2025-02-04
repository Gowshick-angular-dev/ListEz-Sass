import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${BASE_URL}auth/login_org_auth/user`
export const LOGOUT_URL = `${BASE_URL}user_timeline/logout/user_timeline`
export const LOGOUT_URL_ORG = `${BASE_URL}logoutTimeline/org_logout`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/reset_password`
export const ADMIN_LOGIN_URL = `${BASE_URL}auth/login/users`



export const RESET_PASSWORD_URL = `${API_URL}/reset_password_update`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,    
  })
}

export function adminLogin(email: string, password:any) {
  return axios.post<AuthModel>(ADMIN_LOGIN_URL, {
    email,
    password,    
  })
}

export function logoutAPI(token: any) {
  return axios.put(LOGOUT_URL,{}, {headers: { Authorization: `${token}` }})
}

export function logoutORG(token: any) {
  return axios.put(LOGOUT_URL_ORG,{}, {headers: { Authorization: `${token}` }})
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    "email": email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}

export function resetPassword(token: string, body:any) {
  return axios.post(RESET_PASSWORD_URL, {
    npw: body,
  }, {headers: { Authorization: `Bearer ${token}` }})
}

