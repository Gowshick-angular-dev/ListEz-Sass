import React,{FC, useEffect, useState} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useAuth } from '../../modules/auth';
import { getAttendanceChart, getAttendanceTodayCheckin, getTaskStatusContact } from './core/requests';
import { getUsersByRole } from '../settings/userManagement/core/_requests';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import moment from 'moment';
import { useIntl } from 'react-intl';

ChartJS.register(ArcElement, Tooltip, Legend);

const initialValues = {
    start_date: "",
    end_date: "",
}

const InTimeList: FC = () => {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [userChckinList, setUserChckinList] = useState<any[]>([]);
  
  const attendanceList = async () => {
    const rsponse = await getAttendanceChart()
    setUserChckinList(rsponse.output?.list);
  }

    useEffect(() => { 
      attendanceList();    
    }, []);

    function filterItem(item:any, search:any) {
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
            return item[searchBy].find((val:any) => !val.includes(searchForVal));
          }
          return item[searchBy].find((val:any) => val.includes(searchFor));
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
          return !item.user_name?.toLowerCase().includes(searchFor);
        }
        return item.user_name?.toLowerCase().includes(search);
      }
    }
    
    const getType = (value:any) => {
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
      let filteredData:any[] = [];
      if (search.length) {
        userChckinList.forEach((item) => {
          if (filterItem(item, search.toLowerCase())) {
            filteredData.push({ ...item });
          }
        });
      }
      setFiltered(filteredData);
  }, [search]);

    return(
        <>
        <div className="card mx-sm-1 mx-xl-2 bs_1 h-100 br_15 bar_chart h-100">
          <h3 className='p-5 mb-0'>{intl.formatMessage({id: 'checked-in_today'})}</h3>
          <div className='p-5 pt-0'>
            {/* <div className='input-group input_prepend border'>
              <input type="text" className="form-control border-0" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
              <span className="svg-icon svg-icon-muted svg-icon-2hx"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor"/>
              <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor"/>
              </svg>
              </span>
            </div> */}
            <div className="input-group form_search w-100">
              <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
              <div className="input-group-append">
                <button className="btn btn-secondary" type="button">
                  <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                </button>
              </div>
            </div> 
          </div>                   
            <div className='card-body py-5'>
              {!search ?<>
                {userChckinList.map((Data, i) => {
                  return(
                    <div className='d-flex align-items-center mb-4 bg-light br_10 p-2' key={i}>
                    <div className='symbol symbol-35px me-5'>
                        {/* <span className={Data.status == 1 ? 'symbol-label bg_completed' : Data.status == 2 ? 'symbol-label bg_cancelled' : 'symbol-label bg_inprocess'}>
                        </span> */}
                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={Data.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+Data.user_id+'/'+Data.profile_image : ''} className='symbol-label' />
                    </div>
                    <div className='d-flex justify-content-between w-100'>
                        <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
                        {Data.user_name}
                        </a>
                        <p className="mb-0">{moment(Data.check_in_time).format('hh:mm a')}</p>                    
                    </div>
                    </div>                    
                  )})}</>
                  : <>
                  {filtered.map((Data, i) => {
                  return(
                    <div className='d-flex align-items-center mb-4 bg-light br_10 p-2' key={i}>
                    <div className='symbol symbol-35px me-5'>
                        {/* <span className={Data.status == 1 ? 'symbol-label bg_completed' : Data.status == 2 ? 'symbol-label bg_cancelled' : 'symbol-label bg_inprocess'}></span> */}
                          <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={Data.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+Data.user_id+'/'+Data.profile_image : ''} className='symbol-label' />
                    </div>
                    <div className='d-flex justify-content-between w-100'>
                        <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
                        {Data.user_name}
                        </a>
                        <p className="mb-0">{moment(Data.check_in_time).format('hh:mm a')}</p>                    
                    </div>
                    </div>                    
                  )})}
                  </>}
                {/* <div className='d-flex align-items-center mb-7 bg-light br_10 p-2' key={i}>
                    <div className='symbol symbol-35px me-5'>
                        <span className={TaskData.name === 'Completed' ? 'symbol-label bg_completed' : TaskData.name === 'in process' ? 'symbol-label bg_inprocess' : TaskData.name === 'Cancel' ? 'symbol-label bg_cancelled' : 'symbol-label bg_pending'}>
                        </span>
                    </div>
                    <div className='d-flex justify-content-between w-100'>
                        <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
                        {TaskData.name}
                        </a>
                        <p className="mb-0">{TaskData.value}</p> */}
                    
                </div>
        </div>
        </>
    )
}
export {InTimeList}