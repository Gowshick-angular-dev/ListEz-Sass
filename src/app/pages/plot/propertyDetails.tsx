import React,{FC, useState, useEffect, useRef} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { updateProperty, updatePropertyAddress, updatePropertyFeatures, savePropertyNotes, getPropertyNotes, uploadMultipleFileProperty, deleteMultiFileProperty, deletePropertyNotes, updatePropertyUnitType, getPropertyDropdowns, updatePropertyNotes, getLog, getMultiImageProperty, getPropertyLeads, getPropertyTasks, getPropertyById, updatePropertyPlot } from './core/_requests';
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
import Dropzone, { useDropzone } from 'react-dropzone'
import Moment from 'moment';
import {useIntl} from 'react-intl';
import { DataGrid, GridColDef,GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";


const initialValues = {
    contact_id: '',
    available_for: '',
    commission: '',
    property_indepth: '',
    segment: '',
    property_type: '',
    property_source: '',
    property_status: '',
    description: '',
    project_stage: '',
    age_of_property: '',
    furnishing: '',
    sale_price: '',
    builtup_area_min: '',
    builtup_area_max: '',
    builtup_area_min_ut: '',
    builtup_area_max_ut: '',
    plot_area_min: '',
    plot_area_max: '',
    plot_area_min_ut: '',
    plot_area_max_ut: '',
    tower: '',
    gst: '',
    legal_approval: '',
    invoice_name: '',
    uds_min: '',
    uds_min_ut: '',
    uds_max: '',
    uds_max_ut: '',
    no_of_floors: '',
    no_of_units_min: '',
    no_of_units_max: '',
    unit_type_min: '',
    unit_type_max: '',
    ownership_type: '',
    balcony: '',
    property_facing: '',
    kitchen_type: '',
    flooring: '',
    vasthu_compliant: '',
    currently_under_loan: '',
    available_from: '',
    site_visit_preference: '',
    key_custody: '',
    no_of_car: '',
    car_park_type: '',
    water_supply: '',
    gated_community: '',
    amenities: '',
    property_highlight: '',
    rera_registered: '',
    rera_number: '',
    completion_certificate: '',
    name_of_building: '',
    address_line1: '',
    country: '',
    state: '',
    city: '',
    locality: '',
    pincode: '',
    latitude: '',
    longitude: '',
    door_number: '',
    module_number: '',
    reply:'',
    prop_unit_count:'',
    id:'',
    property_id:'',
    unit_type:'',
    total_units:'',
    maintainance_cost:'',
    price_min:'',
    price_max:'',
    local_currency:'',
    bathrooms:'',
    created_by:'',
    title: "",
    subject: "",
    share_with: "",
    module_id: "",
    body: "",
    plot_type: '',
    plot_area: '',
    plot_area_ut: '355',
    fsi: '',
    frontage: '',
    frontage_ut: '355',
    dimensions: '',
    dimensions_ut: '355',
    road_width_min: '',
    road_width_min_ut: '355',
    road_width_max: '',
    road_width_max_ut: '355',
    corner_property: '',
    authority_approved: '',
    boundary_wall: '',
    current_status: '',
    plot_unit_type: '',
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
  
  const img = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };

  const thumbButton = {
    right: 10,
    bottom: 10,
};

function getStyles(name: string, aminityName: string[], theme: Theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const mystyle = {
    padding: "0px",
    height: "34px",
    maxHeight: "200px",
    overflowY: "scroll",
};

const logContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100,headerClassName: 'dg_header' },
    { field: 'user_name', headerName: 'User Name', width: 250,headerClassName: 'dg_header', renderCell: (row) => row.row.user_name?.first_name+' '+row.row.user_name?.last_name },
    { field: 'note', headerName: 'Note', width: 600,headerClassName: 'dg_header' },
    { field: 'module_name', headerName: 'Module Name', width: 300,headerClassName: 'dg_header', renderCell: (row) => row.value == 1 ? 'Contact' : row.value == 2 ? 'Lead' : row.value == 3 ? 'Project' : row.value == 4 ? 'Task' : 'Transaction' },
    { field: 'created_at', headerName: 'Created At', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
];

const leadsProjectcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 ,headerClassName: 'dg_header'},
    { field: 'contact_name', headerName: 'Contact name', width: 150, headerClassName: 'dg_header'},
    { field: 'email', headerName: 'Email', width: 180, headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Phone Number', type: 'number', width: 150, headerClassName: 'dg_header'},
    { field: 'lead_status_name', headerName: 'Status', width: 130, headerClassName: 'dg_header'},
    { field: 'lead_source_name', headerName: 'Source', width: 130, headerClassName: 'dg_header'},
    { field: 'created_at', headerName: 'Created on', width: 200, headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a")},
    { field: 'assign_to_name', headerName: 'Assign To', width: 200, headerClassName: 'dg_header', renderCell: (row) => row.value?.split(',').map((item:any) => item.split('-')[0]).join(', ')},
    { field: 'budget_min', headerName: 'Budget', width: 200, headerClassName: 'dg_header', renderCell: (row) => row.row.budget_min?.slice(0, -5)+ ' - ' + row.row.budget_max?.slice(0, -5)},
];

const tasksProjectcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'task_type_name', headerName: 'Task Type', width: 200,headerClassName: 'dg_header' },
    { field: 'priority_name', headerName: 'Priority', width: 200,headerClassName: 'dg_header' },
    { field: 'task_time', headerName: 'Task Time', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
    { field: 'created_at', headerName: 'Created At', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
];

type Props = {
    propertyId?: any,
    setPropertyList?: any,
    tabInfo?: any,
    setDetailClicked?: any,
    openModal?: any,
    setDetailsClicked?: any,
    body?: any,
}

const PropertyDetails: FC<Props> = (props) => {

    const {
        propertyId, setPropertyList, tabInfo, setDetailClicked, setDetailsClicked, body
    } = props
    const intl = useIntl();

    const {currentUser, logout} = useAuth();
    const theme = useTheme();
    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aminityId, setAminityId] = useState<string[]>([]);
    const [aminityName, setAminityName] = useState<string[]>([]);   
    const [assignToName, setAssignToName] = useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<any[]>([]);
    const [siteVisitName, setSiteVisitName] = useState<string[]>([]);
    const [siteVisitId, setSiteVisitId] = useState<string[]>([]);
    const [propDetail, setPropDetail] = useState<{[key: string]: any}>({});
    const [availableName, setAvailableName] = useState<any[]>([]);
    const [availableId, setAvailableId] = useState<any[]>([]);
    const [PropertyNoteList, setPropertyNoteList] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [isFilesError, setIsFilesError] = useState(false);
    const [parentId, setParentId] = useState<String>('');
    const [isFormError, setIsFormError] = useState(false); 
    const [filesVal, setFilesVal] = useState<any[]>([]); 
    const [logList, setLogList] = useState<any[]>([]); 
    const [leadsList, setLeadsList] = useState<any[]>([]); 
    const [tasksList, setTasksList] = useState<any[]>([]); 
    const [featuresList, setFeaturesList] = useState<any[]>([]); 
    const [imgFullView, setImgFullView] = useState(false);
    const [previewClicked, setPreviewClicked] = useState<any>(null);
    const [previewClickedIndex, setPreviewClickedIndex] = useState<any>('');
    const [imgSelect, setImgSelect] = useState(''); 
    const [unitId, setUnitId] = useState(''); 
    const [noteEditVal, setNoteEditVal] = useState<any>('');
    const [contactId, setContactId] = useState<any>('');
    const [planData, setPlanData] = useState<any[]>([]);
    const [droplists, setDroplists] = useState<any>({});
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const profileView = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [athorityName, setAthorityName] = useState<string[]>([]);
    const [athorityId, setAthorityId] = useState<string[]>([]);
    const [boundaryName, setBoundaryName] = useState<string[]>([]);
    const [boundaryId, setBoundaryId] = useState<string[]>([]);
    const [amnetiesName, setAmnetiesName] = useState<string[]>([]);
    const [amnetiesId, setAmnetiesId] = useState<string[]>([]);
    const [documentList, setDocumentList] = useState<any[]>([{
        "quoted_rent_price": '',
        "quoted_rent_price_ut": '355',
        "security_deposit": '',
        "escalation": '',
        "lock_in": '',
        "total_term": '',
    }]);

    const fetchLog = async (Id:any) => {
        const fetchLogList = await getLog(Id);
        setLogList(fetchLogList.output);
    }  
    
    const athorityChange = (event: SelectChangeEvent<typeof athorityName>) => {
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
    
        setAthorityId(id);    
        setAthorityName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const boundaryWallChange = (event: SelectChangeEvent<typeof boundaryName>) => {
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
    
        setBoundaryId(id);    
        setBoundaryName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const amnetiesChange = (event: SelectChangeEvent<typeof amnetiesName>) => {
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
    
        setAmnetiesId(id);    
        setAmnetiesName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const fetchLeads = async () => {
        const fetchLogList = await getPropertyLeads(propertyId.id);
        setLeadsList(fetchLogList.output);
    }

    const fetchTasks = async () => {
        const fetchLogList = await getPropertyTasks(propertyId.id);
        setTasksList(fetchLogList.output);
    }

    const {
        getRootProps,
        getInputProps,
      } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png','.pdf'],
        },
        onDrop: acceptedFiles => {
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
        });
        },
        // maxSize: 2097152,
    });   
    
    const saveFiles = async () => {
        if(files.length > 0){
            setIsFilesError(false);
            try {
                var formData = new FormData();
                formData.append('module_name', '3');
                for (var i = 0; i < files.length; i++) {
                    formData.append('uploadfiles', files[i]);
                } 

                const saveContactFiles = await uploadMultipleFileProperty(propertyId.id, formData)
                if(saveContactFiles.status == 200){
                  setFilesVal(saveContactFiles.output);
                  if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                    document.getElementById('propertyReloadBtnFilter')?.click();
                } else {
                    document.getElementById('propertyReloadBtn')?.click();
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

    const minimaximize = () => {
        setIsExpand(current => !current);
    }
    
    const fullScreenChange = () => {
        setIsFullScreen(current => !current);
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

    const siteVisitChange = (event: SelectChangeEvent<typeof siteVisitName>) => {
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
    
        setSiteVisitId(id);    
        setSiteVisitName(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const availableChange = (event: SelectChangeEvent<typeof availableName>) => {
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
    
        setAvailableId(id);
        setAvailableName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const notesList = async () => {
        const notesResponse = await getPropertyNotes(propertyId.id)
        setPropertyNoteList(notesResponse.output);
    }

    const filesList = async () => {
        const notesResponse = await getMultiImageProperty(propertyId.id)
        setFilesVal(notesResponse.output);
    }

    const replyOnSubmit = async (id:any) => {
        setParentId(id);
        let replyVal = (document.getElementById('child_reply'+id) as HTMLInputElement)!.value;
    
        if(replyVal != ''){
            setIsFormError(false);
            try {
                var notesBody = {
                    "reply": replyVal,
                    "module_id": propertyId.id,
                    "module_name": 3,
                    "parent_id": id
                };
                               
                const saveContactNotesData = await savePropertyNotes(notesBody)
        
                if(saveContactNotesData.status == 200){
                    if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                        document.getElementById('propertyReloadBtnFilter')?.click();
                    } else {
                        document.getElementById('propertyReloadBtn')?.click();
                    }
                  (document.getElementById('child_reply'+id) as HTMLInputElement).value = ''
                  setPropertyNoteList(saveContactNotesData.output);
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
            setIsFormError(true);
        }
    
    }
    console.log("dfklghiuerghirejrt", documentList);
    
    const FetchPropsDetails =  async (property : any) => {        
        setLoading(true);
        const response = await getPropertyDropdowns()
        setDroplists(response.output)
        setState(response.output?.state)       
        setCity(response.output?.city)
        const propRes = await getPropertyById(property.id)  
        
        setDocumentList(propRes.output[0]?.plot_unit_type != '' && propRes.output[0]?.plot_unit_type != null ? JSON.parse(propRes.output[0]?.plot_unit_type) : [{
            "quoted_rent_price": '',
            "quoted_rent_price_ut": '355',
            "security_deposit": '',
            "escalation": '',
            "lock_in": '',
            "total_term": '',
        }])
        // if(property.project_unit_type != null) {
        //     let FeaturesListData = JSON.parse(property.project_unit_type);
        //     for(let i = 0; i < FeaturesListData.length; i++) {
        //         formikunittype.setFieldValue('builtup_area_min'+i, FeaturesListData[i].builtup_area_min ?? '')
        //         formikunittype.setFieldValue('builtup_area_max'+i, FeaturesListData[i].builtup_area_max ?? '')
        //         formikunittype.setFieldValue('local_currency'+i, FeaturesListData[i].local_currency ?? '')
        //         formikunittype.setFieldValue('price_max'+i, FeaturesListData[i].price_max ?? '')
        //         formikunittype.setFieldValue('price_min'+i, FeaturesListData[i].price_min ?? '')
        //         formikunittype.setFieldValue('total_units'+i, FeaturesListData[i].total_units ?? '')
        //         formikunittype.setFieldValue('unit_type'+i, FeaturesListData[i].unit_type ?? '')
        //         formikunittype.setFieldValue('maintainance_cost'+i, FeaturesListData[i].maintainance_cost ?? '')
                
        //     }
        //     setFeaturesList(FeaturesListData);
        // } else {
        //     setFeaturesList([{ document: "" }]);
        // }
        setPropDetail(propRes.output[0]);
        setContactId(propRes.output[0]?.contact_id ?? '');
        formik.setFieldValue('contact_id', propRes.output[0]?.contact_id ?? '');
        // formik.setFieldValue('contact_id', propRes.output[0]?.contact_id ?? '');
        formik.setFieldValue('commission', propRes.output[0]?.commission ?? '');
        formik.setFieldValue('property_indepth', propRes.output[0]?.property_indepth ?? '');
        formik.setFieldValue('segment', propRes.output[0]?.segment ?? '');
        formik.setFieldValue('property_type', propRes.output[0]?.property_type ?? '');
        formik.setFieldValue('property_source', propRes.output[0]?.property_source ?? '');
        formik.setFieldValue('property_status', propRes.output[0]?.property_status ?? '');
        formik.setFieldValue('description', propRes.output[0]?.description ?? '');
        formik.setFieldValue('gst', propRes.output[0]?.gst ?? '');
        formik.setFieldValue('invoice_name', propRes.output[0]?.invoice_name ?? '');
        formik.setFieldValue('legal_approval', propRes.output[0]?.legal_approval ?? '');
        var availableForArray = [];
        var availableForNameArray = [];
        if(propRes.output[0]?.available_for != null){
            availableForArray = propRes.output[0]?.available_for.split(",").map((e:any) => {
                return parseInt(e);
            });
        }
        if(propRes.output[0]?.available_for_name != null){
            availableForNameArray = propRes.output[0]?.available_for_name.split(",").map((e:any) => {
                return e;
            });
        }
        setAvailableId(availableForArray);
        setAvailableName(availableForNameArray);
        
        formikAddress.setFieldValue('name_of_building', propRes.output[0]?.name_of_building ?? '');
        formikAddress.setFieldValue('address_line1', propRes.output[0]?.addressline1 ?? '');
        formikAddress.setFieldValue('address_line2', propRes.output[0]?.address_line2 ?? '');
        formikAddress.setFieldValue('country', propRes.output[0]?.country ?? '');
        formikAddress.setFieldValue('state', propRes.output[0]?.state ?? '');
        formikAddress.setFieldValue('city', propRes.output[0]?.city ?? '');
        formikAddress.setFieldValue('locality', propRes.output[0]?.locality ?? '');
        formikAddress.setFieldValue('pincode', propRes.output[0]?.pincode ?? '');
        formikAddress.setFieldValue('latitude', propRes.output[0]?.latitude ?? '');
        formikAddress.setFieldValue('longitude', propRes.output[0]?.longitude ?? '');
        formikAddress.setFieldValue('door_number', propRes.output[0]?.door_number ?? '');
        formikAddress.setFieldValue('module_number', propRes.output[0]?.module_number ?? '');

        formikFeatures.setFieldValue('plot_type', propRes.output[0]?.plot_type ?? '');
        formikFeatures.setFieldValue('plot_area', propRes.output[0]?.plot_area ?? '');
        formikFeatures.setFieldValue('plot_area_ut', propRes.output[0]?.plot_area_ut ?? '');
        formikFeatures.setFieldValue('fsi', propRes.output[0]?.fsi ?? '');
        formikFeatures.setFieldValue('frontage', propRes.output[0]?.frontage ?? '');
        formikFeatures.setFieldValue('frontage_ut', propRes.output[0]?.frontage_ut ?? '');
        formikFeatures.setFieldValue('dimensions', propRes.output[0]?.dimensions ?? '');
        formikFeatures.setFieldValue('dimensions_ut', propRes.output[0]?.dimensions_ut ?? '');
        formikFeatures.setFieldValue('road_width_min', propRes.output[0]?.road_width_min ?? '');
        formikFeatures.setFieldValue('road_width_min_ut', propRes.output[0]?.road_width_min_ut ?? '');
        formikFeatures.setFieldValue('road_width_max', propRes.output[0]?.road_width_max ?? '');
        formikFeatures.setFieldValue('road_width_max_ut', propRes.output[0]?.road_width_max_ut ?? '');
        formikFeatures.setFieldValue('corner_property', propRes.output[0]?.corner_property ?? '');
        // formikFeatures.setFieldValue('authority_approved', propRes.output[0]?.authority_approved ?? '');
        // formikFeatures.setFieldValue('boundary_wall', propRes.output[0]?.boundary_wall ?? '');
        formikFeatures.setFieldValue('current_status', propRes.output[0]?.current_status ?? '');
        // formikFeatures.setFieldValue('amenities', propRes.output[0]?.amenities ?? '');
        
        var amenitiesArray = [];
        var amenitiesNameArray = [];
        if(propRes.output[0]?.amenities != null){
            amenitiesArray = propRes.output[0]?.amenities.split(",").map((e:any) => {
                return parseInt(e);
            });
        }
        if(propRes.output[0]?.amenities_for_name != null){
            amenitiesNameArray = propRes.output[0]?.amenities_for_name.split(",").map((e:any) => {
                return e;
            });
        }
        setAmnetiesId(amenitiesArray);
        setAmnetiesName(amenitiesNameArray);

        setAssignToId(response.output?.assign_to?.filter((item:any) => property.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));

        var boundaryArray = [];
        var boundaryNameArray = [];
        if(propRes.output[0]?.boundary_wall != null){
            boundaryArray = propRes.output[0]?.boundary_wall.split(",").map((e:any) => {
                return parseInt(e);
            });
        }
        if(propRes.output[0]?.boundary_wall != null){
            boundaryNameArray = propRes.output[0]?.boundary_wall.split(",").map((e:any) => {
                if(e == 1) {                    
                    return 'No-'+e; 
                } else if(e == 2) {
                    return 'Yes-'+e;
                } else {
                    return 'Not Sure-'+e;
                }
            });
        }

        setBoundaryId(boundaryArray);
        setBoundaryName(boundaryNameArray);

        var authorityArray = [];
        var authorityNameArray = [];
        if(propRes.output[0]?.authority_approved != null){
            authorityArray = propRes.output[0]?.authority_approved.split(",").map((e:any) => {
                return parseInt(e);
            });
        }
        if(propRes.output[0]?.authority_approved != null){
            authorityNameArray = propRes.output[0]?.authority_approved.split(",").map((e:any) => {
                if(e == 1) {                    
                    return 'No-'+e; 
                } else if(e == 2) {
                    return 'Yes-'+e;
                } else {
                    return 'Not Sure-'+e;
                }
            });
        }

        setAthorityId(authorityArray);
        setAthorityName(authorityNameArray);

        formikFeatures.setFieldValue('property_highlight', property.property_highlight ?? '');
        formikFeatures.setFieldValue('rera_number', property.rera_number ?? '');
        formikFeatures.setFieldValue('completion_certificate', property.completion_certificate ?? '');
        setTimeout(() => setLoading(false), 1000);
    };


    const closeDialogue = () => {
        setDetailClicked(false);
        var offCanvasEl = document.getElementById('kt_expand'+propertyId.id);
        offCanvasEl?.classList.add('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.hide();
    }

    const imgViewChange = (id:any) => {
        console.log(id);
        setImgFullView(!imgFullView)
        setImgSelect(id)
    }

    const onDeleteFile = async (id:any) => {
        const deleteRes = await deleteMultiFileProperty(id, propertyId.id);
        if(deleteRes.status == 200){
            setFilesVal(deleteRes.output);
            if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                document.getElementById('propertyReloadBtnFilter')?.click();
            } else {
                document.getElementById('propertyReloadBtn')?.click();
            }
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const editOnSubmit = async (id:any) => {
        setParentId(id);
        let editVal = (document.getElementById('edit_field'+id) as HTMLInputElement)!.value;
    
        if(editVal != ''){
            setIsFormError(false);
            try {
                var userId = currentUser?.id;
              
                var notesBody = {
                    "reply": editVal,
                    "module_id": propertyId.id,
                    "module_name": 3,
                    "user_id": userId
                };
                               
                const editNotesData = await updatePropertyNotes(id, notesBody)
        
                if(editNotesData.status == 200){
                    if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                        document.getElementById('propertyReloadBtnFilter')?.click();
                    } else {
                        document.getElementById('propertyReloadBtn')?.click();
                    }
                  (document.getElementById('edit_field'+id) as HTMLInputElement).value = '';
                  setPropertyNoteList(editNotesData.output);
                  setNoteEditVal('');
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
            setIsFormError(true);
        }
    
    }

    const cancelEdit = async (id:any) => {
        setParentId('');
    }

    const replyEdit = async (id:any, val:any) => {
        setParentId(id);        
        setNoteEditVal(val);
    }

    const replyDelete = async (id:any, parentId:any) => {
        const deleteNotes = await deletePropertyNotes(id, parentId, propertyId.id);
        if(deleteNotes.status == 200){
            setPropertyNoteList(deleteNotes.output);
            if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                document.getElementById('propertyReloadBtnFilter')?.click();
            } else {
                document.getElementById('propertyReloadBtn')?.click();
            }
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
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
    
    const onPlanChange = (id:any, i:any, e:any) => {
        setUnitId(id)
        formikunittype.setFieldValue('unit_type'+i, e.target.value ?? '');
    }

    const onCurrencyChange = (id:any, i:any, e:any) => {
        setUnitId(id)
        formikunittype.setFieldValue('local_currency'+i, e.target.value ?? '');
    }
    
    const processFile = (e:any, index:any) => {
        var files = e.dataTransfer.files;
        let fields = files[0]['name'].split(".");
        var featureData = [];

        for(let i = 0; i < featuresList.length; i++){
            let fFileSec = (document.getElementById('file_'+i) as HTMLInputElement).value;

            if(index == i){
                fFileSec = files;
            }
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainanceCost = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainanceCost,
            }
            featureData.push(data);
        }
        setPlanData(featureData);
    }

    const allowDrop = (e:any, index:any) => {
        e.preventDefault();
    }
    

    const handleFilePreview = (e:any, index:any) => {
        let image_as_base64:any = URL.createObjectURL(e.target.files[index]);
        setPreviewClicked(image_as_base64);
        setPreviewClickedIndex(index);
        var featureData = [];

        for(let i = 0; i <= featuresList.length; i++){
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainanceCost = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainanceCost,
            }
            featureData.push(data);
        }
        setPlanData(featureData);
    }

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

    useEffect(() => {
        setLoading(true)
        if(propertyId) {
        FetchPropsDetails(propertyId);
        notesList();
        filesList();
        fetchLeads();
        fetchTasks();
        fetchLog(propertyId.id);
        }
    }, [propertyId]);

    const propertyUpdateSchema = Yup.object().shape({
        contact_id: Yup.string()
          .required('Contact name is required'),
        available_for: Yup.array(),
        commission: Yup.string(),
        property_indepth: Yup.string().required('Property In-depth is required'),
        segment: Yup.string(),
        property_type: Yup.string(),
        property_source: Yup.string(),
        property_status: Yup.string(),
        description: Yup.string(),
    })

    const propertyUpdateUnitTypeSchema = Yup.object().shape({
        unit_type: Yup.string(),
        builtup_area_min: Yup.string(),
        total_units: Yup.string(),
        maintainance_cost: Yup.string(),
        local_currency: Yup.string(),
        price_min: Yup.string(),
        price_max: Yup.string(),
        builtup_area_max: Yup.string(),
    })

    const propertyAddressUpdateSchema = Yup.object().shape({
        name_of_building: Yup.string(),
        address_line1: Yup.string(),
        country: Yup.string(),
        state: Yup.string(),
        city: Yup.string(),
        locality: Yup.string(),
        pincode: Yup.string(),
        latitude: Yup.string(),
        longitude: Yup.string(),
        door_number: Yup.string(),
        module_number: Yup.string(),
    })

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Enter a note first...'),        
      })

    const propertyFeaturesUpdateSchema = Yup.object().shape({
    })

    const formik = useFormik({
        initialValues,
        validationSchema: propertyUpdateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
        try {
        var formData = new FormData();

        formData.append('contact_id', values.contact_id);
        formData.append('available_for', availableId.join(',').toString());
        formData.append('assign_to', assignToId?.map((item:any) => item.id)?.join(',').toString());
        formData.append('commission', values.commission);
        formData.append('property_indepth', values.property_indepth);
        formData.append('segment', values.segment);
        formData.append('property_type', values.property_type);
        formData.append('property_source', values.property_source);
        formData.append('property_status', values.property_status);
        formData.append('description', values.description);
        formData.append('gst', values.gst);
        formData.append('invoice_name', values.invoice_name);
        formData.append('legal_approval', values.legal_approval);
        formData.append('project_unit_type', propertyId.project_unit_type);
        profileImage && formData.append('profile_image', profileImage!);

        const updatePropData = await updateProperty(propertyId.id ,formData);
        if(updatePropData.status == 200) {
            setLoading(false);
            setDetailClicked(false);
            setDetailsClicked(false);
            if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                document.getElementById('propertyReloadBtnFilter')?.click();
            } else {
                document.getElementById('propertyReloadBtn')?.click();
            }
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
    }})

    const handleunits = (unitList:any) => {
        var units:any[] = [];
            
            for(let i = 0; i < featuresList.length; i++){
                let body = {
                    'unit_type' : unitList['unit_type'+i] != undefined ? unitList['unit_type'+i] : 1,
                    'builtup_area_min' : unitList['builtup_area_min'+i],
                    'builtup_area_max' : unitList['builtup_area_max'+i],
                    'total_units' : unitList['total_units'+i],
                    'maintainance_cost' : unitList['maintainance_cost'+i],
                    'local_currency' : unitList['local_currency'+i] != undefined ? unitList['local_currency'+i] : 1,
                    'price_min' : unitList['price_min'+i],
                    'price_max' : unitList['price_max'+i],
                }
            units.push(body);
        }
        return units;
    }

    const formikunittype = useFormik({
        initialValues,
        validationSchema: propertyUpdateUnitTypeSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        try {
            const body = {
                "plot_unit_type": JSON.stringify(documentList)
            }
    
            const updatePropData = await updatePropertyUnitType(propertyId.id ,body);
            if(updatePropData.status == 200){
                setLoading(false);
                setDetailClicked(false);
                document.getElementById('kt_expand_close')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }

        } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        }
    }})

    const formikAddress = useFormik({
        initialValues,
        validationSchema: propertyAddressUpdateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true);
        try {
        var userId = currentUser?.id;

        const body = {
            "name_of_building": values.name_of_building,
            "address_line1": values.address_line1,
            "country": values.country,
            "state": values.state,
            "city": values.city,
            "locality": values.locality,
            "pincode": values.pincode,
            "latitude": values.latitude,
            "longitude": values.longitude,
            "door_number": values.door_number,
            "module_number": values.module_number,
            "created_by": userId
        }

        const updatePropAddressData = await updatePropertyAddress(propertyId.id ,body);
        if(updatePropAddressData != null){
            setLoading(false);
            setDetailClicked(false);
            document.getElementById('kt_expand_close')?.click();
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
    }})

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setLoading(true)
          try {
            var notesBody = {
                "reply": values.reply,
                "module_id": propertyId.id,
                "module_name": 3,
                "parent_id": 0 
            };
                           
            const leadNotesData = await savePropertyNotes(notesBody)
            if(leadNotesData.status == 200){
                resetForm();
                setPropertyNoteList(leadNotesData.output);
                if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                    document.getElementById('propertyReloadBtnFilter')?.click();
                } else {
                    document.getElementById('propertyReloadBtn')?.click();
                }
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
    
    const formikFeatures = useFormik({
        initialValues,
        validationSchema: propertyFeaturesUpdateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        try {
        const reqbody = {
            "plot_type": values.plot_type,
            "plot_area": values.plot_area,
            "plot_area_ut": values.plot_area_ut,
            "fsi": values.fsi,
            "frontage": values.frontage,
            "frontage_ut": values.frontage_ut,
            "dimensions": values.dimensions,
            "dimensions_ut": values.dimensions_ut,
            "road_width_min": values.road_width_min,
            "road_width_min_ut": values.road_width_min_ut,
            "road_width_max": values.road_width_max,
            "road_width_max_ut": values.road_width_max_ut,
            "corner_property": values.corner_property,
            "authority_approved": values.authority_approved,
            "boundary_wall": values.boundary_wall,
            "current_status": values.current_status,
            "amenities": amnetiesId.join(',').toString(),
            
            // "no_of_floors": values.no_of_floors,
            // "no_of_units_min": values.no_of_units_min,
            // "no_of_units_max": values.no_of_units_max,
            // "unit_type_min": values.unit_type_min,
            // "unit_type_max": values.unit_type_max,
            // "ownership_type": values.ownership_type,
            // "balcony": values.balcony,
            // "property_facing": values.property_facing,
            // "kitchen_type": values.kitchen_type,
            // "flooring": values.flooring,
            // "vasthu_compliant": values.vasthu_compliant,
            // "currently_under_loan": values.currently_under_loan,
            // "available_from": values.available_from,
            // "site_visit_preference": siteVisitData,
            // "key_custody": values.key_custody,
            // "no_of_car": values.no_of_car,
            // "car_park_type": values.car_park_type,
            // "water_supply": values.water_supply,
            // "gated_community": values.gated_community,
            // "amenities": aminityId.join(',').toString(),
            // "property_highlight": values.property_highlight,
            // "rera_registered": values.rera_registered,
            // "rera_number": values.rera_number,
            // "completion_certificate": values.completion_certificate

            // plot_type
            // plot_area
            // plot_area_ut
            // fsi
            // frontage
            // frontage_ut
            // dimensions
            // dimensions_ut
            // road_width_min
            // road_width_min_ut
            // road_width_max
            // road_width_max_ut
            // corner_property
            // authority_approved
            // boundary_wall
            // current_status
            // amenities
            // plot_unit_type
        }

        const updatePropFeaturesData = await updatePropertyPlot(propertyId.id, reqbody);

        if(updatePropFeaturesData.status == 200){
            if(body.available_for || body.project || body.amenities || body.commission_min || body.commission_max || body.property_type || body.property_source || body.property_status || body.legal_approval || body.property_indepth || body.country || body.state || body.city || body.segment || body.zip_code || body.locality || body.age_of_property || body.property_facing || body.project_stage || body.gated_community || body.vasthu_compliant || body.no_of_units_min || body.no_of_units_max || body.no_of_floors_min || body.no_of_floors_max || body.rera_registered || body.created_date || body.created_end_date || body.available_start_date || body.available_end_date || body.created_by) {
                document.getElementById('propertyReloadBtnFilter')?.click();
            } else {
                document.getElementById('propertyReloadBtn')?.click();
            }
            setDetailClicked(false);
            document.getElementById('kt_expand_close')?.click();
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else {
            throw "server error";
        }
        } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('propertyErrMsg');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
        }
    }})

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

      const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['jpeg','jpg']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
      }
      
      const handleProfileImagePreview = (e:any) => {
          if(e.target.files[0].size > 2097152){
            var toastEl = document.getElementById('contactImgSizeErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            (document.getElementById('contact_image_add') as HTMLInputElement).value = '';
            return;
          } else {
          const file = e.target.files[0];
          if(isValidFileUploaded(file)){
            let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
            let image_as_files:any = e.target.files[0];
            setProfileImagePreview(image_as_base64);
            setProfileImage(image_as_files);
          }else{
            (document.getElementById('contact_image_add') as HTMLInputElement).value = '';
            var toastEl = document.getElementById('contactImgFormatErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
          }}
      }
    
      const removeProfile = () => {
        if(profileView.current != null){
          setProfileImagePreview(null);
          setProfileImage(null);
          profileView.current.value = "";
        }
      }

      const handleDocumentAdd = async (index:any) => {
        setDocumentList((post) => [...post, {
            "quoted_rent_price": '',
            "quoted_rent_price_ut": '355',
            "security_deposit": '',
            "escalation": '',
            "lock_in": '',
            "total_term": '',
        }])
    };

    const handleDocumentRemove = async (index:any) => {
        const newArray = [...documentList];
        newArray.splice(index, 1);
        console.log("fjheyrgeihrberhoijfdlm", newArray);
        
        setDocumentList(newArray);
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

    return(
        <div className={isExpand ? isFullScreen ? "w-100 contact_details_page full_screen" : "w-75 ms-auto contact_details_page full_screen p-8": "contact_details_page small_screen d-flex align-items-end justify-content-end p-8"}>
            { loading ? 
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
                                <button className="btn mx-3 minimize_btn" onClick={minimaximize}>
                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/minimize_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button 
                                    type='button'
                                    className='btn  me-n5 mx-3 close_btn'
                                    id='kt_property_add_form_close'
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setDetailsClicked(false)}                                  
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
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/propertySample.jpg') }} src={propDetail.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/property/profile_image/'+propDetail.id+'/'+propDetail.profile_image : ''} className="user_img" alt='' />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <div className="col-sm-6 d-flex justify-content-between">
                                                        <div>
                                                            <div className="d-flex">
                                                                <h5 className="mb-0 ms-2 mb-2">{propDetail.developer_name ?? 'Company name'}</h5>
                                                            </div>
                                                            <p className="mb-0 ms-2">{propDetail.name_of_building ?? 'Project Name'}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center me-2 mt-2">
                                                            <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} alt="" className="icon me-2"/>
                                                            <p className="ml-2 mb-0 fixed_text">{propDetail.contact_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 d-flex align-items-center justify-content-end">
                                                        <a href={"mailto:"+ propDetail.email} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                        <a href={"tel:"+ propDetail.mobile} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                        {/* <a href="#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a> */}
                                                        <a href={"https://api.whatsapp.com/send?phone=" + propDetail.mobile} target='blank' className="btn_soft_primary">
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
                                            <div className="col-md-4 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                                <p className="mb-0">{propertyId.email}</p>
                                            </div>
                                            <div className="col-md-4 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                                <p className="mb-0">{propertyId.mobile}</p>
                                            </div>
                                            {/* <div className="col-md-4 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'contact_category'})}</small>
                                                <p className="mb-0">{propertyId.contact_category_name}</p>
                                            </div> */}
                                            <div className="col-md-4 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                <p className="mb-0">{propertyId.created_by_name}</p>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab_container bg_white br_10 bs_1">
                        <div className="row mt-4">
                            <div className="col-12">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'overview' ? "nav-link active" : "nav-link"} id={"overview-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#overview"+propertyId.id} type="button" role="tab" aria-controls="overview" aria-selected="true">{intl.formatMessage({id: 'overview'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'notes' ? "nav-link active" : "nav-link"} id={"notes-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#notes"+propertyId.id} type="button" role="tab" aria-controls="notes" aria-selected="false">{intl.formatMessage({id: 'notes'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'files' ? "nav-link active" : "nav-link"} id={"files-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#files"+propertyId.id} type="button" role="tab" aria-controls="files" aria-selected="false">{intl.formatMessage({id: 'files'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'message' ? "nav-link active" : "nav-link"} id={"message-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#message"+propertyId.id} type="button" role="tab" aria-controls="message" aria-selected="false">{intl.formatMessage({id: 'messages'})}</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id={"address-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#address"+propertyId.id} type="button" role="tab" aria-controls="address" aria-selected="false">{intl.formatMessage({id: 'project_address'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id={"features-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#features"+propertyId.id} type="button" role="tab" aria-controls="features" aria-selected="false">{intl.formatMessage({id: 'project_features'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id={"features-list-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#features-list"+propertyId.id} type="button" role="tab" aria-controls="features-list" aria-selected="false">{intl.formatMessage({id: 'project_unit_list'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'leads' ? "nav-link active" : "nav-link"} id={"leads-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#leads"+propertyId.id} type="button" role="tab" aria-controls="leads" aria-selected="false">{intl.formatMessage({id: 'leads'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'tasks' ? "nav-link active" : "nav-link"} id={"tasks-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#tasks"+propertyId.id} type="button" role="tab" aria-controls="tasks" aria-selected="false">{intl.formatMessage({id: 'tasks'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'timeline' ? "nav-link active" : "nav-link"} id={"timeline-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#timeline"+propertyId.id} type="button" role="tab" aria-controls="timeline" aria-selected="false">{intl.formatMessage({id: 'activity_timeline'})}</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={tabInfo == 'overview' ? "tab-pane fade show active": "tab-pane fade"} id={"overview"+propertyId.id} role="tabpanel" aria-labelledby={"overview-tab"+propertyId.id}>
                                        <form noValidate onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="d-flex justify-content-center">
                                                    {profileImagePreview != null && (
                                                    <div className='profile_preview position-relative image-input image-input-outline'>
                                                        <img src={profileImagePreview} alt="image preview" className='image-input-wrapper w-125px h-125px' height={100} width={100}/>
                                                        <div onClick={removeProfile} className="p-1">
                                                        <KTSVG
                                                            path='/media/icons/duotune/general/gen040.svg'
                                                            className='svg-icon-3 cursor_pointer bg-white position-absolute p-0 top-0 m-2 end-0 rounded-circle svg-icon-danger pe-auto ms-2'
                                                        />
                                                        </div>
                                                    </div>
                                                    )}
                                                    </div>
                                                    <div className="d-flex justify-content-center mb-5">
                                                        <span className="btn btn-file">
                                                            <KTSVG
                                                            path='/media/icons/duotune/files/fil022.svg'
                                                            className='svg-icon-1 text_primary ms-2'
                                                            />
                                                            <p className='text_primary'>{intl.formatMessage({id: 'upload_profile_image'})}</p>
                                                            <small className='text-dark required' >Note: jpg, jpeg only acceptable</small>
                                                            <input type="file" accept="image/*" className='form-control' id='contact_image_add' name="profile_image" ref={profileView} onChange={handleProfileImagePreview}/>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'cntact_person'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('contact_id')}>
                                                        <option value=''>Select</option>
                                                            {droplists.contact_list?.map((contactsVal:any,i:any) =>{
                                                                return (
                                                                    <option value={contactsVal.id} key={i}>{contactsVal.first_name+' '+contactsVal.last_name}</option> 
                                                            )})}
                                                        </select> */}
                                                        <ReactSelect
                                                        options={droplists.contact_list}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={droplists.contact_list?.find((item:any) => contactId == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            formik.setFieldValue('contact_id', val.id ?? '');
                                                            setContactId(val.id);
                                                        }}
                                                        placeholder={"contact.."}
                                                        />
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
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_indepth'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select {...formik.getFieldProps('property_indepth')}
                                                            className={clsx(
                                                            'btn btn-sm w-100 text-start form-select',
                                                            {
                                                                'is-invalid': formik.touched.property_indepth && formik.errors.property_indepth,
                                                            },
                                                            {
                                                                'is-valid': formik.touched.property_indepth && !formik.errors.property_indepth,
                                                            }
                                                            )} name="property_indepth" >
                                                                <option value=''>Select</option>
                                                            {droplists.property_indepth?.map((propertyInDepthVal:any,i:any) =>{
                                                                return (
                                                                <option value={propertyInDepthVal.id} key={i}>{propertyInDepthVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                    {formik.touched.property_indepth && formik.errors.property_indepth && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.property_indepth}</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_for'})}</label>
                                                    <FormControl sx={{ m: 0, width: "100%", mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={availableName}
                                                            onChange={availableChange}
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
                                                                return <p>{intl.formatMessage({id: 'available_for'})}</p>;
                                                                }
                                                                return(
                                                                    <ul className='m-0'>
                                                                      {name?.map((data, i) => {
                                                                        return(
                                                                          <li key={i}>{data}</li>
                                                                        )
                                                                      })}                                          
                                                                    </ul>
                                                                )}}
                                                            className='multi_select_field form-control'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                            <MenuItem disabled value="">
                                                                <em>{intl.formatMessage({id: 'available_for'})}</em>
                                                            </MenuItem>
                                                            {droplists.available_for?.map((available:any) => (
                                                                <MenuItem
                                                                key={available.id}
                                                                value={available.option_value+ '-' +available.id}
                                                                style={getStyles(available.option_value, availableName, theme)}
                                                                >
                                                                {available.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3 edit_page_form">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'assign_to'})}</label>
                                                {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
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
                                                            return(
                                                                <ul className='m-0'>
                                                                  {name?.map((data, i) => {
                                                                    return(
                                                                      <li key={i}>{data}</li>
                                                                    )
                                                                  })}                                          
                                                                </ul>
                                                            )}}
                                                        className='multi_select_field form-control'
                                                        MenuProps={MenuProps}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                        <MenuItem disabled value="">
                                                            <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                                        </MenuItem>
                                                        {droplists.assign_to?.map((assignVal:any) => (
                                                            <MenuItem
                                                            key={assignVal.id}
                                                            value={assignVal.first_name+' '+assignVal.last_name+'-'+assignVal.id}
                                                            style={getStyles(assignVal.first_name+' '+assignVal.last_name, assignToName, theme)}
                                                            >
                                                            {assignVal.first_name+' '+assignVal.last_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    </FormControl> */}
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <ReactSelect
                                                        isMulti
                                                        options={droplists.assign_to}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={droplists.assign_to?.filter( (item:any) => assignToId?.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setAssignToId(val);                                              
                                                        }}
                                                        placeholder={"Assign-to.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'commission'})}</label>
                                                    <div className="input-group mb-3 input_prepend bs_2">
                                                        <input type="text" className="form-control" {...formik.getFieldProps('commission')} onChange={(e) => {
                                                            const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                            const inputValue = e.target.value;
                                                            var area;                                                
                                                            if (!regex.test(inputValue)) {
                                                                area = inputValue.slice(0, -1);
                                                            } else {
                                                                area = inputValue;
                                                            }
                                                            formik.setFieldValue("commission", area)}} maxLength={16} />
                                                        <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('commission_unit')}>
                                                            <option value="1">%</option>
                                                            <option value="2">₹</option>
                                                        </select>
                                                    </div> 
                                                </div>                                                 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'segment'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                                        <option value=''>Select</option>
                                                            {droplists.segment?.map((segmentVal:any,i:any) =>{
                                                                return (
                                                                    <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_type'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('property_type')}>
                                                        <option value=''>Select</option>
                                                            {droplists.property_type?.map((propertyVal:any,i:any) =>{
                                                                return (
                                                                    <option value={propertyVal.id} key={i}>{propertyVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_status'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('property_status')}>
                                                        <option value=''>Select</option>
                                                            {droplists.property_status?.map((propertyStatusVal:any,i:any) =>{
                                                                return (
                                                                    <option value={propertyStatusVal.id} key={i}>{propertyStatusVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>  */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_source'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('property_source')}>
                                                        <option value=''>Select</option>
                                                            {droplists.property_source?.map((propertySourceVal:any,i:any) =>{
                                                                return (
                                                                    <option value={propertySourceVal.id} key={i}>{propertySourceVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formik.getFieldProps('gst')} placeholder="GST"/>
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'legal_approval'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('legal_approval')}>
                                                        <option value='0'>Select</option>
                                                            {droplists.legal_approval?.map((Val:any,i:any) =>{
                                                                return (
                                                                    <option value={Val.id} key={i}>{Val.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoicing_name'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formik.getFieldProps('invoice_name')} placeholder="Invoicing Name"/>
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'description'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <textarea
                                                            className='form-control border-0 p-2 resize-none min-h-25px br_10'
                                                            data-kt-autosize='true'
                                                            {...formik.getFieldProps('description')} 
                                                            rows={7}
                                                            placeholder='Description'
                                                        ></textarea>
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
                                    <div className={tabInfo == 'notes' ? "tab-pane fade show active": "tab-pane fade"} id={"notes"+propertyId.id} role="tabpanel" aria-labelledby={"notes-tab"+propertyId.id}>
                                    <div className="card mb-5 mb-xl-8">
                                            <div className='card-body pb-0'>
                                            <div className='main_bg px-lg-5 px-4 pt-4 pb-1 mb-5'>
                                                    {/* <div className='d-flex align-items-center mb-3'>
                                                    
                                                        <div className='d-flex align-items-center flex-grow-1'>
                                                            <div className='d-flex flex-column'>
                                                                <h3 className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                    {intl.formatMessage({id: 'add_note'})}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                    <form noValidate onSubmit={formikNotes.handleSubmit}>
                                                        <div className='position-relative mb-3 pb-4 border-bottom border-secondary'>
                                                            <input {...formikNotes.getFieldProps('reply')}
                                                                className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                data-kt-autosize='true'
                                                                placeholder={intl.formatMessage({id: 'add_note'})+"..."}
                                                            ></input>
                                                            <div className='position-absolute top-0 end-0'>
                                                                <button type='submit' disabled={formikNotes.isSubmitting} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                </button>
                                                            </div>
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
                                                    {PropertyNoteList.map((propertyNote, i) => {
                                                        return (
                                                            <div className='mb-5' key={propertyNote.id}>
                                                                {propertyNote.reply1 == 'NO'
                                                                ? <div className='note_question'>
                                                                    <div className='d-flex align-items-center mb-3'>
                                                                        <div className='d-flex align-items-center flex-grow-1'>
                                                                            <div className='symbol symbol-45px me-5'>

                                                                            {/* <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/300-6.jpg') }} src={propertyNote.user_profile_image != '' ? propertyNote.user_profile_image ?? toAbsoluteUrl('/media/avatars/300-6.jpg') : toAbsoluteUrl('/media/avatars/300-6.jpg')} alt='' /> */}

                                                                            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={propertyNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+propertyNote.user_id+'/'+propertyNote.user_profile_image : ''} className="user_img" alt='' />

                                                                            </div>
                                                                            <div className='d-flex flex-column'>
                                                                            <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                                {propertyNote.user_name ?? 'User'}
                                                                            </a>
                                                                            <span className='text-gray-400 fw-bold'>{Moment(propertyNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mb-7 pb-5 border-bottom border-secondary d-flex justify-content-between'>
                                                                        { noteEditVal != '' && parentId == propertyNote.id ?
                                                                            <div className='text-gray-800 position-relative w-75'>
                                                                                <input
                                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                    data-kt-autosize='true'
                                                                                    placeholder='Reply..'
                                                                                    id={'edit_field'+propertyNote.id}
                                                                                    defaultValue={noteEditVal}
                                                                                ></input>
                                                                            </div>
                                                                            : 
                                                                            <div className='text-gray-800'>
                                                                             {propertyNote.reply}
                                                                            </div>
                                                                            }
                                                                            { currentUser?.designation == 1 &&
                                                                            <span>
                                                                                { noteEditVal != '' && parentId == propertyNote.id ?
                                                                                <><button type='button' onClick={() => cancelEdit(propertyNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                </button>
                                                                                <button type='button' onClick={() => editOnSubmit(propertyNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                </button></>:
                                                                                <button type='button' onClick={() => replyEdit(propertyNote.id, propertyNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                                </button>}
                                                                                {currentUser?.designation == 1 && <button type='button'
                                                                                data-bs-toggle='modal'
                                                                                data-bs-target={'#delete_note_popup'+propertyNote.id} 
                                                                                className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                                </button> }
                                                                            </span>}
                                                                            <div className='modal fade' id={'delete_note_popup'+propertyNote.id} aria-hidden='true'>
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
                                                                                                <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(propertyNote.id, propertyNote.parent_id)}>
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
                                                                            {/* <img src={propertyNote.user_profile_image != '' ? propertyNote.user_profile_image ?? toAbsoluteUrl('/media/avatars/300-6.jpg') : toAbsoluteUrl('/media/avatars/300-6.jpg')} alt='' /> */}

                                                                            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={propertyNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+propertyNote.user_id+'/'+propertyNote.user_profile_image : ''} className="user_img" alt='' />

                                                                        </div>
        
                                                                        <div className='d-flex flex-column flex-row-fluid'>
                                                                        <div className='d-flex align-items-center flex-wrap mb-1'>
                                                                            <a href='#' className='text-gray-800 text-hover-primary fw-bolder me-2'>
                                                                            {propertyNote.user_name ?? 'User'}
                                                                            </a>
        
                                                                            <span className='text-gray-400 fw-bold fs-7'>{Moment(propertyNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                        </div>
                                                                        
                                                                        <div className=' d-flex justify-content-between'>                                            
                                                                            { noteEditVal != '' && parentId == propertyNote.id ?
                                                                            <div className='text-gray-800 position-relative w-75'>
                                                                                <input
                                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                    data-kt-autosize='true'
                                                                                    placeholder='Reply..'
                                                                                    id={'edit_field'+propertyNote.id}
                                                                                    defaultValue={noteEditVal}
                                                                                ></input>
                                                                            </div>
                                                                            : 
                                                                            <div className='text-gray-800'>
                                                                             {propertyNote.reply}
                                                                            </div>
                                                                            } 
                                                                                <span>
                                                                                { currentUser?.designation == 1 &&
                                                                            <span>
                                                                                { noteEditVal != '' && parentId == propertyNote.id ?
                                                                                <>
                                                                                <button type='button' onClick={() => cancelEdit(propertyNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                </button>
                                                                                <button type='button' onClick={() => editOnSubmit(propertyNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                </button>
                                                                                    </>:
                                                                                <button type='button' onClick={() => replyEdit(propertyNote.id, propertyNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                                </button>}
                                                                                {currentUser?.designation == 1 && <button type='button'
                                                                                data-bs-toggle='modal'
                                                                                data-bs-target={'#delete_note_popup2'+propertyNote.id} 
                                                                                className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                                </button> }
                                                                            </span>}
                                                                                </span>
                                                                            </div>                                                                    
                                                                        </div>
                                                                        <div className='modal fade' id={'delete_note_popup2'+propertyNote.id} aria-hidden='true'>
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
                                                                                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(propertyNote.id, propertyNote.parent_id)}>
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
                                                                {propertyNote.reply1 == 'NO' && 
                                                                <>
                                                                <div className='position-relative mb-6'>
                                                                    <input
                                                                        className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                        data-kt-autosize='true'
                                                                        placeholder='Reply..'
                                                                        id={'child_reply'+propertyNote.id}
                                                                    ></input>                                                                        
                                                                    <div className='position-absolute top-0 end-0 me-n5'>        
                                                                        <button type='button' onClick={() => replyOnSubmit(propertyNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {isFormError && propertyNote.id == parentId && (
                                                                    <div className='fv-plugins-message-container'>
                                                                        <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger'>{intl.formatMessage({id: 'reply_need_to_fill'})}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                </>
                                                                }                                                                    
                                                                <div className='separator mb-4'></div>
                                                        </div>)})}                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'files' ? "tab-pane fade show active": "tab-pane fade"} id={"files"+propertyId.id} role="tabpanel" aria-labelledby={"files-tab"+propertyId.id}>
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
                                        <aside className='d-flex flex-wrap'>
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
                                        {filesVal.length > 0 && <>
                                        <div className='main_bg p-4 mb-9 rounded'>
                                            
                                            <h4>{intl.formatMessage({id: 'files'})}</h4>
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
                                                                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/svg/files/doc.svg') }} src={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+file.module_id+'/'+file.file} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    :
                                                                    <a className="symbol symbol-75px" href={process.env.REACT_APP_API_BASE_URL+'uploads/property/files/'+file.property_id+'/'+file.file} download target="_blank">
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
                                    </div></>}
                                    </div>
                                    <div className={tabInfo == 'message' ? "tab-pane fade show active": "tab-pane fade"} id={"message"+propertyId.id} role="tabpanel" aria-labelledby={"message-tab"+propertyId.id}>
                                    <ul className="nav nav-pills mb-3 message_tabs" id={"pills-tab"+propertyId.id} role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id={"pills-mail-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#pills-mail"+propertyId.id} type="button" role="tab" aria-controls="pills-mail" aria-selected="true">{intl.formatMessage({id: 'email'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-whatsapp-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#pills-whatsapp"+propertyId.id} type="button" role="tab" aria-controls="pills-whatsapp" aria-selected="false">{intl.formatMessage({id: 'whatsapp'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-sms-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#pills-sms"+propertyId.id} type="button" role="tab" aria-controls="pills-sms" aria-selected="false">{intl.formatMessage({id: 'sms'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-calls-tab"+propertyId.id} data-bs-toggle="pill" data-bs-target={"#pills-calls"+propertyId.id} type="button" role="tab" aria-controls="pills-calls" aria-selected="false">{intl.formatMessage({id: 'calls'})}</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent position-relative">
                                            <div className="tab-pane fade show active" id={"pills-mail"+propertyId.id} role="tabpanel" aria-labelledby="pills-mail-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                {/* <div className="col-lg-1  d-flex align-items-center justify-content-lg-center my-2">
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                                    </div>
                                                                </div> */}
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
                                                <div data-bs-toggle='modal' data-bs-target={'#mail_template_popup'}>                                                
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
                                                            <div className="input-group bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group bs_2-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        // <li key={`${item.title}-${item.title}`}>{item.title}</li>
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                                                        {/* <KTSVG
                                                                        path='/media/custom/save_white.svg'
                                                                        className='svg-icon-3 svg-icon-primary ms-2'
                                                                        /> */}
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
                                            <div className="tab-pane fade" id={"pills-whatsapp"+propertyId.id} role="tabpanel" aria-labelledby="pills-whatsapp-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                {/* <div className="col-lg-1 align-items-center d-flex justify-content-lg-center my-2">
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                                    </div>
                                                                </div> */}
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
                                                <div data-bs-toggle='modal' data-bs-target={'#watsapp_template_popup'}>
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
                                                            <div className="input-group bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group bs_2-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        // <li key={`${item.title}-${item.title}`}>{item.title}</li>
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                                                        {/* <KTSVG
                                                                        path='/media/custom/save_white.svg'
                                                                        className='svg-icon-3 svg-icon-primary ms-2'
                                                                        /> */}
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
                                            <div className="tab-pane fade" id={"pills-sms"+propertyId.id} role="tabpanel" aria-labelledby="pills-sms-tab">
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
                                                <div data-bs-toggle='modal' data-bs-target={'#sms_template_popup'}>
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
                                                            <div className="input-group bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group bs_2-append">
                                                                        <button className="btn btn-secondary" type="button">
                                                                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <ul className="nav mb-1 d-block list_template">
                                                                {!search
                                                                    ? allTemplatesMail.map((item) => (
                                                                        // <li key={`${item.title}-${item.title}`}>{item.title}</li>
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                                                                <div className="input-group bs_2">
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
                                            <div className="tab-pane fade" id={"pills-calls"+propertyId.id} role="tabpanel" aria-labelledby="pills-calls-tab">
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
                                                <div>
                                                <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted rounded-circle svg-icon-4hx position-absolute bottom-0 end-0 mb-9 me-9 text_primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id={"address"+propertyId.id} role="tabpanel" aria-labelledby={"address-tab"+propertyId.id}>
                                        <form noValidate onSubmit={formikAddress.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('name_of_building')} />
                                                    </div> 
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module_number'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('module_number')}  placeholder="Enter Module Number"/>
                                                    </div>
                                                </div> 
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'door_no'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('address_line1')} placeholder="Enter Door Number"/>
                                                    </div>
                                                </div>  */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('address_line2')} placeholder="Enter address line"/>
                                                    </div>
                                                </div>                                                 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="input-group bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('country')} onChange={async (e) => {
                                                            formikAddress.setFieldValue("country", e.target.value);
                                                            let states = droplists.state?.filter((state:any) => e.target.value == state.country_id);
                                                            setState(states);
                                                            formikAddress.setFieldValue("state", '');
                                                            formikAddress.setFieldValue("city", '');
                                                            setCity([]);
                                                        }} >
                                                            <option disabled value="">Select</option>
                                                            {droplists.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                        <div className="input-group bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('state')} onChange={async (e) => {
                                                            formikAddress.setFieldValue("state", e.target.value);                                               
                                                            let cities = droplists.city?.filter((city:any) => e.target.value == city.state_id);
                                                            setCity(cities);
                                                        }} >
                                                            <option disabled value="">Select</option>
                                                            {state?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div>  
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                        <div className="input-group bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('city')}>
                                                            <option disabled value="">Select</option>
                                                            {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-3 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zip_code'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('pincode')}  placeholder="Zip Code"/>
                                                    </div>
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('locality')} placeholder="Enter Area Name"/>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-3 mb-2">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'latitude'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend mx-1">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('latitude')} placeholder="Latitude"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-3 mb-2">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'longtitude'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend mx-1">
                                                        <input type="text" className="form-control" {...formikAddress.getFieldProps('longitude')} placeholder="Longitude"/>
                                                    </div>
                                                </div> */}
                                                <div className="col-12 d-flex justify-content-center mb-4">
                                                    <button
                                                        type='submit'
                                                        id='kt_sign_up_submit3'
                                                        className='btn btn_primary text-primary'
                                                        disabled={formikAddress.isSubmitting}
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
                                    <div className="tab-pane fade" id={"features"+propertyId.id} role="tabpanel" aria-labelledby={"features-tab"+propertyId.id}>
                                        <form noValidate onSubmit={formikFeatures.handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_type'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend py-1">
                                                        <select 
                                                            {...formikFeatures.getFieldProps('plot_type')} 
                                                            className="btn btn-sm w-100 text-start form-select">
                                                                <option value=''>Select</option>
                                                                {droplists.plot_type?.map((projectStageVal:any,i:any) =>{
                                                                    return (
                                                                        <option value={projectStageVal.id} key={i}>{projectStageVal.option_value}</option> 
                                                                )})}
                                                        </select>
                                                    </div>
                                                </div> 
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikFeatures.getFieldProps('plot_area')} onChange={(e) => formikFeatures.setFieldValue("plot_area", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                                        <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formikFeatures.getFieldProps('plot_area_ut')}>
                                                            {droplists.area_units?.map((furnishStatusVal:any,i:any) => {
                                                                return (
                                                                    <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fsi'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikFeatures.getFieldProps('fsi')} onChange={(e) => formikFeatures.setFieldValue("fsi", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'frontage'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikFeatures.getFieldProps('frontage')} onChange={(e) => formikFeatures.setFieldValue("frontage", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                                        <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formikFeatures.getFieldProps('frontage_ut')}>
                                                            {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                return (
                                                                    <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'dimensions'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikFeatures.getFieldProps('dimensions')} onChange={(e) => formikFeatures.setFieldValue("dimensions", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                                        <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formikFeatures.getFieldProps('dimensions_ut')} >
                                                            {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                return (
                                                                    <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div> 
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'road_width'})}</label>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="input-group bs_2 first mb-3 input_prepend">
                                                                <input type="text" {...formikFeatures.getFieldProps('road_width_min')} onChange={(e) => formikFeatures.setFieldValue("road_width_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={10} className="form-control" />
                                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formikFeatures.getFieldProps('road_width_min_ut')}>
                                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                    return (
                                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                )})}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="input-group bs_2 first mb-3 input_prepend">
                                                                <input type="text" {...formikFeatures.getFieldProps('road_width_max')} onChange={(e) => formikFeatures.setFieldValue("road_width_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" />
                                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formikFeatures.getFieldProps('road_width_max_ut')}>
                                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                    return (
                                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                                )})}
                                                                </select>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'corner_property'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <select className="btn btn-sm w-100 text-start form-select" {...formikFeatures.getFieldProps('corner_property')}>                     
                                                            <option value="">select</option>
                                                            <option value="1">Yes</option>
                                                            <option value="2">No</option>
                                                            <option value="3">Not Sure</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'authority_approved'})}</label>
                                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={athorityName}
                                                            onChange={athorityChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                for(let i = 0; i < selected.length; i++){
                                                                var fields = selected[i].split('-');
                                                                var n = fields[0];
                                                                name.push(n);
                                                                }
                                                                if (selected.length === 0) {
                                                                return <p>{intl.formatMessage({id: 'authority_approved'})}</p>;
                                                                }
                                                                return(
                                                                    <ul className='m-0'>
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
                                                                <em>{intl.formatMessage({id: 'authority_approved'})}</em>
                                                            </MenuItem>
                                                                <MenuItem value={"No"+'-'+1}>
                                                                No
                                                                </MenuItem>
                                                                <MenuItem value={"Yes"+'-'+2}>
                                                                Yes
                                                                </MenuItem>
                                                                <MenuItem value={"Not Sure"+'-'+3}>
                                                                Not Sure
                                                                </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'boundary_wall'})}</label>
                                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={boundaryName}
                                                            onChange={boundaryWallChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                for(let i = 0; i < selected.length; i++){
                                                                var fields = selected[i].split('-');
                                                                var n = fields[0];
                                                                name.push(n);
                                                                }
                                                                if (selected.length === 0) {
                                                                return <p>{intl.formatMessage({id: 'boundary_wall'})}</p>;
                                                                }
                                                                return(
                                                                    <ul className='m-0'>
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
                                                                <em>{intl.formatMessage({id: 'boundary_wall'})}</em>
                                                            </MenuItem>
                                                            <MenuItem value={"No"+'-'+1}>
                                                            No
                                                            </MenuItem>
                                                            <MenuItem value={"Yes"+'-'+2}>
                                                            Yes
                                                            </MenuItem>
                                                            <MenuItem value={"Not Sure"+'-'+3}>
                                                            Not Sure
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'current_status'})}</label>
                                                    <div className="input-group bs_2 first mb-3 input_prepend">
                                                        <input type="text" className="form-control" {...formikFeatures.getFieldProps('current_status')} />
                                                    </div> 
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={amnetiesName}
                                                            onChange={amnetiesChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                for(let i = 0; i < selected.length; i++){
                                                                var fields = selected[i].split('-');
                                                                var n = fields[0];
                                                                name.push(n);
                                                                }
                                                                if (selected.length === 0) {
                                                                return <p>{intl.formatMessage({id: 'amenities'})}</p>;
                                                                }
                                                                return(
                                                                    <ul className='m-0'>
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
                                                                <em>{intl.formatMessage({id: 'amenities'})}</em>
                                                            </MenuItem>
                                                            {droplists.amenities?.map((val:any) => (
                                                                <MenuItem
                                                                key={val.id}
                                                                value={val.option_value+'-'+val.id}
                                                                style={getStyles(val.option_value, amnetiesName, theme)}
                                                                >
                                                                {val.option_value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>                                                
                                                <div className="col-12 d-flex justify-content-center mb-4">
                                                    <button
                                                        type='submit'
                                                        id='kt_sign_up_submit4'
                                                        className='btn btn_primary text-primary'
                                                        disabled={formikFeatures.isSubmitting}
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
                                    <div className="tab-pane fade" id={"features-list"+propertyId.id} role="tabpanel" aria-labelledby={"features-list-tab"+propertyId.id}>
                                        <form className='' noValidate onSubmit={formikunittype.handleSubmit}>
                                            {documentList?.map((singleService, index) => {
                                            return (
                                                <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                    <div className="row">
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" value={singleService.quoted_rent_price} onChange={(e) => {
                                                                    setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.quoted_rent_price = e.target?.value?.replace(/[^0-9]/g, "");
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}} />
                                                                <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend" value={singleService.quoted_rent_price_ut} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.quoted_rent_price_ut = e.target.value;
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}}>
                                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                                    return (
                                                                        <option value={furnishStatusVal.id} key={i}>₹/{furnishStatusVal.option_value}</option> 
                                                                )})}
                                                                </select>
                                                            </div>
                                                        </div> 
                                                        {/* <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" />
                                                            </div> 
                                                        </div>  */}
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" value={singleService.security_deposit} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.security_deposit = e.target.value?.replace(/[^0-9]/g, "");
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}} />
                                                                <span className="px-3 py-3 btn-light btn btn-sm prepend">₹</span>
                                                            </div> 
                                                        </div> 
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" value={singleService.escalation} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.escalation = e.target.value?.replace(/[^0-9]/g, "");
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}} />
                                                            </div> 
                                                        </div>
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" value={singleService.lock_in} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.lock_in = e.target.value?.replace(/[^0-9]/g, "");
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}} />
                                                            </div>
                                                        </div>  
                                                        <div className="col-md-6 col-12 mb-3">
                                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                                            <div className="input-group mb-3 input_prepend">
                                                                <input type="text" className="form-control" value={singleService.total_term} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                    const updatedData = [...prevData];
                                                                    const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                    
                                                                    if (objectToUpdate) {
                                                                        objectToUpdate.total_term = e.target.value?.replace(/[^0-9]/g, "");
                                                                    }
                                                                    
                                                                    return updatedData;
                                                                    })}} />
                                                            </div> 
                                                        </div> 
                                                        <div className={documentList.length !== 1 ? "col-12 d-flex justify-content-between align-items-center" : "col-12 d-flex justify-content-end align-items-center"}>
                                                            {documentList.length !== 1 && (
                                                            <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={() => handleDocumentRemove(index)}>
                                                                <i className="fa fa-minus text_primary" aria-hidden="true"></i>
                                                            </button>
                                                            )}
                                                            {documentList.length - 1 === index && (
                                                            <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={()=>handleDocumentAdd(index)}>
                                                                <i className="fa fa-plus text_primary" aria-hidden="true"></i>
                                                            </button>
                                                            )}
                                                        </div> 
                                                    </div>
                                                </div>
                                            )})}
                                            <div className='d-flex justify-content-center py-3'>
                                                <button
                                                    type='submit'
                                                    id='kt_unit_type_submit'
                                                    className='btn btn_primary text-primary'
                                                    disabled={formikunittype.isSubmitting}
                                                >
                                                    {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'save'})}
                                                        <KTSVG
                                                            path='/media/custom/save_white.svg'
                                                            className='svg-icon-3 svg-icon-primary ms-2' />
                                                    </span>}
                                                    {loading && (
                                                        <span className='indicator-progress' style={{ display: 'block' }}>
                                                            {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                        </span>
                                                    )}                                                
                                                </button>
                                            </div>
                                        </form>                                    
                                    </div>
                                    <div className={tabInfo == 'tasks' ? "tab-pane fade show active": "tab-pane fade"} id={"tasks"+propertyId.id} role="tabpanel" aria-labelledby="tasks-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                    {tasksList.length > 0
                                            ?
                                        <DataGrid
                                                rows={tasksList}
                                                columns={tasksProjectcolumns}
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
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_project_tasks_available'})}</p>
                                            </div>
                                            }</div>
                                    </div>  
                                    <div className={tabInfo == 'leads' ? "tab-pane fade show active": "tab-pane fade"} id={"leads"+propertyId.id} role="tabpanel" aria-labelledby="leads-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                    {leadsList.length > 0
                                            ?
                                        <DataGrid
                                                rows={leadsList}
                                                columns={leadsProjectcolumns}
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
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_project_leads_available'})}</p>
                                            </div>
                                            }</div>
                                    </div>  
                                    <div className={tabInfo == 'timeline' ? "tab-pane fade show active": "tab-pane fade"} id={"timeline"+propertyId.id} role="tabpanel" aria-labelledby="timeline-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                    {logList.length > 0
                                            ?
                                        <DataGrid
                                                rows={logList}
                                                columns={logContactcolumns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_project_timeline_available'})}</p>
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
                        <h5 className='text-white'>{intl.formatMessage({id: 'project_details'})}</h5>
                    </div>
                    <button onClick={minimaximize} className="mx-3 btn p-0">
                        <i className="fas fa-window-maximize text-white"></i>
                    </button>
                    <button type='button' id='kt_property_add_form_close' data-bs-dismiss="offcanvas" onClick={() => setDetailsClicked(false)} className="mx-3 btn p-0">
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>
            </div>
            }
        </div>
    )
}

export {PropertyDetails}