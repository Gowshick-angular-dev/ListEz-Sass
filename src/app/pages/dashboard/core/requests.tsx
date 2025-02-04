import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL


//SUPER ADMIN DASHBOARD

export const GET_ADMIN_COUNT_ALL_URL = `${API_URL}dashboard/count_dashboard`


export function getAdminCountAll() {
    return axios.get(GET_ADMIN_COUNT_ALL_URL)
    .then((response => response.data))
}



//ADMIN DASHBOARD
export const GET_COUNT_ALL_URL = `${API_URL}orgDashboard/get_dashboard_count`

//ORG DASHBOARD
export const GET_COUNT_URL = `${API_URL}orgDashboard/get_dashboard_bar_count`
export const GET_MASTERS_COUNT_URL = `${API_URL}orgDashboard/get_dashboard_masters_count`
export const GET_TASKS_COUNT_URL = `${API_URL}orgDashboard/get_dashboard_task_count`
export const GET_GOALS_COUNT_URL = `${API_URL}orgDashboard/get_dashboard_goals`

// DASHBOARD DROPDOWNS
export const GET_DASHBOARD_DROPDOWNS_URL = `${API_URL}orgDashboard/get_dashboard_users`


//Check-in
export const SAVE_ATTENDANCE_CHECKIN_URL = `${API_URL}orgAttendance/checkIn/attendance`
export const HR_DASHBOARD_URL = `${API_URL}orgDashboard/get_dashboard_hr`



export function getCountAll() {
    return axios.get(GET_COUNT_ALL_URL)
    .then((response => response.data))
}

export function getCounts(user:any, team:any, module:any, filter:any) {  
    return axios.get(GET_COUNT_URL+'/'+module+'/'+filter.filter+'/'+user+'/'+team+'?start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

export function getMastersCount(master:any, module:any, user:any, team:any, filter:any) {
    return axios.get(GET_MASTERS_COUNT_URL+'/'+master+'/'+module+'/'+user+'/'+team+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

export function getTasksCount(module:any, user:any, team:any, filter:any) {
    return axios.get(GET_TASKS_COUNT_URL+'/'+module+'/'+user+'/'+team+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

export function getGoalsCount(module:any, user:any, team:any, filter:any) {
    return axios.get(GET_GOALS_COUNT_URL+'/'+module+'/'+user+'/'+team+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

export function getDashboardDropdowns() {
    return axios.get(GET_DASHBOARD_DROPDOWNS_URL)
    .then((response => response.data))
}


// check-in
export function saveAttendanceCheckin(body:any) {
    return axios.post(SAVE_ATTENDANCE_CHECKIN_URL, body)
    .then((response => response.data))
}

export function getUserIP() {
    return fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(data => data.ip)
    .catch(error => console.error(error));
}

//AttendanceChart
export function getAttendanceChart() {
    return axios.get(HR_DASHBOARD_URL)
    .then((response => response.data))
}





//contact
export const GET_COUNT_CONTACT_URL = `${API_URL}/get_count_contact`
export const GET_COUNT_SOURCE_URL = `${API_URL}/get_count_source`
export const GET_COUNT_TYPE_URL = `${API_URL}/get_count_contact_type`
export const GET_COUNT_CATEGORY_URL = `${API_URL}/get_count_contact_category`
export const GET_COUNT_STATUS_URL = `${API_URL}/get_count_contact_status`
export const GET_COUNT_GROUP_URL = `${API_URL}/get_count_contact_group`
export const GET_COUNT_CITY_URL = `${API_URL}/get_count_contact_city`
export const GET_COUNT_LOCALITY_URL = `${API_URL}/get_count_contact_locality`
export const GET_COUNT_STATE_URL = `${API_URL}/get_count_contact_state`
export const GET_COUNT_GENDER_URL = `${API_URL}/get_count_contact_gender`
export const GET_COUNT_NATIONALITY_URL = `${API_URL}/get_count_contact_nationality`
export const GET_COUNT_CONTACT_PROPERTY_URL = `${API_URL}/get_count_contact_property_name`
export const GET_COUNT_TASK_STATUS_URL = `${API_URL}/get_count_task_status`
export const GET_COUNT_CONTACT_COMPANY_URL = `${API_URL}/get_count_contact_company_name`

//lead
export const GET_COUNT_LEAD_URL = `${API_URL}/get_count_lead`
export const GET_COUNT_SOURCE_LEAD_URL = `${API_URL}/get_count_source_lead`
export const GET_COUNT_STATUS_LEAD_URL = `${API_URL}/get_count_status_lead`
export const GET_COUNT_CITY_LEAD_URL = `${API_URL}/get_count_city_lead`
export const GET_COUNT_PROPERTY_TYPE_LEAD_URL = `${API_URL}/get_count_property_type_lead`
export const GET_COUNT_LOOKING_FOR_LEAD_URL = `${API_URL}/get_count_looking_for_lead`
export const GET_COUNT_GROUP_LEAD_URL = `${API_URL}/get_count_group_lead`
export const GET_COUNT_LOCALITY_LEAD_URL = `${API_URL}/get_count_locality_lead`
export const GET_COUNT_STATE_LEAD_URL = `${API_URL}/get_count_state_lead`
export const GET_COUNT_PROPERTY_COMPANY_NAME_LEAD_URL = `${API_URL}/get_count_property_company_name_lead`
export const GET_COUNT_PROPERTY_NAME_LEAD_URL = `${API_URL}/get_count_property_name_lead`

//property
export const GET_COUNT_PROPERTY_URL = `${API_URL}/get_count_property`
export const GET_COUNT_SOURCE_PROPERTY_URL = `${API_URL}/get_count_source_property`
export const GET_COUNT_STATUS_PROPERTY_URL = `${API_URL}/get_count_status_property`
export const GET_COUNT_CITYWISE_PROPERTY_URL = `${API_URL}/get_count_citywise_property`
export const GET_COUNT_TYPE_PROPERTY_URL = `${API_URL}/get_count_property_type_property`
export const GET_COUNT_COMPANY_NAME_PROPERTY_URL = `${API_URL}/get_count_property_company_name_property`
export const GET_COUNT_LOCALITY_PROPERTY_URL = `${API_URL}/get_count_locality_property`
export const GET_COUNT_STATE_PROPERTY_URL = `${API_URL}/get_count_state_property`

//task
export const GET_COUNT_TASK_URL = `${API_URL}/get_count_task`
export const GET_COUNT_PRIORITY_TASK_URL = `${API_URL}/get_count_priority_task`
export const GET_COUNT_PROPERTY_NAME_URL = `${API_URL}/get_count_property_name_task`
export const GET_COUNT_TASK_STATUS_TASK_URL = `${API_URL}/get_count_task_status_task`
export const GET_COUNT_LOCALITY_TASK_URL = `${API_URL}/get_count_locality_task`
export const GET_COUNT_CITY_TASK_URL = `${API_URL}/get_count_city_task`
export const GET_COUNT_STATE_TASK_URL = `${API_URL}/get_count_state_task`
export const GET_COUNT_TASK_TYPE_TASK_URL = `${API_URL}/get_count_task_type_task`

//Transaction
export const GET_COUNT_TRANSACTION_URL = `${API_URL}/get_count_transaction`
export const GET_COUNT_PROPERTY_TRANSACTION_URL = `${API_URL}/get_count_property_transaction`

//attendance

export const GET_ATTENDANCE_TODAY_CHECKIN_URL = `${API_URL}/get_attendance_today_checkin`
export const GET_ATTENDANCE_CHART_URL = `${API_URL}/get_attendance_present`


//Goals
export const GET_GOAL_STATUS_CHANGED_URL = `${API_URL}/get_goal_status_changed`
export const GET_GOAL_TALKTIME_URL = `${API_URL}/get_goal_talk_time`
export const GET_GOAL_LEADS_GENERATED_URL = `${API_URL}/get_goal_leads_generated`
export const GET_GOAL_LEADS_CONVERTED_URL = `${API_URL}/get_goal_leads_converted`
export const GET_GOAL_SITE_VISIT_URL = `${API_URL}/get_goal_site_visit`
export const GET_GOAL_MEETINGS_URL = `${API_URL}/get_goal_meetings`
export const GET_GOAL_BOOKINGS_URL = `${API_URL}/get_goal_bookings`
export const GET_GOAL_REVENUE_URL = `${API_URL}/get_goal_revenue`


//Task Overview
export const GET_TASK_STATUS_CONTACT_URL = `${API_URL}/get_count_taskoverview_contact`
export const GET_TASK_STATUS_LEAD_URL = `${API_URL}/get_count_taskoverview_lead`
export const GET_TASK_STATUS_PROPERTY_URL = `${API_URL}/get_count_taskoverview_property`
export const GET_TASK_STATUS_TASK_URL = `${API_URL}/get_count_taskoverview_task`


//ALL

// getAttendanceCountAll fetch api
export function getAttendanceTodayCheckin(id:any, role:any, userId:any) {
    return axios.get(GET_ATTENDANCE_TODAY_CHECKIN_URL+'/'+id+'/'+role+'/'+userId)
    .then((response => response.data))
}

//CONTACT

// getCountContact fetch api
export function getCountContact(id:any, role:any, req:any, filter:any, team:any) {  
    return axios.get(GET_COUNT_CONTACT_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountSource fetch api
export function getCountSource(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_SOURCE_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountType fetch api
export function getCountType(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TYPE_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountCategory fetch api
export function getCountCategory(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CATEGORY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountStatus fetch api
export function getCountStatus(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATUS_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountGroup fetch api
export function getCountGroup(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_GROUP_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountCity fetch api
export function getCountCity(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CITY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountLocality fetch api
export function getCountLocality(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_LOCALITY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountState fetch api
export function getCountState(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATE_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountGender fetch api
export function getCountGender(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_GENDER_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountNationality fetch api
export function getCountNationality(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_NATIONALITY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountContact Property fetch api
export function getCountContactPropertyName(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CONTACT_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountContact Property fetch api
export function getCountContactCompanyName(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CONTACT_COMPANY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountTaskStatus fetch api
export function getCountTaskStatus(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TASK_STATUS_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}


//LEAD

// getCountLead fetch api
export function getCountLead(id:any, role:any, req:any, filter:any, team:any) {  
    console.log('id', 'role', 'req', 'filter');  
    console.log(id, role, req, filter);  
    return axios.get(GET_COUNT_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountSourceLead fetch api
export function getCountSourceLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_SOURCE_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountStatusLead fetch api
export function getCountStatusLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATUS_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountCityLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CITY_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountPropertyTypeLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PROPERTY_TYPE_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountLookingForLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_LOOKING_FOR_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountGroupLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_GROUP_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountLocalityLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_LOCALITY_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountStateLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATE_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountCompanyNameLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PROPERTY_COMPANY_NAME_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusLead fetch api
export function getCountPropertyNameLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PROPERTY_NAME_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}


//PROPERTY

// getCountProperty fetch api
export function getCountProperty(id:any, role:any, req:any, filter:any) {
    return axios.get(GET_COUNT_PROPERTY_URL+'/'+id+'/'+role+'/'+id+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

// getCountSourceProperty fetch api
export function getCountSourceProperty(id:any, role:any, req:any, filter:any) {
    return axios.get(GET_COUNT_SOURCE_PROPERTY_URL+'/'+id+'/'+role+'/'+id+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date)
    .then((response => response.data))
}

// getCountStatusProperty fetch api
export function getCountStatusProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATUS_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountCitywiseProperty fetch api
export function getCountCitywiseProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CITYWISE_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountTypeProperty fetch api
export function getCountTypeProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TYPE_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountCompanyNameProperty fetch api
export function getCountCompanyNameProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_COMPANY_NAME_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountLocalityProperty fetch api
export function getCountLocalityProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_LOCALITY_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStateProperty fetch api
export function getCountStateProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATE_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}


//TASK

// getCountTask fetch api
export function getCountTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

// getCountStatusPriority fetch api
export function getCountPriorityTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PRIORITY_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountPropertyNameTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PROPERTY_NAME_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountTaskStatusTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TASK_STATUS_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountLocalityTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_LOCALITY_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountCityTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_CITY_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountStateTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_STATE_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountTaskTypeTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TASK_TYPE_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

//Transaction

// getCountTransaction fetch api
export function getCountTransaction(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_TRANSACTION_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}
// getCountStatusPriority fetch api
export function getCountPropertyTransaction(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_COUNT_PROPERTY_TRANSACTION_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}



//Goals

export function getGoalStatusChanged(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_GOAL_STATUS_CHANGED_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

export function getGoalTalkTime(userId:any, roleId:any) {
    return axios.get(GET_GOAL_TALKTIME_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

export function getGoalLeadGenerted(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_GOAL_LEADS_GENERATED_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

export function getGoalLeadConverted(userId:any, roleId:any) {
    return axios.get(GET_GOAL_LEADS_CONVERTED_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

export function getGoalSiteVisit(userId:any, roleId:any) {
    return axios.get(GET_GOAL_SITE_VISIT_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

export function getGoalMeetings(userId:any, roleId:any) {
    return axios.get(GET_GOAL_MEETINGS_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

export function getGoalBookings(userId:any, roleId:any) {
    return axios.get(GET_GOAL_BOOKINGS_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

export function getGoalRevenue(userId:any, roleId:any) {
    return axios.get(GET_GOAL_REVENUE_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}


//Task Overview

export function getTaskStatusContact(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_TASK_STATUS_CONTACT_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

export function getTaskStatusLead(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_TASK_STATUS_LEAD_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

export function getTaskStatusProperty(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_TASK_STATUS_PROPERTY_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}

export function getTaskStatusTask(id:any, role:any, req:any, filter:any, team:any) {
    return axios.get(GET_TASK_STATUS_TASK_URL+'/'+id+'/'+role+'/'+req+'?filter_by='+filter.filter+'&start_date='+filter.start_date+'&end_date='+filter.end_date+'&team='+team)
    .then((response => response.data))
}