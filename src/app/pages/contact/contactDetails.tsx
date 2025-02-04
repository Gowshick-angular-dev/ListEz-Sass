import React,{FC, useState, useEffect, useCallback, useRef} from 'react'
import Moment from 'moment';
import { Toast, Offcanvas } from 'bootstrap';
import {getContactDetail, updateContact, updateContactAdditional, getLog, uploadMultipleFile, updateContactAddress, saveContactNotes, getContactNotes, getContactFiles, deleteContactFile, deleteContactNotes, updateContactNotes, getContsctDropList, getContsctLeads, getContsctDuplicates, getContsctTasks, getSecContscts, getLocalityByPIN } from './core/_requests'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import Dropzone, { useDropzone } from 'react-dropzone'
import {useIntl} from 'react-intl'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

 const initialValues = {
    salutation: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number_type: '',
    mobile: '',
    code: '',
    source: '',
    property_id: '',
    company_name: '',
    developer_name: '',
    contact_group: '',
    contact_type: '',
    contact_category: '',
    remarks: '',
    status: '',
    assign_to: '',
    is_secondary_contact: '',
    secondary_contact_id: '',
    designation: '',
    do_not_disturb: '',
    marital_status: '',
    gender: '',
    number_of_children: '',
    wedding_anniversary: '',
    nationality: '',
    language: '',
    pet_owner: '',
    dob: '',
    invoice_name: '',
    gst_number: '',
    address_1: '',
    address_2: '',
    locality: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    national_id:'',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    reply: '',
    childReply: '',
    title: "",
    subject: "",
    share_with: "",
    module_id: "",
    body: "",
  }

const secContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'first_name', headerName: 'First name', width: 150,headerClassName: 'dg_header' },
    { field: 'last_name', headerName: 'Last name', width: 150,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Email', width: 180,headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Phone Number', type: 'number', width: 150,headerClassName: 'dg_header'},
    { field: 'created_by_name', headerName: 'Created By', width: 130,headerClassName: 'dg_header' },
    { field: 'created_at', headerName: 'Created On', width: 180,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
  ];

const duplicateContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'first_name', headerName: 'First name', width: 150,headerClassName: 'dg_header' },
    { field: 'last_name', headerName: 'Last name', width: 150,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Email', width: 180,headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Phone Number', type: 'number', width: 150,headerClassName: 'dg_header'},
    { field: 'source_name', headerName: 'Source', width: 150,headerClassName: 'dg_header'},
    { field: 'assign_to_name', headerName: 'Assign To', width: 150,headerClassName: 'dg_header'},
    { field: 'property_name', headerName: 'Project', width: 150,headerClassName: 'dg_header'},
    { field: 'last_note', headerName: 'Last Note', width: 150,headerClassName: 'dg_header'},
    { field: 'contact_status_name', headerName: 'Status', width: 150,headerClassName: 'dg_header'},
    { field: 'created_by_name', headerName: 'Created By', width: 130,headerClassName: 'dg_header' },
    { field: 'created_at', headerName: 'Created On', width: 180,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
  ];

  const logContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100,headerClassName: 'dg_header' },
    { field: 'user_name', headerName: 'User Name', width: 250,headerClassName: 'dg_header', renderCell: (row) => row.row.user_name?.first_name+' '+row.row.user_name?.last_name},
    { field: 'note', headerName: 'Note', width: 600,headerClassName: 'dg_header' },
    { field: 'module_name', headerName: 'Module Name', width: 300,headerClassName: 'dg_header', renderCell: (row) => row.value == 1 ? 'Contact' : row.value == 2 ? 'Lead' : row.value == 3 ? 'Project' : row.value == 4 ? 'Task' : 'Transaction' },
    { field: 'createdAt', headerName: 'Created At', width: 200, headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a")},
];

const taskListcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'task_type_name', headerName: 'Task Type', width: 200,headerClassName: 'dg_header' },
    { field: 'priority_name', headerName: 'Priority', width: 200,headerClassName: 'dg_header' },
    { field: 'task_time', headerName: 'Task Time', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
    // { field: 'task_time', headerName: 'Task Time', width: 200,headerClassName: 'dg_header', renderCell: (row) => row.value?.split('T')[0] + ' ' + row.value?.split('T')[1]?.slice(0, -5) },
    { field: 'created_at', headerName: 'Created At', width: 200,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
  ];    

const leadcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 ,headerClassName: 'dg_header'},
    { field: 'contact_name', headerName: 'Contact name', width: 150, headerClassName: 'dg_header'},
    { field: 'email', headerName: 'Email', width: 180, headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Phone Number', type: 'number', width: 150, headerClassName: 'dg_header'},
    { field: 'lead_status_name', headerName: 'Status', width: 130, headerClassName: 'dg_header'},
    { field: 'lead_source_name', headerName: 'Source', width: 130, headerClassName: 'dg_header'},
    { field: 'created_at', headerName: 'Created on', width: 200, headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a")},
    { field: 'assign_to_name', headerName: 'Assign To', width: 200, headerClassName: 'dg_header', renderCell: (row) => row.value?.split(',').map((item:any) => item.split('-')[0]).join(', ')},
    { field: 'budget_min', headerName: 'Budget', width: 200, headerClassName: 'dg_header', renderCell: (row) => row.row.budget_min?.slice(0, -5)+ ' - ' + row.row.budget_max?.slice(0, -5)},
    // { field:'Action', renderCell: () => (
    //     <select className="form-select toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" aria-label="Default select example">
    //         <option selected>Status</option>
    //         <option value="1">Pending</option>
    //         <option value="2">Completed</option>
    //     </select>
    //   ),
    // }
  ];

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

type Props = {
    contactId?: any,
    setContactList?: any,
    tabInfo?: any,
    sortByOnChange?: any,
    requestBody?: any,
    setDetailClicked?: any
}

const ContactDetails: FC<Props> = (props) => {
    const intl = useIntl(); 
    const {
        contactId, setContactList, tabInfo, sortByOnChange, setDetailClicked, requestBody
    } = props

    const theme = useTheme();
    const profileView = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false)
    const {currentUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [assignToName, setAssignToName] = React.useState<any[]>([]);
    const [assignToId, setAssignToId] = React.useState<any[]>([]);
    const [contactDetail, setContactDetail] = useState<{[key: string]: any}>({});
    const [secContactsList, setSecContactsList] = useState<any[]>([]);
    const [leadContactsList, setLeadContactsList] = useState<any[]>([]);
    const [duplicateContactsList, setDuplicateContactsList] = useState<any[]>([]);
    const [contactNotes, setContactNotes] = useState<any[]>([]);
    const [logList, setLogList] = useState<any[]>([]);
    const [taskList, setTaskList] = useState<any[]>([]);
    const [filesVal, setFilesVal] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [state, setState] = useState<any[]>([]);
    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isFormError, setIsFormError] = useState(false);
    const [isFilesError, setIsFilesError] = useState(false);
    const [secSelected, setSecSelected] = useState(false);
    const [imgFullView, setImgFullView] = useState(false);
    const [imgSelect, setImgSelect] = useState('');
    const [parentId, setParentId] = useState<String>('');
    const [files, setFiles] = useState<any[]>([]);
    const [allTemplatesMail, setAllTemplatesMail] = useState<any[]>([]);
    const [noteEditVal, setNoteEditVal] = useState<any>('');
    const [property, setProperty] = useState<any>('');
    const [localityID, setLocalityID] = useState('')
    const [secondaryContact, setSecondaryContact] = useState<any>('');
    const [search, setSearch] = useState<any>("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [dropList, setContactDropdowns] = useState<any>({});
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [localityList, setLocalityList] = useState<any[]>([]);
   

    const contactDropdowns = async () => {
        const response = await getContsctDropList()
        setContactDropdowns(response.output);
        setState(response.output?.state)       
        setCity(response.output?.city)
      }

    const contactLeads = async () => {
        const response = await getContsctLeads(contactId)
        setLeadContactsList(response.output);
    }

    const contactTasks = async () => {
        const response = await getContsctDuplicates(contactId)
        setDuplicateContactsList(response.output);
    }
     
    const contactDuplicates = async () => {
        const response = await getContsctTasks(contactId)
        setTaskList(response.output);
    }

    const secContacts = async () => {
        const response = await getSecContscts(contactId)
        setSecContactsList(response.output);
    }

      const basicFormSchema = Yup.object().shape({
        first_name: Yup.string(),
        last_name: Yup.string(),
        email: Yup.string()
            .email('Wrong email format'),
        mobile: Yup.string()
            .required('Phone number is required')
            .min(7, 'Min 7 characters'),
        salutation: Yup.string(),
        phone_number_type: Yup.string(),
        code: Yup.string(),
        source: Yup.string(),
        company_name: Yup.string(),
        developer_name: Yup.string(),
        contact_group: Yup.string(),
        contact_type: Yup.string(),
        contact_category: Yup.string(),
        remarks: Yup.string(),
        status: Yup.string(),
        property_id: Yup.string(),
        assign_to: Yup.string(),
        is_secondary_contact: Yup.string(),
        secondary_contact_id: Yup.string(),
      })

      const additionalFormSchema = Yup.object().shape({
        designation: Yup.string(),
        do_not_disturb: Yup.string(),
        marital_status: Yup.string(),
        gender: Yup.string(),
        number_of_children: Yup.string(),
        wedding_anniversary: Yup.string(),
        nationality: Yup.string(),
        language: Yup.string(),
        pet_owner: Yup.string(),
        dob: Yup.string(),
        invoice_name: Yup.string(),
        gst_number: Yup.string().min(15, "GST number must be 15 Digits"),
        id_document1: Yup.string(),
        id_document2: Yup.string(),
        id_document3: Yup.string(),
        id_document4: Yup.string(),
        id_document5: Yup.string(),
        document1: Yup.string(),
        document2: Yup.string(),
        document3: Yup.string(),
        document4: Yup.string(),
        document5: Yup.string(),
        profile_image: Yup.string(),
        id_number1: Yup.string(),
        id_number2: Yup.string(),
        id_number3: Yup.string(),
        id_number4: Yup.string(),
        id_number5: Yup.string(),
      })

      const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Enter a note first...'),
      })

      const addressFormSchema = Yup.object().shape({
        address_1: Yup.string(),
        address_2: Yup.string(),
        locality: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        zip_code: Yup.string(),
        national_id: Yup.string(),
        facebook: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        instagram: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        linkedin: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
        twitter: Yup.string().matches(/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, "Enter a valid URL"),
      })

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

      const formik = useFormik({
        initialValues,
        validationSchema: basicFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var userId = currentUser?.id;
            let assign = assignToId?.length > 0 ? assignToId?.map((item:any) => item.id)?.join(',')?.toString() : userId?.toString();

            var formData = new FormData();

            formData.append('salutation', values.salutation);
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('email', values.email);
            formData.append('mobile', values.mobile);
            formData.append('phone_number_type', values.phone_number_type);
            formData.append('assign_to', assign!);
            formData.append('source', values.source);
            formData.append('company_name', values.company_name);
            formData.append('developer_name', values.developer_name);
            formData.append('code', values.code);
            formData.append('contact_group', values.contact_group);
            formData.append('contact_type', values.contact_type);
            formData.append('contact_category', values.contact_category);
            formData.append('remarks', values.remarks);
            formData.append('status', values.status);
            formData.append('property_id', values.property_id);
            formData.append('is_secondary_contact', values.is_secondary_contact);
            formData.append('secondary_contact_id', values.secondary_contact_id);
            profileImage && formData.append('profile_image', profileImage!);          
            
            const headers = {
              headers: {
                  "Content-type": "application/json",
              },                    
            }
    
            const updateContactData = await updateContact(contactId ,formData, headers)
    
            if(updateContactData.status == 200){
              setLoading(false);
              FetchContactDetails(contactId);
              if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
              var toastEl = document.getElementById('contactUpdatedToast');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('contactErrorToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
      })

      const formikAdditional = useFormik({
        initialValues,
        validationSchema: additionalFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            var userId = currentUser?.id;

            var formBody = {
                'designation': values.designation,
                'do_not_disturb': values.do_not_disturb,
                'marital_status': values.marital_status,
                'gender': values.gender,
                'number_of_children': values.number_of_children,
                'wedding_anniversary': values.wedding_anniversary == "Invalid date" ? "" : values.wedding_anniversary,
                'nationality': values.nationality,
                'language': values.language,
                'pet_owner': values.pet_owner,
                'dob': values.dob == "Invalid date" ? "" : values.dob,
                'invoice_name': values.invoice_name,
                'gst_number': values.gst_number,
                'created_by': userId,
            };
            
            const headers = {
              headers: {
                  "Content-type": "application/json",
              },                    
            }
    
            const updateContactAdditionalData = await updateContactAdditional(contactId ,formBody, headers)
    
            if(updateContactAdditionalData.status == 200){
              setLoading(false);
              if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
              var toastEl = document.getElementById('contactUpdatedToast');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('contactErrorToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
      })

      const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var notesBody = {
                "reply": values.reply,
                "module_id": contactId,
                "module_name": 1,
                "parent_id": 0
            };
                           
            const updateContactAddressData = await saveContactNotes(notesBody)
    
            if(updateContactAddressData.status == 200){
              setLoading(false);
              if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
              var toastEl = document.getElementById('contactNoteAddToast');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
              resetForm();
              setContactNotes(updateContactAddressData.output);
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('contactErrorToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
      })

      const formikAddress = useFormik({
        initialValues,
        validationSchema: addressFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {    
            var userId = currentUser?.id;

            var formBody = {
                'address_1': values.address_1,
                'address_2': values.address_2,
                'locality': values.locality,
                'city': values.city,
                'state': values.state,
                'zip_code':values.zip_code,
                'country': values.country,
                'facebook': values.facebook,
                'instagram': values.instagram,
                'linkedin': values.linkedin,
                'twitter': values.twitter,
                'created_by': userId,
            };
            
            const headers = {
              headers: {
                  "Content-type": "application/json",
              },                    
            }
    
            const updateContactAddressData = await updateContactAddress(contactId ,formBody, headers)
            console.log('requestBody----Locality', requestBody);
            
    
            if(updateContactAddressData.status == 200){
              setLoading(false);
              if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
              var toastEl = document.getElementById('contactUpdatedToast');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('contactErrorToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
      })    

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
    }, [search]);
    
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.pdf', '.png'],
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
        setLoading(true);
        if(files.length > 0){
            setIsFilesError(false);
            try {
                var formData = new FormData();

                formData.append('module_name', '1');                
                for (var i = 0; i < files.length; i++) {
                    formData.append('uploadfiles', files[i]);
                }
                               
                const saveContactFiles = await uploadMultipleFile(contactId, formData)
        
                if(saveContactFiles.status == 200){
                  setLoading(false);
                  if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
                  setFilesVal(saveContactFiles.output);
                  setFiles([]);
                  var toastEl = document.getElementById('contactFilesUploadedToast');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                }        
              } catch (error) {
                console.error(error)
                var toastEl = document.getElementById('contactErrorToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                setLoading(false)
              }   
        }    
        else {
            setIsFilesError(true);
        }
    }

    const onDeleteFile = async (id:any) => {
        const deleteRes = await deleteContactFile(id, contactId);
        if(deleteRes.status == 200){
            setFilesVal(deleteRes.output);
            if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
            var toastEl = document.getElementById('contactFileDeletedToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const replyDelete = async (id:any, parentId:any) => {
        const deleteNotes = await deleteContactNotes(id, parentId, contactId);
        if(deleteNotes.status == 200){
            if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
            setContactNotes(deleteNotes.output);
            var toastEl = document.getElementById('contactNoteDeleteToast');
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
        let editVal = (document.getElementById('edit_field'+id) as HTMLInputElement)!.value;    
        if(editVal != ''){
            setIsFormError(false);
            try {
                var notesBody = {
                    "reply": editVal,
                    "module_id": contactId,
                    "module_name": 1
                };
                               
                const editNotesData = await updateContactNotes(id, notesBody)
        
                if(editNotesData.status == 200){
                  setLoading(false);
                  if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                    document.getElementById('contactReloadFilter')?.click();
                  } else {
                    document.getElementById('contactReload')?.click();
                  }
                  (document.getElementById('edit_field'+id) as HTMLInputElement).value = '';
                  setNoteEditVal('');
                  setContactNotes(editNotesData.output);
                  var toastEl = document.getElementById('contactNoteEditToast');
                  const bsToast = new Toast(toastEl!);
                  bsToast.show();
                }        
              } catch (error) {
                console.error(error)
                var toastEl = document.getElementById('contactErrorToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                setLoading(false)
              }   
        } else {
            setIsFormError(true);
        }    
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

    const handleClick = (index:any) => {
        setFiles([
            ...files.slice(0, index),
            ...files.slice(index + 1, files.length)
          ]);
    }

const FetchContactDetails =  async (contactId : number) => {
    setIsLoading(true);
    const response = await getContsctDropList()
    setContactDropdowns(response.output);
    setState(response.output?.state)       
    setCity(response.output?.city)
    const werererwer = await getContactDetail(contactId)
    setIsLoading(false);
    contactNotesList();
    secContacts();
    contactFilesList(contactId);
    fetchLog(contactId);
    contactDuplicates();
    contactTasks();
    contactLeads();
    contactDuplicates();
    contactTasks();
    contactLeads();
    const fetchDetails:any = werererwer.output;
    setContactDetail(fetchDetails)
   
    setProperty(fetchDetails.property_id ?? '');    
    setLocalityID(fetchDetails.locality ?? '');    
    setSecondaryContact(fetchDetails.secondary_contact_id ?? '');    
    setAssignToId(response.output?.assign_to?.filter((item:any) => fetchDetails.assign_to?.split(',')?.indexOf(item.id?.toString()) !== -1));
    
    // alert(dropList.assign_to?.filter((item:any) => fetchDetails.assign_to?.split(',')?.indexOf(item.id.toString()) !== -1));
    formik.setFieldValue('salutation', fetchDetails.salutation ?? '')
    formik.setFieldValue('first_name', fetchDetails.first_name ?? '')
    formik.setFieldValue('last_name', fetchDetails.last_name ?? '')
    formik.setFieldValue('email', fetchDetails.email ?? '')
    formik.setFieldValue('phone_number_type', fetchDetails.phone_number_type ?? '')
    formik.setFieldValue('code', fetchDetails.code ?? '')
    formik.setFieldValue('mobile', fetchDetails.mobile ?? '')
    formik.setFieldValue('contact_group', fetchDetails.contact_group ?? '')
    formik.setFieldValue('contact_category', fetchDetails.contact_category ?? '')
    formik.setFieldValue('company_name', fetchDetails.company_name ?? '')
    formik.setFieldValue('developer_name', fetchDetails.developer_name ?? '')
    formik.setFieldValue('source', fetchDetails.source ?? '')
    formik.setFieldValue('remarks', fetchDetails.remarks ?? '')
    formik.setFieldValue('status', fetchDetails.status ?? '')
    formik.setFieldValue('property_id', fetchDetails.property_id ?? '')
    formik.setFieldValue('locality', fetchDetails.locality ?? '')
    formik.setFieldValue('contact_type', fetchDetails.contact_type ?? '')
    formik.setFieldValue('is_secondary_contact', fetchDetails.is_secondary_contact ?? '')
    formik.setFieldValue('secondary_contact_id', fetchDetails.secondary_contact_id ?? '')
    
    // var assignArray = [];
    // var assignNameArray = [];
    // if(fetchDetails.assign_to != null){
    //     assignArray = fetchDetails.assign_to.split(",").map((e:any) => {
    //         return parseInt(e);
    //     });
    // }
    // if(fetchDetails.assign_to_name != null){
    //     assignNameArray = fetchDetails.assign_to_name.split(",").map((e:any) => {
    //         return e;
    //     });
    // }

    // setAssignToId(assignArray);
    // setAssignToName(assignNameArray);
    
    // let additional = fetchDetails?.contact_details_name[0];

    formikAdditional.setFieldValue('designation', fetchDetails.designation ?? '')
    formikAdditional.setFieldValue('do_not_disturb', fetchDetails.do_not_disturb ?? '')
    formikAdditional.setFieldValue('marital_status', fetchDetails.marital_status ?? '')
    formikAdditional.setFieldValue('gender', fetchDetails.gender ?? '')
    formikAdditional.setFieldValue('number_of_children', fetchDetails.number_of_children ?? '')
    formikAdditional.setFieldValue('wedding_anniversary', Moment(fetchDetails.wedding_anniversary ?? '').format('YYYY-MM-DD'))
    formikAdditional.setFieldValue('nationality', fetchDetails.nationality ?? '')
    formikAdditional.setFieldValue('language', fetchDetails.language ?? '')
    formikAdditional.setFieldValue('pet_owner', fetchDetails.pet_owner ?? '')
    formikAdditional.setFieldValue('dob', Moment(fetchDetails.dob ?? '').format('YYYY-MM-DD'))
    formikAdditional.setFieldValue('invoice_name', fetchDetails.invoice_name ?? '')
    formikAdditional.setFieldValue('gst_number', fetchDetails.gst_number ?? '')

    // let address = fetchDetails?.contact_address_name[0];
    if(fetchDetails.zip_code?.length == 6) {
        const response = await getLocalityByPIN(fetchDetails.zip_code)
        setLocalityList(response.output)
    }

    // let states = dropList.state?.filter((state:any) => fetchDetails.country == state.country_id);
    // setState(states);

    // let cities = dropList.city?.filter((city:any) => fetchDetails.state == city.state_id);
    // setCity(cities);

    formikAddress.setFieldValue('address_1', fetchDetails.address_1 ?? '')
    formikAddress.setFieldValue('address_2', fetchDetails.address_2 ?? '')
    formikAddress.setFieldValue('locality', fetchDetails.locality ?? '')
    formikAddress.setFieldValue('city', fetchDetails.city ?? '')
    formikAddress.setFieldValue('state', fetchDetails.state ?? '')
    formikAddress.setFieldValue('country', fetchDetails.country ?? '')
    formikAddress.setFieldValue('zip_code', fetchDetails.zip_code ?? '')
    formikAddress.setFieldValue('facebook', fetchDetails.facebook ?? '')
    formikAddress.setFieldValue('instagram', fetchDetails.instagram ?? '')
    formikAddress.setFieldValue('linkedin', fetchDetails.linkedin ?? '')
    formikAddress.setFieldValue('twitter', fetchDetails.twitter ?? '')
   
}  

const contactFilesList =  async (contactId : number) => {   
    const contactFileResponse = await getContactFiles(contactId)
    setFilesVal(contactFileResponse.output);
}   

const minimaximize = () => {
    setIsExpand(current => !current);
}

const fullScreenChange = () => {
    setIsFullScreen(current => !current);
}

const secOnChange = (val:any) => {
    formik.setFieldValue('is_secondary_contact', val);
    if(val == 1){
      setSecSelected(true);
    }
    else {
      setSecSelected(false);
    }
}

const imgViewChange = (id:any) => {
    setImgFullView(!imgFullView)
    setImgSelect(id)
}

const replyOnSubmit = async (id:any) => {
    setParentId(id);
    let replyVal = (document.getElementById('child_reply'+id) as HTMLInputElement)!.value;

    if(replyVal != ''){
        setIsFormError(false);
        try {
            var notesBody = {
                "reply": replyVal,
                "module_id": contactId,
                "module_name": 1,
                "parent_id": id
            };
                           
            const saveContactNotesData = await saveContactNotes(notesBody)

            if(saveContactNotesData.status == 200){
              setLoading(false);
              if(requestBody.contact_type || requestBody.contact_category || requestBody.contact_status || requestBody.assign_to || requestBody.source || requestBody.gender || requestBody.locality || requestBody.city || requestBody.state || requestBody.country || requestBody.property_id || requestBody.contact_group || requestBody.created_date || requestBody.created_end_date || requestBody.created_by || requestBody.zip_code || requestBody.zip_code) {                  
                document.getElementById('contactReloadFilter')?.click();
              } else {
                document.getElementById('contactReload')?.click();
              }
              setParentId('');
              (document.getElementById('child_reply'+id) as HTMLInputElement).value = ''
              var toastEl = document.getElementById('contactNoteAddToast');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
              setContactNotes(saveContactNotesData.output);
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

const fetchLog = async (contactId : number) => {
    const fetchLogList = await getLog(contactId);
    setLogList(fetchLogList.output);
} 

const contactNotesList =  async () => {  
    const notesResponse = await getContactNotes(contactId)
    setContactNotes(notesResponse.output);
}

const closeDialogue = () => {
    setDetailClicked(false);
    var offCanvasEl = document.getElementById('kt_expand'+contactId);
    offCanvasEl?.classList.add('invisible');
    const bsOffcanvas = new Offcanvas(offCanvasEl!);
    bsOffcanvas.hide();    
}

const sendMail = () => {
}
const sendWatsapp = () => {
}
const sendSMS = () => {
}
const sendCall = () => {
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

    useEffect(() => {        
        if(contactId) {
            FetchContactDetails(contactId)        
        }
    }, [contactId]);
    
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
                                <button className='btn mx-3 expand_btn' onClick={fullScreenChange}>
                                    <img src={isFullScreen ? toAbsoluteUrl('/media/custom/overview-icons/comp_white.svg') : toAbsoluteUrl('/media/custom/overview-icons/expand_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button className="btn mx-3 minimize_btn" onClick={() => {
                                    minimaximize();
                                    var element = document.getElementById("jdbfjhdglsrgtergterhte"+contactId);
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
                                    id='kt_expand_close'
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => {
                                        closeDialogue();
                                          var element = document.getElementById("jdbfjhdglsrgtergterhte"+contactId);
                                            var headerOffset = 350;
                                                var elementPosition:any = element?.getBoundingClientRect().top;
                                            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                            
                                            window.scrollTo({
                                                top: offsetPosition,
                                            }); 
                                    }}
                                    className='btn me-n5 mx-3 close_btn'
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
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={contactDetail.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+contactDetail.id+'/'+contactDetail.profile_image : ''} className="user_img" alt='' />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <div className="col-sm-6 d-flex align-items-center">
                                                        <div className="d-flex">
                                                            <h4 className="mb-0">{contactDetail.first_name+" "}{contactDetail.last_name}</h4>
                                                        </div>                                                        
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <a href={"mailto:" + contactDetail.email} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                        <a href={"tel:" + contactDetail.mobile} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                        <a href="#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a>
                                                        <a href={"https://api.whatsapp.com/send?phone="+ contactDetail.mobile} target="new" className="btn_soft_primary">
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
                                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                                <p className="mb-0">{contactDetail.email}</p>
                                            </div>
                                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                                <p className="mb-0">{contactDetail.mobile}</p>
                                            </div>
                                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_at'})}</small>
                                                <p className="mb-0">{moment(contactDetail.created_date).format('DD-MM-YYYY hh:mm a')}</p>
                                            </div>
                                            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                <p className="mb-0">{contactDetail.created_by_name}</p>
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
                                        <button className={tabInfo == 'overview' ? "nav-link active" : "nav-link"} id="overview-tab" data-bs-toggle="pill" data-bs-target={"#overview"+contactId} type="button" role="tab" aria-controls="overview" aria-selected="true">{intl.formatMessage({id: 'overview'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="additional-tab" data-bs-toggle="pill" data-bs-target={"#additional"+contactId} type="button" role="tab" aria-controls="additional" aria-selected="true">{intl.formatMessage({id: 'additional_information'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="contactAddress-tab" data-bs-toggle="pill" data-bs-target={"#contactAddress"+contactId} type="button" role="tab" aria-controls="contactAddress" aria-selected="true">{intl.formatMessage({id: 'contact_address'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'notes' ? "nav-link active" : "nav-link"} id={"notes-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#notes"+contactId} type="button" role="tab" aria-controls={"notes"+contactId} aria-selected="false">{intl.formatMessage({id: 'notes'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'files' ? "nav-link active" : "nav-link"} id={"files-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#files"+contactId} type="button" role="tab" aria-controls={"files"+contactId} aria-selected="false">{intl.formatMessage({id: 'files'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'message' ? "nav-link active" : "nav-link"} id={"message-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#message"+contactId} type="button" role="tab" aria-controls={"message"+contactId} aria-selected="false">{intl.formatMessage({id: 'messages'})}</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'sec_contact' ? "nav-link active" : "nav-link"} id={"contact-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#contact"+contactId} type="button" role="tab" aria-controls={"contact"+contactId} aria-selected="false">{intl.formatMessage({id: 'sec.contact'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'lead' ? "nav-link active" : "nav-link"} id={"lead-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#lead"+contactId} type="button" role="tab" aria-controls={"lead"+contactId} aria-selected="false">{intl.formatMessage({id: 'lead'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'duplicate' ? "nav-link active" : "nav-link"} id={"duplicate-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#duplicate"+contactId} type="button" role="tab" aria-controls={"duplicate"+contactId} aria-selected="false">{intl.formatMessage({id: 'duplicate'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tabInfo == 'task' ? "nav-link active" : "nav-link"} id={"tasks-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#tasks"+contactId} type="button" role="tab" aria-controls={"tasks"+contactId} aria-selected="false">{intl.formatMessage({id: 'tasks'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id={"timeline-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#timeline"+contactId} type="button" role="tab" aria-controls={"timeline"+contactId} aria-selected="false">{intl.formatMessage({id: 'activity_timeline'})}</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={tabInfo == 'overview' ? "tab-pane fade show active": "tab-pane fade"} id={"overview"+contactId} role="tabpanel" aria-labelledby="overview-tab">
                                        <form noValidate onSubmit={formik.handleSubmit} >
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
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'first_name'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select {...formik.getFieldProps('salutation')} className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                        <option value="1">Mr</option>
                                                        <option value="2">Ms</option>
                                                        <option value="3">Mrs</option>
                                                        <option value="4">Dr</option>
                                                    </select>
                                                    <input type="text" {...formik.getFieldProps('first_name')} className='form-control form-control-sm form-control-solid' 
                                                    placeholder="Enter First Name" maxLength={50}/>
                                                </div>
                                                {formik.touched.first_name && formik.errors.first_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.first_name}</span>
                                                    </div>
                                                </div>
                                                )}
                                            </div> 
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_name'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('last_name')} className='form-control form-control-sm form-control-solid' placeholder="Enter Last Name" maxLength={50}/>
                                                </div>
                                            </div> 
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'email'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <input type="text" {...formik.getFieldProps('email')} className='form-control form-control-sm form-control-solid' placeholder="Enter Email"/>
                                                </div>
                                                {formik.touched.email && formik.errors.email && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                                    </div>
                                                </div>
                                                )}
                                            </div> 
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'phone_number_type'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select className="btn btn-sm w-100 text-start form-select"
                                                    {...formik.getFieldProps('phone_number_type')}
                                                    >
                                                        {dropList.phone_number_type?.map((value:any,i:any)=> {
                                                            return (
                                                        <option value={value.id} key={i}>{value.option_value}</option>)
                                                        })}
                                                    </select>      
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'phone_number'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select
                                                    {...formik.getFieldProps('code')}
                                                    className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                        {dropList.country_code?.map((value:any,i:any)=> {
                                                            return (
                                                            <option value={value.id} key={i}>{value.option_value}</option>)
                                                        })}
                                                    </select>
                                                    <input type="text" {...formik.getFieldProps('mobile')} className={clsx(
                                                    'form-control form-control-sm form-control-solid',
                                                    {
                                                        'is-invalid': formik.touched.mobile && formik.errors.mobile,
                                                    },
                                                    {
                                                        'is-valid': formik.touched.mobile && !formik.errors.mobile,
                                                    }
                                                    )} placeholder="Enter Number" onChange={(e) => formik.setFieldValue("mobile", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15}/>
                                                </div>
                                                {formik.touched.mobile && formik.errors.mobile && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.mobile}</span>
                                                    </div>
                                                </div>
                                                )}
                                            </div> 
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_group'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select className="btn btn-sm w-100 text-start form-select" 
                                                    {...formik.getFieldProps('contact_group')}
                                                    >
                                                        <option value="">Select</option>
                                                        {dropList.contact_group?.map((contactGroupVal:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={contactGroupVal.id} key={i}>{contactGroupVal.option_value}</option>
                                                        )
                                                        })}   
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_type'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                <select 
                                                {...formik.getFieldProps('contact_type')} 
                                                name="contact_type" className='btn btn-sm w-100 text-start form-select'>
                                                    <option value="">Select</option>
                                                    {dropList.contact_type?.map((contactTypeValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={contactTypeValue.id} key={i}>{contactTypeValue.option_value}</option>
                                                    )
                                                    })}  
                                                </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_category'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select className="btn btn-sm w-100 text-start form-select"
                                                    {...formik.getFieldProps('contact_category')}
                                                    >
                                                        <option value="" >Select</option>
                                                        {dropList.contact_category?.map((contactCategoryValue:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={contactCategoryValue.id} key={i}>{contactCategoryValue.option_value}</option>
                                                        ) 
                                                        })}
                                                    </select>
                                                </div>
                                            </div> 
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'company_name'})}</label>
                                                <div className="input-group py-1 bs_2">
                                                    <input type="text" {...formik.getFieldProps('company_name')} className="form-control form-control-sm form-control-solid" placeholder="Enter Company Name" maxLength={50}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                                                <div className="input-group py-1 bs_2">
                                                    <input type="text" {...formik.getFieldProps('developer_name')} name="developer_name" className="form-control form-control-sm form-control-solid" placeholder="Enter developer Name" maxLength={50}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'source'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select className="btn btn-sm w-100 text-start form-select"
                                                    {...formik.getFieldProps('source')}
                                                    >
                                                        <option value="">Select</option>
                                                        {dropList.source?.map((sourceValue:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={sourceValue.id} key={i}>{sourceValue.option_value}</option>
                                                        )
                                                        })}
                                                    </select>
                                                </div>
                                            </div> 
                                            {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'remarks'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="text" {...formik.getFieldProps('remarks')} name="remarks" className="form-control form-control-sm form-control-solid" placeholder=""/>
                                                </div>
                                            </div> */}
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
                                                                return <p>Assign To</p>;
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
                                                            <em>Assign To</em>
                                                        </MenuItem>
                                                        {dropList.assign_to?.map((assignVal:any) => (
                                                            <MenuItem
                                                            key={assignVal.id}
                                                            value={assignVal.assign_to_name+'-'+assignVal.id}
                                                            style={getStyles(assignVal.first_name+' '+assignVal.last_name, assignToName, theme)}
                                                            >
                                                            {assignVal.assign_to_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl> */}
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend py-1">
                                                    <ReactSelect
                                                    isMulti
                                                    options={dropList.assign_to}
                                                    closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                                    getOptionValue={(option:any) => option.id}
                                                    value={dropList.assign_to?.filter((item:any) => assignToId?.indexOf(item) !== -1)}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100 "}
                                                    onChange={(val:any) => {  
                                                        setAssignToId(val);
                                                    }}
                                                    placeholder={"Assign-to.."}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend py-1">
                                                    <select className="btn btn-sm w-100 text-start form-select" 
                                                    {...formik.getFieldProps('status')}
                                                    >
                                                        <option value="" >Select</option>
                                                        {dropList.contact_status?.map((contactStatusValue:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                                        )
                                                        })}
                                                    </select>
                                                </div> 
                                            </div>   */}
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'property_name'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend py-1">
                                                    {/* <select className="btn btn-sm w-100 text-start form-select" 
                                                    {...formik.getFieldProps('property_id')}
                                                    >
                                                        <option value="" >Select</option>
                                                        {dropList.property?.map((value:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={value.id} key={i}>{value.name_of_building}</option>
                                                        )
                                                        })}
                                                    </select> */}
                                                    <ReactSelect
                                                        options={dropList.property}
                                                        // closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropList.property?.find((item:any) => property == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100"}
                                                        onChange={(val:any) => {
                                                            setProperty(val.id)
                                                            formik.setFieldValue("property_id", val.id);
                                                        }}
                                                        placeholder={"Project.."}
                                                        />
                                                </div> 
                                            </div>  
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'is_secondary_contact'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select className="btn btn-sm w-100 text-start form-select" onChange={(e) => secOnChange(e.target.value)}>
                                                        <option selected={contactDetail.is_secondary_contact == '1'} value="1">Yes</option>
                                                        <option selected={contactDetail.is_secondary_contact == '0'} value="0">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {contactDetail.is_secondary_contact == '1' || secSelected ?
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'secondary_contact'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                {/* <select className="btn btn-sm w-100 text-start form-select" 
                                                {...formik.getFieldProps('secondary_contact_id')}
                                                >
                                                <option value=''>select</option>
                                                {dropList.secondary_contact?.map((contactDropVal:any,i:any)=> {
                                                    return (
                                                    <option value={contactDropVal.id} key={i}>{contactDropVal.secondary_contact_name}</option>
                                                    )
                                                })}
                                                </select> */}
                                                <ReactSelect
                                                    options={dropList.secondary_contact}
                                                    // closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.secondary_contact_name ?? '--No Name--'}
                                                    getOptionValue={(option:any) => option.id}
                                                    value={dropList.secondary_contact?.find((item:any) => secondaryContact == item.id)}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100 "}
                                                    onChange={(val:any) => {
                                                        setSecondaryContact(val.id)
                                                        formik.setFieldValue("secondary_contact_id", val.id);                                               
                                                    }}
                                                    placeholder={"secondary_contact.."}
                                                    />
                                                </div>
                                            </div> : <></>}
                                            <div className="col-12 d-flex justify-content-center mb-4">
                                                <button type='submit' disabled={formik.isSubmitting} className="btn btn_primary">
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
                                    <div className="tab-pane fade" id={"additional"+contactId} role="tabpanel" aria-labelledby="additional-tab">
                                        <form noValidate onSubmit={formikAdditional.handleSubmit} >
                                        <div className="row">
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'designation'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <input type="text" {...formikAdditional.getFieldProps('designation')} className='form-control form-control-sm form-control-solid' name="designation" placeholder="Enter Designation" maxLength={50}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'do_not_disturb'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select 
                                                    {...formikAdditional.getFieldProps('do_not_disturb')}
                                                    className="btn btn-sm w-100 text-start form-select">
                                                    <option  >Select</option>
                                                    {dropList.do_not_disturb?.map((doNotDisturbValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={doNotDisturbValue.id} key={i}>{doNotDisturbValue.option_value}</option>
                                                    )
                                                    })} 
                                                    </select>      
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'marital_status'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select 
                                                    {...formikAdditional.getFieldProps('marital_status')}
                                                    className="btn btn-sm w-100 text-start form-select">
                                                    <option  >Select</option>
                                                    {dropList.marital_status?.map((maritalStatusValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={maritalStatusValue.id} key={i}>{maritalStatusValue.option_value}</option>
                                                    )
                                                    })}  
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gender'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select 
                                                    {...formikAdditional.getFieldProps('gender')}
                                                    className="btn btn-sm w-100 text-start form-selec">
                                                    <option  >Select</option>
                                                    {dropList.gender?.map((genderValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={genderValue.id} key={i}>{genderValue.option_value}</option>
                                                    )
                                                    })} 
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_children'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="text" {...formikAdditional.getFieldProps('number_of_children')} className="form-control form-control-sm form-control-solid" placeholder="Enter" onChange={(e) => formikAdditional.setFieldValue("number_of_children", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'wedding_anniversary'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="date" {...formikAdditional.getFieldProps('wedding_anniversary')} className="form-control form-control-sm form-control-solid" placeholder="date"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'nationality'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3 input_prepend">
                                                    <select className="btn btn-sm w-100 text-start form-select"
                                                     {...formikAdditional.getFieldProps('nationality')}>
                                                        <option value="default" disabled>Select</option>
                                                        {dropList.nationality?.map((nationalityValue:any,i:any)=> {
                                                        return (
                                                            <option selected={i == 0 ? true: false} value={nationalityValue.id} key={i}>{nationalityValue.option_value}</option>
                                                        )
                                                        })}
                                                    </select>
                                                </div>
                                            </div> 
                                            {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'language'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select 
                                                    {...formikAdditional.getFieldProps('language')}
                                                    className="btn btn-sm w-100 text-start form-select">
                                                    <option  >Select</option>
                                                    {dropList.customer_language?.map((languageValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={languageValue.id} key={i}>{languageValue.option_value}</option>
                                                    )
                                                    })} 
                                                    </select>
                                                </div>
                                            </div> */}
                                             <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'language'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="text" {...formikAdditional.getFieldProps('language')} className="form-control form-control-sm form-control-solid" placeholder=""/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pet_owner'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <select 
                                                    {...formikAdditional.getFieldProps('pet_owner')}
                                                    className="btn btn-sm w-100 text-start form-select">
                                                    <option  >Select</option>
                                                    {dropList.pet_owner?.map((petOwnerValue:any,i:any)=> {
                                                    return (
                                                        <option selected={i == 0 ? true: false} value={petOwnerValue.id} key={i}>{petOwnerValue.option_value}</option>
                                                    )
                                                    })} 
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'dob'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="date" {...formikAdditional.getFieldProps('dob')} className="form-control form-control-sm form-control-solid" placeholder="date" /> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_name'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="text" {...formikAdditional.getFieldProps('invoice_name')} className="form-control form-control-sm form-control-solid" placeholder="Enter invoice name" maxLength={50}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gst_number'})}</label>
                                                <div className="input-group py-1 bs_2 mb-3">
                                                    <input type="text" {...formikAdditional.getFieldProps('gst_number')} className="form-control form-control-sm form-control-solid" placeholder="Enter GST No." onChange={(e) => formikAdditional.setFieldValue("gst_number", e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} maxLength={16}/>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-12 col-12 mb-3 px-md-0">
                                                {documentList.map((singleService, index) => { 
                                                var i = index + 1;
                                                return (
                                                <div className="bg_white br_15 p-4 upload_part position-relative" key={index}>
                                                <div className='d-flex justify-content-end py-3'>
                                                    {documentList.length !== 1 && (
                                                    <button className="btn btn-transparent upload_remove" onClick={() => handleDocumentRemove(index)}>
                                                        <i className="fa fa-minus-circle text_primary" aria-hidden="true"></i>
                                                    </button>
                                                    )}
                                                    {documentList.length - 1 === index && documentList.length < 5 && (
                                                    <button className="btn btn-transparent upload_add" onClick={handleDocumentAdd}>
                                                        <i className="fa fa-plus-circle text_primary" aria-hidden="true"></i>
                                                    </button>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'person_id_documents'})}</label>
                                                        <div className="input-group py-1 bs_2 mb-3">
                                                        <select 
                                                        {...formik.getFieldProps('id_document'+i)}
                                                        className="form-select btn btn-sm w-100">
                                                            <option  >Select</option>
                                                            {dropList.id_documents?.map((idDocumentValue:any,i:any)=> {
                                                            return (
                                                            <option selected={i == 0 ? true: false} value={idDocumentValue.id} key={i}>{idDocumentValue.option_value}</option>
                                                            )
                                                            })} 
                                                        </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'id_number'})}</label>
                                                        <div className="input-group py-1 bs_2 mb-3">
                                                        <input type="text" {...formik.getFieldProps('id_number'+i)} name={'id_number'+i} className="form-control" onChange={(e) => formik.setFieldValue('id_number'+i, e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder={"ID Number "+i}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="d-flex justify-content-center py-5">
                                                            <div className='position-relative'>
                                                            {i == 1 && imagePreview1 != null ? (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview1} alt="image preview" height={100} width={100}/>
                                                            <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                                            {i == 2 ? imagePreview2 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview2} alt="image preview" height={100} width={100}/>
                                                            <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                                            {i == 3 ? imagePreview3 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview3} alt="image preview" height={100} width={100}/>
                                                            <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                                            {i == 4 ? imagePreview4 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview4} alt="image preview" height={100} width={100}/>
                                                            <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}
                                                            {i == 5 ? imagePreview5 != null && (<><img onError={e => { e.currentTarget.src = toAbsoluteUrl("/media/svg/files/pdf.svg")}} src={imagePreview5} alt="image preview" height={100} width={100}/>
                                                            <a onClick={(e) => imgRemove(i)} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></>): null}                                          
                                                            
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center">
                                                            <span className="btn btn-file">
                                                            <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload'})}
                                                            <small className='text-dark required' >Note: jpg, jpeg, pdf only acceptable</small>
                                                            <input type="file" id={"idDocument"+i}
                                                            onChange={i == 1 ? handleImagePreview1: i == 2 ? handleImagePreview2: i == 3 ? handleImagePreview3 : i == 4 ? handleImagePreview4: handleImagePreview5}
                                                            name={'document'+i}/>
                                                            </span>
                                                        </div>                                      
                                                    </div>
                                                    </div>
                                                </div>
                                                )})}
                                            </div> */}
                                            <div className="col-12 d-flex justify-content-center mb-4">
                                                <button type='submit' disabled={formikAdditional.isSubmitting} className="btn btn_primary">
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
                                    <div className="tab-pane fade" id={"contactAddress"+contactId} role="tabpanel" aria-labelledby="contactAddress-tab">
                                        <form noValidate onSubmit={formikAddress.handleSubmit} >
                                            <div className="row">
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_1'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('address_1')} className="form-control" placeholder="Address 1" maxLength={50}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'address_2'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('address_2')} maxLength={50} className="form-control" placeholder="Address 2"/>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('locality')} maxLength={50} className="form-control" placeholder="Locality"/>
                                                    </div>
                                                </div>  */}
                                                {/* <div className="col-md-6 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="input-group py-1 bs_2">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                                            formik.setFieldValue("country", e.target.value);
                                                            let states = dropList.state?.filter((state:any) => e.target.value == state.country_id);
                                                            setState(states);
                                                        }} >
                                                            <option disabled selected value="">Select</option>
                                                            {dropList.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
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
                                                        <div className="input-group py-1 bs_2">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                            formik.setFieldValue("state", e.target.value);                                               
                                                            let states = dropList.city?.filter((city:any) => e.target.value == city.state_id);
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
                                                        <div className="input-group py-1 bs_2">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                            <option disabled value="">Select</option>
                                                            {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>} */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="input-group py-1 bs_2 mb-3">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('country')} onChange={async (e) => {
                                                            formikAddress.setFieldValue("country", e.target.value);
                                                            let states = dropList.state?.filter((state:any) => e.target.value == state.country_id);
                                                            setState(states);
                                                            formikAddress.setFieldValue("state", '');
                                                            formikAddress.setFieldValue("city", '');
                                                            setCity([]);
                                                        }}>
                                                            <option value="">Select</option>
                                                            {dropList.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div> 
                                                    </div>
                                                </div>
                                                {/* {contactDetail.country != 0 && */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                        <div className="input-group py-1 bs_2 mb-3">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('state')} onChange={async (e) => {
                                                            formikAddress.setFieldValue("state", e.target.value);                                               
                                                            let cities = dropList.city?.filter((city:any) => e.target.value == city.state_id);
                                                            setCity(cities);
                                                        }} >
                                                            <option value="">Select</option>
                                                            {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div>  
                                                    </div>
                                                </div>
                                                {/* } */}
                                                {/* {contactDetail.state != 0 && */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                        <div className="input-group py-1 bs_2 mb-3">
                                                        <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('city')}>
                                                            <option value="">Select</option>
                                                            {/* {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})} */}
                                                            {dropList?.city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>
                                                {/* } */}
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'zip_code'})}</label>
                                                    <div className="input-group bs_2 mb-3">
                                                        <input type="text" {...formikAddress.getFieldProps('zip_code')} name="zip_code" className="form-control" placeholder="Enter Zip Code" onChange={async(e) => { 
                                                        formikAddress.setFieldValue("zip_code", e.target?.value.replace(/[^0-9]/g, ""));
                                                        if(e.target?.value.length == 6) {
                                                            const response = await getLocalityByPIN(e.target?.value)
                                                            setLocalityList(response.output)
                                                        }                                  
                                                    }} maxLength={6} />
                                                    </div>
                                                </div> 
                                                {/* {localityList.length > 0 &&                         
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'locality'})}</label>
                                                    <div className="input-group py-1 bs_2 mb-3">
                                                    <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('locality')}>
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
                                                    <div className="input-group py-1 bs_2 mb-3">
                                                    {/* <select className="form-select btn-sm text-start" {...formikAddress.getFieldProps('locality')}>
                                                    <option value="">Select</option>
                                                        {dropList?.locality?.map((localityValue:any,i:any)=> {
                                                        return (
                                                            <option value={localityValue.name} key={i}>{localityValue.name}</option>
                                                        )
                                                        })} 
                                                    </select>     */}
                                                      <ReactSelect
                                                        options={dropList?.locality}
                                                        // closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropList?.locality?.find((item:any) => localityID == item.id) ?? []}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100"}
                                                        placeholder={"Locality"}
                                                        onChange={(val:any) => {
                                                            setLocalityID(val.id)
                                                            formikAddress.setFieldValue("locality", val.id);                                               
                                                          }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'national_id'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('national_id')} name="national_id" className="form-control" placeholder="Enter ID" />
                                                    </div>
                                                </div>  */}
                                                <hr/>
                                                <h3 className='my-3'>{intl.formatMessage({id: 'social_links'})}</h3>                                                
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'facebook'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('facebook')} className="form-control" placeholder="Facebook"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'instagram'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('instagram')} className="form-control" placeholder="Instagram"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'linkedin'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('linkedin')} className="form-control" placeholder="Linkedin"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'twitter'})}</label>
                                                    <div className="input-group bs_2 mb-3 input_prepend">
                                                        <input type="text" {...formikAddress.getFieldProps('twitter')} className="form-control" placeholder="Twitter"/>
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-center mb-4">
                                                    <button type='submit' disabled={formikAddress.isSubmitting} className="btn btn_primary">
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
                                    <div className={tabInfo == 'notes' ? "tab-pane fade show active": "tab-pane fade"} id={"notes"+contactId} role="tabpanel" aria-labelledby={"notes-tab"+contactId}>                                    
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
                                                <div className='notes_list card-body px-0'>
                                                    <h4 className='mb-3'>{intl.formatMessage({id: 'notes_list'})}</h4>
                                                    <hr/>
                                                    {contactNotes.map((contactNote, i) => {
                                                        return (
                                                    <div className={contactNote.id == contactNote.parent_id ? 'mb-5 bg-gray-100 p-5 br_10 pb-1' : 'mb-5'} key={contactNote.id}>
                                                        {contactNote.reply1 == 'NO'
                                                        ? <div className='note_question'>
                                                            <div className='d-flex align-items-center mb-3'>
                                                                <div className='d-flex align-items-center flex-grow-1'>
                                                                    <div className='symbol symbol-45px me-5'>
                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={contactNote.user_id && process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+contactNote.user_id+'/'+contactNote.user_profile_image} alt='' />
                                                                    </div>
                                                                    <div className='d-flex flex-column'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                        {contactNote.user_name ?? 'User'}
                                                                    </a>
                                                                    <span className='text-gray-400 fw-bold'>{Moment(contactNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='mb-3 border-bottom border-secondary d-flex justify-content-between'>
                                                                { noteEditVal != '' && parentId == contactNote.id ?
                                                                    <div className='text-gray-800 position-relative w-75'>
                                                                        <input
                                                                            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                            data-kt-autosize='true'
                                                                            placeholder='Reply..'
                                                                            id={'edit_field'+contactNote.id}
                                                                            defaultValue={noteEditVal}
                                                                        ></input>
                                                                    </div>
                                                                    : 
                                                                    <div className='text-gray-800'>
                                                                        {contactNote.reply}
                                                                    </div>
                                                                    }
                                                                    { currentUser?.designation == 1 &&
                                                                    <span>
                                                                        { noteEditVal != '' && parentId == contactNote.id ?
                                                                        <><button type='button' onClick={() => cancelEdit(contactNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                        </button>
                                                                        <button type='button' onClick={() => editOnSubmit(contactNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                        </button></>:
                                                                        <button type='button' onClick={() => replyEdit(contactNote.id, contactNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                        </button>}
                                                                        <button type='button'
                                                                        data-bs-toggle='modal'
                                                                        data-bs-target={'#delete_note_popup'+contactNote.id} 
                                                                        className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                        <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                        </button> 
                                                                    </span>
                                                                    }
                                                                    <div className='modal fade' id={'delete_note_popup'+contactNote.id} aria-hidden='true'>
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
                                                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(contactNote.id, contactNote.parent_id)}>
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
                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={contactNote.user_id && process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+contactNote.user_id+'/'+contactNote.user_profile_image} alt='' />
                                                                </div>
                                                                <div className='d-flex flex-column flex-row-fluid'>
                                                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fw-bolder me-2'>
                                                                    {contactNote.user_name ?? 'User'}
                                                                    </a>

                                                                    <span className='text-gray-400 fw-bold fs-7'>{Moment(contactNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                </div>
                                                                
                                                                <div className=' d-flex justify-content-between'>                                            
                                                                            { noteEditVal != '' && parentId == contactNote.id ?
                                                                            <div className='text-gray-800 position-relative w-75'>
                                                                                <input
                                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                    data-kt-autosize='true'
                                                                                    placeholder='Reply..'
                                                                                    id={'edit_field'+contactNote.id}
                                                                                    defaultValue={noteEditVal}
                                                                                ></input>
                                                                            </div>
                                                                            : 
                                                                            <div className='text-gray-800'>
                                                                             {contactNote.reply}
                                                                            </div>
                                                                            } 
                                                                                <span>
                                                                                { currentUser?.designation == 1 &&
                                                                            <span>
                                                                                { noteEditVal != '' && parentId == contactNote.id ?
                                                                                <><button type='button' onClick={() => cancelEdit(contactNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                                        </button>
                                                                                        <button type='button' onClick={() => editOnSubmit(contactNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                                <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                                            </button></>:
                                                                                <button type='button' onClick={() => replyEdit(contactNote.id, contactNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                                </button>} 
                                                                                <button type='button'
                                                                                data-bs-toggle='modal'
                                                                                data-bs-target={'#delete_note_popup2'+contactNote.id} 
                                                                                className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                                <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                                </button>
                                                                            </span>}
                                                                                </span>
                                                                            </div>                                                            
                                                                </div>
                                                                <div className='modal fade' id={'delete_note_popup2'+contactNote.id} aria-hidden='true'>
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
                                                                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(contactNote.id, contactNote.parent_id)}>
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
                                                        {contactNote.reply1 == 'NO' && 
                                                        <>
                                                        <div className='position-relative mb-3'>
                                                                <input
                                                                    className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                    data-kt-autosize='true'
                                                                    placeholder='Reply..'
                                                                    id={'child_reply'+contactNote.id}
                                                                ></input>                                                                
                                                                <div className='position-absolute top-0 end-0'>
                                                                    <button type='button' onClick={() => replyOnSubmit(contactNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {isFormError && contactNote.id == parentId && (
                                                                <div className='fv-plugins-message-container'>
                                                                    <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>Enter a reply first...</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            </>
                                                            }                                                            
                                                            <div className={contactNote.id == contactNote.parent_id ? 'd-none' : 'separator mb-4'}></div>
                                                    </div>
                                                        )
                                                    })}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'files' ? "tab-pane fade show active": "tab-pane fade"} id={"files"+contactId} role="tabpanel" aria-labelledby={"files-tab"+contactId}>
                                        <div {...getRootProps({className: 'dropzone'})}>
                                            <div className='myDIV main_bg'>
                                                <div className="d-flex align-items-center justify-content-center h-100 vh-25">
                                                    <span className="btn btn-file h-100 w-100">
                                                        <KTSVG
                                                        path='/media/icons/duotune/files/fil022.svg'
                                                        className='svg-icon-1 text_primary ms-2'
                                                        />
                                                        <p className='text_primary'>{intl.formatMessage({id: 'upload_files_here'})}</p>
                                                        <small className='text-dark'>* Note: jpg, jpeg, png, pdf only acceptable</small>
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
                                                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-3" key={i}>
                                                        <div className="card h-100">
                                                            <div className="card-body d-flex justify-content-center text-center flex-column p-8">
                                                            <a href="#" data-bs-toggle='modal'
                                                            data-bs-target={'#delete_confirm_popup'+file.id} className="btn delete_btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>
                                                                <div className="text-gray-800 hover d-flex flex-column">
                                                                    {last != 'pdf' ? 
                                                                    <a className={imgFullView && imgSelect == file.id ? "img_full_view" : "symbol symbol-75px"} onClick={() => imgViewChange(file.id)}>
                                                                        <img className='mb-5' onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/svg/files/doc.svg') }} src={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+file.module_id+'/'+file.file} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    :
                                                                    <a className="symbol symbol-75px" href={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+file.contact_id+'/'+file.file} download target="_blank">
                                                                        <img className='mb-5' src={toAbsoluteUrl("/media/svg/files/pdf.svg")} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    }
                                                                    
                                                                </div>                                                                
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
                                    <div className={tabInfo == 'message' ? "tab-pane fade show active": "tab-pane fade"} id={"message"+contactId} role="tabpanel" aria-labelledby={"message-tab"+contactId}>    
                                        <ul className="nav nav-pills mb-3 message_tabs" id={"pills-tab"+contactId} role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id={"pills-mail-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#pills-mail"+contactId} type="button" role="tab" aria-controls="pills-mail" aria-selected="true">{intl.formatMessage({id: 'email'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-whatsapp-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#pills-whatsapp"+contactId} type="button" role="tab" aria-controls="pills-whatsapp" aria-selected="false">{intl.formatMessage({id: 'whatsapp'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-sms-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#pills-sms"+contactId} type="button" role="tab" aria-controls="pills-sms" aria-selected="false">{intl.formatMessage({id: 'sms'})}</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id={"pills-calls-tab"+contactId} data-bs-toggle="pill" data-bs-target={"#pills-calls"+contactId} type="button" role="tab" aria-controls="pills-calls" aria-selected="false">{intl.formatMessage({id: 'calls'})}</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent position-relative">
                                            <div className="tab-pane fade show active" id={"pills-mail"+contactId} role="tabpanel" aria-labelledby="pills-mail-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-3 my-2 d-flex align-items-center">
                                                                    <label className="form-check-label d-flex align-items-center" htmlFor="flexCheckDefault">
                                                                        <span className="mail_icon ms-3"><i className="fas fa-envelope"></i></span>
                                                                        <p className='my-3'>Raj2020@gmail.com</p>
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
                                                                <h3>{intl.formatMessage({id: 'mail_list'})}</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group py-1 bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group py-1 bs_2-append">
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
                                                                    <h3>{intl.formatMessage({id: 'send_mail'})}</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'title'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'subject'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'share_with'})}</label>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module'})}</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>{intl.formatMessage({id: 'lead'})}</option>
                                                                                    <option value={2}>{intl.formatMessage({id: 'contact'})}</option>
                                                                                    <option value={3}>{intl.formatMessage({id: 'task'})}</option>
                                                                                    <option value={4}>{intl.formatMessage({id: 'project'})}</option>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'body'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>{intl.formatMessage({id: 'cancel'})}</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'send'})}
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
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-whatsapp"+contactId} role="tabpanel" aria-labelledby="pills-whatsapp-tab">
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
                                                                <div className="col-lg-4 my-2">
                                                                    <span className="icon_bg"><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/></span>
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p>27/04/2022</p>
                                                                    <p className="pe-3">4.00pm</p>
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
                                                                <h3>{intl.formatMessage({id: 'mail_list'})}</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group py-1 bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group py-1 bs_2-append">
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
                                                                    <h3>{intl.formatMessage({id: 'send_mail'})}</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'title'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'subject'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'share_with'})}</label>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module'})}</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>{intl.formatMessage({id: 'lead'})}</option>
                                                                                    <option value={2}>{intl.formatMessage({id: 'contact'})}</option>
                                                                                    <option value={3}>{intl.formatMessage({id: 'task'})}</option>
                                                                                    <option value={4}>{intl.formatMessage({id: 'project'})}</option>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'body'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>{intl.formatMessage({id: 'cancel'})}</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'send'})}
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
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-sms"+contactId} role="tabpanel" aria-labelledby="pills-sms-tab">
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
                                                                <h3>{intl.formatMessage({id: 'mail_list'})}</h3>
                                                            </div>
                                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                </div>
                                                            </div>
                                                            <div className='modal-body'>                                         
                                                            <div className="input-group py-1 bs_2 form_search">
                                                                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                                                    <div className="input-group py-1 bs_2-append">
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
                                                                    <h3>{intl.formatMessage({id: 'send_mail'})}</h3>
                                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon text-dark" alt='' />
                                                                    </div>
                                                                </div>
                                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                                <form noValidate onSubmit={formikMail.handleSubmit} >
                                                                    <div className="row">
                                                                        <div className="col-md-6">                                            
                                                                            <div className="form-group mb-4">
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'title'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'subject'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'share_with'})}</label>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'module'})}</label>
                                                                                <select className="form-select form-control text-start bg-secondary bg-opacity-25" {...formikMail.getFieldProps('module_id')}>
                                                                                    <option value="default">Select</option>
                                                                                    <option value={1}>{intl.formatMessage({id: 'lead'})}</option>
                                                                                    <option value={2}>{intl.formatMessage({id: 'contact'})}</option>
                                                                                    <option value={3}>Task{intl.formatMessage({id: 'task'})}</option>
                                                                                    <option value={4}>{intl.formatMessage({id: 'project'})}</option>
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
                                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'body'})}</label>
                                                                                <div className="input-group py-1 bs_2">
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
                                                                        <button type='button' className='btn btn-secondary me-3' data-bs-dismiss='modal'>Cancel{intl.formatMessage({id: 'cancel'})}</button>
                                                                        <button
                                                                        type='submit'
                                                                        id='kt_add_teams_submit'
                                                                        className='btn btn_primary text-primary'
                                                                        disabled={formikMail.isSubmitting}
                                                                        >
                                                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'send'})}
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
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className="tab-pane fade" id={"pills-calls"+contactId} role="tabpanel" aria-labelledby="pills-calls-tab">
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
                                    <div className={tabInfo == 'sec_contact' ? "tab-pane fade show active": "tab-pane fade"} id={"contact"+contactId} role="tabpanel" aria-labelledby={"contact-tab"+contactId}>
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {secContactsList.length > 0
                                            ?
                                            <DataGrid
                                                rows={secContactsList}
                                                columns={secContactcolumns}
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
                                    <div className={tabInfo == 'lead' ? "tab-pane fade show active": "tab-pane fade"} id={"lead"+contactId} role="tabpanel" aria-labelledby={"lead-tab"+contactId}>
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {leadContactsList.length > 0 
                                            ? <DataGrid
                                                rows={leadContactsList}
                                                columns={leadcolumns}
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
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_lead_contacts_available'})}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'duplicate' ? "tab-pane fade show active" : "tab-pane fade"}  id={"duplicate"+contactId} role="tabpanel" aria-labelledby="duplicate-tab">
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {duplicateContactsList.length > 0
                                                ?  <DataGrid
                                                    rows={duplicateContactsList}
                                                    columns={duplicateContactcolumns}
                                                    pageSize={10}
                                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                                    checkboxSelection
                                                    sx={{
                                                        fontSize:14,
                                                        fontWeight:500,
                                                    }}
                                                /> :
                                                <div className="text-center w-100">
                                                    <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                    <p className='mt-3'>{intl.formatMessage({id: 'no_duplicate_contacts_available'})}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'task' ? "tab-pane fade show active": "tab-pane fade"} id={"tasks"+contactId} role="tabpanel" aria-labelledby="tasks-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {taskList.length > 0
                                            ?
                                            <DataGrid
                                                rows={taskList}
                                                columns={taskListcolumns}
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
                                    <div className="tab-pane fade" id={"timeline"+contactId} role="tabpanel" aria-labelledby="timeline-tab">
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
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_active_timelines_available'})}</p>
                                            </div>
                                            }
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
                        <h5 className='text-white'>{intl.formatMessage({id: 'contact_details'})}</h5>
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

export {ContactDetails}