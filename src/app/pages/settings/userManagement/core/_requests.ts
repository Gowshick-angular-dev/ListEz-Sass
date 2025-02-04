import axios, {AxiosResponse}  from 'axios'

const API_URL = process.env.REACT_APP_API_BASE_URL

export const GET_ROLE_MANAGEMENT_LIST_URL = `${API_URL}orgRoles/get/roles`
export const GET_ROLE_MANAGEMENT_URL = `${API_URL}orgRoles/get/roles`
export const SAVE_ROLE_MANAGEMENT_URL = `${API_URL}orgRoles/save/roles`
export const UPDATE_ROLE_MANAGEMENT_URL = `${API_URL}orgRoles/update/roles`
export const DELETE_ROLE_MANAGEMENT_LIST_URL = `${API_URL}orgRoles/delete/roles`
export const GET_USERS_URL = `${API_URL}OrgUser/get/user`
export const GET_USER_URL = `${API_URL}OrgUser/edit_user/user`
export const DELETE_USER_URL = `${API_URL}OrgUser/delete_user/user`
export const SAVE_USER_URL = `${API_URL}OrgUser/save_user/user`
export const UPDATE_USER_URL = `${API_URL}OrgUser/update_user/user`
export const SAVE_USER_PERSONAL_URL = `${API_URL}OrgUser/save_user_personal_details/user`
export const UPDATE_USER_PERSONAL_URL = `${API_URL}OrgUser/update_user_personal_details/user`
export const SAVE_USER_PROFESSIONAL_URL = `${API_URL}OrgUser/save_user_professional_details/user`
export const UPDATE_USER_PROFESSIONAL_URL = `${API_URL}OrgUser/update_user_professional_details/user`
export const SAVE_USER_FINANCE_URL = `${API_URL}OrgUser/save_user_finance/user`
export const UPDATE_USER_FINANCE_URL = `${API_URL}OrgUser/update_user_finance/user`
export const SAVE_USER_GOALS_URL = `${API_URL}OrgUser/save_user_goals/user`
export const UPDATE_USER_GOALS_URL = `${API_URL}OrgUser/update_user_goals/user`
export const GET_USER_DROPDOWNS_URL = `${API_URL}OrgUser/users_dropdown/user`
export const GET_TEAM_LIST_URL = `${API_URL}orgTeams/get/team`
export const SAVE_TEAM_URL = `${API_URL}orgTeams/save/team`
export const GET_ATTENDANCE_URL = `${API_URL}orgAttendance/get/attendance`
export const GET_TEAMS_URL = `${API_URL}orgTeams/get_team_list/team`
export const SAVE_ATTENDANCE_URL = `${API_URL}orgAttendance/save/attendance`
export const UPDATE_ATTENDANCE_URL = `${API_URL}orgAttendance/update/attendance`
export const DELETE_ATTENDANCE_URL = `${API_URL}orgAttendance/delete/attendance`
export const GET_ATTENDANCE_LIST_URL = `${API_URL}orgAttendance/get_timesheet/attendance`
export const UPDATE_ROLE_PERMISSIONS_URL = `${API_URL}orgRoles/update_role_permission/roles`
export const LOG_SHEET_URL = `${API_URL}orgAttendance/get_log_sheet`




export function getUsersDropdown(id:any) {
    return axios.get(GET_USER_DROPDOWNS_URL+'/'+id)
    .then((response => response.data))
}

export function getLogTimeLine(body:any) {
    return axios.get(LOG_SHEET_URL+'?login_time='+body.start+'&logout_time='+body.end)
    .then((response => response.data))
}

// Teams fetch api
export function getTeams() {
    return axios.get(GET_TEAMS_URL)
    .then((response => response.data))
}

// save user fetch api
export function saveUser(body:any) {
    return axios.post(SAVE_USER_URL, body)
    .then((response => response.data))
}

// save user fetch api
export function saveUserPersonal(body:any) {
    return axios.post(SAVE_USER_PERSONAL_URL, body)
    .then((response => response.data))
}

// save user fetch api
export function saveUserProfessional(body:any) {
    return axios.post(SAVE_USER_PROFESSIONAL_URL, body)
    .then((response => response.data))
}

// save user fetch api
export function saveUserFinancial(body:any) {
    return axios.post(SAVE_USER_FINANCE_URL, body)
    .then((response => response.data))
}

// save user fetch api
export function saveUserGoal(body:any) {
    return axios.post(SAVE_USER_GOALS_URL, body)
    .then((response => response.data))
}

// update user fetch api
export function updateUser(id:any ,body:any) {
    return axios.put(UPDATE_USER_URL+'/'+id, body)
    .then((response => response.data))
}

// update user fetch api
export function updateUserPersonal(id:any ,body:any) {
    return axios.put(UPDATE_USER_PERSONAL_URL+'/'+id, body)
    .then((response => response.data))
}

// update user fetch api
export function updateUserProfessional(id:any ,body:any) {
    return axios.put(UPDATE_USER_PROFESSIONAL_URL+'/'+id, body)
    .then((response => response.data))
}

// update user fetch api
export function updateUserFinancial(id:any ,body:any) {
    return axios.put(UPDATE_USER_FINANCE_URL+'/'+id, body)
    .then((response => response.data))
}

// update user fetch api
export function updateUserGoal(id:any ,body:any) {
    return axios.put(UPDATE_USER_GOALS_URL+'/'+id, body)
    .then((response => response.data))
}

// delete user fetch api
export function deleteUser(id:any) {
    return axios.put(DELETE_USER_URL+'/'+id)
    .then((response => response.data))
}

// users fetch api
export function getUsers() {
    return axios.get(GET_USERS_URL)
    .then((response => response.data))
}

// users fetch api
export function getUsersLazy(limit:any) {
    return axios.get(GET_USERS_URL+'?limit='+limit)
    .then((response => response.data))
}

export function getUser(id:any) {
    return axios.get(GET_USER_URL+'/'+id)
    .then((response => response.data))
}

export function getTeamList() {
    return axios.get(GET_TEAM_LIST_URL)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function getRoleManagementList() {
    return axios.get(GET_ROLE_MANAGEMENT_LIST_URL)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function getRoleManagement() {
    return axios.get(GET_ROLE_MANAGEMENT_URL)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function saveRoleManagement(body: any) {
    return axios.post(SAVE_ROLE_MANAGEMENT_URL, body)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function updateRoleManagement(id: any, body:any) {
    return axios.put(UPDATE_ROLE_MANAGEMENT_URL+'/'+id, body)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function deleteRoleManagement(id: any) {
    return axios.put(DELETE_ROLE_MANAGEMENT_LIST_URL+'/'+id)
    .then((response => response.data))
}

// get Attendance setting fetch api
export function getAttendance(reqId:any, teamId:any) {
    return axios.get(GET_ATTENDANCE_URL+'/'+reqId+'/'+teamId)
    .then((response => response.data))
}

// Svae role settingsfetch api
export function saveAttendance(body:any) {
    return axios.post(SAVE_ATTENDANCE_URL, body)
    .then((response => response.data))
}

// update role settings fetch api
export function updateAttendance(id: any, body: any) {
    return axios.put(UPDATE_ATTENDANCE_URL+'/'+id, body)
    .then((response => response.data))
}

// Delete attendance fetch api
export function deleteAttendance(id: any) {
    return axios.put(DELETE_ATTENDANCE_URL+'/'+id)
    .then((response => response.data))
}

// Delete attendance fetch api
export function updateRolePermission(id: any, body:any) {
    return axios.put(UPDATE_ROLE_PERMISSIONS_URL+'/'+id, body)
    .then((response => response.data))
}

// users fetch api
export function getAllAttendanceList(data:any) {
    return axios.get(GET_ATTENDANCE_LIST_URL+'?start_date='+data.start+'&end_date='+data.end+'&users='+data.users)
    .then((response => response.data))
}





export const UPDATE_USER_OTHER_DETAILS_URL = `${API_URL}/put_user_other_details`
export const UPDATE_USER_PROOF_DETAILS_URL = `${API_URL}/put_user_prof_details`
export const UPDATE_USER_PACKAGE_DETAILS_URL = `${API_URL}/put_user_package_details`
export const GET_DESIGNATION_URL = `${API_URL}/get_designation`
export const GET_DEPT_URL = `${API_URL}/get_department`
export const GET_BRANCH_URL = `${API_URL}/get_branch`
export const GET_PROPERTY_TYPE_URL = `${API_URL}/get_property_type`
// export const GET_TEAMS_URL = `${API_URL}/get_teams`
export const GET_TEAM_URL = `${API_URL}/get_team`
export const GET_USERS_TL_URL = `${API_URL}/get_users_tl`
export const GET_USERS_E_URL = `${API_URL}/get_users_e`
export const GET_ROLE_SETTINGS_URL = `${API_URL}/get_role_settings`
export const SAVE_ROLE_SETTINGS_URL = `${API_URL}/save_role_settings`
export const UPDATE_ROLE_SETTINGS_URL = `${API_URL}/put_role_settings`
export const GET_TEAM_MEMBERS_URL = `${API_URL}/get_team_members`
export const GET_USERS_BY_ROLE_URL = `${API_URL}/get_users_role_id`
export const PUT_TEAM_URL = `${API_URL}/put_team`
export const UPDATE_PROFILE_IMAGE_URL = `${API_URL}/update_profileimage_user`
export const GET_USERS_GOALS_URL = `${API_URL}/get_users_goals`
export const GET_USER_GOAL_URL = `${API_URL}/get_user_goal`
export const UPDATE_GOAL_URL = `${API_URL}/put_performance_goals`
export const DELETE_TEAM_URL = `${API_URL}/delete_team`
export const GET_ROLE_MANAGEMENT_LIST_BY_ORG_URL = `${API_URL}/get_role_management_org_id`
export const GET_DESIGNATION_LIST_URL = `${API_URL}/get_designation`

















// users fetch api
export function getDesignationDrop() {
    return axios.get(GET_DESIGNATION_LIST_URL)
    .then((response => response.data))
}

// Teams fetch api
export function getTeamsList(usersId:any, roleId:any) {
    return axios.get(GET_TEAM_LIST_URL)
    .then((response => response.data))
}


export function updateTeam(id:any, body:any) {
    return axios.put(PUT_TEAM_URL+'/'+id, body)
    .then((response => response.data))
}

// designation fetch api
export function getDesignation() {
    return axios.get(GET_DESIGNATION_URL)
    .then((response => response.data))
}

// dept fetch api
export function getDept() {
    return axios.get(GET_DEPT_URL)
    .then((response => response.data))
}

// branch fetch api
export function getBranch() {
    return axios.get(GET_BRANCH_URL)
    .then((response => response.data))
}

// PropertyType fetch api
export function getPropertyType() {
    return axios.get(GET_PROPERTY_TYPE_URL)
    .then((response => response.data))
}

// SvaeTeam fetch api
export function saveTeam(body:any) {
    return axios.post(SAVE_TEAM_URL, body)
    .then((response => response.data))
}



// TeamLeader fetch api
export function getTeamLeader(id:any) {
    return axios.get(GET_USERS_TL_URL+'/'+id)
    .then((response => response.data))
}

// TeamLeader fetch api
export function getTeamEmployees() {
    return axios.get(GET_USERS_E_URL)
    .then((response => response.data))
}

// get role setting fetch api
export function getRoleSetting(rollId:any, moduleId:any) {
    return axios.get(GET_ROLE_SETTINGS_URL+'/'+rollId+'/'+moduleId)
    .then((response => response.data))
}

// Svae role settingsfetch api
export function saveRoleSetting(body:any) {
    return axios.post(SAVE_ROLE_SETTINGS_URL, body)
    .then((response => response.data))
}

// update role settings fetch api
export function updateRoleSettings(id:any) {
    return axios.put(DELETE_USER_URL+'/'+id)
    .then((response => response.data))
}




// Update image api
export function updateProfileImage(id:any, body:any) {
    return axios.post(UPDATE_PROFILE_IMAGE_URL+'/'+id, body)
    .then((response => response.data))
}


// update Other Details fetch api
export function updateOtherDetails(id: any, body: any) {
    return axios.put(UPDATE_USER_OTHER_DETAILS_URL+'/'+id, body)
    .then((response => response.data))
}

// update Other Details fetch api
export function updateProofDetails(id: any, body: any) {
    return axios.put(UPDATE_USER_PROOF_DETAILS_URL+'/'+id, body)
    .then((response => response.data))
}

// update Other Details fetch api
export function updatePackageDetails(id: any, body: any) {
    return axios.put(UPDATE_USER_PACKAGE_DETAILS_URL+'/'+id, body)
    .then((response => response.data))
}

// get Attendance setting fetch api
export function getTeam(teamId:any) {
    return axios.get(GET_TEAM_URL+'/'+teamId)
    .then((response => response.data))
}

// get TeamMembers setting fetch api
export function getTeamMembers(teamId:any) {
    return axios.get(GET_TEAM_MEMBERS_URL+'/'+teamId)
    .then((response => response.data))
}

// get Users By Role setting fetch api
export function getUsersByRole(user:any, role:any) {
    return axios.get(GET_USERS_BY_ROLE_URL+'/'+user+'/'+role)
    .then((response => response.data))
}

// getUsersGoals fetch api
export function getUsersGoals() {
    return axios.get(GET_USERS_GOALS_URL)
    .then((response => response.data))
}

// getUserGoal fetch api
export function getUserGoal(id:any) {
    return axios.get(GET_USER_GOAL_URL+'/'+id)
    .then((response => response.data))
}


// // Update Performance fetch api
// export function updateUserGoal(id: any, body:any) {
//     return axios.put(UPDATE_GOAL_URL+'/'+id, body)
//     .then((response => response.data))
// }

// Delete Team fetch api
export function deleteTeam(id: any) {
    return axios.put(DELETE_TEAM_URL+'/'+id)
    .then((response => response.data))
}

// getRoleManagement Team fetch api
export function getRoleManagementOrgList(orgId: any) {
    return axios.get(GET_ROLE_MANAGEMENT_LIST_BY_ORG_URL+'/'+orgId)
    .then((response => response.data))
}






