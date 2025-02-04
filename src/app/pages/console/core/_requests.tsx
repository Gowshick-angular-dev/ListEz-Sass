import axios, { AxiosResponse } from 'axios'
import { ID, Response } from '../../../../_metronic/helpers'

const API_URL = process.env.REACT_APP_API_BASE_URL

// Contact Summary
export const GET_CONTACT_PROPERTY_WISE = `${API_URL}get_contact_summary/1?filter_by=7`
export const GET_CONTACT_STATUS_WISE = `${API_URL}get_contact_summary/2?filter_by=7`
export const GET_CONTACT_SOURCE_WISE = `${API_URL}get_contact_summary/3?filter_by=7`
export const GET_CONTACT_USERS_WISE = `${API_URL}get_contact_summary/4?filter_by=7`
export const GET_CONTACT_SUMMARY = `${API_URL}get_contact_summary/5?filter_by=7`

// Prospect Summary
export const GET_LEAD_SUMMARY = `${API_URL}get_lead_summary/1?filter_by=7`
export const GET_LEAD_STATUS_WISE = `${API_URL}get_lead_summary/2?filter_by=7`
export const GET_LEAD_SOURCE_WISE = `${API_URL}get_lead_summary/3?filter_by=7`

// Prospect Summary
export const GET_TRANSACTION_PROJECT_WISE = `${API_URL}get_transaction_summary/1?filter_by=7`
export const GET_TRANSACTION_STATUS_WISE = `${API_URL}get_transaction_summary/2?filter_by=7`
export const GET_TRANSACTION_SOURCE_WISE = `${API_URL}get_transaction_summary/3?filter_by=7`

// Drop Summary
export const GET_DROP_PROPERTY = `${API_URL}get_drop_summary/1?filter_by=7`
export const GET_SOURCE_EFFIECNCY = `${API_URL}get_drop_summary/2?filter_by=7`

// Drop Summary
export const GET_PROPERTY_SUMMARY = `${API_URL}get_property_summary/1?filter_by=7`
export const GET_USER_PRODUCTIVITY = `${API_URL}get_property_summary/2?filter_by=7`

// Site Visit
export const GET_SITE_VISIT = `${API_URL}get_site_visit_summary/1?filter_by=7`
export const GET_SITE_VISIT_SCHEDULE_DONE = `${API_URL}get_site_visit_summary/2?filter_by=7`
export const GET_SITE_VISIT_PROJECT_WISE = `${API_URL}get_site_visit_summary/3?filter_by=7`
export const GET_SITE_VISIT_PROJECT_WISE_LIST = `${API_URL}get_site_visit_summary/4?filter_by=7`


export const GET_ORG_BS = `${API_URL}orgBs/get`

// Contact Summary
// Property Wise Summary
export function getContactPropertyWise(getData: any) {
  console.log('GET_CONTACT_PROPERTY_WISE+', GET_CONTACT_PROPERTY_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date);
  return axios.get(GET_CONTACT_PROPERTY_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
// Contact Status Wise
export function getContactStatusWise(getData: any) {
  return axios.get(GET_CONTACT_STATUS_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
// Contact Source Wise
export function getContactSourceWise(getData: any) {
  return axios.get(GET_CONTACT_SOURCE_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
// Users Source Wise
export function getContactUsersWise(getData: any) {
  return axios.get(GET_CONTACT_USERS_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getContactSummary(getData: any) {
  return axios.get(GET_CONTACT_SUMMARY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}


// LEAD SUMMARY
// Project Wise prospect
export function getLeadSummary(getData: any) {
  return axios.get(GET_LEAD_SUMMARY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getLeadStatusWise(getData: any) {
  return axios.get(GET_LEAD_STATUS_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getLeadSourceWise(getData: any) {
  return axios.get(GET_LEAD_SOURCE_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}


// TRANSACTION SUMMARY
// Project Wise prospect
export function getTransactionProWise(getData: any) {
  return axios.get(GET_TRANSACTION_PROJECT_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getTransactionStatusWise(getData: any) {
  return axios.get(GET_TRANSACTION_STATUS_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getTransactionSourceWise(getData: any) {
  return axios.get(GET_TRANSACTION_SOURCE_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}


// DROP SUMMARY
export function getDropProperty(getData: any) {
  return axios.get(GET_DROP_PROPERTY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getSourceEffiency(getData: any) {
  return axios.get(GET_SOURCE_EFFIECNCY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}


// Property SUMMARY
export function getProjectSummary(getData: any) {
  return axios.get(GET_PROPERTY_SUMMARY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getUserProductivity(getData: any) {
  return axios.get(GET_USER_PRODUCTIVITY + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}


// Site Visit
export function getSiteVisit(getData: any) {
  return axios.get(GET_SITE_VISIT + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getSiteVisitScheduleDone(getData: any) {
  return axios.get(GET_SITE_VISIT_SCHEDULE_DONE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getSiteVisitProWise(getData: any) {
  return axios.get(GET_SITE_VISIT_PROJECT_WISE + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getSiteVisitProWiseList(getData: any) {
  return axios.get(GET_SITE_VISIT_PROJECT_WISE_LIST + '&start_date=' + getData.start_date + '&end_date=' + getData.end_date)
    .then((response => response.data))
}
export function getOrgBS() {
  return axios.get(GET_ORG_BS)
    .then((response => response.data))
}