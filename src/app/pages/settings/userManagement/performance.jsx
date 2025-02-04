import React,{FC, useEffect, useState} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { getUsersGoals, getUserGoal, updateUserGoal, getUsersByRole } from './core/_requests';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { useIntl } from 'react-intl';

ReactHTMLTableToExcel.format = (s, c) => {
    if (c && c['table']) {
      const html = c.table;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const rows = doc.querySelectorAll('tr');
  
      for (const row of rows) row.removeChild(row.firstChild);
  
      c.table = doc.querySelector('table').outerHTML;
    }
  
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  };

const initialValues = {
    goal_calls: "",
    goal_talktime: "",
    goal_leads_generated: "",  
    goal_leads_converted: "",
    goal_site_visit: "",
    goal_meetings: "",
    goal_bookings: "",
    goal_revenue: "",
    no_of_units_committed: "",
    annual_target: "",
    no_of_sales: "",
    turnover: "",
    discount: "",
    incentives: "",
    status_changed: "",
}

const UserPerformance = () => {

  const intl = useIntl();
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [editIndex, setEditIndex] = useState('');
  const [usersGoals, setUsersGoals] = useState([]);
  const [userGoal, setUserGoal] = useState({});
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const {currentUser, logout} = useAuth();

    const teamsSaveSchema = Yup.object().shape({
        goal_calls: Yup.string(),
        goal_talktime: Yup.string(),       
        goal_leads_generated: Yup.string(),
        goal_leads_converted: Yup.string(),       
        goal_site_visit: Yup.string(),       
        goal_meetings: Yup.string(),       
        goal_bookings: Yup.string(),       
        goal_revenue: Yup.string(),      
        no_of_units_committed: Yup.string(),      
        annual_target: Yup.string(),      
        no_of_sales: Yup.string(),      
        turnover: Yup.string(),      
        discount: Yup.string(),      
        incentives: Yup.string(),      
        status_changed: Yup.string(),      
    })

    const usersGoalsList = async () => {
        const Response = await getUsersGoals()
        setUsersGoals(Response)
    }

    const formik = useFormik({
        initialValues,
        validationSchema: teamsSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
          try {              
            const body = {                
              "goal_calls": values['goal_calls'+editIndex],
              "goal_talktime": values['goal_talktime'+editIndex],
              "goal_leads_generated": values['goal_leads_generated'+editIndex],
              "goal_leads_converted": values['goal_leads_converted'+editIndex],
              "goal_site_visit": values['goal_site_visit'+editIndex],
              "goal_meetings": values['goal_meetings'+editIndex],
              "goal_bookings": values['goal_bookings'+editIndex],
              "goal_revenue": values['goal_revenue'+editIndex],
              "no_of_units_committed": values['no_of_units_committed'+editIndex],
              "annual_target": values['annual_target'+editIndex],
              "no_of_sales": values['no_of_sales'+editIndex],
              "turnover": values['turnover'+editIndex],
              "discount": values['discount'+editIndex],
              "incentives": values['incentives'+editIndex],
              "status_changed": values['status_changed'+editIndex]                                  
            }

            const saveTeamData = await updateUserGoal(editId, body);
            if(saveTeamData != null) {                
                setEdit(false)
                var toastEl = document.getElementById('goalUpdate');
                const bsToast = new Toast(toastEl);
                bsToast.show();
                const Response = await getUsersGoals()
                setUsersGoals(Response)
            }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
          }
    }})

    const handleEdit = async (id, index) => {
        setEdit(true);
        setEditId(id);
        setEditIndex(index);
        const userGoalList = await getUserGoal(id);
        setUserGoal(userGoalList);

        formik.setFieldValue('goal_calls'+index, userGoalList.goal_calls ?? '')
        formik.setFieldValue('goal_talktime'+index, userGoalList.goal_talktime ?? '')
        formik.setFieldValue('goal_leads_generated'+index, userGoalList.goal_leads_generated ?? '')
        formik.setFieldValue('goal_leads_converted'+index, userGoalList.goal_leads_converted ?? '')
        formik.setFieldValue('goal_site_visit'+index, userGoalList.goal_site_visit ?? '')
        formik.setFieldValue('goal_meetings'+index, userGoalList.goal_meetings ?? '')
        formik.setFieldValue('goal_bookings'+index, userGoalList.goal_bookings ?? '')
        formik.setFieldValue('goal_revenue'+index, userGoalList.goal_revenue ?? '')
        formik.setFieldValue('no_of_units_committed'+index, userGoalList.no_of_units_committed ?? '')
        formik.setFieldValue('annual_target'+index, userGoalList.annual_target ?? '')
        formik.setFieldValue('no_of_sales'+index, userGoalList.no_of_sales ?? '')
        formik.setFieldValue('turnover'+index, userGoalList.turnover ?? '')
        formik.setFieldValue('discount'+index, userGoalList.discount ?? '')
        formik.setFieldValue('incentives'+index, userGoalList.incentives ?? '')
        formik.setFieldValue('status_changed'+index, userGoalList.status_changed ?? '')
        
    }

    const searchThis = async (data) => {
      setSearch(data);
      usersGoalsList();
    }
   
    useEffect(() => {
        // usersGoalsList();
        // usersList();
    }, []);

    const userFilter = async (name, id) => {
      const goalArray = [];
      const userGoalList = await getUserGoal(id);
      goalArray.push(userGoalList);
      setUsersGoals(goalArray);
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
          usersGoals.forEach((item) => {
            if (filterItem(item, search.toLowerCase())) {
              filteredData.push({ ...item });
            }
          });
        }
        setFiltered(filteredData);
    }, [search]);
    

    return(
        <div className='position-relative'>
            <div className='d-flex justify-content-between'>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="goalUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'goals_updated_successfully'})}!</div>
                </div>
            </div>
            <h3 className='ps-5 pt-2'>{intl.formatMessage({id: 'performance'})}</h3> 
            <div className='d-flex'>
            <div className="input-group form_search my-3 dropdown-item">
                <input type="text" className="form-control w-300px" name="search" placeholder="Search" value={search} onChange={(e) => searchThis(e.target.value)} autocomplete="off" id="defaultDropdown12345" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"/>
                <div className="input-group-append hide-this-button-on-mobile">
                    <button className="btn btn-secondary" type="button" id="defaultDropdown12345" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                    <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
                    
                {/* <ul className="dropdown-menu" aria-labelledby="defaultDropdown12345">                    
                { filtered.map((item, j) => (
                      <li className="dropdown-item" key={j} onClick={() => userFilter(item.employee_name, item.user_id)}>{item.employee_name}</li>
                      ))}
                </ul> */}
                </div>
            <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-sm btn-icon p-5 mt-3"
            table="table-to-xls"
            filename="Performance"
            sheet="tablexls"
            buttonText={<img src={toAbsoluteUrl("/media/icons/duotune/files/fil021.svg")} />}
            /></div></div>
            <div className='overflow-auto'>
            <form noValidate onSubmit={formik.handleSubmit}>
                <table className='table table-hover w-100 px-5' id='table-to-xls'>
                    <thead className="fw-bold">
                    <tr className="border-bottom solid border-top">
                        <th className='bg-secondary ps-4' scope="col">{intl.formatMessage({id: 'name'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'total_calls'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'talk_time'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'leads_generated'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'leads_converted'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'site_visit'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'meetings'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'bookings'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'revenue'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'no_of_units_committed'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'annual_target'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'no_of_sales'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'turnover'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'discount'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'incentives'})}</th>
                        <th colSpan={2} scope="col">{intl.formatMessage({id: 'status_changed'})}</th>
                        <th className='pe-4' scope="col">{intl.formatMessage({id: 'actions'})}</th>
                    </tr>
                    <tr className="border-bottom">
                        <th className='bg-secondary ps-4' scope="col"></th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Goal'})}</th>
                        <th scope="col">{intl.formatMessage({id: 'Achieved'})}</th>
                        <th className='pe-4' scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {search ? <>
                    {filtered.map((goal, i) => {return(
                    <tr className="border-bottom">
                        <td className='bg-secondary ps-4' scope="row">{goal.first_name}</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_calls'+i)}/> : <span>{goal.goal_calls}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_talktime'+i)}/> : <span>{goal.goal_talktime}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_leads_generated'+i)}/> : <span>{goal.goal_leads_generated}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_leads_converted'+i)}/> : <span>{goal.goal_leads_converted}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_site_visit'+i)}/> : <span>{goal.goal_site_visit}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_meetings'+i)}/> : <span>{goal.goal_meetings}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_bookings'+i)}/> : <span>{goal.goal_bookings}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_revenue'+i)}/> : <span>{goal.goal_revenue}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('no_of_units_committed'+i)}/> : <span>{goal.no_of_units_committed}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('annual_target'+i)}/> : <span>{goal.annual_target}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('no_of_sales'+i)}/> : <span>{goal.no_of_sales}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('turnover'+i)}/> : <span>{goal.turnover}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('discount'+i)}/> : <span>{goal.discount}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('incentives'+i)}/> : <span>{goal.incentives}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('status_changed'+i)}/> : <span>{goal.status_changed}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <button type='submit' id='kt_sign_up_submit1' disabled={formik.isSubmitting} className='btn btn-icon' ><KTSVG path="/media/icons/duotune/general/gen043.svg" className="svg-icon-muted svg-icon-2hx btn-icon btn btn-sm btn-active-color-success" /></button> : <div onClick={() => handleEdit(goal.id, i)}><KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" /></div>
                        }</td>
                    </tr>
                    )})} </> : <>
                    {usersGoals.map((goal, i) => {return(
                    <tr className="border-bottom">
                        <td className='bg-secondary ps-4' scope="row">{goal.first_name}</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_calls'+i)}/> : <span>{goal.goal_calls}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_talktime'+i)}/> : <span>{goal.goal_talktime}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_leads_generated'+i)}/> : <span>{goal.goal_leads_generated}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_leads_converted'+i)}/> : <span>{goal.goal_leads_converted}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_site_visit'+i)}/> : <span>{goal.goal_site_visit}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_meetings'+i)}/> : <span>{goal.goal_meetings}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_bookings'+i)}/> : <span>{goal.goal_bookings}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('goal_revenue'+i)}/> : <span>{goal.goal_revenue}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('no_of_units_committed'+i)}/> : <span>{goal.no_of_units_committed}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('annual_target'+i)}/> : <span>{goal.annual_target}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('no_of_sales'+i)}/> : <span>{goal.no_of_sales}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('turnover'+i)}/> : <span>{goal.turnover}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('discount'+i)}/> : <span>{goal.discount}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('incentives'+i)}/> : <span>{goal.incentives}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <input type='number' className='w-100' {...formik.getFieldProps('status_changed'+i)}/> : <span>{goal.status_changed}</span>
                        }</td>
                        <td>234</td>
                        <td>{edit && editId == goal.id ? <button type='submit' id='kt_sign_up_submit2' disabled={formik.isSubmitting} className='btn btn-icon' ><KTSVG path="/media/icons/duotune/general/gen043.svg" className="svg-icon-muted svg-icon-2hx btn-icon btn btn-sm btn-active-color-success" /></button> : <div onClick={() => handleEdit(goal.id, i)}><KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" /></div>
                        }</td>
                    </tr>
                    )})}</>}
                    
                    </tbody>
                </table>
                </form>
            </div>
        </div>
    )
}
export{UserPerformance}