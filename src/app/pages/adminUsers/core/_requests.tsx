import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const GET_ADMIN_USERS_URL = `${API_URL}users/get/users`

export function getAdminUsers() {
    return axios.get(GET_ADMIN_USERS_URL)
    .then((response => response.data))
}