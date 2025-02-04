import React,{FC, useState, useEffect, useRef} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { getPropertyDropdowns, saveProperty } from './core/_requests'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Toast } from 'bootstrap';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { useDropzone } from 'react-dropzone'
import {useIntl} from 'react-intl';

const initialValues = {
    contact_id: '',
    available_for: '',
    commission: '',
    property_indepth: '',
    segment: '',
    property_type: '',
    property_source: '',
    legal_approval: '',
    property_status: '125',
    description: '',
    project_stage: '',
    age_of_project: '',
    furnishing: '',
    price_min: '',
    gst: '',
    invoice_name: '',
    price_max: '',
    builtup_area_min: '',
    builtup_area_max: '',
    builtup_area_min_ut: '',
    builtup_area_max_ut: '',
    plot_area_min: '',
    plot_area_max: '',
    plot_area_min_ut: '',
    plot_area_max_ut: '',
    tower: '',
    uds_min: '',
    uds_min_ut: '',
    uds_max: '',
    uds_max_ut: '',
    no_of_floors: '',
    ownership_type: '',
    balcony: '',
    property_facing: '',
    kitchen_type: '',
    flooring: '',
    vasthu_compliant: '',
    currently_under_loan: '',
    available_from: '',
    site_visit_preference: '',
    no_of_units_min: '',
    no_of_units_max: '',
    key_custody: '',
    no_of_car: '',
    car_park_type: '',
    water_supply: '',
    gated_community: '',
    amenities:'',
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
    total_project_builtup_area: '',
    floor_plate_area: '',
    building_structure: '',    
    offered_floor: '',    
    offered_area: '', 
    specification_of_property: '', 

    
         // Conventional 
    // type_of_building: '',
    // grade_of_building: '',
    // total_project_builtup_area_unit: '',
    // floor_plate_area_unit: '',
    // offered_area_unit: '',
    // no_of_workstations: '',
    // workstation_size: '',
    // no_of_cabins: '',
    // no_of_conference_rooms: '',
    // conference_rooms_size: '',
    // pantry: '',
    // no_of_people: '',
    // washrooms: '',
    // no_of_washrooms: '',
    // bike_parking: '',
    // car_parking: '',
    // certifications: '',
    // quoted_rent_price: '',
    // maintainance: '',
    // parking_charges: '',
    // security_deposit: '',
    // escalation: '',
    // assign_to: '',

    // // Co-Working
    // co_working_type: '',
    // total_project_buildup_area: '',
    // total_project_buildup_area_unit: '',
    // total_no_of_workstations: '',
    // total_no_of_workstations_unit: '',
    // total_offered_floor: '',
    // server_room: '',
    // office_work_hours: '',
    // office_work_hours_unit: '',
    // one_time_set_up_cost: '',
    // parking_charges_bike: '',
    // parking_charges_car: '',
    // lock_in: '',

    // // Industrial
    // type: '',
    // sub_type: '',
    // total_project_area: '',
    // total_project_area_unit: '',
    // total_build_area_up: '',
    // total_build_area_up_unit: '',
    // total_plot_area: '',
    // total_plot_area_unit: '',
    // offered_build_up_area: '',
    // offered_build_up_area_unit: '',
    // offered_plot_area: '',
    // offered_plot_area_unit: '',
    // office_area: '',
    // office_area_unit: '',
    // warehouse: '',
    // warehouse_unit: '',
    // building_material: '',
    // typical_floor_plate_size: '',
    // typical_floor_plate_size_unit: '',
    // floor_ceiling_height: '',
    // floor_ceiling_height_unit: '',
    // fire_safety: '',
    // possession_status: '',
    // age_of_structure: '',
    // total_term: '',

    // //Retail
    // situated_at: '',
    // property_suited_for: '',
    // visibility: '',
    // working_hours: '',
    // working_hours_unit: '',

    // // Plot
    // plot_type: '',
    // plot_area: '',
    // plot_area_unit: '',
    // fsi: '',
    // frontage: '',
    // frontage_unit: '',
    // dimensions: '',
    // dimensions_unit: '', 
    // road_width: '',
    // corner_property: '',
    // authority_approved: '',
    // boundary_wall: '',
    // current_status: '',
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

const mystyle = {
    padding: "0px",
    height: "35px",
    maxHeight: "200px",
    overflowY: "scroll",
};

function getStyles(name: string, aminityName: string[], theme: Theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

type Props = {
    setProperty?: any,
    setPropertyCount?: any,
}

const ProjectForm: FC<Props> = (props) => {

    const {setProperty, setPropertyCount} = props
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [rera, setrera] = useState<any>('');
    const [contactId, setContactId] = useState<any>('');
    const [aminityName, setAminityName] = React.useState<string[]>([]);
    const [assignToName, setAssignToName] = React.useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<string[]>([]);
    const [furnishName, setFurnishName] = React.useState<string[]>([]);
    const [siteVisitName, setSiteVisitName] = React.useState<string[]>([]);
    const [projectStageId, setProjectStageId] = useState<any[]>([]);
    const [projectStageName, setProjectStageName] = useState<any[]>([]);
    const [ageOfProjectId, setAgeOfProjectId] = useState<any[]>([]);
    const [ageOfProjectName, setAgeOfProjectName] = useState<any[]>([]);
    const [projectSpecificationId, setProjectSpecificationId] = useState<any[]>([]);
    const [projectSpecificationName, setProjectSpecificationName] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [availableName, setAvailableName] = useState<any[]>([]);
    const [planData, setPlanData] = useState<any[]>([]);
    const [currentFeature, setCurrentFeature] = useState('');
    const [aminityId, setAminityId] = useState<any[]>([]);
    const [siteVisitId, setSiteVisitId] = useState<any[]>([]);
    const [availableId, setAvailableId] = React.useState<string[]>([]);
    const [documentList, setDocumentList] = useState<any[]>([{ document: "" }]);
    const profileView = useRef<HTMLInputElement>(null);
    const [documentFile, setDocumentFile] = React.useState(() => documentList.map((x) => true));
    const {currentUser, logout} = useAuth();
    const [localityID, setLocalityID] = useState('')
    const [droplists, setDroplists] = useState<any>({})
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [contactList, setContactList] = useState<any[]>([]);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
    }
    
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg'],         
            'document/*': ['.pdf']
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
        }
    });     
    
    const dropdowns = async () => {
        const response = await getPropertyDropdowns()
        setDroplists(response.output);
        const data = response.output?.contact_list;
    
        let contact:any[] = [];
        for(let key in data) {
            let body = {
                id: data[key].id,
                name: (data[key].first_name)+' '+(data[key].last_name ?? '')
             }
            contact.push(body);
        }
        setContactList(contact);
    }

    useEffect(() => {
        dropdowns();
        formik.setFieldValue("segment", 258);
    }, [])

    const handleDocumentRemove = async (index:any) => {
        const list = [...documentList];
        list.splice(index, 1);
        setDocumentList(list);

        var featureData = [];

        for(let i = 1; i <= documentList.length; i++){

            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;
            let fFile = (document.getElementById('file_'+i) as HTMLInputElement).files;

            let base64 = fFile![0] != undefined || fFile![0] != null ? await convertBase64(fFile![0]) : '';

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainance,
                "maintainance_cost_ut": fMaintainanceUT,
                "file": '',
            }
            featureData.push(data);
        }

        setPlanData(featureData);

    };

    const processFile = async (e:any, index:any) => {
        var files = e.dataTransfer.files;
        let fields = files[0]['name'].split(".");
        let fileType =  fields![fields!.length - 1];

        var featureData = [];

        for(let i = 1; i <= documentList.length; i++){
            let fFileSec = (document.getElementById('file_'+i) as HTMLInputElement).value;

            if(index == i){
                fFileSec = files;
            }

            let fImgSec = (document.getElementById('file_img_sec_'+i) as HTMLDivElement);
            let fImg = (document.getElementById('file_img_'+i) as HTMLImageElement);
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;
            let fFile = (document.getElementById('file_'+i) as HTMLInputElement).files;

            if(index == i){
                if(fileType == 'jpg' || fileType == 'jpeg'){
                    fImgSec.classList.remove("d-none");
                    fImg.setAttribute("src", URL.createObjectURL(files[0]));
                } else if (fileType == 'pdf'){
                    fImgSec.classList.remove("d-none");
                    fImg.setAttribute("src", toAbsoluteUrl("/media/svg/files/pdf.svg"));
                }
            }

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainance,
                "maintainance_cost_ut": fMaintainanceUT,
                "file": '',
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

    const allowDrop = (e:any, index:any) => {
        e.preventDefault();
    }

    const convertBase64 = (file:any) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
    };    

    const handleFilePreview = async (e:any, index:any) => {        
        setCurrentFeature(index);        
        const newVisibilities = [...documentFile];
        newVisibilities[index] = !newVisibilities[index];
        setDocumentFile(newVisibilities);
        let fields = profileView.current?.value.split(".");
        let fileType =  fields![fields!.length - 1];
        var featureData: React.SetStateAction<any[]> = [];

        for(let i = 1; i <= documentList.length; i++){
            let fImgSec = (document.getElementById('file_img_sec_'+i) as HTMLDivElement);
            let fImg = (document.getElementById('file_img_'+i) as HTMLImageElement);
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;
           
            if(index == i){
                if(fileType == 'jpg' || fileType == 'jpeg'){
                    fImgSec.classList.remove("d-none");
                    fImg.setAttribute("src", URL.createObjectURL(e.target.files[0]));
                } else if (fileType == 'pdf'){
                    fImgSec.classList.remove("d-none");
                    fImg.setAttribute("src", toAbsoluteUrl("/media/svg/files/pdf.svg"));
                }
            }

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainance,
                "maintainance_cost_ut": fMaintainanceUT,
                "file": '',
            }
            featureData.push(data);
        }

        setPlanData(featureData);
    
        let image_as_base64:any = URL.createObjectURL(e.target.files[0])
        let image_as_files:any = e.target.files[0];
    }

    const handleDocumentAdd = async (index:any) => {
        const newVisibilities = [...documentFile];
        newVisibilities[index] = !newVisibilities[index];
        setDocumentFile(newVisibilities);
        setDocumentList([...documentList, { document: "" }]);
        
        var featureData = [];

        for(let i = 1; i <= documentList.length; i++){
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;  
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;         
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;         

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainance,
                "maintainance_cost_ut": fMaintainanceUT,
                "file": '',
            }
            featureData.push(data);
        }

        setPlanData(featureData);

    };

    const handleDocumentsave = async (index:any) => {        
        var featureData = [];

        for(let i = 1; i <= documentList.length; i++){
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": fPriceMin,
                "price_max": fPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": fMaintainance,
                "maintainance_cost_ut": fMaintainanceUT,
                "file": '',
            }
            featureData.push(data);
        }
        setPlanData(featureData);
    };

    const onPlanChange = async () => {
        var featureData = [];

        for(let i = 1; i <= documentList.length; i++){
            let fUnitType = (document.getElementById('unit_type_'+i) as HTMLInputElement).value;
            let fTotalUnits = (document.getElementById('total_units_'+i) as HTMLInputElement).value;
            let fPriceMin = (document.getElementById('price_min_'+i) as HTMLInputElement).value;
            let fPriceMax = (document.getElementById('price_max_'+i) as HTMLInputElement).value;
            let fPriceMinUT = (document.getElementById('price_min_ut_'+i) as HTMLInputElement).value;
            let fPriceMaxUT = (document.getElementById('price_max_ut_'+i) as HTMLInputElement).value;
            let fBuiltMin = (document.getElementById('builtup_area_min_'+i) as HTMLInputElement).value;
            let fBuiltMax = (document.getElementById('builtup_area_max_'+i) as HTMLInputElement).value;
            let fBuiltMinUT = (document.getElementById('builtup_area_min_ut_'+i) as HTMLInputElement).value;
            let fBuiltMaxUT = (document.getElementById('builtup_area_max_ut_'+i) as HTMLInputElement).value;
            // let fLocalCurrency = (document.getElementById('local_currency_'+i) as HTMLInputElement).value;
            let fMaintainance = (document.getElementById('maintainance_cost_'+i) as HTMLInputElement).value;            
            let fMaintainanceUT = (document.getElementById('maintainance_cost_ut_'+i) as HTMLInputElement).value;        
            
            
            let VPriceMin = parseFloat(fPriceMin);
            let VPriceMax = parseFloat(fPriceMax);
            let VMaintainance = parseFloat(fMaintainance);

            let totalPriceMin;
            if(fPriceMinUT ==  'crs') {
                totalPriceMin = (VPriceMin * 10000000)
            } else if(fPriceMinUT == 'lakhs') {
                totalPriceMin = (VPriceMin * 100000)
            } else if(fPriceMinUT == 'thousand') {
                totalPriceMin = (VPriceMin * 1000)
            } else {
                totalPriceMin = fPriceMin
            }
            let totalPriceMax;
            if(fPriceMaxUT ==  'crs') {
                totalPriceMax = (VPriceMax * 10000000)
            } else if(fPriceMaxUT == 'lakhs') {
                totalPriceMax = (VPriceMax * 100000)
            } else if(fPriceMaxUT == 'thousand') {
                totalPriceMax = (VPriceMax * 1000)
            } else {
                totalPriceMax = fPriceMax
            }
            let MaintainanceMax;
            if(fMaintainanceUT ==  'crs') {
                MaintainanceMax = (VMaintainance * 10000000)
            } else if(fMaintainanceUT == 'lakhs') {
                MaintainanceMax = (VMaintainance * 100000)
            } else if(fMaintainanceUT == 'thousand') {
                MaintainanceMax = (VMaintainance * 1000)
            } else {
                MaintainanceMax = VMaintainance
            }

            var data = {
                "unit_type": fUnitType,
                "total_units": fTotalUnits,
                "price_min": totalPriceMin,
                "price_max": totalPriceMax,
                "price_min_ut": fPriceMinUT,
                "price_max_ut": fPriceMaxUT,
                "builtup_area_min": fBuiltMin,
                "builtup_area_max": fBuiltMax,
                "builtup_area_min_ut": fBuiltMinUT,
                "builtup_area_max_ut": fBuiltMaxUT,
                // "local_currency": fLocalCurrency,
                "maintainance_cost": MaintainanceMax,
                "maintainance_cost_ut": fMaintainanceUT,
            }
            featureData.push(data);
        }
        setPlanData(featureData);
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
        <div key={file.name} className="position-relative col-md-3">
            <div>
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

    const projectStage = (event: SelectChangeEvent<typeof projectStageName>) => {
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
    
        setProjectStageId(id);    
        setProjectStageName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const ageOfProject = (event: SelectChangeEvent<typeof ageOfProjectName>) => {
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
    
        setAgeOfProjectId(id);    
        setAgeOfProjectName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const projectSpecification = (event: SelectChangeEvent<typeof projectSpecificationName>) => {
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
    
        setProjectSpecificationId(id);    
        setProjectSpecificationName(
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

    const openContactFrom = () => {
        document.getElementById('kt_property_close')?.click();
        document.getElementById('kt_contact_toggle')?.click();
    }

    const registrationSchema = Yup.object().shape({
        contact_id: Yup.string().required('Contact name is required'),
        segment: Yup.string().required('Segment is required'),
        property_type: Yup.string().required('Property Type is required'),
        latitude: Yup.number().min(-90.0000000, "Invalid latitude").max(90.0000000, "Invalid latitude"),
        longitude: Yup.string().min(-180.0000000, "Invalid longitude").max(180.0000000, "Invalid longitude"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var featureImagesArray = [];
            var builtupMinArray = [];
            var builtupMaxArray = [];
            var salePriceMinArray = [];
            var salePriceMaxArray = [];
            var totalUnitsArray = [];
            // var localCurrencyArray = [];
            var unitTypeArray = [];
            var builtupMinArrayUT = [];
            var builtupMaxArrayUT = [];
            var salePriceMinArrayUT = [];
            var salePriceMaxArrayUT = [];
            var maintainanceCostArray = [];
            var maintainanceCostArrayUT = [];

            for(let i = 0; i < planData.length; i++){
               builtupMinArray.push(planData[i]['builtup_area_min']);
               builtupMaxArray.push(planData[i]['builtup_area_max']);
               builtupMinArrayUT.push(planData[i]['builtup_area_min_ut']);
               builtupMaxArrayUT.push(planData[i]['builtup_area_max_ut']);
               salePriceMinArray.push(planData[i]['price_min']);
               salePriceMaxArray.push(planData[i]['price_max']);
               salePriceMinArrayUT.push(planData[i]['price_min_ut']);
               salePriceMaxArrayUT.push(planData[i]['price_max_ut']);
               totalUnitsArray.push(planData[i]['total_units']);
               unitTypeArray.push(planData[i]['unit_type']);
            //    localCurrencyArray.push(planData[i]['local_currency']);
               maintainanceCostArray.push(planData[i]['maintainance_cost']);
               maintainanceCostArrayUT.push(planData[i]['maintainance_cost_ut']);
               featureImagesArray.push(planData[i]['file']);
            }            
            var formData = new FormData();
            
            for(let i = 0; i < files.length; i++){
                formData.append('images', files[i]);
            }

            formData.append('prop_unit_count', planData.length.toString());
            formData.append('contact_id', values.contact_id);
            formData.append('profile_image', profileImage!);
            formData.append('available_for', availableId.join(',').toString());
            formData.append('assign_to', assignToId?.map((item:any) => item.id)?.join(',').toString());
            formData.append('commission', values.commission);
            formData.append('property_indepth', values.property_indepth);
            formData.append('segment', values.segment);
            formData.append('property_type', values.property_type);
            formData.append('property_source', values.property_source);
            formData.append('property_status', values.property_status);
            formData.append('description', values.description);
            formData.append('project_stage', values.project_stage);
            formData.append('age_of_property', values.age_of_project);
            formData.append('furnishing', values.furnishing);
            formData.append('no_of_units_min', values.no_of_units_min);
            formData.append('no_of_units_max', values.no_of_units_max);
            formData.append('built_up_area_min', values.builtup_area_min);
            formData.append('builtup_area_min_ut', values.builtup_area_min_ut);
            formData.append('built_up_area_max', values.builtup_area_max);
            formData.append('builtup_area_max_ut', values.builtup_area_max_ut);
            formData.append('plot_area_min', values.plot_area_min);
            formData.append('plot_area_min_ut', values.plot_area_min_ut);
            formData.append('plot_area_max', values.plot_area_max);
            formData.append('plot_area_max_ut', values.plot_area_max_ut);
            formData.append('uds_min', values.uds_min);
            formData.append('uds_min_ut', values.uds_min_ut);
            formData.append('uds_max', values.uds_max);
            formData.append('uds_max_ut', values.uds_max_ut);
            formData.append('no_of_floors', values.no_of_floors);
            formData.append('tower', values.tower);
            formData.append('ownership_type', values.ownership_type);
            formData.append('balcony', values.balcony);
            formData.append('property_facing', values.property_facing);
            formData.append('kitchen_type', values.kitchen_type);
            formData.append('flooring', values.flooring);
            formData.append('vasthu_compliant', values.vasthu_compliant);
            formData.append('currently_under_loan', values.currently_under_loan);
            formData.append('available_from', values.available_from);
            formData.append('legal_approval', values.legal_approval);
            formData.append('invoice_name', values.invoice_name);
            formData.append('site_visit_preference', siteVisitId.join(',').toString());
            formData.append('key_custody', values.key_custody);
            formData.append('gst', values.gst);
            formData.append('no_of_car', values.no_of_car);
            formData.append('car_park_type', values.car_park_type);
            formData.append('water_supply', values.water_supply);
            formData.append('gated_community', values.gated_community);
            formData.append('specification_of_property', projectSpecificationId.join(',').toString());
            formData.append('property_highlight', values.property_highlight);
            formData.append('rera_registered', values.rera_registered);
            formData.append('rera_number', values.rera_number);
            formData.append('completion_certificate', values.completion_certificate);
            formData.append('name_of_building', values.name_of_building);
            formData.append('address_line1', values.address_line1);
            formData.append('country', values.country);
            formData.append('state', values.state);
            formData.append('city', values.city);
            formData.append('locality', values.locality);
            formData.append('pincode', values.pincode);
            formData.append('latitude', values.latitude);
            formData.append('longitude', values.longitude);
            formData.append('door_number', values.door_number);
            formData.append('module_number', values.module_number);
            formData.append('amenities', aminityId.join(',').toString());
            formData.append('project_unit_type', planData.length > 0 ? JSON.stringify(planData) : '');  
            
            
            // formData.append('type_of_building', values.type_of_building);
            // formData.append('grade_of_building', values.grade_of_building);
            // formData.append('total_project_builtup_area_unit', values.total_project_builtup_area_unit);
            // formData.append('floor_plate_area_unit', values.floor_plate_area_unit);
            // formData.append('offered_area_unit', values.offered_area_unit);
            // formData.append('no_of_workstations', values.no_of_workstations);
            // formData.append('workstation_size', values.workstation_size);
            // formData.append('no_of_cabins', values.no_of_cabins);
            // formData.append('no_of_conference_rooms', values.no_of_conference_rooms);
            // formData.append('conference_rooms_size', values.conference_rooms_size);
            // formData.append('pantry', values.pantry);
            // formData.append('no_of_people', values.no_of_people);
            // formData.append('washrooms', values.washrooms);
            // formData.append('no_of_washrooms', values.no_of_washrooms);
            // formData.append('bike_parking', values.bike_parking);
            // formData.append('car_parking', values.car_parking);
            // formData.append('certifications', values.certifications);
            // formData.append('quoted_rent_price', values.quoted_rent_price);
            // formData.append('maintainance', values.maintainance);
            // formData.append('parking_charges', values.parking_charges);
            // formData.append('security_deposit', values.security_deposit);
            // formData.append('escalation', values.escalation);
            // formData.append('co_working_type', values.co_working_type);
            // formData.append('total_project_buildup_area', values.total_project_buildup_area);
            // formData.append('total_project_buildup_area_unit', values.total_project_buildup_area_unit);
            // formData.append('total_no_of_workstations', values.total_no_of_workstations);
            // formData.append('total_no_of_workstations_unit', values.total_no_of_workstations_unit);
            // formData.append('total_offered_floor', values.total_offered_floor);
            // formData.append('server_room', values.server_room);
            // formData.append('office_work_hours', values.office_work_hours);
            // formData.append('office_work_hours_unit', values.office_work_hours_unit);
            // formData.append('one_time_set_up_cost', values.one_time_set_up_cost);
            // formData.append('parking_charges_bike', values.parking_charges_bike);
            // formData.append('parking_charges_car', values.parking_charges_car);
            // formData.append('lock_in', values.lock_in);
            // formData.append('type', values.type);
            // formData.append('sub_type', values.sub_type);
            // formData.append('total_project_area', values.total_project_area);
            // formData.append('total_project_area_unit', values.total_project_area_unit);
            // formData.append('total_build_area_up', values.total_build_area_up);
            // formData.append('total_build_area_up_unit', values.total_build_area_up_unit);
            // formData.append('total_plot_area', values.total_plot_area);
            // formData.append('total_plot_area_unit', values.total_plot_area_unit);
            // formData.append('offered_build_up_area', values.offered_build_up_area);
            // formData.append('offered_build_up_area_unit', values.offered_build_up_area_unit);
            // formData.append('offered_plot_area', values.offered_plot_area);
            // formData.append('offered_plot_area_unit', values.offered_plot_area_unit);
            // formData.append('office_area', values.office_area);
            // formData.append('office_area_unit', values.office_area_unit);
            // formData.append('warehouse', values.warehouse);
            // formData.append('warehouse_unit', values.warehouse_unit);
            // formData.append('building_material', values.building_material);
            // formData.append('typical_floor_plate_size', values.typical_floor_plate_size);
            // formData.append('typical_floor_plate_size_unit', values.typical_floor_plate_size_unit);
            // formData.append('floor_ceiling_height', values.floor_ceiling_height);
            // formData.append('floor_ceiling_height_unit', values.floor_ceiling_height_unit);
            // formData.append('fire_safety', values.fire_safety);
            // formData.append('possession_status', values.possession_status);
            // formData.append('age_of_structure', values.age_of_structure);
            // formData.append('total_term', values.total_term);
            // formData.append('situated_at', values.situated_at);
            // formData.append('property_suited_for', values.property_suited_for);
            // formData.append('visibility', values.visibility);
            // formData.append('working_hours', values.working_hours);
            // formData.append('working_hours_unit', values.working_hours_unit);
            // formData.append('plot_type', values.plot_type);
            // formData.append('plot_area', values.plot_area);
            // formData.append('plot_area_unit', values.plot_area_unit);
            // formData.append('fsi', values.fsi);
            // formData.append('frontage', values.frontage);
            // formData.append('frontage_unit', values.frontage_unit);
            // formData.append('dimensions', values.dimensions);
            // formData.append('dimensions_unit', values.dimensions_unit);
            // formData.append('road_width', values.road_width);
            // formData.append('corner_property', values.corner_property);
            // formData.append('authority_approved', values.authority_approved);
            // formData.append('boundary_wall', values.boundary_wall);
            // formData.append('current_status', values.current_status);
    
            const savePropertyData = await saveProperty(formData);

            if(savePropertyData.status == 200){
                setLoading(false);
                document.getElementById('kt_property_close')?.click();
                document.getElementById('propertyReloadBtn')?.click();
                // setProperty(savePropertyData.output)
                // setPropertyCount(savePropertyData.count)
                resetForm();
                formik.setFieldValue("segment", 258);
                setContactId('');
                setAminityName([]);
                setAssignToName([]);
                setAssignToId([]);
                setFurnishName([]);
                setAvailableName([]);
                setFiles([]);
                setPlanData([]);
                setDocumentList([{ document: "" }]);
                var toastEl = document.getElementById('myToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else {
                setLoading(false);
                var toastEl = document.getElementById('myToastAddexist');
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

    const contactDropSelect = (id:any, type:any) => {
        formik.setFieldValue('contact_id', id ?? '');
        setContactId(id);
    }

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
    
    const theme = useTheme(); 

    return(
    <div className='card shadow-none rounded-0 w-100'>
        <div className='card-header w-100' id='kt_property_header'>
          <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_project'})}</h3>
          <div className='card-toolbar'>
            <button
              type='button'
              className='btn btn-sm btn-icon btn-active-light-primary me-n5'
              id='kt_property_close'
            >
                <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
            </button>
          </div>
        </div>
        <div className='card-body position-relative' id='kt_property_body'>
            <form noValidate onSubmit={formik.handleSubmit}>
                <div className="accordion" id="prop_accordion"> 
                    <div className="accordion-item" id='bassicDetails'>
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'basic_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
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
                                        <div className="d-flex justify-content-center">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'contact_person'})}</label>
                                        <div className="input-group mb-3 d-flex flex-nowrap">
                                            {/* <div className='autocomplete_field'>
                                                <ReactSearchAutocomplete
                                                    items={contactList}
                                                    {...formik.getFieldProps('contact_id')}
                                                    onSelect={(val:any) => formik.setFieldValue('contact_id', val.id ?? '')}
                                                    placeholder="choose contact"
                                                    styling={mystyle}
                                                    autoFocus
                                                    formatResult={formatResult}
                                                />
                                            </div> */}
                                            <div className='autocomplete_field'>                                       
                                                <ReactSelect
                                                options={contactList}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.name}
                                                getOptionValue={(option:any) => option.id}
                                                value={contactList?.find((item:any) => contactId == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={"w-100 "}
                                                onChange={(val:any) => {
                                                    contactDropSelect(val.id, val.name);
                                                }}
                                                placeholder={"contact.."}
                                                />
                                            </div>
                                            <button className="btn btn-outline-secondary addContact_btn" type="button" onClick={openContactFrom}>
                                                <i className="fa fa-plus-circle text_primary"></i>
                                            </button>
                                        </div>
                                        {/* <div className="input-group mb-3">
                                            <input type="text" className="form-control" {...formik.getFieldProps('contact_id')}/>
                                        </div> */}
                                        {formik.touched.contact_id && formik.errors.contact_id && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.contact_id}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_for'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
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
                                                      )
                                                }}
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'available_for'})}</em>
                                                </MenuItem>
                                                {droplists.available_for?.map((available:any) => (
                                                    <MenuItem
                                                    key={available.id}
                                                    value={available.option_value+'-'+available.id}
                                                    style={getStyles(available.option_value, availableName, theme)}
                                                    >
                                                    {available.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
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
                                                className='multi_select_field'
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
                                        <div className="input-group mb-3 input_prepend">
                                            <ReactSelect
                                            isMulti
                                            options={droplists.assign_to}
                                            closeMenuOnSelect={false}
                                            components={makeAnimated()}
                                            getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                            getOptionValue={(option:any) => option.id}
                                            value={droplists.assign_to?.filter((item:any) => assignToId?.indexOf(item) !== -1)}
                                            classNamePrefix="border-0 "
                                            className={"w-100 "}
                                            onChange={(val:any) => {
                                                setAssignToId(val);                                              
                                            }}
                                            placeholder={"Assign-to.."}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_indepth'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select {...formik.getFieldProps('property_indepth')}
                                                className={clsx(
                                                'btn_secondary btn btn-sm w-100',
                                                {
                                                    'is-invalid': formik.touched.property_indepth && formik.errors.property_indepth,
                                                },
                                                {
                                                    'is-valid': formik.touched.property_indepth && !formik.errors.property_indepth,
                                                }
                                                )} name="property_indepth">
                                                    <option value=''>Select</option>
                                                {droplists.property_indepth?.map((propertyInDepthVal: any,i: any) =>{
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'commission'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('commission')} onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("commission", area)}} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('commission_unit')}>
                                                <option value="1">%</option>
                                                <option value="2">₹</option>
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'segment'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select disabled className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value=''>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                        {formik.touched.segment && formik.errors.segment && (
                                        <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.segment}</span>
                                        </div>
                                        </div>)} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'property_type'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('property_type')}>
                                            <option disabled value=''>Select</option>
                                                {droplists.property_type?.map((propertyTypeVal: any,i: any) =>{
                                                    return (
                                                        <option value={propertyTypeVal.id} key={i}>{propertyTypeVal.option_value}</option> 
                                                )})}
                                            </select>                                            
                                        </div>  
                                        {formik.touched.property_type && formik.errors.property_type && (
                                        <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.property_type}</span>
                                        </div>
                                        </div>)} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_status'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('property_status')}>
                                            <option value=''>Select</option>
                                                {droplists.property_status?.map((propertyStatusVal: any,i: any) =>{
                                                    return (
                                                        <option value={propertyStatusVal.id} key={i}>{propertyStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_source'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('property_source')}>
                                            <option value=''>Select</option>
                                                {droplists.property_source?.map((propertySourceVal: any,i: any) =>{
                                                    return (
                                                        <option value={propertySourceVal.id} key={i}>{propertySourceVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'legal_approval'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('legal_approval')}>
                                            <option value=''>Select</option>
                                                {droplists.legal_approval?.map((Val:any,i:any) =>{
                                                    return (
                                                        <option value={Val.id} key={i}>{Val.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoicing_name'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('invoice_name')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('gst')} />
                                        </div> 
                                    </div> 
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('status')}>
                                            <option value=''>Select</option>
                                                {droplists.property_status?.map((propertyStatusVal: any,i: any) =>{
                                                    return (
                                                        <option value={propertyStatusVal.id} key={i}>{propertyStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>  */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='locationDetails'>
                        <h2 className="accordion-header" id="headingtwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#two" aria-expanded="false" aria-controls="two">
                            {intl.formatMessage({id: 'location_details'})}
                            </button>
                        </h2>
                        <div id="two" className="accordion-collapse collapse" aria-labelledby="headingtwo" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('name_of_building')} />
                                        </div>
                                    </div>  
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'door_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div> 
                                    </div>  */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_1'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_2'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line2')} />
                                        </div> 
                                    </div>  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>  
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                                formik.setFieldValue("country", e.target.value);
                                                let states = droplists.state?.filter((state:any) => e.target.value == state.country_id);
                                                setState(states);
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
                                    {/* {state.length != 0 && */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                formik.setFieldValue("state", e.target.value);                                               
                                                let states = droplists.city?.filter((city:any) => e.target.value == city.state_id);
                                                setCity(states);
                                            }} >
                                                <option disabled value="">Select</option>
                                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select>
                                            </div>  
                                        </div>
                                    </div>
                                    {/* } */}
                                    {/* {city.length != 0 && */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                <option disabled value="">Select</option>
                                                {/* {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})} */}
                                                {droplists.city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>
                                    {/* } */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zip_code'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')}onChange={(e) => formik.setFieldValue("pincode", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            {/* <input type="text" className="form-control" {...formik.getFieldProps('locality')}/> */}
                                            {/* <select className="form-select btn-sm text-start" {...formik.getFieldProps('locality')}>
                                                <option value="">Select</option>
                                                    {droplists?.locality?.map((localityValue:any,i:any)=> {
                                                    return (
                                                        <option value={localityValue.name} key={i}>{localityValue.name}</option>
                                                    )
                                                    })} 
                                                </select>   */}
                                                 <ReactSelect
                                                    options={droplists?.locality}
                                                    // closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                                    getOptionValue={(option:any) => option.id}
                                                    value={droplists?.locality?.find((item:any) => localityID == item.id) ?? []}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100"}
                                                    placeholder={"Locality"}
                                                    onChange={(val:any) => {
                                                        setLocalityID(val.id)
                                                        formik.setFieldValue("locality", val.id);                                               
                                                        }}
                                                    />
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='residential'>
                        <h2 className="accordion-header" id="headingthree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#three" aria-expanded="false" aria-controls="three">
                                {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="three" className="accordion-collapse collapse" aria-labelledby="headingthree" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_stage'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={projectStageName}
                                                onChange={projectStage}
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
                                                    return <p>{intl.formatMessage({id: 'project_stage'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'project_stage'})}</em>
                                                </MenuItem>
                                                {droplists.project_stage?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, projectStageName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_stage'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('project_stage')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.project_stage?.map((ownershipTypeVal:any,i:any) =>{
                                                    return (
                                                        <option value={ownershipTypeVal.id} key={i}>{ownershipTypeVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify_stage'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('specify_stage')} />
                                        </div> 
                                    </div> */}
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_project'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={ageOfProjectName}
                                                onChange={ageOfProject}
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
                                                    return <p>{intl.formatMessage({id: 'age_of_project'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'age_of_project'})}</em>
                                                </MenuItem>
                                                {droplists.age_of_property?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, ageOfProjectName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_project'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('age_of_project')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.age_of_property?.map((ownershipTypeVal:any,i:any) =>{
                                                    return (
                                                        <option value={ownershipTypeVal.id} key={i}>{ownershipTypeVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                                {...formik.getFieldProps('furnishing')} 
                                                className="btn_secondary btn btn-sm w-100">
                                                    <option value=''>Select</option>
                                                    {droplists.furnishing_status?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                            </select>
                                        </div>
                                    </div>                                      
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_builtup_area'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('builtup_area_min')} placeholder='Min' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("builtup_area_min", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('builtup_area_min_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('builtup_area_max')} placeholder='Max' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("builtup_area_max", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('builtup_area_max_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_plot_area'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('plot_area_min')} placeholder='Min' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("plot_area_min", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('plot_area_min_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div> 
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('plot_area_max')} placeholder='Max' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("plot_area_max", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('plot_area_max_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_tower'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('tower')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specifications_of_property'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={projectSpecificationName}
                                                onChange={projectSpecification}
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
                                                    return <p>{intl.formatMessage({id: 'specifications_of_property'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'specifications_of_property'})}</em>
                                                </MenuItem>
                                                {droplists.specification?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, projectSpecificationName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'if_other_specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('specifications_other')} />
                                        </div> 
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'uds'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('uds_min')} placeholder='Min' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("uds_min", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('uds_min_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div> 
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('uds_max')} placeholder='Max' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("uds_max", area)}} className="form-control" />
                                                    <select className="px-2 btn_secondary bg_secondary btn btn-sm prepend" {...formik.getFieldProps('uds_max_ut')}>
                                                    <option value=''>&#9660;</option>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div> 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_no_of_units'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" {...formik.getFieldProps('no_of_units_min')} placeholder='' onChange={(e) => {
                                            const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                            const inputValue = e.target.value;
                                            var area;
                                            
                                            if (!regex.test(inputValue)) {
                                                area = inputValue.slice(0, -1);
                                            } else {
                                                area = inputValue;
                                            }
                                            formik.setFieldValue("no_of_units_min", area)}} className="form-control" />                                                    
                                        </div>
                                        {/* <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('no_of_units_min')} placeholder='Min' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("no_of_units_min", area)}} className="form-control" />                                                    
                                                </div> 
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('no_of_units_max')} placeholder='Max' onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("no_of_units_max", area)}} className="form-control" />                                                    
                                                </div> 
                                            </div>
                                        </div> */}
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_no_of_floors'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_floors')} onChange={(e) => formik.setFieldValue("no_of_floors", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div> 
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_no_of_units'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_no_of_units')} onChange={(e) => formik.setFieldValue("total_no_of_units", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div>  */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'ownership_type'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('ownership_type')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.ownership_type?.map((ownershipTypeVal:any,i:any) =>{
                                                    return (
                                                        <option value={ownershipTypeVal.id} key={i}>{ownershipTypeVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_balcony'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('balcony')} onChange={(e) => formik.setFieldValue("balcony", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_facing'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('property_facing')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.project_facing?.map((propertyFacingVal:any,i:any) =>{
                                                    return (
                                                        <option value={propertyFacingVal.id} key={i}>{propertyFacingVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'kitchen_type'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('kitchen_type')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.kitchen_type?.map((kitchenTypeVal:any,i:any) =>{
                                                    return (
                                                        <option value={kitchenTypeVal.id} key={i}>{kitchenTypeVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'flooring'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('flooring')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.flooring?.map((flooringVal:any,i:any) =>{
                                                    return (
                                                        <option value={flooringVal.id} key={i}>{flooringVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'if_other_specify'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('other_units')}/>
                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'vasthu_compliant'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('vasthu_compliant')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value=''>Select</option>
                                                {droplists.vasthu_compliant?.map((vasthuCompVal:any,i:any) =>{
                                                    return (
                                                        <option value={vasthuCompVal.id} key={i}>{vasthuCompVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'currently_under_loan'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('currently_under_loan')}>
                                            <option value=''>Select</option>
                                                <option selected value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'available_from'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" className="form-control" {...formik.getFieldProps('available_from')} /> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'site_visit_preference'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'site_visit_preferences'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'site_visit_preferences'})}</em>
                                                </MenuItem>
                                                {droplists.site_visit_preference?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'key_custody'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select 
                                            {...formik.getFieldProps('key_custody')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option value='0'>Select</option>
                                                {droplists.key_custody?.map((keyCustodyVal:any,i:any) =>{
                                                    return (
                                                        <option value={keyCustodyVal.id} key={i}>{keyCustodyVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_car_park'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_car')} onChange={(e) => formik.setFieldValue("no_of_car", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_park_type'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('car_park_type')}>
                                            <option value='0'>Select</option>
                                            {droplists.car_park_type?.map((val:any, i:any) => {
                                                return(
                                                    <option value={val.id} key={i}>{val.option_value}</option> 
                                                )
                                            })}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'water_supply'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('water_supply')}>
                                            <option value='0'>Select</option>
                                            {droplists.water_supply?.map((Val:any,i:any) =>{
                                                    return (
                                                        <option value={Val.id} key={i}>{Val.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gated_community'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('gated_community')}>
                                            <option value=''>Select</option>
                                                <option selected value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={aminityName}
                                                onChange={handleChange}
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
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'amenities'})}</em>
                                                </MenuItem>
                                                {droplists.amenities?.map((amenity:any) => (
                                                    <MenuItem
                                                    key={amenity.id}
                                                    value={amenity.option_value+'-'+amenity.id}
                                                    style={getStyles(amenity.option_value, aminityName, theme)}
                                                    >
                                                    {amenity.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_highlight'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('property_highlight')} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'rera_registered'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('rera_registered')} onChange={(e) => setrera(e.target.value)} value={rera}>
                                            <option value=''>Select</option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    {rera == 1 && 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'rera_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('rera_number')} />
                                        </div>
                                    </div> 
                                    } 
                                    {/* <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'completion_certificate'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn_secondary btn btn-sm w-100">
                                            <option value=''>Select</option>
                                                <option value="1">Yes</option>
                                                <option value="2">Not Sure</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                    </div>  */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'completion_certificate_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('completion_certificate')} />
                                        </div>
                                    </div>                                   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='residentialUnits'>
                        <h2 className="accordion-header" id="headingeight">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#eight" aria-expanded="false" aria-controls="eight">
                                {intl.formatMessage({id: 'project_residentials'})}
                            </button>
                        </h2>
                        <div id="eight" className="accordion-collapse collapse" aria-labelledby="headingeight" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => { 
                                            var i = index + 1;
                                            return (
                                                <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                    <div className='row'>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'unit_type'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <select 
                                                            {...formik.getFieldProps('unit_type'+i)} 
                                                            onChange={onPlanChange}
                                                            id={'unit_type_'+i}
                                                            className="btn_secondary btn btn-sm w-100">
                                                                <option value='0'>Select</option>
                                                                {droplists.unit_type?.map((unitTypeVal:any,j:any) =>{
                                                                    return (
                                                                        <option selected={j == 0 ? true: false} value={unitTypeVal.option_value} key={unitTypeVal.id}>{unitTypeVal.option_value}</option> 
                                                                )})}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'builtup_area'})}</label>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" id={'builtup_area_min_'+i} {...formik.getFieldProps('builtup_area_min'+i)} onChange={(e) => {
                                                                        const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                        const inputValue = e.target.value;
                                                                        var area;
                                                                        
                                                                        if (!regex.test(inputValue)) {
                                                                            area = inputValue.slice(0, -1);
                                                                        } else {
                                                                            area = inputValue;
                                                                        }
                                                                        formik.setFieldValue('builtup_area_min'+i , area)}} placeholder='Min' className="form-control" />
                                                                        <select id={'builtup_area_min_ut_'+i}
                                                                            {...formik.getFieldProps('builtup_area_min_ut'+i)} 
                                                                            onChange={onPlanChange}
                                                                            className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                            <option value=''>&#9660;</option>
                                                                            {droplists.area_units?.map((areaUnit:any, j:any) => {
                                                                                return (
                                                                                    <option value={areaUnit.id} key={j}>{areaUnit.option_value}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                </div> 
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" id={'builtup_area_max_'+i} {...formik.getFieldProps('builtup_area_max'+i)} onChange={(e) => {
                                                                        const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                        const inputValue = e.target.value;
                                                                        var area;
                                                                        
                                                                        if (!regex.test(inputValue)) {
                                                                            area = inputValue.slice(0, -1);
                                                                        } else {
                                                                            area = inputValue;
                                                                        }
                                                                        formik.setFieldValue('builtup_area_max'+i , area)}} placeholder='Max' className="form-control" />
                                                                       <select id={'builtup_area_max_ut_'+i}
                                                                            {...formik.getFieldProps('builtup_area_max_ut_'+i)} 
                                                                            onChange={onPlanChange}
                                                                            className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                            <option value=''>&#9660;</option>
                                                                            {droplists.area_units?.map((areaUnit:any, j:any) => {
                                                                                return (
                                                                                    <option value={areaUnit.id} key={j}>{areaUnit.option_value}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <div className="row">
                                                            <div className="col-md-12 col-12">
                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_no_of_units'})}</label>
                                                                <div className="input-group mb-3 input_prepend">
                                                                    <input type="text" onKeyUp={onPlanChange} className="form-control" id={'total_units_'+i} {...formik.getFieldProps('total_units'+i)} onChange={(e) => formik.setFieldValue('total_units'+i, e.target?.value.replace(/[^0-9]/g, ""))}/>
                                                                    <select id={'total_units_ut_'+i}
                                                                        {...formik.getFieldProps('total_units_ut'+i)} 
                                                                        onChange={onPlanChange}
                                                                        className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                        <option value=''>Select</option>
                                                                        {droplists.area_units?.map((areaUnit:any, j:any) => {
                                                                            return (
                                                                                <option value={areaUnit.id} key={j}>{areaUnit.option_value}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div> 
                                                            </div> 
                                                            {/* <div className="col-md-6 col-12 mb-3">
                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'local_currency'})}</label>
                                                                <div className="input-group mb-3 input_prepend">
                                                                    <select 
                                                                    id={'local_currency_'+i}
                                                                    {...formik.getFieldProps('local_currency'+i)} 
                                                                    onChange={onPlanChange}
                                                                    className="btn_secondary btn btn-sm w-100">
                                                                        {droplists.currency?.map((currencyVal:any,j:any) =>{
                                                                            return (
                                                                                <option value={currencyVal.symbol} key={currencyVal.id}>{currencyVal.name+ '-' +currencyVal.symbol}</option> 
                                                                        )})}
                                                                    </select>
                                                                </div>
                                                            </div>  */}
                                                        </div> 
                                                    </div> 
                                                    <div className="col-md-6 col-12">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance_cost'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" onKeyUp={onPlanChange} className="form-control" id={'maintainance_cost_'+i} {...formik.getFieldProps('maintainance_cost'+i)} onChange={(e) => {
                                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                const inputValue = e.target.value;
                                                                var area;
                                                                
                                                                if (!regex.test(inputValue)) {
                                                                    area = inputValue.slice(0, -1);
                                                                } else {
                                                                    area = inputValue;
                                                                }
                                                                formik.setFieldValue('maintainance_cost'+i, area)}}/>
                                                            <select id={'maintainance_cost_ut_'+i}
                                                                {...formik.getFieldProps('maintainance_cost_ut'+i)} 
                                                                onChange={onPlanChange}
                                                                className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                <option value=''>Select</option>
                                                                {droplists.currency?.map((currencyVal:any, j:any) => {
                                                                    return (
                                                                        <option value={currencyVal.name} key={j}>{currencyVal.name + ' - '+ currencyVal.symbol}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </div> 
                                                    </div>
                                                    <div className="col-md-12 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sale_price'})}</label>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" id={'price_min_'+i} className="form-control" {...formik.getFieldProps('price_min'+i)} placeholder='Min' onChange={(e) => {
                                                                        const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                        const inputValue = e.target.value;
                                                                        var area;
                                                                        
                                                                        if (!regex.test(inputValue)) {
                                                                            area = inputValue.slice(0, -1);
                                                                        } else {
                                                                            area = inputValue;
                                                                        }
                                                                        formik.setFieldValue('price_min'+i, area)}} />

                                                                        <select id={'price_min_ut_'+i}
                                                                            {...formik.getFieldProps('price_min_ut'+i)} 
                                                                            onChange={onPlanChange}
                                                                            className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                            <option value=''>Select</option>
                                                                            {droplists.currency?.map((currencyVal:any, j:any) => {
                                                                                return (
                                                                                    <option value={currencyVal.name} key={j}>{currencyVal.name + ' - '+ currencyVal.symbol}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                </div> 
                                                            </div>
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" id={'price_max_'+i} className="form-control" {...formik.getFieldProps('price_max'+i)}  placeholder='Max' onChange={(e) => {
                                                                        handleDocumentsave(i)
                                                                        const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                                        const inputValue = e.target.value;
                                                                        var area;
                                                                        
                                                                        if (!regex.test(inputValue)) {
                                                                            area = inputValue.slice(0, -1);
                                                                        } else {
                                                                            area = inputValue;
                                                                        }
                                                                        formik.setFieldValue('price_max'+i, area)}}/>
                                                                        <select id={'price_max_ut_'+i}
                                                                            {...formik.getFieldProps('price_max_ut'+i)} 
                                                                            onChange={onPlanChange}
                                                                            className="px-0 py-2 btn_secondary w-10 text-center form-control btn btn-sm prepend"> 
                                                                            <option value=''>Select</option>
                                                                            {droplists.currency?.map((currencyVal:any, j:any) => {
                                                                                return (
                                                                                    <option value={currencyVal.name} key={j}>{currencyVal.name + ' - '+ currencyVal.symbol}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                </div> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="d-flex justify-content-center">
                                                            <div id={'file_img_sec_'+i} className='d-none profile_preview position-relative image-input image-input-outline'>
                                                                <img id={'file_img_'+i} className="image-input-wrapper w-125px h-125px" src="" alt="/" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="d-flex justify-content-center">
                                                            <div id={'file_img_sec_'+ i} className='d-none profile_preview position-relative image-input image-input-outline'>
                                                                <img id={'file_img_' + i} className="image-input-wrapper w-125px h-125px" src="" alt="/" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 d-flex justify-content-between align-items-center">
                                                        <span onDrop={(e:any) => processFile(e, i)} onDragOver={(e:any) => allowDrop(e, i)} className="btn btn-file d-flex flex-md-row p-2 p-md-4 d-none">
                                                            <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_floor_plan'})}<input id={'file_'+i} {...formik.getFieldProps('file'+i)} ref={profileView} onChange={(e:any) => handleFilePreview(e, i)} type="file"/>
                                                        </span>
                                                        {documentList.length !== 1 && (
                                                        <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={() => handleDocumentRemove(i)}>
                                                            <i className="fa fa-minus text_primary" aria-hidden="true"></i>
                                                        </button>
                                                        )}
                                                        {documentList.length - 1 === index && (
                                                        <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={()=>handleDocumentAdd(i)}>
                                                            <i className="fa fa-plus text_primary" aria-hidden="true"></i>
                                                        </button>
                                                        )}
                                                    </div>
                                                    <small className='text_primary pt-1 d-none'>* Note: jpg, jpeg, pdf only acceptable</small>
                                                </div>
                                                </div>
                                            )
                                        })}                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='projectDescription'>
                        <h2 className="accordion-header" id="headingfive">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#five" aria-expanded="false" aria-controls="five">
                                {intl.formatMessage({id: 'description'})}
                            </button>
                        </h2>
                        <div id="five" className="accordion-collapse collapse" aria-labelledby="headingfive" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-12 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'description'})}</label>
                                        <textarea
                                            className='form-control border-0 p-2 resize-none min-h-25px br_10'
                                            data-kt-autosize='true'
                                            {...formik.getFieldProps('description')} 
                                            rows={7} />
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='projectFilesUpload'>
                        <h2 className="accordion-header" id="headingsix">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#six" aria-expanded="false" aria-controls="six">
                        {intl.formatMessage({id: 'project_images_floor_plan_and_ocuments'})}
                            </button>
                        </h2>
                        <div id="six" className="accordion-collapse collapse" aria-labelledby="headingsix" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                            <div {...getRootProps({className: 'dropzone'})}>
                                    <div className='myDIV'>
                                        <div className="d-flex align-items-center justify-content-center w-100 h-100 vh-25">
                                            <span className="btn btn-file w-100 h-100">
                                                <KTSVG
                                                path='/media/icons/duotune/files/fil022.svg'
                                                className='svg-icon-1 text_primary ms-2'
                                                />
                                                <p className='text_primary'>{intl.formatMessage({id: 'upload_files_here'})}</p>
                                                <small className='text-dark required'>Note: jpg, jpeg, pdf only acceptable</small>
                                                <input {...getInputProps()}/>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <aside className='row mt-6'>
                                    {thumbs}
                                </aside>
                            </div>
                        </div>
                    </div>
                    {/* <div className="accordion-item" id='commercialConvensional'>
                        <h2 className="accordion-header" id="headingseven">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seven" aria-expanded="false" aria-controls="seven">
                                {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="seven" className="accordion-collapse collapse" aria-labelledby="headingseven" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'type_of_building'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'type_of_building'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'type_of_building'})}</em>
                                                </MenuItem>
                                                {droplists.type_of_building?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'grade_of_building'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'grade_of_building'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'grade_of_building'})}</em>
                                                </MenuItem>
                                                {droplists.grade_of_building?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_builtup_area')} onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("total_project_builtup_area", area)}} />
                                            <span className="input-group-text">sq.ft</span>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_plate_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('floor_plate_area')} onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("floor_plate_area", area)}} />
                                            <span className="input-group-text">sq.ft</span>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('building_structure')}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_floor'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_floor')} onChange={(e) => formik.setFieldValue("offered_floor", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_area')} onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;
                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("offered_area", area)}} />
                                            <span className="input-group-text">sq.ft</span>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_workstations'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_workstations')} onChange={(e) => formik.setFieldValue("no_of_workstations", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'workstation_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                        <select
                                            {...formik.getFieldProps('workstation_size')} 
                                            onChange={onPlanChange}
                                            className="btn_secondary btn btn-sm w-100">
                                                {droplists.currency?.map((currencyVal:any,j:any) =>{
                                                    return (
                                                        <option value={currencyVal.id} key={currencyVal.id}>{currencyVal.name}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_cabins')} onChange={(e) => formik.setFieldValue("no_of_cabins", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_conference_rooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_conference_rooms')} onChange={(e) => formik.setFieldValue("no_of_conference_rooms", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conference_rooms_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                        <select
                                            {...formik.getFieldProps('conference_rooms_size')} 
                                            onChange={onPlanChange}
                                            className="btn_secondary btn btn-sm w-100">
                                                {droplists.currency?.map((currencyVal:any,j:any) =>{
                                                    return (
                                                        <option value={currencyVal.id} key={currencyVal.id}>{currencyVal.name}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pantry'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_people'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_people')} onChange={(e) => formik.setFieldValue("no_of_people", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_washrooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_washrooms')} onChange={(e) => formik.setFieldValue("no_of_washrooms", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bike_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('bike_parking')} onChange={(e) => formik.setFieldValue("bike_parking", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div>                                 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('car_parking')}  onChange={(e) => formik.setFieldValue("car_parking", e.target?.value.replace(/[^0-9.-]/g, ""))}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'certifications'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'certifications'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'certifications'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'if_specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_area')} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'completion_certificate'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                        <select
                                            {...formik.getFieldProps('completion_certificate')}
                                            className="btn_secondary btn btn-sm w-100">
                                                <option disabled value=''>select</option> 
                                                <option value='1'>Yes</option> 
                                                <option value='0'>No</option> 
                                            </select>
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='conventionalUnits'>
                        <h2 className="accordion-header" id="headingnine">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#nine" aria-expanded="false" aria-controls="nine">
                            {intl.formatMessage({id: 'commercial_conventional'})}
                            </button>
                        </h2>
                        <div id="nine" className="accordion-collapse collapse" aria-labelledby="headingnine" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('quoted_rent_price_min')} onChange={(e) => formik.setFieldValue("quoted_rent_price_min", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder='Min' />
                                                    <span className="input-group-text">{currency}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" min="0" {...formik.getFieldProps('quoted_rent_price_max')} onChange={(e) => formik.setFieldValue("quoted_rent_price_max", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder='Max' />
                                                    <span className="input-group-text">{currency}</span>
                                                </div> 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('maintainance')} onChange={(e) => formik.setFieldValue("maintainance", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <span className="input-group-text">{currency+"/sq.ft"}</span>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('parking_charges')} onChange={(e) => formik.setFieldValue("parking_charges", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <span className="input-group-text">{currency+"/car"}</span>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('security_deposit')} onChange={(e) => formik.setFieldValue("security_deposit", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('escalation')} onChange={(e) => formik.setFieldValue("escalation", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('lock_in')} onChange={(e) => formik.setFieldValue("lock_in", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                            <span className="input-group-text">{intl.formatMessage({id: 'years'})}</span>
                                        </div> 
                                    </div> 
                                
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_term')}  onChange={(e) => formik.setFieldValue("total_term", e.target?.value.replace(/[^0-9.-]/g, ""))}/>
                                            <span className="input-group-text">{intl.formatMessage({id: 'years'})}</span>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='commercialCoworking'>
                        <h2 className="accordion-header" id="headingten">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ten" aria-expanded="false" aria-controls="ten">
                            {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="ten" className="accordion-collapse collapse" aria-labelledby="headingten" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'co-working_type'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('coworking_type')}>
                                            <option value=''>Select</option>
                                                {droplists.coworking_type?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_builtup_area')} />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_no_of_workstations'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_offered_floor'})}</label>
                                        <div className="row">                                            
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('plot_area_min')} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('plot_area_max')} className="form-control" />
                                                </div> 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_offered_workstations'})}</label>
                                        <div className="row">                                            
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('plot_area_min')} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('plot_area_max')} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_workstations'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'workstation_size'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstation_size')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_conference_rooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div>
                                        {formik.touched.address_line1 && formik.errors.address_line1 && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.address_line1}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conference_room_size'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstation_size')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pantry'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_people'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_area')} onChange={(e) => formik.setFieldValue("total_ctc", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                        {formik.touched.offered_area && formik.errors.offered_area && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.offered_area}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_washrooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_area')} onChange={(e) => formik.setFieldValue("total_ctc", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div>
                                        {formik.touched.offered_area && formik.errors.offered_area && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.offered_area}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'server_room'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bike_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>                                 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('latitude')}  onChange={(e) => formik.setFieldValue("latitude", e.target?.value.replace(/[^0-9.-]/g, ""))} />
                                        </div>
                                        {formik.touched.latitude && formik.errors.latitude && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.latitude}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'office_work_hours'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstation_size')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'certifications'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')} />
                                        </div>
                                        {formik.touched.locality && formik.errors.locality && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.locality}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='coworkingUnits'>
                        <h2 className="accordion-header" id="headingeleven">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#eleven" aria-expanded="false" aria-controls="eleven">
                            {intl.formatMessage({id: 'commercial_coworking'})}
                            </button>
                        </h2>
                        <div id="eleven" className="accordion-collapse collapse" aria-labelledby="headingeleven" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('quoted_rent_price_min')} onChange={(e) => formik.setFieldValue("quoted_rent_price_min", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('quoted_rent_price_max')} onChange={(e) => formik.setFieldValue("quoted_rent_price_min", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'onetime_setup_cost'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges_car'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>                                 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges_bike'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('latitude')}  onChange={(e) => formik.setFieldValue("latitude", e.target?.value.replace(/[^0-9.-]/g, ""))} />
                                        </div>
                                        {formik.touched.latitude && formik.errors.latitude && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.latitude}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div>
                                        {formik.touched.address_line1 && formik.errors.address_line1 && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.address_line1}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')} />
                                        </div>
                                        {formik.touched.locality && formik.errors.locality && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.locality}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='commercialIndustrial'>
                        <h2 className="accordion-header" id="headingtwelve">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#twelve" aria-expanded="false" aria-controls="twelve">
                            {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="twelve" className="accordion-collapse collapse" aria-labelledby="headingtwelve" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'type'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sub_type'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'office_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'warehouse_industrial_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_material'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'typical_floor_plate_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_ceiling_height'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'flooring'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fire_safety'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'possession_status'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_structure'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pantry'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'server_room'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bike_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstation_size')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>                                     
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='industrialUnits'>
                        <h2 className="accordion-header" id="headingthirteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#thirteen" aria-expanded="false" aria-controls="thirteen">
                            {intl.formatMessage({id: 'commercial_industrial'})}
                            </button>
                        </h2>
                        <div id="thirteen" className="accordion-collapse collapse" aria-labelledby="headingthirteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('quoted_rent_price_min')} className="form-control" />
                                                </div>
                                                {formik.touched.plot_area_min && formik.errors.plot_area_min && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.plot_area_min}</span>
                                            </div>
                                            </div>
                                        )} 
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('quoted_rent_price_max')} className="form-control" />
                                                </div>
                                                {formik.touched.plot_area_max && formik.errors.plot_area_max && (
                                                    <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.plot_area_max}</span>
                                                    </div>
                                                    </div>
                                                )} 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div>
                                        {formik.touched.address_line1 && formik.errors.address_line1 && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.address_line1}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')} />
                                        </div>
                                        {formik.touched.locality && formik.errors.locality && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.locality}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='commercialRetail'>
                        <h2 className="accordion-header" id="headingfourteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fourteen" aria-expanded="false" aria-controls="fourteen">
                            {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="fourteen" className="accordion-collapse collapse" aria-labelledby="headingfourteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'situated_at'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_suited_for'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Building Structure{intl.formatMessage({id: 'project_details'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_floor'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'visibility'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'possession_status'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_property'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('no_of_cabins_min')} className="form-control" />
                                                </div>
                                                {formik.touched.plot_area_min && formik.errors.plot_area_min && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.plot_area_min}</span>
                                            </div>
                                            </div>
                                        )} 
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('no_of_cabins_max')} className="form-control" />
                                                </div>
                                                {formik.touched.plot_area_max && formik.errors.plot_area_max && (
                                                    <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.plot_area_max}</span>
                                                    </div>
                                                    </div>
                                                )} 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'flooring'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'office_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'warehouse_industrial_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_material'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'typical_floor_plate_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_ceiling_height'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fire_safety'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'possession_status'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'age_of_structure'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pantry'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'server_room'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bike_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstation_size')}>
                                            <option value='0'>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
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
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>                                     
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='retailUnits'>
                        <h2 className="accordion-header" id="headingfifteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fifteen" aria-expanded="false" aria-controls="fifteen">
                            {intl.formatMessage({id: 'commercial_retail'})}
                            </button>
                        </h2>
                        <div id="fifteen" className="accordion-collapse collapse" aria-labelledby="headingfifteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )}
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('door_number')} />
                                        </div>
                                        {formik.touched.door_number && formik.errors.door_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.door_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div>
                                        {formik.touched.address_line1 && formik.errors.address_line1 && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.address_line1}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')} />
                                        </div>
                                        {formik.touched.locality && formik.errors.locality && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.locality}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='plots'>
                        <h2 className="accordion-header" id="headingsixteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sixteen" aria-expanded="false" aria-controls="sixteen">
                            {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="sixteen" className="accordion-collapse collapse" aria-labelledby="headingsixteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_type'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')}>
                                            <option value=''>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="1">Sq.ft</option>
                                                <option value="2">Sq.m</option>
                                                <option value="3">Acres</option>
                                                <option value="4">Sq.yd</option>
                                                <option value="5">Hectare</option>
                                                <option value="6">Bigha</option>
                                                <option value="7">Ground</option>
                                                <option value="8">Guntha</option>
                                                <option value="9">Sq.ft</option>
                                            </select>
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fsi'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'Frontage'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="1">M</option>
                                                <option value="2">Ft.</option>
                                            </select>
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'dimensions'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="1">M</option>
                                                <option value="2">Ft.</option>
                                            </select>
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'road_width'})}</label>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('builtup_area_min')} className="form-control" />
                                                </div> 
                                                {formik.touched.module_number && formik.errors.module_number && (
                                                    <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                                    </div>
                                                    </div>
                                                )} 
                                            </div>
                                            <div className="col-6">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('builtup_area_max')} className="form-control" />
                                                </div>
                                                {formik.touched.module_number && formik.errors.module_number && (
                                                    <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                                    </div>
                                                    </div>
                                                )} 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'corner_property'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'authority_approved'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => {
                                                    var name = [];
                                                    for(let i = 0; i < selected.length; i++){
                                                    var fields = selected[i].split('-');
                                                    var n = fields[0];
                                                    name.push(n);
                                                    }
                                                    if (selected.length === 0) {
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                    <MenuItem value={"No"+'-'+0}>
                                                    No
                                                    </MenuItem>
                                                    <MenuItem value={"Yes"+'-'+0}>
                                                    Yes
                                                    </MenuItem>
                                                    <MenuItem value={"Not Sure"+'-'+0}>
                                                    Not Sure
                                                    </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'boundary_wall'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => {
                                                    var name = [];
                                                    for(let i = 0; i < selected.length; i++){
                                                    var fields = selected[i].split('-');
                                                    var n = fields[0];
                                                    name.push(n);
                                                    }
                                                    if (selected.length === 0) {
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                <MenuItem value={"No"+'-'+0}>
                                                    No
                                                    </MenuItem>
                                                    <MenuItem value={"Yes"+'-'+0}>
                                                    Yes
                                                    </MenuItem>
                                                    <MenuItem value={"Not Sure"+'-'+0}>
                                                    Not Sure
                                                    </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'current_status'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={siteVisitName}
                                                onChange={siteVisitChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => {
                                                    var name = [];
                                                    for(let i = 0; i < selected.length; i++){
                                                    var fields = selected[i].split('-');
                                                    var n = fields[0];
                                                    name.push(n);
                                                    }
                                                    if (selected.length === 0) {
                                                    return <p>{intl.formatMessage({id: 'furnishing'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'furnishing'})}</em>
                                                </MenuItem>
                                                {droplists.furnishing?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, siteVisitName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>                                                                        
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='plotUnits'>
                        <h2 className="accordion-header" id="headingseventeen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seventeen" aria-expanded="false" aria-controls="seventeen">
                            {intl.formatMessage({id: 'commercial_plot'})}
                            </button>
                        </h2>
                        <div id="seventeen" className="accordion-collapse collapse" aria-labelledby="headingseventeen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )}
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'specify'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} />
                                        </div>
                                        {formik.touched.module_number && formik.errors.module_number && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.module_number}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} />
                                        </div>
                                        {formik.touched.address_line1 && formik.errors.address_line1 && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.address_line1}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')} />
                                        </div>
                                        {formik.touched.locality && formik.errors.locality && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.locality}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} />
                                        </div>
                                        {formik.touched.pincode && formik.errors.pincode && (
                                            <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.pincode}</span>
                                            </div>
                                            </div>
                                        )} 
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>                
                <div className='card-footer py-5 text-center' id='kt_contact_footer'>
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

export {ProjectForm}