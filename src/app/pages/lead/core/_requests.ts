import axios, {AxiosResponse}  from 'axios'
import {ID, Response} from '../../../../_metronic/helpers'
import {ContactModel,ContactQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_BASE_URL


export const SAVE_LEAD_URL = `${API_URL}orgLeads/save/leads`
export const GET_LEADS_URL = `${API_URL}orgLeads/get/leads`
export const GET_LEAD_DROPLISTS_URL = `${API_URL}orgDropdown/lead_dropdown`
export const DELETE_LEAD_NOTES = `${API_URL}orgLeads/delete/leads`
export const GET_LEAD_URL = `${API_URL}orgLeads/edit/leads`
export const UPDATE_LEAD_URL = `${API_URL}orgLeads/update_lead/leads`
export const GETLOG = `${API_URL}orgLogs/get/logs`
export const UPDATE_LEAD_REQ_URL = `${API_URL}orgLeads/update_lead_requirement/leads`
export const SAVE_LEAD_FILTER_URL = `${API_URL}orgLeads/save_lead_filter/leads`
export const GET_LEAD_FILTERS_URL = `${API_URL}orgLeads/get_lead_filter/leads`
export const SAVE_LEAD_NOTES = `${API_URL}orgNotes/save/notes`
export const GET_LEAD_NOTES = `${API_URL}orgNotes/get/notes`
export const UPDATE_LEAD_NOTES_URL = `${API_URL}orgNotes/update/notes`
export const DELETE_LEAD_NOTES_URL = `${API_URL}orgNotes/delete/notes`
export const UPLOAD_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/save/files`
export const GET_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/get/files`
export const DELETE_MULITI_IMAGES_LEAD_URL = `${API_URL}orgFiles/delete/files`
export const UPDATE_LEAD_STATUS_URL = `${API_URL}orgLeads/update_lead_status/leads`
export const GET_AUTO_MATCHES_LEAD_URL = `${API_URL}orgLeads/get_lead_automatch/leads`
export const GET_LEAD_DUPLICATES_URL = `${API_URL}orgLeads/get_lead_duplicate/leads`
export const SEND_MAIL_LEAD_URL = `${API_URL}orgLeads/send_mail_lead/leads`
export const GET_LEAD_TASKS_URL = `${API_URL}orgLeads/get_lead_task/leads`
export const DELETE_LEAD_FILTERS = `${API_URL}orgLeads/delete_lead_filter/leads`
export const LEAD_BULK_REASSIGN_URL = `${API_URL}orgLeads/update_lead_bulk_reassign/leads`
export const UPLOAD_FILE_URL = `${API_URL}orgLeads/import_lead`







// update contact status api
export function bulkReassignLead(Id:any, cid:any) {
  return axios.put(LEAD_BULK_REASSIGN_URL+'/'+cid?.join(','), Id)
  .then((response => response.data))
}

// save lead fetch api
export function saveLead(postData:any) {
  return axios.post(SAVE_LEAD_URL, postData)
  .then((response => response.data))
}

// lead fetch api
export function getLeads(body:any) {
  console.log('GET_LEADS_URL', body);
  
  return axios.get(GET_LEADS_URL+'?looking_for='+body.looking_for+'&lead_source='+body.lead_source+'&lead_group='+body.lead_group+'&fee_oppurtunity='+body.fee_oppurtunity+'&lead_status='+body.status+'&assign_to='+body.assign_to+'&budget_min='+body.budget_min+'&budget_max='+body.budget_max+'&no_of_bedrooms_min='+body.no_of_bedrooms_min+'&no_of_bedrooms_max='+body.no_of_bedrooms_max+'&no_of_bathrooms_min='+body.no_of_bathrooms_min+'&no_of_bathrooms_max='+body.no_of_bathrooms_max+'&built_up_area_min='+body.built_up_area_min+'&built_up_area_min_ut='+body.built_up_area_min_ut+'&built_up_area_max='+body.built_up_area_max+'&lead_unit_type='+body.lead_unit_type+'&built_up_area_max_ut='+body.built_up_area_max_ut+'&plot_area_min='+body.plot_area_min+'&plot_area_min_ut='+body.plot_area_min_ut+'&plot_area_max='+body.plot_area_max+'&plot_area_max_ut='+body.plot_area_max_ut+'&possession_status='+body.possession_status+'&age_of_property='+body.age_of_property+'&vasthu_compliant='+body.vasthu_compliant+'&property='+body.property+'&priority='+body.priority+'&property_type='+body.property_type+'&furnishing='+body.furnishing+'&car_park_min='+body.car_park_min+'&car_park_max='+body.car_park_max+'&timeline_for_closure_min='+body.timeline_for_closure_min+'&timeline_for_closure_max='+body.timeline_for_closure_max+'&amenities='+body.amenities+'&created_date='+body.created_date+'&created_end_date='+body.created_end_date+'&created_by='+body.created_by+'&filter_name='+body.filter_name+'&limit='+body.limit+'&order_by='+body.sortBy)
  .then((response => response.data))
}

// lead DROPDOWNS fetch api
export function getLeadDropdowns() {
  return axios.get(GET_LEAD_DROPLISTS_URL)
  .then((response => response.data))
}

// lead DROPDOWNS fetch api
export function getAutoMatches(id:any) {
  return axios.get(GET_AUTO_MATCHES_LEAD_URL+'/'+id)
  .then((response => response.data))
}

// lead DROPDOWNS fetch api
export function getLeadTasks(id:any) {
  return axios.get(GET_LEAD_TASKS_URL+'/'+id)
  .then((response => response.data))
}

// lead DROPDOWNS fetch api
export function getLeadDuplicates(id:any, prop:any) {
  return axios.get(GET_LEAD_DUPLICATES_URL+'/'+id+'/'+prop)
  .then((response => response.data))
}

// update task api
export function deleteLead(leadId:any) {
  return axios.put(DELETE_LEAD_NOTES+'/'+leadId)
  .then((response => response.data))
}

// update task api
export function leadFilterDelete(id:any) {
  return axios.put(DELETE_LEAD_FILTERS+'/'+id)
  .then((response => response.data))
}

// get contact
export function getLeadDetail(leadId:any) {
  return axios.get(GET_LEAD_URL+'/'+leadId)
  .then((response => response.data))
}

// lead update api
export function updateLead(leadId:any ,postData:any) {
  return axios.put(UPDATE_LEAD_URL+'/'+leadId, postData)
  .then((response => response.data))
}

// get Log
export function getLog(leadId:number) {
  return axios.get(GETLOG+'/'+leadId+'/2')
  .then((response => response.data))
}

// lead update requirements api
export function updateLeadReq(leadId:any ,postData:any) {
  return axios.put(UPDATE_LEAD_REQ_URL+'/'+leadId, postData)
  .then((response => response.data))
}

// Filter Save lead
export function saveLeadFilter(postData:any) {
  return axios.post(SAVE_LEAD_FILTER_URL, postData)
  .then((response => response.data))
}

// get Duplicate Lead Task
export function getLeadFilters() {
  return axios.get(GET_LEAD_FILTERS_URL)
  .then((response => response.data))
}

// get Task Against Contact Id
export function saveLeadNotes(body:any) {
  return axios.post(SAVE_LEAD_NOTES,body)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getLeadNotes(contactId:number) {
  return axios.get(GET_LEAD_NOTES+'/'+contactId+'/2')
  .then((response => response.data))
} 

// update lead multiple api
export function updateLeadNotes(leadId:any, body:any) {
  return axios.put(UPDATE_LEAD_NOTES_URL+'/'+leadId, body)
  .then((response => response.data))
}

// delete lead notes api
export function deleteLeadNotes(noteId:any, parentId:any, lead_id:any) {
  return axios.put(DELETE_LEAD_NOTES_URL+'/'+noteId+'/'+parentId, {"module_id": lead_id, "module_name": 2})
  .then((response => response.data))
}

// upload lead
export function uploadMultipleFileLead(id:any ,postData:any) {
  return axios.post(UPLOAD_MULITI_IMAGES_LEAD_URL+'/'+id, postData)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getMultiImage(Id:number) {
  return axios.get(GET_MULITI_IMAGES_LEAD_URL+'/'+Id+'/'+2)
  .then((response => response.data))
}

// delete lead multiple api
export function deleteMultipleImagesLeads(fileId:any, leadId:any) {
  return axios.put(DELETE_MULITI_IMAGES_LEAD_URL+'/'+fileId, {"module_id": leadId, "module_name": 2})
  .then((response => response.data))
}

// update task api
export function updateLeadStatus(leadId:any ,body:any) {
  return axios.put(UPDATE_LEAD_STATUS_URL+'/'+leadId, body)
  .then((response => response.data))
}

// SEND MAIL lead
export function sendMail(postData:any) {
  return axios.post(SEND_MAIL_LEAD_URL, postData)
  .then((response => response.data))
}

// upload lead fetch api
export function uploadFileLead(postData:any, headers:any) {
  return axios.post(UPLOAD_FILE_URL, postData, headers)
  .then((response => response.data))
}



export const GET_CONTACTS_URL = `${API_URL}/get_contact_drop_list`
export const GET_LEADS_BY_ROLE_URL = `${API_URL}/get_lead_tl`
export const GET_CITY_URL = `${API_URL}/get_city`
export const GET_REQ_LOCATION_URL = `${API_URL}/get_requirement_location`
export const GET_VASTHU_URL = `${API_URL}/get_vasthu_compliant`
export const GET_ASSIGN_TO_URL = `${API_URL}/get_users`
export const GET_AMENITY_URL = `${API_URL}/get_amenities`
export const GET_FURNISHING_STATUS_URL = `${API_URL}/get_furnishing_status`
export const GET_POSESSION_STATUS_URL = `${API_URL}/get_posession_status`
export const GET_LOOKING_FOR_URL = `${API_URL}/get_looking_for`
export const GET_SEGMENT_URL = `${API_URL}/get_segment`
export const GET_PROPERTY_TYPE_URL = `${API_URL}/get_property_type`
export const GET_AGE_OF_PROPERTY_URL = `${API_URL}/get_age_of_property`
export const GET_LEAD_SOURCE_URL = `${API_URL}/get_source`
export const GET_LEAD_GROUP_URL = `${API_URL}/get_lead_group`
export const GET_LEAD_STATUS_URL = `${API_URL}/get_lead_status`
export const DELETE_MULTI_LEAD_URL = `${API_URL}/delete_lead_multiple`
export const GET_PROJECTS_URL = `${API_URL}/get_properties`
export const GET_TASK_LEAD_URL = `${API_URL}/get_task_lead`
export const GET_SECONDARY_CONTACT_LEAD_URL = `${API_URL}/get_secondary_contact_lead`
export const GET_DUPLICATE_LEAD_URL = `${API_URL}/get_duplicate_lead`
export const GET_LEAD_FILTER_URL = `${API_URL}/get_lead_filter`
export const GET_SALES_MANAGER_DROP_LIST_URL = `${API_URL}/get_contact_drop_list_sm`




// project fetch api
export function getPoperty(id:any, role:any) {
  return axios.get(GET_PROJECTS_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}


// get leads by role
export function getLeadsByRole(id:any, role:any) {
  return axios.get(GET_LEADS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}


// lead fetch api
export function getReqLocations() {
  return axios.get(GET_REQ_LOCATION_URL)
  .then((response => response.data))
}

// get filtered lead
export function getFilteredLead(id:any, role:any, getData:any, headers:any) {
  return axios.get(GET_LEADS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id+'?looking_for='+getData.looking_for+'&requirement_location='+getData.requirement_location+'&lead_source='+getData.lead_source+'&lead_group='+getData.lead_group+'&fee_oppurtunity='+getData.fee_oppurtunity+'&status='+getData.status+'&assign_to='+getData.assign_to+'&budget_min='+getData.budget_min+'&budget_max='+getData.budget_max+'&lead_unit_type='+getData.lead_unit_type+'&no_of_bedrooms_min='+getData.no_of_bedrooms_min+'&no_of_bedrooms_max='+getData.no_of_bedrooms_max+'&no_of_bathrooms_min='+getData.no_of_bathrooms_min+'&no_of_bathrooms_max='+getData.no_of_bathrooms_max+'&built_up_area_min='+getData.built_up_area_min+'&built_up_area_max='+getData.built_up_area_max+'&plot_area_min='+getData.plot_area_min+'&plot_area_max='+getData.plot_area_max+'&possession_status='+getData.possession_status+'&age_of_property='+getData.age_of_property+'&vasthu_compliant='+getData.vasthu_compliant+'&furnishing='+getData.furnishing+'&car_park_min='+getData.car_park_min+'&car_park_max='+getData.car_park_max+'&timeline_for_closure_min='+getData.timeline_for_closure_min+'&timeline_for_closure_max='+getData.timeline_for_closure_max+'&amenities='+getData.amenities+'&created_date='+getData.created_date+'&created_end_date='+getData.created_end_date+'&property_id='+getData.property+'&property_type='+getData.property_type+'&lead_priority='+getData.priority)
  .then((response => response.data))
}

// contact list fetch api
export function getContacts(id:any, role:any) {
  return axios.get(GET_CONTACTS_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}

// city list fetch api
export function getCity() {
  return axios.get(GET_CITY_URL)
  .then((response => response.data))
}

// vasthu list fetch api
export function getVasthu() {
  return axios.get(GET_VASTHU_URL)
  .then((response => response.data))
}

// amenity list fetch api
export function getAssignTo() {
  return axios.get(GET_ASSIGN_TO_URL)
  .then((response => response.data))
}

// amenity list fetch api
export function getAmenity() {
  return axios.get(GET_AMENITY_URL)
  .then((response => response.data))
}

// furnishing status list fetch api
export function getFurnishStatus() {
  return axios.get(GET_FURNISHING_STATUS_URL)
  .then((response => response.data))
}

// furnishing status list fetch api
export function getPosesStatus() {
  return axios.get(GET_POSESSION_STATUS_URL)
  .then((response => response.data))
}












// get looking for
export function getLookingFor() {
  return axios.get(GET_LOOKING_FOR_URL)
  .then((response => response.data))
}

// get segment
export function getSegment() {
  return axios.get(GET_SEGMENT_URL)
  .then((response => response.data))
}

// get property type
export function getPropertyType() {
  return axios.get(GET_PROPERTY_TYPE_URL)
  .then((response => response.data))
}

// get lead source
export function getLeadSource() {
  return axios.get(GET_LEAD_SOURCE_URL)
  .then((response => response.data))
}

// get lead group
export function getLeadGroup() {
  return axios.get(GET_LEAD_GROUP_URL)
  .then((response => response.data))
}

// get lead group
export function getLeadStatus() {
  return axios.get(GET_LEAD_STATUS_URL)
  .then((response => response.data))
}



// age of property fetch api
export function getAgeOfProperty() {
  return axios.get(GET_AGE_OF_PROPERTY_URL)
  .then((response => response.data))
}

 

// delete lead multiple api
export function deleteMultipleLeads(leadId:any) {
  return axios.put(DELETE_MULTI_LEAD_URL+'/'+leadId)
  .then((response => response.data))
}


// get Lead Task
export function getTaskLead(leadId:number) {
  return axios.get(GET_TASK_LEAD_URL+'/'+leadId)
  .then((response => response.data))
}

// get Secondary contact Lead Task
export function getSecondaryContactLead(leadId:number) {
  return axios.get(GET_SECONDARY_CONTACT_LEAD_URL+'/'+leadId)
  .then((response => response.data))
}

// get Duplicate Lead Task
export function getDuplicateLead(leadId:number) {
  return axios.get(GET_DUPLICATE_LEAD_URL+'/'+leadId)
  .then((response => response.data))
}




// get Duplicate Lead Task
export function getLeadFilter(Id:any) {
  return axios.get(GET_LEAD_FILTER_URL+'/'+Id)
  .then((response => response.data))
}



// get Duplicate Lead Task
export function getSalesManagerList(id:any, role:any) {
  return axios.get(GET_SALES_MANAGER_DROP_LIST_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}