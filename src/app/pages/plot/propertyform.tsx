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


    //Plot
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
    amenities: '',
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
    const {currentUser, logout} = useAuth();
    const theme = useTheme(); 
    const [loading, setLoading] = useState(false);
    const [contactId, setContactId] = useState<any>('');
    const [assignToId, setAssignToId] = useState<string[]>([]);
    const [athorityName, setAthorityName] = useState<string[]>([]);
    const [athorityId, setAthorityId] = useState<string[]>([]);
    const [boundaryName, setBoundaryName] = useState<string[]>([]);
    const [boundaryId, setBoundaryId] = useState<string[]>([]);
    const [amnetiesName, setAmnetiesName] = useState<string[]>([]);
    const [amnetiesId, setAmnetiesId] = useState<string[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [availableName, setAvailableName] = useState<any[]>([]);
    const [planData, setPlanData] = useState<any[]>([]);
    const [availableId, setAvailableId] = useState<string[]>([]);
    const [documentList, setDocumentList] = useState<any[]>([{
        "quoted_rent_price": '',
        "quoted_rent_price_ut": 'sq. ft',
        "security_deposit": '',
        "escalation": '',
        "lock_in": '',
        "total_term": '',
    }]);
    const profileView = useRef<HTMLInputElement>(null);
    const [droplists, setDroplists] = useState<any>({})
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [contactList, setContactList] = useState<any[]>([]);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    console.log("sldkfhiurtfguyigbrkjeyg", documentList);
    

    
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
        formik.setFieldValue("segment", '260');
        dropdowns();
    }, [])

    const handleDocumentRemove = async (index:any) => {
        const newArray = [...documentList];
        newArray.splice(index, 1);        
        setDocumentList(newArray);
    };

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

    const handleDocumentAdd = async (index:any) => {
        setDocumentList((post) => [...post, {
            "quoted_rent_price": '',
            "quoted_rent_price_ut": 'sq. ft',
            "security_deposit": '',
            "escalation": '',
            "lock_in": '',
            "total_term": '',
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
            var formData = new FormData();            

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
            formData.append('plot_unit_type', documentList.length > 0 ? JSON.stringify(documentList) : '');
            formData.append('amenities', amnetiesId.join(',').toString());
            formData.append('plot_type', values.plot_type);
            formData.append('plot_area', values.plot_area);
            formData.append('plot_area_ut', values.plot_area_ut);
            formData.append('fsi', values.fsi);
            formData.append('frontage', values.frontage);
            formData.append('frontage_ut', values.frontage_ut);
            formData.append('dimensions', values.dimensions);
            formData.append('dimensions_ut', values.dimensions_ut);
            formData.append('road_width_min', values.road_width_min);
            formData.append('road_width_min_ut', values.road_width_min_ut);
            formData.append('road_width_max', values.road_width_max);
            formData.append('road_width_max_ut', values.road_width_max_ut);
            formData.append('corner_property', values.corner_property);
            formData.append('authority_approved', athorityId.join(',').toString());
            formData.append('boundary_wall', boundaryId.join(',').toString());
            formData.append('current_status', values.current_status);

            for(let i = 0; i < files.length; i++){
                formData.append('images', files[i]);
            }
    
            const savePropertyData = await saveProperty(formData);

            if(savePropertyData.status == 200){
                setLoading(false);
                document.getElementById('kt_property_close')?.click();
                document.getElementById('propertyReloadBtn')?.click();
                resetForm();
                formik.setFieldValue("segment", '260');
                setContactId('');
                setAssignToId([]);
                setAvailableName([]);
                setFiles([]);
                setDocumentList([{
                    "quoted_rent_price": '',
                    "quoted_rent_price_ut": 'sq. ft',
                    "security_deposit": '',
                    "escalation": '',
                    "lock_in": '',
                    "total_term": '',
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
                                                {droplists.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
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
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('plot_type')}>
                                                <option value=''>Select</option>
                                                {droplists.plot_type?.map((segmentVal: any,i: any) =>{
                                                    return (
                                                        <option value={segmentVal.id} key={i}>{segmentVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    {/* <div className="col-md-6 col-12 mb-3">
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
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'plot_area'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('plot_area')} onChange={(e) => formik.setFieldValue("plot_area", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('plot_area_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fsi'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('fsi')} onChange={(e) => formik.setFieldValue("fsi", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'frontage'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('frontage')} onChange={(e) => formik.setFieldValue("frontage", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('frontage_ut')}>
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'dimensions'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('dimensions')} onChange={(e) => formik.setFieldValue("dimensions", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('dimensions_ut')} >
                                                {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                    return (
                                                        <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                )})}
                                            </select>
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'road_width'})}</label>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('road_width_min')} onChange={(e) => formik.setFieldValue("road_width_min", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={10} className="form-control" />
                                                    <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('road_width_min_ut')}>
                                                    {droplists.area_units?.map((furnishStatusVal:any,i:any) =>{
                                                        return (
                                                            <option value={furnishStatusVal.id} key={i}>{furnishStatusVal.option_value}</option> 
                                                    )})}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="input-group first mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('road_width_max')} onChange={(e) => formik.setFieldValue("road_width_max", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" />
                                                    <select className="px-2 py-2 btn_secondary btn btn-sm prepend" {...formik.getFieldProps('road_width_max_ut')}>
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
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'corner_property'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="btn btn-sm w-100 text-start form-select" {...formik.getFieldProps('corner_property')}>                     
                                                <option value="">select</option>
                                                <option value="1">Yes</option>
                                                <option value="2">No</option>
                                                <option value="3">Not Sure</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'current_status'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <input type="text" className="form-control" {...formik.getFieldProps('current_status')} />
                                        </div> 
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item" id='plotUnits'>
                        <h2 className="accordion-header" id="headingseventeen">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seventeen" aria-expanded="false" aria-controls="seventeen">
                            {intl.formatMessage({id: 'plot_units'})}
                            </button>
                        </h2>
                        <div id="seventeen" className="accordion-collapse collapse" aria-labelledby="headingseventeen" data-bs-parent="#prop_accordion">
                            <div className="accordion-body">
                                <div className="card property_units_card">
                                    <div className="card-body p-3">
                                        {documentList.map((singleService, index) => {
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
                                                                    <option value={furnishStatusVal.option_value} key={i}>₹/{furnishStatusVal.option_value}</option> 
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