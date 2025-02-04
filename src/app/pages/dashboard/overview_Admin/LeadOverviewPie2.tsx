import React,{FC, useEffect, useState} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { bottom } from '@popperjs/core';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useAuth } from '../../../modules/auth';
import { getMastersCount } from '../core/requests';
import {useIntl} from 'react-intl';

ChartJS.register(ArcElement, Tooltip, Legend);

const options:any = {
        plugins: {
            legend: {
                display: true,
                position: bottom,
                fullSize: true,
                labels: {
                    color: '#000',
                    font: {
                      size: window.innerWidth > 1200 && window.innerWidth < 1500 ? 11 : window.innerWidth < 1200 ? 12 : 18,
                  },
                  padding: 3
                },
            }
        }
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

const LeadDoughnutOverview2: FC<Props> = (props) => {
  const intl = useIntl();
  const {
    data, users, teams
  } = props

    const {currentUser, logout} = useAuth();
    const userId = currentUser?.id;
    const roleId = currentUser?.designation;
    const usersName = currentUser?.first_name;
    const [search, setSearch] = useState("");
    const [contactPie, setContactPie] = useState(1);
    const [userName, setUserName] = useState<any>(usersName);
    const [title, setTitle] = useState('source');
    const [reqId, setReqId] = useState(userId);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]); 
    const [filteredTeam, setFilteredTeam] = useState<any[]>([]);
    const [teamId, setTeamId] = useState(0);
    const [list, setList] = useState(1);

    const CountSourceList =  async (userId:any, body:any, team:any, title:any) => {   
      setLoading(true);      
      const CountSourceResponse = await getMastersCount(title, 2, userId, team, body)
      setCount(CountSourceResponse.output); 
      setTitle(title); 
      setLoading(false);      
    }

    const rangeSelectPie = (val:any) => {
      if(val == 7) {
        document.getElementById('leadPieCustomDateRangeOverview2')?.click();
      } else {
        setContactPie(val);
        var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': val,
      }
        CountSourceList(reqId, body, teamId, title)
      }
    }

    useEffect(() => {
      if(data?.user != undefined) {
        setToDate(data?.end_date);
        setFromDate(data?.start_date);
        setContactPie(data?.filter);
        setReqId(data?.user);
        setTeamId(data?.team);
        setUserName(data?.user_name);
        CountSourceList(data?.user, data, data?.team, title)   
      }
    }, [data]);

    const taskSaveSchema = Yup.object().shape({
      start_date: Yup.string().required('start date required'),
      end_date: Yup.string().required('end date required'),
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
              'filter': 7,
            }

            CountSourceList(reqId, body, teamId, title)
            setContactPie(7);
            resetForm();
            document.getElementById('leadPieCustomDateRangeOverview2')?.click();
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
          }
    }})

    const graphXContact = count?.map((obj) => Object.values(obj)[0]);
    const graphYContact = count?.map((obj) => Object.values(obj)[1]);

    const lableContact: any[] = [];
    for(var p=0;p<graphXContact.length;p++) {
    var val15 = graphXContact[p];
    var val16 = graphYContact[p];
    var value = val16+'-'+val15;
    lableContact.push(value);
    }

    const dataContact = {
        labels: lableContact,
        datasets: [
          {
            label: '# of Votes',
            data: graphXContact,
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

      const userFilter = (name:any, user:any) => {
        setUserName(name);
        setReqId(user);
        setTeamId(0);
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': contactPie,
        }

        CountSourceList(user, body, teamId, title)      
      }

      useEffect(() => {     
        var body = {
          'start_date': fromDate,
          'end_date': toDate,
          'filter': contactPie,
        }
        CountSourceList(teamId, body, reqId, title);        
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
        if(list == 1) {
        setFilteredTeam(filteredData);
        } else {
        setFiltered(filteredData);
        }
      }, [search]);

      const ListChange = (e:any) => {
        setSearch('');
        setList(e);
        setTeamId(0);
      }

    const handleTeam = async (id:any, name:any) => {
      setTeamId(id);
      setReqId(0);
      setUserName(name);
      var body = {
        'start_date': fromDate,
        'end_date': toDate,
        'filter': contactPie,
      }

      CountSourceList(0, body, id, title)
    } 

    return(
        <>
        <div className='modal fade' id='leadPieChartCustomDateOverview2' data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                  <form noValidate onSubmit={formik.handleSubmit}>
                    <div className='modal-header py-2'>
                        <h3>{intl.formatMessage({id: 'select_custom_range'})}</h3>
                        <div id='contactPieModelClose' className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={() => {
                          setContactPie(contactPie);
                        }}>
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
        <div className="card mx-sm-1 mx-xl-2 bs_1 h-100 br_15">        
            <div className="card-heade border-0 d-flex align-items-center justify-content-end pt-5 px-5">        
                <div className='d-flex justify-content-end align-items-center flex-wrap'>                  
                <input className="form-select dash_btn m-2 fs-9" type="button" value={title.charAt(0).toUpperCase() + title.slice(1)} id="selectDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"/>
                <ul className="dropdown-menu db_dw_menu" aria-labelledby="selectDropdown">
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'source')}>{intl.formatMessage({id: 'source'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'lead_status')}>{intl.formatMessage({id: 'lead_status'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'city')}>{intl.formatMessage({id: 'city'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'property_type')}>{intl.formatMessage({id: 'property_type'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'looking_for')}>{intl.formatMessage({id: 'looking_for'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'lead_group')}>{intl.formatMessage({id: 'lead_group'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'locality')}>{intl.formatMessage({id: 'locality'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'state')}>{intl.formatMessage({id: 'state'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'created_by')}>{intl.formatMessage({id: 'created_by'})}</li>
                    <li className="dropdown-item cursor-pointer" onClick={() => CountSourceList(reqId, {
                        'start_date': fromDate,
                        'end_date': toDate,
                        'filter': contactPie,
                      }, teamId, 'property_id')}>{intl.formatMessage({id: 'property_name'})}</li> 
                </ul>
                {roleId != 3 && <>
                <input className="form-select dash_btn m-2 fs-9" type="button" value={userName} id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"/>
                <ul className="dropdown-menu db_dw_menu" aria-labelledby="defaultDropdown">
                  <select className="form-select btn btn-sm btn_secondary" onChange={(e) => ListChange(e.target.value)}>
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
              {list == 1 ? <>
                  {!search
                      ? teams?.map((userData:any, i:any) => {
                        return(                            
                        <li className="list-group px-4 py-1" key={i}>
                          <div className="">
                            <a type="button" onClick={() => handleTeam(userData.team_leader_id, userData.team_leader_name)}>
                                <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' />
                                {userData.team_leader_name}
                            </a>
                            </div>                                  
                        </li>
                        )}) 
                      : filteredTeam.length ? filteredTeam.map((item, i) => (<li className="list-group px-4 py-1" key={i}>
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
                    <li className="dropdown-item" key={i} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                    ))
                    : filtered.length ? filtered.map((item, j) => (
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                      )) : <p className='text-center'>{intl.formatMessage({id: 'no_records'})}!!!</p>}</>}
                </ul></>}
                <select className="form-select dash_btn m-2 fs-9" value={contactPie} onChange={(e) => rangeSelectPie(e.target.value)}>
                    <option selected value="1">{intl.formatMessage({id: 'today'})}</option>
                    <option value="2">{intl.formatMessage({id: 'yesterday'})}</option>
                    <option value="3">{intl.formatMessage({id: 'last_week'})}</option>
                    <option value="4">{intl.formatMessage({id: 'last_month'})}</option>
                    <option value="5">{intl.formatMessage({id: 'this_month'})}</option>
                    <option value="6">{intl.formatMessage({id: 'this_year'})}</option>
                    <option value="7">{intl.formatMessage({id: 'custom_date'})}</option>
                </select>
                <button type='button' data-bs-toggle='modal' data-bs-target='#leadPieChartCustomDateOverview2' className='d-none' id='leadPieCustomDateRangeOverview2'>{intl.formatMessage({id: 'custom_date'})}</button>                
                </div>                
            </div>             
            <div className="card-body h-100 overflow-hidden">
              {loading ? 
              <div className='w-100 h-100'>
                  <div className='d-flex justify-content-center flex-column align-items-center h-100'>
                      <div className="spinner-border taskloader" role="status">                                    
                          <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                      </div>
                  </div> 
              </div> : <>
              {count.length > 0 ?  
              <div className='pt-12 h-100'>
              <Doughnut className='h-100' options={options} data={dataContact} /></div> :
              <div className='w-100 h-100'> 
                <div className='d-flex justify-content-center flex-column align-items-center h-100'>
                    <h6 className='fs_8 text-secondary'>{intl.formatMessage({id: 'no_data'})}!!!</h6>
                </div>
              </div>} 
              </>} 
            </div>
        </div>
        </>
    )
}
export {LeadDoughnutOverview2}