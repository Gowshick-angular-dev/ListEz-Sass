import React,{FC, useEffect, useState, forwardRef} from 'react'
import { toAbsoluteUrl } from '../../../../_metronic/helpers' 
import Moment from 'moment';
import { KTSVG } from '../../../../_metronic/helpers';
import { Toast } from 'bootstrap';
import moment from 'moment';
import MaterialTable from 'material-table'
import { getLogTimeLine } from './core/_requests';
import { useAuth } from '../../../modules/auth';
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

const UserTimeline = () => {
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const {currentUser, logout} = useAuth();
    const userId = currentUser?.id;
    const roleId = currentUser?.designation;
    const usersName = currentUser?.first_name;
    const [pageHeight, setPageHeight] = useState('');
    const [resTimeSheet, setResTimeSheet] = useState([]);
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState(usersName);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attUser, setAttUser] = useState("");
    const [filtered, setFiltered] = useState([]);

    const TimeSheetList = async () => {
        let start = Moment(startDate).format('YYYY-MM-DD');
        let end = Moment(endDate).format('YYYY-MM-DD');
        let body = {
            "user": userId,
            "role": roleId,
            "start": '',
            "end": '',
            "users": ''
        }
        const response = await getLogTimeLine(body)
        setResTimeSheet(response.output)
    }

    // const usersList =  async () => {
    //     const Response = await getUsersByRole(userId, roleId)
    //     setUsers(Response);
    // }

    const userFilter = async () => {
        // let start = Moment(startDate).format('YYYY-MM-DD');
        // let end = Moment(endDate).format('YYYY-MM-DD');
        let body = {
            "user": userId,
            "role": roleId,
            "start": startDate,
            "end": endDate,
            "users": attUser
        }
        const response = await getLogTimeLine(body)
        setResTimeSheet(response.output)
    }

    function filterItem(item, search) {
        if (search.startsWith("@")) {
          const bucket = search.substring(1).split(":");
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
            return !item.employee_name_lower?.toLowerCase().includes(searchFor);
          }
          return item.employee_name_lower?.toLowerCase().includes(search);
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

      useEffect(() => {
        let filteredData = [];
        if (search.length) {
            users.forEach((item) => {
            if (filterItem(item, search.toLowerCase())) {
              filteredData.push({ ...item });
            }
          });
        }
        setFiltered(filteredData);
    }, [search]);

    const setHeight = () => {
      let heigh ;
      if(window.innerHeight > 720) {
        heigh = '550px'
      } else {
        heigh = '440px'
      }
      setPageHeight(heigh)
    } 

    useEffect(() => {
      setHeight();
    }, [window.innerHeight]);
    
    useEffect(() => {
        // usersList();
        TimeSheetList();
      }, []);

    const cashbacks = [
        { field: 'user_id', title: 'User Id', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'user_name', title: 'User Name', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'login_time', title: 'Date', render: rowData => rowData.login_time?.split(" ")[0], cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'email', title: 'Email', cellStyle: {whiteSpace: 'nowrap'} }, 
      ];

    return(
        <section className="timesheet_area">
            <div className="row justify-content-end">
                <div className="col-5 col-sm-4 col-md-3 col-xl-2 p-2">
                    <input className='form-control p-2' type="date" id='startingDateInList' max={moment().format("YYYY-MM-DD")} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="col-5 col-sm-4 col-md-3 col-xl-2 p-2">
                    <input className='form-control p-2' type="date" min={startDate} max={moment().format("YYYY-MM-DD")} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="col-2 col-sm-4 col-md-3 col-xl-2 p-2">
                    <button className='btn btn_primary btn-sm w-100' type="submit" onClick={userFilter}>Search</button>
                </div>
                <div className='col-12 mt-3'>
                {resTimeSheet.length > 0
                    ? 
                    <MaterialTable className="p-3"
                        enableRowNumbers={true}
                        icons={tableIcons}
                        columns={cashbacks}
                        data={resTimeSheet}
                        title=""
                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 25,
                            pageSizeOptions: [25, 50, 100, 500],
                            maxBodyHeight: pageHeight,
                            exportButton: permissions.export == 1 ? true : false,
                            columnsButton: true,
                            headerStyle: {
                                backgroundColor: '#ececec',
                                color: '#000',
                            },
                            rowStyle: {
                                backgroundColor: '#fff',
                            }
                        }}
                        />
                    : <div className="text-center w-100">
                        <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                        <p className='mt-3'>No CashBack Available</p>
                    </div>} 
                    </div>
                </div>
        </section>
    )
}
export{UserTimeline}