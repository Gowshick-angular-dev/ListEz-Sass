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
    //These fields unique fields only
    //bassic
    contact_id: '',
    available_for: '',
    assign_to: '',
    commission: '',
    property_indepth: '',
    segment: '',
    property_type: '',
    property_source: '',
    property_status: '125',
    gst: '',
    invoice_name: '',
    legal_approval: '',
    description: '',
    profile_image: '',
    profile_image_original_name: '',

    //address
    name_of_building: '',
    door_number: '',
    address_line1: '',
    country: '',
    state: '',
    city: '',
    locality: '',
    pincode: '',
    latitude: '',
    longitude: '',
    module_number: '',

    //Commerical Conventional
    type_of_building: '',
    grade_of_building: '',
    total_project_built_up_area: '',
    total_project_built_up_area_ut: '355',
    floor_plate_areamap: '',
    floor_plate_area: '',
    floor_plate_area_ut: '355',
    building_structure: '',
    offered_floor: '',
    offered_area: '',
    offered_area_ut: '355',
    furnishing: '',
    no_of_workstations: '',
    workstations_size: '',
    no_of_cabins: '',
    no_of_conference_rooms: '',
    conference_room_size: '',
    pantry: '',
    no_of_people: '',
    washrooms: '',
    no_of_washrooms: '',
    bike_parking: '',
    car_parking: '',
    amenities: '',
    certifications: '',
    If_specify: '',
    completion_certificate: '',
    conventional_unit_type: '',

    // Commerical Co-working
    co_working_type: '',
    no_of_workstations_ut: '355',
    offered_floor_min: '',
    offered_floor_min_ut: '355',
    offered_floor_max: '',
    offered_floor_max_ut: '355',
    offered_workstations_max: '',
    offered_workstations_min: '',
    server_rooms: '',
    office_work_hours: '',
    office_work_hours_ut: '355',
    co_working_unit_type: '',

    //Commerical Industrial
    type: '',
    sub_type: '',
    specify: '',
    total_project_area: '',
    total_project_area_ut: '355',
    total_build_up_area: '',
    total_build_up_area_ut: '355',
    total_plot_area: '',
    total_plot_area_ut: '355',
    offered_build_up_area: '',
    offered_build_up_area_ut: '355',
    offered_plot_area: '',
    offered_plot_area_ut: '355',
    office_area: '',
    office_area_ut: '355',
    industrial_area: '',
    building_material: '',
    typical_floor_plate_size: '',
    typical_floor_plate_size_ut: '355',
    floor_ceiling_height: '',
    floor_ceiling_height_ut: '444',
    flooring: '',
    fire_safety: '',
    possession_status: '',
    age_of_structure: '',
    industrial_unit_type: '',

    // Commerical Retail
    situated_at: '',
    propery_suited_for: '',
    total_project_build_up_area: '',
    total_project_build_up_area_ut: '355',
    floor_plot_area: '',
    floor_plot_area_ut: '355',
    visibility: '',
    age_of_property: '',
    no_of_cabins_min: '',
    no_of_cabins_max: '',
    work_hours: '',
    work_hours_ut: '355',
    retail_unit_type: '',
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

    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [contactId, setContactId] = useState<any>('');
    const [assignToId, setAssignToId] = useState<string[]>([]);
    const [siteVisitName, setSiteVisitName] = useState<string[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [availableName, setAvailableName] = useState<any[]>([]);
    const [segmentCommercial, setSegmentCommercial] = useState('');
    const [siteVisitId, setSiteVisitId] = useState<any[]>([]);
    const [buildingTypeId, setBuildingTypeId] = useState<any[]>([]);
    const [buildingTypeName, setBuildingTypeName] = useState<any[]>([]);
    const [buildingGradeId, setBuildingGradeId] = useState<any[]>([]);
    const [buildingGradeName, setBuildingGradeName] = useState<any[]>([]);
    const [furnishingId, setFurnishingId] = useState<any[]>([]);
    const [furnishingName, setFurnishingName] = useState<any[]>([]);
    const [pantryId, setPantryId] = useState<any[]>([]);
    const [pantryName, setPantryName] = useState<any[]>([]);
    const [washroomsId, setWashroomsId] = useState<any[]>([]);
    const [washroomsName, setWashroomsName] = useState<any[]>([]);
    const [amenitiesId, setAmenitiesId] = useState<any[]>([]);
    const [amenitiesName, setAmenitiesName] = useState<any[]>([]);
    const [certificationId, setCertificationId] = useState<any[]>([]);
    const [certificationName, setCertificationName] = useState<any[]>([]);
    const [serverRoomId, setServerRoomId] = useState<any[]>([]);
    const [serverRoomName, setServerRoomName] = useState<any[]>([]);
    const [flooringId, setFlooringId] = useState<any[]>([]);
    const [flooringName, setFlooringName] = useState<any[]>([]);
    const [fireSaftyId, setFireSaftyId] = useState<any[]>([]);
    const [fireSaftyName, setFireSaftyName] = useState<any[]>([]);
    const [possesionId, setPossesionId] = useState<any[]>([]);
    const [possesionName, setPossesionName] = useState<any[]>([]);
    const [ageOfStructureId, setAgeOfStructureId] = useState<any[]>([]);
    const [ageOfStructureName, setAgeOfStructureName] = useState<any[]>([]);
    const [situatedAtId, setSituatedAtId] = useState<any[]>([]);
    const [situatedAtName, setSituatedAtName] = useState<any[]>([]);
    const [propertySuitedId, setPropertySuitedId] = useState<any[]>([]);
    const [propertySuitedName, setPropertySuitedName] = useState<any[]>([]);
    const [visibilityId, setVisibilityId] = useState<any[]>([]);
    const [visibilityName, setVisibilityName] = useState<any[]>([]);
    const [possessionId, setPossessionId] = useState<any[]>([]);
    const [possessionName, setPossessionName] = useState<any[]>([]);
    const [ageOfPropertyId, setAgeOfPropertyId] = useState<any[]>([]);
    const [ageOfPropertyName, setAgeOfPropertyName] = useState<any[]>([]);
    const [structureId, setStructureId] = useState<any[]>([]);
    const [structureName, setStructureName] = useState<any[]>([]);
    const [availableId, setAvailableId] = useState<string[]>([]);
    const [documentList, setDocumentList] = useState<any[]>([{
        "quoted_rent_price": '',
        "onetime_setup_cost": '',
        "quoted_rent_price_min": '',
        "quoted_rent_price_max": '',
        "quoted_rent_price_ut": '',
        "parking_charges": '',
        "parking_charges_bike": '',
        "parking_charges_car": '',
        "maintainance": '',
        "security_deposit": '',
        "escalation": '',
        "lock_in": '',
        "total_term": '',
        "segment": segmentCommercial,
        "maintainance_ut": '',
        "parking_charges_ut": '',
    }]);
    const profileView = useRef<HTMLInputElement>(null);
    const [droplists, setDroplists] = useState<any>({})
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [contactList, setContactList] = useState<any[]>([]);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);    
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
                name: (data[key].first_name)+ ' '+(data[key].last_name ?? '')
            }
            contact.push(body);
        }
        setContactList(contact);
    }

    useEffect(() => {
        dropdowns();
    }, [])

    const handleDocumentRemove = async (index:any) => {
        const newArray = [...documentList];
        newArray.splice(index, 1);        
        setDocumentList(newArray);
    };  

    const handleDocumentAdd = async (index:any) => {
        setDocumentList(post => [...post, {
            "quoted_rent_price": '',
            "onetime_setup_cost": '',
            "quoted_rent_price_min": '',
            "quoted_rent_price_max": '',
            "quoted_rent_price_ut": '',
            "parking_charges": '',
            "parking_charges_bike": '',
            "parking_charges_car": '',
            "maintainance": '',
            "security_deposit": '',
            "escalation": '',
            "lock_in": '',
            "total_term": '',
            "segment": segmentCommercial,
            "maintainance_ut": '',
        }])
    };

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
          setLoading(true);
          try {            
            var formData = new FormData();            
            for(let i = 0; i < files.length; i++){
                formData.append('images', files[i]);
            }

            //bassic & address
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
            formData.append('legal_approval', values.legal_approval);
            formData.append('invoice_name', values.invoice_name);
            formData.append('gst', values.gst);
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

            //convensional
            if(values.segment == '259') {
            formData.append('type_of_building', buildingTypeId?.join(',').toString());
            formData.append('grade_of_building', buildingGradeId?.join(',').toString());
            formData.append('total_project_built_up_area', values.total_project_built_up_area);
            formData.append('total_project_built_up_area_ut', values.total_project_built_up_area_ut);
            formData.append('floor_plate_area', values.floor_plate_area);
            formData.append('floor_plate_area_ut', values.floor_plate_area_ut);
            formData.append('building_structure', values.building_structure);
            formData.append('offered_floor', values.offered_floor)
            formData.append('offered_area', values.offered_area);
            formData.append('offered_area_ut', values.offered_area_ut);
            formData.append('furnishing', furnishingId.join(',').toString());
            formData.append('no_of_workstations', values.no_of_workstations);
            formData.append('workstations_size', values.workstations_size);
            formData.append('no_of_cabins', values.no_of_cabins);
            formData.append('no_of_conference_rooms', values.no_of_conference_rooms);
            formData.append('conference_room_size', values.conference_room_size);
            formData.append('pantry', pantryId.join(',').toString());
            formData.append('no_of_people', values.no_of_people);
            formData.append('washrooms', washroomsId.join(',').toString());
            formData.append('no_of_washrooms', values.no_of_washrooms);
            formData.append('bike_parking', values.bike_parking);
            formData.append('car_parking', values.car_parking);
            formData.append('amenities', amenitiesId?.join(',').toString());
            formData.append('certifications', certificationId?.join(',').toString());
            formData.append('If_specify', values.If_specify);
            formData.append('completion_certificate', values.completion_certificate);
            formData.append('conventional_unit_type', documentList.length > 0 ? JSON.stringify(documentList) : '');

            //co working
            } else if(values.segment == '364') {
            formData.append('co_working_type', values.co_working_type);
            formData.append('total_project_built_up_area', values.total_project_built_up_area);
            formData.append('total_project_built_up_area_ut', values.total_project_built_up_area_ut);
            formData.append('no_of_workstations', values.no_of_workstations);
            formData.append('no_of_workstations_ut', values.no_of_workstations_ut);
            formData.append('offered_floor_min', values.offered_floor_min);
            formData.append('offered_floor_min_ut', values.offered_floor_min_ut);
            formData.append('offered_floor_max', values.offered_floor_max);
            formData.append('offered_floor_max_ut', values.offered_floor_max_ut);
            formData.append('offered_workstations_max', values.offered_workstations_max);
            formData.append('offered_workstations_min', values.offered_workstations_min);
            formData.append('workstations_size', values.workstations_size);
            formData.append('no_of_cabins', values.no_of_cabins);
            formData.append('no_of_conference_rooms', values.no_of_conference_rooms);
            formData.append('conference_room_size', values.conference_room_size);
            formData.append('pantry', pantryId.join(',').toString());
            formData.append('no_of_people', values.no_of_people);
            formData.append('washrooms', washroomsId.join(',').toString());
            formData.append('no_of_washrooms', values.no_of_washrooms);
            formData.append('server_rooms', serverRoomId.join(',').toString());
            formData.append('bike_parking', values.bike_parking);
            formData.append('car_parking', values.car_parking);
            formData.append('office_work_hours', values.office_work_hours);
            formData.append('office_work_hours_ut', values.office_work_hours_ut);
            formData.append('amenities', amenitiesId?.join(',').toString());
            formData.append('certifications', values.certifications);
            formData.append('co_working_unit_type', documentList.length > 0 ? JSON.stringify(documentList) : '');

            //Commerical Industrial
            } else if(values.segment == '365') {
            formData.append('type', values.type);
            formData.append('sub_type', values.sub_type);
            formData.append('specify', values.specify);
            formData.append('total_project_area', values.total_project_area);
            formData.append('total_project_area_ut', values.total_project_area_ut);
            formData.append('total_build_up_area', values.total_build_up_area);
            formData.append('total_build_up_area_ut', values.total_build_up_area_ut);
            formData.append('total_plot_area', values.total_plot_area);
            formData.append('total_plot_area_ut', values.total_plot_area_ut);
            formData.append('offered_build_up_area', values.offered_build_up_area);
            formData.append('offered_build_up_area_ut', values.offered_build_up_area_ut);            
            formData.append('offered_plot_area', values.offered_plot_area);
            formData.append('offered_plot_area_ut', values.offered_plot_area_ut);
            formData.append('office_area', values.office_area);
            formData.append('office_area_ut', values.office_area_ut);
            formData.append('industrial_area', values.industrial_area);
            formData.append('building_structure', values.building_structure);
            formData.append('building_material', values.building_material);
            formData.append('typical_floor_plate_size', values.typical_floor_plate_size);
            formData.append('typical_floor_plate_size_ut', values.typical_floor_plate_size_ut);
            formData.append('floor_ceiling_height', values.floor_ceiling_height);
            formData.append('floor_ceiling_height_ut', values.floor_ceiling_height_ut);
            formData.append('flooring', flooringId.join(',').toString());
            formData.append('fire_safety', fireSaftyId.join(',').toString());
            formData.append('possession_status', possesionId.join(',').toString());
            formData.append('age_of_structure', ageOfStructureId.join(',').toString());
            formData.append('pantry', pantryId.join(',').toString());
            formData.append('no_of_people', values.no_of_people);
            formData.append('washrooms', washroomsId.join(',').toString());
            formData.append('server_rooms', serverRoomId.join(',').toString());
            formData.append('bike_parking', values.bike_parking);
            formData.append('car_parking', values.car_parking);
            formData.append('amenities', amenitiesId?.join(',').toString());
            formData.append('industrial_unit_type', documentList.length > 0 ? JSON.stringify(documentList) : '');

            //Commerical Retail
            } else if(values.segment == '366') {
            formData.append('situated_at', situatedAtId.join(',').toString());
            formData.append('propery_suited_for', propertySuitedId.join(',').toString());
            formData.append('total_project_build_up_area', values.total_project_build_up_area);
            formData.append('total_project_build_up_area_ut', values.total_project_build_up_area_ut);
            formData.append('floor_plot_area', values.floor_plot_area);
            formData.append('floor_plot_area_ut', values.floor_plot_area_ut);
            formData.append('building_structure', structureId.join(',').toString());
            formData.append('offered_floor', values.offered_floor);
            formData.append('offered_area', values.offered_area);
            formData.append('offered_area_ut', values.offered_area_ut);
            formData.append('furnishing', furnishingId.join(',').toString());
            formData.append('visibility', visibilityId.join(',').toString());
            formData.append('possession_status', possessionId.join(',').toString());
            formData.append('age_of_property', ageOfPropertyId.join(',').toString());
            formData.append('no_of_cabins_min', values.no_of_cabins_min);
            formData.append('no_of_cabins_max', values.no_of_cabins_max);
            formData.append('washrooms', washroomsId.join(',').toString());
            formData.append('no_of_washrooms', values.no_of_washrooms);
            formData.append('bike_parking', values.bike_parking);
            formData.append('car_parking', values.car_parking);
            formData.append('work_hours', values.work_hours);
            formData.append('work_hours_ut', values.work_hours_ut);
            formData.append('amenities', amenitiesId?.join(',').toString());
            formData.append('retail_unit_type', documentList.length > 0 ? JSON.stringify(documentList) : '');
            }
    
            const savePropertyData = await saveProperty(formData);
            if(savePropertyData.status == 200){
                setLoading(false);
                document.getElementById('kt_property_close')?.click();
                document.getElementById('propertyReloadBtn')?.click();
                resetForm();
                setBuildingTypeId([]);
                setBuildingTypeName([]);
                setBuildingGradeId([]);
                setBuildingGradeName([]);
                setFurnishingId([]);
                setFurnishingName([]);
                setPantryId([]);
                setPantryName([]);
                setWashroomsId([]);
                setWashroomsName([]);
                setAmenitiesId([]);
                setAmenitiesName([]);
                setCertificationId([]);
                setCertificationName([]);
                setServerRoomId([]);
                setServerRoomName([]);
                setFlooringId([]);
                setFlooringName([]);
                setFireSaftyId([]);
                setFireSaftyName([]);
                setPossesionId([]);
                setPossesionName([]);
                setAgeOfStructureId([]);
                setAgeOfStructureName([]);
                setSituatedAtId([]);
                setSituatedAtName([]);
                setPropertySuitedId([]);
                setPropertySuitedName([]);
                setVisibilityId([]);
                setVisibilityName([]);
                setPossessionId([]);
                setPossessionName([]);
                setAgeOfPropertyId([]);
                setAgeOfPropertyName([]);
                setStructureId([]);
                setStructureName([]);
                setDocumentList([{
                    "quoted_rent_price": '',
                    "onetime_setup_cost": '',
                    "quoted_rent_price_min": '',
                    "quoted_rent_price_max": '',
                    "quoted_rent_price_ut": '',
                    "parking_charges": '',
                    "parking_charges_bike": '',
                    "parking_charges_car": '',
                    "maintainance": '',
                    "security_deposit": '',
                    "escalation": '',
                    "lock_in": '',
                    "total_term": '',
                    "segment": segmentCommercial,
                    "maintainance_ut": '',
                    "parking_charges_ut": '',
                }]);
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
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                formik.setFieldValue("commission", area)}} maxLength={16} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('commission_unit')}>
                                                <option value="1">%</option>
                                                <option value="2">₹</option>
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'segment'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('segment')} onChange={(e) => {
                                                setSegmentCommercial(e.target.value);
                                                formik.setFieldValue("segment", e.target.value);
                                                setDocumentList([{
                                                    "quoted_rent_price": '',
                                                    "onetime_setup_cost": '',
                                                    "quoted_rent_price_min": '',
                                                    "quoted_rent_price_max": '',
                                                    "quoted_rent_price_ut": '',
                                                    "parking_charges": '',
                                                    "parking_charges_bike": '',
                                                    "parking_charges_car": '',
                                                    "maintainance": '',
                                                    "security_deposit": '',
                                                    "escalation": '',
                                                    "lock_in": '',
                                                    "total_term": '',
                                                    "segment": e.target.value,
                                                    "maintainance_ut": '',
                                                    "parking_charges_ut": '',
                                                }]);
                                                }}>
                                                <option disabled value=''>Select</option>
                                                {droplists.segment?.map((segmentVal: any,i: any) =>{
                                                    if(segmentVal.id != '258' && segmentVal.id != '260') {
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )}})}
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('invoice_name')} maxLength={50} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('gst')} maxLength={50} />
                                        </div> 
                                    </div>
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('name_of_building')} maxLength={50} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_1'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line1')} maxLength={50} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_line_2'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('address_line2')} maxLength={50} />
                                        </div> 
                                    </div>  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('module_number')} maxLength={50} />
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
                                                {droplists.country?.map((data: any, i: React.Key | null | undefined) => {
                                                return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>
                                    {state.length != 0 &&
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
                                    </div>}
                                    {city.length != 0 &&
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                <option disabled value="">Select</option>
                                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zip_code'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('pincode')} maxLength={6} onChange={(e) => formik.setFieldValue("pincode", e.target?.value.replace(/[^0-9]/g, ""))}/>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('locality')}/>
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={formik.values?.segment == "259" ? "accordion-item" : "d-none"} id='commercialConvensional'>
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
                                                value={buildingTypeName}
                                                onChange={(event: SelectChangeEvent<typeof buildingTypeName>) => {
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
                                                    setBuildingTypeId(id);
                                                    setBuildingTypeName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                value={buildingGradeName}
                                                onChange={(event: SelectChangeEvent<typeof buildingGradeName>) => {
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
                                                    setBuildingGradeId(id);    
                                                    setBuildingGradeName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_built_up_area')} onChange={(e) => {
                                                const regex = /^[+-]?\d*\.?\d{0,2}$/;
                                                const inputValue = e.target.value;
                                                var area;                                                
                                                if (!regex.test(inputValue)) {
                                                    area = inputValue.slice(0, -1);
                                                } else {
                                                    area = inputValue;
                                                }
                                                formik.setFieldValue("total_project_built_up_area", area)}} maxLength={16} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_project_built_up_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
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
                                                formik.setFieldValue("floor_plate_area", area)}} maxLength={16} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('floor_plate_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('building_structure')} maxLength={50}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_floor'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_floor')} onChange={(e) => formik.setFieldValue("offered_floor", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
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
                                                formik.setFieldValue("offered_area", area)}} maxLength={16} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('offered_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={furnishingName}
                                                onChange={(event: SelectChangeEvent<typeof furnishingName>) => {
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
                                                    setFurnishingId(id);    
                                                    setFurnishingName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                {droplists.furnishing_status?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_workstations')} onChange={(e) => formik.setFieldValue("no_of_workstations", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'workstation_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                        <select
                                            {...formik.getFieldProps('workstations_size')} 
                                            className="btn_secondary btn btn-sm w-100">
                                                <option selected disabled value=''>select</option>
                                                {droplists.workstations_size?.map((currencyVal:any,j:any) =>{
                                                    return (
                                                        <option value={currencyVal.id} key={currencyVal.id}>{currencyVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_cabins')} onChange={(e) => formik.setFieldValue("no_of_cabins", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_conference_rooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_conference_rooms')} onChange={(e) => formik.setFieldValue("no_of_conference_rooms", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conference_room_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select
                                            {...formik.getFieldProps('conference_room_size')}
                                            className="btn_secondary btn btn-sm w-100">
                                                <option selected disabled value=''>select</option>
                                                {droplists.conference_rooms_size?.map((currencyVal:any,j:any) =>{
                                                    return (
                                                        <option value={currencyVal.id} key={currencyVal.id}>{currencyVal.option_value}</option> 
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
                                                value={pantryName}
                                                onChange={(event: SelectChangeEvent<typeof pantryName>) => {
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
                                                    setPantryId(id);    
                                                    setPantryName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'pantry'})}</em>
                                                </MenuItem>
                                                {droplists.pantry?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_people')} onChange={(e) => formik.setFieldValue("no_of_people", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={washroomsName}
                                                onChange={(event: SelectChangeEvent<typeof washroomsName>) => {
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
                                                    setWashroomsId(id);    
                                                    setWashroomsName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'washrooms'})}</em>
                                                </MenuItem>
                                                {droplists.washrooms?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_washrooms')} onChange={(e) => formik.setFieldValue("no_of_washrooms", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bike_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('bike_parking')} onChange={(e) => formik.setFieldValue("bike_parking", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5} />
                                        </div> 
                                    </div>                                 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('car_parking')}  onChange={(e) => formik.setFieldValue("car_parking", e.target?.value.replace(/[^0-9.-]/g, ""))} maxLength={5} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={amenitiesName}
                                                onChange={(event: SelectChangeEvent<typeof amenitiesName>) => {
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
                                                    setAmenitiesId(id);    
                                                    setAmenitiesName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                {droplists.amenities?.map((siteVisitVal:any) => (
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
                                                value={certificationName}
                                                onChange={(event: SelectChangeEvent<typeof certificationName>) => {
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
                                                    setCertificationId(id);    
                                                    setCertificationName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                {droplists.certifications?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, certificationName, theme)}
                                                    >
                                                    {siteVisitVal.option_value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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
                    <div className={formik.values?.segment == "259" ? "accordion-item" : "d-none"} id='conventionalUnits'>
                        <h2 className="accordion-header" id="headingnine">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#nine" aria-expanded="false" aria-controls="nine">
                            {intl.formatMessage({id: 'conventional_units'})}
                            </button>
                        </h2>
                        <div id="nine" className="accordion-collapse collapse" aria-labelledby="headingnine" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => { 
                                        var i = index;
                                        return (
                                            <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                <div className="row">
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" value={singleService.quoted_rent_price_min} onChange={(e) => {
                                                                    setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_min = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" placeholder='Min' />
                                                                    <span className="input-group-text">₹</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" value={singleService.quoted_rent_price_max} onChange={(e) => {
                                                                    setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_max = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" placeholder='Max' />
                                                                    <span className="input-group-text">₹</span>
                                                                </div> 
                                                            </div>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" value={singleService.maintainance} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.maintainance = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" value={singleService.maintainance_ut} onChange={(e) => {
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
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" value={singleService.parking_charges} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.parking_charges = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <select className="px-0 ps-1 py-2 btn-light btn btn-sm prepend text-center" value={singleService.parking_charges_ut} onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.quoted_rent_price_ut = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}}>
                                                                <option value="car">car</option>
                                                                <option value="bike">bike</option>
                                                            </select>
                                                        </div> 
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" value={singleService.security_deposit} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.security_deposit = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}}/>
                                                            <span className="input-group-text">₹</span>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'escalation'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" value={singleService.escalation} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.escalation = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">%</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'lock_in'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" value={singleService.lock_in} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.lock_in = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">{intl.formatMessage({id: 'years'})}</span>
                                                        </div> 
                                                    </div>                                                 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_term'})}</label>
                                                        <div className="input-group mb-3 input_prepend mx-1">
                                                            <input type="text" value={singleService.total_term} className="form-control" onChange={(e) => {
                                                            setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.total_term = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">{intl.formatMessage({id: 'years'})}</span>
                                                        </div>
                                                    </div> 
                                                    <div className={documentList.length !== 1 ? "col-12 d-flex justify-content-between align-items-center" : "col-12 d-flex justify-content-end align-items-center"}>
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
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={formik.values?.segment == "364" ? "accordion-item" : "d-none"} id='commercialCoworking'>
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
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('co_working_type')}>
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_built_up_area')} onChange={(e) => formik.setFieldValue("total_project_built_up_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_project_builtup_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_offered_floor'})}</label>
                                        <div className="row">                                            
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('offered_floor_min')} onChange={(e) => formik.setFieldValue("offered_floor_min", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('offered_floor_max')} onChange={(e) => formik.setFieldValue("offered_floor_max", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div> 
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_offered_workstations'})}</label>
                                        <div className="row">                                            
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('offered_workstations_min')} onChange={(e) => formik.setFieldValue("offered_workstations_min", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('offered_workstations_max')} onChange={(e) => formik.setFieldValue("offered_workstations_max", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_workstations'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_workstations')} onChange={(e) => formik.setFieldValue("no_of_workstations", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'workstation_size'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('workstations_size')}>
                                            <option value=''>Select</option>
                                                {droplists.workstations_size?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_cabins'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_cabins')} onChange={(e) => formik.setFieldValue("no_of_cabins", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_conference_rooms'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_conference_rooms')} onChange={(e) => formik.setFieldValue("no_of_conference_rooms", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conference_room_size'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('conference_room_size')}>
                                            <option value=''>Select</option>
                                                {droplists.conference_rooms_size?.map((segmentVal: any,i: any) =>{
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
                                                value={pantryName}
                                                onChange={(event: SelectChangeEvent<typeof pantryName>) => {
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
                                                    setPantryId(id);
                                                    setPantryName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'pantry'})}</em>
                                                </MenuItem>
                                                {droplists.pantry?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_people')} onChange={(e) => formik.setFieldValue("no_of_people", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={washroomsName}
                                                onChange={(event: SelectChangeEvent<typeof washroomsName>) => {
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
                                                    setWashroomsId(id);
                                                    setWashroomsName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'select'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'washrooms'})}</em>
                                                </MenuItem>
                                                {droplists.washrooms?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('no_of_washrooms')} onChange={(e) => formik.setFieldValue("no_of_washrooms", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'server_room'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={serverRoomName}
                                                onChange={(event: SelectChangeEvent<typeof serverRoomName>) => {
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
                                                    setServerRoomId(id);
                                                    setServerRoomName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'serverRoom'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'serverRoom'})}</em>
                                                </MenuItem>
                                                {droplists.server_room?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('bike_parking')} onChange={(e) => formik.setFieldValue("bike_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div>                                 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend mx-1">
                                            <input type="text" className="form-control" {...formik.getFieldProps('car_parking')}  onChange={(e) => formik.setFieldValue("car_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'office_work_hours'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('office_work_hours')}>
                                            <option value=''>Select</option>
                                                {droplists.office_work_hours?.map((segmentVal: any,i: any) =>{
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
                                                value={amenitiesName}
                                                onChange={(event: SelectChangeEvent<typeof amenitiesName>) => {
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
                                                    setAmenitiesId(id);
                                                    setAmenitiesName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'amenities'})}</em>
                                                </MenuItem>
                                                {droplists.amenities?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('certifications')} />
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={formik.values?.segment == "364" ? "accordion-item" : "d-none"} id='coworkingUnits'>
                        <h2 className="accordion-header" id="headingeleven">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#eleven" aria-expanded="false" aria-controls="eleven">
                            {intl.formatMessage({id: 'coworking_units'})}
                            </button>
                        </h2>
                        <div id="eleven" className="accordion-collapse collapse" aria-labelledby="headingeleven" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => { 
                                        var i = index;
                                        return (
                                            <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                <div className="row">
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" value={singleService.quoted_rent_price_min} onChange={(e) => {
                                                                        setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_min = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" />
                                                                    <span className="input-group-text">₹</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="text" value={singleService.quoted_rent_price_max} onChange={(e) => {
                                                                        setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_max = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" />
                                                                    <span className="input-group-text">₹</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'onetime_setup_cost'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.onetime_setup_cost} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.onetime_setup_cost = e.target.value;
                                                                }
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges_car'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.parking_charges_car} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.parking_charges_car = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹/car</span>
                                                        </div> 
                                                    </div>                                 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges_bike'})}</label>
                                                        <div className="input-group mb-3 input_prepend mx-1">
                                                            <input type="text" className="form-control" value={singleService.parking_charges_bike} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.parking_charges_bike = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹/bike</span>
                                                        </div> 
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.security_deposit} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.security_deposit = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
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
                                                                    objectToUpdate.escalation = e.target.value;
                                                                }
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
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
                                                                    objectToUpdate.lock_in = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}}/>
                                                            <span className="input-group-text">years</span>
                                                        </div> 
                                                    </div>  
                                                    <div className={documentList.length !== 1 ? "col-12 d-flex justify-content-between align-items-center" : "col-12 d-flex justify-content-end align-items-center"}>
                                                        {documentList.length !== 1 && (
                                                        <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={() => handleDocumentRemove(i)}>
                                                            <i className="fa fa-minus text_primary" aria-hidden="true"></i>
                                                        </button>
                                                        )}
                                                        {documentList.length - 1 === index && (
                                                        <button className="btn btn-sm btn_soft_primary ps-5 pe-4" onClick={()=> handleDocumentAdd(i)}>
                                                            <i className="fa fa-plus text_primary" aria-hidden="true"></i>
                                                        </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                   
                    <div className={formik.values?.segment == "365" ? "accordion-item" : "d-none"} id='commercialIndustrial'>
                        <h2 className="accordion-header" id="headingtwelve">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#twelve" aria-expanded="false" aria-controls="twelve">
                            {intl.formatMessage({id: 'project_details'})}
                            </button>
                        </h2>
                        <div id="twelve" className="accordion-collapse collapse" aria-labelledby="headingtwelve" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'industrial_type'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('type')}>
                                            <option value=''>Select</option>
                                                {droplists.industrial_type?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_area')} onChange={(e) => formik.setFieldValue("total_project_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_project_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_build_up_area')} onChange={(e) => formik.setFieldValue("total_build_up_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_build_up_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_plot_area')} onChange={(e) => formik.setFieldValue("total_plot_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_plot_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_build_up_area')} onChange={(e) => formik.setFieldValue("offered_build_up_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('offered_build_up_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_plot_area')} onChange={(e) => formik.setFieldValue("offered_plot_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('offered_plot_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'office_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('office_area')} onChange={(e) => formik.setFieldValue("office_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('office_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'warehouse_industrial_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('industrial_area')} onChange={(e) => formik.setFieldValue("industrial_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('industrial_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('building_structure')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_material'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('building_material')} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'typical_floor_plate_size'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('typical_floor_plate_size')} onChange={(e) => formik.setFieldValue("typical_floor_plate_size", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('typical_floor_plate_size_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_ceiling_height'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('floor_ceiling_height')} onChange={(e) => formik.setFieldValue("floor_ceiling_height", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('floor_ceiling_height_ut')}>
                                                {droplists.height_unit?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'flooring'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={flooringName}
                                                onChange={(event: SelectChangeEvent<typeof flooringName>) => {
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
                                                    setFlooringId(id);
                                                    setFlooringName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'flooring'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'flooring'})}</em>
                                                </MenuItem>
                                                {droplists.flooring?.map((siteVisitVal:any) => (
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
                                                value={fireSaftyName}
                                                onChange={(event: SelectChangeEvent<typeof fireSaftyName>) => {
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
                                                    setFireSaftyId(id);
                                                    setFireSaftyName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'fire_safety'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'fire_safety'})}</em>
                                                </MenuItem>
                                                {droplists.fire_safety?.map((siteVisitVal:any) => (
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
                                                value={possesionName}
                                                onChange={(event: SelectChangeEvent<typeof possesionName>) => {
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
                                                    setPossesionId(id);
                                                    setPossesionName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'possesion'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'possesion'})}</em>
                                                </MenuItem>
                                                {droplists.possession_status?.map((siteVisitVal:any) => (
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
                                                value={ageOfStructureName}
                                                onChange={(event: SelectChangeEvent<typeof ageOfStructureName>) => {
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
                                                    setAgeOfStructureId(id);
                                                    setAgeOfStructureName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'age_of_structure'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'age_of_structure'})}</em>
                                                </MenuItem>
                                                {droplists.age_of_property?.map((siteVisitVal:any) => (
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
                                                value={pantryName}
                                                onChange={(event: SelectChangeEvent<typeof pantryName>) => {
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
                                                    setPantryId(id);
                                                    setPantryName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'pantry'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'pantry'})}</em>
                                                </MenuItem>
                                                {droplists.pantry?.map((siteVisitVal:any) => (
                                                    <MenuItem
                                                    key={siteVisitVal.id}
                                                    value={siteVisitVal.option_value+'-'+siteVisitVal.id}
                                                    style={getStyles(siteVisitVal.option_value, pantryName, theme)}
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
                                                value={washroomsName}
                                                onChange={(event: SelectChangeEvent<typeof washroomsName>) => {
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
                                                    setWashroomsId(id);
                                                    setWashroomsName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'washrooms'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'washrooms'})}</em>
                                                </MenuItem>
                                                {droplists.washrooms?.map((siteVisitVal:any) => (
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
                                                value={serverRoomName}
                                                onChange={(event: SelectChangeEvent<typeof serverRoomName>) => {
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
                                                    setServerRoomId(id);
                                                    setServerRoomName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'server_room'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'server_room'})}</em>
                                                </MenuItem>
                                                {droplists.server_room?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('bike_parking')} onChange={(e) => formik.setFieldValue("bike_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('car_parking')} onChange={(e) => formik.setFieldValue("car_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={amenitiesName}
                                                onChange={(event: SelectChangeEvent<typeof amenitiesName>) => {
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
                                                    setAmenitiesId(id);
                                                    setAmenitiesName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'amenities'})}</em>
                                                </MenuItem>
                                                {droplists.amenities?.map((siteVisitVal:any) => (
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
                    <div className={formik.values?.segment == "365" ? "accordion-item" : "d-none"} id='industrialUnits'>
                        <h2 className="accordion-header" id="headingthirteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#thirteen" aria-expanded="false" aria-controls="thirteen">
                            {intl.formatMessage({id: 'industrial_units'})}
                            </button>
                        </h2>
                        <div id="thirteen" className="accordion-collapse collapse" aria-labelledby="headingthirteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => { 
                                        var i = index;
                                        return (
                                            <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                <div className="row">
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                                        <div className="row">
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="number" value={singleService.quoted_rent_price_min} onChange={(e) => {
                                                                        setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_min = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" />
                                                                    <span className="input-group-text">₹</span>
                                                                </div>                                                                 
                                                            </div>
                                                            <div className="col-md-6 col-12">
                                                                <div className="input-group first mb-3 input_prepend">
                                                                    <input type="number" value={singleService.quoted_rent_price_max} onChange={(e) => {
                                                                        setDocumentList(prevData => {
                                                                        const updatedData = [...prevData];
                                                                        const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                        
                                                                        if (objectToUpdate) {
                                                                            objectToUpdate.quoted_rent_price_max = e.target.value;
                                                                        }                                                                        
                                                                        return updatedData;
                                                                        })}} className="form-control" />
                                                                    <span className="input-group-text">₹</span>
                                                                </div> 
                                                            </div>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.maintainance} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.maintainance = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div> 
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.parking_charges} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.parking_charges = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div> 
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.security_deposit} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);                                                                
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.security_deposit = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
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
                                                                    objectToUpdate.escalation = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
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
                                                                    objectToUpdate.lock_in = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
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
                                                                    objectToUpdate.total_term = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
                                                        </div> 
                                                    </div>  
                                                    <div className={documentList.length !== 1 ? "col-12 d-flex justify-content-between align-items-center" : "col-12 d-flex justify-content-end align-items-center"}>
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
                                                </div>
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={formik.values?.segment == "366" ? "accordion-item" : "d-none"} id='commercialRetail'>
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
                                                value={situatedAtName}
                                                onChange={(event: SelectChangeEvent<typeof situatedAtName>) => {
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
                                                    setSituatedAtId(id);
                                                    setSituatedAtName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'situated_at'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'situated_at'})}</em>
                                                </MenuItem>
                                                {droplists.property_situated_at?.map((siteVisitVal:any) => (
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
                                                value={propertySuitedName}
                                                onChange={(event: SelectChangeEvent<typeof propertySuitedName>) => {
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
                                                    setPropertySuitedId(id);
                                                    setPropertySuitedName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'property_suited_for'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'property_suited_for'})}</em>
                                                </MenuItem>
                                                {droplists.property_suited_for?.map((siteVisitVal:any) => (
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
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'work_hours'})}</label>
                                        <div className="input-group mb-3 input_prepend py-1">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('work_hours')}>
                                            <option value=''>Select</option>
                                                {droplists.office_work_hours?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_project_builtup_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('total_project_build_up_area')} onChange={(e) => formik.setFieldValue("total_project_build_up_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend text-center" {...formik.getFieldProps('total_project_build_up_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'building_structure'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('building_structure')} />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_floor'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_floor')} />
                                        </div>
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'offered_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('offered_area')} onChange={(e) => formik.setFieldValue("offered_area", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'furnishing'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={furnishingName}
                                                onChange={(event: SelectChangeEvent<typeof furnishingName>) => {
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
                                                    setFurnishingId(id);
                                                    setFurnishingName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                {droplists.furnishing_status?.map((siteVisitVal:any) => (
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
                                                value={visibilityName}
                                                onChange={(event: SelectChangeEvent<typeof visibilityName>) => {
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
                                                    setVisibilityId(id);
                                                    setVisibilityName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'visibility'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'visibility'})}</em>
                                                </MenuItem>
                                                {droplists.visibility?.map((siteVisitVal:any) => (
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
                                                value={possessionName}
                                                onChange={(event: SelectChangeEvent<typeof possessionName>) => {
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
                                                    setPossessionId(id);
                                                    setPossessionName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'possession_status'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'possession_status'})}</em>
                                                </MenuItem>
                                                {droplists.possession_status?.map((siteVisitVal:any) => (
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
                                                value={ageOfPropertyName}
                                                onChange={(event: SelectChangeEvent<typeof ageOfPropertyName>) => {
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
                                                    setAgeOfPropertyId(id);
                                                    setAgeOfPropertyName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'age_of_property'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'age_of_property'})}</em>
                                                </MenuItem>
                                                {droplists.age_of_property?.map((siteVisitVal:any) => (
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
                                                    <input type="number" min="0" {...formik.getFieldProps('no_of_cabins_min')} className="form-control" onChange={(e) => formik.setFieldValue("no_of_cabins_min", e.target?.value.replace(/[^0-9]/g, ""))} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="number" min="0" {...formik.getFieldProps('no_of_cabins_max')} className="form-control" onChange={(e) => formik.setFieldValue("no_of_cabins_max", e.target?.value.replace(/[^0-9]/g, ""))} />
                                                </div> 
                                            </div>
                                        </div>
                                    </div>                                  
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'washrooms'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={washroomsName}
                                                onChange={(event: SelectChangeEvent<typeof washroomsName>) => {
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
                                                    setFlooringId(id);
                                                    setFlooringName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                    return <p>{intl.formatMessage({id: 'washrooms'})}</p>;
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
                                                    <em>{intl.formatMessage({id: 'washrooms'})}</em>
                                                </MenuItem>
                                                {droplists.washrooms?.map((siteVisitVal:any) => (
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
                                            <input type="text" className="form-control" {...formik.getFieldProps('bike_parking')} onChange={(e) => formik.setFieldValue("bike_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('car_parking')} onChange={(e) => formik.setFieldValue("car_parking", e.target?.value.replace(/[^0-9]/g, ""))} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amenities'})}</label>
                                        <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                value={amenitiesName}
                                                onChange={(event: SelectChangeEvent<typeof amenitiesName>) => {
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
                                                    setAmenitiesId(id);
                                                    setAmenitiesName(
                                                      typeof value === 'string' ? value.split(',') : value,
                                                    );
                                                }}
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
                                                className='multi_select_field'
                                                MenuProps={MenuProps}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                <MenuItem disabled value="">
                                                    <em>{intl.formatMessage({id: 'amenities'})}</em>
                                                </MenuItem>
                                                {droplists.amenities?.map((siteVisitVal:any) => (
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
                    <div className={formik.values?.segment == "366" ? "accordion-item" : "d-none"} id='retailUnits'>
                        <h2 className="accordion-header" id="headingfifteen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fifteen" aria-expanded="false" aria-controls="fifteen">
                            {intl.formatMessage({id: 'retail_units'})}
                            </button>
                        </h2>
                        <div id="fifteen" className="accordion-collapse collapse" aria-labelledby="headingfifteen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => { 
                                        var i = index;
                                        return (
                                            <div className="card my-2 bs_1 p-4" key={singleService.id}>
                                                <div className="row">
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'quoted_rent_price'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.quoted_rent_price_min} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.quoted_rent_price_min = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div>
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'maintainance'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.maintainance} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.maintainance = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div> 
                                                    </div> 
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'parking_charges'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.parking_charges} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.parking_charges = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
                                                        </div> 
                                                    </div>
                                                    <div className="col-md-6 col-12 mb-3">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'security_deposit'})}</label>
                                                        <div className="input-group mb-3 input_prepend">
                                                            <input type="text" className="form-control" value={singleService.security_deposit} onChange={(e) => {
                                                                setDocumentList(prevData => {
                                                                const updatedData = [...prevData];
                                                                const objectToUpdate = updatedData.find((obj, j) => j === index);
                                                                if (objectToUpdate) {
                                                                    objectToUpdate.security_deposit = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">₹</span>
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
                                                                    objectToUpdate.escalation = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
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
                                                                    objectToUpdate.lock_in = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
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
                                                                    objectToUpdate.total_term = e.target.value;
                                                                }                                                                
                                                                return updatedData;
                                                                })}} />
                                                            <span className="input-group-text">years</span>
                                                        </div> 
                                                    </div> 
                                                    <div className={documentList.length !== 1 ? "col-12 d-flex justify-content-between align-items-center" : "col-12 d-flex justify-content-end align-items-center"}>
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
                                                </div>
                                            </div>
                                        )})}
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