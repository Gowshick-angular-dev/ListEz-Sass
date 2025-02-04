import React,{FC, useState, useEffect, useCallback} from 'react'
import {getTask, updateTask, saveTaskNotes, getTaskNotes, uploadMultipleFileTask, deleteMultipleFilesTasks, getMultipleFilesTasks, editTaskNotes, deleteTaskNotes, getTaskDropdowns, getLog} from './core/_requests';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast, Offcanvas } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Dropzone, { useDropzone } from 'react-dropzone'
import Moment from 'moment';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useIntl } from 'react-intl';
import moment from 'moment';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";


const initialValues = {
    task_type: "", 
    task_time: "",  
    finish_time: "",  
    project: "",  
    contact: "",
    reminder: "",
    agenda: "",
    assign_to: "",
    reply:'',
    title: "",
    subject: "",
    share_with: "",
    module_id: "",
    priority: "",
    task_status: "",
    body: "",
}

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

const thumb = {
    display: 'inline-flex',
    borderRadius: 5,
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

function getStyles(name: string, aminityName: string[], theme: Theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const Contactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'firstName', headerName: 'First name', width: 130,headerClassName: 'dg_header' },
    { field: 'Email', headerName: 'Email', width: 130,headerClassName: 'dg_header' },
    { field: 'PhoneNumber', headerName: 'Phone Number', type: 'number', width: 130,headerClassName: 'dg_header'},
    { field: 'designation', headerName: 'Designation', width: 130,headerClassName: 'dg_header' },
    { field: 'createdBy', headerName: 'Created By', width: 130,headerClassName: 'dg_header' },
    { field: 'createdOn', headerName: 'Created On', width: 130,headerClassName: 'dg_header' },
  ];

  const logContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100,headerClassName: 'dg_header' },
    { field: 'user_name', headerName: 'User Name', width: 250,headerClassName: 'dg_header', renderCell: (name) => name.value?.first_name },
    { field: 'module_name', headerName: 'Module Name', width: 300,headerClassName: 'dg_header', renderCell: (row) => row.value == 1 ? 'Contact' : row.value == 2 ? 'Lead' : row.value == 3 ? 'Project' : row.value == 4 ? 'Task' : 'Transaction' },
    { field: 'note', headerName: 'Note', width: 600,headerClassName: 'dg_header' },
    { field: 'createdAt', headerName: 'Created At', width: 200,headerClassName: 'dg_header', renderCell: (name) => moment(name.value).format('DD-MMMM-YYYY HH:mm') },
];

const Contactrows = [
  { id: '85213',
    firstName: 'Mr.Raj',
    Email:'raj2002@gmail.com',
    PhoneNumber: '8965745689',
    designation:'Asst.Manager',
    createdBy:'Kumar',
    createdOn: '10 Dec 2022'
  },
];


const leadcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 ,headerClassName: 'dg_header'},
    { field: 'firstName', headerName: 'First name', width: 130, headerClassName: 'dg_header',
        renderCell: (params: GridRenderCellParams<Date>) => (
        <strong>
          <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="table_icon me-2" />
          
        </strong>
      ),
    },
    { field: 'Email', headerName: 'Email', width: 130, headerClassName: 'dg_header' },
    { field: 'PhoneNumber', headerName: 'Phone Number', type: 'number', width: 130, headerClassName: 'dg_header'},
    { field: 'Project', headerName: 'Project', width: 130, headerClassName: 'dg_header'},
    { field: 'Configuration', headerName: 'Configuration', width: 130, headerClassName: 'dg_header'},
    { field: 'ProjectType', headerName: 'Project Type', width: 130, headerClassName: 'dg_header'},
    { field: 'Source', headerName: 'Source', width: 130, headerClassName: 'dg_header'},
    { field: 'CreatedOn', headerName: 'Created on', width: 130, headerClassName: 'dg_header'},
    { field: 'AssignTo', headerName: 'Assign To', width: 130, headerClassName: 'dg_header'},
    { field: 'Budget', headerName: 'Budget', width: 130, headerClassName: 'dg_header'},
    { field:'Action', renderCell: () => (
        <select className="form-select toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" aria-label="Default select example">
            <option value="">Status</option>
            <option value="1">Pending</option>
            <option value="2">Completed</option>
        </select>
      ),
    }
  ];


type Props = {
    taskId?: any,
    setTaskList?: any,
    tabInfo?: any,
    taskBody?: any,
    setDetailClicked?: any
}

const TaskDetails: FC<Props> = (props) => {
    const intl = useIntl();
    const {
        taskId, setTaskList, tabInfo, setDetailClicked, taskBody
    } = props

    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [taskDetail, setTaskDetail] = useState<{[key: string]: any}>({});
    const [loading, setLoading] = useState(false);
    const [taskTime, setTaskTime] = React.useState<Date | null>(new Date());
    const [finishTime, setFinishTime] = React.useState<Date | null>(new Date());
    const [assignToName, setAssignToName] = React.useState<string[]>([]);
    const [assignToId, setAssignToId] = React.useState<string[]>([]);
    const [TaskNoteList, setTaskNoteList] = useState<any[]>([]);
    const [files, setFiles] = useState<any>([]);
    const {currentUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormError, setIsFormError] = useState(false);    
    const [isFileError, setIsFilesError] = useState(false);    
    const [parentId, setParentId] = useState<String>('');
    const [imgFullView, setImgFullView] = useState(false);
    const [imgSelect, setImgSelect] = useState('');
    const [filesVal, setFilesVal] = useState<any[]>([]);  
    const [activeTimeline, setActiveTimeline] = useState<any[]>([]);   
    const [dropdowns, setDropdowns] = useState<any>({});   
    const [noteEditVal, setNoteEditVal] = useState<any>('');
    const [contactId, setContactId] = useState<any>('');
    const [propertyId, setPropertyId] = useState<any>('');

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png','.pdf'],
        },
        onDrop: acceptedFiles => 
        {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        var test: any[] = [];
        acceptedFiles.map(file => {         
            let data = {
                "lastModified": file.lastModified,
                "name": file.name,
                "size": file.size,
                "type": file.type,
            }
            test.push(data);
            }
        );
        },
        // maxSize: 2097152,
    }); 
    
    const FetchTaskDetails =  async (taskId : number) => {
        setIsLoading(true);
        const response = await getTaskDropdowns()
        setDropdowns(response.output)
        const fetchDetails = await getTask(taskId)
        setTaskDetail(fetchDetails.output[0]);
        formik.setFieldValue('task_type', fetchDetails.output[0]?.task_type ?? '');
        formik.setFieldValue('reminder', fetchDetails.output[0]?.reminder ?? '');
        formik.setFieldValue('task_status', fetchDetails.output[0]?.task_status ?? '');
        formik.setFieldValue('priority', fetchDetails.output[0]?.priority ?? '');
        formik.setFieldValue('task_time', fetchDetails.output[0]?.task_time_at ?? '');
        formik.setFieldValue('finish_time', fetchDetails.output[0]?.finish_time_at ?? '');
        formik.setFieldValue('project', fetchDetails.output[0]?.project ?? '');
        formik.setFieldValue('contact', fetchDetails.output[0]?.contact_id ?? '');
        setContactId(fetchDetails.output[0]?.contact_id ?? '');
        setPropertyId(fetchDetails.output[0]?.project ?? '');
        setAssignToId(response.output?.assign_to?.filter((item:any) => fetchDetails.output[0].assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));
        formik.setFieldValue('agenda', fetchDetails.output[0]?.agenda ?? '');
        
        setTaskTime(fetchDetails.output[0]?.task_time_at);
        setFinishTime(fetchDetails.output[0]?.finish_time_at);
        // var assignArray = [];
        // var assignNameArray = [];
        // if(fetchDetails.output[0]?.assign_to != null){
        //     assignArray = fetchDetails.output[0]?.assign_to.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(fetchDetails.output[0]?.assign_to_name != null){
        //     assignNameArray = fetchDetails.output[0]?.assign_to_name.split(",").map((e:any) => {
        //         return e;
        //     });
        // }
        // setAssignToName(assignNameArray);
        // setAssignToId(assignArray);
        setIsLoading(false);
    };

    const activityTimeline = async () => {
        const response = await getLog(taskId)
        setActiveTimeline(response.output);
        
    }

    useEffect(() => {        
        if(taskId) {
            activityTimeline();
            FetchTaskDetails(taskId);
            taskNoteList();
            taskFilesList(taskId);
        }
    }, [taskId]);
    
    const saveFiles = async () => {
        if(files.length > 0){
            setIsFilesError(false);
            try {
                var formData = new FormData(); 
                formData.append('module_name', '4');               
                for (var i = 0; i < files.length; i++) {
                    if(files[i].size < 2097152) {
                    formData.append('uploadfiles', files[i]);
                    }
                } 

                const saveContactFiles = await uploadMultipleFileTask(taskId, formData)
        
                if(saveContactFiles.status == 200) {
                    if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                        document.getElementById('task_reload_filter')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    } else {
                        document.getElementById('task_reload')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    }
                  setFilesVal(saveContactFiles.output);
                  setFiles([]);
                  var toastEl = document.getElementById('taskFilesAddToast');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                }        
              } catch (error) {
                console.error(error)
                var toastEl = document.getElementById('taskErrToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                setLoading(false)
              }   
        }
    
        else {
            setIsFilesError(true);
        }
    }

    const taskNoteList =  async () => {   
        const taskNoteResponse = await getTaskNotes(taskId);
        setTaskNoteList(taskNoteResponse.output);
    }    

    const minimaximize = () => {
        setIsExpand(current => !current);
    }
    
    const fullScreenChange = () => {
        setIsFullScreen(current => !current);
    }

    const taskSaveSchema = Yup.object().shape({
        task_type: Yup.string().required('Task type is required'),
        task_time: Yup.string().required('Task time is required'),
        // finish_time: Yup.string(),
        project: Yup.string(),
        contact: Yup.string(),
        priority: Yup.string(),
        task_status: Yup.string(),
        agenda: Yup.string().required('Task Description is required'),
        remainder: Yup.string(),
        assign_to: Yup.string(),
    })

    // const taskSaveSchema = Yup.object().shape({
    //     task_type: Yup.string().required('Task type is required'),
    //     project: Yup.string(),
    //     contact: Yup.string(),
    //     prority: Yup.string().required('Prority is required'),
    //     task_status: Yup.string(),
    //     agenda: Yup.string().required('Task Description is required'),
    //     remainder: Yup.string(),
    //     assign_to: Yup.string(),
    // })

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string(),        
      })

    const theme = useTheme(); 

    const assingToChange = (event: SelectChangeEvent<typeof assignToName>) => {
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

        setAssignToName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
          try {
            var notesBody = {
                "reply": values.reply,
                "module_id": taskId,
                "module_name": 4,
                "parent_id": 0 
            };
                           
            const leadNotesData = await saveTaskNotes(notesBody)
    
            if(leadNotesData.status == 200) {
                resetForm();
                setTaskNoteList(leadNotesData.output);
                if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                    document.getElementById('task_reload_filter')?.click();
                    document.getElementById('calender_reload')?.click();
                    document.getElementById('kanban_reload')?.click();
                } else {
                    document.getElementById('task_reload')?.click();
                    document.getElementById('calender_reload')?.click();
                    document.getElementById('kanban_reload')?.click();
                }
                var toastEl = document.getElementById('taskNoteAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('taskErrToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setLoading(false)
          }
        },
      })

    const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {    
            const reqbody = {
                "task_type": values.task_type,
                "task_time":  moment(taskTime).format('YYYY-MM-DD HH:mm:ss'),
                "finish_time": moment(finishTime).format('YYYY-MM-DD HH:mm:ss') == "Invalid date" ? "" : moment(finishTime).format('YYYY-MM-DD HH:mm:ss'),
                "project": values.project,
                "contact": values.contact,
                "task_status": values.task_status,
                "priority": values.priority,
                "reminder": values.reminder,
                "agenda": values.agenda,
                "assign_to": assignToId?.map((item:any) => item.id)?.join(',').toString(),
            }
    
            const saveTaskData = await updateTask(taskId, reqbody);
            
            if(saveTaskData.status == 200){
                setLoading(false);
                setDetailClicked(false);
                document.getElementById('kt_expand_close')?.click();
                if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                    document.getElementById('task_reload_filter')?.click();
                    document.getElementById('calender_reload')?.click();
                    document.getElementById('kanban_reload')?.click();
                } else {
                    document.getElementById('task_reload')?.click();
                    document.getElementById('calender_reload')?.click();
                    document.getElementById('kanban_reload')?.click();
                }
                var toastEl = document.getElementById('myToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const taskFilesList =  async (taskId:any) => {   
        const contactFileResponse = await getMultipleFilesTasks(taskId)
        setFilesVal(contactFileResponse.output);
    }

    const replyOnSubmit = async (id:any) => {
        setParentId(id);
        let replyVal = (document.getElementById('child_reply'+id) as HTMLInputElement)!.value;
    
        if(replyVal != ''){
            setIsFormError(false);
            try {
                var notesBody = {
                    "reply": replyVal,
                    "module_id": taskId,
                    "module_name": 4,
                    "parent_id": id
                };
                               
                const saveContactNotesData = await saveTaskNotes(notesBody)
        
                if(saveContactNotesData.status == 200) {
                    (document.getElementById('child_reply'+id) as HTMLInputElement).value = ''
                    setTaskNoteList(saveContactNotesData.output);
                    if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                        document.getElementById('task_reload_filter')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    } else {
                        document.getElementById('task_reload')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    }
                    var toastEl = document.getElementById('taskNoteReply');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
        
              } catch (error) {
                console.error(error)
                var toastEl = document.getElementById('taskErrToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                setLoading(false)
              }   
        }
    
        else {
            setIsFormError(true);
        }
    
    }

    const cancelEdit = async (id:any) => {
        setParentId('');
    }

    const editOnSubmit = async (id:any) => {
        setParentId(id);
        let editVal = (document.getElementById('edit_field'+id) as HTMLInputElement)!.value;
    
        if(editVal != ''){
            setIsFormError(false);
            try {
                var notesBody = {
                    "reply": editVal,
                    "module_id": taskId,
                    "module_name": 4
                };
                               
                const editNotesData = await editTaskNotes(id, notesBody)
        
                if(editNotesData.status == 200) {
                    (document.getElementById('edit_field'+id) as HTMLInputElement).value = '';
                    setNoteEditVal('');
                    if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                        document.getElementById('task_reload_filter')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    } else {
                        document.getElementById('task_reload')?.click();
                        document.getElementById('calender_reload')?.click();
                        document.getElementById('kanban_reload')?.click();
                    }
                    setTaskNoteList(editNotesData.output);
                    var toastEl = document.getElementById('taskNoteUpdateToast');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
        
              } catch (error) {
                console.error(error)
                var toastEl = document.getElementById('taskErrToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                setLoading(false)
              }   
        }
    
        else {
            setIsFormError(true);
        }
    
    }

    const replyEdit = async (id:any, val:any) => {
        setParentId(id);        
        setNoteEditVal(val);    
    }
    
    const replyDelete = async (id:any, parent:any) => {
        let body = {
            "module_id": taskId,
            "module_name": 4
        }
        const deleteNotes = await deleteTaskNotes(id, parent, body);
        if(deleteNotes.status == 200) {
            setTaskNoteList(deleteNotes.output);
            if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                document.getElementById('task_reload_filter')?.click();
                document.getElementById('calender_reload')?.click();
                document.getElementById('kanban_reload')?.click();
            } else {
                document.getElementById('task_reload')?.click();
                document.getElementById('calender_reload')?.click();
                document.getElementById('kanban_reload')?.click();
            }
            var toastEl = document.getElementById('taskNoteDeleteToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const imgViewChange = (id:any) => {
        setImgFullView(!imgFullView)
        setImgSelect(id)
    }

    const onDeleteFile = async (id:any) => {
        let body = {
            "module_id": taskId,
            "module_name": 4
        }
        const deleteRes = await deleteMultipleFilesTasks(id, body);
        if(deleteRes.status == 200) {
            setFilesVal(deleteRes.output);
            if(taskBody.task_type || taskBody.assign_to || taskBody.project || taskBody.reminder || taskBody.priority || taskBody.task_status || taskBody.created_date || taskBody.filter_name || taskBody.created_by) {
                document.getElementById('task_reload_filter')?.click();
                document.getElementById('calender_reload')?.click();
                document.getElementById('kanban_reload')?.click();
            } else {
                document.getElementById('task_reload')?.click();
                document.getElementById('calender_reload')?.click();
                document.getElementById('kanban_reload')?.click();
            }
            var toastEl = document.getElementById('taskFileDeleteToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const closeDialogue = () => {
        setDetailClicked(false);
        var offCanvasEl = document.getElementById('kt_expand'+taskId);
        offCanvasEl?.classList.add('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.hide();
    }

    const handleClick = (index:any) => {
        setFiles([
            ...files.slice(0, index),
            ...files.slice(index + 1, files.length)
          ]);
    }

    const sendMail = () => {
    }
    const sendWatsapp = () => {
    }
    const sendSMS = () => {
    }
    const sendCall = () => {
    }

    const mailSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        subject: Yup.string().required('Subject is required'),       
        share_with: Yup.string().required('Share with is required'),
        module_id: Yup.string().required('Module is required'),       
        body: Yup.string().required('Body is required'),       
    })

    const formikMail = useFormik({
        initialValues,
        validationSchema: mailSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
              
            const body = {
                "title" : values.title,
                "subject" : values.subject,
                "share_with" : values.share_with,
                "module_id" :values.module_id,
                "body" : values.body,
            }
                            
                // const saveTemplatMailData = await saveTemplateMail(body);
            
                // if(saveTemplatMailData != null){
                //     setLoading(false);
                //     var toastEl = document.getElementById('myToastAdd');
                //     const bsToast = new Toast(toastEl!);
                //     bsToast.show();
                //     resetForm();
                //     AllTemplatesMailList();
                // }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const [search, setSearch] = useState<any>("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [allTemplatesMail, setAllTemplatesMail] = useState<any[]>([]);

    const MailById = async (id:any) => {
    }

    function filterItem(item: any, search: string) {
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
              return item[searchBy].find((val: string | any[]) => !val.includes(searchForVal));
            }
            return item[searchBy].find((val: string | any[]) => val.includes(searchFor));
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
            return !item.title.includes(searchFor);
          }
          return item.title.includes(search);
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
        var filteredData: any[] = [];
        if (search.length > 0) {
            allTemplatesMail.forEach((item) => {
            if (filterItem(item, search)) {
            filteredData.push({ ...item });
            }
        });
        } else {
            filteredData = [];
        }
        setFiltered(filteredData);        
    }, [search]);;


    return(
        <div className={isExpand ? isFullScreen ? "w-100 contact_details_page full_screen" : "w-75 contact_details_page full_screen m-5": "contact_details_page small_screen d-flex align-items-end justify-content-end m-5"}>
            {isLoading ? 
            <div className="card main_bg h-100">
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center vh-100'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" style={{width:"3rem", height: "3rem"}} role="status">
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> 
            </div> :
             isExpand ?
            <div className="card main_bg h-100">
                <div className="card-header d-flex align-items-center">
                    <div className="row w-100">
                        <div className="col-sm-12 col-12 d-flex align-items-center justify-content-end">
                            <div className='card-toolbar'>
                                <button className="btn mx-3 expand_btn" onClick={fullScreenChange}>
                                    <img src={isFullScreen ? toAbsoluteUrl('/media/custom/overview-icons/comp_white.svg') : toAbsoluteUrl('/media/custom/overview-icons/expand_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button className="btn mx-3 minimize_btn" onClick={() => {
                                    minimaximize();
                                    var element = document.getElementById("nhcfiegbwecgburfjwruwrgbg"+taskId);
                                        var headerOffset = 350;
                                        var elementPosition:any = element?.getBoundingClientRect().top;
                                        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                        });
                                }}>
                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/minimize_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button
                                    type='button'
                                    className='btn  me-n5 mx-3 close_btn'
                                    id='kt_expand_close'
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => {
                                        var element = document.getElementById("nhcfiegbwecgburfjwruwrgbg"+taskId);
                                        var headerOffset = 350;
                                        var elementPosition:any = element?.getBoundingClientRect().top;
                                        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                        });
                                        closeDialogue();                                        
                                    }}
                                    >
                                        <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon" alt='' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="card-group">
                            <div className="col-xxl-6 col-12 mb-3">
                                <div className="card bs_1 name_card h-100 mx-2">
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={taskDetail.contact_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+taskDetail.contact_id+'/'+taskDetail.contact_profile_image : ''} className="user_img" alt='' />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="d-flex">                                                            
                                                            <h4 className="mb-0 ms-2">{taskDetail.contact_name}</h4>
                                                        </div>                                                        
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <a href={"mailto:"+ taskDetail.contact_email} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                        <a href={"tel:"+ taskDetail.contact_mobile} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                        <a href="/#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a>
                                                        <a href={"https://api.whatsapp.com/send?phone="+ taskDetail.contact_mobile} className="btn_soft_primary">
                                                            <img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt='' />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-6 col-12 mb-3">
                                <div className="card bs_1 h-100 mx-2 info_card">
                                    <div className="card-body p-3">
                                        <div className='row w-100 p-3'>
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                                <p className="mb-0">{taskDetail.contact_email}</p>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                                <p className="mb-0">{taskDetail.contact_mobile}</p>
                                            </div>
                                            {/* <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'contact_category'})}</small>
                                                <p className="mb-0">{taskDetail.contact_category_name}</p>
                                            </div> */}
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                <p className="mb-0">{taskDetail.created_by_name}</p>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab_container bg_white br_10 bs_1 mx-2">
                        <div className="row mt-4">
                            <div className="col-12">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'overview' ? "nav-link active" : "nav-link"} id="overview-tab" data-bs-toggle="pill" data-bs-target={"#overview"+taskId} type="button" role="tab" aria-controls={"overview"+taskId} aria-selected="true">{intl.formatMessage({id: 'overview'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'notes' ? "nav-link active" : "nav-link"} id="notes-tab" data-bs-toggle="pill" data-bs-target={"#notes"+taskId} type="button" role="tab" aria-controls={"notes"+taskId} aria-selected="false">{intl.formatMessage({id: 'notes'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'files' ? "nav-link active" : "nav-link"} id="files-tab" data-bs-toggle="pill" data-bs-target={"#files"+taskId} type="button" role="tab" aria-controls={"files"+taskId} aria-selected="false">{intl.formatMessage({id: 'files'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="message-tab" data-bs-toggle="pill" data-bs-target={"#message"+taskId} type="button" role="tab" aria-controls={"message"+taskId} aria-selected="false">{intl.formatMessage({id: 'messages'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="contact-tab" data-bs-toggle="pill" data-bs-target={"#contact"+taskId} type="button" role="tab" aria-controls={"contact"+taskId} aria-selected="false">{intl.formatMessage({id: 'sec_contact'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="lead-tab" data-bs-toggle="pill" data-bs-target={"#lead"+taskId} type="button" role="tab" aria-controls={"lead"+taskId} aria-selected="false">{intl.formatMessage({id: 'lead'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="duplicate-tab" data-bs-toggle="pill" data-bs-target={"#duplicate"+taskId} type="button" role="tab" aria-controls={"duplicate"+taskId} aria-selected="false">{intl.formatMessage({id: 'duplicate'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="tasks-tab" data-bs-toggle="pill" data-bs-target={"#tasks"+taskId} type="button" role="tab" aria-controls={"tasks"+taskId} aria-selected="false">{intl.formatMessage({id: 'tasks'})}</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'timeline' ? "nav-link active" : "nav-link"} id="timeline-tab" data-bs-toggle="pill" data-bs-target={"#timeline"+taskId} type="button" role="tab" aria-controls={"timeline"+taskId} aria-selected="false">{intl.formatMessage({id: 'activity_timeline'})}</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={tabInfo == 'overview' ? "tab-pane fade show active" : "tab-pane fade"} id={"overview"+taskId} role="tabpanel" aria-labelledby="overview-tab">
                                        <form noValidate onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_type'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('task_type')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.task_type?.map((task:any,i:any) => {
                                                                return (
                                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                    {formik.touched.task_type && formik.errors.task_type && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.task_type}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('project')}>
                                                        <option value=''>Select</option>
                                                        {dropdowns.project?.map((taskProject:any,i:any) => {
                                                            if(taskProject.name_of_building) {
                                                            return (
                                                                <option value={taskProject.id} key={i}>{taskProject.name_of_building}</option> 
                                                        )}})}
                                                        </select>  */}
                                                        <ReactSelect
                                                        options={dropdowns.project}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.project?.find((item:any) => propertyId == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            formik.setFieldValue('project', val.id ?? '');
                                                            setPropertyId(val.id);
                                                        }}
                                                        placeholder={"Project.."}
                                                        />     
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('contact')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.contact?.map((contactsVal:any,i:any) =>{
                                                                return (
                                                                    <option value={contactsVal.id} key={i}>{contactsVal.first_name+ ' ' +contactsVal.last_name}</option> 
                                                            )})}
                                                        </select> */}
                                                        <ReactSelect
                                                        options={dropdowns.contact}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.contact?.find((item:any) => contactId == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            formik.setFieldValue('contact', val.id ?? '');
                                                            setContactId(val.id);
                                                        }}
                                                        placeholder={"contact.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'reminder'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('reminder')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.reminder?.map((contactsVal:any,i:any) =>{
                                                                return (
                                                                    <option value={contactsVal.id} key={i}>{contactsVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'priority'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('priority')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.priority?.map((task:any,i:any) =>{
                                                                return (
                                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                    {formik.touched.priority && formik.errors.priority && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.priority}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div> */}
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('task_status')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.task_status?.map((task:any,i:any) =>{
                                                                return (
                                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_dateTime">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_date'})}</label>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DateTimePicker
                                                        renderInput={(props) => <TextField {...formik.getFieldProps('task_time')} {...props} className='w-100 date_pick_height' /> }
                                                        // label="DateTimePicker"
                                                        value={taskTime}
                                                        onChange={(newValue) => {
                                                            setTaskTime(newValue);
                                                            formik.setFieldValue('task_time', newValue);
                                                        }}
                                                        />
                                                    </LocalizationProvider>
                                                    {formik.touched.task_time && formik.errors.task_time && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.task_time}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_dateTime">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'finish_time'})}</label>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DateTimePicker
                                                        renderInput={(props) => 
                                                            <TextField {...formik.getFieldProps('finish_time')} {...props} className='w-100 date_pick_height' />
                                                        } 
                                                        value={finishTime}
                                                        onChange={(newValue) => {
                                                            formik.setFieldValue('finish_time', finishTime);
                                                            setFinishTime(newValue);
                                                        }}
                                                        />
                                                    </LocalizationProvider>
                                                </div>   */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>
                                                    {/* <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
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
                                                                return <p>{intl.formatMessage({id: 'assign_to'})}</p>;
                                                                }

                                                                return name.join(', ');
                                                            }}
                                                            className='multi_select_field'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                                            </MenuItem>
                                                            {dropdowns.assign_to?.map((assignVal:any) => (
                                                                <MenuItem
                                                                key={assignVal.id}
                                                                value={assignVal.first_name+'-'+assignVal.id}
                                                                style={getStyles(assignVal.first_name, assignToName, theme)}
                                                                >
                                                                {assignVal.first_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl> */}
                                                    <div className="input-group mb-3 py-1 bs_2">
                                                        <ReactSelect
                                                        isMulti
                                                        options={dropdowns.assign_to}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.assign_to?.filter((item:any) => assignToId.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {  
                                                            setAssignToId(val);                                              
                                                        }}
                                                        placeholder={"Assign-to.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'task_description'})}</label>
                                                    <div className='input-group mb-3 bs_2'>
                                                        <textarea
                                                        className='form-control border-0 p-2 resize-none min-h-25px br_10' {...formik.getFieldProps('agenda')}
                                                        data-kt-autosize='true'
                                                        rows={8}
                                                        placeholder='Enter your Notes' />
                                                    </div>
                                                    {formik.touched.agenda && formik.errors.agenda && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.agenda}</span>
                                                        </div>
                                                    </div>
                                                    )}
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
                                            </div>
                                        </form>
                                    </div>
                                    <div className={tabInfo == 'notes' ? "tab-pane fade show active" : "tab-pane fade"} id={"notes"+taskId} role="tabpanel" aria-labelledby="notes-tab">
                                    <div className="card mb-5 mb-xl-8">
                                            <div className='card-body py-0 px-2'>
                                                <div className='main_bg px-lg-5 px-4 pt-4 pb-1 br_10'>
                                                {/* <div className='d-flex align-items-center mb-3'>
                                                    <div className='d-flex align-items-center flex-grow-1'>
                                                        <div className='d-flex flex-column'>
                                                            <h3 className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                {intl.formatMessage({id: 'add_note'})}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <form noValidate onSubmit={formikNotes.handleSubmit} className='position-relative mb-6 pb-4 border-bottom border-secondary'>
                                                    <input {...formikNotes.getFieldProps('reply')}
                                                        className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                        data-kt-autosize='true'
                                                        placeholder={intl.formatMessage({id: 'add_note'}) + '...'}
                                                    ></input>
                                                    <div className='position-absolute top-0 end-0'>                                                       
                                                        <button type='submit' disabled={formikNotes.isSubmitting} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                            <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                        </button>
                                                    </div>
                                                    {formikNotes.touched.reply && formikNotes.errors.reply && (
                                                        <div className='fv-plugins-message-container'>
                                                            <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </form>
                                                </div>
                                                <div className='notes_list card-body'>
                                                    <h4 className='mb-3'>{intl.formatMessage({id: 'notes_list'})}</h4>
                                                    <hr/>
                                                    {TaskNoteList.map((taskNote, i) => {
                                                        return (
                                                            <div className={taskNote.id == taskNote.parent_id ? 'mb-5 bg-gray-100 p-5 br_10 pb-1' : 'mb-5'} key={taskNote.id}>
                                                                {taskNote.reply1 == 'NO'
                                                                ? <div className='note_question'>
                                                                    <div className='d-flex align-items-center mb-3'>
                                                                        <div className='d-flex align-items-center flex-grow-1'>
                                                                            <div className='symbol symbol-45px me-5'>
                                                                            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={taskNote.user_id && process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+taskNote.user_id+'/'+taskNote.user_profile_image } className="" alt='' />
                                                                            </div>
                                                                            <div className='d-flex flex-column'>
                                                                            <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                                {taskNote.user_name ?? 'User'}
                                                                            </a>
                                                                            <span className='text-gray-400 fw-bold'>{Moment(taskNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mb-3 border-bottom border-secondary d-flex justify-content-between'>
                                                                            { noteEditVal != '' && parentId == taskNote.id ?
                                                                            <div className='text-gray-800 position-relative w-75'>
                                                                                <input
                                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                    data-kt-autosize='true'
                                                                                    placeholder='Reply..'
                                                                                    id={'edit_field'+taskNote.id}
                                                                                    defaultValue={noteEditVal}
                                                                                ></input>
                                                                            </div>
                                                                            : 
                                                                            <div className='text-gray-800'>
                                                                             {taskNote.reply}
                                                                            </div>
                                                                            }
                                                                            { currentUser?.designation == 1 &&
                                                                            <span>
                                                                                { noteEditVal != '' && parentId == taskNote.id ?
                                                                                <><button type='button' onClick={() => cancelEdit(taskNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                </button>
                                                                                <button type='button' onClick={() => editOnSubmit(taskNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                    </button></>:
                                                                                <button type='button' onClick={() => replyEdit(taskNote.id, taskNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                                </button>}
                                                                                <button type='button'
                                                                                data-bs-toggle='modal'
                                                                                data-bs-target={'#delete_note_popup'+taskNote.id} 
                                                                                className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                                </button>
                                                                            </span>}
                                                                            <div className='modal fade' id={'delete_note_popup'+taskNote.id} aria-hidden='true'>
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
                                                                                                <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(taskNote.id, taskNote.parent_id)}>
                                                                                                    {intl.formatMessage({id: 'yes'})}
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    </div>
                                                                </div> :
                                                                <div className='ps-10 note_answer'>
                                                                    <div className='d-flex'>        
                                                                        <div className='symbol symbol-45px me-5'>
                                                                            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={taskNote.user_id && process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+taskNote.user_id+'/'+taskNote.user_profile_image } className="" alt='' />
                                                                        </div>        
                                                                        <div className='d-flex flex-column flex-row-fluid'>
                                                                            <div className='d-flex align-items-center flex-wrap mb-1'>
                                                                                <a href='#' className='text-gray-800 text-hover-primary fw-bolder me-2'>
                                                                                {taskNote.user_name ?? 'User'}
                                                                                </a>        
                                                                                <span className='text-gray-400 fw-bold fs-7'>{Moment(taskNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                            </div> 
                                                                            <div className=' d-flex justify-content-between'>                                            
                                                                            { noteEditVal != '' && parentId == taskNote.id ?
                                                                            <div className='text-gray-800 position-relative w-75'>
                                                                                <input
                                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                    data-kt-autosize='true'
                                                                                    placeholder='Reply..'
                                                                                    id={'edit_field'+taskNote.id}
                                                                                    defaultValue={noteEditVal}
                                                                                ></input>
                                                                            </div>
                                                                            : 
                                                                            <div className='text-gray-800'>
                                                                             {taskNote.reply}
                                                                            </div>
                                                                            } 
                                                                                <span>
                                                                                { currentUser?.designation == 1 &&
                                                                            <span>
                                                                                { noteEditVal != '' && parentId == taskNote.id ?
                                                                                <><button type='button' onClick={() => cancelEdit(taskNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                </button>
                                                                                <button type='button' onClick={() => editOnSubmit(taskNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                    </button></>:
                                                                                <button type='button' onClick={() => replyEdit(taskNote.id, taskNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                                </button>}
                                                                                <button type='button'
                                                                                data-bs-toggle='modal'
                                                                                data-bs-target={'#delete_note_popup2'+taskNote.id} 
                                                                                className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                                </button>
                                                                            </span>}
                                                                                </span>
                                                                            </div>                                                               
                                                                        </div> 
                                                                        <div className='modal fade' id={'delete_note_popup2'+taskNote.id} aria-hidden='true'>
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
                                                                                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(taskNote.id, taskNote.parent_id)}>
                                                                                                {intl.formatMessage({id: 'yes'})}
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>                                                                
                                                                    </div>
                                                                </div>
                                                                }
                                                                {taskNote.reply1 == 'NO' && 
                                                                <>
                                                                <div className='position-relative mb-3'>
                                                                        <input
                                                                            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                            data-kt-autosize='true'
                                                                            placeholder='Reply..'
                                                                            id={'child_reply'+taskNote.id}
                                                                        ></input>
                                                                        
                                                                        <div className='position-absolute top-0 end-0'>                                                             
                                                                            <button type='button' onClick={() => replyOnSubmit(taskNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    {isFormError && taskNote.id == parentId && (
                                                                        <div className='fv-plugins-message-container'>
                                                                            <div className='fv-help-block'>
                                                                            <span role='alert' className='text-danger'>{intl.formatMessage({id: 'reply_need_to_fill'})}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    </>
                                                                    }                                                                    
                                                                    <div className={taskNote.id == taskNote.parent_id ? 'd-none' : 'separator mb-4'}></div>
                                                            </div>
                                                                )
                                                    })}                                                    
                                                </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'files' ? "tab-pane fade show active" : "tab-pane fade"} id={"files"+taskId} role="tabpanel" aria-labelledby="files-tab">
                                    <div {...getRootProps({className: 'dropzone'})}>
                                            <div className='myDIV'>
                                                <div className="d-flex align-items-center justify-content-center w-100 h-100 vh-25">
                                                    <span className="btn btn-file w-100 h-100">
                                                        <KTSVG
                                                        path='/media/icons/duotune/files/fil022.svg'
                                                        className='svg-icon-1 text_primary ms-2'
                                                        />
                                                        <p className='text_primary'>{intl.formatMessage({id: 'upload_files_here'})}</p>
                                                        <small className='text-dark required'>Note: jpg, jpeg, png, pdf only acceptable</small>
                                                        {/* <small className='text-dark required'>Note: Max 2 MB</small> */}
                                                        <input {...getInputProps()}/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <aside>
                                            {files?.map((file:any, index:any) => {
                                                const pieces = file.path?.split('.');
                                                const last = pieces[pieces.length - 1];
                                                return(
                                                <div style={thumb} key={file.name} className="position-relative">
                                                    <div style={thumbInner}>
                                                    { last != 'pdf' ?
                                                        <img
                                                        src={file.preview}
                                                        className='w-100 h-100 img-thumbnail rounded fit_contain'
                                                        onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                                        />: <img
                                                        src={toAbsoluteUrl('/media/svg/files/pdf.svg')}
                                                        className='w-100 h-100 img-thumbnail rounded fit_contain'
                                                        />
                                                        }
                                                        
                                                    </div>
                                                    <a onClick={() => handleClick(index)} className='icon position-absolute top-0 end-0 rounded bg-gray border-0'><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
                                                    <rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"/>
                                                    <rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"/>
                                                    </svg>
                                                    </span></a>
                                                </div>
                                            )})}
                                        </aside>
                                        <div className='p-5 text-end'>
                                            <button
                                                type='button'
                                                
                                                className='btn btn_primary text-primary'
                                                onClick={saveFiles}
                                                >
                                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'save'})}
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
                                        
                                        {filesVal.length > 0 &&
                                        <div className='main_bg p-4 mb-9 rounded'>
                                            <h3 className='px-5 py-3'>{intl.formatMessage({id: 'files'})}</h3>
                                            <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                                            {filesVal.map((file, i) => {
                                                const pieces = file.fileoriginalname.split('.');
                                                const last = pieces[pieces.length - 1];
                                                return ( 
                                                    <>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                                                        <div className="card h-100">
                                                            <div className="card-body d-flex justify-content-center text-center flex-column p-8">
                                                            <a href="#" data-bs-toggle='modal'
                                                            data-bs-target={'#delete_confirm_popup'+file.id} className="btn delete_btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>
                                                                <a href="#" className="text-gray-800 text-hover-primary d-flex flex-column">
                                                                    {last != 'pdf' ? 
                                                                    <a className={imgFullView && imgSelect == file.id ? "img_full_view" : "symbol symbol-75px"} onClick={() => imgViewChange(file.id)}>
                                                                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/svg/files/doc.svg') }} src={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+taskId+'/'+file.file} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    : 
                                                                    <a className="symbol symbol-75px" href={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+taskId+'/'+file.file} download target="_blank">
                                                                        <img src={toAbsoluteUrl("/media/svg/files/pdf.svg")} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    }                                                                    
                                                                </a>                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='modal fade' id={'delete_confirm_popup'+file.id} aria-hidden='true'>
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
                                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDeleteFile(file.id)}>
                                                                            {intl.formatMessage({id: 'yes'})}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </>
                                                    )
                                                })}
                                            </div>
                                    </div>}
                                    </div>
                                    <div className={tabInfo == 'message' ? "tab-pane fade show active" : "tab-pane fade"} id={"message"+taskId} role="tabpanel" aria-labelledby="message-tab">
                                    <ul className="nav nav-pills mb-3 message_tabs" id={"pills-tab"+taskId} role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id={"pills-mail-tab"+taskId} data-bs-toggle="pill" data-bs-target={"#pills-mail"+taskId} type="button" role="tab" aria-controls="pills-mail" aria-selected="true">{intl.formatMessage({id: 'email'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-whatsapp-tab"+taskId} data-bs-toggle="pill" data-bs-target={"#pills-whatsapp"+taskId} type="button" role="tab" aria-controls="pills-whatsapp" aria-selected="false">{intl.formatMessage({id: 'whatsapp'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-sms-tab"+taskId} data-bs-toggle="pill" data-bs-target={"#pills-sms"+taskId} type="button" role="tab" aria-controls="pills-sms" aria-selected="false">{intl.formatMessage({id: 'sms'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-calls-tab"+taskId} data-bs-toggle="pill" data-bs-target={"#pills-calls"+taskId} type="button" role="tab" aria-controls="pills-calls" aria-selected="false">{intl.formatMessage({id: 'calls'})}</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent position-relative">
                                            <div className="tab-pane fade show active" id={"pills-mail"+taskId} role="tabpanel" aria-labelledby="pills-mail-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="mail_icon"><i className="fas fa-envelope"></i></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                    <div className="w-100 d-flex flex-wrap mt-2">
                                                                        <a href="#" className="d-flex mail_format me-2 mb-1">
                                                                            <img src={toAbsoluteUrl('/media/technology-logos/Html5.png')} className="mail_format" alt='' />
                                                                            <p className="mb-0">Homeoptions.wrd</p>
                                                                        </a> 
                                                                        <a href="#" className="d-flex mail_format mb-1">
                                                                            <img src={toAbsoluteUrl('/media/technology-logos/Html5.png')} className="mail_format" alt='' />
                                                                            <p className="mb-0">Homeoptions.pdf</p>
                                                                        </a> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div data-bs-toggle='modal' data-bs-target={'#mail_template_popup'} onClick={sendMail}>                                                
                                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted rounded-circle svg-icon-4hx position-absolute bottom-0 end-0 mb-9 me-9 text_primary" />
                                                </div>
                                                <div className='modal fade' id={'mail_template_popup'} aria-hidden='true'>
                                                    <div className='modal-dialog modal-dialog-centered'>
                                                        <div className='modal-content list_height'>
                                                            <div className='modal-header rbc-today py-0'>
                                                            <div className='card-header pt-2 d-flex align-items-center justify-content-center' id='kt_chat_contacts_header'>
                                                                <h3>Mail List</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        <li className="nav-item w-100" key={item.title}>
                                                                        <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#mail_content_popup'}>
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='symbol symbol-35px symbol-circle'>
                                                                                    <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                    {item.title[0]}
                                                                                    </span>
                                                                                </div>

                                                                                <div className='ms-5'>
                                                                                    <p className='fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                    {item.title} 
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    ))
                                                                    : filtered.map((item) => (<li className="nav-item w-100" key={item.title}>
                                                                    <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#mail_content_popup'}>
                                                                        <div className='d-flex align-items-center'>
                                                                            <div className='symbol symbol-35px symbol-circle'>
                                                                                <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                {item.title[0]}
                                                                                </span>
                                                                            </div>

                                                                            <div className='ms-5'>
                                                                                <p className='p-3 fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                {item.title} 
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='modal fade shadow-lg' id={'mail_content_popup'} aria-hidden='true'>
                                                        <div className='modal-dialog modal-lg modal-dialog-centered'>
                                                            <div className='modal-content'>
                                                                <div className='modal-header rbc-today'>
                                                                    <h3>Send Mail</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Title</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="title" {...formikMail.getFieldProps('title')}/> 
                                                                                </div>
                                                                                {formikMail.touched.title && formikMail.errors.title && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.title}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Subject</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="subject" {...formikMail.getFieldProps('subject')}/> 
                                                                                </div>
                                                                                {formikMail.touched.subject && formikMail.errors.subject && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.subject}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Share with</label>
                                                                                <select className="form-select text-start bg-secondary bg-opacity-25 form-control" {...formikMail.getFieldProps('share_with')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Option 1</option>
                                                                                    <option value={2}>Option 2</option>
                                                                                </select>  
                                                                            </div> 
                                                                            {formikMail.touched.share_with && formikMail.errors.share_with && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.share_with}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                   
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Module</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Lead</option>
                                                                                    <option value={2}>Contact</option>
                                                                                    <option value={3}>Task</option>
                                                                                    <option value={4}>Project</option>
                                                                                </select>  
                                                                            </div>   
                                                                            {formikMail.touched.module_id && formikMail.errors.module_id && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.module_id}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                 
                                                                        </div>
                                                                        <div className="col">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Body</label>
                                                                                <div className="input-group">
                                                                                    <textarea style={{height: '200px'}} className="form-control" placeholder="Encryption" {...formikMail.getFieldProps('body')}/> 
                                                                                </div>
                                                                                {formikMail.touched.body && formikMail.errors.body && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.body}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>                                        
                                                                    </div>
                                                                    <div className='card-footer py-3 text-center' id='kt_task_footer'>
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>Cancel</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>Send
                                                                        </span>}
                                                                        {loading && (
                                                                            <span className='indicator-progress' style={{display: 'block'}}>
                                                                            Please wait...{' '}
                                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                                            </span>
                                                                        )}
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-whatsapp"+taskId} role="tabpanel" aria-labelledby="pills-whatsapp-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg"><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg"><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div data-bs-toggle='modal' data-bs-target={'#watsapp_template_popup'} onClick={sendWatsapp}>
                                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted rounded-circle svg-icon-4hx position-absolute bottom-0 end-0 mb-9 me-9 text_primary" />
                                                </div>
                                                <div className='modal fade' id={'watsapp_template_popup'} aria-hidden='true'>
                                                    <div className='modal-dialog modal-dialog-centered'>
                                                        <div className='modal-content list_height'>
                                                            <div className='modal-header rbc-today py-0'>
                                                            <div className='card-header pt-2 d-flex align-items-center justify-content-center' id='kt_chat_contacts_header'>
                                                                <h3>Mail List</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        <li className="nav-item w-100" key={item.title}>
                                                                        <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#watsapp_content_popup'}>
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='symbol symbol-35px symbol-circle'>
                                                                                    <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                    {item.title[0]}
                                                                                    </span>
                                                                                </div>

                                                                                <div className='ms-5'>
                                                                                    <p className='fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                    {item.title} 
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    ))
                                                                    : filtered.map((item) => (<li className="nav-item w-100" key={item.title}>
                                                                    <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#watsapp_content_popup'}>
                                                                        <div className='d-flex align-items-center'>
                                                                            <div className='symbol symbol-35px symbol-circle'>
                                                                                <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                {item.title[0]}
                                                                                </span>
                                                                            </div>

                                                                            <div className='ms-5'>
                                                                                <p className='p-3 fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                {item.title} 
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='modal fade shadow-lg' id={'watsapp_content_popup'} aria-hidden='true'>
                                                        <div className='modal-dialog modal-lg modal-dialog-centered'>
                                                            <div className='modal-content'>
                                                                <div className='modal-header rbc-today'>
                                                                    <h3>Send Mail</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Title</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="title" {...formikMail.getFieldProps('title')}/> 
                                                                                </div>
                                                                                {formikMail.touched.title && formikMail.errors.title && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.title}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Subject</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="subject" {...formikMail.getFieldProps('subject')}/> 
                                                                                </div>
                                                                                {formikMail.touched.subject && formikMail.errors.subject && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.subject}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Share with</label>
                                                                                <select className="form-select text-start bg-secondary bg-opacity-25 form-control" {...formikMail.getFieldProps('share_with')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Option 1</option>
                                                                                    <option value={2}>Option 2</option>
                                                                                </select>  
                                                                            </div> 
                                                                            {formikMail.touched.share_with && formikMail.errors.share_with && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.share_with}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                   
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Module</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Lead</option>
                                                                                    <option value={2}>Contact</option>
                                                                                    <option value={3}>Task</option>
                                                                                    <option value={4}>Project</option>
                                                                                </select>  
                                                                            </div>   
                                                                            {formikMail.touched.module_id && formikMail.errors.module_id && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.module_id}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                 
                                                                        </div>
                                                                        <div className="col">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Body</label>
                                                                                <div className="input-group">
                                                                                    <textarea style={{height: '200px'}} className="form-control" placeholder="Encryption" {...formikMail.getFieldProps('body')}/> 
                                                                                </div>
                                                                                {formikMail.touched.body && formikMail.errors.body && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.body}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>                                        
                                                                    </div>
                                                                    <div className='card-footer py-3 text-center' id='kt_task_footer'>
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>Cancel</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>Send
                                                                        </span>}
                                                                        {loading && (
                                                                            <span className='indicator-progress' style={{display: 'block'}}>
                                                                            Please wait...{' '}
                                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                                            </span>
                                                                        )}
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-sms"+taskId} role="tabpanel" aria-labelledby="pills-sms-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg bg_primary_light"><img src={toAbsoluteUrl('/media/icons/duotune/communication/com007.svg')} className="svg_icon text-primary" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>8934301210</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div data-bs-toggle='modal' data-bs-target={'#sms_template_popup'} onClick={sendSMS}>
                                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted rounded-circle svg-icon-4hx position-absolute bottom-0 end-0 mb-9 me-9 text_primary" />
                                                </div>
                                                <div className='modal fade' id={'sms_template_popup'} aria-hidden='true'>
                                                    <div className='modal-dialog modal-dialog-centered'>
                                                        <div className='modal-content list_height'>
                                                            <div className='modal-header rbc-today py-0'>
                                                            <div className='card-header pt-2 d-flex align-items-center justify-content-center' id='kt_chat_contacts_header'>
                                                                <h3>Mail List</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        <li className="nav-item w-100" key={item.title}>
                                                                        <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#sms_content_popup'}>
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className='symbol symbol-35px symbol-circle'>
                                                                                    <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                    {item.title[0]}
                                                                                    </span>
                                                                                </div>

                                                                                <div className='ms-5'>
                                                                                    <p className='fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                    {item.title} 
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    ))
                                                                    : filtered.map((item) => (<li className="nav-item w-100" key={item.title}>
                                                                    <div onClick={() => MailById(item.id)} className='btn' data-bs-toggle='modal' data-bs-target={'#sms_content_popup'}>
                                                                        <div className='d-flex align-items-center'>
                                                                            <div className='symbol symbol-35px symbol-circle'>
                                                                                <span className='symbol-label bg_soft text_primary fs-6 fw-bolder'>
                                                                                {item.title[0]}
                                                                                </span>
                                                                            </div>

                                                                            <div className='ms-5'>
                                                                                <p className='p-3 fs-5 fw-bolder text-gray-900 mb-0'>
                                                                                {item.title} 
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='modal fade shadow-lg' id={'sms_content_popup'} aria-hidden='true'>
                                                        <div className='modal-dialog modal-lg modal-dialog-centered'>
                                                            <div className='modal-content'>
                                                                <div className='modal-header rbc-today'>
                                                                    <h3>Send Mail</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Title</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="title" {...formikMail.getFieldProps('title')}/> 
                                                                                </div>
                                                                                {formikMail.touched.title && formikMail.errors.title && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.title}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Subject</label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" placeholder="subject" {...formikMail.getFieldProps('subject')}/> 
                                                                                </div>
                                                                                {formikMail.touched.subject && formikMail.errors.subject && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.subject}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Share with</label>
                                                                                <select className="form-select text-start bg-secondary bg-opacity-25 form-control" {...formikMail.getFieldProps('share_with')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Option 1</option>
                                                                                    <option value={2}>Option 2</option>
                                                                                </select>  
                                                                            </div> 
                                                                            {formikMail.touched.share_with && formikMail.errors.share_with && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.share_with}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                   
                                                                        </div>
                                                                        <div className="col-xl-6">                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Module</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>Lead</option>
                                                                                    <option value={2}>Contact</option>
                                                                                    <option value={3}>Task</option>
                                                                                    <option value={4}>Project</option>
                                                                                </select>  
                                                                            </div>   
                                                                            {formikMail.touched.module_id && formikMail.errors.module_id && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.module_id}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}                                                 
                                                                        </div>
                                                                        <div className="col">                                        
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">Body</label>
                                                                                <div className="input-group">
                                                                                    <textarea style={{height: '200px'}} className="form-control" placeholder="Encryption" {...formikMail.getFieldProps('body')}/> 
                                                                                </div>
                                                                                {formikMail.touched.body && formikMail.errors.body && (
                                                                            <div className='fv-plugins-message-container'>
                                                                                <div className='fv-help-block'>
                                                                                    <span role='alert' className='text-danger'>{formikMail.errors.body}</span>
                                                                                </div>
                                                                            </div>
                                                                            )}
                                                                            </div>
                                                                        </div>                                        
                                                                    </div>
                                                                    <div className='card-footer py-3 text-center' id='kt_task_footer'>
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>Cancel</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>Send
                                                                        </span>}
                                                                        {loading && (
                                                                            <span className='indicator-progress' style={{display: 'block'}}>
                                                                            Please wait...{' '}
                                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                                            </span>
                                                                        )}
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-calls"+taskId} role="tabpanel" aria-labelledby="pills-calls-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg bg_warning_light"><img src={toAbsoluteUrl('/media/icons/duotune/communication/com005.svg')} className="svg_icon text-danger" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>8934301210</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={sendCall}>
                                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted rounded-circle svg-icon-4hx position-absolute bottom-0 end-0 mb-9 me-9 text_primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id={"contact"+taskId} role="tabpanel" aria-labelledby="contact-tab">
                                        <div className='mb-9' style={{ height: 400, width: '100%',}}>
                                        <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                            <DataGrid
                                                rows={Contactrows}
                                                columns={Contactcolumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id={"lead"+taskId} role="tabpanel" aria-labelledby="lead-tab">
                                        <div className='mb-9' style={{ height: 400, width: '100%',}}>
                                        <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                            <DataGrid
                                                rows={activeTimeline}
                                                columns={leadcolumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id={"duplicate"+taskId} role="tabpanel" aria-labelledby="duplicate-tab">
                                    <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                    </div>
                                    <div className="tab-pane fade" id={"tasks"+taskId} role="tabpanel" aria-labelledby="tasks-tab">
                                    <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                    </div>
                                    <div className={tabInfo == 'timeline' ? "tab-pane fade show active" : "tab-pane fade"} id={"timeline"+taskId} role="tabpanel" aria-labelledby="timeline-tab">
                                    <div className='mb-9' style={{ height: 400, width: '100%',}}>   
                                    {activeTimeline.length > 0
                                            ?
                                            <DataGrid
                                                rows={activeTimeline}
                                                columns={logContactcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_activity_timelines_available'})}</p>
                                            </div>
                                            }</div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>:
            <div className="card bg_primary">
                <div className="card-body d-flex justify-content-between">
                    <div>
                        <h5 className='text-white'>{intl.formatMessage({id: 'task_details'})}</h5>
                    </div>
                    <button onClick={minimaximize} className="mx-3 btn p-0">
                        <i className="fas fa-window-maximize text-white"></i>
                    </button>
                    <button type='button' id='kt_expand_close' data-bs-dismiss="offcanvas" onClick={closeDialogue} className="mx-3 btn p-0">
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>
            </div>
            }
        </div>
    )

}
export {TaskDetails}