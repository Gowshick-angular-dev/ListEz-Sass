import axios, {AxiosResponse}  from 'axios'
import {ID, Response} from '../../../../_metronic/helpers'
import {ContactModel,ContactQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_BASE_URL


export const GET_CONTACT_DROP_LIST_URL = `${API_URL}orgContacts/contact_dropdown`
export const UPDATE_CONTACT_STATUS_URL = `${API_URL}orgContacts/update_contact_status/contacts`
export const UPDATE_CONTACT_REASSIGN_URL = `${API_URL}orgContacts/update_reassign/contacts`
export const DELETE_CONTACT_URL = `${API_URL}orgContacts/delete/contacts`
export const GET_CONTACTS_URL = `${API_URL}orgContacts/get/contacts`
export const SAVE_CONTACT = `${API_URL}orgContacts/save/contacts`
export const SAVE_AUTO_ASSIGN_CONTACT = `${API_URL}orgContacts/save_contact_auto_assign/contacts`
export const GET_CONTACT_URL = `${API_URL}orgContacts/edit/contacts`
export const UPDATE_CONTACT = `${API_URL}orgContacts/update/contacts`
export const UPDATE_CONTACT_ADDITIONAL = `${API_URL}orgContacts/update_contact_details/contacts`
export const GETLOG = `${API_URL}orgLogs/get/logs`
export const UPDATE_CONTACT_ADDRESS = `${API_URL}orgContacts/update_contact_address/contacts`
export const GET_LOCALITY_LIST_URL = `${API_URL}orgContacts/get_all_location`
export const SAVE_CONTACT_FILTER_URL = `${API_URL}orgContacts/save_contact_filter/contacts`
export const GET_CONTACT_FILTER_URL = `${API_URL}orgContacts/get_contact_filter/contacts`
export const SAVE_CONTACT_NOTES = `${API_URL}orgNotes/save/notes`
export const GET_CONTACT_NOTES = `${API_URL}orgNotes/get/notes`
export const DELETE_CONTACT_NOTES_URL = `${API_URL}orgNotes/delete/notes`
export const UPDATE_CONTACT_NOTES_URL = `${API_URL}orgNotes/update/notes`
export const UPLOAD_MULTI_FILE = `${API_URL}orgFiles/save/files`
export const GET_FILES = `${API_URL}orgFiles/get/files`
export const DELETE_CONTACT_FILE_URL = `${API_URL}orgFiles/delete/files`
export const CONTACT_LEADS_URL = `${API_URL}orgContacts/get_contact_leads/contacts`
export const SEC_CONTACT_URL = `${API_URL}orgContacts/get_secondary_contact/contacts`
export const REASSIGN_DROPDOWN_URL = `${API_URL}orgContacts/reassign_dropdown/contacts`
export const CONTACT_TASKS_URL = `${API_URL}orgContacts/get_contact_tasks/contacts`
export const CONTACT_DUPLICATES_URL = `${API_URL}orgContacts/get_duplicate_contact/contacts`
export const CONTACT_FILTER_DELETE_URL = `${API_URL}orgContacts/delete_contact_filter/contacts`
export const CONTACT_BULK_REASSIGN_URL = `${API_URL}orgContacts/update_bulk_reassign/contacts`
export const UPLOAD_FILE_CONTACT = `${API_URL}orgContacts/uploadfileContact`
export const EXPORT_FILE_CONTACT = `${API_URL}orgContacts/contact_export_csv`


// contact fetch api
export function getContsctLeads(id:any) {
  return axios.get(CONTACT_LEADS_URL+'/'+id)
  .then((response => response.data))
}

// contact fetch api
export function getContsctTasks(id:any) {
  return axios.get(CONTACT_TASKS_URL+'/'+id)
  .then((response => response.data))
}

// contact fetch api
export function getSecContscts(id:any) {
  return axios.get(SEC_CONTACT_URL+'/'+id)
  .then((response => response.data))
}

// contact fetch api
export function getReassignDropdown() {
  return axios.get(REASSIGN_DROPDOWN_URL)
  .then((response => response.data))
}

// contact fetch api
export function getContsctDuplicates(id:any) {
  return axios.get(CONTACT_DUPLICATES_URL+'/'+id)
  .then((response => response.data))
}

// contact fetch api
export function getContsctDropList() {
  return axios.get(GET_CONTACT_DROP_LIST_URL)
  .then((response => response.data))
}

// update contact status api
export function updateContactStatus(leadId:any ,body:any) {
  return axios.put(UPDATE_CONTACT_STATUS_URL+'/'+leadId, body)
  .then((response => response.data))
}

// update contact status api
export function reassignContact(Id:any ,body:any) {
  return axios.put(UPDATE_CONTACT_REASSIGN_URL+'/'+Id, body)
  .then((response => response.data))
}

// update contact status api
export function contactFilterDelete(Id:any) {
  return axios.put(CONTACT_FILTER_DELETE_URL+'/'+Id)
  .then((response => response.data))
}

// update contact status api
export function deleteContact(contactId:any) {
  return axios.put(DELETE_CONTACT_URL+'/'+contactId)
  .then((response => response.data))
}

// update contact status api
export function bulkReassignContact(Id:any, cid:any) {
  return axios.put(CONTACT_BULK_REASSIGN_URL+'/'+cid?.join(','), Id)
  .then((response => response.data))
}

// save contact
export function saveContact(postData:any, headers:any) {
  return axios.post(SAVE_CONTACT,postData, headers)
  .then((response => response.data))
}

// save contact
export function saveContactAutoAssign(postData:any, headers:any) {
  return axios.post(SAVE_AUTO_ASSIGN_CONTACT,postData, headers)
  .then((response => response.data))
}

// export function getContacts(getData:any) {
//   return axios.get(GET_CONTACTS_URL)
//   .then((response => response.data))
// }
export function getContacts(getData:any) {
  return axios.get(GET_CONTACTS_URL+'?contact_type='+getData.contact_type+'&contact_category='+getData.contact_category+'&gender='+getData.gender+'&company_name='+'&contact_status='+getData.contact_status+'&assign_to='+getData.assign_to+'&source='+getData.source+'&locality='+getData.locality+'&contact_group='+getData.contact_group+'&created_by='+getData.created_by+'&created_date='+getData.created_date+'&created_end_date='+getData.created_end_date+'&property='+getData.property_id+'&dob='+'&city='+getData.city+'&country='+getData.country+'&state='+getData.state+'&zip_code='+getData.zip_code+'&order_by='+getData.sortBy+'&limit='+getData.limit)
  .then((response => response.data))
}

export function getContactsCSV(getData:any) {
  return axios.get(EXPORT_FILE_CONTACT+'?contact_type='+getData.contact_type+'&contact_category='+getData.contact_category+'&gender='+getData.gender+'&company_name='+'&contact_status='+getData.contact_status+'&assign_to='+getData.assign_to+'&source='+getData.source+'&locality='+getData.locality+'&contact_group='+getData.contact_group+'&created_by='+getData.created_by+'&created_date='+getData.created_date+'&created_end_date='+getData.created_end_date+'&property='+getData.property_id+'&dob='+'&city='+getData.city+'&country='+getData.country+'&state='+getData.state+'&zip_code='+getData.zip_code+'&order_by='+getData.sortBy+'&limit=')
  .then((response => response.data))
}

// get contact
export function getContactDetail(contactId:number) {
  return axios.get(GET_CONTACT_URL+'/'+contactId)
  .then((response => response.data))
}

// update contact
export function updateContact(id:any, postData:any, headers:any) {
  return axios.put(UPDATE_CONTACT+'/'+id, postData, headers)
  .then((response => response.data))
}

// update contact
export function updateContactAdditional(id:any, postData:any, headers:any) {
  return axios.put(UPDATE_CONTACT_ADDITIONAL+'/'+id, postData, headers)
  .then((response => response.data))
}

// get Log
export function getLog(contactId:number) {
  return axios.get(GETLOG+'/'+contactId+'/1')
  .then((response => response.data))
}

// update contact
export function updateContactAddress(id:any, postData:any, headers:any) {
  return axios.put(UPDATE_CONTACT_ADDRESS+'/'+id, postData, headers)
  .then((response => response.data))
}

// contact fetch api
export function getLocalityByPIN(pin:any) {
  return axios.get(GET_LOCALITY_LIST_URL+'/'+pin)
  .then((response => response.data))
}

// contact filter save fetch api
export function saveContactFilter(body:any) {
  return axios.post(SAVE_CONTACT_FILTER_URL, body)
  .then((response => response.data))
}

// get contact filter api
export function getContactFilter() {
  return axios.get(GET_CONTACT_FILTER_URL)
  .then((response => response.data))
}

// get Task Against Contact Id
export function saveContactNotes(body:any) {
  return axios.post(SAVE_CONTACT_NOTES, body)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getContactNotes(contactId:number) {
  return axios.get(GET_CONTACT_NOTES+'/'+contactId+'/'+1)
  .then((response => response.data))
}

// delete notes api
export function deleteContactNotes(noteId:any, parentId:any, contact_id:any) {
  return axios.put(DELETE_CONTACT_NOTES_URL+'/'+noteId+'/'+parentId, {"module_id": contact_id, "module_name": 1})
  .then((response => response.data))
}

// update notes api
export function updateContactNotes(contactId:any, body:any) {
  return axios.put(UPDATE_CONTACT_NOTES_URL+'/'+contactId, body)
  .then((response => response.data))
}

// upload contact
export function uploadMultipleFile(id:any ,postData:any) {
  return axios.post(UPLOAD_MULTI_FILE+'/'+id, postData)
  .then((response => response.data))
}

// get files api
export function getContactFiles(contactId:any) {
  return axios.get(GET_FILES+'/'+contactId+'/'+1)
  .then((response => response.data))
}

// update files api
export function deleteContactFile(fileId:any, contact_id:any) {
  return axios.put(DELETE_CONTACT_FILE_URL+'/'+fileId, {"module_id": contact_id, "module_name": 1})
  .then((response => response.data))
}

// upload contact
export function uploadFileContact(postData:any, headers:any) {
  return axios.post(UPLOAD_FILE_CONTACT, postData, headers)
  .then((response => response.data))
}





export const GET_CONTACTS_BY_ROLE_URL = `${API_URL}/get_contact_tl`
export const GET_CONTACTS_LAZY_LOAD_URL = `${API_URL}/get_contact_tl`
export const GET_CONTACTS_DROP_URL = `${API_URL}/get_contact_drop_list`
export const GET_CONTACT_STATUS_URL = `${API_URL}/get_contact_status`
export const GET_CONTACT_TYPE = `${API_URL}/get_contact_type`
export const GET_CONTACT_CATEGORY = `${API_URL}/get_contact_category`
export const GET_CONTACT_GROUP = `${API_URL}/get_contact_group`
export const GET_STATE = `${API_URL}/get_state`
export const GET_ASSIGN_TO_URL = `${API_URL}/get_users`
export const GET_USER_ASSIGN_TO_URL = `${API_URL}/get_users_assign_to`
export const GET_LOCALITY = `${API_URL}/get_requirement_location`
export const GET_SOURCE = `${API_URL}/get_source`
export const GET_DONOTDISTURB = `${API_URL}/get_do_not_disturb`
export const GET_MARITALSTATUS = `${API_URL}/get_marital_status`
export const GET_GENDER = `${API_URL}/get_gender`
export const GET_NATIONALITY = `${API_URL}/get_nationality`
export const GET_LANGUAGE = `${API_URL}/get_language`
export const GET_PETOWNER = `${API_URL}/get_pet_owner`
export const GET_IDDOCUMENT = `${API_URL}/get_id_document`
export const GET_CITY = `${API_URL}/get_city`
export const GET_SEC_CONTACTS_URL = `${API_URL}/get_secondary_contact`
export const GET_LEAD_CONTACTS_URL = `${API_URL}/get_lead_contact`
export const GET_DUPLICATE_CONTACTS_URL = `${API_URL}/get_duplicate_contact`
export const GET_TASK_LIST = `${API_URL}/get_task_contact`
export const DELETE_MULTI_CONTACT_URL = `${API_URL}/delete_multiple_contact`
export const GET_CONTACT_FILTER_BYID_URL = `${API_URL}/get_contact_filter`
export const GET_CONTACT_FILTER_BYDAY_URL = `${API_URL}/get_contact_tl`
export const GET_REASSIGNTO_LIST_URL = `${API_URL}/get_users_reassign_dropdown`
export const SAVE_REASSIGNTO_URL = `${API_URL}/save_reassign`
export const GET_DEVELOPER_NAME_LIST_URL = `${API_URL}/get_developer_contact_drop_list`





















export function getDeveloperNameList(user:any, role:any) {
  return axios.get(GET_DEVELOPER_NAME_LIST_URL+'/'+user+'/'+role+'/'+user)
  .then((response => response.data))
}

export function getReassignToList(id:any, role:any) {
  return axios.get(GET_REASSIGNTO_LIST_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}

export function saveReassignTo(note:any) {
  return axios.post(SAVE_REASSIGNTO_URL, note)
  .then((response => response.data))
}












// contact status api
export function getContactStatus() {
  return axios.get(GET_CONTACT_STATUS_URL)
  .then((response => response.data))
}
// contact type api
export function getContactType() {
  return axios.get(GET_CONTACT_TYPE)
  .then((response => response.data))
}
// contact category api
export function getContactCategory() {
  return axios.get(GET_CONTACT_CATEGORY)
  .then((response => response.data))
}
// contact group api
export function getContactGroup() {
  return axios.get(GET_CONTACT_GROUP)
  .then((response => response.data))
}
// state api
export function getState() {
  return axios.get(GET_STATE)
  .then((response => response.data))
}
// locality api
export function getLocality() {
  return axios.get(GET_LOCALITY)
  .then((response => response.data))
}
// locality api
export function getSource() {
  return axios.get(GET_SOURCE)
  .then((response => response.data))
}
// locality api
export function getDoNotDisturb() {
  return axios.get(GET_DONOTDISTURB)
  .then((response => response.data))
}
// locality api
export function getMaritalStatus() {
  return axios.get(GET_MARITALSTATUS)
  .then((response => response.data))
}
// locality api
export function getGender() {
  return axios.get(GET_GENDER)
  .then((response => response.data))
}
// locality api
export function getNationality() {
  return axios.get(GET_NATIONALITY)
  .then((response => response.data))
}
// locality api
export function getLanguage() {
  return axios.get(GET_LANGUAGE)
  .then((response => response.data))
}
// locality api
export function getPetOwner() {
  return axios.get(GET_PETOWNER)
  .then((response => response.data))
}
// locality api
export function getIdDocument() {
  return axios.get(GET_IDDOCUMENT)
  .then((response => response.data))
}
// city api
export function getCity() {
  return axios.get(GET_CITY)
  .then((response => response.data))
}

// assignto list fetch api
export function getAssignToList(id:any, role:any) {
  return axios.get(GET_USER_ASSIGN_TO_URL+'/'+id+'/'+role)
  .then((response => response.data))
}




// update contact
export function getContactByRole(id:any, role:any) {
  return axios.get(GET_CONTACTS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}

// update contact
export function getContactLazyLoad(id:any, role:any, limit:any) {
  return axios.get(GET_CONTACTS_LAZY_LOAD_URL+'/'+id+'/'+role+'/'+id+'?limit='+limit)
  .then((response => response.data))
}
//+'?order_by='+sortby










// get filtered contact
export function getFilteredContact(id:any, role:any, getData:any, headers:any) {
  return axios.get(GET_CONTACTS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id+'?contact_type='+getData.contact_type+'&status='+getData.status+'&assign_to='+getData.assign_to+'&source='+getData.source+'&date_of_birth='+getData.date_of_birth+'&locality='+getData.locality+'&nationality='+getData.nationality+'&contact_group='+getData.contact_group+'&created_at='+getData.created_date+'&property='+getData.property)
  .then((response => response.data))
}
// get filtered contact
export function getSortContact(id:any, role:any, sortBy:any, limit:any) {
  return axios.get(GET_CONTACTS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id+'?order_by='+sortBy+'&limit='+limit).then((response => response.data));
}
// get secondary contact
export function getSecondaryContactsList(contactId:number) {
  return axios.get(GET_SEC_CONTACTS_URL+'/'+contactId)
  .then((response => response.data))
}
// get secondary contact drop
export function getContactsDropList(id:any, role:any) {
  return axios.get(GET_CONTACTS_DROP_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}
// get lead contact
export function getLeadContactsList(contactId:number) {
  return axios.get(GET_LEAD_CONTACTS_URL+'/'+contactId)
  .then((response => response.data))
}
// get duplicate contact
export function getDupContactsList(contactId:number) {
  return axios.get(GET_DUPLICATE_CONTACTS_URL+'/'+contactId)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getTaskList(contactId:number) {
  return axios.get(GET_TASK_LIST+'/'+contactId)
  .then((response => response.data))
}






// update files api
export function deleteMultipleContacts(contactId:any) {
  return axios.put(DELETE_MULTI_CONTACT_URL+'/'+contactId)
  .then((response => response.data))
}





// get contact filter api
export function getContactFilterById(Id:any) {
  return axios.get(GET_CONTACT_FILTER_BYID_URL+'/'+Id)
  .then((response => response.data))
}

