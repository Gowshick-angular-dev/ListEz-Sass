import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { TreeChart } from './treechart';
import moment from "moment";
import { TimeSheet } from './timesheet';
import { UserTimeline } from './logSheets';
import { RoleProfile } from './roleProfile';
import { deleteUser, getUsers, getUsersLazy } from './core/_requests';
import { EditUser } from './EditUser';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserManagementDrawer } from './userManagement_drawer';
import { UserToolbar } from './userToolbar';
import { useAuth } from '../../../modules/auth';
import { Offcanvas, Toast } from 'bootstrap';
import { TeamsList } from './teamsList';
import { useIntl } from 'react-intl';
import { UserPerformance } from './performance';
import ReactBigCalendar from './bigCal';
import InfiniteScroll from 'react-infinite-scroll-component';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
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
 

const UserManagement = () => {
    const intl = useIntl();
    const [toggle, setToggle] = useState('grid');
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);

    const handleHideData = (layout) => {
        setToggle(layout);
    };
    const {currentUser, logout} = useAuth();
    const [userList, setUserList] = useState([]);
    const [detailClick, setDetailClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tabDetail, setTabDetail] = useState('manage_users');
    const [attChange, setAttChange] = useState('1');
    const [usersCount, setUsersCount] = useState('');
    const [limit, setLimit] = useState('');
    const [userData, setUserData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [location, setLocation] = useState({});
    const [pageHeight, setPageHeight] = useState('');
    const [params, setParams] = useState('1');

    useEffect(() => {
        const queryString = window.location.search;
        if(queryString) {        
        setParams(queryString.split('?')[1]); 
        }   
    }, [window.location.search])

    const setHeight = () => {
      let heigh;
      if(window.innerHeight > 720) {
        heigh = '600px'
      } else {
        heigh = '550px'
      }
      setPageHeight(heigh)
    }
 
    useEffect(() => {
      setHeight()
    }, [window.innerHeight]);

    const roleId = currentUser?.designation;

    const UsersList =  async () => {
        setLoading(true);
        const userResponse = await getUsersLazy(0)
        setUserList(userResponse.output);
        setUsersCount(userResponse.count);
        setLimit(12);
        setLoading(false);
    }

    const columns = [
        { title: "Sl.No", render: rowData => userList?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { title: 'Employee Id', field: 'employee_id'},
        { title: 'Name', field: 'first_name', render: rowData => rowData.first_name + ' ' + rowData.last_name },
        { title: 'Designation', field: 'designation_name'},
        { title: 'Department', field: 'department_name'},
        { title: 'Phone', field: 'p_phone_number'},
        { title: 'Email', field: 'email' },
        { title: 'Created At', field: 'created_at', render: rowData => moment(rowData.created_at).format('DD-MMMM-YYYY')},  
        { title: 'Actions', render: rowData => <div className='d-flex'>
        <button id='kt_edit_usersettings_toggle' onClick={() => setUserData(rowData)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>
        
        <button type='button' data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup'} onClick={() => setDeleteData(rowData)} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></button></div>},  
      ];

    const usersListLazyLoad = async () => {
        const userResponse = await getUsersLazy(limit)
        setUserList((post) => [...post, ...userResponse.output]);
        setLimit(limit+12);
    }

    const onDelete = async (id) => {
        try {
            const response = await deleteUser(id);
            // setUserList(response.output);
            UsersList();
            setUserData({});
            var toastEl = document.getElementById('myToastDelete');
            const bsToast = new Toast(toastEl);
            bsToast.show();
        } catch {
            var toastEl = document.getElementById('myToastError');
            const bsToast = new Toast(toastEl);
            bsToast.show();
        }
    }
    
    const position = () => {
        navigator.geolocation.getCurrentPosition(
          position => { 
            let hgddgf = {
                "lat": position.coords.latitude,
                "long": position.coords.longitude 
            }
            setLocation(hgddgf);
            return hgddgf;
          }, 
          err => console.log(err)
        );
    }
      
    useEffect(() => {
        position();
        UsersList();
    }, []);

    return(
        <>
        <UserToolbar layoutOnChange={handleHideData} tab={tabDetail} layoutOnChangeAttendance={setAttChange}/>        
        <UserManagementDrawer setUserList={setUserList}/>
        <button type='button' onClick={() => UsersList()} className='d-none' id='fgbirgiebjrtjegtrtbkdffh'>reload</button>      
        <div className="user_manage_page bg_white p-4">
            <div className='w-100 overflow-hidden'>
                <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={params == 1 ? "nav-link active" : "nav-link"} id="pills-org-tab" data-bs-toggle="pill" data-bs-target="#pills-org" type="button" role="tab" aria-controls="pills-org" aria-selected="true" onClick={() => setTabDetail('manage_users')}>{intl.formatMessage({id: 'manage_users'})}</button>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link" id="user-charts-tab" data-bs-toggle="pill" data-bs-target="#user-charts" type="button" role="tab" aria-controls="user-charts" aria-selected="false" onClick={() => setTabDetail('user_charts')}>{intl.formatMessage({id: 'user_charts'})}</button>
                    </li> */}
                    <li className="nav-item" role="presentation">
                        <button className={params == 2 ? "nav-link active" : "nav-link"} id="manage-teams-tab" data-bs-toggle="pill" data-bs-target="#manage-teams" type="button" role="tab" aria-controls="manage-teams" aria-selected="false" onClick={() => setTabDetail('manage_teams')}>{intl.formatMessage({id: 'manage_teams'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={params == 3 ? "nav-link active" : "nav-link"} id="attendance-tab" data-bs-toggle="pill" data-bs-target="#attendance" type="button" role="tab" aria-controls="attendance" aria-selected="false" onClick={() => setTabDetail('attendance')}>{intl.formatMessage({id: 'attendance'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={params == 4 ? "nav-link active" : "nav-link"} id="performance-tab" data-bs-toggle="pill" data-bs-target="#performance" type="button" role="tab" aria-controls="performance" aria-selected="false" onClick={() => setTabDetail('performance')}>{intl.formatMessage({id: 'performance'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={params == 5 ? "nav-link active" : "nav-link"} id="time-sheets-tab" data-bs-toggle="pill" data-bs-target="#time-sheets" type="button" role="tab" aria-controls="time-sheets" aria-selected="false" onClick={() => setTabDetail('time_sheets')}>{intl.formatMessage({id: 'time_sheets'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={params == 6 ? "nav-link active" : "nav-link"} id="log-sheets-tab" data-bs-toggle="pill" data-bs-target="#log-sheets" type="button" role="tab" aria-controls="log-sheets" aria-selected="false" onClick={() => setTabDetail('log_sheets')}>{intl.formatMessage({id: 'log_sheets'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={params == 7 ? "nav-link active" : "nav-link"} id="role-profile-tab" data-bs-toggle="pill" data-bs-target="#role-profile" type="button" role="tab" aria-controls="time-sheets" aria-selected="false" onClick={() => setTabDetail('role_profile')}>{intl.formatMessage({id: 'role_profile'})}</button>
                    </li>
                </ul>
            </div>
            <div className="tab-content" id="pills-tabContent">
                <div className={params == 1 ? "tab-pane fade show active" : "tab-pane fade"}  id="pills-org" role="tabpanel" aria-labelledby="pills-org-tab">
                    {userData.id &&
                    <div
                        id={'kt_useredit_toggle_eugfsuygiurgtieruh'}
                        className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                        // className='bg-opacity-0 p-0'
                        // data-kt-drawer='true'
                        // data-kt-drawer-name='usermanagement_edit'
                        // data-kt-drawer-activate='true'
                        // data-kt-drawer-overlay='true'
                        // data-kt-drawer-width="{default:'100%', 'md': '95%'}"
                        // data-kt-drawer-direction='end'
                        // data-kt-drawer-toggle='#kt_edit_usersettings_toggle'
                        // data-kt-drawer-close='#kt_usersettings_edit_close'
                    >
                        <EditUser currentUserId={userData} setUser={setUserList} setDetailClicked={setUserData}/>
                    </div>}
                    <div className='modal fade' id={'delete_confirm_popup'} aria-hidden='true'>
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                    </div>
                                </div>
                                <div className='modal-body py-lg-10 px-lg-10'>
                                    <p>{intl.formatMessage({id: 'are_you_sure_want_to_delete'})}?</p>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
                                            {intl.formatMessage({id: 'no'})}
                                        </button>
                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(deleteData.id)}>
                                            {intl.formatMessage({id: 'yes'})}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        {toggle == 'grid' && (
                            <div className="row">                                
                                {loading ? 
                                <div className='w-100 h-100'>
                                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <div className="spinner-border taskloader" role="status">                                    
                                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                        </div>
                                    </div> 
                                </div> : 
                                <InfiniteScroll
                                    dataLength={userList.length}
                                    next={usersListLazyLoad}
                                    hasMore={usersCount > userList.length}
                                    loader={<>
                                    {usersCount != userList.length &&
                                    <div className='w-100 h-100'>
                                        <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                                            <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                            <div className="spinner-border taskloader" role="status">                                    
                                                <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                            </div>
                                        </div> 
                                    </div>}
                                    </>}
                                    endMessage={<>
                                    {userList.length == 0 ?
                                    <div className='w-100 d-flex justify-content-center'>
                                        <div>
                                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                                            <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                                        </div>
                                    </div> : 
                                    <div className='w-100 d-flex justify-content-center'>
                                        <div>
                                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="x w-100" />
                                            <h4>{intl.formatMessage({id: 'no_more_users_to_show'})}!!!</h4>
                                        </div>
                                    </div>}</>}
                                >
                                <div className="card-group pt-3">                                    
                                {userList.map((userData, i) => {
                                return(
                                    <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-4" key={i} id={'fjgvbrkugfrugrgowiue'+userData.id}>
                                        <div className="card user_card bs_2 h-100 mx-2">
                                            <div className="card-header px-0 d-flex justify-content-between align-items-center">                                  
                                                <div>
                                                    <p className="mb-0"><span>ID:</span> {userData.id}</p>
                                                </div>
                                                <div className="d-flex">
                                                    <button className="btn btn-sm p-1" id='kt_edit_usersettings_toggle' onClick={() => setUserData(userData)}><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></button>
                                                    <div className="btn-group">
                                                        <button className="btn p-1 btn-sm" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                            <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                            <li><button className="dropdown-item" id='kt_edit_usersettings_toggle' onClick={() => setUserData(userData)}>{intl.formatMessage({id: 'edit'})}</button></li>
                                                            <li><button data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup'} onClick={() => setDeleteData(userData)} className="dropdown-item">{intl.formatMessage({id: 'delete'})}</button>
                                                            </li>
                                                        </ul>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="d-flex flex-center">
                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userData.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+userData.id+'/'+userData.profile_image : ''} className="user_img" alt='' />
                                                </div>
                                                <div className="text-center my-4">
                                                    <div className="d-flex justify-content-center mb-2 text-center overflow-hidden">
                                                        <p className="mb-0 contact_name">{userData.first_name} {userData.last_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className='mb-0 text_light'>{userData.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className='mb-0 text_light'>{userData.p_phone_number}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="row">
                                                                <div className="col-sm-6 col-6 mb-3" title={userData.designation_name}>
                                                                    <div className="task_content_single">
                                                                        <div className="d-flex align-items-start single_item">
                                                                            <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="me-2"/>
                                                                            <div className="d-flex flex-column">
                                                                                <small className="text_light">{intl.formatMessage({id: 'designation'})}</small>
                                                                                <p className="mb-0 fw-500">{userData.designation_name}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6 col-6 mb-3" title={userData.department_name}>
                                                                    <div className="task_content_single">
                                                                        <div className="d-flex align-items-start single_item">
                                                                        <img src={toAbsoluteUrl('/media/custom/google_ads.svg')} alt="" className="me-2"/>
                                                                            <div className="d-flex flex-column">
                                                                                <small className="text_light">{intl.formatMessage({id: 'department'})}</small>
                                                                                <p className="mb-0 fw-500">{userData.department_name}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>  
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                                    
                                </div>
                                </InfiniteScroll>}
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="userToastAdd">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'user_created_successfully'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastUpdate">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'user_updated_successfully'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastDelete">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'user_deleted_successfully'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastError">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'subscription_name'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="usrimgSizeErr">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'please_upload_image_size_below_2_mb'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="usrimgFileErr">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'please_upload_a_valid_image'})}!</div>
                                    </div>
                                </div>
                                <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="userEmailExist">
                                    <div className="toast-header">
                                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                                        <button aria-label="Close" className="btn-close btn-close-color-white" 
                                                    data-bs-dismiss="toast" type="button">
                                        </button> 
                                    </div>
                                    <div className="toast-body">
                                        <div>{intl.formatMessage({id: 'email_already_exist'})}!</div>
                                    </div>
                                </div>
                            </div>
                            )}
                         {toggle == 'list' && (
                                <>
                        <div style={{maxWidth: '100%',}}>
                            {userList.length > 0 ?
                            <MaterialTable className="p-3"
                            icons={tableIcons}
                            columns={columns}
                            data={userList}
                            title="Users"
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
                            : <div className="text-center w-100">
                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                <p className='mt-3'>{intl.formatMessage({id: 'no_lead_contacts_available'})}</p>
                                </div>
                            }
                        </div>
                        </>
                         )}
                </div>
                <div className={params == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="manage-teams" role="tabpanel" aria-labelledby="manage-teams-tab">
                <TeamsList/>                    
                </div>
                <div className={params == 3 ? "tab-pane fade show active" : "tab-pane fade"} id="attendance" role="tabpanel" aria-labelledby="attendance-tab">
                    {/* <div className="d-flex flex-column flex-center mb-9">   
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <h2>{intl.formatMessage({id: 'under_construction'})}</h2>
                    </div> */}
                    <ReactBigCalendar toggle={attChange}/>
                </div>
                <div className={params == 4 ? "tab-pane fade show active" : "tab-pane fade"} id="performance" role="tabpanel" aria-labelledby="performance-tab">
                    <div className="d-flex flex-column flex-center mb-9">   
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <h2>{intl.formatMessage({id: 'under_construction'})}</h2>
                    </div>
                    <div className='d-none'>
                        <UserPerformance/>
                    </div>  
                </div>
                <div className={params == 5 ? "tab-pane fade show active" : "tab-pane fade"} id="time-sheets" role="tabpanel" aria-labelledby="time-sheets-tab">
                    <div className=''>
                        <TimeSheet/>
                    </div>
                </div>
                <div className={params == 6 ? "tab-pane fade show active" : "tab-pane fade"} id="log-sheets" role="tabpanel" aria-labelledby="log-sheets-tab">
                    <div className=''>
                        <UserTimeline/>
                    </div>
                </div>
                <div className={params == 7 ? "tab-pane fade show active" : "tab-pane fade"} id="role-profile" role="tabpanel" aria-labelledby="role-profile-tab">
                    <div className=''>
                    <RoleProfile/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export {UserManagement}