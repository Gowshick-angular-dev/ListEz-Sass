import React,{FC, useState,useEffect} from 'react'
import { getTasks, updateTaskStatus, updateTaskPriority, deleteTask, getTaskDropdowns, bulkReassignTask } from './core/_requests'
import Moment from 'moment';
import { Offcanvas, Toast } from 'bootstrap';
import { TaskDrawer } from './taskDrawers';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { TaskDetails } from './taskDetails';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { TaskToolbar } from './taskToolbar';
import moment from 'moment';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ControlledBoardTask } from './taskKanban';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { getReassignDropdown } from '../contact/core/_requests';
import { getUsers } from '../settings/userManagement/core/_requests';

const initialValues = {
    reply: '',
}

const TaskPage: FC = () => {
    const intl = useIntl();
    const [tasks, setTasks] = useState<any[]>([]);
    const [taskStatusCalendar, setTaskStatusCalendar] = useState<any[]>([]);
    const [toggle, setToggle] = useState('grid');
    const {currentUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [detailData, setDetailData] = useState('');
    const [detailTab, setDetailTab] = useState('');
    const [noteSave, setNoteSave] = useState('');
    const [priority, setPriority] = useState('');
    const [deleteData, setDeleteData] = useState('');
    const [status, setStatus] = useState('');
    const [idjff, setId] = useState('');
    const [taskLength, setTaskLength] = useState<any>();
    const [allSelected, setAllSelected] = useState(false);
    const [dropdowns, setDropdowns] = useState<any>({});
    const [eventInfo, setEventInfo] = useState<any>({});
    const [kanbanData, setKanbanData] = useState<any>({});
    const [reassignDropdown, setReassignDropdown] = useState<any[]>([]);
    const [bulkAssign, setBulkAssign] = useState<any[]>([]);
    const [taskBody, setTaskBody] = useState({
        "task_type": '',
        "assign_to": '',
        "project": '',
        "reminder": '',
        "priority": '',
        "task_status": '',
        "created_date": '',
        "created_by": '',
        "filter_name": '',
        "sort_by": '',
        "limit": 0
    });
    const [detailClick, setDetailClick] = useState(false);
    const [taskCheckList, setTaskCheckList] = useState<any[]>([]);

    console.log("kgfeuyrieurher", eventInfo);
    
    
    const handleHideData = (e:any) => {
        setToggle(e.target.value);
        if(e.target.value == 'grid') {
            taskListInit();
        } else if(e.target.value == 'calendar') {
            calenderView();
        } else if(e.target.value == 'pipe') {
            kanbanView();
        }
    };

    const kanbanView = async () => {
        const taskResponse = await getTasks({
            ...taskBody,
            "limit": ''
        })   
        setKanbanData(taskResponse)     
    }

    const dropdownsTask = async () => {
        const response = await getTaskDropdowns()
        setDropdowns(response.output)
    }
    
    const taskList =  async () => {
        setTaskCheckList([]);
        const taskResponse = await getTasks({
            "task_type": '',
            "assign_to": '',
            "project": '',
            "reminder": '',
            "priority": '',
            "task_status": '',
            "created_date": '',
            "created_by": '',
            "filter_name": '',
            "sort_by": '',
            "limit": 0
        })
        setTaskBody({
            "task_type": '',
            "assign_to": '',
            "project": '',
            "reminder": '',
            "priority": '',
            "task_status": '',
            "created_date": '',
            "created_by": '',
            "filter_name": '',
            "sort_by": '',
            "limit": 0
        })
        setTasks(taskResponse.output);
        setTasks(taskResponse.output);
        setTaskLength(taskResponse.count);
    }

    const taskListInit =  async () => {
        setIsLoading(true);
        setTaskCheckList([]);
        const taskResponse = await getTasks({
            "task_type": '',
            "assign_to": '',
            "project": '',
            "reminder": '',
            "priority": '',
            "task_status": '',
            "created_date": '',
            "created_by": '',
            "filter_name": '',
            "sort_by": '',
            "limit": 0
        })
        setTaskBody({
            "task_type": '',
            "assign_to": '',
            "project": '',
            "reminder": '',
            "priority": '',
            "task_status": '',
            "created_date": '',
            "created_by": '',
            "filter_name": '',
            "sort_by": '',
            "limit": 0
        })
        setTasks(taskResponse.output);
        setTasks(taskResponse.output);
        setTaskLength(taskResponse.count);
        setIsLoading(false);
    }

    const taskListFilter =  async () => {
        setTaskCheckList([]);
        const taskResponse = await getTasks({...taskBody, "limit": 0})
        setTaskBody({...taskBody, "limit": 0})
        setTasks(taskResponse.output);
        setTasks(taskResponse.output);
        setTaskLength(taskResponse.count);
    }

    const openModal = (taskId:any, tabType:any) => {
        setDetailData(taskId);
        setDetailTab(tabType);
        setDetailClick(true);
        document.body.className += ' detail_opened';
        var offCanvasEl = document.getElementById('kt_expand'+taskId);
        offCanvasEl?.classList.remove('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.show();
    }

    const kniughbdkjfbgkjdf = () => {
        alert();
    }
 
    const deleteModel = async (id:any) => {
        const response = await deleteTask(id);
        if(response.status == 200) {
            setIsLoading(false);
            setDeleteData('');
            taskListInit();
            var toastEl = document.getElementById('taskDeleteToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    function renderEventContent(eventInfo:any) { 
        console.log("ejfkuwgrwyegb", eventInfo);
              
        return (<>
          <a className='btn p-0 border-0 w-100 bg-gray-300' data-bs-toggle='modal'
          data-bs-target={'#calender_popup'} onClick={() => setEventInfo(eventInfo)}>
            <span className='text-wrap shrink fs-8' >{eventInfo.event.title}</span>
          </a>
          </>
        )
      }

      const calenderView = async () => {
        const taskResponse = await getTasks({
            ...taskBody,
            "limit": ''
        })
        let calanderdata = taskResponse.output;
        console.log("fygeurfgwuergwjehrbj", calanderdata)
        var taskData = [];

        for(let i = 0; i < calanderdata.length; i++){
            const data = {title: calanderdata[i]['task_type_name'], start: calanderdata[i]['task_time_at'], end: calanderdata[i]['task_time_at'], groupId: calanderdata[i]['agenda'], from: moment(calanderdata[i]['task_time_at']).format('DD-MM-YYYY hh:mm a'), to: calanderdata[i]['property_name'], id: calanderdata[i]['assign_to_name'] ?? '', overlap: calanderdata[i]['contact_name'], textColor: calanderdata[i]['contact_mobile']};

            taskData.push(data);
        }
        setTaskStatusCalendar(taskData);
      }
 
    useEffect(() => {
        taskListInit();
        dropdownsTask();
        reassignDroplist();
    }, []);

    const taskOnSelect = (e:any, id:any) => {
        const newArr = [...taskCheckList];
        if(e.target.checked != false){
            setTaskCheckList(taskCheckList => [...taskCheckList, id]);
        } else {
            newArr.splice(newArr.findIndex(item => item === id), 1);
            setTaskCheckList(newArr);
        }
    }

    const taskListLazyLoad = async () => {
        const taskResponse = await getTasks({...taskBody, "limit": taskBody.limit+12})
        setTaskBody({...taskBody, "limit": taskBody.limit+12})
        setTaskLength(taskResponse.count);
        setTasks((data) => [...data, ...taskResponse.output]);
    }

    const sortbyChangeTask = async (e:any) => {
        if(e == "reset") {
            taskListInit();
            var toastEl = document.getElementById('taskFilterReset');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else {
            setTaskBody({...taskBody, sort_by: e, limit: 0});
            const taskResponse = await getTasks({...taskBody, sort_by: e, limit: 0})
            if(taskResponse.status == 200) {
                setTasks(taskResponse.output);
                var toastEl = document.getElementById('taskFilter');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } 
        }
    }

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Give a reason to change status'),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          try {
              if(noteSave == "status") {    
                let body = {
                    "task_status": status,
                    "reply": values.reply
                }
            const updateStatus = await updateTaskStatus(idjff, body);
            if(updateStatus.status == 200) {
                document.getElementById('kjgfuyeurygwerjhq')?.click();
                formikNotes.setFieldValue('reply', '');
                if(status == '158') {
                    deleteModel(idjff);
                }
                setTasks(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === idjff);
                    
                    if (objectToUpdate) {
                      objectToUpdate.task_status = status;
                    }
                    
                    return updatedData;
                  });
                // (document.getElementById('statusChange' + idjff) as HTMLInputElement).value = status?.toString();
                var toastEl = document.getElementById('taskStatusUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else if(updateStatus.status == 404) {
                document.getElementById('kjgfuyeurygwerjhq')?.click();
                var toastEl = document.getElementById('taskNotUpdated');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
            
        } else {
            let body = {
                "priority": priority,
                "reply": values.reply
            }
            const updatePriority = await updateTaskPriority(idjff, body);
            if(updatePriority.status == 200) {
                document.getElementById('kjgfuyeurygwerjhq')?.click();
                formikNotes.setFieldValue('reply', '');
                setTasks(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === idjff);
                    
                    if (objectToUpdate) {
                      objectToUpdate.priority = priority;
                    }
                    
                    return updatedData;
                  });
                // (document.getElementById('priorityChange' + idjff) as HTMLInputElement).value = status?.toString();
                var toastEl = document.getElementById('taskPriorityUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else if(updatePriority.status == 404) {
                document.getElementById('kjgfuyeurygwerjhq')?.click();
                var toastEl = document.getElementById('taskNotUpdated');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
        }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            var toastEl = document.getElementById('taskErrToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setSubmitting(false)
            setIsLoading(false)
          }
        },
    })

    const cancelUpdate = () => {
        formikNotes.setFieldValue("reply", '');
        setId('');
        var toastEl = document.getElementById('taskNotUpdated');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
    }

    const taskPriorityChange = async (e:any, id:any, current:any) => {
        setId(id);
        setPriority(e)
        setNoteSave("priority");
        (document.getElementById('priorityChange' + id) as HTMLInputElement).value = current?.toString();
        document.getElementById('task_status_pop')?.click();
    }

    const taskStatusChange = async (e:any, id:any, current:any) => {
        setId(id);
        setStatus(e);
        setNoteSave("status");
        (document.getElementById('statusChange' + id) as HTMLInputElement).value = current?.toString();
        document.getElementById('task_status_pop')?.click();
    }

    const taskOnSelectAll = () => {
        setAllSelected(true);
        tasks?.map((item:any) => (document.getElementById('task'+item.id) as HTMLInputElement).checked = true);
        setTaskCheckList(kanbanData.output?.map((item:any) => item.id));
    }
    
    useEffect(() => {
        if(allSelected) {
            taskOnSelectAll();
        }
    }, [tasks]);

    const taskOnUnselectAll = () => {
        setAllSelected(false);
        tasks?.map((item:any) => (document.getElementById('task'+item.id) as HTMLInputElement).checked = false);
        setTaskCheckList([]);
    }
    
    const reassignDroplist = async () => {
        const response = await getUsers();
        setReassignDropdown(response.output)
    }

return(
    <div>  
        <div className='d-none'>
            <ThemeBuilder/>
        </div>          
        <TaskToolbar sortByOnChange={sortbyChangeTask} layoutOnChange={handleHideData} count={taskLength} selectedTasks={taskCheckList} body={taskBody} taskOnSelectAll={taskOnSelectAll} taskOnUnselectAll={taskOnUnselectAll} />
        <TaskDrawer setTaskList={setTasks} task_body={setTaskBody} sort_by={taskBody} count={setTaskLength} />
        <button id='task_reload' className='d-none' onClick={taskList}>reload</button>            
        <button id='calender_reload' className='d-none' onClick={calenderView}>reload</button>            
        <button id='kanban_reload' className='d-none' onClick={kanbanView}>reload</button> 
        <button id='task_reload_filter' className='d-none' onClick={taskListFilter}>reload</button> 
        <button className='d-none' id="kt_task_reassign_pop_toggle" data-bs-toggle='modal' data-bs-target={'#task_reassign_pop_toggle'}>pop</button>  
        <div className='modal fade' id={'task_reassign_pop_toggle'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h3>{intl.formatMessage({id: 're_assign'})}</h3>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={() => setTaskCheckList([])}>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                    </div>
                    <div className='modal-body py-lg-10 px-lg-10'>
                        <div className="mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>
                            <div className="input-group mb-3">
                                <div className='w-100'>                                       
                                    <ReactSelect
                                    isMulti
                                    options={reassignDropdown}
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                    getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                    getOptionValue={(option:any) => option.id}
                                    value={reassignDropdown?.filter((item:any) => bulkAssign.indexOf(item) !== -1)}
                                    classNamePrefix=""
                                    className={""}
                                    onChange={(val:any) => {
                                        setBulkAssign(val);
                                    }}
                                    placeholder={"assign_to.."}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='text-center'>
                            <button className='btn btn-sm btn_primary text-primary mt-3' onClick={async () => {                                    
                                if(taskCheckList.length > 0 && bulkAssign.length > 0) {
                                    let body = {
                                        'assign_to': bulkAssign?.map((item:any) => item.id?.toString()).join(','),
                                    }
                                    const response = await bulkReassignTask(body, taskCheckList);
                                    if(response.status == 200) {
                                        setAllSelected(false);
                                        setTaskCheckList([]);
                                        setBulkAssign([]);
                                        document.getElementById('kt_task_reassign_pop_toggle')?.click();
                                        // leadList();
                                        tasks?.map((item:any) => (document.getElementById('task'+item.id) as HTMLInputElement).checked = false);
                                        var toastEl = document.getElementById('contactBulkReassign');
                                        const bsToast = new Toast(toastEl!);
                                        bsToast.show(); 
                                    }
                                } else {
                                    var toastEl = document.getElementById('contactBulkReassignErrMsg');
                                    const bsToast = new Toast(toastEl!);
                                    bsToast.show();
                                }
                            }}>
                                {intl.formatMessage({id: 'yes'})}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>         
        <div className='modal fade' id={'delete_confirm_popup418'} aria-hidden='true'>
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
                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteModel(deleteData)}>
                                {intl.formatMessage({id: 'yes'})}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='modal fade' id={'calender_popup'} aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header d-flex justify-content-between py-2'>
                        <div className="text-start pt-2">
                            <h3>{eventInfo.event?.title}</h3>
                            <div className='d-flex flex-wrap justify-content-between pt-1 pe-3'>                            
                                <div className='fs-8 bolder' >{intl.formatMessage({id: 'task_date'})} :  <span className='text-gray-700 fs-9'>{eventInfo.event?.extendedProps?.from}</span></div>
                            </div>
                        </div>                        
                        <div className="text-end pt-2">
                            <h3>{eventInfo.event?.overlap}</h3>
                            <div className='d-flex flex-wrap justify-content-end pt-1'>                            
                                <a href={'tel:'+eventInfo.event?.textColor} className='fs-8 bolder'><span className='text-gray-700 fs-9'>{eventInfo.event?.textColor}</span></a>
                            </div>
                        </div>
                    </div>
                    <div className='modal-body py-2'>
                        <div className="task_content_single">
                            <div className="d-flex align-items-start single_item justify-content-between">
                                <div className="d-flex flex-column">
                                    <small className="text_light">{intl.formatMessage({id: 'assign_to'})}</small>
                                    <p className="mb-0 fw-500">{eventInfo.event?.id.split(',').map((val:any) => val.split('-')[0])?.join(', ') ?? '--'}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <small className="text_light">{intl.formatMessage({id: 'project'})}</small>
                                    <p className="mb-0 fw-500">{eventInfo.event?.extendedProps?.to ?? '--'}</p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <small className="text_light">{intl.formatMessage({id: 'description'})}</small>
                            <p className='mt-1 text-wrap calender_pop'>{eventInfo.event?.groupId}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='modal fade' id={'contact_status_change'} tabIndex={-1} role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={cancelUpdate}>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                        <button className='d-none' data-bs-dismiss='modal' id='kjgfuyeurygwerjhq'>close</button>
                    </div>
                    <div className='modal-body py-lg-10 px-lg-10'>
                        <form noValidate onSubmit={formikNotes.handleSubmit}>
                            <textarea
                                className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10'
                                data-kt-autosize='true'
                                {...formikNotes.getFieldProps('reply')} 
                                rows={7}
                                placeholder='Reason'
                            ></textarea>
                            {formikNotes.touched.reply && formikNotes.errors.reply && (
                            <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                </div>
                            </div>
                            )}
                            <div className='d-flex align-items-center justify-content-end'>
                                <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={cancelUpdate}>
                                    {intl.formatMessage({id: 'no'})}
                                </button>
                                <button disabled={formikNotes.isSubmitting} className='btn btn-sm btn_primary text-primary mt-3' type='submit'>
                                    {intl.formatMessage({id: 'yes'})}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {isLoading ? 
        <div className='w-100 h-100'>
            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                <div className="spinner-border taskloader" role="status">                                    
                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                </div>
            </div> 
        </div> :
        <div className={toggle == 'grid' ? "taskpage d-block": 'd-none'}>
            {/* modal */}
            <div>   
                {detailClick && 
                    <>
                        <div
                            id={'kt_expand'+detailData}
                            className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                        >
                            <TaskDetails taskId={detailData} setTaskList={setTasks} tabInfo={detailTab} setDetailClicked={setDetailClick} taskBody={taskBody} />
                        </div>
                    </>
                }
            </div>
            <InfiniteScroll
                dataLength={tasks.length}
                next={taskListLazyLoad}
                hasMore={taskLength > tasks.length}
                loader={<>
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div>
                </>}
                endMessage={<>
                {tasks.length == 0 ?
                <div className='w-100 d-flex justify-content-center'>
                    <div>
                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                        <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                    </div>
                </div> : 
                <div className='w-100 d-flex justify-content-center'>
                    <div>
                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" />
                        <h4>{intl.formatMessage({id: 'no_more_tasks_to_show'})}!!!</h4>
                    </div>
                </div>}</>}
            >
                <div className="row">
                <div className="card-group">
                {tasks.map((taskData, i) => {
                return(                                    
                    <div className="col-sm-6 col-md-4 col-lg-6 col-xxl-3 col-xl-3 mt-10 mb-3" key={i} id={"nhcfiegbwecgburfjwruwrgbg"+taskData.id}>                            
                        <div className="card h-100 mx-2 task_card bs_1">
                            <div className="card_status bg_secondary">
                                <p className="mb-0">{taskData.task_type_name ?? 'No Task Type'}</p>
                            </div>
                            <div className='card-body px-3 pt-3 pb-0 overflow-hidden h-100'>
                                <div className="d-flex align-items-center justify-content-between mb-5">   
                                    <div className="d-flex align-items-center">                                            
                                        <form action="">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" onClick={(e) => taskOnSelect(e, taskData.id)} id={"task"+taskData.id}/>
                                                <label className="form-check-label id_label" htmlFor={"task"+taskData.id}>
                                                    {taskData.id}
                                                </label>
                                            </div>
                                        </form>
                                        <div className="ms-3 ml-2 d-flex align-items-center">
                                            <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="icon me-2" />
                                            <p className="mb-0 contact_name py-1">{taskData.contact_name}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <a href='#' onClick={() => openModal(taskData.id, 'overview')}><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>
                                        <div className="btn-group">
                                            <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                <li><a className="dropdown-item" href="#" onClick={() => openModal(taskData.id, 'overview')}>{intl.formatMessage({id: 'edit'})}</a></li>
                                                {currentUser?.designation == 1 && <li><a className="dropdown-item" href="#" data-bs-toggle='modal' onClick={() => setDeleteData(taskData.id)} data-bs-target={'#delete_confirm_popup418'}>{intl.formatMessage({id: 'delete'})}</a></li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0">
                                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={taskData.contact_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+taskData.contact_id+'/'+taskData.contact_profile_image : ''} className="user_img" alt='' />
                                    </div>
                                    <div className="flex-grow-1 ms-4">
                                        <a href={"mailto:"+ taskData.contact_email} className="d-flex align-items-center mb-3 text-dark">
                                            <img src={toAbsoluteUrl('/media/custom/envelope.svg')} alt="" className="icon me-1"/>
                                            <p className="mb-0 fixed_text">{taskData.contact_email}</p>
                                        </a>
                                        <div className="d-xxl-flex justify-content-between">
                                            <a href={"tel:" + taskData.contact_mobile} className="d-flex align-items-center mb-2 text-dark">
                                                <p className="mb-0 d-flex flex-wrap">
                                                    <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
                                                    {taskData.contact_mobile}
                                                </p>
                                            </a>
                                            <a href={"https://api.whatsapp.com/send?phone="+ taskData.contact_mobile} target="new" className="d-flex align-items-center mb-2 text-dark">
                                                <p className="mb-0 d-flex flex-wrap">
                                                    <span><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} alt="" className="icon me-1" /></span>
                                                    {taskData.contact_mobile}
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="row">
                                                {/* <div className="col-sm-6 col-6 mb-3">
                                                    <div className="task_content_single" title={taskData.contact_type ?? '--'}>
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'contact_type'})}</small>
                                                                <p className="mb-0 fw-500">{taskData.contact_type ?? '--'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="col-sm-6 col-6 mb-3" title={taskData.property_name ?? '--'}>
                                                    <div className="task_content_single">
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/project.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'project'})}</small>
                                                                <p className="mb-0 fw-500">{taskData.property_name ?? '--'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-6 mb-3" title={taskData.assign_to_name?.split(',').map((data:any) => data.split('-')[0]).join(', ') ?? '--'}>
                                                    <div className="task_content_single">
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'assign_to'})}</small>
                                                                <p className="mb-0 fw-500">{taskData.assign_to_name?.split(',').map((data:any) => data.split('-')[0]).join(', ') ?? '--'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-6 mb-3" title={Moment(taskData.task_time_at).format('DD-MMMM-YYYY hh:mm a')}>
                                                    <div className="task_content_single">
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/fromdate.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'task_date'})}</small>
                                                                <p className="mb-0 fw-500">{Moment(taskData.task_time_at).format('DD-MM-YYYY hh:mm a')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-6 mb-3" title={Moment(taskData.created_at).format('DD-MMMM-YYYY') == "Invalid date" ? "--" : Moment(taskData.created_at).format('DD-MM-YYYY')}>
                                                    <div className="task_content_single">
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/fromdate.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'created_date'})}</small>
                                                                <p className="mb-0 fw-500">{Moment(taskData.created_at).format('DD-MM-YYYY') == "Invalid date" ? "--" : Moment(taskData.created_at).format('DD-MM-YYYY')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-3" title={taskData.agenda ?? '--'}>
                                                    <div className="task_content_single">
                                                        <div className="d-flex align-items-start single_item">
                                                            <img src={toAbsoluteUrl('/media/custom/fromdate.svg')} alt="" className="me-2"/>
                                                            <div className="d-flex flex-column">
                                                                <small className="text_light">{intl.formatMessage({id: 'task_description'})}</small>
                                                                <p className="mb-0 fw-500">{taskData.agenda ?? '--'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer border-0 p-1">
                                    <div className="row">
                                        <div className="col-7 col-xl-8 icons_bar d-flex align-items-end flex-wrap">
                                            <a href="#" onClick={() => openModal(taskData.id, 'notes')} className="btn btn-sm icon_primary rounded-circle position-relative mb-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Notes">
                                                <img src={toAbsoluteUrl('/media/custom/notes.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    {taskData.notes_count}
                                                </span>
                                            </a>
                                            <a href="#" onClick={() => openModal(taskData.id, 'files')} className="btn btn-sm icon_primary rounded-circle position-relative mb-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="File">
                                                <img src={toAbsoluteUrl('/media/custom/file.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    {taskData.files_count}
                                                </span>
                                            </a>
                                            {/* <a href="#" onClick={() => openModal(taskData.id, 'timeline')} className="btn btn-sm icon_primary rounded-circle position-relative mb-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Timeline">
                                                <img src={toAbsoluteUrl('/media/custom/task.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    0
                                                </span>
                                            </a> */}
                                            <select className="form-control form-select-sm priority_select ms-2 mb-2" id={"priorityChange"+taskData.id} aria-label=".form-select-sm example" onChange={(e) => taskPriorityChange(e.target.value, taskData.id, taskData.priority)}>
                                                <option disabled value=''>select</option>
                                                {dropdowns.priority?.map((taskPrior:any,i:any) =>{
                                                    return (
                                                        <option value={taskPrior.id} selected={taskPrior.id == taskData.priority} key={i}>{taskPrior.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                        <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
                                            <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" aria-label="Default select example" id={"statusChange"+taskData.id} onChange={(e) => taskStatusChange(e.target.value, taskData.id, taskData.task_status)}>
                                                <option disabled value=''>select</option>
                                                {dropdowns.task_status?.map((taskState:any,i:any) => {
                                                    return (
                                                        <option value={taskState.id} selected={taskState.id == taskData.task_status} key={i}>{taskState.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                        <a className="d-none" href="#" data-bs-toggle='modal' id='task_status_pop'
                                            data-bs-target={'#contact_status_change'}></a>                                                
                                        </div>
                                </div> 
                            </div>
                        </div>   
                    </div>
                )})}
                </div>
            </div>
            </InfiniteScroll>                
        </div>
}
            {/* kanban view */}
            <div className={toggle == 'pipe' ? "taskpage d-block": 'd-none'}>
                {/* {intl.formatMessage({id: 'pipeline'})} */}
                <ControlledBoardTask boardData={kanbanData} reload={kanbanView}/>
            </div>
            
            {/* calendar view */}
            {toggle == 'calendar' && (<>
                {isLoading ? 
                <div className='w-100 h-100'>
                <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                    <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                    <div className="spinner-border taskloader" role="status">                                    
                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                    </div>
                </div> 
            </div>:
            <div className='taskCalenderView'>
                <FullCalendar
                initialView="dayGridMonth"
                headerToolbar= {{
                    start: "prev,next,today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                plugins={[dayGridPlugin, timeGridPlugin]}
                events={taskStatusCalendar}
                eventContent={renderEventContent}
                />
            </div>}
            </>)}
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskAddToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_added_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskUpdateToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskErrToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'somthing_went_wrong'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskDeleteToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNoteAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_note_added_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNoteReply">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                        data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_note_reply_posted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNoteDeleteToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                        data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_note_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNoteUpdateToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                        data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'task_note_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFilesAddToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_files_uploaded_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFileDeleteToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_files_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFilter">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_filter_applied_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFilterReset">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_filter_removed_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFilterSave">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_filter_saved_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskPriorityUpdate">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_priority_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskStatusUpdate">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_status_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFileWarningToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_file_size_cannot_be_more_than_2_mb'})}!{' '}{intl.formatMessage({id: 'larger_files_eleminated'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNotUpdated">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'task_not_updated'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskImgrmvErr">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'large_files_removed'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskFilterLimit">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'filter_limit_reached__delete_any_existing_filter_to_save_a_new_filter'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="taskNotSelectedToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'select_tasks_first'})}!
                </div>
            </div>
        </div>
    )
}

export {TaskPage}