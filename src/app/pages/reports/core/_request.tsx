import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL 


//Contact
export const GET_CONTACT_REPORT_URL = `${API_URL}orgReports/get_contact_report`
export const GET_LEAD_REPORT_URL = `${API_URL}orgReports/get_leads_report`
export const GET_PROJECT_REPORT_URL = `${API_URL}orgReports/get_property_report`
export const GET_TRANSACTION_REPORT_URL = `${API_URL}orgReports/get_transaction_report`
export const GET_TASK_REPORT_URL = `${API_URL}orgReports/get_task_report`
export const GET_REPORT_COUNT_URL = `${API_URL}orgReports/get_report_count`
export const GET_REPORT_HR_URL = `${API_URL}orgReports/get_hr_report`
export const GET_REPORT_FINANCE_URL = `${API_URL}orgReports/get_finance_report`


export function getContactReports(body:any) {
    return axios.get(GET_CONTACT_REPORT_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&contact_status='+body.contact_status+'&source='+body.source+'&city='+body.city+'&contact_group='+body.contact_group+'&contact_category='+body.contact_category+'&company_name='+body.company_name+'&contact_type='+body.contact_type+'&gender='+body.gender+'&locality='+body.locality+'&project_id='+body.project_id+'&state='+body.state+'&created_name='+(body.created_by ?? '')+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getLeadReports(body:any) {
    return axios.get(GET_LEAD_REPORT_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&source='+body.source+'&lead_group='+body.lead_group+'&property_type='+body.property_type+'&lead_status='+body.lead_status+'&budget_min='+body.builder_name?.split('- ')[0]+'&budget_max='+(body.builder_name?.split('- ')[1] ?? '')+'&contact_status='+body.re_assign+'&task_type='+body.task_type+'&city='+body.city+'&project_name='+body.project_name+'&locality='+body.locality+'&looking_for='+body.looking_for+'&lead_lost_reason='+body.lost_lead+'&campain='+body.campain+'&state='+body.state+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getProjectReports(body:any) {
    return axios.get(GET_PROJECT_REPORT_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&property_status='+body.property_status+'&segment='+body.segment+'&property_type='+body.property_type+'&builder_name='+body.builder_name+'&project_name='+body.property_name+'&city='+body.city+'&company='+body.company+'&configuration='+body.configuration+'&locality='+body.locality+'&site_inspection='+body.site_inspection+'&source='+body.source+'&state='+body.state+'&created_name='+(body.created_by ?? '')+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getTranReports(body:any) {
    return axios.get(GET_TRANSACTION_REPORT_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&transaction_source='+body.transaction_source+'&city='+body.city+'&project_name='+body.project_name+'&property_type='+body.property_type+'&transaction_status='+body.property_status+'&state='+body.state+'&locality='+body.locality+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getTaskReports(body:any) {
    return axios.get(GET_TASK_REPORT_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&task_status='+body.task_status+'&task_type='+body.task_type+'&priority='+body.priority+'&project='+body.project_name+'&locality='+body.locality+'&country='+'&state='+body.state+'&city='+body.city+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getHRReports(body:any) {
    return axios.get(GET_REPORT_HR_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&leave_type='+body.leave_type+'&attendance_status='+body.attendance_type+'&gender='+body.gender+'&branch_name='+body.city+'&dob='+body.age+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getFinanceReports(body:any) {
    return axios.get(GET_REPORT_FINANCE_URL+'/'+body.module+'/'+body.userId+'/'+body.team+'?filter_by='+body.filter+'&expenses_type='+body.expenses_type+'&created_by='+body.created_by+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}

export function getCountReports(module:any, user:any, team:any, body:any) {
    return axios.get(GET_REPORT_COUNT_URL+'/'+module+'/'+user+'/'+team+'?filter_by='+body.filter+'&start_date='+body.start_date+'&end_date='+body.end_date)
    .then((response => response.data))
}


//lead
export const GET_COUNT_CITY_LEAD_URL = `${API_URL}/get_count_city_lead`
export const GET_COUNT_PROPERTY_TYPE_LEAD_URL = `${API_URL}/get_count_property_type_lead`
export const GET_COUNT_LEAD_URL = `${API_URL}/get_count_lead`
export const GET_COUNT_SOURCE_LEAD_URL = `${API_URL}/get_count_source_lead`
export const GET_COUNT_STATUS_LEAD_URL = `${API_URL}/get_count_status_lead`

export function getCountCityLead() {
    return axios.get(GET_COUNT_CITY_LEAD_URL)
    .then((response => response.data))
}

export function getCountPropertyTypeLead() {
    return axios.get(GET_COUNT_PROPERTY_TYPE_LEAD_URL)
    .then((response => response.data))
}

export function getCountLead() {
    return axios.get(GET_COUNT_LEAD_URL)
    .then((response => response.data))
}

export function getCountSourceLead() {
    return axios.get(GET_COUNT_SOURCE_LEAD_URL)
    .then((response => response.data))
}

export function getCountStatusLead() {
    return axios.get(GET_COUNT_STATUS_LEAD_URL)
    .then((response => response.data))
}

//property
export const GET_COUNT_PROPERTY_URL = `${API_URL}/get_count_property`
export const GET_COUNT_STATUS_PROPERTY_URL = `${API_URL}/get_count_status_property`
export const GET_COUNT_CITYWISE_PROPERTY_URL = `${API_URL}/get_count_citywise_property`
export const GET_COUNT_SEGMENT_PROPERTY_URL = `${API_URL}/get_count_segment_property`
export const GET_COUNT_PROPERTY_TYPE_URL = `${API_URL}/get_count_property_type_property`

export function getCountProperty() {
    return axios.get(GET_COUNT_PROPERTY_URL)
    .then((response => response.data))
}

export function getCountStatusProperty() {
    return axios.get(GET_COUNT_STATUS_PROPERTY_URL)
    .then((response => response.data))
}

export function getCountCitywiseProperty() {
    return axios.get(GET_COUNT_CITYWISE_PROPERTY_URL)
    .then((response => response.data))
}

export function getCountSegmentProperty() {
    return axios.get(GET_COUNT_SEGMENT_PROPERTY_URL)
    .then((response => response.data))
}

export function getCountPropertyType() {
    return axios.get(GET_COUNT_PROPERTY_TYPE_URL)
    .then((response => response.data))
}

//task
export const GET_COUNT_TASK_TYPE_URL = `${API_URL}/get_count_task_type_task`
export const GET_COUNT_STATUS_TASK_URL = `${API_URL}/get_count_status_task`

export function getCountTaskType() {
    return axios.get(GET_COUNT_TASK_TYPE_URL)
    .then((response => response.data))
}

export function getCountStatusTask() {
    return axios.get(GET_COUNT_STATUS_TASK_URL)
    .then((response => response.data))
}