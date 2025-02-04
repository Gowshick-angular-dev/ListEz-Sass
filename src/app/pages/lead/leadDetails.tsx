import React,{FC, useState, useEffect} from 'react'
import {getLeadDetail, updateLead, updateLeadReq, saveLeadNotes, getLeadNotes, uploadMultipleFileLead, getAutoMatches, 
     getMultiImage, deleteMultipleImagesLeads, deleteLeadNotes, updateLeadNotes, getLeadDropdowns, getLog, getLeadDuplicates, getLeadTasks} from './core/_requests';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Toast, Offcanvas } from 'bootstrap';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useDropzone } from 'react-dropzone'
import Moment from 'moment';
import {useIntl} from 'react-intl';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import { getContsctTasks, getLocalityByPIN } from '../contact/core/_requests';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { LeadOptions } from './leadOptions';

const initialValues = {
    contact_id: '',
    lead_source: '',
    lead_priority: '',
    lead_group: '',
    segment: '',
    status: '',
    sales_manager: '',
    project_facing: '',
    assign_to: '',
    possession_status: '',
    age_of_property: '',
    vasthu_compliant:'',
    furnishing: '',
    looking_for: '',
    property_type: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    locality: '',
    fee_oppurtunity: '',
    property_id: '',
    requirement_location: '',
    budget_min: '',
    budget_max: '',
    budget_min_ut: '',
    budget_max_ut: '',
    lead_unit_type: '',
    no_of_bedrooms_min: '',
    no_of_bedrooms_max: '',
    no_of_bathrooms_min: '',
    no_of_bathrooms_max: '',
    built_up_area_min: '',
    built_up_area_max: '',
    built_up_area_min_ut: '',
    built_up_area_max_ut: '',
    plot_area_min: '',
    plot_area_max: '',   
    plot_area_min_ut: '',
    plot_area_max_ut: '',   
    car_park_min:'',
    car_park_max:'',
    timeline_for_closure_min:'',
    timeline_for_closure_max:'',
    timeline_for_closure_min_ut:'',
    timeline_for_closure_max_ut:'',
    amenities: '',
    reply:'',
    title: "",
    subject: "",
    share_with: "",
    module_id: "",
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

const thumbsContainer = {
    display: 'flex',
    marginTop: 16
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


const secContactColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'first_name', headerName: 'Name', width: 130,headerClassName: 'dg_header' },
    { field: 'company_name', headerName: 'Company', width: 130,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Mail', type: 'number', width: 130,headerClassName: 'dg_header'},
    { field: 'mobile', headerName: 'Phone', width: 130,headerClassName: 'dg_header' },
    { field: 'remarks', headerName: 'Remarks', width: 130,headerClassName: 'dg_header' },
  ];

  const duplicatecolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'first_name', headerName: 'Name', width: 130,headerClassName: 'dg_header' },
    { field: 'company_name', headerName: 'Company', width: 130,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Mail', type: 'number', width: 130,headerClassName: 'dg_header'},
    { field: 'mobile', headerName: 'Phone', width: 130,headerClassName: 'dg_header' },
    { field: 'remarks', headerName: 'Remarks', width: 130,headerClassName: 'dg_header' },
  ];

  const autoMatchColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'developer_name', headerName: 'Developer Name', width: 200,headerClassName: 'dg_header' },
    { field: 'property_name', headerName: 'Project Name', width: 200,headerClassName: 'dg_header' },
    { field: 'locality', headerName: 'Location', width: 200,headerClassName: 'dg_header'},
    { field: 'property_type_name', headerName: 'Project Type', width: 200,headerClassName: 'dg_header' },
    { field: 'unit_type', headerName: 'Configuration', width: 200,headerClassName: 'dg_header' },
    { field: 'price_min', headerName: 'Budget', width: 200,headerClassName: 'dg_header', renderCell: (row) => (row.row?.price_min ? row.row?.price_min : 0)+' '+'-'+' '+(row.row.price_max ? row.row?.price_max : 0)  },
    { field: 'project_stage_name', headerName: 'Possession Status', width: 200,headerClassName: 'dg_header' },
    { field: 'property_status_name', headerName: 'Project Status', width: 200,headerClassName: 'dg_header' },
    { field: '', headerName: 'Actions', width: 200,headerClassName: 'dg_header' },
  ];

const logContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100,headerClassName: 'dg_header' },
    { field: 'user_name', headerName: 'User Name', width: 250,headerClassName: 'dg_header', renderCell: (row) => row.row.user_name?.first_name+' '+row.row.user_name?.last_name },
    { field: 'module_name', headerName: 'Module Name', width: 300,headerClassName: 'dg_header', renderCell: (row) => row.value == 1 ? 'Contact' : row.value == 2 ? 'Lead' : row.value == 3 ? 'Project' : row.value == 4 ? 'Task' : 'Transaction' },
    { field: 'note', headerName: 'Note', width: 600,headerClassName: 'dg_header' },
    { field: 'createdAt', headerName: 'Created At', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
];

const logContactTaskcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'task_type_name', headerName: 'Task Type', width: 120,headerClassName: 'dg_header' },
    { field: 'priority_name', headerName: 'priority', width: 150,headerClassName: 'dg_header' },
    { field: 'task_time', headerName: 'Task Time', width: 150,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
    { field: 'property_name', headerName: 'Project', width: 150,headerClassName: 'dg_header' },
    { field: 'contact_name', headerName: 'Contact', width: 150,headerClassName: 'dg_header' },
    { field: 'assign_to_name', headerName: 'Assign To', width: 250,headerClassName: 'dg_header' },
    { field: 'task_status_name', headerName: 'Task Status', width: 150,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Contact Email', width: 200,headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Contact Mobile', width: 200,headerClassName: 'dg_header' },
    { field: 'agenda', headerName: 'Task Note', width: 350,headerClassName: 'dg_header' },
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
            <option selected>Status</option>
            <option value="1">Pending</option>
            <option value="2">Completed</option>
        </select>
      ),
    }
  ];

type Props = {
    leadId?: any,
    setLeadList?: any,
    tabInfo?: any,
    body?: any,
    setDetailClicked?: any
}

const LeadDetails: FC<Props> = (props) => {
    const intl = useIntl();
    const {
        leadId, setLeadList, tabInfo, setDetailClicked, body
      } = props

    const leadUpdateSchema = Yup.object().shape({
        contact_id: Yup.string()
            .required('Contact name is required'),
        looking_for: Yup.string(),
        property_type: Yup.string(),
        city: Yup.string(),
        lead_source: Yup.string(),
        lead_priority: Yup.string(),
        sales_manager: Yup.string(),
        lead_group: Yup.string(),
        segment: Yup.string(),
        fee_oppurtunity: Yup.string().matches(/^[0-9]+(?:[\.,][0-9]+)*$/, "Enter a valid number"),
        property_id: Yup.string(),
        status: Yup.string(),
        assign_to: Yup.array(),
    })
    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Enter a note first...'),        
      })
    const leadUpdateSchema2 = Yup.object().shape({
        requirement_location: Yup.string(),
        budget_min: Yup.string(),
        budget_max: Yup.string(),
        project_facing: Yup.string(),
        no_of_bedrooms_min: Yup.string(),
        no_of_bedrooms_max: Yup.string(),
        no_of_bathrooms_min: Yup.string(),
        no_of_bathrooms_max: Yup.string(),
        built_up_area_min: Yup.string(),
        built_up_area_max: Yup.string(),
        plot_area_min: Yup.string(),
        plot_area_max: Yup.string(),
        age_of_property: Yup.string(),
        vasthu_compliant: Yup.string(),
        car_park_min: Yup.string(),
        car_park_max: Yup.string(),
        timeline_for_closure_min: Yup.string(),
        timeline_for_closure_max: Yup.string(),
    })

    const theme = useTheme(); 

    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [leadDetail, setLeadDetail] = useState<{[key: string]: any}>({});
    const [logList, setLogList] = useState<any[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [aminityName, setAminityName] = React.useState<string[]>([]);
    const [aminityId, setAminityId] = React.useState<string[]>([]);
    const [assignToName, setAssignToName] = React.useState<string[]>([]);
    const [assignToId, setAssignToId] = React.useState<string[]>([]);
    const [furnishName, setFurnishName] = React.useState<string[]>([]);
    const [furnishId, setFurnishId] = React.useState<string[]>([]);
    const [posessionName, setPosName] = React.useState<string[]>([]);
    const [posId, setPosId] = React.useState<string[]>([]);
    const [LeadNoteList, setLeadNoteList] = useState<any[]>([]);
    const [filesVal, setFilesVal] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [taskLead, setTaskLead] = useState<any[]>([]);
    const [duplicateLead, setDuplicateLead] = useState<any[]>([]);
    const [secondaryContactLead, setSecondaryContactLead] = useState<any[]>([]);
    const {currentUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormError, setIsFormError] = useState(false);    
    const [parentId, setParentId] = useState<String>('');
    const [isFilesError, setIsFilesError] = useState(false);
    const [imgFullView, setImgFullView] = useState(false);
    const [imgSelect, setImgSelect] = useState('');
    const [noteEditVal, setNoteEditVal] = useState<any>('');
    const [propertyId, setPropertyId] = useState<any>('');
    const [localityID, setLocalityID] = useState('')
    const [requirementLocationName, setRequirementLocationName] = useState<any[]>([]);
    const [requirementLocationId, setRequirementLocationId] = useState<any[]>([]);
    const [localityList, setLocalityList] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState<any>({});
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [leadDuplicates, setLeadDuplicates] = useState<any[]>([]);


    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png','.pdf'],
        },
        onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        // setFormFiles(acceptedFiles);
   
        var test: any[] = [];
        acceptedFiles.map(file => {
            let data = {
                "lastModified": file.lastModified,
                "name": file.name,
                "size": file.size,
                "type": file.type,
            }            
            test.push(data);
            // setFilesData(data);
        });
        },
        // maxSize: 2097152,
    }); 
    
    const leadTasksList = async (id:any) => {
        const response = await getLeadTasks(id)
        setTaskLead(response.output);
    }

    const leadDuplicatesList = async (id:any, prop:any) => {
        const response = await getLeadDuplicates(id, prop)
        setLeadDuplicates(response.output);
    }
    
    const saveFiles = async () => {
        if(files.length > 0){
            // setLoading(true);
            setIsFilesError(false);
            try {
                var formData = new FormData();
                formData.append('module_name', '2');
                for (var i = 0; i < files.length; i++) {
                    formData.append('uploadfiles', files[i]);
                }
                               
                const saveContactFiles = await uploadMultipleFileLead(leadId, formData)
        
                if(saveContactFiles.status == 200) {
                  setLoading(false);
                  setFilesVal(saveContactFiles.output);
                  setFiles([]);
                  if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                    document.getElementById('leadReloadFilter')?.click();
                    } else {
                        document.getElementById('leadReload')?.click();
                    }
                  var toastEl = document.getElementById('myToastUpdate');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                }        
              } catch (error) {
                console.error(error)
                setLoading(false)
              }   
        }    
        else {
            setIsFilesError(true);
        }
    }

    const replyDelete = async (id:any, parentId:any) => {
        const deleteNotes = await deleteLeadNotes(id, parentId, leadId);
        if(deleteNotes != null){
            leadNoteList();
            if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                document.getElementById('leadReloadFilter')?.click();
            } else {
                document.getElementById('leadReload')?.click();
            }
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const replyEdit = async (id:any, val:any) => {
        setParentId(id);       
        setNoteEditVal(val);    
    }

    const cancelEdit = async (id:any) => {
        setParentId('');
    }

    const editOnSubmit = async (id:any) => {
        setParentId(id);
        // setLoading(true);
        let editVal = (document.getElementById('edit_field'+id) as HTMLInputElement)!.value;
    
        if(editVal != ''){
            setIsFormError(false);
            try {              
                var notesBody = {
                    "reply": editVal,
                    "module_id": leadId,
                    "module_name": 2,
                };
                               
                const editNotesData = await updateLeadNotes(id, notesBody)
        
                if(editNotesData != null){
                  setLoading(false);
                  (document.getElementById('edit_field'+id) as HTMLInputElement).value = '';
                  setNoteEditVal('');
                  if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                    document.getElementById('leadReloadFilter')?.click();
                } else {
                    document.getElementById('leadReload')?.click();
                }
                  var toastEl = document.getElementById('myToastUpdate');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                  leadNoteList();
                }        
              } catch (error) {
                console.error(error)
                setLoading(false)
              }   
        }    
        else {
            setIsFormError(true);
        }    
    }

    const FetchLeadDetails =  async (leadId : number) => {
        setIsLoading(true);
        const response = await getLeadDropdowns();
        setDropdowns(response.output);
        setState(response.output?.state);
        setCity(response.output?.city);
        const fetchDetails = await getLeadDetail(leadId)
        setLeadDetail(fetchDetails.output[0]);

        formik.setFieldValue('contact_id', fetchDetails.output[0]?.contact_id ?? '');
        formik.setFieldValue('looking_for', fetchDetails.output[0]?.looking_for ?? '');
        formik.setFieldValue('property_type', fetchDetails.output[0]?.property_type ?? '');
        // formik.setFieldValue('city', fetchDetails.output[0]?.city ?? '');
        formik.setFieldValue('lead_source', fetchDetails.output[0]?.lead_source ?? '');
        formik.setFieldValue('lead_priority', fetchDetails.output[0]?.lead_priority ?? '');
        formik.setFieldValue('sales_manager', fetchDetails.output[0]?.sales_manager ?? '');
        formik.setFieldValue('lead_group', fetchDetails.output[0]?.lead_group ?? '');
        formik.setFieldValue('segment', fetchDetails.output[0]?.segment ?? '');
        formik.setFieldValue('status', fetchDetails.output[0]?.lead_status ?? '');
        formik.setFieldValue('fee_oppurtunity', fetchDetails.output[0]?.fee_oppurtunity ?? '');
        formik.setFieldValue('property_id', fetchDetails.output[0]?.property_id ?? '');
        formik.setFieldValue('locality', fetchDetails.output[0]?.locality ?? '');
        setPropertyId(fetchDetails.output[0]?.property_id ?? '');
        setLocalityID(fetchDetails.output[0]?.locality ?? '');
        setAssignToId(response.output?.assign_to?.filter((item:any) => fetchDetails.output[0].assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));

        if(fetchDetails.output[0]?.zipcode?.length == 6) {
            const response = await getLocalityByPIN(fetchDetails.output[0]?.zipcode)
            setLocalityList(response.output)
        }
        
        leadDuplicatesList(leadId, fetchDetails.output[0]?.property_id);
        leadTasksList(fetchDetails.output[0]?.contact_id);

        // let states = dropdowns?.state?.filter((state:any) => state.country_id?.toString() == fetchDetails.output[0]?.country?.toString());
        // setState(states);

        // let cities = dropdowns?.city?.filter((city:any) => city.state_id?.toString() == fetchDetails.output[0]?.state?.toString());
        // setCity(cities);
        console.log('fetchDetails.output[0]?.budget_min_ut', fetchDetails.output[0]?.budget_min_ut);
        console.log('fetchDetails.output[0]?.budget_max_ut', fetchDetails.output[0]?.budget_max_ut);

        formik2.setFieldValue('budget_min', fetchDetails.output[0]?.budget_min_ut == '1' ? (parseFloat(fetchDetails.output[0]?.budget_min) / 10000000).toString() : fetchDetails.output[0]?.budget_min_ut == '2' ? (parseFloat(fetchDetails.output[0]?.budget_min) / 100000).toString() : fetchDetails.output[0]?.budget_min_ut == '3' ? (parseFloat(fetchDetails.output[0]?.budget_min) / 1000).toString() : (parseFloat(fetchDetails.output[0]?.budget_min) / 10000000).toString());

        formik2.setFieldValue('budget_max', fetchDetails.output[0]?.budget_max_ut == '1' ? (parseFloat(fetchDetails.output[0]?.budget_max) / 10000000).toString() : fetchDetails.output[0]?.budget_max_ut == '2' ? (parseFloat(fetchDetails.output[0]?.budget_max) / 100000).toString() : fetchDetails.output[0]?.budget_max_ut == '3' ? (parseFloat(fetchDetails.output[0]?.budget_max) / 1000).toString() : (parseFloat(fetchDetails.output[0]?.budget_max) / 10000000).toString());

        // formik2.setFieldValue('budget_min', fetchDetails.output[0]?.budget_min ?? '');
        // formik2.setFieldValue('budget_max', fetchDetails.output[0]?.budget_max ?? '');

        formik2.setFieldValue('budget_min_ut', fetchDetails.output[0]?.budget_min_ut ?? '');
        formik2.setFieldValue('budget_max_ut', fetchDetails.output[0]?.budget_max_ut ?? '');
        formik2.setFieldValue('city', fetchDetails.output[0]?.city ?? '');
        formik2.setFieldValue('state', fetchDetails.output[0]?.state ?? '');
        formik2.setFieldValue('country', fetchDetails.output[0]?.country ?? '');
        formik2.setFieldValue('zipcode', fetchDetails.output[0]?.zipcode ?? '');
        formik2.setFieldValue('locality', fetchDetails.output[0]?.locality ?? '');
        formik2.setFieldValue('project_facing', fetchDetails.output[0]?.property_facing ?? '');
        formik2.setFieldValue('lead_unit_type', fetchDetails.output[0]?.lead_unit_type ?? '');
        formik2.setFieldValue('no_of_bedrooms_min', fetchDetails.output[0]?.no_of_bedrooms_min ?? '');
        formik2.setFieldValue('no_of_bedrooms_max', fetchDetails.output[0]?.no_of_bedrooms_max ?? '');
        formik2.setFieldValue('no_of_bathrooms_min', fetchDetails.output[0]?.no_of_bathrooms_min ?? '');
        formik2.setFieldValue('no_of_bathrooms_max', fetchDetails.output[0]?.no_of_bathrooms_max ?? '');
        formik2.setFieldValue('built_up_area_min', fetchDetails.output[0]?.built_up_area_min ?? '');
        formik2.setFieldValue('built_up_area_max', fetchDetails.output[0]?.built_up_area_max ?? '');
        formik2.setFieldValue('built_up_area_min_ut', fetchDetails.output[0]?.built_up_area_min_ut ?? '');
        formik2.setFieldValue('built_up_area_max_ut', fetchDetails.output[0]?.built_up_area_max_ut ?? '');
        formik2.setFieldValue('plot_area_min', fetchDetails.output[0]?.plot_area_min ?? '');
        formik2.setFieldValue('plot_area_max', fetchDetails.output[0]?.plot_area_max ?? '');
        formik2.setFieldValue('plot_area_min_ut', fetchDetails.output[0]?.plot_area_min_ut ?? '');
        formik2.setFieldValue('plot_area_max_ut', fetchDetails.output[0]?.plot_area_max_ut ?? '');
        formik2.setFieldValue('age_of_property', fetchDetails.output[0]?.age_of_property ?? '');
        formik2.setFieldValue('vasthu_compliant', fetchDetails.output[0]?.vasthu_compliant ?? '');
        formik2.setFieldValue('car_park_min', fetchDetails.output[0]?.car_park_min ?? '');
        formik2.setFieldValue('car_park_max', fetchDetails.output[0]?.car_park_max ?? '');
        formik2.setFieldValue('timeline_for_closure_min', fetchDetails.output[0]?.timeline_for_closure_min ?? '');
        formik2.setFieldValue('timeline_for_closure_max', fetchDetails.output[0]?.timeline_for_closure_max ?? '');
        formik2.setFieldValue('timeline_for_closure_min_ut', fetchDetails.output[0]?.timeline_for_closure_min_ut ?? '');
        formik2.setFieldValue('timeline_for_closure_max_ut', fetchDetails.output[0]?.timeline_for_closure_max_ut ?? '');

        // var assignArray = [];
        // var assignNameArray = [];
        // if(fetchDetails.output[0]?.assign_to != null) {
        //     assignArray = fetchDetails.output[0]?.assign_to.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(fetchDetails.output[0]?.assign_to_name != null) {
        //     assignNameArray = fetchDetails.output[0]?.assign_to_name.split(",").map((e:any) => {
        //         return e;
        //     });
        // }

        // setAssignToId(assignArray);
        // setAssignToName(assignNameArray);

        // var requirement_locationarray = [];
        // var requirement_location_namearray = [];
        // if(fetchDetails.requirement_location != null){
        //     requirement_locationarray = fetchDetails.requirement_location.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(fetchDetails.requirement_location_name != null){
        //     requirement_location_namearray = fetchDetails.requirement_location_name.split(",").map((e:any) => {
        //         return e;
        //     });
        // }

        // setRequirementLocationId(requirement_locationarray);
        // setRequirementLocationName(requirement_location_namearray);
        
        var amenityArray = [];
        var amenityNameArray = [];
        if(fetchDetails.output[0]?.amenities != null){
            amenityArray = fetchDetails.output[0]?.amenities.split(",").map((e:any) => {
                return e;
            });
        }
        if(fetchDetails.output[0]?.amenities_name != null) {
            amenityNameArray = fetchDetails.output[0]?.amenities_name.split(",").map((e:any) => {
                return e;
            });
        }

        // formik2.setFieldValue('amenities', amenityArray ?? '');
        setAminityId(amenityArray);
        setAminityName(amenityNameArray);


        var furnishingArray = [];
        var furnishingNameArray = [];
        if(fetchDetails.output[0]?.furnishing != null){
            furnishingArray = fetchDetails.output[0]?.furnishing.split(",").map((e:any) => {
                return e;
            });
        }
        if(fetchDetails.output[0]?.furnishing_name != null){
            furnishingNameArray = fetchDetails.output[0]?.furnishing_name.split(",").map((e:any) => {
                return e;
            });
        }

        // formik2.setFieldValue('furnishing', furnishingArray ?? '');
        setFurnishId(furnishingArray);
        setFurnishName(furnishingNameArray);

        
        var posessionArray = [];
        var posessionNameArray = [];
        if(fetchDetails.output[0]?.possession_status != null) {
            posessionArray = fetchDetails.output[0]?.possession_status.split(",").map((e:any) => {
                return e;
            });
        }
        if(fetchDetails.output[0]?.possession_status_name != null){
            posessionNameArray = fetchDetails.output[0]?.possession_status_name.split(",").map((e:any) => {
                return e;
            });
        }

        // formik2.setFieldValue('possession_status', posessionArray ?? '');
        setPosId(posessionArray);
        setPosName(posessionNameArray);
        setIsLoading(false);
        
    } 

    const leadFilesList =  async () => {   
        const contactFileResponse = await getMultiImage(leadId)
        setFilesVal(contactFileResponse.output);
    } 

    const minimaximize = () => {
        setIsExpand(current => !current);
    }
    
    const fullScreenChange = () => {
        setIsFullScreen(current => !current);
    }

    const imgViewChange = (id:any) => {
        setImgFullView(!imgFullView)
        setImgSelect(id)
    }

    const onDeleteFile = async (id:any) => {
        const deleteRes = await deleteMultipleImagesLeads(id, leadId);
        if(deleteRes.status == 200){
            setFilesVal(deleteRes.output);
            if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                document.getElementById('leadReloadFilter')?.click();
            } else {
                document.getElementById('leadReload')?.click();
            }
            var toastEl = document.getElementById('leadFilesDeleteStatus');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const handleChange = (event: SelectChangeEvent<typeof aminityName>) => {
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
    
        setAminityId(id);
        setAminityName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

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

    const furnishingChange = (event: SelectChangeEvent<typeof furnishName>) => {
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
    
        setFurnishId(id);
        setFurnishName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const locationHandleChange = (event: SelectChangeEvent<typeof requirementLocationName>) => {
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
    
        setRequirementLocationId(id);    
        setRequirementLocationName(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const possessionChange = (event: SelectChangeEvent<typeof posessionName>) => {
        const {
            target: { value },
        } = event;
        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++) {
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setPosId(id);
        setPosName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const leadNoteList =  async () => {   
        const leadNoteResponse = await getLeadNotes(leadId);
        setLeadNoteList(leadNoteResponse.output);
    }

    const fetchLog = async (leadId : number) => {
        const fetchLogList = await getLog(leadId);
        setLogList(fetchLogList.output);
    }

    const matchesList = async (iid : number) => {
        const fetchList = await getAutoMatches(leadId);
        setMatches(fetchList.output);
    }

    const formik = useFormik({
        initialValues,
        validationSchema: leadUpdateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
        try {
        var userId = currentUser?.id;
        const reqbody = {
            "contact_id": values.contact_id,
            "looking_for": values.looking_for,
            "property_type": values.property_type,
            "sales_manager": values.sales_manager,           
            "lead_source": values.lead_source,
            "lead_priority": values.lead_priority,
            "lead_group": values.lead_group,
            "segment": values.segment,
            "fee_oppurtunity": values.fee_oppurtunity.replace(/,/g, ""),
            "property_id": values.property_id,
            "status": values.status,
            "assign_to": assignToId.length > 0 ? assignToId?.map((item:any) => item.id)?.join(',').toString() : userId,
        }

        const updateLeadData = await updateLead(leadId ,reqbody);

        if(updateLeadData.status == 200){
            setLoading(false);
            setDetailClicked(false);
            if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                document.getElementById('leadReloadFilter')?.click();
            } else {
                document.getElementById('leadReload')?.click();
            }
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();           
        }

        } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('errMsgToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
          try {
    
            var userId = currentUser?.id;

            var notesBody = {
                "reply": values.reply,
                "module_id": leadId,
                "module_name": 2,
                "parent_id": 0
            };
                           
            const leadNotesData = await saveLeadNotes(notesBody)
    
            if(leadNotesData.status == 200){
                setLoading(false);
                if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                document.getElementById('leadReloadFilter')?.click();
                } else {
                    document.getElementById('leadReload')?.click();
                }
                resetForm();
                //   const leadNoteResponse = await getLeadNotes(leadId);
                setLeadNoteList(leadNotesData.output);    
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
      })

    const formik2 = useFormik({
        initialValues,
        validationSchema: leadUpdateSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
        try {
        const reqbody = {
            "city": values.city,
            "state": values.state,
            "country": values.country,
            "zipcode": values.zipcode,
            "locality": values.locality,
            // "budget_min": values.budget_min,
            // "budget_max": values.budget_max,

            "budget_min": values.budget_min_ut == '1' ? (parseFloat(values.budget_min) * 10000000).toString() : values.budget_min_ut == '2' ? (parseFloat(values.budget_min) * 100000).toString() : values.budget_min_ut == '3' ? (parseFloat(values.budget_min) * 1000).toString() : (parseFloat(values.budget_min) * 10000000).toString(),
            "budget_max": values.budget_max_ut == '1' ? (parseFloat(values.budget_max) * 10000000).toString() : values.budget_max_ut == '2' ? (parseFloat(values.budget_max) * 100000).toString() : values.budget_max_ut == '3' ? (parseFloat(values.budget_max) * 1000).toString() : (parseFloat(values.budget_max) * 10000000).toString(),

            "budget_min_ut": values.budget_min_ut,
            "budget_max_ut": values.budget_max_ut,
            "lead_unit_type": values.lead_unit_type,
            "no_of_bedrooms_min": values.no_of_bedrooms_min,
            "no_of_bedrooms_max": values.no_of_bedrooms_max,
            "no_of_bathrooms_min": values.no_of_bathrooms_min,
            "no_of_bathrooms_max": values.no_of_bathrooms_max,
            "built_up_area_min": values.built_up_area_min,
            "built_up_area_max": values.built_up_area_max,
            "built_up_area_min_ut": values.built_up_area_min_ut,
            "built_up_area_max_ut": values.built_up_area_max_ut,
            "plot_area_min": values.plot_area_min,
            "plot_area_max": values.plot_area_max,
            "plot_area_min_ut": values.plot_area_min_ut,
            "plot_area_max_ut": values.plot_area_max_ut,
            "property_facing": values.project_facing,
            "possession_status": posId.join(',').toString(),
            "age_of_property": values.age_of_property,
            "vasthu_compliant": values.vasthu_compliant,
            "furnishing": furnishId.join(',').toString(),
            "car_park_min": values.car_park_min,
            "car_park_max": values.car_park_max,
            "timeline_for_closure_min": values.timeline_for_closure_min,
            "timeline_for_closure_max": values.timeline_for_closure_max,
            "timeline_for_closure_min_ut": values.timeline_for_closure_min_ut,
            "timeline_for_closure_max_ut": values.timeline_for_closure_max_ut,
            "amenities": aminityId.join(',').toString(),
        }
console.log('reqbodyreqbodyreqbody', reqbody);

        const updateLeadData = await updateLeadReq(leadId, reqbody);

        if(updateLeadData != null){
            setLoading(false);
            setDetailClicked(false);
            if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                document.getElementById('leadReloadFilter')?.click();
            } else {
                document.getElementById('leadReload')?.click();
            }
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }

        } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('errMsgToast');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

    const closeDialogue = () => {
        setDetailClicked(false);
        var offCanvasEl = document.getElementById('kt_expand'+leadId);
        offCanvasEl?.classList.add('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.hide();
    }

    const replyOnSubmit = async (id:any) => {
        setParentId(id);
        let replyVal = (document.getElementById('child_reply'+id) as HTMLInputElement)!.value;
    
        if(replyVal != ''){
            setIsFormError(false);
            try {
                var userId = currentUser?.id;
                var notesBody = {
                    "reply": replyVal,
                    "module_id": leadId,
                    "module_name": 2,
                    "parent_id": id
                };
                               
                const saveContactNotesData = await saveLeadNotes(notesBody)
        
                if(saveContactNotesData.status == 200){
                  setLoading(false);
                  if(body.looking_for || body.lead_source || body.lead_group || body.fee_oppurtunity || body.status || body.assign_to || body.budget_min || body.budget_max || body.no_of_bedrooms_min || body.no_of_bedrooms_max || body.no_of_bathrooms_min || body.no_of_bathrooms_max || body.built_up_area_min || body.built_up_area_max || body.plot_area_min || body.plot_area_max || body.possession_status || body.age_of_property || body.vasthu_compliant || body.property || body.priority || body.property_type || body.furnishing || body.car_park_min || body.car_park_max || body.timeline_for_closure_min || body.timeline_for_closure_max || body.amenities || body.created_date || body.created_by) {
                    document.getElementById('leadReloadFilter')?.click();
                } else {
                    document.getElementById('leadReload')?.click();
                }
                  (document.getElementById('child_reply'+id) as HTMLInputElement).value = ''
                  var toastEl = document.getElementById('myToastUpdate');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                //   const notesResponse = await getLeadNotes(leadId)
                  setLeadNoteList(saveContactNotesData.output);
                }
        
              } catch (error) {
                console.error(error)
                setLoading(false)
              }   
        }
    
        else {
            setIsFormError(true);
        }
    
    }
    
    const handleClick = (index:any) => {
        setFiles([
            ...files.slice(0, index),
            ...files.slice(index + 1, files.length)
          ]);
    }
  
    const thumbs = files.map((file:any, index:any) => {
        const pieces = file.path.split('.');
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
    )});

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
        //   setLoading(true)
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
        // setSelectedId(id);
        // const TemplatesMailResponse = await getTemplateMail(id)
        // setTemplatesMail(TemplatesMailResponse);
        // setDataBinded(true);
        // formik.setFieldValue('title', TemplatesMailResponse.title ?? '');
        // formik.setFieldValue('subject', TemplatesMailResponse.subject ?? '');
        // formik.setFieldValue('share_with', TemplatesMailResponse.share_with ?? '');
        // formik.setFieldValue('module_id', TemplatesMailResponse.module_id ?? '');
        // formik.setFieldValue('body', TemplatesMailResponse.body ?? '');
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
    }, [search]);

    useEffect(() => {
        if(leadId) {
        leadFilesList();
        leadNoteList();
        FetchLeadDetails(leadId);
        fetchLog(leadId);
        matchesList(leadId);
        }
    }, [leadId]);

    return(
        <div className={isExpand ? isFullScreen ? "w-100 contact_details_page full_screen" : "w-75 contact_details_page full_screen m-5": "contact_details_page small_screen d-flex align-items-end justify-content-end m-5"}>
            {
            isLoading ? 
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
                                    var element = document.getElementById("nrewwicrgoiergviugbeguecgr"+leadId);
                                        var headerOffset = 350;
                                        var elementPosition:any = element?.getBoundingClientRect().top;
                                        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                            // behavior: "smooth"
                                        });
                                }}>
                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/minimize_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button
                                    type='button'
                                    className='btn  me-n5 mx-3 close_btn'
                                    data-bs-dismiss="offcanvas"
                                    id='kt_expand_close'
                                    onClick={() => {
                                        closeDialogue();
                                        var element = document.getElementById("nrewwicrgoiergviugbeguecgr"+leadId);
                                        var headerOffset = 350;
                                            var elementPosition:any = element?.getBoundingClientRect().top;
                                        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                            // behavior: "smooth"
                                        });
                                    }}
                                    aria-label="Close"
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
                                                {/* <img src={toAbsoluteUrl('/media/avatars/300-23.jpg')} className="user_img" alt='' /> */}
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={leadDetail.contact_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+leadDetail.contact_id+'/'+leadDetail.contact_profile_image : ''} className="user_img" alt='' />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="d-flex">                                                            
                                                            <h4 className="mb-0 ms-2">{leadDetail.contact_name}</h4>
                                                        </div>                                                        
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <a href={"mailto:"+ leadDetail.contact_email} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                        <a href={"tel:"+ leadDetail.contact_mobile} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                        {/* <a href="#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a> */}
                                                        <a href={"https://api.whatsapp.com/send?phone=" + leadDetail.contact_mobile} target="new" className="btn_soft_primary">
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
                                            <div className="col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                                <p className="mb-0">{leadDetail.contact_email}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                                <p className="mb-0">{leadDetail.contact_mobile}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_at'})}</small>
                                                <p className="mb-0">{moment(leadDetail.created_at).format('DD-MM-YYYY hh:mm a')}</p>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                <p className="mb-0">{leadDetail.created_by_name}</p>
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
                                        <button className={tabInfo == 'overview' ? "nav-link active" : "nav-link"} id="overview-tab" data-bs-toggle="pill" data-bs-target={"#overview"+leadId} type="button" role="tab" aria-controls={"overview"+leadId} aria-selected="true">{intl.formatMessage({id: 'overview'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'notes' ? "nav-link active" : "nav-link"} id="notes-tab" data-bs-toggle="pill" data-bs-target={"#notes"+leadId} type="button" role="tab" aria-controls="notes" aria-selected="false">{intl.formatMessage({id: 'notes'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'files' ? "nav-link active" : "nav-link"} id="files-tab" data-bs-toggle="pill" data-bs-target={"#files"+leadId} type="button" role="tab" aria-controls="files" aria-selected="false">{intl.formatMessage({id: 'files'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'message' ? "nav-link active" : "nav-link"} id="message-tab" data-bs-toggle="pill" data-bs-target={"#message"+leadId} type="button" role="tab" aria-controls="message" aria-selected="false">{intl.formatMessage({id: 'messages'})}</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'req' ? "nav-link active" : "nav-link"} id="requirements-tab" data-bs-toggle="pill" data-bs-target={"#requirements"+leadId} type="button" role="tab" aria-controls="requirements" aria-selected="false">{intl.formatMessage({id: 'requirements'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'matches' ? "nav-link active" : "nav-link"} id="matches-tab" data-bs-toggle="pill" data-bs-target={"#matches"+leadId} type="button" role="tab" aria-controls="matches" aria-selected="false">{intl.formatMessage({id: 'auto_matches'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'sec_contact' ? "nav-link active" : "nav-link"} id="contact-tab" data-bs-toggle="pill" data-bs-target={"#contact"+leadId} type="button" role="tab" aria-controls="contact" aria-selected="false">{intl.formatMessage({id: 'sec_contact'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'options' ? "nav-link active" : "nav-link"} id="options-tab" data-bs-toggle="pill" data-bs-target={"#options"+leadId} type="button" role="tab" aria-controls="options" aria-selected="false">{intl.formatMessage({id: 'options'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'duplicate' ? "nav-link active" : "nav-link"} id="duplicate-tab" data-bs-toggle="pill" data-bs-target={"#duplicate"+leadId} type="button" role="tab" aria-controls="duplicate" aria-selected="false">{intl.formatMessage({id: 'duplicate'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'task' ? "nav-link active" : "nav-link"} id="tasks-tab" data-bs-toggle="pill" data-bs-target={"#tasks"+leadId} type="button" role="tab" aria-controls="tasks" aria-selected="false">{intl.formatMessage({id: 'tasks'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'timeline' ? "nav-link active" : "nav-link"} id="timeline-tab" data-bs-toggle="pill" data-bs-target={"#timeline"+leadId} type="button" role="tab" aria-controls="timeline" aria-selected="false">{intl.formatMessage({id: 'activity_timeline'})}</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={tabInfo == 'overview' ? "tab-pane fade show active": "tab-pane fade"} id={"overview"+leadId} role="tabpanel" aria-labelledby="overview-tab">
                                        <form noValidate onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_person'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('contact_id')}>
                                                            <option value=''>select</option>
                                                            {dropdowns.contact_list?.map((contactsVal:any,i:any) =>{
                                                                return (
                                                                    <option value={contactsVal.id} selected={contactsVal.id == leadDetail.contact_id} key={i}>{contactsVal.first_name+ ' '}{contactsVal.last_name ?? ''}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                    {formik.touched.contact_id && formik.errors.contact_id && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.contact_id}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'looking_for'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className={clsx(
                                                            'btn btn-sm w-100 text-start form-select',
                                                            {
                                                                'is-invalid': formik.touched.looking_for && formik.errors.looking_for,
                                                            },
                                                            {
                                                                'is-valid': formik.touched.looking_for && !formik.errors.looking_for,
                                                            }
                                                            )} {...formik.getFieldProps('looking_for')}>
                                                                <option value=''>Looking For</option>
                                                            {dropdowns.looking_for?.map((lookingForVal:any,i:any) =>{
                                                                return (
                                                                    <option value={lookingForVal.id} selected={lookingForVal.id == leadDetail.looking_for} key={i}>{lookingForVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                    {formik.touched.looking_for && formik.errors.looking_for && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.looking_for}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'segment'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                                        <option value=''>Segment</option>
                                                            {dropdowns.segment?.map((segmentVal:any,i:any) =>{
                                                                return (
                                                                    <option value={segmentVal.id} selected={segmentVal.id == leadDetail.segment} key={i}>{segmentVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_priority'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                    <select 
                                                        {...formik.getFieldProps('lead_priority')}
                                                        className="btn btn-sm w-100 text-start form-select">
                                                            <option value=''>select</option>                                            
                                                            {dropdowns.lead_priority?.map((priorityVal:any,i:any) =>{
                                                                return (
                                                                    <option value={priorityVal.id} selected={priorityVal.id == leadDetail.lead_priority} key={i}>{priorityVal.option_value}</option> 
                                                            )})}                                            
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sales_manager'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('sales_manager')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.sales_manager?.map((manager:any,i:any) =>{
                                                                return (
                                                                    <option value={manager.id} selected={manager.id == leadDetail.contact_id} key={i}>{(manager.first_name ?? '--No Name--') +' '}{manager.last_name ?? ''}</option>  
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_type'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('property_type')}>
                                                        <option value=''>Property Type</option>
                                                            {dropdowns.property_type?.map((propertyVal:any,i:any) =>{
                                                                return (
                                                                    <option value={propertyVal.id} selected={propertyVal.id == leadDetail.property_type} key={i}>{propertyVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_source'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('lead_source')}>
                                                        <option value=''>Lead Source</option>
                                                            {dropdowns.source?.map((sourceVal:any,i:any) =>{
                                                                return (
                                                                    <option value={sourceVal.id} selected={sourceVal.id == leadDetail.lead_source} key={i}>{sourceVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_group'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('lead_group')}>
                                                        <option value=''>Lead Group</option>
                                                            {dropdowns.lead_group?.map((groupVal:any,i:any) =>{
                                                                return (
                                                                    <option value={groupVal.id} selected={groupVal.id == leadDetail.lead_group} key={i}>{groupVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'opportunity_value'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2">
                                                        <select {...formik.getFieldProps('currency')} className="px-2 btn_secondary bg_secondary btn btn-sm prepend">
                                                        <option value=''>&#9660;</option>
                                                            {dropdowns.currency?.map((groupVal:any,i:any) =>{
                                                                return (
                                                                <option value={groupVal.id} selected={i == 0 ? true: false} key={i}>{groupVal.symbol}</option> 
                                                            )})}
                                                        </select>
                                                        <input type="text" className="form-control" {...formik.getFieldProps('fee_oppurtunity')} onChange={(e) => formik.setFieldValue("fee_oppurtunity", e.target?.value.replace(/[^0-9,.]/g, ""))}/>
                                                    </div>
                                                    {formik.touched.fee_oppurtunity && formik.errors.fee_oppurtunity && (
                                                        <div className='fv-plugins-message-container'>
                                                            <div className='fv-help-block'>
                                                                <span role='alert' className='text-danger'>{formik.errors.fee_oppurtunity}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('property_id')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.property?.map((projectsVal:any,i:any) =>{
                                                                return (<>
                                                                    {projectsVal.name_of_building != null &&
                                                                    <option value={projectsVal.id} selected={projectsVal.id == leadDetail.property_id} key={i}>{projectsVal.name_of_building}</option> }</>
                                                            )})}
                                                        </select> */}
                                                        <ReactSelect
                                                        options={dropdowns.property}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name_of_building || "No Building Name"}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.property?.find((item:any) => propertyId == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            formik.setFieldValue('property_id', val.id ?? '');
                                                            setPropertyId(val.id);
                                                        }}
                                                        placeholder={"Project.."}
                                                        />
                                                    </div> 
                                                </div> 
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('status')}>
                                                        <option value=''>Status</option>
                                                            {dropdowns.lead_status?.map((statusVal:any,i:any) =>{
                                                                return (
                                                                    <option value={statusVal.id} selected={statusVal.id == leadDetail.lead_status} key={i}>{statusVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>  */}
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
                                                                // selected = assignToName;
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

                                                                return name.join(', ');
                                                            }}
                                                            className='multi_select_field form-control bs_0' 
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem  value="as1">
                                                                <em>Assign To</em>
                                                            </MenuItem>
                                                            {dropdowns.assign_to?.map((assignVal:any) => (
                                                                <MenuItem
                                                                key={assignVal.id}
                                                                value={assignVal.first_name+' '+(assignVal.last_name ?? '')+'-'+assignVal.id}
                                                                style={getStyles(assignVal.first_name+' '+assignVal.last_name, assignToName, theme)}
                                                                >
                                                                {assignVal.first_name+' '}{assignVal.last_name ?? ''}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl> */}
                                                    <div className="input-group mb-3 input_prepend bs_2">
                                                        <ReactSelect
                                                        isMulti
                                                        options={dropdowns.assign_to}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.assign_to?.filter((item:any) => assignToId?.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setAssignToId(val);
                                                        }}
                                                        placeholder={"Assign-to.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-center mb-4">
                                                <button
                                                    type='submit'
                                                    id='kt_sign_up_submit1'
                                                    className='btn btn_primary text-primary'
                                                    disabled={formik.isSubmitting}
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
                                            </div>
                                        </form>
                                    </div>
                                    <div className={tabInfo == 'notes' ? "tab-pane fade show active": "tab-pane fade"} id={"notes"+leadId} role="tabpanel" aria-labelledby="notes-tab">
                                    <div className="card mb-5 mb-xl-8">
                                            <div className='card-body pb-0'>
                                                <div className='main_bg px-lg-5 px-4 pt-4 pb-1 mb-6'>
                                                    <form noValidate onSubmit={formikNotes.handleSubmit} className='position-relative mb-6 pb-4 border-bottom border-secondary'>
                                                        <input {...formikNotes.getFieldProps('reply')}
                                                            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                            data-kt-autosize='true'                                                        
                                                            placeholder='Reply..'
                                                        />

                                                        <div className='position-absolute top-0 end-0 me-n5'>

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
                                                <div className='notes_list mt-4 card-body'>
                                                    <h4 className='mb-3'>{intl.formatMessage({id: 'notes_list'})}</h4>
                                                    <hr/>
                                                    {LeadNoteList.map((leadNote, i) => {
                                                        return (
                                                    <div className='mb-5' key={leadNote.id}>
                                                        {leadNote.reply1 == 'NO'
                                                        ? <div className='note_question'>
                                                            <div className='d-flex align-items-center mb-3'>
                                                                <div className='d-flex align-items-center flex-grow-1'>
                                                                    <div className='symbol symbol-45px me-5'>

                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={leadNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+leadNote.user_id+'/'+leadNote.user_profile_image : ''} className="user_img" alt='' />

                                                                    </div>
                                                                    <div className='d-flex flex-column'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                        {leadNote.user_name ?? 'user'}
                                                                    </a>
                                                                    <span className='text-gray-400 fw-bold'>{Moment(leadNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='mb-7 pb-5 border-bottom border-secondary d-flex justify-content-between'>
                                                                { noteEditVal != '' && parentId == leadNote.id ?
                                                                <div className='text-gray-800 position-relative w-75'>
                                                                    <input
                                                                        className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                        data-kt-autosize='true'
                                                                        placeholder='Reply..'
                                                                        id={'edit_field'+leadNote.id}
                                                                        defaultValue={noteEditVal}
                                                                    ></input>
                                                                </div>
                                                                : 
                                                                <div className='text-gray-800'>
                                                                    {leadNote.reply}
                                                                </div>
                                                                }
                                                                { currentUser?.designation == 1 &&
                                                                <span>
                                                                    { noteEditVal != '' && parentId == leadNote.id ?
                                                                    <><button type='button' onClick={() => cancelEdit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                    </button>
                                                                    <button type='button' onClick={() => editOnSubmit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                    </button></> :
                                                                    <button type='button' onClick={() => replyEdit(leadNote.id, leadNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                    <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                    </button>}
                                                                    {currentUser?.designation == 1 && <button type='button'
                                                                    data-bs-toggle='modal'
                                                                    data-bs-target={'#delete_note_popup'+leadNote.id} 
                                                                    className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                    <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                    </button> }
                                                                </span>}
                                                                <div className='modal fade' id={'delete_note_popup'+leadNote.id} aria-hidden='true'>
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
                                                                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(leadNote.id, leadNote.parent_id)}>
                                                                                        {intl.formatMessage({id: 'yes'})}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> :
                                                        <div className='mb-7 ps-10 note_answer'>
                                                            <div className='d-flex mb-5'>
                                                                <div className='symbol symbol-45px me-5'>

                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={leadNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+leadNote.user_id+'/'+leadNote.user_profile_image : ''} className="user_img" alt='' />
                                                                </div>
                                                                <div className='d-flex flex-column flex-row-fluid'>
                                                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fw-bolder me-2'>
                                                                    {leadNote.user_name ?? 'User'}
                                                                    </a>
                                                                    <span className='text-gray-400 fw-bold fs-7'>{Moment(leadNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                </div>                                                                
                                                                    <div className=' d-flex justify-content-between'>                                            
                                                                        { noteEditVal != '' && parentId == leadNote.id ?
                                                                        <div className='text-gray-800 position-relative w-75'>
                                                                            <input
                                                                                className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                data-kt-autosize='true'
                                                                                placeholder='Reply..'
                                                                                id={'edit_field'+leadNote.id}
                                                                                defaultValue={noteEditVal}
                                                                            ></input>
                                                                        </div>
                                                                        : 
                                                                        <div className='text-gray-800'>
                                                                            {leadNote.reply}
                                                                        </div>
                                                                        } 
                                                                            <span>
                                                                            { currentUser?.designation == 1 &&
                                                                        <span>
                                                                            { noteEditVal != '' && parentId == leadNote.id ?
                                                                            <><button type='button' onClick={() => cancelEdit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                    </button>
                                                                                    <button type='button' onClick={() => editOnSubmit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                            <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                        </button></>:
                                                                            <button type='button' onClick={() => replyEdit(leadNote.id, leadNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                            </button>}
                                                                            {currentUser?.designation == 1 && <button type='button'
                                                                            data-bs-toggle='modal'
                                                                            data-bs-target={'#delete_note_popup2'+leadNote.id} 
                                                                            className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                            <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                            </button> }
                                                                        </span>}
                                                                            </span>
                                                                        </div>                                                                    
                                                                        </div>
                                                                    <div className='modal fade' id={'delete_note_popup2'+leadNote.id} aria-hidden='true'>
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
                                                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(leadNote.id, leadNote.parent_id)}>
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
                                                       {leadNote.reply1 == 'NO' && 
                                                        <>
                                                        <form className='position-relative mb-6'>
                                                            <input
                                                                className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                data-kt-autosize='true'
                                                                placeholder='Reply..'
                                                                id={'child_reply'+leadNote.id}
                                                            />
                                                            <div className='position-absolute top-0 end-0 me-n5'>
                                                                <button type='submit' onClick={() => replyOnSubmit(leadNote.id)}  className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                </button>
                                                            </div>
                                                        </form>
                                                        </>
                                                       }
                                                        <div className='separator mb-4'></div>
                                                    </div>
                                                        )
                                                    })}                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'files' ? "tab-pane fade show active" : "tab-pane fade"} id={"files"+leadId} role="tabpanel" aria-labelledby="files-tab">
                                        <div {...getRootProps({className: 'dropzone'})}>
                                            <div className='myDIV'>
                                                <div className="d-flex align-items-center justify-content-center w-100 h-100 vh-25">
                                                    <span className="btn btn-file w-100 h-100">
                                                        <KTSVG
                                                        path='/media/icons/duotune/files/fil022.svg'
                                                        className='svg-icon-1 text_primary ms-2'
                                                        />
                                                        <p className='text_primary'>{intl.formatMessage({id: 'upload_files_here'})}</p>
                                                        <small className='text-dark'>* Note: jpg, jpeg, png, pdf only acceptable</small>
                                                        <input {...getInputProps()}/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <aside className='d-flex flex-wrap mt-5'>
                                            {thumbs}
                                        </aside>
                                        <div className='p-5 text-end'>
                                            <button
                                                type='button'
                                                id='kt_sign_up_submit2'
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
                                        {filesVal.length > 0 &&<>
                                        <div className='main_bg p-4 mb-9 rounded'>                                            
                                            <h4>{intl.formatMessage({id: 'files'})}</h4>
                                            <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                                            {filesVal.map((file, i) => {
                                                const pieces = file.fileoriginalname.split('.');
                                                const last = pieces[pieces.length - 1];
                                                return ( 
                                                    <>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3" key={i}>
                                                        <div className="card h-100">
                                                            <div className="card-body d-flex justify-content-center text-center flex-column p-8">
                                                            <a href="#" data-bs-toggle='modal'
                                                            data-bs-target={'#delete_confirm_popup'+file.id} className="btn delete_btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>
                                                                <a href="#" className="text-gray-800 text-hover-primary d-flex flex-column">
                                                                    {last != 'pdf' ? 
                                                                    <a className={imgFullView && imgSelect == file.id ? "img_full_view" : "symbol symbol-75px"} onClick={() => imgViewChange(file.id)}>
                                                                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/svg/files/doc.svg') }} src={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+file.module_id+'/'+file.file} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    :
                                                                    <a className="symbol symbol-75px" href={process.env.REACT_APP_API_BASE_URL+'uploads/lead/files/'+file.module_id+'/'+file.file}>
                                                                        <img src={toAbsoluteUrl("/media/svg/files/pdf.svg")} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY ")}</div>
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
                                    </div></>}
                                    </div>
                                    <div className={tabInfo == 'req' ? "tab-pane fade show active": "tab-pane fade"} id={"requirements"+leadId} role="tabpanel" aria-labelledby="files-tab">
                                        <form noValidate onSubmit={formik2.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bedrooms'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bedrooms_min')} onChange={(e) => formik2.setFieldValue("no_of_bedrooms_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder="Min"/>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bedrooms_max')} onChange={(e) => formik2.setFieldValue("no_of_bedrooms_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder="Max"/>
                                                            </div>
                                                        </div> 
                                                        {/* <div className="col-md-6 col-xxl-4 col-12 mb-3"> */}
                                                            {/* <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lead_unit_type'})}</label> */}
                                                            {/* <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                                <select className="btn btn-sm w-100 text-start form-select" {...formik2.getFieldProps('lead_unit_type')}>
                                                                <option value=''>Select</option>
                                                                    {dropdowns.unit_type?.map((unitTypePro:any,i:any) =>{
                                                                        return (
                                                                            <option value={unitTypePro.id} key={i}>{unitTypePro.option_value}</option>
                                                                    )})}
                                                                </select>
                                                            </div>  */}
                                                        {/* </div>  */}
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bathrooms'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bathrooms_min')} onChange={(e) => formik2.setFieldValue("no_of_bathrooms_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder="Min"/>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('no_of_bathrooms_max')} onChange={(e) => formik2.setFieldValue("no_of_bathrooms_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder="Max"/>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div>  
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_facing'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik2.getFieldProps('project_facing')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.project_facing?.map((Facing:any,i:any) =>{
                                                                return (
                                                                    <option value={Facing.id} selected={Facing.id == leadDetail.project_facing} key={i}>{Facing.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'budget_range'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('budget_min')} onChange={(e) => {
                                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                    const inputValue = e.target.value;
                                                                    var area;
                                                                    
                                                                    if (!regex.test(inputValue)) {
                                                                        area = inputValue.slice(0, -1);
                                                                    } else {
                                                                        area = inputValue;
                                                                    }
                                                                    formik2.setFieldValue("budget_min", area)}} maxLength={12} className="form-control" placeholder="Min"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('budget_min_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.currency?.map((currencyVal:any,i:any) =>{
                                                                        console.log('currencyVal', currencyVal);
                                                                        return (
                                                                            <option value={currencyVal.id} key={i}>{currencyVal.symbol}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>                                                            
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('budget_max')} onChange={(e) => {
                                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                    const inputValue = e.target.value;
                                                                    var area;
                                                                    
                                                                    if (!regex.test(inputValue)) {
                                                                        area = inputValue.slice(0, -1);
                                                                    } else {
                                                                        area = inputValue;
                                                                    }
                                                                    formik2.setFieldValue("budget_max", area)}} maxLength={12} className="form-control" placeholder="Max"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('budget_max_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.currency?.map((currencyVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={currencyVal.id} key={i}>{currencyVal.symbol}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'built_area_range'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('built_up_area_min')} onChange={(e) => {
                                                                        const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                        const inputValue = e.target.value;
                                                                        var area;

                                                                        if (!regex.test(inputValue)) {
                                                                            area = inputValue.slice(0, -1);
                                                                        } else {
                                                                            area = inputValue;
                                                                        }
                                                                    formik2.setFieldValue("built_up_area_min", area)}} maxLength={12} placeholder="Min"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('built_up_area_min_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" className="form-control" {...formik2.getFieldProps('built_up_area_max')} onChange={(e) => {
                                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                    const inputValue = e.target.value;
                                                                    var area;

                                                                    if (!regex.test(inputValue)) {
                                                                        area = inputValue.slice(0, -1);
                                                                    } else {
                                                                        area = inputValue;
                                                                    }
                                                                    formik2.setFieldValue("built_up_area_max", area)}} maxLength={12} placeholder="Max"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('built_up_area_max_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area_range'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('plot_area_min')} onChange={(e) => {
                                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                    const inputValue = e.target.value;
                                                                    var area;
                                                                    if (!regex.test(inputValue)) {
                                                                        area = inputValue.slice(0, -1);
                                                                    } else {
                                                                        area = inputValue;
                                                                    }
                                                                 formik2.setFieldValue("plot_area_min", area)}} maxLength={12} className="form-control" placeholder="Min"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('plot_area_min_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('plot_area_max')} onChange={(e) => {
                                                                    const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                    const inputValue = e.target.value;
                                                                    var area;

                                                                    if (!regex.test(inputValue)) {
                                                                        area = inputValue.slice(0, -1);
                                                                    } else {
                                                                        area = inputValue;
                                                                    }
                                                                    formik2.setFieldValue("plot_area_max", area)}} maxLength={12} className="form-control" placeholder="Max"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('plot_area_max_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_car_park'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('car_park_min')} onChange={(e) => formik2.setFieldValue("car_park_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} className="form-control" placeholder="Min"/>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('car_park_max')} onChange={(e) => formik2.setFieldValue("car_park_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} className="form-control" placeholder="Max"/>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'timeline_for_closure'})}</label>
                                                    <div className='row mx-0'>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('timeline_for_closure_min')} onChange={(e) => 
                                                                    formik2.setFieldValue("timeline_for_closure_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={3} className="form-control" placeholder="Min"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('timeline_for_closure_min_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.timeline_duration?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <div className="input-group mb-3 input_prepend bs_2">
                                                                <input type="text" {...formik2.getFieldProps('timeline_for_closure_max')} onChange={(e) => 
                                                                    formik2.setFieldValue("timeline_for_closure_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={3} className="form-control" placeholder="Max"/>
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" {...formik2.getFieldProps('timeline_for_closure_max_ut')}>
                                                                <option value=''>&#9660;</option>
                                                                    {dropdowns.timeline_duration?.map((furnishStatusVal:any,i:any) =>{
                                                                        return (
                                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                    )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik2.getFieldProps('country')} onChange={async (e) => {
                                                            formik2.setFieldValue("country", e.target.value);
                                                            let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                                            setState(states);
                                                            formik2.setFieldValue("state", '');
                                                            formik2.setFieldValue("city", '');
                                                            setCity([]);
                                                        }}>
                                                            <option value="">Select</option>
                                                            {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div> 
                                                    </div>
                                                </div>
                                                {/* {leadDetail?.country != 0 && */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                        <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik2.getFieldProps('state')} onChange={async (e) => {
                                                            formik2.setFieldValue("state", e.target.value);                                               
                                                            let cities = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                                            setCity(cities);
                                                        }} >
                                                            <option value="">Select</option>
                                                            {state?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div>  
                                                    </div>
                                                </div>
                                                {/* } */}
                                                {/* {leadDetail?.state != 0 && */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                        <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik2.getFieldProps('city')}>
                                                            <option value="">Select</option>
                                                            {/* {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})} */}
                                                            {dropdowns?.city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>
                                                {/* } */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zipcode'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2">
                                                        <input type="text" {...formik2.getFieldProps('zipcode')} name="zipcode" className="form-control" placeholder="Enter Zip Code" onChange={async(e) => { 
                                                        formik2.setFieldValue("zipcode", e.target?.value.replace(/[^0-9]/g, ""));
                                                        if(e.target?.value.length == 6) {
                                                            const response = await getLocalityByPIN(e.target?.value)
                                                            setLocalityList(response.output)
                                                        }                                  
                                                    }} maxLength={6} />
                                                    </div>
                                                </div> 
                                                {/* {localityList .length > 0 &&                         
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                    <select className="form-select btn-sm text-start" {...formik2.getFieldProps('locality')}>
                                                    <option value="">Select</option>
                                                        {localityList?.map((localityValue,i)=> {
                                                        return (
                                                            <option value={localityValue.Name} key={i}>{localityValue.Name}</option>
                                                        )
                                                        })} 
                                                    </select>    
                                                    </div>
                                                </div>} */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                    {/* <select className="form-select btn-sm text-start" {...formik2.getFieldProps('locality')}>
                                                    <option value="">Select</option>
                                                        {dropdowns?.locality?.map((localityValue:any,i:any)=> {
                                                        return (
                                                            <option value={localityValue.name} key={i}>{localityValue.name}</option>
                                                        )
                                                        })} 
                                                    </select>     */}
                                                      <ReactSelect
                                                        options={dropdowns?.locality}
                                                        // closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns?.locality?.find((item:any) => localityID == item.id) ?? []}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100"}
                                                        placeholder={"Locality"}
                                                        onChange={(val:any) => {
                                                        setLocalityID(val.id)
                                                        formik2.setFieldValue("locality", val.id);                                               
                                                        }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'requirement_location'})}</label>
                                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            className='input_prepend'
                                                            multiple
                                                            displayEmpty
                                                            value={requirementLocationName}
                                                            onChange={locationHandleChange}
                                                            input={<OutlinedInput className='input_prepend' />}
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
                                                                    return <p>Requirement location</p>;
                                                                }

                                                                return name.join(', ');
                                                            }}
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>Requirement location</em>
                                                            </MenuItem>
                                                            {dropdowns.requirement_location?.map((reqLocationVal:any) => (
                                                                <MenuItem
                                                                key={reqLocationVal.id}
                                                                value={reqLocationVal.option_value +'-'+ reqLocationVal.id}
                                                                style={getStyles(reqLocationVal.option_value, requirementLocationName, theme)}
                                                                >
                                                                {reqLocationVal.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>                                                 */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_property'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select 
                                                        {...formik2.getFieldProps('age_of_property')} 
                                                        className="btn btn-sm w-100 text-start form-select">
                                                            <option value="">Select</option>
                                                            {dropdowns.age_of_property?.map((ageOfPropVal:any,i:any) =>{
                                                                return (
                                                                    <option value={ageOfPropVal.id} selected={ageOfPropVal.id == leadDetail.age_of_property_id} key={i}>{ageOfPropVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'vasthu_feng_sui_compliant'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2 py-1">
                                                        <select 
                                                        {...formik2.getFieldProps('vasthu_compliant')} 
                                                        className="btn btn-sm w-100 text-start form-select">
                                                            <option value="" >Select</option>
                                                            {dropdowns.vasthu_compliant?.map((vasthuVal:any,i:any) =>{
                                                                return (
                                                                    <option value={vasthuVal.id} selected={vasthuVal.id == leadDetail.vasthu_compliant_id} key={i}>{vasthuVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            className='input_prepend'
                                                            multiple
                                                            displayEmpty
                                                            value={aminityName}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput className='input_prepend' />}
                                                            renderValue={(selected) => {
                                                                // selected = aminityName;
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
                                                                return <p>Amenities</p>;
                                                                }

                                                                return name.join(', ');
                                                            }}
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>Amenities</em>
                                                            </MenuItem>
                                                            {dropdowns.amenities?.map((amenitiesVal:any) => (
                                                                <MenuItem
                                                                key={amenitiesVal.id}
                                                                value={amenitiesVal.option_value+'-'+amenitiesVal.id}
                                                                style={getStyles(amenitiesVal.option_value, aminityName, theme)}
                                                                >
                                                                {amenitiesVal.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing_status'})}</label>
                                                    <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={furnishName}
                                                            onChange={furnishingChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                selected = furnishName;
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
                                                                return <p>Furnishing</p>;
                                                                }

                                                                return name.join(', ');
                                                            }}
                                                            className='multi_select_field'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>Furnishing</em>
                                                            </MenuItem>
                                                            {dropdowns.furnishing_status?.map((furnishStatusVal:any) => (
                                                                <MenuItem
                                                                key={furnishStatusVal.id}
                                                                value={furnishStatusVal.option_value+'-'+furnishStatusVal.id}
                                                                style={getStyles(furnishStatusVal.option_value, furnishName, theme)}
                                                                >
                                                                {furnishStatusVal.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'posession_status'})}</label>
                                                    <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={posessionName}
                                                            onChange={possessionChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                selected = posessionName;
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
                                                                return <p>Posession</p>;
                                                                }

                                                                return name.join(', ');
                                                            }}
                                                            className='multi_select_field'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>Posession</em>
                                                            </MenuItem>
                                                            {dropdowns.possession_status?.map((posesStatusVal:any) => (
                                                                <MenuItem
                                                                key={posesStatusVal.id}
                                                                value={posesStatusVal.option_value+'-'+posesStatusVal.id}
                                                                style={getStyles(posesStatusVal.option_value, posessionName, theme)}
                                                                >
                                                                {posesStatusVal.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div> 
                                                
                                                <div className="col-12 d-flex justify-content-center mb-4">
                                                <button
                                                    type='submit'
                                                    id='kt_sign_up_submit3'
                                                    className='btn btn_primary text-primary'
                                                    disabled={formik2.isSubmitting}
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
                                            </div>
                                        </form>
                                    </div>
                                    <div className={tabInfo == 'message' ? "tab-pane fade show active": "tab-pane fade"} id={"message"+leadId} role="tabpanel" aria-labelledby="message-tab">                                        
                                    <ul className="nav nav-pills mb-3 message_tabs" id={"pills-tab"+leadId} role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id={"pills-mail-tab"+leadId} data-bs-toggle="pill" data-bs-target={"#pills-mail"+leadId} type="button" role="tab" aria-controls="pills-mail" aria-selected="true">{intl.formatMessage({id: 'email'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-whatsapp-tab"+leadId} data-bs-toggle="pill" data-bs-target={"#pills-whatsapp"+leadId} type="button" role="tab" aria-controls="pills-whatsapp" aria-selected="false">{intl.formatMessage({id: 'whatsapp'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-sms-tab"+leadId} data-bs-toggle="pill" data-bs-target={"#pills-sms"+leadId} type="button" role="tab" aria-controls="pills-sms" aria-selected="false">{intl.formatMessage({id: 'sms'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-calls-tab"+leadId} data-bs-toggle="pill" data-bs-target={"#pills-calls"+leadId} type="button" role="tab" aria-controls="pills-calls" aria-selected="false">{intl.formatMessage({id: 'calls'})}</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent position-relative">
                                            <div className="tab-pane fade show active" id={"pills-mail"+leadId} role="tabpanel" aria-labelledby="pills-mail-tab">
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
                                            <div className="tab-pane fade" id={"pills-whatsapp"+leadId} role="tabpanel" aria-labelledby="pills-whatsapp-tab">
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
                                            <div className="tab-pane fade" id={"pills-sms"+leadId} role="tabpanel" aria-labelledby="pills-sms-tab">
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
                                            <div className="tab-pane fade" id={"pills-calls"+leadId} role="tabpanel" aria-labelledby="pills-calls-tab">
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
                                    <div className={tabInfo == 'contact' ? "tab-pane fade show active": "tab-pane fade"} id={"contact"+leadId} role="tabpanel" aria-labelledby="contact-tab">
                                        <div style={{ height: 550, width: '100%', paddingBottom: '50px',}}>
                                        {secondaryContactLead.length > 0
                                            ?
                                            <DataGrid
                                                rows={secondaryContactLead}
                                                columns={secContactColumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_secondary_contacts_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    {/* <div className={tabInfo == 'lead' ? "tab-pane fade show active": "tab-pane fade"} id={"lead"+leadId} role="tabpanel" aria-labelledby="lead-tab">
                                        <div style={{ height: 500, width: '100%', paddingBottom: '50px',}}>
                                        {[].length > 0
                                            ?
                                            <DataGrid
                                                rows={[]}
                                                columns={leadcolumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_lead_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div> */}
                                    <div className={tabInfo == 'duplicate' ? "tab-pane fade show active": "tab-pane fade"} id={"duplicate"+leadId} role="tabpanel" aria-labelledby="duplicate-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                        {leadDuplicates.length > 0
                                            ?
                                            <DataGrid
                                                rows={leadDuplicates}
                                                columns={duplicatecolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_secondary_contacts_available'})}</p>
                                            </div>
                                            }
                                    </div>
                                    </div>
                                    <div className={tabInfo == 'task' ? "tab-pane fade show active": "tab-pane fade"} id={"tasks"+leadId} role="tabpanel" aria-labelledby="tasks-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                        {taskLead.length > 0
                                            ?
                                        <DataGrid
                                                rows={taskLead}
                                                columns={logContactTaskcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_tasks_available'})}</p>
                                            </div>
                                            }
                                            </div>
                                    </div>
                                    <div className={tabInfo == 'matches' ? "tab-pane fade show active" : "tab-pane fade"} id={"matches"+leadId} role="tabpanel" aria-labelledby="matches-tab">
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {matches.length > 0
                                            ?
                                            <DataGrid
                                                rows={matches}
                                                columns={autoMatchColumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_auto_matches_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div>  
                                    <div className={tabInfo == 'timeline' ? "tab-pane fade show active": "tab-pane fade"} id={"timeline"+leadId} role="tabpanel" aria-labelledby="timeline-tab">
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {logList.length > 0
                                            ?
                                            <DataGrid
                                                rows={logList}
                                                columns={logContactcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_timeline_contacts_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div>  
                                    <div className={tabInfo == 'options' ? "tab-pane fade show active": "tab-pane fade"} id={"options"+leadId} role="tabpanel" aria-labelledby="options-tab">
                                        <div className='mb-9 overflow-auto overflow-x-hidden' style={{ height: 550, width: '100%',}}>
                                            {/* {logList.length > 0
                                            ?
                                            <DataGrid
                                                rows={logList}
                                                columns={logContactcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_timeline_contacts_available'})}</p>
                                            </div>
                                            } */}
                                            <LeadOptions/>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> :
            <div className="card bg_primary">
                <div className="card-body d-flex justify-content-between">
                    <div>
                        <h5 className='text-white'>{intl.formatMessage({id: 'lead_details'})}</h5>
                    </div>
                    <button onClick={minimaximize} className="mx-3 btn p-0">
                        <i className="fas fa-window-maximize text-white"></i>
                    </button>
                    <button type='button' data-bs-dismiss="offcanvas" id='kt_expand_close' onClick={closeDialogue} className="mx-3 btn p-0">
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>
            </div>
            }
        </div>
    )

}
export {LeadDetails}