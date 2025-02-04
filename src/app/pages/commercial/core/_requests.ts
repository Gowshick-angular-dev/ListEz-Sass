import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL   


export const GET_PROPERTY_DROPDOWNS_URL = `${API_URL}orgDropdown/property_dropdown`
export const GET_PROPERTIES_URL = `${API_URL}orgProperty/get/property`
export const GET_LOGS_URL = `${API_URL}orgLogs/get/logs`
export const SAVE_PROPERTY_URL = `${API_URL}orgProperty/save/property`
export const UPDATE_PROPERTY_URL = `${API_URL}orgProperty/update_property/property`
export const UPDATE_PROPERTY_UNIT_TYPE_URL = `${API_URL}orgProperty/update_property_unit_type/property`
export const UPDATE_PROPERTY_ADDRESS_URL = `${API_URL}orgProperty/update_property_address/property`
export const UPDATE_PROPERTY_FEATURES_URL = `${API_URL}orgProperty/update_property_residential/property`
export const UPDATE_PROPERTY_CONVENSIONAL_URL = `${API_URL}orgProperty/update_property_conventional/property`
export const UPDATE_PROPERTY_COWORKING_URL = `${API_URL}orgProperty/update_property_co_working/property`
export const UPDATE_PROPERTY_INDUSTRIAL_URL = `${API_URL}orgProperty/update_property_industrial/property`
export const UPDATE_PROPERTY_RETAIL_URL = `${API_URL}orgProperty/update_property_retail/property`
export const SAVE_PROPERTY_FILTER_URL = `${API_URL}orgProperty/save_property_filter/property`
export const GET_PROPERTY_FILTERS_URL = `${API_URL}orgProperty/get_property_filter/property`
export const DELETE_PROPERTY_URL = `${API_URL}orgProperty/delete/property`
export const SAVE_PROJECT_NOTES = `${API_URL}orgNotes/save/notes`
export const GET_PROJECT_NOTES = `${API_URL}orgNotes/get/notes`
export const DELETE_PROJECT_NOTES_URL = `${API_URL}orgNotes/delete/notes`
export const UPDATE_PROJECT_NOTES_URL = `${API_URL}orgNotes/update/notes`
export const UPLOAD_MULTI_FILE = `${API_URL}orgFiles/save/files`
export const GET_FILES = `${API_URL}orgFiles/get/files`
export const DELETE_PROJECT_FILE_URL = `${API_URL}orgFiles/delete/files`
export const UPDATE_PROPERTY_STATUS_URL = `${API_URL}orgProperty/update_property_status/property`
export const DELETE_PROPERTY_FILTER_URL = `${API_URL}orgProperty/delete_property_filter/property`
export const PROPERTY_LEADS_URL = `${API_URL}orgProperty/get_property_lead/property`
export const PROPERTY_TASKS_URL = `${API_URL}orgProperty/get_property_task/property`






export function getPropertyDropdowns() {
  return axios.get(GET_PROPERTY_DROPDOWNS_URL)
  .then((response => response.data))
}

export function getPropertyTasks(id:any) {
  return axios.get(PROPERTY_TASKS_URL+'/'+id)
  .then((response => response.data))
}

export function getPropertyLeads(id:any) {
  return axios.get(PROPERTY_LEADS_URL+'/'+id)
  .then((response => response.data))
}
 
// property fetch api
export function getProperties(body:any) {
  return axios.get(GET_PROPERTIES_URL+'?available_for='+body.available_for+'&commission_min='+body.commission_min+'&property_id='+body.project+'&commission_max='+body.commission_max+'&property_type='+body.property_type+'&amenities='+body.amenities+'&property_status='+body.property_status+'&country='+body.country+'&state='+body.state+'&city='+body.city+'&pincode='+body.zip_code+'&locality='+body.locality+'&segment='+body.segment+'&age_of_property='+body.age_of_property+'&property_facing='+body.property_facing+'&property_source='+body.property_source+'&gated_community='+body.gated_community+'&vasthu_compliant='+body.vasthu_compliant+'&no_of_units_min='+body.no_of_units_min+'&no_of_units_max='+body.no_of_units_max+'&no_of_floors_min='+body.no_of_floors_min+'&no_of_floors_max='+body.no_of_floors_max+'&rera_registered='+body.rera_registered+'&created_date='+body.created_date+'&created_end_date='+body.created_end_date+'&available_start_date='+body.available_start_date+'&available_end_date='+body.available_end_date+'&project_stage='+body.project_stage+'&property_indepth='+body.property_indepth+'&legal_approval='+body.legal_approval+'&created_by='+body.created_by+'&order_by='+body.sortBy+'&limit='+body.limit)
  .then((response => response.data))
}

// property log fetch api
export function getLog(propertyId:any) {
    return axios.get(GET_LOGS_URL+'/'+propertyId+'/3')
    .then((response => response.data))
}

// save property fetch api
export function saveProperty(postData:any) {
  return axios.post(SAVE_PROPERTY_URL, postData)
  .then((response => response.data))
}

// update property
export function updateProperty(id:any, body:any) {
  return axios.put(UPDATE_PROPERTY_URL+'/'+id, body)
  .then((response => response.data))
}

// update property
export function projectFilterDelete(id:any) {
  return axios.put(DELETE_PROPERTY_FILTER_URL+'/'+id)
  .then((response => response.data))
}

// update property unit Type
export function updatePropertyUnitType(id:any, body:any) {
  return axios.put(UPDATE_PROPERTY_UNIT_TYPE_URL+'/'+id, body)
  .then((response => response.data))
}

// update property address
export function updatePropertyAddress(id:any, body:any) {
  return axios.put(UPDATE_PROPERTY_ADDRESS_URL+'/'+id, body)
  .then((response => response.data))
}

// property features update api
export function updatePropertyFeatures(propertyId:any ,postData:any) {
    return axios.put(UPDATE_PROPERTY_FEATURES_URL+'/'+propertyId, postData)
    .then((response => response.data))
}

// property features update api
export function updatePropertyConvensional(propertyId:any ,postData:any) {
    return axios.put(UPDATE_PROPERTY_CONVENSIONAL_URL+'/'+propertyId, postData)
    .then((response => response.data))
}

// property features update api
export function updatePropertyCoWorking(propertyId:any ,postData:any) {
    return axios.put(UPDATE_PROPERTY_COWORKING_URL+'/'+propertyId, postData)
    .then((response => response.data))
}

// property features update api
export function updatePropertyIndustrial(propertyId:any ,postData:any) {
    return axios.put(UPDATE_PROPERTY_INDUSTRIAL_URL+'/'+propertyId, postData)
    .then((response => response.data))
}

// property features update api
export function updatePropertyRetail(propertyId:any ,postData:any) {
    return axios.put(UPDATE_PROPERTY_RETAIL_URL+'/'+propertyId, postData)
    .then((response => response.data))
}

// get Task Against Contact Id
export function savePropertyFilter(body:any) {
  return axios.post(SAVE_PROPERTY_FILTER_URL,body)
  .then((response => response.data))
}

// PropertyFilters fetch api
export function getPropertyFilters() {
  return axios.get(GET_PROPERTY_FILTERS_URL)
  .then((response => response.data))
}

// delete property residential
export function deleteProperty(id:any) {
  return axios.put(DELETE_PROPERTY_URL+'/'+id)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getPropertyNotes(propertyId:number) {
    return axios.get(GET_PROJECT_NOTES+'/'+propertyId+'/'+3)
    .then((response => response.data))
}

// get Task Against Contact Id
export function savePropertyNotes(body:any) {
  return axios.post(SAVE_PROJECT_NOTES,body)
  .then((response => response.data))
}

// update property unit Type
export function updatePropertyNotes(id:any, body:any) {
  return axios.put(UPDATE_PROJECT_NOTES_URL+'/'+id, body)
  .then((response => response.data))
}

// update property unit Type
export function deletePropertyNotes(noteId:any, parentId:any, property_id:any) {
  return axios.put(DELETE_PROJECT_NOTES_URL+'/'+noteId+'/'+parentId, {"module_id": property_id, "module_name": 3})
  .then((response => response.data))
}

// upload property
export function uploadMultipleFileProperty(propertyId:any ,postData:any) {
  return axios.post(UPLOAD_MULTI_FILE+'/'+propertyId, postData)
  .then((response => response.data))
}

// get Task Against Contact Id
export function getMultiImageProperty(Id:number) {
  return axios.get(GET_FILES+'/'+Id+'/'+3)
  .then((response => response.data))
}

// delete property multiple api
export function deleteMultiFileProperty(id:any, propertyId:any) {
    return axios.put(DELETE_PROJECT_FILE_URL+'/'+id, {"module_id": propertyId, "module_name": 3})
    .then((response => response.data))
}

// update property unit Type
export function updatePropertyStatus(id:any, body:any) {
  return axios.put(UPDATE_PROPERTY_STATUS_URL+'/'+id, body)
  .then((response => response.data))
}







export const GET_CONTACTS_URL = `${API_URL}/get_contact_drop_list`
export const GET_CURRENCY_URL = `${API_URL}/get_currency`
export const GET_COUNTRY_URL = `${API_URL}/get_country`
export const GET_PROJECT_URL = `${API_URL}/get_property_drop_list`
export const GET_PROPERTIES_TL_URL = `${API_URL}/get_properties_tl`
export const GET_PROPERTY_URL = `${API_URL}/get_property`
export const GET_AVAILABLE_FOR_URL = `${API_URL}/get_available_for`
export const GET_PROPERTY_TYPE_URL = `${API_URL}/get_property_type`
export const GET_PROPERTY_STATUS_URL = `${API_URL}/get_property_status`
export const GET_PROPERTY_SOURCE_URL = `${API_URL}/get_property_source`
export const GET_PROPERTY_IN_DEPTH_URL = `${API_URL}/get_property_in_depth`
export const GET_PROPERTY_FACING_URL = `${API_URL}/get_property_facing`
export const GET_AGE_OF_PROPERTY_URL = `${API_URL}/get_age_of_property`
export const GET_PROJECT_STAGE_URL = `${API_URL}/get_project_stage`
export const GET_SPECIFIACTIONS_URL = `${API_URL}/get_specification`
export const GET_SITE_VISIT_PREF_URL = `${API_URL}/get_site_visit_preference`
export const GET_KITCHEN_TYPE_URL = `${API_URL}/get_kitchen_type`
export const GET_OWNERSHIP_URL = `${API_URL}/get_ownership_type`
export const GET_FLOORING_URL = `${API_URL}/get_flooring`
export const GET_VASTHU_COMP_URL = `${API_URL}/get_vasthu_compliant`
export const GET_CITY_URL = `${API_URL}/get_city`
export const GET_SEGMENT_URL = `${API_URL}/get_segment`
export const GET_STATE_URL = `${API_URL}/get_state`
export const GET_ASSIGN_TO_URL = `${API_URL}/get_users`
export const GET_AMENITY_URL = `${API_URL}/get_amenities`
export const GET_UNIT_TYPE_URL = `${API_URL}/get_unit_type`
export const GET_KEY_CUSTODY_URL = `${API_URL}/get_key_custody`
export const UPDATE_PROP_STATUS_URL = `${API_URL}/put_propertyStatus_property`
export const GET_FURNISHING_STATUS_URL = `${API_URL}/get_furnishing_status`
export const GET_POSESSION_STATUS_URL = `${API_URL}/get_posession_status`
export const UPLOAD_FILE_PROPERTY = `${API_URL}/uploadfileProperty`
export const GET_PROPERTY_NOTES = `${API_URL}/get_all_property_notes`
export const DELETE_MULTI_PROPERTY_URL = `${API_URL}/delete_property_multiple`
export const UPLOAD_MULITI_IMAGES_PROPERTY_URL = `${API_URL}/upload_mimages_property`
export const GET_MULITI_IMAGES_PROPERTY_URL = `${API_URL}/get_mimages_property`
export const DELETE_MULITI_IMAGES_PROPERTY_URL = `${API_URL}/delete_mimages_property`
export const GET_LEAD_PROPERTY_URL = `${API_URL}/get_lead_property`
export const GET_TASK_PROPERTY_URL = `${API_URL}/get_task_property`
export const GET_PROP_FEATURES_LIST_URL = `${API_URL}/get_property_unittype`
export const GET_PROPERTY_FILTER_URL = `${API_URL}/get_property_filter`
export const GET_PROPERTY_UNIT_TYPE_URL = `${API_URL}/put_property_unittype`
export const DELETE_PROPERTY_UNIT_TYPE_URL = `${API_URL}/delete_property_unittype`



export const UPDATE_PROPERTY_RESIDENTIAL_URL = `${API_URL}/update_property_residential`
export const GET_PROPERTY_NOTES_URL = `${API_URL}/get_all_property_notes`
export const SAVE_PROPERTY_NOTES_URL = `${API_URL}/save_property_notes`
export const UPDATE_PROPERTY_NOTES_URL = `${API_URL}/update_property_notes`
export const DELETE_PROPERTY_NOTES_URL = `${API_URL}/delete_property_notes`












// update property residential
export function updatePropertyResidential(id:any, body:any) {
  return axios.put(UPDATE_PROPERTY_RESIDENTIAL_URL+'/'+id, body)
  .then((response => response.data))
}








export function getPropertiesTl(userId:any, roleId:any) {
  return axios.get(GET_PROPERTIES_TL_URL+'/'+userId+'/'+roleId+'/'+userId)
  .then((response => response.data))
}
 
// property dropdown fetch api
export function getProjects(userId:any, roleId:any) {
  return axios.get(GET_PROJECT_URL+'/'+userId+'/'+roleId+'/'+userId)
  .then((response => response.data))
}

// project stage fetch api
export function getCountries() {
  return axios.get(GET_COUNTRY_URL)
  .then((response => response.data))
}

// project stage fetch api
export function getProjectStage() {
  return axios.get(GET_PROJECT_STAGE_URL)
  .then((response => response.data))
}

// Specification fetch api
export function getSpecification() {
  return axios.get(GET_SPECIFIACTIONS_URL)
  .then((response => response.data))
}

// Site visit preference fetch api
export function getSiteVisitPref() {
  return axios.get(GET_SITE_VISIT_PREF_URL)
  .then((response => response.data))
}

// age of property fetch api
export function getAgeOfProperty() {
  return axios.get(GET_AGE_OF_PROPERTY_URL)
  .then((response => response.data))
}

// property fetch api
export function getPropertyType() {
  return axios.get(GET_PROPERTY_TYPE_URL)
  .then((response => response.data))
}

// property fetch api
export function getPropertyStatus() {
  return axios.get(GET_PROPERTY_STATUS_URL)
  .then((response => response.data))
}

// property source fetch api
export function getPropertySource() {
  return axios.get(GET_PROPERTY_SOURCE_URL)
  .then((response => response.data))
}

// property facing fetch api
export function getPropertyFacing() {
  return axios.get(GET_PROPERTY_FACING_URL)
  .then((response => response.data))
}

// property In-depth fetch api
export function getPropertyInDepth() {
  return axios.get(GET_PROPERTY_IN_DEPTH_URL)
  .then((response => response.data))
}

// kitchen type fetch api
export function getKitchenType() {
  return axios.get(GET_KITCHEN_TYPE_URL)
  .then((response => response.data))
}

// flooring fetch api
export function getFlooring() {
  return axios.get(GET_FLOORING_URL)
  .then((response => response.data))
}

// key custody fetch api
export function getKeyCustody() {
  return axios.get(GET_KEY_CUSTODY_URL)
  .then((response => response.data))
}

// vasthu complaint fetch api
export function getVasthuComp() {
  return axios.get(GET_VASTHU_COMP_URL)
  .then((response => response.data))
}

// get asking for
export function getAvailableFor() {
  return axios.get(GET_AVAILABLE_FOR_URL)
  .then((response => response.data))
}

// furnishing status list fetch api
export function getFurnishStatus() {
  return axios.get(GET_FURNISHING_STATUS_URL)
  .then((response => response.data))
}

// possess status list fetch api
export function getPosesStatus() {
  return axios.get(GET_POSESSION_STATUS_URL)
  .then((response => response.data))
}

// furnishing status list fetch api
export function getOwnershipType() {
  return axios.get(GET_OWNERSHIP_URL)
  .then((response => response.data))
}

// contact list fetch api
export function getContacts(id:any, role:any) {
  return axios.get(GET_CONTACTS_URL+'/'+id+'/'+role+'/'+id)
  .then((response => response.data))
}

// get segment
export function getSegment() {
  return axios.get(GET_SEGMENT_URL)
  .then((response => response.data))
}

// contact list fetch api
export function getCurrency() {
  return axios.get(GET_CURRENCY_URL)
  .then((response => response.data))
}

// city list fetch api
export function getCity() {
  return axios.get(GET_CITY_URL)
  .then((response => response.data))
}

// state list fetch api
export function getState() {
  return axios.get(GET_STATE_URL)
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

// unit type fetch api
export function getUnitType() {
  return axios.get(GET_UNIT_TYPE_URL)
  .then((response => response.data))
}

// property detail fetch api
export function getPropertyDetail(propertyId:any) {
    return axios.get(GET_PROPERTY_URL+'/'+propertyId)
    .then((response => response.data))
}


// upload contact
export function uploadFileProperty(postData:any, headers:any) {
  return axios.post(UPLOAD_FILE_PROPERTY,postData, headers)
  .then((response => response.data))
}

// delete property multiple api
export function deleteMultipleProperty(propertyId:any) {
  if(propertyId != null){
    return axios.put(DELETE_MULTI_PROPERTY_URL+'/'+propertyId)
    .then((response => response.data))
  }
}

// get Task Against Contact Id
export function getMulitiFileProperty(propertyId:number) {
  if(propertyId != null){
    return axios.get(GET_MULITI_IMAGES_PROPERTY_URL+'/'+propertyId)
    .then((response => response.data))
  }
}


// get Task Against Contact Id
export function getLeadProperty(propertyId:number) {
  if(propertyId != null){
    return axios.get(GET_LEAD_PROPERTY_URL+'/'+propertyId)
    .then((response => response.data))
  }
}

// get Task Against Contact Id
export function getTaskProperty(propertyId:number) {
  if(propertyId != null){
    return axios.get(GET_TASK_PROPERTY_URL+'/'+propertyId)
    .then((response => response.data))
  }
}


// property features list fetch api
export function getFeaturesList(propertyId:any) {
  if(propertyId != null){
    return axios.get(GET_PROP_FEATURES_LIST_URL+'/'+propertyId)
    .then((response => response.data))
  }
}


// property fetch api
export function getPropertiesSortBy(userId:any, roleId:any, sortBy:any) {
  return axios.get(GET_PROPERTIES_URL+'/'+userId+'/'+roleId+'/'+userId+'?order_by='+sortBy)
  .then((response => response.data))
}



// PropertyFilters fetch api
export function getPropertyFilter(Id:any) {
  return axios.get(GET_PROPERTY_FILTER_URL+'/'+Id)
  .then((response => response.data))
}






