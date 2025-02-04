import axios, {AxiosResponse}  from 'axios'
import {ID, Response} from '../../../../../_metronic/helpers'

const API_URL = process.env.REACT_APP_API_BASE_URL   

// Masters
export const GET_MASTERS_URL = `${API_URL}masters/get/masters`
export const SAVE_MASTERS_URL = `${API_URL}masters/save/masters`
export const UPDATE_MASTERS_URL = `${API_URL}masters/update/masters`
export const DELETE_MASTERS_URL = `${API_URL}masters/delete/masters`

export function getMasters(val:any) {
    return axios.get(GET_MASTERS_URL+'?option_type='+val)
    .then((response => response.data))
}

export function saveMasters(body:any) {
    return axios.post(SAVE_MASTERS_URL, body)
    .then((response => response.data))
}

export function updateMasters(id:any ,body:any) {
    return axios.put(UPDATE_MASTERS_URL+'/'+body.option_type+'/'+id, body)
    .then((response => response.data))
}

export function deleteMasters(id:any) {
    return axios.put(DELETE_MASTERS_URL+'/'+id)
    .then((response => response.data))
}

// contact Status
export const GET_CONTACT_STATUS_URL = `${API_URL}get_contact_status`
export const SAVE_CONTACT_STATUS_URL = `${API_URL}save_contact_status`
export const UPDATE_CONTACT_STATUS_URL = `${API_URL}put_contact_status`
export const DELETE_CONTACT_STATUS_URL = `${API_URL}delete_contact_status`

// contact status fetch api
export function getContactStatus() {
    return axios.get(GET_CONTACT_STATUS_URL)
    .then((response => response.data))
}

// save contact status fetch api
export function saveContactStatus(body:any) {
    return axios.post(SAVE_CONTACT_STATUS_URL, body)
    .then((response => response.data))
}

// update contact status fetch api
export function updateContactStatus(id:any ,body:any) {
    return axios.put(UPDATE_CONTACT_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete contact status fetch api
export function deleteContactStatus(id:any) {
    return axios.put(DELETE_CONTACT_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// contact group
export const GET_CONTACT_GROUP_URL = `${API_URL}get_contact_group`
export const SAVE_CONTACT_GROUP_URL = `${API_URL}save_contact_group`
export const UPDATE_CONTACT_GROUP_URL = `${API_URL}put_contact_group`
export const DELETE_CONTACT_GROUP_URL = `${API_URL}delete_contact_group`

// contact group fetch api
export function getContactGroup() {
    return axios.get(GET_CONTACT_GROUP_URL)
    .then((response => response.data))
}

// save contact group fetch api
export function saveContactGroup(body:any) {
    return axios.post(SAVE_CONTACT_GROUP_URL, body)
    .then((response => response.data))
}

// update contact group fetch api
export function updateContactGroup(id:any ,body:any) {
    return axios.put(UPDATE_CONTACT_GROUP_URL+'/'+id, body)
    .then((response => response.data))
}

// delete contact group fetch api
export function deleteContactGroup(id:any) {
    return axios.put(DELETE_CONTACT_GROUP_URL+'/'+id)
    .then((response => response.data))
}


// contact category
export const GET_CONTACT_CATEGORY_URL = `${API_URL}get_contact_category`
export const SAVE_CONTACT_CATEGORY_URL = `${API_URL}save_contact_category`
export const UPDATE_CONTACT_CATEGORY_URL = `${API_URL}put_contact_category`
export const DELETE_CONTACT_CATEGORY_URL = `${API_URL}delete_contact_category`

// contact category fetch api
export function getContactCategory() {
    return axios.get(GET_CONTACT_CATEGORY_URL)
    .then((response => response.data))
}

// save contact category fetch api
export function saveContactCategory(body:any) {
    return axios.post(SAVE_CONTACT_CATEGORY_URL, body)
    .then((response => response.data))
}

// update contact category fetch api
export function updateContactCategory(id:any ,body:any) {
    return axios.put(UPDATE_CONTACT_CATEGORY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete contact category fetch api
export function deleteContactCategory(id:any) {
    return axios.put(DELETE_CONTACT_CATEGORY_URL+'/'+id)
    .then((response => response.data))
}


// contact type
export const GET_CONTACT_TYPE_URL = `${API_URL}get_contact_type`
export const SAVE_CONTACT_TYPE_URL = `${API_URL}save_contact_type`
export const UPDATE_CONTACT_TYPE_URL = `${API_URL}put_contact_type`
export const DELETE_CONTACT_TYPE_URL = `${API_URL}delete_contact_type`

// contact type fetch api
export function getContactType() {
    return axios.get(GET_CONTACT_TYPE_URL)
    .then((response => response.data))
}

// save contact type fetch api
export function saveContactType(body:any) {
    return axios.post(SAVE_CONTACT_TYPE_URL, body)
    .then((response => response.data))
}

// update contact type fetch api
export function updateContactType(id:any ,body:any) {
    return axios.put(UPDATE_CONTACT_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete contact type fetch api
export function deleteContactType(id:any) {
    return axios.put(DELETE_CONTACT_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Amenity
export const GET_AMENITY_URL = `${API_URL}/get_amenities`
export const SAVE_AMENITY_URL = `${API_URL}/save_amenities`
export const UPDATE_AMENITY_URL = `${API_URL}/put_amenities`
export const DELETE_AMENITY_URL = `${API_URL}/delete_amenities`

// Amenity fetch api
export function getAmenity() {
    return axios.get(GET_AMENITY_URL)
    .then((response => response.data))
}

// save Amenity fetch api
export function saveAmenity(body:any) {
    return axios.post(SAVE_AMENITY_URL, body)
    .then((response => response.data))
}

// update Amenity fetch api
export function updateAmenity(id:any ,body:any) {
    return axios.put(UPDATE_AMENITY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Amenity fetch api
export function deleteAmenity(id:any) {
    return axios.put(DELETE_AMENITY_URL+'/'+id)
    .then((response => response.data))
}


// DoNotDistrub
export const GET_DONOTDISTRUB_URL = `${API_URL}/get_do_not_disturb`
export const SAVE_DONOTDISTRUB_URL = `${API_URL}/save_do_not_disturb`
export const UPDATE_DONOTDISTRUB_URL = `${API_URL}/put_do_not_disturb`
export const DELETE_DONOTDISTRUB_URL = `${API_URL}/delete_do_not_disturb`

// DoNotDistrub fetch api
export function getDoNotDistrub() {
    return axios.get(GET_DONOTDISTRUB_URL)
    .then((response => response.data))
}

// save DoNotDistrub fetch api
export function saveDoNotDistrub(body:any) {
    return axios.post(SAVE_DONOTDISTRUB_URL, body)
    .then((response => response.data))
}

// update DoNotDistrub fetch api
export function updateDoNotDistrub(id:any ,body:any) {
    return axios.put(UPDATE_DONOTDISTRUB_URL+'/'+id, body)
    .then((response => response.data))
}

// delete DoNotDistrub fetch api
export function deleteDoNotDistrub(id:any) {
    return axios.put(DELETE_DONOTDISTRUB_URL+'/'+id)
    .then((response => response.data))
}


// Gender
export const GET_GENDER_URL = `${API_URL}/get_gender`
export const SAVE_GENDER_URL = `${API_URL}/save_gender`
export const UPDATE_GENDER_URL = `${API_URL}/put_gender`
export const DELETE_GENDER_URL = `${API_URL}/delete_gender`

// Gender fetch api
export function getGender() {
    return axios.get(GET_GENDER_URL)
    .then((response => response.data))
}

// save Gender fetch api
export function saveGender(body:any) {
    return axios.post(SAVE_GENDER_URL, body)
    .then((response => response.data))
}

// update Gender fetch api
export function updateGender(id:any ,body:any) {
    return axios.put(UPDATE_GENDER_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Gender fetch api
export function deleteGender(id:any) {
    return axios.put(DELETE_GENDER_URL+'/'+id)
    .then((response => response.data))
}


// IdDocument
export const GET_IDDOCUMENT_URL = `${API_URL}/get_id_document`
export const SAVE_IDDOCUMENT_URL = `${API_URL}/save_id_document`
export const UPDATE_IDDOCUMENT_URL = `${API_URL}/put_id_document`
export const DELETE_IDDOCUMENT_URL = `${API_URL}/delete_id_document`

// IdDocument fetch api
export function getIdDocument() {
    return axios.get(GET_IDDOCUMENT_URL)
    .then((response => response.data))
}

// save IdDocument fetch api
export function saveIdDocument(body:any) {
    return axios.post(SAVE_IDDOCUMENT_URL, body)
    .then((response => response.data))
}

// update IdDocument fetch api
export function updateIdDocument(id:any ,body:any) {
    return axios.put(UPDATE_IDDOCUMENT_URL+'/'+id, body)
    .then((response => response.data))
}

// delete IdDocument fetch api
export function deleteIdDocument(id:any) {
    return axios.put(DELETE_IDDOCUMENT_URL+'/'+id)
    .then((response => response.data))
}


// Language
export const GET_LANGUAGE_URL = `${API_URL}/get_language`
export const SAVE_LANGUAGE_URL = `${API_URL}/save_language`
export const UPDATE_LANGUAGE_URL = `${API_URL}/put_language`
export const DELETE_LANGUAGE_URL = `${API_URL}/delete_language`

// Language fetch api
export function getLanguage() {
    return axios.get(GET_LANGUAGE_URL)
    .then((response => response.data))
}

// save Language fetch api
export function saveLanguage(body:any) {
    return axios.post(SAVE_LANGUAGE_URL, body)
    .then((response => response.data))
}

// update Language fetch api
export function updateLanguage(id:any ,body:any) {
    return axios.put(UPDATE_LANGUAGE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Language fetch api
export function deleteLanguage(id:any) {
    return axios.put(DELETE_LANGUAGE_URL+'/'+id)
    .then((response => response.data))
}


// Locality
export const GET_LOCALITY_URL = `${API_URL}/get_requirement_location`
export const SAVE_LOCALITY_URL = `${API_URL}/save_requirement_location`
export const UPDATE_LOCALITY_URL = `${API_URL}/put_requirement_location`
export const DELETE_LOCALITY_URL = `${API_URL}/delete_requirement_location`

// Locality fetch api
export function getLocality() {
    return axios.get(GET_LOCALITY_URL)
    .then((response => response.data))
}

// save Locality fetch api
export function saveLocality(body:any) {
    return axios.post(SAVE_LOCALITY_URL, body)
    .then((response => response.data))
}

// update Locality fetch api
export function updateLocality(id:any ,body:any) {
    return axios.put(UPDATE_LOCALITY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Locality fetch api
export function deleteLocality(id:any) {
    return axios.put(DELETE_LOCALITY_URL+'/'+id)
    .then((response => response.data))
}


// Marital Status
export const GET_MARITAL_STATUS_URL = `${API_URL}/get_marital_status`
export const SAVE_MARITAL_STATUS_URL = `${API_URL}/save_marital_status`
export const UPDATE_MARITAL_STATUS_URL = `${API_URL}/put_marital_status`
export const DELETE_MARITAL_STATUS_URL = `${API_URL}/delete_marital_status`

// Marital Status fetch api
export function getMaritalStatus() {
    return axios.get(GET_MARITAL_STATUS_URL)
    .then((response => response.data))
}

// save Marital Status fetch api
export function saveMaritalStatus(body:any) {
    return axios.post(SAVE_MARITAL_STATUS_URL, body)
    .then((response => response.data))
}

// update Marital Status fetch api
export function updateMaritalStatus(id:any ,body:any) {
    return axios.put(UPDATE_MARITAL_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Marital Status fetch api
export function deleteMaritalStatus(id:any) {
    return axios.put(DELETE_MARITAL_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Nationality
export const GET_NATIONALITY_URL = `${API_URL}/get_nationality`
export const SAVE_NATIONALITY_URL = `${API_URL}/save_nationality`
export const UPDATE_NATIONALITY_URL = `${API_URL}/put_nationality`
export const DELETE_NATIONALITY_URL = `${API_URL}/delete_nationality`

// Nationality fetch api
export function getNationality() {
    return axios.get(GET_NATIONALITY_URL)
    .then((response => response.data))
}

// save Nationality fetch api
export function saveNationality(body:any) {
    return axios.post(SAVE_NATIONALITY_URL, body)
    .then((response => response.data))
}

// update Nationality fetch api
export function updateNationality(id:any ,body:any) {
    return axios.put(UPDATE_NATIONALITY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Nationality fetch api
export function deleteNationality(id:any) {
    return axios.put(DELETE_NATIONALITY_URL+'/'+id)
    .then((response => response.data))
}


// PetOwner
export const GET_PETOWNER_URL = `${API_URL}/get_pet_owner`
export const SAVE_PETOWNER_URL = `${API_URL}/save_pet_owner`
export const UPDATE_PETOWNER_URL = `${API_URL}/put_pet_owner`
export const DELETE_PETOWNER_URL = `${API_URL}/delete_pet_owner`

// PetOwner fetch api
export function getPetOwner() {
    return axios.get(GET_PETOWNER_URL)
    .then((response => response.data))
}

// save PetOwner fetch api
export function savePetOwner(body:any) {
    return axios.post(SAVE_PETOWNER_URL, body)
    .then((response => response.data))
}

// update PetOwner fetch api
export function updatePetOwner(id:any ,body:any) {
    return axios.put(UPDATE_PETOWNER_URL+'/'+id, body)
    .then((response => response.data))
}

// delete PetOwner fetch api
export function deletePetOwner(id:any) {
    return axios.put(DELETE_PETOWNER_URL+'/'+id)
    .then((response => response.data))
}


// Source
export const GET_SOURCE_URL = `${API_URL}/get_source`
export const SAVE_SOURCE_URL = `${API_URL}/save_source`
export const UPDATE_SOURCE_URL = `${API_URL}/put_source`
export const DELETE_SOURCE_URL = `${API_URL}/delete_source`

// Source fetch api
export function getSource() {
    return axios.get(GET_SOURCE_URL)
    .then((response => response.data))
}

// save Source fetch api
export function saveSource(body:any) {
    return axios.post(SAVE_SOURCE_URL, body)
    .then((response => response.data))
}

// update Source fetch api
export function updateSource(id:any ,body:any) {
    return axios.put(UPDATE_SOURCE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Source fetch api
export function deleteSource(id:any) {
    return axios.put(DELETE_SOURCE_URL+'/'+id)
    .then((response => response.data))
}


// State
export const GET_STATE_URL = `${API_URL}/get_state`
export const SAVE_STATE_URL = `${API_URL}/save_state`
export const UPDATE_STATE_URL = `${API_URL}/put_state`
export const DELETE_STATE_URL = `${API_URL}/delete_state`

// State fetch api
export function getState() {
    return axios.get(GET_STATE_URL)
    .then((response => response.data))
}

// save State fetch api
export function saveState(body:any) {
    return axios.post(SAVE_STATE_URL, body)
    .then((response => response.data))
}

// update State fetch api
export function updateState(id:any ,body:any) {
    return axios.put(UPDATE_STATE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete State fetch api
export function deleteState(id:any) {
    return axios.put(DELETE_STATE_URL+'/'+id)
    .then((response => response.data))
}


// LookingFor
export const GET_LOOKINGFOR_URL = `${API_URL}/get_looking_for`
export const SAVE_LOOKINGFOR_URL = `${API_URL}/save_looking_for`
export const UPDATE_LOOKINGFOR_URL = `${API_URL}/put_looking_for`
export const DELETE_LOOKINGFOR_URL = `${API_URL}/delete_looking_for`

// LookingFor fetch api
export function getLookingFor() {
    return axios.get(GET_LOOKINGFOR_URL)
    .then((response => response.data))
}

// save LookingFor fetch api
export function saveLookingFor(body:any) {
    return axios.post(SAVE_LOOKINGFOR_URL, body)
    .then((response => response.data))
}

// update LookingFor fetch api
export function updateLookingFor(id:any ,body:any) {
    return axios.put(UPDATE_LOOKINGFOR_URL+'/'+id, body)
    .then((response => response.data))
}

// delete LookingFor fetch api
export function deleteLookingFor(id:any) {
    return axios.put(DELETE_LOOKINGFOR_URL+'/'+id)
    .then((response => response.data))
}


// PropertyType
export const GET_PROPERTY_TYPE_URL = `${API_URL}/get_property_type`
export const SAVE_PROPERTY_TYPE_URL = `${API_URL}/save_property_type`
export const UPDATE_PROPERTY_TYPE_URL = `${API_URL}/put_property_type`
export const DELETE_PROPERTY_TYPE_URL = `${API_URL}/delete_property_type`

// PropertyType fetch api
export function getPropertyType() {
    return axios.get(GET_PROPERTY_TYPE_URL)
    .then((response => response.data))
}

// save PropertyType fetch api
export function savePropertyType(body:any) {
    return axios.post(SAVE_PROPERTY_TYPE_URL, body)
    .then((response => response.data))
}

// update PropertyType fetch api
export function updatePropertyType(id:any ,body:any) {
    return axios.put(UPDATE_PROPERTY_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete PropertyType fetch api
export function deletePropertyType(id:any) {
    return axios.put(DELETE_PROPERTY_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Lead Source
export const GET_LEAD_SOURCE_URL = `${API_URL}/get_lead_source`
export const SAVE_LEAD_SOURCE_URL = `${API_URL}/save_lead_source`
export const UPDATE_LEAD_SOURCE_URL = `${API_URL}/put_lead_source`
export const DELETE_LEAD_SOURCE_URL = `${API_URL}/delete_lead_source`

// Lead Source fetch api
export function getLeadSource() {
    return axios.get(GET_LEAD_SOURCE_URL)
    .then((response => response.data))
}

// save Lead Source fetch api
export function saveLeadSource(body:any) {
    return axios.post(SAVE_LEAD_SOURCE_URL, body)
    .then((response => response.data))
}

// update Lead Source fetch api
export function updateLeadSource(id:any ,body:any) {
    return axios.put(UPDATE_LEAD_SOURCE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Lead Source fetch api
export function deleteLeadSource(id:any) {
    return axios.put(DELETE_LEAD_SOURCE_URL+'/'+id)
    .then((response => response.data))
}


// Lead Group
export const GET_LEAD_GROUP_URL = `${API_URL}/get_lead_group`
export const SAVE_LEAD_GROUP_URL = `${API_URL}/save_lead_group`
export const UPDATE_LEAD_GROUP_URL = `${API_URL}/put_lead_group`
export const DELETE_LEAD_GROUP_URL = `${API_URL}/delete_lead_group`

// Lead Group fetch api
export function getLeadGroup() {
    return axios.get(GET_LEAD_GROUP_URL)
    .then((response => response.data))
}

// save Lead Group fetch api
export function saveLeadGroup(body:any) {
    return axios.post(SAVE_LEAD_GROUP_URL, body)
    .then((response => response.data))
}

// update Lead Group fetch api
export function updateLeadGroup(id:any ,body:any) {
    return axios.put(UPDATE_LEAD_GROUP_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Lead Group fetch api
export function deleteLeadGroup(id:any) {
    return axios.put(DELETE_LEAD_GROUP_URL+'/'+id)
    .then((response => response.data))
}


// Lead Status
export const GET_LEAD_STATUS_URL = `${API_URL}/get_lead_status`
export const SAVE_LEAD_STATUS_URL = `${API_URL}/save_lead_status`
export const UPDATE_LEAD_STATUS_URL = `${API_URL}/put_lead_status`
export const DELETE_LEAD_STATUS_URL = `${API_URL}/delete_lead_status`

// Lead Status fetch api
export function getLeadStatus() {
    return axios.get(GET_LEAD_STATUS_URL)
    .then((response => response.data))
}

// save Lead Status fetch api
export function saveLeadStatus(body:any) {
    return axios.post(SAVE_LEAD_STATUS_URL, body)
    .then((response => response.data))
}

// update Lead Status fetch api
export function updateLeadStatus(id:any ,body:any) {
    return axios.put(UPDATE_LEAD_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Lead Status fetch api
export function deleteLeadStatus(id:any) {
    return axios.put(DELETE_LEAD_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Furnishing Status
export const GET_FURNISHING_STATUS_URL = `${API_URL}/get_furnishing_status`
export const SAVE_FURNISHING_STATUS_URL = `${API_URL}/save_furnishing_status`
export const UPDATE_FURNISHING_STATUS_URL = `${API_URL}/put_furnishing_status`
export const DELETE_FURNISHING_STATUS_URL = `${API_URL}/delete_furnishing_status`

// Furnishing Status fetch api
export function getFurnishingStatus() {
    return axios.get(GET_FURNISHING_STATUS_URL)
    .then((response => response.data))
}

// save Furnishing Status fetch api
export function saveFurnishingStatus(body:any) {
    return axios.post(SAVE_FURNISHING_STATUS_URL, body)
    .then((response => response.data))
}

// update Furnishing Status fetch api
export function updateFurnishingStatus(id:any ,body:any) {
    return axios.put(UPDATE_FURNISHING_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Furnishing Status fetch api
export function deleteFurnishingStatus(id:any) {
    return axios.put(DELETE_FURNISHING_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Posession Status
export const GET_POSESSION_STATUS_URL = `${API_URL}/get_posession_status`
export const SAVE_POSESSION_STATUS_URL = `${API_URL}/save_posession_status`
export const UPDATE_POSESSION_STATUS_URL = `${API_URL}/put_posession_status`
export const DELETE_POSESSION_STATUS_URL = `${API_URL}/delete_posession_status`

// Posession Status fetch api
export function getPosessionStatus() {
    return axios.get(GET_POSESSION_STATUS_URL)
    .then((response => response.data))
}

// save Posession Status fetch api
export function savePosessionStatus(body:any) {
    return axios.post(SAVE_POSESSION_STATUS_URL, body)
    .then((response => response.data))
}

// update Posession Status fetch api
export function updatePosessionStatus(id:any ,body:any) {
    return axios.put(UPDATE_POSESSION_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Posession Status fetch api
export function deletePosessionStatus(id:any) {
    return axios.put(DELETE_POSESSION_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Vasthu Complaint
export const GET_VASTHU_COMPLAINT_URL = `${API_URL}/get_vasthu_compliant`
export const SAVE_VASTHU_COMPLAINT_URL = `${API_URL}/save_vasthu_compliant`
export const UPDATE_VASTHU_COMPLAINT_URL = `${API_URL}/put_vasthu_compliant`
export const DELETE_VASTHU_COMPLAINT_URL = `${API_URL}/delete_vasthu_compliant`

// Vasthu Complaint fetch api
export function getVasthuComplaint() {
    return axios.get(GET_VASTHU_COMPLAINT_URL)
    .then((response => response.data))
}

// save Vasthu Complaint fetch api
export function saveVasthuComplaint(body:any) {
    return axios.post(SAVE_VASTHU_COMPLAINT_URL, body)
    .then((response => response.data))
}

// update Vasthu Complaint fetch api
export function updateVasthuComplaint(id:any ,body:any) {
    return axios.put(UPDATE_VASTHU_COMPLAINT_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Vasthu Complaint fetch api
export function deleteVasthuComplaint(id:any) {
    return axios.put(DELETE_VASTHU_COMPLAINT_URL+'/'+id)
    .then((response => response.data))
}


// Key Custody
export const GET_KEY_CUSTODY_URL = `${API_URL}/get_key_custody`
export const SAVE_KEY_CUSTODY_URL = `${API_URL}/save_key_custody`
export const UPDATE_KEY_CUSTODY_URL = `${API_URL}/put_key_custody`
export const DELETE_KEY_CUSTODY_URL = `${API_URL}/delete_key_custody`

// Key Custody fetch api
export function getKeyCustody() {
    return axios.get(GET_KEY_CUSTODY_URL)
    .then((response => response.data))
}

// save Key Custody fetch api
export function saveKeyCustody(body:any) {
    return axios.post(SAVE_KEY_CUSTODY_URL, body)
    .then((response => response.data))
}

// update Key Custody fetch api
export function updateKeyCustody(id:any ,body:any) {
    return axios.put(UPDATE_KEY_CUSTODY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Key Custody fetch api
export function deleteKeyCustody(id:any) {
    return axios.put(DELETE_KEY_CUSTODY_URL+'/'+id)
    .then((response => response.data))
}


// Kitchen Type
export const GET_KITCHEN_TYPE_URL = `${API_URL}/get_kitchen_type`
export const SAVE_KITCHEN_TYPE_URL = `${API_URL}/save_kitchen_type`
export const UPDATE_KITCHEN_TYPE_URL = `${API_URL}/put_kitchen_type`
export const DELETE_KITCHEN_TYPE_URL = `${API_URL}/delete_kitchen_type`

// Kitchen Type fetch api
export function getKitchenType() {
    return axios.get(GET_KITCHEN_TYPE_URL)
    .then((response => response.data))
}

// save Kitchen Type fetch api
export function saveKitchenType(body:any) {
    return axios.post(SAVE_KITCHEN_TYPE_URL, body)
    .then((response => response.data))
}

// update Kitchen Type fetch api
export function updateKitchenType(id:any ,body:any) {
    return axios.put(UPDATE_KITCHEN_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Kitchen Type fetch api
export function deleteKitchenType(id:any) {
    return axios.put(DELETE_KITCHEN_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Flooring
export const GET_FLOORING_URL = `${API_URL}/get_flooring`
export const SAVE_FLOORING_URL = `${API_URL}/save_flooring`
export const UPDATE_FLOORING_URL = `${API_URL}/put_flooring`
export const DELETE_FLOORING_URL = `${API_URL}/delete_flooring`

// Flooring fetch api
export function getFlooring() {
    return axios.get(GET_FLOORING_URL)
    .then((response => response.data))
}

// save Flooring fetch api
export function saveFlooring(body:any) {
    return axios.post(SAVE_FLOORING_URL, body)
    .then((response => response.data))
}

// update Flooring fetch api
export function updateFlooring(id:any ,body:any) {
    return axios.put(UPDATE_FLOORING_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Flooring fetch api
export function deleteFlooring(id:any) {
    return axios.put(DELETE_FLOORING_URL+'/'+id)
    .then((response => response.data))
}


// Ownership Type
export const GET_OWNERSHIP_TYPE_URL = `${API_URL}/get_ownership_type`
export const SAVE_OWNERSHIP_TYPE_URL = `${API_URL}/save_ownership_type`
export const UPDATE_OWNERSHIP_TYPE_URL = `${API_URL}/put_ownership_type`
export const DELETE_OWNERSHIP_TYPE_URL = `${API_URL}/delete_ownership_type`

// Ownership Type fetch api
export function getOwnershipType() {
    return axios.get(GET_OWNERSHIP_TYPE_URL)
    .then((response => response.data))
}

// save Ownership Type fetch api
export function saveOwnershipType(body:any) {
    return axios.post(SAVE_OWNERSHIP_TYPE_URL, body)
    .then((response => response.data))
}

// update Ownership Type fetch api
export function updateOwnershipType(id:any ,body:any) {
    return axios.put(UPDATE_OWNERSHIP_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Ownership Type fetch api
export function deleteOwnershipType(id:any) {
    return axios.put(DELETE_OWNERSHIP_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Plot Type
export const GET_PLOT_TYPE_URL = `${API_URL}/get_plot_type`
export const SAVE_PLOT_TYPE_URL = `${API_URL}/save_plot_type`
export const UPDATE_PLOT_TYPE_URL = `${API_URL}/put_plot_type`
export const DELETE_PLOT_TYPE_URL = `${API_URL}/delete_plot_type`

// Plot Type fetch api
export function getPlotType() {
    return axios.get(GET_PLOT_TYPE_URL)
    .then((response => response.data))
}

// save Plot Type fetch api
export function savePlotType(body:any) {
    return axios.post(SAVE_PLOT_TYPE_URL, body)
    .then((response => response.data))
}

// update Plot Type fetch api
export function updatePlotType(id:any ,body:any) {
    return axios.put(UPDATE_PLOT_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Plot Type fetch api
export function deletePlotType(id:any) {
    return axios.put(DELETE_PLOT_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Property Facing
export const GET_PROPERTY_FACING_URL = `${API_URL}/get_property_facing`
export const SAVE_PROPERTY_FACING_URL = `${API_URL}/save_property_facing`
export const UPDATE_PROPERTY_FACING_URL = `${API_URL}/put_property_facing`
export const DELETE_PROPERTY_FACING_URL = `${API_URL}/delete_property_facing`

// Property Facing fetch api
export function getPropertyFacing() {
    return axios.get(GET_PROPERTY_FACING_URL)
    .then((response => response.data))
}

// save Property Facing fetch api
export function savePropertyFacing(body:any) {
    return axios.post(SAVE_PROPERTY_FACING_URL, body)
    .then((response => response.data))
}

// update Property Facing fetch api
export function updatePropertyFacing(id:any ,body:any) {
    return axios.put(UPDATE_PROPERTY_FACING_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Property Facing fetch api
export function deletePropertyFacing(id:any) {
    return axios.put(DELETE_PROPERTY_FACING_URL+'/'+id)
    .then((response => response.data))
}


// Property Source
export const GET_PROPERTY_SOURCE_URL = `${API_URL}/get_property_source`
export const SAVE_PROPERTY_SOURCE_URL = `${API_URL}/save_property_source`
export const UPDATE_PROPERTY_SOURCE_URL = `${API_URL}/put_property_source`
export const DELETE_PROPERTY_SOURCE_URL = `${API_URL}/delete_property_source`

// Property Source fetch api
export function getPropertySource() {
    return axios.get(GET_PROPERTY_SOURCE_URL)
    .then((response => response.data))
}

// save Property Source fetch api
export function savePropertySource(body:any) {
    return axios.post(SAVE_PROPERTY_SOURCE_URL, body)
    .then((response => response.data))
}

// update Property Source fetch api
export function updatePropertySource(id:any ,body:any) {
    return axios.put(UPDATE_PROPERTY_SOURCE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Property Source fetch api
export function deletePropertySource(id:any) {
    return axios.put(DELETE_PROPERTY_SOURCE_URL+'/'+id)
    .then((response => response.data))
}


// Property Status
export const GET_PROPERTY_STATUS_URL = `${API_URL}/get_property_status`
export const SAVE_PROPERTY_STATUS_URL = `${API_URL}/save_property_status`
export const UPDATE_PROPERTY_STATUS_URL = `${API_URL}/put_property_status`
export const DELETE_PROPERTY_STATUS_URL = `${API_URL}/delete_property_status`

// Property Status fetch api
export function getPropertyStatus() {
    return axios.get(GET_PROPERTY_STATUS_URL)
    .then((response => response.data))
}

// save Property Status fetch api
export function savePropertyStatus(body:any) {
    return axios.post(SAVE_PROPERTY_STATUS_URL, body)
    .then((response => response.data))
}

// update Property Status fetch api
export function updatePropertyStatus(id:any ,body:any) {
    return axios.put(UPDATE_PROPERTY_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Property Status fetch api
export function deletePropertyStatus(id:any) {
    return axios.put(DELETE_PROPERTY_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Segment
export const GET_SEGMENT_URL = `${API_URL}/get_segment`
export const SAVE_SEGMENT_URL = `${API_URL}/save_segment`
export const UPDATE_SEGMENT_URL = `${API_URL}/put_segment`
export const DELETE_SEGMENT_URL = `${API_URL}/delete_segment`

// Segment fetch api
export function getSegment() {
    return axios.get(GET_SEGMENT_URL)
    .then((response => response.data))
}

// save Segment fetch api
export function saveSegment(body:any) {
    return axios.post(SAVE_SEGMENT_URL, body)
    .then((response => response.data))
}

// update Segment fetch api
export function updateSegment(id:any ,body:any) {
    return axios.put(UPDATE_SEGMENT_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Segment fetch api
export function deleteSegment(id:any) {
    return axios.put(DELETE_SEGMENT_URL+'/'+id)
    .then((response => response.data))
}


// Water Supply
export const GET_WATER_SUPPLY_URL = `${API_URL}/get_water_supply`
export const SAVE_WATER_SUPPLY_URL = `${API_URL}/save_water_supply`
export const UPDATE_WATER_SUPPLY_URL = `${API_URL}/put_water_supply`
export const DELETE_WATER_SUPPLY_URL = `${API_URL}/delete_water_supply`

// Water Supply fetch api
export function getWaterSupply() {
    return axios.get(GET_WATER_SUPPLY_URL)
    .then((response => response.data))
}

// save Water Supply fetch api
export function saveWaterSupply(body:any) {
    return axios.post(SAVE_WATER_SUPPLY_URL, body)
    .then((response => response.data))
}

// update Water Supply fetch api
export function updateWaterSupply(id:any ,body:any) {
    return axios.put(UPDATE_WATER_SUPPLY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Water Supply fetch api
export function deleteWaterSupply(id:any) {
    return axios.put(DELETE_WATER_SUPPLY_URL+'/'+id)
    .then((response => response.data))
}


// City
export const GET_CITY_URL = `${API_URL}/get_city`
export const SAVE_CITY_URL = `${API_URL}/save_city`
export const UPDATE_CITY_URL = `${API_URL}/put_city`
export const DELETE_CITY_URL = `${API_URL}/delete_city`

// City fetch api
export function getCity() {
    return axios.get(GET_CITY_URL)
    .then((response => response.data))
}

// save City fetch api
export function saveCity(body:any) {
    return axios.post(SAVE_CITY_URL, body)
    .then((response => response.data))
}

// update City fetch api
export function updateCity(id:any ,body:any) {
    return axios.put(UPDATE_CITY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete City fetch api
export function deleteCity(id:any) {
    return axios.put(DELETE_CITY_URL+'/'+id)
    .then((response => response.data))
}


// Age of Property
export const GET_AGE_OF_PROPERTY_URL = `${API_URL}/get_age_of_property`
export const SAVE_AGE_OF_PROPERTY_URL = `${API_URL}/save_age_of_property`
export const UPDATE_AGE_OF_PROPERTY_URL = `${API_URL}/put_age_of_property`
export const DELETE_AGE_OF_PROPERTY_URL = `${API_URL}/delete_age_of_property`

// Age of Property fetch api
export function getAgeOfProperty() {
    return axios.get(GET_AGE_OF_PROPERTY_URL)
    .then((response => response.data))
}

// save Age of Property fetch api
export function saveAgeOfProperty(body:any) {
    return axios.post(SAVE_AGE_OF_PROPERTY_URL, body)
    .then((response => response.data))
}

// update Age of Property fetch api
export function updateAgeOfProperty(id:any ,body:any) {
    return axios.put(UPDATE_AGE_OF_PROPERTY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Age of Property fetch api
export function deleteAgeOfProperty(id:any) {
    return axios.put(DELETE_AGE_OF_PROPERTY_URL+'/'+id)
    .then((response => response.data))
}


// Task Type
export const GET_TASK_TYPE_URL = `${API_URL}/get_task_type`
export const SAVE_TASK_TYPE_URL = `${API_URL}/save_task_type`
export const UPDATE_TASK_TYPE_URL = `${API_URL}/put_task_type`
export const DELETE_TASK_TYPE_URL = `${API_URL}/delete_task_type`

// Task Type fetch api
export function getTaskType() {
    return axios.get(GET_TASK_TYPE_URL)
    .then((response => response.data))
}

// save Task Type fetch api
export function saveTaskType(body:any) {
    return axios.post(SAVE_TASK_TYPE_URL, body)
    .then((response => response.data))
}

// update Task Type fetch api
export function updateTaskType(id:any ,body:any) {
    return axios.put(UPDATE_TASK_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Task Type fetch api
export function deleteTaskType(id:any) {
    return axios.put(DELETE_TASK_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// Task Status
export const GET_TASK_STATUS_URL = `${API_URL}/get_task_status`
export const SAVE_TASK_STATUS_URL = `${API_URL}/save_task_status`
export const UPDATE_TASK_STATUS_URL = `${API_URL}/put_task_status`
export const DELETE_TASK_STATUS_URL = `${API_URL}/delete_task_status`

// Task Status fetch api
export function getTaskStatus() {
    return axios.get(GET_TASK_STATUS_URL)
    .then((response => response.data))
}

// save Task Status fetch api
export function saveTaskStatus(body:any) {
    return axios.post(SAVE_TASK_STATUS_URL, body)
    .then((response => response.data))
}

// update Task Status fetch api
export function updateTaskStatus(id:any ,body:any) {
    return axios.put(UPDATE_TASK_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Task Status fetch api
export function deleteTaskStatus(id:any) {
    return axios.put(DELETE_TASK_STATUS_URL+'/'+id)
    .then((response => response.data))
}


// Currency
export const GET_CURRENCY_URL = `${API_URL}/get_currency`
export const SAVE_CURRENCY_URL = `${API_URL}/save_currency`
export const UPDATE_CURRENCY_URL = `${API_URL}/put_currency`
export const DELETE_CURRENCY_URL = `${API_URL}/delete_currency`

// Currency fetch api
export function getCurrency() {
    return axios.get(GET_CURRENCY_URL)
    .then((response => response.data))
}

// save Currency fetch api
export function saveCurrency(body:any) {
    return axios.post(SAVE_CURRENCY_URL, body)
    .then((response => response.data))
}

// update Currency fetch api
export function updateCurrency(id:any ,body:any) {
    return axios.put(UPDATE_CURRENCY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Currency fetch api
export function deleteCurrency(id:any) {
    return axios.put(DELETE_CURRENCY_URL+'/'+id)
    .then((response => response.data))
}


// designation
export const GET_DESIGNATION_URL = `${API_URL}/get_designation`
export const SAVE_DESIGNATION_URL = `${API_URL}/save_designation`
export const UPDATE_DESIGNATION_URL = `${API_URL}/put_designation`
export const DELETE_DESIGNATION_URL = `${API_URL}/delete_designation`

// designation fetch api
export function getDesignation() {
    return axios.get(GET_DESIGNATION_URL)
    .then((response => response.data))
}

// save designation fetch api
export function saveDesignation(body:any) {
    return axios.post(SAVE_DESIGNATION_URL, body)
    .then((response => response.data))
}

// update designation fetch api
export function updateDesignation(id:any ,body:any) {
    return axios.put(UPDATE_DESIGNATION_URL+'/'+id, body)
    .then((response => response.data))
}

// delete designation fetch api
export function deleteDesignation(id:any) {
    return axios.put(DELETE_DESIGNATION_URL+'/'+id)
    .then((response => response.data))
}


// department
export const GET_DEPARTMENT_URL = `${API_URL}/get_department`
export const SAVE_DEPARTMENT_URL = `${API_URL}/save_department`
export const UPDATE_DEPARTMENT_URL = `${API_URL}/put_department`
export const DELETE_DEPARTMENT_URL = `${API_URL}/delete_department`

// department fetch api
export function getDepartment() {
    return axios.get(GET_DEPARTMENT_URL)
    .then((response => response.data))
}

// save department fetch api
export function saveDepartment(body:any) {
    return axios.post(SAVE_DEPARTMENT_URL, body)
    .then((response => response.data))
}

// update department fetch api
export function updateDepartment(id:any ,body:any) {
    return axios.put(UPDATE_DEPARTMENT_URL+'/'+id, body)
    .then((response => response.data))
}

// delete department fetch api
export function deleteDepartment(id:any) {
    return axios.put(DELETE_DEPARTMENT_URL+'/'+id)
    .then((response => response.data))
}


// branch
export const GET_BRANCH_URL = `${API_URL}/get_branch`
export const SAVE_BRANCH_URL = `${API_URL}/save_branch`
export const UPDATE_BRANCH_URL = `${API_URL}/put_branch`
export const DELETE_BRANCH_URL = `${API_URL}/delete_branch`

// branch fetch api
export function getBranch() {
    return axios.get(GET_BRANCH_URL)
    .then((response => response.data))
}

// save branch fetch api
export function saveBranch(body:any) {
    return axios.post(SAVE_BRANCH_URL, body)
    .then((response => response.data))
}

// update branch fetch api
export function updateBranch(id:any ,body:any) {
    return axios.put(UPDATE_BRANCH_URL+'/'+id, body)
    .then((response => response.data))
}

// delete branch fetch api
export function deleteBranch(id:any) {
    return axios.put(DELETE_BRANCH_URL+'/'+id)
    .then((response => response.data))
}


// property_in_depth
export const GET_PROPERTY_IN_DEPTH_URL = `${API_URL}/get_property_in_depth`
export const SAVE_PROPERTY_IN_DEPTH_URL = `${API_URL}/save_property_in_depth`
export const UPDATE_PROPERTY_IN_DEPTH_URL = `${API_URL}/put_property_in_depth`
export const DELETE_PROPERTY_IN_DEPTH_URL = `${API_URL}/delete_property_in_depth`

// property_in_depth fetch api
export function getPropertyInDepth() {
    return axios.get(GET_PROPERTY_IN_DEPTH_URL)
    .then((response => response.data))
}

// save property_in_depth fetch api
export function savePropertyInDepth(body:any) {
    return axios.post(SAVE_PROPERTY_IN_DEPTH_URL, body)
    .then((response => response.data))
}

// update property_in_depth fetch api
export function updatePropertyInDepth(id:any ,body:any) {
    return axios.put(UPDATE_PROPERTY_IN_DEPTH_URL+'/'+id, body)
    .then((response => response.data))
}

// delete property_in_depth fetch api
export function deletePropertyInDepth(id:any) {
    return axios.put(DELETE_PROPERTY_IN_DEPTH_URL+'/'+id)
    .then((response => response.data))
}


// country
export const GET_COUNTRY_URL = `${API_URL}/get_country`
export const SAVE_COUNTRY_URL = `${API_URL}/save_country`
export const UPDATE_COUNTRY_URL = `${API_URL}/put_country`
export const DELETE_COUNTRY_URL = `${API_URL}/delete_country`

// country fetch api
export function getCountry() {
    return axios.get(GET_COUNTRY_URL)
    .then((response => response.data))
}

// save country fetch api
export function saveCountry(body:any) {
    return axios.post(SAVE_COUNTRY_URL, body)
    .then((response => response.data))
}

// update country fetch api
export function updateCountry(id:any ,body:any) {
    return axios.put(UPDATE_COUNTRY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete country fetch api
export function deleteCountry(id:any) {
    return axios.put(DELETE_COUNTRY_URL+'/'+id)
    .then((response => response.data))
}


// ProjectStage
export const GET_PROJECT_STAGE_URL = `${API_URL}/get_project_stage`
export const SAVE_PROJECT_STAGE_URL = `${API_URL}/save_project_stage`
export const UPDATE_PROJECT_STAGE_URL = `${API_URL}/put_project_stage`
export const DELETE_PROJECT_STAGE_URL = `${API_URL}/delete_project_stage`

// ProjectStage fetch api
export function getProjectStage() {
    return axios.get(GET_PROJECT_STAGE_URL)
    .then((response => response.data))
}

// save ProjectStage fetch api
export function saveProjectStage(body:any) {
    return axios.post(SAVE_PROJECT_STAGE_URL, body)
    .then((response => response.data))
}

// update ProjectStage fetch api
export function updateProjectStage(id:any ,body:any) {
    return axios.put(UPDATE_PROJECT_STAGE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete ProjectStage fetch api
export function deleteProjectStage(id:any) {
    return axios.put(DELETE_PROJECT_STAGE_URL+'/'+id)
    .then((response => response.data))
}


// Specification
export const GET_SPECIFICATION_URL = `${API_URL}/get_specification`
export const SAVE_SPECIFICATION_URL = `${API_URL}/save_specification`
export const UPDATE_SPECIFICATION_URL = `${API_URL}/put_specification`
export const DELETE_SPECIFICATION_URL = `${API_URL}/delete_specification`

// get_specification fetch api
export function getSpecification() {
    return axios.get(GET_SPECIFICATION_URL)
    .then((response => response.data))
}

// save Specification fetch api
export function saveSpecification(body:any) {
    return axios.post(SAVE_SPECIFICATION_URL, body)
    .then((response => response.data))
}

// update Specification fetch api
export function updateSpecification(id:any ,body:any) {
    return axios.put(UPDATE_SPECIFICATION_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Specification fetch api
export function deleteSpecification(id:any) {
    return axios.put(DELETE_SPECIFICATION_URL+'/'+id)
    .then((response => response.data))
}


// SiteVisitPreference
export const GET_SITE_VISIT_PREFERANCE_URL = `${API_URL}/get_site_visit_preference`
export const SAVE_SITE_VISIT_PREFERANCE_URL = `${API_URL}/save_site_visit_preference`
export const UPDATE_SITE_VISIT_PREFERANCE_URL = `${API_URL}/put_site_visit_preference`
export const DELETE_SITE_VISIT_PREFERANCE_URL = `${API_URL}/delete_site_visit_preference`

// SiteVisitPreference fetch api
export function getSiteVisitPreference() {
    return axios.get(GET_SITE_VISIT_PREFERANCE_URL)
    .then((response => response.data))
}

// save SiteVisitPreference fetch api
export function saveSiteVisitPreference(body:any) {
    return axios.post(SAVE_SITE_VISIT_PREFERANCE_URL, body)
    .then((response => response.data))
}

// update SiteVisitPreference fetch api
export function updateSiteVisitPreference(id:any ,body:any) {
    return axios.put(UPDATE_SITE_VISIT_PREFERANCE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete SiteVisitPreference fetch api
export function deleteSiteVisitPreference(id:any) {
    return axios.put(DELETE_SITE_VISIT_PREFERANCE_URL+'/'+id)
    .then((response => response.data))
}


// AvailableFor
export const GET_AVAILABLE_FOR_URL = `${API_URL}/get_available_for`
export const SAVE_AVAILABLE_FOR_URL = `${API_URL}/save_available_for`
export const UPDATE_AVAILABLE_FOR_URL = `${API_URL}/put_available_for`
export const DELETE_AVAILABLE_FOR_URL = `${API_URL}/delete_available_for`

// AvailableFor fetch api
export function getAvailableFor() {
    return axios.get(GET_AVAILABLE_FOR_URL)
    .then((response => response.data))
}

// save AvailableFor fetch api
export function saveAvailableFor(body:any) {
    return axios.post(SAVE_AVAILABLE_FOR_URL, body)
    .then((response => response.data))
}

// update AvailableFor fetch api
export function updateAvailableFor(id:any ,body:any) {
    return axios.put(UPDATE_AVAILABLE_FOR_URL+'/'+id, body)
    .then((response => response.data))
}

// delete AvailableFor fetch api
export function deleteAvailableFor(id:any) {
    return axios.put(DELETE_AVAILABLE_FOR_URL+'/'+id)
    .then((response => response.data))
}


// Unit Type
export const GET_UNIT_TYPE_URL = `${API_URL}/get_unit_type`
export const SAVE_UNIT_TYPE_URL = `${API_URL}/save_unit_type`
export const UPDATE_UNIT_TYPE_URL = `${API_URL}/put_unit_type`
export const DELETE_UNIT_TYPE_URL = `${API_URL}/delete_unit_type`

// UnitType fetch api
export function getUnitType() {
    return axios.get(GET_UNIT_TYPE_URL)
    .then((response => response.data))
}

// save UnitType fetch api
export function saveUnitType(body:any) {
    return axios.post(SAVE_UNIT_TYPE_URL, body)
    .then((response => response.data))
}

// update UnitType fetch api
export function updateUnitType(id:any ,body:any) {
    return axios.put(UPDATE_UNIT_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete UnitType fetch api
export function deleteUnitType(id:any) {
    return axios.put(DELETE_UNIT_TYPE_URL+'/'+id)
    .then((response => response.data))
}


// AttendanceStatus
export const GET_ATTENDANCE_STATUS_URL = `${API_URL}/get_attendance_status`
export const SAVE_ATTENDANCE_STATUS_URL = `${API_URL}/save_attendance_status`
export const UPDATE_ATTENDANCE_STATUS_URL = `${API_URL}/put_attendance_status`
export const DELETE_ATTENDANCE_STATUS_URL = `${API_URL}/delete_attendance_status`

// AttendanceStatus fetch api
export function getAttendanceStatus() {
    return axios.get(GET_ATTENDANCE_STATUS_URL)
    .then((response => response.data))
}

// save AttendanceStatus fetch api
export function saveAttendanceStatus(body:any) {
    return axios.post(SAVE_ATTENDANCE_STATUS_URL, body)
    .then((response => response.data))
}

// update AttendanceStatus fetch api
export function updateAttendanceStatus(id:any ,body:any) {
    return axios.put(UPDATE_ATTENDANCE_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete AttendanceStatus fetch api
export function deleteAttendanceStatus(id:any) {
    return axios.put(DELETE_ATTENDANCE_STATUS_URL+'/'+id)
    .then((response => response.data))
}

// Priority
export const GET_PRIORITY_URL = `${API_URL}/get_priority`
export const SAVE_PRIORITY_URL = `${API_URL}/save_priority`
export const UPDATE_PRIORITY_URL = `${API_URL}/put_priority`
export const DELETE_PRIORITY_URL = `${API_URL}/delete_priority`

// Priority fetch api
export function getPriority() {
    return axios.get(GET_PRIORITY_URL)
    .then((response => response.data))
}

// save Priority fetch api
export function savePriority(body:any) {
    return axios.post(SAVE_PRIORITY_URL, body)
    .then((response => response.data))
}

// update Priority fetch api
export function updatePriority(id:any ,body:any) {
    return axios.put(UPDATE_PRIORITY_URL+'/'+id, body)
    .then((response => response.data))
}

// delete Priority fetch api
export function deletePriority(id:any) {
    return axios.put(DELETE_PRIORITY_URL+'/'+id)
    .then((response => response.data))
}


// portal
export const GET_PORTAL_URL = `${API_URL}/get_portal`
export const SAVE_PORTAL_URL = `${API_URL}/save_portal`
export const UPDATE_PORTAL_URL = `${API_URL}/put_portal`
export const DELETE_PORTAL_URL = `${API_URL}/delete_portal`

// portal fetch api
export function getPortal() {
    return axios.get(GET_PORTAL_URL)
    .then((response => response.data))
}

// save portal fetch api
export function savePortal(body:any) {
    return axios.post(SAVE_PORTAL_URL, body)
    .then((response => response.data))
}

// update portal fetch api
export function updatePortal(id:any ,body:any) {
    return axios.put(UPDATE_PORTAL_URL+'/'+id, body)
    .then((response => response.data))
}

// delete portal fetch api
export function deletePortal(id:any) {
    return axios.put(DELETE_PORTAL_URL+'/'+id)
    .then((response => response.data))
}


// money_terms
export const GET_MONEY_TERMS_URL = `${API_URL}/get_money_terms`
export const SAVE_MONEY_TERMS_URL = `${API_URL}/save_money_terms`
export const UPDATE_MONEY_TERMS_URL = `${API_URL}/put_money_terms`
export const DELETE_MONEY_TERMS_URL = `${API_URL}/delete_money_terms`

// money_terms fetch api
export function getMoneyTerms() {
    return axios.get(GET_MONEY_TERMS_URL)
    .then((response => response.data))
}

// save money_terms fetch api
export function saveMoneyTerms(body:any) {
    return axios.post(SAVE_MONEY_TERMS_URL, body)
    .then((response => response.data))
}

// update money_terms fetch api
export function updateMoneyTerms(id:any ,body:any) {
    return axios.put(UPDATE_MONEY_TERMS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete money_terms fetch api
export function deleteMoneyTerms(id:any) {
    return axios.put(DELETE_MONEY_TERMS_URL+'/'+id)
    .then((response => response.data))
}


// LegalApproval
export const GET_LEGAL_APPROVAL_URL = `${API_URL}/get_property_legal_approval`
export const SAVE_LEGAL_APPROVAL_URL = `${API_URL}/save_property_legal_approval`
export const UPDATE_LEGAL_APPROVAL_URL = `${API_URL}/put_property_legal_approval`
export const DELETE_LEGAL_APPROVAL_URL = `${API_URL}/delete_property_legal_approval`

// LegalApproval fetch api
export function getLegalApproval() {
    return axios.get(GET_LEGAL_APPROVAL_URL)
    .then((response => response.data))
}

// save LegalApproval fetch api
export function saveLegalApproval(body:any) {
    return axios.post(SAVE_LEGAL_APPROVAL_URL, body)
    .then((response => response.data))
}

// update LegalApproval fetch api
export function updateLegalApproval(id:any ,body:any) {
    return axios.put(UPDATE_LEGAL_APPROVAL_URL+'/'+id, body)
    .then((response => response.data))
}

// delete LegalApproval fetch api
export function deleteLegalApproval(id:any) {
    return axios.put(DELETE_LEGAL_APPROVAL_URL+'/'+id)
    .then((response => response.data))
}

// LeaveType
export const GET_LEAVE_TYPE_URL = `${API_URL}/get_leave_type`
export const SAVE_LEAVE_TYPE_URL = `${API_URL}/save_leave_type`
export const UPDATE_LEAVE_TYPE_URL = `${API_URL}/put_leave_type`
export const DELETE_LEAVE_TYPE_URL = `${API_URL}/delete_leave_type`

// LeaveType fetch api
export function getLeaveType() {
    return axios.get(GET_LEAVE_TYPE_URL)
    .then((response => response.data))
}

// save LeaveType fetch api
export function saveLeaveType(body:any) {
    return axios.post(SAVE_LEAVE_TYPE_URL, body)
    .then((response => response.data))
}

// update LeaveType fetch api
export function updateLeaveType(id:any ,body:any) {
    return axios.put(UPDATE_LEAVE_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete LeaveType fetch api
export function deleteLeaveType(id:any) {
    return axios.put(DELETE_LEAVE_TYPE_URL+'/'+id)
    .then((response => response.data))
}

// ExpenseType
export const GET_EXPENSE_TYPE_URL = `${API_URL}/get_expense_type`
export const SAVE_EXPENSE_TYPE_URL = `${API_URL}/save_expense_type`
export const UPDATE_EXPENSE_TYPE_URL = `${API_URL}/put_expense_type`
export const DELETE_EXPENSE_TYPE_URL = `${API_URL}/delete_expense_type`

// ExpenseType fetch api
export function getExpenseType() {
    return axios.get(GET_EXPENSE_TYPE_URL)
    .then((response => response.data))
}

// save ExpenseType fetch api
export function saveExpenseType(body:any) {
    return axios.post(SAVE_EXPENSE_TYPE_URL, body)
    .then((response => response.data))
}

// update ExpenseType fetch api
export function updateExpenseType(id:any ,body:any) {
    return axios.put(UPDATE_EXPENSE_TYPE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete ExpenseType fetch api
export function deleteExpenseType(id:any) {
    return axios.put(DELETE_EXPENSE_TYPE_URL+'/'+id)
    .then((response => response.data))
}

// FinancePaymentStatus
export const GET_FINANCE_PAYMENT_STATUS_URL = `${API_URL}/get_finance_payment_status`
export const SAVE_FINANCE_PAYMENT_STATUS_URL = `${API_URL}/save_finance_payment_status`
export const UPDATE_FINANCE_PAYMENT_STATUS_URL = `${API_URL}/put_finance_payment_status`
export const DELETE_FINANCE_PAYMENT_STATUS_URL = `${API_URL}/delete_finance_payment_status`

// FinancePaymentStatus fetch api
export function getFinancePaymentStatus() {
    return axios.get(GET_FINANCE_PAYMENT_STATUS_URL)
    .then((response => response.data))
}

// save FinancePaymentStatus fetch api
export function saveFinancePaymentStatus(body:any) {
    return axios.post(SAVE_FINANCE_PAYMENT_STATUS_URL, body)
    .then((response => response.data))
}

// update FinancePaymentStatus fetch api
export function updateFinancePaymentStatus(id:any ,body:any) {
    return axios.put(UPDATE_FINANCE_PAYMENT_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete FinancePaymentStatus fetch api
export function deleteFinancePaymentStatus(id:any) {
    return axios.put(DELETE_FINANCE_PAYMENT_STATUS_URL+'/'+id)
    .then((response => response.data))
}

// FeeConfirmationStatus
export const GET_FEE_CONFIRMATION_STATUS_URL = `${API_URL}/get_finance_feeconfirmation_status`
export const SAVE_FEE_CONFIRMATION_STATUS_URL = `${API_URL}/save_finance_feeconfirmation_status`
export const UPDATE_FEE_CONFIRMATION_STATUS_URL = `${API_URL}/put_finance_feeconfirmation_status`
export const DELETE_FEE_CONFIRMATION_STATUS_URL = `${API_URL}/delete_finance_feeconfirmation_status`

// FeeConfirmationStatus fetch api
export function getFeeConfirmationStatus() {
    return axios.get(GET_FEE_CONFIRMATION_STATUS_URL)
    .then((response => response.data))
}

// save FeeConfirmationStatus fetch api
export function saveFeeConfirmationStatus(body:any) {
    return axios.post(SAVE_FEE_CONFIRMATION_STATUS_URL, body)
    .then((response => response.data))
}

// update FeeConfirmationStatus fetch api
export function updateFeeConfirmationStatus(id:any ,body:any) {
    return axios.put(UPDATE_FEE_CONFIRMATION_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete FeeConfirmationStatus fetch api
export function deleteFeeConfirmationStatus(id:any) {
    return axios.put(DELETE_FEE_CONFIRMATION_STATUS_URL+'/'+id)
    .then((response => response.data))
}

// FinanceInvoiceStatus
export const GET_INVOICE_STATUS_URL = `${API_URL}/get_finance_invoice_status`
export const SAVE_INVOICE_STATUS_URL = `${API_URL}/save_finance_invoice_status`
export const UPDATE_INVOICE_STATUS_URL = `${API_URL}/put_finance_invoice_status`
export const DELETE_INVOICE_STATUS_URL = `${API_URL}/delete_finance_invoice_status`

// FinanceInvoiceStatus fetch api
export function getFinanceInvoiceStatus() {
    return axios.get(GET_INVOICE_STATUS_URL)
    .then((response => response.data))
}

// save FinanceInvoiceStatus fetch api
export function saveFinanceInvoiceStatus(body:any) {
    return axios.post(SAVE_INVOICE_STATUS_URL, body)
    .then((response => response.data))
}

// update FinanceInvoiceStatus fetch api
export function updateFinanceInvoiceStatus(id:any ,body:any) {
    return axios.put(UPDATE_INVOICE_STATUS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete FinanceInvoiceStatus fetch api
export function deleteFinanceInvoiceStatus(id:any) {
    return axios.put(DELETE_INVOICE_STATUS_URL+'/'+id)
    .then((response => response.data))
}

// FinancePaymentMode
export const GET_PAYMENT_MODE_URL = `${API_URL}/get_finance_paymentmode`
export const SAVE_PAYMENT_MODE_URL = `${API_URL}/save_finance_paymentmode`
export const UPDATE_PAYMENT_MODE_URL = `${API_URL}/put_finance_paymentmode`
export const DELETE_PAYMENT_MODE_URL = `${API_URL}/delete_finance_paymentmode`

// FinancePaymentMode fetch api
export function getFinancePaymentMode() {
    return axios.get(GET_PAYMENT_MODE_URL)
    .then((response => response.data))
}

// save FinancePaymentMode fetch api
export function saveFinancePaymentMode(body:any) {
    return axios.post(SAVE_PAYMENT_MODE_URL, body)
    .then((response => response.data))
}

// update FinancePaymentMode fetch api
export function updateFinancePaymentMode(id:any ,body:any) {
    return axios.put(UPDATE_PAYMENT_MODE_URL+'/'+id, body)
    .then((response => response.data))
}

// delete FinancePaymentMode fetch api
export function deleteFinancePaymentMode(id:any) {
    return axios.put(DELETE_PAYMENT_MODE_URL+'/'+id)
    .then((response => response.data))
}

// LostLeadReason
export const GET_LOST_LEAD_REASON_URL = `${API_URL}/get_lost_lead_reason`
export const SAVE_LOST_LEAD_REASON_URL = `${API_URL}/save_lost_lead_reason`
export const UPDATE_LOST_LEAD_REASON_URL = `${API_URL}/put_lost_lead_reason`
export const DELETE_LOST_LEAD_REASON_URL = `${API_URL}/delete_lost_lead_reason`

// LostLeadReason fetch api
export function getLostLeadReason() {
    return axios.get(GET_LOST_LEAD_REASON_URL)
    .then((response => response.data))
}

// save LostLeadReason fetch api
export function saveLostLeadReason(body:any) {
    return axios.post(SAVE_LOST_LEAD_REASON_URL, body)
    .then((response => response.data))
}

// update LostLeadReason fetch api
export function updateLostLeadReason(id:any ,body:any) {
    return axios.put(UPDATE_LOST_LEAD_REASON_URL+'/'+id, body)
    .then((response => response.data))
}

// delete LostLeadReason fetch api
export function deleteLostLeadReason(id:any) {
    return axios.put(DELETE_LOST_LEAD_REASON_URL+'/'+id)
    .then((response => response.data))
}

// DropLeadReason
export const GET_DROP_LEAD_REASON_URL = `${API_URL}/get_drop_lead_reason`
export const SAVE_DROP_LEAD_REASON_URL = `${API_URL}/save_drop_lead_reason`
export const UPDATE_DROP_LEAD_REASON_URL = `${API_URL}/put_drop_lead_reason`
export const DELETE_DROP_LEAD_REASON_URL = `${API_URL}/delete_drop_lead_reason`

// DropLeadReason fetch api
export function getDropLeadReason() {
    return axios.get(GET_DROP_LEAD_REASON_URL)
    .then((response => response.data))
}

// save DropLeadReason fetch api
export function saveDropLeadReason(body:any) {
    return axios.post(SAVE_DROP_LEAD_REASON_URL, body)
    .then((response => response.data))
}

// update DropLeadReason fetch api
export function updateDropLeadReason(id:any ,body:any) {
    return axios.put(UPDATE_DROP_LEAD_REASON_URL+'/'+id, body)
    .then((response => response.data))
}

// delete DropLeadReason fetch api
export function deleteDropLeadReason(id:any) {
    return axios.put(DELETE_DROP_LEAD_REASON_URL+'/'+id)
    .then((response => response.data))
}