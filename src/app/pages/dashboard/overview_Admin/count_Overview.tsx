import React,{FC, useEffect, useState} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useAuth } from '../../../modules/auth';
import { getCounts } from '../core/requests';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import Moment from 'moment';
import {useIntl} from 'react-intl'; 

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
  };

  const initialValues = {
    start_date: "",
    end_date: "",
}

type Props = {
  data?: any,
  users?: any,
  teams?: any,
}

const OverviewCountBar: FC<Props> = (props) => {
  const intl = useIntl();
  const {
    data, users, teams
  } = props
  
    const {currentUser, logout} = useAuth();
    const userId = currentUser?.id;
    const roleId = currentUser?.designation;
    const usersName = currentUser?.first_name;
    const [search, setSearch] = useState("");
    const [contactBar, setContactBar] = useState(1);
    const [teamId, setTeamId] = useState(0);
    const [list, setList] = useState(1);
    const [userName, setUserName] = useState<any>(usersName);
    const [month, setMonth] = useState('');
    const [reqId, setReqId] = useState(userId);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [CountContact, setCountContact] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]); 
    const [labels, setLabels] = useState<any[]>(['Today']);
    const [bar, setBar] = useState<any[]>([]);
    const [filteredTeam, setFilteredTeam] = useState<any[]>([]);    
 
    const CountContactList =  async () => {
      setLoading(true);  
      var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': 1,
      }  

      const CountContactResponse = await getCounts(0, teamId, 1, body)

      const leadbar3 = CountContactResponse.output?.map((obj:any) => obj.count);
      setBar(leadbar3);
      setLoading(false);
    }

    const overallFilter = async (data:any) => {
      var body = {
        'start_date': data?.start_date,
        'end_date': data?.end_date,
        'filter': data?.filter,
      } 
      let CountContactResponse = await getCounts(data?.user, data?.team, 1, body)

      setCountContact(CountContactResponse.output);  
      if(data?.filter == 2) {
        setMonth('');
        setLabels(['Yesterday'])
        const leadbar2 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar2);
      } else if (data?.filter == 3) {
        setMonth('');
        const contactbarLables = CountContactResponse.output?.map((obj:any) => obj.date); 
        setLabels(contactbarLables)
        const leadbar3 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar3);
      } else if (data?.filter == 4) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (data?.filter == 5) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (data?.filter == 6) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('MMMM');
         var itemMonth = Moment(leadbarLables2[i]).format('YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (data?.filter == 7) {
        const leadbarLables3 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables3.length;i++) {
         var item = Moment(leadbarLables3[i]).format('DD');
         var itemMonth = Moment(leadbarLables3[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar5 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar5);
      } else {
        setMonth('');
        setLabels(['Today'])
        const leadbar = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar);
      }
    }

    useEffect(() => {
      if(data?.user != undefined) {
        console.log("erhwiugriuwegriweg", data);
        setToDate(data?.end_date);
        setFromDate(data?.start_date);
        setContactBar(data?.filter);
        setReqId(data?.user);
        setTeamId(data?.team);
        setUserName(data?.user_name);
        overallFilter(data);    
      }
    }, [data]);

    const rangeSelect = async (val:any) => {
      setFromDate('');
      setToDate('');
      setMonth('');
      if(val == 7) {
        document.getElementById('contactBarCustomDateRangeOverview1')?.click();
      } else { 
        setContactBar(val);
        setLoading(true);
      var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': val,
      } 
      let CountContactResponse = await getCounts(reqId, teamId, 1, body)

      setCountContact(CountContactResponse.output);  
      if(val == 2) {
        setMonth('');
        setLabels(['Yesterday'])
        const leadbar2 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar2);
      } else if (val == 3) {
        setMonth('');
        const contactbarLables = CountContactResponse.output?.map((obj:any) => obj.date); 
        setLabels(contactbarLables)
        const leadbar3 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar3);
      } else if (val == 4) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (val == 5) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (val == 6) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('MMMM');
         var itemMonth = Moment(leadbarLables2[i]).format('YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (val == 7) {
        const leadbarLables3 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables3.length;i++) {
         var item = Moment(leadbarLables3[i]).format('DD');
         var itemMonth = Moment(leadbarLables3[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar5 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar5);
      } else {
        setMonth('');
        setLabels(['Today'])
        const leadbar = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar);
      }
      setLoading(false);
    }  
    }

    const userFilter = async (name:any, id:any) => {
      setLoading(true);
      setReqId(id);
      setTeamId(0);
      setUserName(name);
      var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': contactBar,
      } 
      let CountContactResponse = await getCounts(id, 0, 1, body)

      setCountContact(CountContactResponse.output);
      if(contactBar == 2) {
        setMonth('');
        setLabels(['Yesterday']);
        const leadbar2 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar2);
      } else if (contactBar == 3) {
        setMonth('');
        const leadbarLables = CountContactResponse.output?.map((obj:any) => obj.date); 
        setLabels(leadbarLables);
        const leadbar3 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar3);
      } else if (contactBar == 4) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 5) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 6) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('MMMM');
         var itemMonth = Moment(leadbarLables2[i]).format('YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 7) {
        const leadbarLables3 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables3.length;i++) {
         var item = Moment(leadbarLables3[i]).format('DD');
         var itemMonth = Moment(leadbarLables3[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar5 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar5);
      } else {
        setMonth('');
        setLabels(['Today']);
        const leadbar = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar);
      }
      setLoading(false);
    }

    const databarcontact = {
        labels,
        datasets: [{
          label: 'Contact',
          backgroundColor: '#3bb6f1',
          borderColor: 'rgb(255, 99, 132)',
          data: bar,
        }]
      };

      const taskSaveSchema = Yup.object().shape({
        start_date: Yup.string().required('start date required'),
        end_date: Yup.string().required('end date required'),
      })

      const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
    
            setFromDate(values.start_date)
            setToDate(values.end_date)

            var body = {
              'start_date': values.start_date,
              'end_date': values.end_date,
              'filter': 7,
            }

            let CountContactResponse = await getCounts(reqId, teamId, 1, body)

            if(CountContactResponse.status == 200){
              setContactBar(7);
              setCountContact(CountContactResponse.output);
              const leadbarLables5 = CountContactResponse.output?.map((obj:any) => obj.date); 
              var customLables = [];
              for(var i=0;i<leadbarLables5.length;i++) {
               var item = Moment(leadbarLables5[i]).format('DD');
               var itemMonth = Moment(leadbarLables5[i]).format('MMMM-YYYY');
              setMonth(itemMonth);
               customLables.push(item);
              }
              setLabels(customLables);
              const leadbar5 = CountContactResponse.output?.map((obj:any) => obj.count);
              setBar(leadbar5);
              resetForm();
              setLoading(false)
              document.getElementById('contactBarCustomDateRangeOverview1')?.click();
            }

          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }   
    }})

      // useEffect(() => {
      //   CountContactList();       
      // }, []);

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
            if(list == 1) {
            return !item.team_leader_name?.toLowerCase().includes(searchFor);
            } else {
            return !item.first_name?.toLowerCase().includes(searchFor);
          }
          }
          if(list == 1) {
          return item.team_leader_name?.toLowerCase().includes(search);
           } else {
          return item.first_name?.toLowerCase().includes(search);
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
    
      useEffect(() => {   
        let filteredData:any = [];
        if (search.length) {
          if(list == 1) {
            teams?.forEach((item:any) => {
              if (filterItem(item, search.toLowerCase())) {
                filteredData.push({ ...item });
              }
            });
          } else {
            users?.forEach((item:any) => {
              if (filterItem(item, search.toLowerCase())) {
                filteredData.push({ ...item });
              }
            });
          }
          
        }
        
        if (search.length) {
        if(list == 1) {
          setFilteredTeam(filteredData);
        } else {
          setFiltered(filteredData);
        }}
    }, [search]);

      const ListChange = (e:any) => {
        setList(e);
        setTeamId(0);
      }

    function sumArray(array:any){
      let sum = 0
      for (let i = 0; i < 
      array.length; i += 1) {
      sum += array[i]
      }
      return sum
    }

    const handleTeam = async (id:any, name:any) => {

      setLoading(true);
      setReqId(0);
      setTeamId(id);
      setUserName(name);
      var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': contactBar,
      } 
      let CountContactResponse = await getCounts(0, id, 1, body)

      setCountContact(CountContactResponse.output);
      if(contactBar == 2) {
        setMonth('');
        setLabels(['Yesterday']);
        const leadbar2 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar2);
      } else if (contactBar == 3) {
        setMonth('');
        const leadbarLables = CountContactResponse.output?.map((obj:any) => obj.date); 
        setLabels(leadbarLables);
        const leadbar3 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar3);
      } else if (contactBar == 4) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 5) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('DD');
         var itemMonth = Moment(leadbarLables2[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 6) {
        const leadbarLables2 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables2.length;i++) {
         var item = Moment(leadbarLables2[i]).format('MMMM');
         var itemMonth = Moment(leadbarLables2[i]).format('YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar4 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar4);
      } else if (contactBar == 7) {
        const leadbarLables3 = CountContactResponse.output?.map((obj:any) => obj.date);
        var customLables = [];
        for(var i=0;i<leadbarLables3.length;i++) {
         var item = Moment(leadbarLables3[i]).format('DD');
         var itemMonth = Moment(leadbarLables3[i]).format('MMMM-YYYY');
         setMonth(itemMonth);
         customLables.push(item);
        }
        setLabels(customLables);
        const leadbar5 = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar5);
      } else {
        setMonth('');
        setLabels(['Today']);
        const leadbar = CountContactResponse.output?.map((obj:any) => obj.count);
        setBar(leadbar);
      }
      setLoading(false);
    }
    
    useEffect(() => {
      // CountContactList();       
    }, []);
    
    return(
        <>
        <div className="card mx-sm-1 mx-xl-2 bs_1 h-100 br_15 bar_chart">
            <div className="card-heade border-0 d-flex align-items-center justify-content-between px-5 pt-5">
                <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>{intl.formatMessage({id: 'contacts'})}</span>
                </h3>
                <div className='d-flex flex-wrap justify-content-end'>
                  {bar &&
                  <div className="border border-gray-300 border-dashed rounded p-1 m-1">
                      <div className="fs-8 fw-bold text-gray-800 shrink-0">{intl.formatMessage({id: 'total'})}</div>
                      <div className="fs-7 text-gray-800 fw-bolder shrink-0">#{sumArray(bar)}</div>
                  </div>}
                  {roleId != 3 && <>
                <input className="form-select dash_btn m-2 fs-9" type="button" value={userName} id="defaultDropdown1" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"/>
                <ul className="dropdown-menu db_dw_menu" aria-labelledby="defaultDropdown1">
                  <select className="form-select btn btn-sm btn_secondary" onChange={(e) => ListChange(e.target.value)}>
                    <option value="1">{intl.formatMessage({id: 'teams'})}</option>
                    <option value="2">{intl.formatMessage({id: 'users'})}</option>
                  </select>
                    <div className="input-group form_search my-2 dropdown-item">
                      <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                      <div className="input-group-append">
                        <button className="btn btn-secondary" type="button">
                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                        </button>
                      </div>
                    </div>
                {list == 1 ? <>
                  {!search
                      ? teams?.map((userData:any, i:any) => {
                        return(                            
                        <li className="list-group px-4 py-1" key={i}>
                          <div className="">
                            <a type="button" onClick={(e) => handleTeam(userData.team_leader_id, userData.team_leader_name)}>
                                <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' />
                                {userData.team_leader_name}
                            </a>
                            </div>                                  
                        </li>
                        )}) 
                      : filteredTeam.length ? filteredTeam.map((item) => (<li  className="list-group px-4 py-1">
                      <div className="">
                        <a type="button" onClick={(e) => handleTeam(item.team_leader_id, item.team_leader_name)}>
                          <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' />
                          {item.team_leader_name}
                        </a>
                      </div>
                  </li>)) : <p className='text-center'>{intl.formatMessage({id: 'no_records'})}!!!</p> }
              </> : <>
                {!search
                    ? users?.map((item:any, i:any) => (
                    <li className="dropdown-item cursor-pointer" key={i} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                    ))
                    : filtered.length ? filtered.map((item, j) => (
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                      )) : <p className='text-center'>{intl.formatMessage({id: 'no_records'})}!!!</p> }</>}
                </ul></>}
                <select className="form-select dash_btn m-2 fs-9" value={contactBar} onChange={(e) => rangeSelect(e.target.value)}>
                    <option selected value="1">{intl.formatMessage({id: 'today'})}</option>
                    <option value="2">{intl.formatMessage({id: 'yesterday'})}</option>
                    <option value="3">{intl.formatMessage({id: 'last_week'})}</option>
                    <option value="4">{intl.formatMessage({id: 'last_month'})}</option>
                    <option value="5">{intl.formatMessage({id: 'this_month'})}</option>
                    <option value="6">{intl.formatMessage({id: 'this_year'})}</option>
                    <option value="7">{intl.formatMessage({id: 'custom_date'})}</option>
                </select>
                <button type='button' data-bs-toggle='modal' data-bs-target='#contactBarCustomSelectOverview1' className='d-none' id='contactBarCustomDateRangeOverview1'>{intl.formatMessage({id: 'custom_date'})}</button>
                <div className='modal fade' id='contactBarCustomSelectOverview1' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                          <form noValidate onSubmit={formik.handleSubmit}>
                            <div className='modal-header py-2'>
                                <h3>{intl.formatMessage({id: 'select_custom_range'})}</h3>
                                <div id='contactBarModelClose1' className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
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
                                    {formik.touched.start_date && formik.errors.start_date && (
                                      <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                          <span role='alert' className='text-danger'>{formik.errors.start_date}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'end_date'})}</label>
                                    <div className="input-group mb-3">
                                      <input type="date" className="form-control" min={formik.values.start_date} {...formik.getFieldProps('end_date')}/> 
                                    </div>
                                    {formik.touched.end_date && formik.errors.end_date && (
                                      <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                          <span role='alert' className='text-danger'>{formik.errors.end_date}</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className='model-footer'>
                              <div className='d-flex align-items-center justify-content-end pb-3 pe-6 pt-0'>
                              <button
                                type='submit'
                                
                                className='btn btn-sm btn_primary text-primary'
                                disabled={formik.isSubmitting}
                              >
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'filter'})}
                                
                                </span>}
                                {loading && (
                                  <span className='indicator-progress' style={{display: 'block'}}>
                                    {intl.formatMessage({id: 'please_wait'})}...{' '}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                                )}
                              </button>
                              </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="card-body pt-0 px-1">
            {loading ? 
              <div className='w-100 h-100'>
                  <div className='d-flex justify-content-center flex-column align-items-center h-100'>
                      <div className="spinner-border taskloader" role="status">                                    
                          <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                      </div>
                  </div> 
              </div> : <>
              {sumArray(bar) > 0 ? 
              <div>
                  <Bar options={options} data={databarcontact} />
              </div>
              :
              <div className='w-100 h-100'> 
                <div className='d-flex justify-content-center flex-column align-items-center h-100'>
                  <h6 className='fs_8 text-secondary'>{intl.formatMessage({id: 'no_data'})}!!!</h6>
                </div>
              </div>}
            {month != '' &&
            <div className='text-center'>
              {month}
            </div>}
            </>} 
            </div>
        </div>
        </>
    )
}
export {OverviewCountBar}