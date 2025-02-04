import React,{ FC, useState, useEffect, useRef } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Offcanvas, Toast } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAuth } from '../../../modules/auth';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { saveContactSetting, getContactSettingDropdowns } from './core/_requests';
import Draggable from "react-smooth-draggable";
import { useIntl } from 'react-intl';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";


const initialValues = {
    project: "",
    source_id: "",
}

const mystyle = {
  padding: "0px",
  height: "34px",
  maxHeight: "200px",
  overflowY: "scroll",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

function getStyles(name, aminityName, theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}


const ContactSettingSave = () => {    

    const taskSaveSchema = Yup.object().shape({
        project: Yup.string().required('Project is required'),             
        source_id: Yup.string().required('Project is required'),             
    })

    const intl = useIntl();
    const inputName = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false);    
    const [members, setMembers] = useState(false);    
    const [assignToName, setAssignToName] = useState([]);
    const [assignToId, setAssignToId] = useState([]);
    const [masterList, setMasterList] = useState([]);
    const [propertyId, setPropertyId] = useState([]);
    const [dropdowns, setDropdowns] = useState({});
    const {currentUser, logout} = useAuth();    
    const theme = useTheme(); 

    console.log("kegiweiurywhiru", masterList);
    
    const contactSettingDropList = async () => {
      const response = await getContactSettingDropdowns()
      setDropdowns(response.output);
    }

      const assingToChange = (event) => {
        const {
          target: { value },
        } = event;
    
        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setAssignToId(id);
        if(value) {
          setMembers(false);
        }
        setMasterList(typeof value === 'string' ? value.split(',') : value)
        setAssignToName(typeof value === 'string' ? value.split(',') : value);
        
      };

    const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            if(masterList.length > 0) {
            const body = {
                "project_id": values.project,
                "source_id": values.source_id,
                "user_id": masterList?.map((e) => e?.split('-')[1])
            }
    
            const saveTaskData = await saveContactSetting(body);
            if(saveTaskData.status == 200) {                 
              resetForm();
              setAssignToName([]);
              setMasterList([]);
              document.getElementById('kt_contact_setting_form_close')?.click();
              document.getElementById('contactSetting_reload')?.click();
              var toastEl = document.getElementById('contact_setting_save');
              const bsToast = new Toast(toastEl);
              bsToast.show();
              setLoading(false);
            } else if(saveTaskData.status == 400) {
              var toastEl = document.getElementById('contact_setting_exist');
              const bsToast = new Toast(toastEl);
              bsToast.show();
              setLoading(false);
            }
          } else {
            setMembers(true);
            setLoading(false);
          }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            var toastEl = document.getElementById('contact_setting_error');
            const bsToast = new Toast(toastEl);
            bsToast.show();
            setLoading(false)
          } 
    }})

    const closeDialogue = () => {
        var offCanvasEl = document.getElementById('kt_addcontactsettings');
        const bsOffcanvas = new Offcanvas(document.getElementById('kt_addcontactsettings'));
        bsOffcanvas.hide();
        offCanvasEl?.classList.add('d-none');
        offCanvasEl?.classList.remove('d-flex');
        document.body.style.overflow = '';
    }

    function reorder(subject, before, after) {
      
        if (before !== undefined) {
          setMasterList((masterList) => {
            const draft = [...masterList];
    
            const index = draft.indexOf(subject);
            draft.splice(index, 1);
    
            const beforeIndex = draft.indexOf(before);
            draft.splice(beforeIndex + 1, 0, subject);
    
            return draft;
          });
        } else if (after !== undefined) {
          setMasterList((masterList) => {
            const draft = [...masterList];
    
            const index = draft.indexOf(subject);
            draft.splice(index, 1);
    
            const afterIndex = draft.indexOf(after);
            draft.splice(Math.max(0, afterIndex - 1), 0, subject);
    
            return draft;
          });
        }          
      }

    useEffect(() => {     
      contactSettingDropList();   
    }, []);

    return(
        <div className='card bg-white h-100 w-100'>
            <div className='card-header w-100' id='kt_team_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_contact_settings'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_contact_setting_form_close'
                    onClick={closeDialogue}
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>
            <div className='card-body position-relative' id='kt_task_body'>
                <form noValidate onSubmit={formik.handleSubmit} >
                    <div className="row mx-0 p-4 main_bg accordion">
                        <div className="col-md-6 col-12 mb-3">
                        <div className="mb-3">
                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'project'})}</label>
                            <div className="input-group mb-3">
                                {/* <select className="form-select btn btn-sm w-100" {...formik.getFieldProps('project')}>
                                <option disabled value=''>Select</option>
                                {dropdowns.project?.map((sourceobj,i) => {
                                    return (
                                        <option value={sourceobj.id} key={i}>{sourceobj.name_of_building ?? '--No Name--'}</option> 
                                    )})}  
                                </select> */}
                                <ReactSelect
                                isMulti
                                options={dropdowns.project}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option) => option.name_of_building ?? '--No Name--'}
                                getOptionValue={(option) => option.id}
                                value={dropdowns.project?.filter((item) => propertyId?.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val) => {  
                                    setPropertyId(val);  
                                    formik.setFieldValue('project', val?.map((item) => item.id)?.join(',').toString())                                            
                                }}
                                placeholder={"Status.."}
                                />
                            </div>
                            {formik.touched.project && formik.errors.project && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.project}</span>
                                </div>
                            </div>
                            )}
                        </div> 
                        <div className="mb-3">
                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'source'})}</label>
                            <div className="input-group mb-3">
                            <select className="form-select btn btn-sm w-100" 
                            {...formik.getFieldProps('source_id')}
                            >
                            <option disabled value=''>Select</option>
                                {dropdowns.source?.map((sourceValue,i)=> {
                                  return (
                                    <option value={sourceValue.id} key={i}>{sourceValue.option_value}</option>
                                  )
                                })}   
                            </select>
                            </div>
                            {formik.touched.source_id && formik.errors.source_id && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.source_id}</span>
                                </div>
                            </div>
                            )}
                        </div>                            
                        <div className="mb-3">
                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'team_members'})}</label>                             
                            <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                              <Select
                                  multiple
                                  displayEmpty
                                  value={assignToName}
                                  onChange={assingToChange}
                                  input={<OutlinedInput />}
                                  renderValue={(selected) => {
                                    var name = [];
                                    var id = [];
                                    for(let i = 0; i < selected.length; i++){
                                      var fields = selected[i].split('-');

                                      var n = fields[0];
                                      var d = fields[1];

                                      name.push(n);
                                      id.push(d);
                                    }
                                      if (selected.length === 0) {
                                        return <p>Assign To</p>;
                                      }
                                      return(
                                        <ul>
                                          {name?.map((data, i) => {
                                            return(
                                              <li key={i}>{data}</li>
                                            )
                                          })}                                          
                                        </ul>
                                      )
                                  }}
                                  className='multi_select_field'
                                  MenuProps={MenuProps}
                                  inputProps={{ 'aria-label': 'Without label' }}
                                  >
                                  <MenuItem disabled value="">
                                      <em>Assign To</em>
                                  </MenuItem>
                                  {dropdowns.users?.map((assignVal) => {
                                  return(
                                    <MenuItem
                                      key={assignVal.id}
                                      value={assignVal.users_name + '-' + assignVal.id}
                                      style={getStyles(assignVal.users_name, assignToName, theme)}
                                      >
                                      {assignVal.users_name ?? '--No Name--'} 
                                    </MenuItem>
                                  )})}
                              </Select>
                            </FormControl>  
                            {members && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>Team Members required</span>
                                </div>
                            </div>
                            )}                         
                        </div>
                        </div>
                        {masterList.length > 1 &&
                        <div className="col-md-6 col-12 mb-5">
                            <div className='input-group'>
                            <div className="ContactReorder">
                                <div className="flex gap-2">
                                    <List
                                    className="bg-blue visiblity_check"
                                    reorder={reorder}
                                    list={masterList}
                                    name="all"
                                    />                                
                                </div>
                                </div>
                            </div>                                       
                        </div>}
                    </div>
                    <div className='card-footer py-5 text-center' id='kt_task_footer'>
                        <button
                        type='submit'
                        
                        className='btn btn_primary text-primary'
                        disabled={formik.isSubmitting}
                        >
                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                        <KTSVG
                        path='/media/custom/save_white.svg'
                        className='svg-icon-3 svg-icon-primary ms-2'
                        />
                        </span>}
                        {loading && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                            {intl.formatMessage({id: 'please_wait'})}...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                        )}
                        </button>
                    </div>
                </form>
            </div>    
        </div>
    )
}

export {ContactSettingSave}

const List = ({ reorder, className, name, list }) => {
  function onDragEnd({ list, dragIndex, dropIndex }) {
    reorder(list[dropIndex], list[dropIndex - 1], list[dropIndex + 1]);
  }

  return (
    <div className={`flex flex-col gap-1 w-full lead_drag ${className}`}>
      
      <Draggable onDragEnd={onDragEnd} list={list} cols={1} height={48}>
        {(segment) => <Segment>{segment.split('-')[0]}</Segment>}
      </Draggable>
    </div>
  );
};

const Segment = ({ children }) => {
  const colors = [
    "gray"
  ];

  const id = children
    .split("")
    .reduce((total, char) => (total += char.charCodeAt(0)), 0);

  const color = colors[id % colors.length];

  return (
    <div
      className={`px-4 py-2 rounded shadow scale-100 bg-${color}-300 text-dark font-bold w-100 mx-2`}
    >
      {children}
    </div>
  );
};