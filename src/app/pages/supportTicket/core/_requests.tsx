import axios from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const GET_SUPPORT_TICKET_LIST_URL = `${API_URL}support_ticket/get/support_ticket`

export function getTicketList() {
    return axios.get(GET_SUPPORT_TICKET_LIST_URL)
    .then((response => response.data))
}