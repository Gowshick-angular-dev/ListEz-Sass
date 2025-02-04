import axios  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL


export const GET_TASKS_URL = `${API_URL}orgTasks/get/tasks`
export const GET_TASK_DROPLIST_URL = `${API_URL}orgDropdown/task_dropdown`
export const DELETE_MULTI_TASK_URL = `${API_URL}orgTasks/delete/tasks`
export const UPDATE_TASK_STATUS_URL = `${API_URL}orgTasks/update_task_status/tasks`
export const UPDATE_TASK_PRIORITY_URL = `${API_URL}orgTasks/update_priority_status/tasks`
export const GET_TASK_URL = `${API_URL}orgTasks/edit/tasks`
export const UPDATE_TASKS_URL = `${API_URL}orgTasks/update/tasks`
export const SAVE_TASK_FILTER_URL = `${API_URL}orgTasks/save_task_filter/tasks`
export const GET_TASK_FILTERS_URL = `${API_URL}orgTasks/get_task_filter/tasks`
export const SAVE_TASKS_URL = `${API_URL}orgTasks/save/tasks`
export const SAVE_TASK_NOTES = `${API_URL}orgNotes/save/notes`
export const GET_TASK_NOTES = `${API_URL}orgNotes/get/notes`
export const EDIT_TASK_NOTES_URL = `${API_URL}orgNotes/update/notes`
export const DELETE_TASK_NOTES_URL = `${API_URL}orgNotes/delete/notes`
export const GET_MULITI_IMAGES_TASK_URL = `${API_URL}orgFiles/get/files`
export const GET_LOGS_URL = `${API_URL}orgLogs/get/logs`
export const UPLOAD_MULITI_IMAGES_TASK_URL = `${API_URL}orgFiles/save/files`
export const DELETE_MULITI_IMAGES_TASK_URL = `${API_URL}orgFiles/delete/files`
export const DELETE_TASK_FILTER_URL = `${API_URL}orgTasks/delete_task_filter/tasks`
export const TASK_BULK_REASSIGN_URL = `${API_URL}orgTasks/update_task_bulk_reassign/tasks`




export function bulkReassignTask(Id:any, cid:any) {
    return axios.put(TASK_BULK_REASSIGN_URL+'/'+cid?.join(','), Id)
    .then((response => response.data))
}

export function getTasks(body:any) {    
    return axios.get(GET_TASKS_URL+'?task_type='+body.task_type+'&created_date='+body.created_date+'&assign_to='+body.assign_to+'&project='+body.project+'&task_status='+body.task_status+'&priority='+body.priority+'&created_by='+body.created_by+'&order_by='+body.sort_by+'&limit='+body.limit)
    .then((response => response.data))
}

export function getTaskDropdowns() {
    return axios.get(GET_TASK_DROPLIST_URL)
    .then((response => response.data))
}

export function deleteTask(taskId:any) {
    return axios.put(DELETE_MULTI_TASK_URL+'/'+taskId)
    .then((response => response.data))
}

export function updateTaskStatus(taskId:any ,body:any) {
    return axios.put(UPDATE_TASK_STATUS_URL+'/'+taskId, body)
    .then((response => response.data))
}

export function taskFilterDelete(taskId:any) {
    return axios.put(DELETE_TASK_FILTER_URL+'/'+taskId)
    .then((response => response.data))
}

export function updateTaskPriority(taskId:any ,body:any) {
    return axios.put(UPDATE_TASK_PRIORITY_URL+'/'+taskId, body)
    .then((response => response.data))
}

export function getTask(taskId:any) {
    return axios.get(GET_TASK_URL+'/'+taskId)
    .then((response => response.data))
}

export function updateTask(taskId:any ,body:any) {
    return axios.put(UPDATE_TASKS_URL+'/'+taskId, body)
    .then((response => response.data))
}

export function saveTaskFilter(postData:any) {
    return axios.post(SAVE_TASK_FILTER_URL,postData)
    .then((response => response.data))
}

export function getTaskFilters() {
    return axios.get(GET_TASK_FILTERS_URL)
    .then((response => response.data))
}

export function saveTask(body:any) {
    return axios.post(SAVE_TASKS_URL, body)
    .then((response => response.data))
}

export function saveTaskNotes(body:any) {
    return axios.post(SAVE_TASK_NOTES,body)
    .then((response => response.data))
}

export function getTaskNotes(Id:number) {
    return axios.get(GET_TASK_NOTES+'/'+Id+'/'+4)
    .then((response => response.data))
}

export function editTaskNotes(taskId:any, editBody:any) {
    return axios.put(EDIT_TASK_NOTES_URL+'/'+taskId, editBody)
    .then((response => response.data))
}

export function deleteTaskNotes(Id:any, parent:any, body:any) {
    return axios.put(DELETE_TASK_NOTES_URL+'/'+Id+'/'+parent, body)
    .then((response => response.data))
}

export function getMultipleFilesTasks(Id:any) {
    return axios.get(GET_MULITI_IMAGES_TASK_URL+'/'+Id+'/'+4)
    .then((response => response.data))
}

export function getLog(taskId:any) {
    return axios.get(GET_LOGS_URL+'/'+taskId+'/4')
    .then((response => response.data))
}

export function uploadMultipleFileTask(id:any ,postData:any) {
    return axios.post(UPLOAD_MULITI_IMAGES_TASK_URL+'/'+id, postData)
    .then((response => response.data))
}

export function deleteMultipleFilesTasks(Id:any, body:any) {
    return axios.put(DELETE_MULITI_IMAGES_TASK_URL+'/'+Id, body)
    .then((response => response.data))
}








export const GET_TASKS_BY_ROLE_URL = `${API_URL}/get_task_tl`
export const GET_PROJECTS_URL = `${API_URL}/get_properties`
export const GET_CONTACTS_URL = `${API_URL}/get_contact_drop_list`
export const GET_LEADS_URL = `${API_URL}/get_leads`
export const GET_TASK_TYPE_URL = `${API_URL}/get_task_type`
export const GET_TASK_STATUS_URL = `${API_URL}/get_task_status`
export const GET_PRIORITY_URL = `${API_URL}/get_priority`
export const GET_ASSIGN_TO_URL = `${API_URL}/get_users`
export const UPLOAD_FILE_URL = `${API_URL}/uploadfileTask`
export const DELETE_TASK_URL = `${API_URL}/delete_task`
export const GET_TASK_FILTER_URL = `${API_URL}/get_task_filter`
export const GET_ACTIVE_TIMELINE_URL = `${API_URL}/get_active_timeline`





// task fetch api
export function getProjects(userId:any, roleId:any) {
    return axios.get(GET_PROJECTS_URL+'/'+userId+'/'+roleId+'/'+userId)
    .then((response => response.data))
}

// get tasks by role
export function getTasksByRole(id:any, role:any) {
    return axios.get(GET_TASKS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id)
    .then((response => response.data))
}

// task type fetch api
export function getTaskType() {
    return axios.get(GET_TASK_TYPE_URL)
    .then((response => response.data))
}

// task status fetch api
export function getTaskStatus() {
    return axios.get(GET_TASK_STATUS_URL)
    .then((response => response.data))
}

// task priority fetch api
export function getTaskPriority() {
    return axios.get(GET_PRIORITY_URL)
    .then((response => response.data))
}

// task fetch api
export function getTaskDetail(taskId:any) {
    return axios.get(GET_TASK_URL+'/'+taskId)
    .then((response => response.data))
}
// upload lead fetch api
export function uploadFileTask(postData:any, headers:any) {
    return axios.post(UPLOAD_FILE_URL, postData, headers)
    .then((response => response.data))
}

// lead fetch api
export function getLeads() {
    return axios.get(GET_LEADS_URL)
    .then((response => response.data))
}

// contact list fetch api
export function getContacts(id:any, role:any) {
    return axios.get(GET_CONTACTS_URL+'/'+id+'/'+role+'/'+id)
    .then((response => response.data))
  }

// assignto list fetch api
export function getAssignTo() {
    return axios.get(GET_ASSIGN_TO_URL)
    .then((response => response.data))
  }


// task filter api
export function getTaskFilter(Id:any) {
    return axios.get(GET_TASK_FILTER_URL+'/'+Id)
    .then((response => response.data))
}

export function getFilteredTasks(id:any, role:any, body:any, headers:any) {
    return axios.get(GET_TASKS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id+'?task_type='+body.task_type+'&priority='+body.priority+'&task_status='+body.task_status+'&created_at='+body.created_date+'&assign_to='+body.assign_to+'&property_id='+body.property)
    .then((response => response.data))
}

// task fetch api
export function getTaskSortBy(id:any, role:any, sortBy:any) {
    return axios.get(GET_TASKS_BY_ROLE_URL+'/'+id+'/'+role+'/'+id+'?order_by='+sortBy)
    .then((response => response.data))
  }













 






export function getActiveTimeline(module:any, taskid:any) {
    return axios.get(GET_ACTIVE_TIMELINE_URL+'/'+taskid+'/'+module)
    .then((response => response.data))
}
