import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import 'react-funnel-pipeline/dist/index.css'
import { right } from '@popperjs/core';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getAdminCountAll, getCountAll, getDashboardDropdowns } from './core/requests';
import { getTeams, getUsers } from '../settings/userManagement/core/_requests'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder'
import { Line } from 'react-chartjs-2'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getPaymentDetailsByOrg } from '../settings/subscription/request'
import { OverviewCountBar } from './overview_Admin/count_Overview'
import { ContactOverviewDoughnut2 } from './overview_Admin/ContactOverviewPie2'
import { ContactOverviewDoughnut } from './overview_Admin/ContactOverviewPie'
import { OverviewCount2Bar } from './overview_Admin/count_overview2'
import { LeadDoughnutOverview2 } from './overview_Admin/LeadOverviewPie2'
import { LeadDoughnutOverview } from './overview_Admin/LeadOverviewPie'
import { OverviewCount3Bar } from './overview_Admin/count_overview3'
import { TransactionDoughnutOverview2 } from './overview_Admin/TransactionOverviewPie2'
import { TransactionDoughnutOverview } from './overview_Admin/TransactionOverviewPie'
import { DashboardToolbar } from './DashboardToolbar'
import { ContactBar } from './contact/contactBar'
import { ContactDoughnut } from './contact/contactDoughnut'
import { ContactFunnel } from './contact/contactFunnel'
import { LeadBar } from './lead/leadBar'
import { LeadDoughnut } from './lead/leadDoughnut'
import { LeadFunnel } from './lead/leadFunnel'
import { ProjectBar } from './project/projectBar'
import { PropertyDoughnut } from './project/projectDoughnut'
import { PropertyFunnel } from './project/projectFunnel'
import { TaskBar } from './task/taskBar'
import { TransactionBar } from './transaction/transactionBar'
import { TransactionFunnel } from './transaction/transactionFunnel'
import { TaskFunnel } from './task/taskFunnel'
import { ContactTaskList } from './contact/contactTaskList'
import { LeadTaskList } from './lead/leadTaskList'
import { PropertyTaskList } from './project/projectTaskList'
import { ContactSpeedometer } from './contact/contactSpeedometer'
import { LeadSpeedometer } from './lead/leadSpeedometer'
import { TaskDoughnut } from './task/taskDoughnut'
import { TransactionDoughnut } from './transaction/transactionDoughnut'
import NotificationPage from '../Notification/notification'
import {getProperties} from '../property/core/_requests'
import { PropertyDoughnut2 } from './project/projectPie2'
import { ContactDoughnut2 } from './contact/contactPie2'
import { LeadDoughnut2 } from './lead/leadPie2'
import { TaskDoughnut2 } from './task/taskPie2'
import { TransactionDoughnut2 } from './transaction/transactionPie2'
import { AttendanceBar } from './attendance_chart'
import { InTimeList } from './intime_list'
import { TaskTaskList } from './task/taskTasklist'
import { getOrganizationTheme } from '../settings/ThemeBuilder/request'

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Revenue',      
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July','Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
export const data = {
  labels,
  datasets: [{
    label: 'transaction',
    backgroundColor: '#3bb6f1',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45, 50, 55, 60],
  }]
};

export const data2 = {
  labels: ['Google Ads', 'MagicBricks', 'FaceBook', 'Instagram', 'Newspaper', 'Walk-in'],
  datasets: [
    {
      label: '# of Votes',
      data: [20,10,5,45,20],
      backgroundColor: [
          '#e27e0c',
          '#ff6700',
          '#208ae6',
          '#03a128',
          '#f37485',
          '#0c4688',
      ],
      borderColor: [
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
      ],
      borderWidth: 5,
    },
  ],
};

export const options2 = {
  plugins: {
      legend: {
          display: true,
          position: right,
          labels: {
              color: '#000',
              fontSize:'100',
          },
      }
  }
};

const DashboardWrapper: FC = () => {

  const userData:any = localStorage.getItem('themeData')
  const djfghsfj = JSON.parse(userData);
  const navigate = useNavigate();

  const intl = useIntl()
  const [countAll, setCountAll] = useState<{[key: string]: any}>({});
  const {currentUser, logout} = useAuth();
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const usersName = currentUser?.first_name;
  const orgId = currentUser?.org_id;
  const [tab, setTab] = useState(roleId == 1 ? 'overview' : 'contact');
  const [userName, setUserName] = useState<any>(usersName);
  const [CountSource, setCountSource] = useState<any[]>([]);
  const [CountType, setCountType] = useState<any[]>([]);
  const [CountCategory, setCountCategory] = useState<any[]>([]);
  const [CountStatus, setCountStatus] = useState<any[]>([]);
  const [CountGroup, setCountGroup] = useState<any[]>([]);
  const [CountCity, setCountCity] = useState<any[]>([]);
  const [CountLocality, setCountLocality] = useState<any[]>([]);
  const [CountState, setCountState] = useState<any[]>([]);
  const [CountGender, setCountGender] = useState<any[]>([]);
  const [CountNationality, setCountNationality] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(''); 
  const [loading, setLoading] = useState(false);  
  const [delLoading, setDelLoading] = useState(true);  
  const [teamId, setTeamId] = useState(0);
  const [list, setList] = useState(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState('1');
  const [logoutTimer, setLogoutTimer] = useState(1);
  const [reqId, setReqId] = useState(userId);
  const [filteredTeam, setFilteredTeam] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]); 
  const [filteredProp, setFilteredProp] = useState<any[]>([]); 
  const [reqData, setReqData] = useState<any>({}); 
  const [adminDBcount, setAdminDBcount] = useState<any>({});
  const [teams, setTeams] = useState<any[]>([]); 
  const [users, setUsers] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);   

//ALL
  
  const CountAllModule =  async () => {
      const CountAllRes = await getCountAll()
      setCountAll(CountAllRes.output);
  }

  const usersList =  async () => {
    const Response = await getUsers()
    setUsers(Response.output);
  }

  const databarcontact = {
    labels,
    datasets: [{
      label: 'Dataset',
      borderColor: '#ff6700',
      backgroundColor: `#ff67008f`,
      pointStyle: 'circle',
      pointRadius: 5,
      pointHoverRadius: 10,
      data: [300,200,300,400,400,500,600,400,300,200,500,100],
      fill: true
    }]
  };

  const paymentDetailsByOrg = async () => {
    const response = await getPaymentDetailsByOrg(orgId)
    // console.log("efjghwurtwuergurguew", response);  
    // let alertDate:any = response.output[0].start_date
  }

const adminDBCount = async () => {
  const response = await getAdminCountAll();
  setAdminDBcount(response.output)
}

const dashboardDropdowns = async () => {
  const response = await getDashboardDropdowns();
  let userList = response.output?.users?.map((item:any) => {
    return {
    'first_name': item.user_name,
    'id': item.user_id
    }
  });
  setUsers(userList?.sort((a:any, b:any) => a.first_name.localeCompare(b.first_name)));
  setTeams(response.output?.teams);
}

const bussinessSettings = async () => {
  const response = await getOrganizationTheme()
  console.log("lhfieuriurgwe", response.output);
  if(response.status == 200) {
      setLogoutTimer(response.output?.logout_timer);
      localStorage.setItem('logoutIn', response.output?.logout_timer);
      if(roleId == 6) {
        navigate('/menu/contact/');
      }
  }         
}

useEffect(() => {    
  setTimeout(() => setDelLoading(false), 3000);
  if(roleId != 4) {
  setTimeout(() => handleTeam(userId, usersName), 1000);
  }    
}, [])

useEffect(() => {
  CountAllModule();
  paymentDetailsByOrg();
  adminDBCount();
  bussinessSettings();
  // teamsList();
  // usersList();
  dashboardDropdowns();
}, []);

const graphXContact = CountSource.map((obj) => Object.values(obj)[0]);
const graphXContacttype = CountType.map((obj) => Object.values(obj)[0]);
const graphXContactcategory = CountCategory.map((obj) => Object.values(obj)[0]);
const graphXContactstatus = CountStatus.map((obj) => Object.values(obj)[0]);
const graphXContactgroup = CountGroup.map((obj) => Object.values(obj)[0]);
const graphXContactcity = CountCity.map((obj) => Object.values(obj)[0]);
const graphXContactlocality = CountLocality.map((obj) => Object.values(obj)[0]);
const graphXContactstate = CountState.map((obj) => Object.values(obj)[0]);
const graphXContactgender = CountGender.map((obj) => Object.values(obj)[0]);
const graphXContactnationality = CountNationality.map((obj) => Object.values(obj)[0]);
const graphYContact = CountSource.map((obj) => Object.values(obj)[1]);
const graphYContacttype = CountType.map((obj) => Object.values(obj)[1]);
const graphYContactcategory = CountCategory.map((obj) => Object.values(obj)[1]);
const graphYContactstatus = CountStatus.map((obj) => Object.values(obj)[1]);
const graphYContactgroup = CountGroup.map((obj) => Object.values(obj)[1]);
const graphYContactcity = CountCity.map((obj) => Object.values(obj)[1]);
const graphYContactlocality = CountLocality.map((obj) => Object.values(obj)[1]);
const graphYContactstate = CountState.map((obj) => Object.values(obj)[1]);
const graphYContactgender = CountGender.map((obj) => Object.values(obj)[1]);
const graphYContactnationality = CountNationality.map((obj) => Object.values(obj)[1]);


const lableContactSource = [];
for(var i=0;i<graphXContact.length;i++) {
  var val1 = graphXContact[i];
  var val2 = graphYContact[i];
  var value = val2+'-'+val1;
  lableContactSource.push(value);
}
const lableContactType= [];
for(var j=0;j<graphXContacttype.length;j++) {
  var val3 = graphXContacttype[j];
  var val4 = graphYContacttype[j];
  var value1 = val4+'-'+val3;
  lableContactType.push(value1);
}
const lableContactCategory = [];
for(var k=0;k<graphXContactcategory.length;k++) {
  var val5 = graphXContactcategory[k];
  var val6 = graphYContactcategory[k];
  var value2 = val6+'-'+val5;
  lableContactCategory.push(value2);
}
const lableContactStatus = [];
for(var l=0;l<graphXContactstatus.length;l++) {
  var val7 = graphXContactstatus[l];
  var val8 = graphYContactstatus[l];
  var value3 = val8+'-'+val7;
  lableContactStatus.push(value3);
}
const lableContactGroup = [];
for(var m=0;m<graphXContactgroup.length;m++) {
  var val9 = graphXContactgroup[m];
  var val10 = graphYContactgroup[m];
  var value4 = val10+'-'+val9;
  lableContactGroup.push(value4);
}

const lableContactCity = [];
for(var n=0;n<graphXContactcity.length;n++) {
  var val11 = graphXContactcity[n];
  var val12 = graphYContactcity[n];
  var value5 = val12+'-'+val11;
  lableContactCity.push(value5);
}
const lableContactLocality = [];
for(var o=0;o<graphXContactlocality.length;o++) {
  var val13 = graphXContactlocality[o];
  var val14 = graphYContactlocality[o];
  var value6 = val14+'-'+val13;
  lableContactLocality.push(value6);
}
const lableContactState = [];
for(var p=0;p<graphXContactstate.length;p++) {
  var val15 = graphXContactstate[p];
  var val16 = graphYContactstate[p];
  var value7 = val16+'-'+val15;
  lableContactState.push(value7);
}
const lableContactGender = [];
for(var q=0;q<graphXContactgender.length;q++) {
  var val17 = graphXContactgender[q];
  var val18 = graphYContactgender[q];
  var value8 = val18+'-'+val17;
  lableContactGender.push(value8);
}
const lableContactNationality = [];
for(var r=0;r<graphXContactnationality.length;r++) {
  var val19 = graphXContactnationality[r];
  var val20 = graphYContactnationality[r];
  var value9 = val20+'-'+val19;
  lableContactNationality.push(value9);
}

const teamsList =  async () => {
  const Response = await getTeams()
  setTeams(Response.output);
}

const initialValues = {
  start_date: "",
  end_date: "",
}

const taskSaveSchema = Yup.object().shape({
  start_date: Yup.string(),
  end_date: Yup.string(),
})

const formik = useFormik({
  initialValues,
  validationSchema: taskSaveSchema ,
  onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
    try {

      setFromDate(values.start_date)
      setToDate(values.end_date)
      var body = {
        'start_date': values.start_date,
        'end_date': values.end_date,
        'filter': '7',
        'user': reqId,
        'user_name': userName,
        'team': teamId,
      } 
      setReqData(body);

    } catch (error) {
      console.error(error)
      setStatus('The registration details is incorrect')
      setSubmitting(false)
      setLoading(false)
    }
}})

const ListChange = (e:any) => {
  setList(e);
  setTeamId(0);
}

const handleTeam = async (id:any, name:any) => {
  setLoading(true);
  setTeamId(id);
  setReqId(0);
  setUserName(name);
  var body = {
    'start_date': fromDate,
    'end_date': toDate,
    'filter': dateRange,
    'user': 0,
    'user_name': name,
    'team': id,
  } 
  setReqData(body);
  setLoading(false);
}

const userFilter = async (name:any, id:any) => {
  setLoading(true);
  setTeamId(0);
  setReqId(id);
  setUserName(name);
  var body = {
    'start_date': fromDate,
    'end_date': toDate,
    'filter': dateRange,
    'user': id,
    'user_name': name,
    'team': 0,
  } 
  setReqData(body);
  setLoading(false);
}

useEffect(() => {
  var body = {
    'start_date': fromDate,
    'end_date': toDate,
    'filter': 1,
    'user': userId,
    'user_name': usersName,
    'team': 0,
  } 
  setReqData(body);
  propertyListView();
}, []);

function filterItem(item:any, search:any) {
  if (search.startsWith("@")) {
    const bucket = search?.toLowerCase().substring(1).split(":");
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
      if(tab != 'property') {
      if(list == 1) {
      return !item.team_leader_name?.toLowerCase().includes(searchFor);
      } else {
      return !item.first_name?.toLowerCase().includes(searchFor);
    }} else {
      return !item.name_of_building?.toLowerCase().includes(searchFor);
    }
    }
    if(tab != 'property') {
    if(list == 1) {
    return item.team_leader_name?.toLowerCase().includes(search);
     } else {
    return item.first_name?.toLowerCase().includes(search);
     } } else {
      return item.name_of_building?.toLowerCase().includes(search);
     }
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

// const buttonClick = () => {
//   addNotification({
//       title: 'Warning',
//       subtitle: 'This is a subtitle',
//       message: 'This is a very long message',
//       theme: 'darkblue',
//       native: true 
//   });
// };

useEffect(() => {
  let filteredData:any = [];
  if (search.length) {
    if(tab != 'property') {
    if(list == 1) {
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
  } else {
    propertiesList.forEach((item) => {
      if (filterItem(item, search.toLowerCase())) {
        filteredData.push({ ...item });
      }
    });
  }
  }
  if(tab != 'property') {
  if(list == 1) {
  setFilteredTeam(filteredData);
  } else {
  setFiltered(filteredData);
  }} else {
    setFilteredProp(filteredData);
  }
}, [search]);

const propertyListView = async () => {
  const response = await getProperties({
    "available_for": '',
    "project": '',
    "amenities": '',
    "commission_min": '',
    "commission_max": '',
    "property_type": '',
    "property_source": '',
    "property_status": '',
    "legal_approval": '',
    "property_indepth": '',
    "country": '',
    "state": '',
    "city": '',
    "segment": '',
    "zip_code": '', 
    "locality": '',
    "age_of_property": '',
    "property_facing": '',
    "project_stage": '',
    "gated_community": '',
    "vasthu_compliant": '',
    "no_of_units_min": '',                      
    "no_of_units_max": '',
    "no_of_floors_min": '',
    "no_of_floors_max": '',
    "rera_registered": '',
    "created_date": '',
    "created_end_date": '',
    "created_by": '',
    "available_start_date": '',
    "available_end_date": '',
    "filter_name": '',
    "limit": '',
    "sortBy": '',
})
  setPropertiesList(response.output);
}

return (<>
    {delLoading ? 
      <div className='w-100 h-100'>
          <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
              <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
              <div className="spinner-border taskloader" role="status">                                    
                  <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
              </div>
          </div> 
      </div> :
    <>
    {orgId != 1 && roleId != 5 && roleId != 6 &&
    <DashboardToolbar name={userName} />}
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'dashboard'})}</PageTitle>
      <div className='d-none'>
        <ThemeBuilder/>
      </div>
      {/* <NotificationPage/> */}
      <button className='d-none' id='overAllCustomDateOverviewToday' onClick={() => {
        setLoading(true);
        setDateRange('1');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '1',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <button className='d-none' id='overAllCustomDateOverviewYesterDay' onClick={() => {
        setLoading(true);
        setDateRange('2');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '2',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <button className='d-none' id='overAllCustomDateOverviewLastWeek' onClick={() => {
        setLoading(true);
        setDateRange('3');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '3',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <button className='d-none' id='overAllCustomDateOverviewLastMonth' onClick={() => {
        setLoading(true);
        setDateRange('4');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '4',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <button className='d-none' id='overAllCustomDateOverviewThisMonth' onClick={() => {
        setLoading(true);
        setDateRange('5');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '5',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <button className='d-none' id='overAllCustomDateOverviewThisYear' onClick={() => {
        setLoading(true);
        setDateRange('6');
        setFromDate('');
        setToDate('');
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': '6',
          'user': reqId,
          'user_name': userName,
          'team': teamId,
        } 
        setReqData(body);
        setLoading(false);
      }}></button>
      <div className="dashboard_wrapper">
      <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastAttendance">
          <div className="toast-header">
              <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
              <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button> 
          </div>
          <div className="toast-body">
              <div>{intl.formatMessage({id: 'checked-in_successfully'})}!</div>
          </div>
      </div>
      <button type='button' data-bs-toggle='modal' data-bs-target='#overAllCustomDateOverviewrtgvtgrtgrthvrth' className='d-none' id='overAllCustomDateOverview'>{intl.formatMessage({id: 'custom_date'})}</button>
      <div className='modal fade' id='overAllCustomDateOverviewrtgvtgrtgrthvrth' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <form noValidate onSubmit={formik.handleSubmit}>
                    <div className='modal-header py-2'>
                        <h3>{intl.formatMessage({id: 'select_custom_range'})}</h3>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' id='leadPieModelClose'>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                    </div>
                    <div className='modal-body py-3 px-lg-10 pb-2'>
                        <div className='row'>                                
                        <div className="col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'start_date'})}</label>
                            <div className="input-group mb-3">
                                <input type="date" className="form-control" {...formik.getFieldProps('start_date')}/> 
                            </div>
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'end_date'})}</label>
                            <div className="input-group mb-3">
                                <input type="date" className="form-control" {...formik.getFieldProps('end_date')}/> 
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='model-footer'>
                        <div className='d-flex align-items-center justify-content-end pb-3 pe-6 pt-0'>
                        <button
                        type='submit'
                        
                        className='btn btn-sm btn_primary text-primary'
                        disabled={formik.isSubmitting}
                        data-bs-dismiss='modal'
                        >
                        <span className='indicator-label'>{intl.formatMessage({id: 'filter'})}                        
                        </span>                        
                        </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
      </div>
      <button type='button' data-bs-toggle='modal' data-bs-target='#user_subscription_popup' className='d-none' id='user_subscription_popup_trigger'>Pop</button>
      <div className='modal fade' id={'user_subscription_popup'} aria-hidden='true'>
          <div className='modal-dialog modal-dialog-centered d-flex justify-content-center'>
              <div className='modal-content subscription_alert'>
                  <div className='modal-header border-0 pb-0'>
                      <h3 className='w-100 text-center'>{intl.formatMessage({id: 'subscription'})}</h3>
                  </div>
                  <div className='modal-body py-lg-5 px-lg-10 text-center'>
                      <span className="svg-icon svg-icon-muted svg-icon-5hx"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" d="M20.9 12.9C20.3 12.9 19.9 12.5 19.9 11.9C19.9 11.3 20.3 10.9 20.9 10.9H21.8C21.3 6.2 17.6 2.4 12.9 2V2.9C12.9 3.5 12.5 3.9 11.9 3.9C11.3 3.9 10.9 3.5 10.9 2.9V2C6.19999 2.5 2.4 6.2 2 10.9H2.89999C3.49999 10.9 3.89999 11.3 3.89999 11.9C3.89999 12.5 3.49999 12.9 2.89999 12.9H2C2.5 17.6 6.19999 21.4 10.9 21.8V20.9C10.9 20.3 11.3 19.9 11.9 19.9C12.5 19.9 12.9 20.3 12.9 20.9V21.8C17.6 21.3 21.4 17.6 21.8 12.9H20.9Z" fill="currentColor"/>
                        <path d="M16.9 10.9H13.6C13.4 10.6 13.2 10.4 12.9 10.2V5.90002C12.9 5.30002 12.5 4.90002 11.9 4.90002C11.3 4.90002 10.9 5.30002 10.9 5.90002V10.2C10.6 10.4 10.4 10.6 10.2 10.9H9.89999C9.29999 10.9 8.89999 11.3 8.89999 11.9C8.89999 12.5 9.29999 12.9 9.89999 12.9H10.2C10.4 13.2 10.6 13.4 10.9 13.6V13.9C10.9 14.5 11.3 14.9 11.9 14.9C12.5 14.9 12.9 14.5 12.9 13.9V13.6C13.2 13.4 13.4 13.2 13.6 12.9H16.9C17.5 12.9 17.9 12.5 17.9 11.9C17.9 11.3 17.5 10.9 16.9 10.9Z" fill="#ff6700"/>
                        </svg>
                      </span>
                      <h2 className='py-3'>Oops!!!</h2>
                      <p>{intl.formatMessage({id: "you_dont_have_a_active_subscription_plan"})}</p>
                      <p>{intl.formatMessage({id: "buy_a_plan_to_access_all_the_features"})}</p>
                      <Link to="/userSubscriptionPage">
                        <button type='button' className="btn btn_primary btn-sm br_30" data-bs-dismiss='modal'>{intl.formatMessage({id: "learn_more"})}</button>
                      </Link>
                  </div>
              </div>
          </div>
      </div>
      
      <div className='modal fade' id='brgfuegviuengweriggivehniuggebuhb' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered list_width_db'>
                <div className='modal-content p-3'>
                  {tab != 'property' ? 
                <div className="">
                  <select className="form-select btn btn-sm btn_secondary" value={list} onChange={(e) => ListChange(e.target.value)}>
                    <option value="1">{intl.formatMessage({id: 'teams'})}</option>
                    <option value="2">{intl.formatMessage({id: 'users'})}</option>
                  </select>
                  <div className="input-group form_search my-3 dropdown-item">
                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <div className="input-group-append">
                      <button className="btn btn-secondary" type="button">
                      <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                      </button>
                    </div>
                  </div>
              {list == 1 ? <ul className='listHeight overflow-auto' data-bs-dismiss='modal'>
                  {!search
                      ? teams?.map((userData, i) => {
                        return(                            
                        <li className="list-group px-4 py-1" data-bs-dismiss='modal' key={i}>
                          <div className="">
                            <a type="button" onClick={(e) => handleTeam(userData.team_leader_id, userData.team_leader_name)}>
                                <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' />
                                {userData.team_leader_name}
                            </a>
                            </div>                                  
                        </li>
                        )}) 
                      : filteredTeam.length ? filteredTeam.map((item) => (<li  className="list-group px-4 py-1" data-bs-dismiss='modal'>
                      <div className="">
                        <a type="button" onClick={(e) => handleTeam(item.team_leader_id, item.team_leader_name)}>
                          <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' />
                          {item.team_leader_name}
                        </a>
                      </div>
                  </li>)) : <p>{intl.formatMessage({id: 'no_records'})}!!!</p> }
              </ul> : <ul className='listHeight overflow-auto' data-bs-dismiss='modal'>
                {!search
                    ? users.map((item, i) => (
                    <li className="dropdown-item" key={i} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                    ))
                    : filtered.map((item, j) => (
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                      ))}</ul>}
                </div> : <>
                <div className="input-group form_search my-3 dropdown-item">
                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <div className="input-group-append">
                      <button className="btn btn-secondary" type="button">
                      <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                      </button>
                    </div>
                  </div>
                <ul className='listHeight overflow-auto' data-bs-dismiss='modal'>
                {!search
                    ? propertiesList.map((item, i) => (<>
                    {item.name_of_building &&
                    <li className="dropdown-item" key={i} onClick={() => userFilter(item.name_of_building, item.id)}>{item.name_of_building}</li>}
                    </>))
                    : filteredProp.map((item, j) => (<>
                    {item.name_of_building &&
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.name_of_building, item.id)}>{item.name_of_building}</li>}
                      </>))}</ul></>}
                </div>
            </div>
      </div>
      {orgId != 1 && roleId != 5 && <>
      <div className="">
        <ul className="nav nav-pills mb-3 d-flex justify-content-center row" id="pills-tab" role="tablist">
        {roleId == 1 &&
          <li className="nav-item col m-0" role="presentation">
            <button className={roleId == 1 ? "nav-link active p-1 br_10 w-100 h-100 me-0" : "nav-link p-1 br_10 w-100 h-100 me-0"} id="overview-tab" data-bs-toggle="pill" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true" onClick={() => {
              if(tab == 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': userId,
                  'user_name': usersName,
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('overview');
              setUserName(usersName);
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/dashboard.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'dashboard'})}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>}
          <li className="nav-item col m-0" role="presentation">
            <button className={roleId == 1 ? "nav-link p-1 br_10 w-100 h-100 me-0" : "nav-link active p-1 br_10 w-100 h-100 me-0"} id="contact-tab" data-bs-toggle="pill" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="true" onClick={() => {
              if(tab == 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': userId,
                  'user_name': usersName,
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('contact');
              setUserName(usersName);
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/contact.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'contact'})}</h3>
                        <p className="mb-0 text-nowrap">{intl.formatMessage({id: 'total'})} {'#'+countAll.contacts}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
          <li className="nav-item col m-0" role="presentation">
            <button className="nav-link p-1 br_10 w-100 h-100 me-0" id="lead-tab" data-bs-toggle="pill" data-bs-target="#lead" type="button" role="tab" aria-controls="lead" aria-selected="true" onClick={() => {
              if(tab == 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': userId,
                  'user_name': usersName,
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('lead');
              setUserName(usersName);
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/lead.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'lead'})}</h3>
                        <p className="mb-0 text-nowrap">{intl.formatMessage({id: 'total'})} {'#'+countAll.leads}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
          <li className="nav-item col m-0" role="presentation">
            <button className="nav-link p-1 br_10 w-100 h-100 me-0" id="property-tab" data-bs-toggle="pill" data-bs-target="#property" type="button" role="tab" aria-controls="property" aria-selected="true" onClick={() => {
              if(tab != 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': 0,
                  'user_name': '',
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('property');
              setReqId(0);
              setTeamId(0);
              setUserName('');
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/project.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'project'})}</h3>
                        <p className="mb-0 text-nowrap">{intl.formatMessage({id: 'total'})} {'#'+countAll.properties}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
          <li className="nav-item col m-0" role="presentation">
            <button className="nav-link p-1 br_10 w-100 h-100 me-0" id="transaction-tab" data-bs-toggle="pill" data-bs-target="#transaction" type="button" role="tab" aria-controls="transaction" aria-selected="true" onClick={() => {
              if(tab == 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': userId,
                  'user_name': usersName,
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('transaction');
              setUserName(usersName);
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/transaction.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'transaction'})}</h3>
                        <p className="mb-0 text-nowrap">{intl.formatMessage({id: 'total'})} {'#'+countAll.transactions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>
          {roleId != 1 &&
          <li className="nav-item col m-0" role="presentation">
            <button className="nav-link p-1 br_10 w-100 h-100 me-0" id="task-tab" data-bs-toggle="pill" data-bs-target="#task" type="button" role="tab" aria-controls="task" aria-selected="true" onClick={() => {
              if(tab == 'property') {
                var body = {
                  'start_date': '',
                  'end_date': '',
                  'filter': dateRange,
                  'user': userId,
                  'user_name': usersName,
                  'team': 0,
                } 
                setReqData(body);
              }
              setTab('task');
              setUserName(usersName);
            }}>
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-center py-2">
                    <div className="d-flex align-items-center p-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle me-2 me-xxl-4">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/task.svg')} alt="" />
                      </div>
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <h3 className="mb-0">{intl.formatMessage({id: 'task'})}</h3>
                        <p className="mb-0 text-nowrap">{intl.formatMessage({id: 'total'})} {'#'+countAll.tasks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </li>}   
        </ul>        
      </div>
    {/* Stats card */}
   
    {/* contact */}    
    <div className="tab-content" id="pills-tabContent">
    <div className={roleId == 1 ? "tab-pane fade" : "tab-pane fade show active"} id="contact" role="tabpanel" aria-labelledby="contact-tab">
    <div className="row">
      <div className="col-xl-9 col-xxl-8">
        <div className="row">
          <div className="card-group p-0">
              <div className="col-md-6 col-12 mb-4">
                <ContactBar data={reqData} users={users} teams={teams} />
              </div>
              <div className="col-md-6 col-12 mb-4 pie_chart">
                <ContactDoughnut2 data={reqData} users={users} teams={teams} />
                {/* <ContactSpeedometer data={reqData} users={users} teams={teams} /> */}
              </div>
          </div>
          <div className="card-group p-0">
              <div className="col-md-6 col-12 mb-4 pie_chart">
                <ContactDoughnut data={reqData} users={users} teams={teams} />
              </div>
              <div className="col-md-6 col-12 mb-4 task_list">
                  <ContactTaskList data={reqData} users={users} teams={teams} />
              </div>
          </div> 
        </div>
      </div>
      <div className="col-xxl-4 col-xl-3 funnel_chart mb-4">        
        <ContactFunnel data={reqData} users={users} teams={teams} />
      </div>
    </div>         
    </div>

         
   {/* Lead*/}      
    
    <div className="tab-pane fade" id="lead" role="tabpanel" aria-labelledby="lead-tab">
    <div className="row">
      <div className="col-xl-9 col-xxl-8">
        <div className="row">
            <div className="card-group p-0">
                <div className="col-md-6 col-12 mb-4">
                  <LeadBar data={reqData} users={users} teams={teams} />
                </div>
                <div className="col-md-6 col-12 mb-4 pie_chart">
                  <LeadDoughnut2 data={reqData} users={users} teams={teams} />
                  {/* <LeadSpeedometer data={reqData} users={users} teams={teams} /> */}
                </div>
            </div>
            <div className="card-group p-0">
                <div className="col-md-6 col-12 mb-4 pie_chart">
                  <LeadDoughnut data={reqData} users={users} teams={teams} />
                </div>
                <div className="col-md-6 col-12 mb-4 task_list">
                    <LeadTaskList data={reqData} users={users} teams={teams} />
                </div>
            </div> 
        </div>
      </div>
      <div className="col-xxl-4 col-xl-3 funnel_chart mb-4">
        <LeadFunnel data={reqData} users={users} teams={teams} />
      </div>
       </div>    
    </div>
    


    {/* Property*/}              
     
     <div className="tab-pane fade" id="property" role="tabpanel" aria-labelledby="property-tab">
     <div className="row">
      <div className="col-xl-9 col-xxl-8">
        <div className="row">
              <div className="card-group p-0">
                  <div className="col-md-6 col-12 mb-4">
                    <ProjectBar data={reqData} users={users} teams={teams} />
                  </div>
                  <div className="col-md-6 col-12 mb-4 pie_chart">
                    {/* <PropertyAssignDoughnut data={reqData} users={users} teams={teams} /> */}
                    <PropertyDoughnut2 data={reqData} users={users} teams={teams} />
                    {/* <LeadSpeedometer data={reqData} users={users} teams={teams} /> */}
                  </div>
              </div>
              <div className="card-group p-0">
                  <div className="col-md-6 col-12 mb-4 pie_chart">
                    <PropertyDoughnut data={reqData} users={users} teams={teams} />
                  </div>
                  <div className="col-md-6 col-12 mb-4 task_list">
                    <PropertyTaskList data={reqData} users={users} teams={teams} />
                  </div>
              </div> 
        </div>
      </div>
      <div className="col-xxl-4 col-xl-3 funnel_chart mb-4">
        <PropertyFunnel data={reqData} users={users} teams={teams} />
      </div>
       </div>    
     </div>

   {/*task*/}           
   {roleId != 1 && 
   <div className="tab-pane fade" id="task" role="tabpanel" aria-labelledby="task-tab">
     <div className="row">
      <div className="col-xl-9 col-xxl-8">
        <div className="row">
            <div className="card-group p-0">
                <div className="col-md-6 col-12 mb-4">
                  <TaskBar data={reqData} users={users} teams={teams} />
                </div>
                <div className="col-md-6 col-12 mb-4 pie_chart">
                  <TaskDoughnut2 data={reqData} users={users} teams={teams} />
                  {/* <LeadSpeedometer data={reqData} users={users} teams={teams} /> */}
                </div>
            </div>
            <div className="card-group p-0">
                <div className="col-md-6 col-12 mb-4 pie_chart">
                  <TaskDoughnut data={reqData} users={users} teams={teams} />
                </div>
                <div className="col-md-6 col-12 mb-4 task_list">
                  <TaskTaskList data={reqData} users={users} teams={teams} />
                  {/* <PropertyTaskList data={reqData} users={users} teams={teams} /> */}
                </div>
            </div> 
        </div>
      </div>
      <div className="col-xxl-4 col-xl-3 funnel_chart mb-4">
        <TaskFunnel data={reqData} users={users} teams={teams} />
      </div>
       </div>    
     </div>}

   {/*Transaction*/}            
    
   <div className="tab-pane fade" id="transaction" role="tabpanel" aria-labelledby="transaction-tab">
     <div className="row">
      <div className="col-xl-9 col-xxl-8">
        <div className="row">
              <div className="card-group p-0">
                  <div className="col-md-6 col-12 mb-4">
                    <TransactionBar data={reqData} users={users} teams={teams} />
                  </div>
                  <div className="col-md-6 col-12 mb-4 pie_chart">
                    <TransactionDoughnut2 data={reqData} users={users} teams={teams} />
                    {/* <LeadSpeedometer data={reqData} users={users} teams={teams} /> */}
                  </div>
              </div>
              <div className="card-group p-0">
                  <div className="col-md-6 col-12 mb-4 pie_chart">
                    <TransactionDoughnut data={reqData} users={users} teams={teams} />
                  </div>
                  <div className="col-md-6 col-12 mb-4 task_list">
                    {/* <PropertyTaskList data={reqData} users={users} teams={teams} /> */}
                    <PropertyTaskList data={reqData} users={users} teams={teams} />
                  </div>
              </div> 
        </div>
      </div>
      <div className="col-xxl-4 col-xl-3 funnel_chart mb-4">
        <TransactionFunnel data={reqData} users={users} teams={teams} />
      </div>
       </div>    
     </div>

    {/* Admin Overview */}
    {roleId == 1 &&                              
    <div className={roleId == 1 ? "tab-pane fade show active" : "tab-pane fade"} id="overview" role="tabpanel" aria-labelledby="overview-tab">
      <div className="row">
        <div className="card-group p-0">
            <div className="col-xl-4 col-md-12 col-12 mb-4">
              <OverviewCountBar data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <ContactOverviewDoughnut2 data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <ContactOverviewDoughnut data={reqData} users={users} teams={teams} />
            </div>
        </div>
        <div className="card-group p-0">
            <div className="col-xl-4 col-md-12 col-12 mb-4">
              <OverviewCount2Bar data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <LeadDoughnutOverview2 data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <LeadDoughnutOverview data={reqData} users={users} teams={teams} />
            </div>
        </div>
        <div className="card-group p-0">
            <div className="col-xl-4 col-md-12 col-12 mb-4">
              <OverviewCount3Bar data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <TransactionDoughnutOverview2 data={reqData} users={users} teams={teams} />
            </div>                  
            <div className="col-xl-4 col-md-6 col-12 mb-4 pie_chart">
              <TransactionDoughnutOverview data={reqData} users={users} teams={teams} />
            </div>
        </div>
      </div>     
    </div>}




   </div>
   </>}          
  </div> 
  {orgId == 1 &&
      <div className="">
        <ul className="nav mb-3 d-flex justify-content-center row" id="pills-tab" role="tablist">
          <li className="nav-item col-xl-3 col-md-6 mb-3" role="presentation">
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center ps-6 py-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle p-4 p-xxl-6">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/0001.png')} alt="" />
                      </div>
                    </div>
                    <div className="d-flex align-items-center pe-6 py-2">
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <p className="mb-0 text-nowrap fw-bolder text-dark fs-6 text-end">{intl.formatMessage({id: 'organizations'})}</p>
                        <h2 className="mb-0 fs-1 text-end text-dark adb-text text-end">{adminDBcount.org_count ?? '0'}</h2>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </li>
          <li className="nav-item col-xl-3 col-md-6 mb-3" role="presentation">
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center ps-6 py-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle p-4 p-xxl-6">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/0002.png')} alt="" />
                      </div>
                    </div>
                    <div className="d-flex align-items-center pe-6 py-2">
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <p className="mb-0 text-nowrap fw-bolder text-dark fs-6 text-end">{intl.formatMessage({id: 'subscription_plans'})}</p>
                        <h2 className="mb-0 fs-1 text-end text-dark adb-text text-end">{adminDBcount.subscription_count ?? '0'}</h2>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </li>
          <li className="nav-item col-xl-3 col-md-6 mb-3" role="presentation">
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center ps-6 py-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle p-4 p-xxl-6">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/0003.png')} alt="" />
                      </div>
                    </div>
                    <div className="d-flex align-items-center pe-6 py-2">
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <p className="mb-0 text-nowrap fw-bolder text-dark fs-6 text-end">{intl.formatMessage({id: 'transactions'})}</p>
                        <h2 className="mb-0 fs-1 text-end text-dark adb-text text-end">24</h2>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </li>
          <li className="nav-item col-xl-3 col-md-6 mb-3" role="presentation">
              <div className="card h-100 w-100">
                <div className="counter_card h-100 w-100 br_10 bs_1">
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="d-flex align-items-center ps-6 py-2">
                      <div className="flex-shrink-0 bg-dark rounded_circle p-4 p-xxl-6">
                        <img src={toAbsoluteUrl('/media/custom/menu-icons/0004.png')} alt="" />
                      </div>
                    </div>
                    <div className="d-flex align-items-center pe-6 py-2">
                      <div className="flex-grow-1 ms-xl-1 ms-xxl-3">
                        <p className="mb-0 text-nowrap fw-bolder text-dark fs-6 text-end">{intl.formatMessage({id: 'revenue'})}</p>
                        <h2 className="mb-0 fs-1 text-end text-dark adb-text text-end">₹3254</h2>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </li>             
        </ul> 
        <div className='row admin_db_height'>
          <div className='col-lg-6 p-2'>
            <div className='card bs_1 p-2 h-100'>
              <Line options={options} data={databarcontact}/>
            </div>
          </div>
          <div className='col-lg-6 p-2'>
            <div className='card bs_1 h-100'>
              <div className='px-9 py-5'>
                <ul className="nav nav-pills mb-3 d-flex justify-content-center row admin_tab_switch bg-gray-300 py-2 br_30" id="pills-tab" role="tablist">
                  <li className="nav-item col m-0" role="presentation">
                    <button className={"nav-link active w-100 h-100 m-0 py-2 br_25"} id="expireing-tab" data-bs-toggle="pill" data-bs-target="#expireing" type="button" role="tab" aria-controls="expireing" aria-selected="false">
                      {intl.formatMessage({id: 'expiring_in_30_days'})}
                    </button>
                  </li>
                  <li className="nav-item col m-0" role="presentation">
                    <button className={"nav-link  w-100 h-100 m-0 py-2 br_25"} id="upcomming-tab" data-bs-toggle="pill" data-bs-target="#upcomming" type="button" role="tab" aria-controls="upcomming" aria-selected="false">
                      {intl.formatMessage({id: 'recently_added'})}
                    </button>
                  </li>
                </ul>
              </div>              
              <div className='card-body h-lg-100px p-0'>
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="expireing" role="tabpanel" aria-labelledby="expireing-tab">                         
                    <table className='table table-striped border-0 text-center' id='expireing'>
                      <tbody className=''>
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>smartpriks.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>smartpriks.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>smartpriks.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>smartpriks.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                      </tbody>
                    </table>
                  </div>
                  <div className="tab-pane fade" id="upcomming" role="tabpanel" aria-labelledby="upcomming-tab">                         
                    <table className='table table-striped border-0 text-center' id='upcomming'>
                      <tbody className=''>
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>listez.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>listez.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>listez.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                        <tr className='align-middle'>
                          <td className='table_check ps-3 pe-0'><input type='checkbox' className='form-check-input'/></td>
                          <td className='table_indicator'><span className='bullet bg-success p-2'/></td>
                          <td className='table_logo px-0'>
                            <div className="">
                              <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt="" className='user_img_db'/>
                            </div>
                          </td>
                          <td className='text-start'><a className='fs-5' href='#'>listez.com</a></td>
                          <td className='table_date pe-3 text-muted'>May 08 2022</td>
                        </tr>                  
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <div className='row'>
          <div className='col-md-4 mb-3'>
            <div className='card'>
              
            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card'>

            </div>
          </div>
          <div className='col-md-4 mb-3'>
            <div className='card'>

            </div>
          </div>
        </div>      
      </div>
    }
                   
    <div className={roleId == 5 ? "row hr_db_allignment" : "d-none"}>
      <div className='col-12 col-md-8 h-100'>
        <AttendanceBar/>
      </div>
      <div className='col-12 col-md-4 p-md-0 mt-5 mt-md-0 h-100'>
        <InTimeList/>
      </div>      
    </div>
    </>}
    </>)
}

export {DashboardWrapper}
