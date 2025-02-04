import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'moment-timezone';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { saveAttendance } from './core/_requests';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../../modules/auth';
import { getAttendance, updateAttendance, getTeams, getUsers, deleteAttendance } from './core/_requests';
import { getMasters } from '../orgMasters/core/_requests';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import { useIntl } from 'react-intl';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const columns = [
  { title: 'Id', field: 'id'},
  { title: 'Name', field: 'title', render: rowData => {
    var fields = rowData.title.split('-');
      return fields[0];
  } },
  { title: 'Date & Time', field: 'start_at'},
  // { title: 'Out Time', field: 'end', render: rowData => moment(rowData.start).format('HH:mm A')},
  { title: 'Status', field: 'attendance_status_name' },
  { title: 'Reason', field: 'leave_type_name' },  
  { title: 'Address', field: 'address' },  
];

const initialValues = {
    user_id: '',
    status: '',
    leave_type: '',
    start_time: '',
    end_time: '',
} 

moment.locale("en");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar (props) {
  const intl = useIntl();
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);
    const {
      toggle
      } = props

    const {currentUser, logout} = useAuth();
    const usersId = currentUser?.id;
    const [users, setUsers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState([]);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [userId, setUserId] = useState('');
    const [listChange, setListChange] = useState('1');
    const [loading, setLoading] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [teams, setTeams] = useState([]);
    const [teamId, setTeamId] = useState('');
    const [teamName, setTeamName] = useState('');
    const [memberId, setMemberId] = useState(usersId);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);
    const [att, setAtt] = useState('');
    const [leaveType, setLeaveType] = useState([]);
    const [clickedTeam, setClickedTeam] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [type, setType] = useState(false);
    const [pageHeight, setPageHeight] = useState('');

    const setHeight = () => {
      let heigh;
      if(window.innerHeight > 720) {
        heigh = '580px'
      } else {
        heigh = '500px'
      }
      setPageHeight(heigh)
    }
 
    useEffect(() => {
      setHeight()
    }, [window.innerHeight]); 

  const mastersList = async() => {
    const statusResponse = await getMasters('attendance_status')
    setAttendanceStatus(statusResponse.output);
    const typeResponse = await getMasters('leave_type')
    setLeaveType(typeResponse.output);
  }
    
  const attendanceSchema1 = Yup.object().shape({
    user_id: Yup.string().required('user id is required'),       
    status: Yup.string().required('status is required'),       
    start_time: Yup.string().required('start Time is required'),       
    end_time: Yup.string(),       
    leave_type: Yup.string(),       
  })

  const attendanceSchema2 = Yup.object().shape({
    user_id: Yup.string().required('user id is required'),       
    status: Yup.string().required('status is required'),       
    leave_type: Yup.string().required('Type is required'),       
  })

  const handleUsers = async (userid, name) => {
    setUserId(userid);
    setAttendance({});
    setMemberId(userid)     
    setTeamName(name); 
    setClickedTeam(true);
    const atResponse = await getAttendance(userid, 0)
    if(atResponse != null) {
      setAttendance(atResponse);
    } 
  }

  const handleTeam = async (teamId, TeamName, memb) => {
  setMemberId('');
  setAttendance({});
  setTeamName(TeamName);
  setTeamId(teamId);
  setClickedTeam(true);
  let members = [];
  let array = memb?.split(',');
  for(var mb in array) {
    let data = {
      "emp_id": array[mb].split('-')[1],
      "employee_name": array[mb].split('-')[0] 
    }
    members.push(data)
  }
  setTeamMembers(members);  
  const atResponse = await getAttendance(0, teamId)
    if(atResponse != null) {
      setAttendance(atResponse);
    } 
  }

  const teamsList =  async () => {
    const Response = await getTeams()
    setTeams(Response.output);
  }

  const usersList =  async () => {
    const userResponse = await getUsers()
    setUsers(userResponse.output);    
  }
  
  const formik = useFormik({
    initialValues,
    validationSchema: att == 160 ? attendanceSchema2 : attendanceSchema1,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      setLoading(true)
      try {        
        if(!editClicked) {
            const body = {
                "user_id": values.user_id,
                "start": start,
                "end": start,
                // "start": moment(moment(start).format('YYYY-MM-DD') + ' ' + values.start_time).format('YYYY-MM-DD HH:mm:ss'),
                // "end": moment(start).format('YYYY-MM-DD'),
                "attendance_status": values.status,
                "leave_type": values.leave_type                         
            }

        const attendanceData = await saveAttendance(body);       
        if(attendanceData != null){
            setLoading(false);
            setEditClicked(false);
            setClicked(false);
            setType(false);
            setAtt('');
            if (attendanceData == 'you cannot save attendance for a person twice in a day') {
            alert(attendanceData)
            }
            resetForm();
            document.getElementById('calender_model321')?.click();
            if(listChange == '1') {
              const atResponse = await getAttendance(0, teamId)
              setAttendance(atResponse);
            } else {
              const atResponse = await getAttendance(memberId, 0)
              setAttendance(atResponse);
            }                    
        } else {
            resetForm();            
        }
    } else {
        const body2 = {
            "user_id": values.user_id,
            "start": moment(start).format('YYYY-MM-DD') + ' ' + values.start_time,
            // "end": values.end_time ? moment(start).format('YYYY-MM-DD') + ' ' + values.end_time : moment(start).format('YYYY-MM-DD'),
            "end": moment(start).format('YYYY-MM-DD'),
            "attendance_status": values.status,                         
            "leave_type": values.leave_type                       
        }

        const attendanceData = await updateAttendance(id, body2);       
        if(attendanceData != null){
            setLoading(false);
            resetForm();
            setAtt('');
            document.getElementById('calender_model321')?.click();
            if(listChange == '1') {
              const atResponse = await getAttendance(0, teamId)
              setAttendance(atResponse);
            } else {
              const atResponse = await getAttendance(memberId, 0)
              setAttendance(atResponse);
            }  
        } else {
            resetForm();          
        }
    }
      } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)        
      }
  }})  

  const handleSelect = (start) => {
    if(clickedTeam) {
    document.getElementById('calender_model123')?.click();
    formik.setFieldValue('user_id', userId ?? '');
    setStart(start)
    setEnd(start)
    } else {
      alert('Please select a team or user first!!!')
    }      
  }    
  
  const handleEvent = (status, title, user_id, id, start_time, leave_type_id, e) => {
    setTitle(title);
    setAtt(status);
    setId(id);
    setUserId(user_id);
    setEditClicked(true);
    setStart(start_time);
    document.getElementById('calender_model123')?.click();
    formik.setFieldValue('user_id', user_id ?? '')
    formik.setFieldValue('status', status ?? '')  
    if(status == 160 ) {
      setType(true)
      formik.setFieldValue('leave_type', leave_type_id ?? '')
      formik.setFieldValue('start_time', '')
      formik.setFieldValue('end_time', '')
    } else {
      setType(false)
      formik.setFieldValue('leave_type', '')
      formik.setFieldValue('start_time', start_time.split('T')[1].slice(0, -8))
      // formik.setFieldValue('start_time', moment(start_time).format('HH:mm') ?? '')
      formik.setFieldValue('end_time', e == "0000-00-00 00:00:00" ? '' : moment(e).format('HH:mm'))
    }
  }

  const cancelEdit = () => {
    formik.setFieldValue('user_id', '')
    formik.setFieldValue('status', '') 
    formik.setFieldValue('leave_type', '')
    formik.setFieldValue('start_time', '')
    formik.setFieldValue('end_time', '') 
    formik.resetForm() 
    setEditClicked(false);
    setType(false);
    setAtt('');
  }

  const deleteAtt = async (id) => {
  const attendanceData = await deleteAttendance(id);       
    if(attendanceData != null){
        formik.resetForm();
        setAtt('');
        document.getElementById('calender_model321')?.click();
        if(listChange == '1') {
          const atResponse = await getAttendance(0, teamId)
          setAttendance(atResponse);
        } else {
          const atResponse = await getAttendance(memberId, 0)
          setAttendance(atResponse);
        }
    }
  }

  const ListChange = (e) => {
    setClickedTeam(false);
    setListChange(e);
    setAttendance({});
    setAtt('');
    setMemberId(usersId);
    setTeamId('');
    setTeamName('');    
  }
 
  function filterItem(item, search) {
    if (search.startsWith("@")) {
      const bucket = search.toLowerCase().substring(1).split(":");
      const searchBy = bucket[0];
      const searchFor = bucket[1];
      const searchByType = getType(item[searchBy]);

      if (!searchFor) return false;
      if (searchByType == "string") {
        if (searchFor.startsWith("!")) {
          const bucket = searchFor.split("!");
          const searchForVal = bucket[1];
          return !item[searchBy].includes(searchForVal);
        }
        return item[searchBy].includes(searchFor);
      }
  
      if (searchByType == "array") {
        if (searchFor.startsWith("!")) {
          const bucket = searchFor.split("!");
          const searchForVal = bucket[1];
          return item[searchBy].find((val) => !val.includes(searchForVal));
        }
        return item[searchBy].find((val) => val.includes(searchFor));
      }
  
      if (searchByType == "object") {
        if (searchFor.startsWith("!")) {
          const bucket = searchFor.split("!");
          const val = bucket[1] || "";
          return !item[searchBy][val];
        }
        if (searchFor.includes("!=")) {
          const bucket2 = searchFor.split("!=");
          const key = bucket2[0];
          const val = bucket2[1] || "";
          return item[searchBy][key] && !item[searchBy][key].includes(val);
        }
        const bucket2 = searchFor.split("=");
        const key = bucket2[0];
        const val = bucket2[1] || "";
        return item[searchBy][key] && item[searchBy][key].includes(val);
      }
    } else {
      if (search.startsWith("!")) {
        const bucket = search.split("!");
        const searchFor = bucket[1];
        if(listChange == '1') {
        return !item.team_leader_name?.toLowerCase().includes(searchFor);
        } else {
        return !item.first_name?.toLowerCase().includes(searchFor);
      }
      }
      if(listChange == '1') {
      return item.team_leader_name?.toLowerCase().includes(search);
       } else {
      return item.first_name?.toLowerCase().includes(search);
       }
    }
  }
  
  const getType = (value) => {
    if (Array.isArray(value)) {
      return "array";
    } else if (typeof value == "string") {
      return "string";
    } else if (value == null) {
      return "null";
    } else if (typeof value == "boolean") {
      return "boolean";
    } else if (Number(value) == value) {
      return "number";
    } else if (typeof value == "object") {
      return "object";
    }
    return "string";
  };

  const absentType = (data) => {
    formik.setFieldValue('status', data ?? '');
    formik.setFieldValue('start_time', '');
    setAtt(data);
  } 

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '';
    let color = '';

    if (event.attendance_status == 160) {
      backgroundColor = 'red';
      color = 'white';
    } else if (event.attendance_status == 161) {
      backgroundColor = 'yellow';
      color = 'black';
    } else {
      backgroundColor = 'green';
      color = 'white';
    }

    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color,
      border: 'none',
      display: 'block'
    };

    return {
      style
    };
  };

  useEffect(() => {
    teamsList();
    mastersList();
    usersList();
  }, []);

  useEffect(() => {
    let filteredData = [];
    if (search.length) {
      if(listChange == '1') {
        teams.forEach((item) => {
          if (filterItem(item, search.toLowerCase())) {
            filteredData.push({ ...item });
          }
        });
      } else {
        users.forEach((item) => {
          if (filterItem(item, search.toLowerCase())) {
            filteredData.push({ ...item });
          }
        });
      }      
    }
    if(listChange == '1') {
    setFilteredTeam(filteredData);
    } else {
    setFiltered(filteredData);
    }
  }, [search]);

  return (
    <div className="App h_80vh overflow-y-auto overflow-md-hidden">   
        <button className='btn btn-sm btn-secondary mt-3 me-3 d-none' data-bs-toggle='modal' id="calender_model123" data-bs-target='#calander_popup123456789'>ADD</button>                
        <div className="row">
          <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-2 overflow-hidden">            
            <div className="card h-100 bg-light h_80vh">
              <div className="card-header px-2">
              <div className="pt-3 w-100">
                <select className="form-select btn btn-sm btn_secondary" onChange={(e) => ListChange(e.target.value)}>
                  <option value="1">{intl.formatMessage({id: 'teams'})}</option>
                  <option value="2">{intl.formatMessage({id: 'users'})}</option>
                </select>
              </div>
                <div className="input-group form_search my-3 w-100">
                  <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                  <div className="input-group-append">
                    <button className="btn btn-secondary" type="button">
                      <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                    </button>
                  </div>
                </div>  
              </div>
              {listChange == 1 &&
              <div className="card-body p-0 mt-7">
                  <ul className="p-0">
                  {!search
                      ? teams?.map((userData, i) => {
                        return(                            
                        <li className="list-group hover_list_effect p-4" key={i}>
                          <div className={ teamId ==  userData.team_leader_id ? "text_primary" : "" } onClick={(e) => handleTeam(userData.team_leader_id, userData.team_leader_name?.split('-')[0], userData.user_name)}>
                            <a type="button">
                                {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                {userData.team_leader_name?.split('-')[0]}
                            </a>
                            </div>
                            <ul className={teamId ==  userData.team_leader_id ? "d-block" : "d-none"}>
                              {teamMembers.map((memb, j) => (
                              <li onClick={(e) => handleUsers(memb.emp_id, memb.employee_name)} key={j}>
                                <div className={ memberId ==  memb.emp_id ? "text_primary" : "" }>
                                <a type="button">{memb.employee_name}</a>
                                </div>
                              </li>
                              ))}
                            </ul>                                  
                        </li>
                        )}) 
                      : filteredTeam.length ? filteredTeam.map((item, k) => (<li className="list-group hover_list_effect p-4" key={k}>
                      <div className={ teamId ==  item.team_leader_id ? "text_primary" : "" } onClick={(e) => handleTeam(item.team_leader_id, item.team_leader_name?.split('-')[0], item.user_name)}>
                              <a type="button">
                                {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                {item.team_leader_name?.split('-')[0]}
                              </a>
                            </div> 
                        <ul className={teamId ==  item.team_leader_id ? "d-block" : "d-none"}>
                          {teamMembers.map((memb, l) => (
                          <li onClick={(e) => handleUsers(memb.emp_id, memb.employee_name)} key={l}>
                            <div className={ memberId ==  memb.emp_id ? "text_primary" : "" }>
                            <a type="button">{memb.employee_name}</a>
                            </div>
                          </li>
                          ))}
                        </ul>
                  </li>)) : <p>{intl.formatMessage({id: 'no_records'})}!!!</p> }
                  </ul>
              </div>}
              {listChange == 2 &&
              <div className="card-body p-0 mt-7">
                  <ul className="p-0">
                  {!search
                      ? users.map((item, i) => (
                          <li key={i} className="list-group hover_list_effect p-4">
                            <div className={ memberId ==  item.id ? "text_primary" : "" } onClick={(e) => handleUsers(item.id, item.first_name)}>
                              <a type="button">
                                {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                {item.first_name}
                              </a>
                            </div> 
                      </li>
                          ))
                      : filtered.length ? filtered.map((item) => (<li  className="list-group hover_list_effect p-4">
                      <div className={ memberId ==  item.id ? "text_primary" : "" } onClick={(e) => handleUsers(item.id, item.first_name)}>
                              <a type="button">
                                {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                {item.first_name}
                              </a>
                            </div> 
                  </li>)) : <p>{intl.formatMessage({id: 'no_records'})}!!!</p>}
                  </ul>
              </div>}
            </div>
          </div>
          <div className='modal fade' id={'calander_popup123456789'} aria-hidden='true' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                      <div>
                        <h3>{editClicked ? intl.formatMessage({id: 'update_attendance'}) : intl.formatMessage({id: 'add_attendance'}) }</h3>
                        <h5 className="text-gray-400">{moment(start).format("DD-MM-YYYY")}</h5> 
                      </div>                             
                        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={cancelEdit} id="calender_model321" data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                    </div>
                    <div className='modal-body py-lg-10 px-lg-10'>
                    <form noValidate onSubmit={formik.handleSubmit}>                               
                        <div className="row">
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'user_name'})}</label>
                            <div className="input-group mb-3">
                                <select disabled={listChange == 2 ? true : false} className="form-control w-100" {...formik.getFieldProps('user_id')}>
                                    <option disabled value=''>Select</option>
                                    {listChange == 1 ? <>
                                      <option value={teamId}>{teamName}</option>
                                      {teamMembers.map((user, i) => {
                                        return (
                                            <option value={user.emp_id} key={i}>{user.employee_name}</option>
                                        );
                                    })}
                                    </> : <>
                                    {users.map((user, i) => {
                                        return (
                                            <option value={user.id} key={i}>{user.first_name + ' ' + user.last_name}</option>
                                        );
                                    })}</>}
                                </select>
                            </div>
                            {formik.touched.user_id && formik.errors.user_id && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                      <span role='alert' className='text-danger'>{formik.errors.user_id}</span>
                                  </div>
                              </div>
                            )}
                          </div> 
                          <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'status'})}</label>
                            <div className="input-group mb-3">
                              <select className="form-control w-100" {...formik.getFieldProps('status')} onChange={(e) => absentType(e.target.value)}>
                                <option disabled value=''>Select</option>
                                {attendanceStatus.map((obj, i) => {
                                  return (
                                    <option value={obj.id} key={i}>{obj.option_value}</option>
                                  );
                                })}
                              </select>
                            </div>
                            {formik.touched.status && formik.errors.status && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                      <span role='alert' className='text-danger'>{formik.errors.status}</span>
                                  </div>
                              </div>
                            )}
                          </div>
                          {att == 160 ?
                          <div className="col-12 mb-3">
                              <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'leave_type'})}</label>
                              <div className="input-group mb-3">
                                  <select className="form-control w-100" {...formik.getFieldProps('leave_type')}>
                                      <option value=''>Select</option>
                                      {leaveType.map((obj, i) => {
                                        return (
                                            <option value={obj.id} key={i}>{obj.option_value}</option>
                                        );
                                      })}
                                  </select>
                              </div>
                              {formik.touched.leave_type && formik.errors.leave_type && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert' className='text-danger'>{formik.errors.leave_type}</span>
                                    </div>
                                </div>
                              )}
                          </div>
                          :<>
                          <div className="col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'in_time'})}</label>
                              <div className="input-group mb-3">
                                <input type="time" pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" {...formik.getFieldProps('start_time')} className="form-control" />
                              </div>
                              {formik.touched.start_time && formik.errors.start_time && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                      <span role='alert' className='text-danger'>{formik.errors.start_time}</span>
                                  </div>
                              </div>
                            )}
                          </div>
                          {/* <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'out_time'})}</label>
                              <div className="input-group mb-3">
                                <input type="time" pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" {...formik.getFieldProps('end_time')} className="form-control" />
                              </div>
                          </div> */}
                          </>}    
                        </div>                               
                        <div className='card-footer py-5 text-center' id='kt_attence_footer'>
                          <button
                              type='submit'
                              id='kt_add_attenance_submit'
                              className='btn btn_primary text-primary'
                              disabled={formik.isSubmitting}
                          >
                              {!loading && <span className='indicator-label'>{editClicked ? intl.formatMessage({id: 'update'}) : intl.formatMessage({id: 'save'}) }
                                  <KTSVG
                                      path='/media/custom/save_white.svg'
                                      className='svg-icon-3 svg-icon-primary ms-2' />
                              </span>}
                              {loading && (
                                  <span className='indicator-progress' style={{ display: 'block' }}>
                                      {intl.formatMessage({id: 'please_wait'})}...{' '}
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                              )}
                          </button>
                          {editClicked &&
                          <button type="button" className="btn btn_secondary text-danger ms-3" onClick={() => deleteAtt(id)}>{intl.formatMessage({id: 'delete'})}</button>}
                        </div> 
                      </form>                                                            
                  </div>
              </div>
          </div>
          </div>
            {toggle == 1 &&<>
            {loading ? 
              <div className='w-100 h-100'>
                  <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                      <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                      <div className="spinner-border taskloader" role="status">                                    
                          <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                      </div>
                  </div> 
              </div> :
            <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 col-xxl-10 h_80vh overflow-y-auto">
              <div className="d-flex justify-content-between">
                <h2>{teamName}</h2>
                {listChange == 2 &&
                <div className="card bs_1">
                  <div className="row align-items-center px-2 py-1">
                  <span className="col">
                    <p className="mb-0 text-center">{intl.formatMessage({id: 'absent'})}</p>
                    <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 160)?.length}</p>
                  </span>
                  <span className="col bg-gray-100 br_10">
                    <p className="mb-0 text-center">{intl.formatMessage({id: 'present'})}</p>
                    <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 159).length}</p>
                  </span>
                  <span className="col">
                    <p className="mb-0 text-center">{intl.formatMessage({id: 'half_day'})}</p>
                    <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 161)?.length}</p>
                  </span>
                  </div>                  
                </div>}
              </div>
          <Calendar
            views={["month"]}
            selectable
            localizer={localizer}
            defaultDate={moment()}
            defaultView="month"
            events={attendance.output}
            // style={{ height: "100vh" }}
            onSelectEvent={(event) => handleEvent(event.attendance_status, event.title, event.user_id, event.id, event.start, event.leave_type, event.end )}
            onSelectSlot={(e) => handleSelect(e.start)}
            startAccessor="start"
            eventPropGetter={eventStyleGetter}
          />
          <p className="required text_primary d-flex">
            <small className="text-nowrap">{intl.formatMessage({id: 'note'})}:</small>
            <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-success"></span></div> <span>- {intl.formatMessage({id: 'present'})},</span></small>
            <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-danger"></span></div> <span>- {intl.formatMessage({id: 'absent'})},</span></small>
            <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-warning"></span></div> <span>- {intl.formatMessage({id: 'half_day'})}</span></small></p>
          </div>}</>}
          {toggle == 2 &&<>
          {loading ? 
          <div className='w-100 h-100'>
          <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
              <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
              <div className="spinner-border taskloader" role="status">                                    
                  <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
              </div>
          </div> 
      </div> :
      <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 col-xxl-10 h_80vh">
        <div className="d-flex justify-content-between">
            <h2>{teamName}</h2>
            {listChange == 2 &&
            <div className="card bs_1">
              <div className="row align-items-center px-2 py-1">
              <span className="col">
                <p className="mb-0 text-center">{intl.formatMessage({id: 'absent'})}</p>
                <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 160).length}</p>
              </span>
              <span className="col bg-gray-100 br_10">
                <p className="mb-0 text-center">{intl.formatMessage({id: 'present'})}</p>
                <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 159).length}</p>
              </span>
              <span className="col">
                <p className="mb-0 text-center">{intl.formatMessage({id: 'half_day'})}</p>
                <p className="mb-0 text-center">{attendance.output?.filter(item => item.attendance_status == 161).length}</p>
              </span>
              </div>                  
            </div>}
          </div>
      {attendance != [] &&      
      <div className="mt-5" style={{ maxWidth: '100%' }} >        
        <MaterialTable className="p-3"
          icons={tableIcons}
          columns={columns}
          data={attendance.output}
          title={intl.formatMessage({id: 'attendance'})}
          options={{
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500],
            actionsColumnIndex: -1,
            exportButton: permissions.export == 1 ? true : false,
            maxBodyHeight: pageHeight,
            headerStyle: {
                backgroundColor: '#ececec',
                color: '#000'
            },
            rowStyle: {
                backgroundColor: '#fff',
            }
          }}
        />
      </div>
          }
      </div>}</>}
      </div>
    </div>
  );
}
