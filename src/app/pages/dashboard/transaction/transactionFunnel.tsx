import React,{FC, useEffect, useState,createContext,useContext } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../../modules/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { FunnelChart } from 'react-funnel-pipeline';
import { getMastersCount } from '../core/requests';
import {useIntl} from 'react-intl';

ChartJS.register(ArcElement, Tooltip, Legend);

const initialValues = {
    start_date: "",
    end_date: "",
}

interface filterContact {
value: number
name : string,
status:number,
date :number
}

export const Filterby = createContext<any>('')

type Props = {
  data?: any,
  users?: any,
  teams?: any,
}

const TransactionFunnel: FC<Props> = (props) => {
  const {
    data, teams, users
  } = props
  const intl = useIntl();

  const {currentUser, logout} = useAuth();
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const usersName = currentUser?.first_name;
  const [search, setSearch] = useState("");
  const [contactFunnel, setContactFunnel] = useState(1);
  const [userName, setUserName] = useState<any>(usersName);
  const [reqId, setReqId] = useState(userId);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [CountContact, setCountContact] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]); 
  const [filteredTeam, setFilteredTeam] = useState<any[]>([]);
  const [teamId, setTeamId] = useState(0);
  const [list, setList] = useState(1); 

  const CountContactList =  async () => {  
    setLoading(true);
    const body = {
      'start_date': fromDate,
      'end_date': toDate,
      'filter': contactFunnel,
    }  
      const CountContactResponse = await getMastersCount('property_status', 5, userId, teamId, body)
      setCountContact(CountContactResponse.output); 
      setLoading(false);  
  }

  const rangeSelect = async (val:any) => {
    setContactFunnel(val);
    setFromDate('');
    setToDate('');
    if(val == 7) {
      document.getElementById('transactionFunnelCustomDateRange')?.click();
    } else { 
      setLoading(true);
    var body = {
      'start_date': fromDate,
      'end_date': toDate,
      'filter': val,
    } 
    const CountContactResponse = await getMastersCount('property_status', 5, reqId, teamId, body)
    setCountContact(CountContactResponse.output);  
    setLoading(false);    
  }
  }

  const overallFilter = async (data:any) => {
    setLoading(true);
    const CountContactResponse = await getMastersCount('property_status', 5, data?.user, data?.team, data)
    setCountContact(CountContactResponse.output);
    setLoading(false);
  }

  useEffect(() => {
    if(data?.user != undefined) {
      setToDate(data?.end_date);
      setFromDate(data?.start_date);
      setContactFunnel(data?.filter);
      setReqId(data?.user);
      setTeamId(data?.team);
      setUserName(data?.user_name);
      overallFilter(data);    
    }
  }, [data]);

  const userFilter = async (name:any, id:any) => {
    setLoading(true);
    setReqId(id);
    setTeamId(0);
    setUserName(name);
    var body = {
      'start_date': fromDate,
      'end_date': toDate,
      'filter': contactFunnel,
    }
    const CountContactResponse = await getMastersCount('property_status', 5, id, 0, body)
    setCountContact(CountContactResponse.output); 
    setLoading(false);   
  }

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

          const CountContactResponse = await getMastersCount('property_status', 5, reqId, teamId, body)            

          if(CountContactResponse != null){
            setCountContact(CountContactResponse.output);            
            resetForm();
            setLoading(false)
            document.getElementById('transactionFunnelCustomDateRange')?.click();
          }

        } catch (error) {
          console.error(error)
          setStatus('The registration details is incorrect')
          setSubmitting(false)
          setLoading(false)
        }
  }})

    useEffect(() => {
      CountContactList();      
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
      'filter': contactFunnel,
    }  
      const CountContactResponse = await getMastersCount('property_status', 5, 0, id, body)
      setCountContact(CountContactResponse.output);
      setLoading(false);
  }

    return(
        <>
        <div className="card mx-sm-1 bs_1 br_15 h-100 mb-4">
        <div className="card-heade border-0 d-flex align-items-center justify-content-between flex-wrap px-5 pt-5">
                <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>{intl.formatMessage({id: 'status'})}</span>
                </h3>
                <div className='d-flex'>
                {roleId != 4 && <>
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
                    <li className="dropdown-item" key={i} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                    ))
                    : filtered.length ? filtered.map((item, j) => (
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.first_name, item.id)}>{item.first_name}</li>
                      )) : <p className='text-center'>{intl.formatMessage({id: 'no_records'})}!!!</p>}</>}
                </ul></>}
                <select className="form-select dash_btn m-2 fs-9" value={contactFunnel} onChange={(e) => rangeSelect(e.target.value)}>
                    <option selected value="1">{intl.formatMessage({id: 'today'})}</option>
                    <option value="2">{intl.formatMessage({id: 'yesterday'})}</option>
                    <option value="3">{intl.formatMessage({id: 'last_week'})}</option>
                    <option value="4">{intl.formatMessage({id: 'last_month'})}</option>
                    <option value="5">{intl.formatMessage({id: 'this_month'})}</option>
                    <option value="6">{intl.formatMessage({id: 'this_year'})}</option>
                    <option value="7">{intl.formatMessage({id: 'custom_date'})}</option>
                </select>
                <button type='button' data-bs-toggle='modal' data-bs-target='#transactionFunnelCustomSelect' className='d-none' id='transactionFunnelCustomDateRange'>{intl.formatMessage({id: 'custom_date'})}</button>
                <div className='modal fade' id='transactionFunnelCustomSelect' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                          <form noValidate onSubmit={formik.handleSubmit}>
                            <div className='modal-header py-2'>
                                <h3>{intl.formatMessage({id: 'select_custom_range'})}</h3>
                                <div id='contactFunnelModelClose' className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
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
          <div className="card-body pt-0 px-5 ">
          {loading ? 
              <div className='w-100 h-100'>
                  <div className='d-flex justify-content-center flex-column align-items-center h-100'>
                      <div className="spinner-border taskloader" role="status">                                    
                          <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                      </div>
                  </div> 
              </div> : <>
              {CountContact.length > 0 ? 
            <FunnelChart 
                data={CountContact.map((item:any) => {
                  return {
                    'value' : item.count,
                    'name' : item.property_status
                  }
                })}
                pallette= {
                  ['#00508f', '#1a6eb2', '#008dff', '#239bfd', '#64b5f6', '#64b5f6', '#b4d3ed']
                }
                // onRowClick = {(e)=>funnelContact(e)}
              />
              :
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
export {TransactionFunnel}