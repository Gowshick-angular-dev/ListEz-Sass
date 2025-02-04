import React,{FC, useEffect, useState, forwardRef} from 'react'
import { toAbsoluteUrl } from '../../../../_metronic/helpers' 
import Moment from 'moment';
import MaterialTable from 'material-table'
import { getAllAttendanceList, getUsers } from './core/_requests';
import { useAuth } from '../../../modules/auth';
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

const TimeSheet = () => {

    const intl = useIntl();
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const {currentUser, logout} = useAuth();
    const usersName = currentUser?.first_name;
    const [pageHeight, setPageHeight] = useState('');
    const [resTimeSheet, setResTimeSheet] = useState([]);
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('Users...');
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attUser, setAttUser] = useState("");
    const [filtered, setFiltered] = useState([]);

    const TimeSheetList = async () => {
        let body = {
            "start": '',
            "end": '',
            "users": ''
        }
        const response = await getAllAttendanceList(body)
        setResTimeSheet(response.output)
    }

    const usersList =  async () => {
      const userResponse = await getUsers()
      setUsers(userResponse.output);    
    }

    const userFilter = async () => {
        let body = {
            "start": startDate,
            "end": endDate,
            "users": attUser
        }
        const response = await getAllAttendanceList(body)
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
            return !item.first_name?.toLowerCase().includes(searchFor);
          }
          return item.first_name?.toLowerCase().includes(search);
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
        heigh = '450px'
      }
      setPageHeight(heigh)
    } 

    useEffect(() => {
        usersList();
        setHeight();
        TimeSheetList();
      }, [window.innerHeight]);

    const cashbacks = [
        { title: "Sl.No", render: rowData => resTimeSheet?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { field: 'title', title: 'Name', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'start', title: 'Date & Time', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'attendance_status_name', title: 'Status', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'leave_type_name', title: 'Leave Type', cellStyle: {whiteSpace: 'nowrap'} },
      ];

    return(
        <section className="timesheet_area">
            <div className="row justify-content-end">
                <div className="col-6 col-md-3 col-xl-2 p-2">
                    <input className='form-control p-2' type="date" id='startingDateInList' onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="col-6 col-md-3 col-xl-2 p-2">
                    <input className='form-control p-2' type="date" min={startDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="col-6 col-md-3 col-xl-2 p-2">
                    <input className="form-control p-2" type="button" value={userName} id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"/>
                    <div className="dropdown-menu" aria-labelledby="defaultDropdown">
                        <div className="input-group form_search my-3 dropdown-item">
                        <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-secondary" type="button">
                            <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                            </button>
                        </div>
                        </div>
                    <ul className='db_dw_menu ps-2 mb-0'>
                    {!search
                        ? users.map((item, i) => (
                        <li className="dropdown-item border-0 fs-7" key={i} onClick={() => {
                            setAttUser(item.user_id);
                            setUserName(item.first_name + ' ' + item.last_name);
                        }}>{item.first_name + ' '}{item.last_name ?? ''}</li>
                        ))
                        : filtered.map((item, j) => (
                        <li className="dropdown-item border-0 fs-7" key={j} onClick={() => {
                            setAttUser(item.user_id);
                            setUserName(item.first_name + ' ' + item.last_name);
                        }}>{item.first_name + ' '}{item.last_name ?? ''}</li>
                        ))}</ul></div>
                </div>
                <div className="col-6 col-md-3 col-xl-2 p-2">
                    <button className='btn btn-sm btn_primary w-100' type="submit" onClick={userFilter}>{intl.formatMessage({id: 'search'})}</button>
                </div>
                <div className='col-12 mt-3'>
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
                              position: "sticky",
                              backgroundColor: '#ececec',
                              color: '#000',
                              whiteSpace: 'nowrap'
                          },
                          rowStyle: {
                              backgroundColor: '#fff',
                          }
                      }}
                      /> 
                    </div>
                </div>
        </section>
    )
}
export{TimeSheet}