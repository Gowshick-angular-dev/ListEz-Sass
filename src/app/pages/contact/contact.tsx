import React,{ FC, useState, useEffect } from 'react';
import { getContacts, updateContactStatus, deleteContact, saveContactNotes, saveReassignTo, reassignContact, bulkReassignContact, getContsctDropList } from './core/_requests';
import Moment from 'moment';
import { Offcanvas, Toast } from 'bootstrap';
import { ContactDrawer } from './contactDrawers';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import { useAuth } from '../../modules/auth';
import { ContactDetails } from './contactDetails';
import { ContactToolbar } from './contactToolBar';
import { ContactList } from './contactList';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from 'react-router-dom';
import {useIntl} from 'react-intl';
import { getMasters } from '../settings/orgMasters/core/_requests';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { getUsers } from '../settings/userManagement/core/_requests';
import NotificationPage from '../Notification/notification';
import { ControlledBoardContact } from './contactsKanban';


const initialValues = {
    reply: '',
    reason_id: '',
    reassign_to: '',
    note: '',
}

type Props = {
    sortByOnChange?: any,
}

const ContactPageClone: FC<Props> = (props) => {
    const intl = useIntl();
    const {
        sortByOnChange,
      } = props

    const permis:any = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const {state} = useLocation()    
    const {currentUser, logout} = useAuth();
    const phoneNumber:any = currentUser?.p_phone_number;
    const [contact, setContact]   = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [contactsList, setContactsList] = useState<any[]>([]);
    const [reassign, setReassign] = useState<any[]>([]);
    const [dropLeadReason, setDropLeadReason] = useState<any[]>([]);
    const [reassignDropdown, setReassignDropdown] = useState<any[]>([]);
    const [contactStatus, setContactStatus] = useState<any[]>([]);
    const [contactDropReason, setContactDropReason] = useState<any[]>([]);
    const [contactCheckList, setContactCheckList] = useState<any[]>([]);
    const [bulkAssign, setBulkAssign] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [leadClicked, setLeadClicked] = useState(false);
    const [taskClicked, setTaskClicked] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [detailData, setDetailData] = useState<any>('');
    const [currentContact, setCurrentContact] = useState<any>({});
    const [detailTab, setDetailTab] = useState<any>('');
    const [currentContactId, setCurrentContactId] = useState<any>('');
    const [selectedStatus, setSelectedStatus] = useState<any>('');
    const [deleteId, setDeleteId] = useState<any>('');
    const [contactsCount, setContactsCount] = useState<any>('');
    const [assigned, setAssigned] = useState<any>('');
    const [detailClick, setDetailClick] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropList, setContactDropdowns] = useState<any>({});
    const [kanbanData, setKanbanData] = useState<any>({});
    const [requestBody, setRequestBody] = useState<any>({
        'contact_type': '',
        'contact_category': '',
        'contact_status': '',
        'assign_to': '',
        'source': '',
        'gender': '',
        'locality': '',
        'city': '',
        'state': '',
        'country': '',
        'property_id': '',
        'contact_group': '',
        'created_date': '',
        'created_end_date': '',
        'created_by': '',
        'zip_code': '',
        'date_of_birth': '',
        'filter_name': '',
        'limit': 0,
        'nationality': '',
        'sortBy': ''   
    });
   
    console.log("efhwergwegrwrguiweg", permissions);
    
    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required("Give a reason to change status"),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {    
            var notesBody = {
                "reply": values.reply,
                "module_id": currentContactId,
                "module_name": 1,
                "status_id": selectedStatus,
                "reason_id": values.reason_id,
                "parent_id": 0
            };
                           
            const updateContactAddressData = await saveContactNotes(notesBody)
    
            if(updateContactAddressData.status == 200) {
                setLoading(false);                
                resetForm();                
                const body = {
                    "contact_status": selectedStatus
                }

                const updateTask = await updateContactStatus(currentContactId, body);

                if(updateTask.status == 200) {
                    document.getElementById('eljfhuywetgrtlyr8hkj')?.click();
                    // document.getElementById('contactListReload')?.click();
                    setContacts(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === currentContactId);
                        
                        if (objectToUpdate) {
                          objectToUpdate.contact_status = selectedStatus;
                        }
                        
                        return updatedData;
                      }); 
                      setContactsList(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === currentContactId);
                        
                        if (objectToUpdate) {
                          objectToUpdate.contact_status = selectedStatus;
                        }
                        
                        return updatedData;
                      }); 
                    setNoteSaved(false);
                    var toastEl = document.getElementById('StatusUpdateToast');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }

                // if(selectedStatus == 6) {
                //     deleteModel(currentContactId);
                // }

                if(selectedStatus == 7) {
                    let user = currentUser?.id;
                    let kerqug = assigned.split(',')
                    kerqug?.splice(kerqug?.indexOf(user?.toString()), 1);
                    kerqug.push(values.reassign_to?.toString()); 
                    let body ={
                        assign_to: kerqug?.join(',')
                    }
                    const response = await reassignContact(currentContactId, body);
                }
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

    const openModal = (leadId:any, tabType:any) => {
        setDetailData(leadId);
        setDetailTab(tabType);
        setDetailClick(true);
        document.body.className += ' detail_opened';
        var offCanvasEl = document.getElementById('kt_expand'+leadId);
        offCanvasEl?.classList.remove('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.show();        
    }

    const contactStatusList = async () => {
        const response = await getMasters("contact_status")
        setContactStatus(response.output?.reverse());
        const responseDrop = await getMasters("lead_drop_reason")
        setContactDropReason(responseDrop.output);
    }

    const deleteModel = async (Data:any) => {
        setIsLoading(true);
        const response = await deleteContact(Data);
        if(response.status == 200) {
            setIsLoading(false);
            contactList();
            setDeleteId('');
            var toastEl = document.getElementById('contactDeletedToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else {
            var toastEl = document.getElementById('contactErrorToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }        
    } 

    const contactDropdowns = async () => {
        const response = await getContsctDropList();
        setContactDropdowns(response.output);
    }

    const contactList = async () => {
        setIsLoading(true);
        let reqBody = {
            'contact_type': '',
            'contact_category': '',
            'contact_status': '',
            'assign_to': '',
            'source': '',
            'gender': '',
            'locality': '',
            'city': '',
            'state': '',
            'country': '',
            'property_id': '',
            'contact_group': '',
            'created_date': '',
            'created_end_date': '',
            'created_by': '',
            'zip_code': '',
            'date_of_birth': '',
            'filter_name': '',
            'limit': 0,
            'nationality': '',
            'sortBy': ''
        }
        const contactRes = await getContacts(reqBody);
        setContacts(contactRes.output);
        setContactsCount(contactRes.count);
        setRequestBody({...reqBody, limit: 12})
        setIsLoading(false);
    }

    const contactListReload = async () => {
        const contactRes = await getContacts({
            'contact_type': '',
            'contact_category': '',
            'contact_status': '',
            'assign_to': '',
            'source': '',
            'gender': '',
            'locality': '',
            'city': '',
            'state': '',
            'country': '',
            'property_id': '',
            'contact_group': '',
            'created_date': '',
            'created_end_date': '',
            'created_by': '',
            'zip_code': '',
            'date_of_birth': '',
            'filter_name': '',
            'limit': 0,
            'nationality': '',
            'sortBy': '' });
        const contactReste = await getContacts({
            'contact_type': '',
            'contact_category': '',
            'contact_status': '',
            'assign_to': '',
            'source': '',
            'gender': '',
            'locality': '',
            'city': '',
            'state': '',
            'country': '',
            'property_id': '',
            'contact_group': '',
            'created_date': '',
            'created_end_date': '',
            'created_by': '',
            'zip_code': '',
            'date_of_birth': '',
            'filter_name': '',
            'limit': '',
            'nationality': '',
            'sortBy': '' });
        setContactsList(contactReste.output);
        setContacts(contactRes.output);
        setContactsCount(contactRes.count);
        setRequestBody({
            'contact_type': '',
            'contact_category': '',
            'contact_status': '',
            'assign_to': '',
            'source': '',
            'gender': '',
            'locality': '',
            'city': '',
            'state': '',
            'country': '',
            'property_id': '',
            'contact_group': '',
            'created_date': '',
            'created_end_date': '',
            'created_by': '',
            'zip_code': '',
            'date_of_birth': '',
            'filter_name': '',
            'limit': 12,
            'nationality': '',
            'sortBy': '' });  
            contacts?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = false);      
    }

    const contactListFilterReload = async () => {
        const contactRes = await getContacts({...requestBody, 'limit': 0});
        const contactReste = await getContacts({...requestBody, 'limit': ''});
        setContactsList(contactReste.output);
        setContacts(contactRes.output);
        setContactsCount(contactRes.count); 
        setRequestBody({...requestBody, 'limit': 12}) 
        contacts?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = false);      
    }

    const contactListView = async (requestBody:any) => {
        const contactRes = await getContacts({...requestBody, limit: ''});
        setContactsList(contactRes.output);
    }

    const reassignDroplist = async () => {
        const response = await getUsers();
        setReassignDropdown(response.output)
    }

    useEffect(() => {
        contactList();
        contactDropdowns();
        contactListView(requestBody);
        contactStatusList();
        reassignDroplist();
    }, []);

    const contactListLazyLoad = async () => {
        const contactRes = await getContacts(requestBody);
        // setContacts(contactRes.output);
        setContacts((post) => [...post, ...contactRes.output]);
        setRequestBody({...requestBody, limit: contacts.length+12})
        setIsLoading(false); 
    }

    const openLeadForm = (con:any) => {
        var data = {'id': con.id, 'name': con.first_name+" "+con.last_name, 'source': con.source, 'source_name': con.source_name, 'property_id': con.property_id, 'property_name': con.property_name, 'assign_to': con.assign_to, 'assign_to_name': con.assign_to_name, 'segment': con.contact_category, 'contact_group': con.contact_group}
        setCurrentContact(data);
        setLeadClicked(true);        
        document.getElementById('kt_lead_toggle')?.click();
    }

    const openTaskForm = (val:any) => {
        console.log("jhrierutheiruergkeuhterklh", val);
        
        var data = {'id': val.id, 'name': val.name, 'property_id': val.property_id, 'property_name': val.property_name, 'assign_to': val.assign_to, 'assign_to_name': val.assign_to_name};
        setCurrentContact(data);
        setTaskClicked(true);
        document.getElementById('kt_task_toggle')?.click();
    }    
        
    const [toggle, setToggle] = useState('grid');

    // const handleHideData = (e:any) => {
    //     setToggle(e.target.value);
    // };

    const handleHideData = (e:any) => {
        setToggle(e.target.value);
        if(e.target.value == 'grid') {
            contactList();
        } else if(e.target.value == 'pipe') {
            kanbanView();
        }
    };

    const kanbanView = async () => {
        const taskResponse = await getContacts({
            ...requestBody,
            "limit": ''
        })   
        setKanbanData(taskResponse)     
    }

    const sortByChange = async (e:any) => {
        setIsLoading(true);
        contactListView(requestBody);
        const contactRes = await getContacts({...requestBody, sortBy: e, limit: 0});
        setContacts(contactRes.output);
        setContactsCount(contactRes.count);
        setRequestBody({...requestBody, sortBy: e, limit: 12})
        setIsLoading(false); 
    };

    const handleStatus = async (e:any, contact:any) => {
        setCurrentContactId(contact.id);
        setAssigned(contact.assign_to);
        setStatusChanged(true);
        setSelectedStatus(e.target.value);
        if(e.target.value == 3) {
            document.getElementById('open_the_lead_form' + contact.id)?.click();
            (document.getElementById('rkheiurgteriougteirutgeri' + contact.id) as HTMLInputElement).value = contact.contact_status?.toString(); 
            // e.target.value = contact.contact_status?.toString();
        } else if(e.target.value == 354) {
            document.getElementById('ljgheoiuteeritgeritgi' + contact.id)?.click();
            (document.getElementById('rkheiurgteriougteirutgeri' + contact.id) as HTMLInputElement).value = contact.contact_status?.toString();
        } else if(e.target.value == 5) {
            // document.getElementById('ljgheoiuteeritgeritgi' + contact.id)?.click();
            console.log("retjroteriot"); 
            const body = {
                "contact_status": 5
            }

            const updateTask = await updateContactStatus(contact.id, body);  
            if(updateTask.status == 200) {
                document.getElementById('eljfhuywetgrtlyr8hkj')?.click();
                // document.getElementById('contactListReload')?.click();
                setContacts(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === contact.id);
                    
                    if (objectToUpdate) {
                      objectToUpdate.contact_status = 5;
                    }
                    
                    return updatedData;
                  }); 
                  setContactsList(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === contact.id);
                    
                    if (objectToUpdate) {
                      objectToUpdate.contact_status = 5;
                    }
                    
                    return updatedData;
                  }); 
                setNoteSaved(false);
                var toastEl = document.getElementById('StatusUpdateToast');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }         
        } else {
            (document.getElementById('rkheiurgteriougteirutgeri' + contact.id) as HTMLInputElement).value = contact.contact_status?.toString(); 
            document.getElementById('contact_status_pop' + contact.id)?.click(); 
            document.getElementById('contact_status_pop')?.click(); 
        }
    }

    const contactOnSelect = (e:any, id:any) => {
        const newArr = [...contactCheckList];
        if(e.target.checked != false){
            setContactCheckList(contactCheckList => [...contactCheckList, id]);
        } else {
            newArr.splice(newArr.findIndex(item => item === id), 1);
            setContactCheckList(newArr);
        }
    }

    const contactOnSelectAll = () => {
        setAllSelected(true);
        setContactCheckList(contactsList?.map((item:any) => item.id));
        contacts?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = true);
        setContactCheckList(kanbanData.output?.map((item:any) => item.id));
    }
    
    useEffect(() => {
        if(allSelected) {
        contactOnSelectAll();
        }
    }, [contacts]);

    const contactOnUnselectAll = () => {
        setAllSelected(false);
        contacts?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = false);
        setContactCheckList([]);
    }

    const cancelStatusChange = () => { 
        var toastEl = document.getElementById('cancelStatusChange');
        const bsToast = new Toast(toastEl!);
        bsToast.show();       
    }

    const taskSaveSchema = Yup.object().shape({
        reassign_to: Yup.string().required('Reassign_to is required'),
        note: Yup.string().required('Note is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var userId = currentUser?.id;
            var body = {
                "module_id" : currentContactId,
                "module_name" : 1,
                "reassign_to" : values.reassign_to,
                "reassign_by" : userId,
                "note" : values.note,
            }
        
            const response = await saveReassignTo(body)
            if(response != null) {
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show(); 
                resetForm();  
                var userId = currentUser?.id;
                    const body = {
                        "created_by": userId,
                        "status": selectedStatus
                    }
    
                    const updateTask = await updateContactStatus(currentContactId, body);
    
                    if(updateTask != null){
                        setNoteSaved(false);
                        var toastEl = document.getElementById('myToastStatus');
                        const bsToast = new Toast(toastEl!);
                        bsToast.show(); 
                        
                    }         
                document.getElementById('contactReload')?.click();
                document.getElementById('reassign_Close')?.click();
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
    }})

    const multiDeleteModel = async () => {
        let contactVal = contactCheckList?.join(',')
          const deleteRes = deleteContact(contactVal);
          if(deleteRes != null) {
            document.getElementById('contactReload')?.click(); 
            setContactCheckList([]);           
            var toastEl = document.getElementById('contactDeletedToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    return (                      
        <div>
            <div className='d-none'>
                <ThemeBuilder/>
            </div>
            <ContactToolbar setSortBy={sortByChange} layoutOnChange={handleHideData} selectedContacts={contactCheckList} setContactCheckList={setContactCheckList} setContactList={setContacts} count={contactsCount} requestBody={requestBody} contactOnSelectAll={contactOnSelectAll} contactOnUnselectAll={contactOnUnselectAll} />
            <ContactDrawer setBody={setRequestBody} setContactList={setContacts} setContactsCount={setContactsCount} body={requestBody} contactData={currentContact} contactListView={contactListView} />
            <button className='d-none' onClick={() => contactListReload()} id="contactReload">reload</button>
            <button className='d-none' onClick={() => contactListFilterReload()} id="contactReloadFilter">reload</button>
            <button className='d-none' id="kt_contact_reassign_pop_toggle" data-bs-toggle='modal' data-bs-target={'#contact_reassign_pop_toggle'}>pop</button>
            <button type='button' className='d-none' id={'ewioyruihrenroiwehrjnuiqh2wkemqd'} onClick={async () => {
                if(currentContactId == '') {
                    return;
                }
                const body = {
                    "contact_status": selectedStatus
                }

                const updateTask = await updateContactStatus(currentContactId, body);

                if(updateTask.status == 200) {
                    document.getElementById('eljfhuywetgrtlyr8hkj')?.click();
                    setContacts(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === currentContactId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.contact_status = selectedStatus;
                        }
                        
                        return updatedData;
                        }); 
                        setContactsList(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === currentContactId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.contact_status = selectedStatus;
                        }
                        
                        return updatedData;
                        });
                    (document.getElementById('rkheiurgteriougteirutgeri' + currentContactId) as HTMLInputElement).value = selectedStatus?.toString();
                    setNoteSaved(false);
                    setCurrentContactId('');
                    var toastEl = document.getElementById('StatusUpdateToast');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }} >status</button>
            { detailClick && 
                <div
                    id={'kt_expand'+detailData}
                    className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                >
                    <ContactDetails contactId={detailData} setContactList={setContact} tabInfo={detailTab} setDetailClicked={setDetailClick} requestBody={requestBody} />
                </div>
            }
            {/* kanban view */}
            <div className={toggle == 'pipe' ? "taskpage d-block": 'd-none'}>
            {/* {intl.formatMessage({id: 'pipeline'})} */}
            <ControlledBoardContact boardData={kanbanData} reload={kanbanView}/>
            </div>
            {toggle == 'grid' && <>
            {isLoading ? 
            <div className='w-100 h-100'>
                <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                    <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                    <div className="spinner-border taskloader" role="status">                                    
                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                    </div>
                </div> 
            </div> : <>
                <div className='modal fade' id={'contact_status_changegvubfg'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => cancelStatusChange()} data-bs-dismiss='modal'>
                                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                </div>
                            </div>
                            <div className='modal-body py-lg-10 px-lg-10'>
                                <form noValidate onSubmit={formikNotes.handleSubmit}>
                                    {selectedStatus == 7 &&
                                    <div className="input-group mb-3">
                                        <select 
                                        {...formikNotes.getFieldProps('reassign_to')}  
                                        className="form-select main_bg w-100 br_10 text-gray-600">
                                        <option value="" selected disabled hidden>Select</option>
                                            {(permissions?.assign_list == '1' ? dropList.assign_to_verify : dropList.assign_to).map((contactStatusValue:any,i:any)=> {
                                            return (
                                                <option value={contactStatusValue.id} key={i}>{contactStatusValue.assign_to_name}</option>
                                            )
                                            })} 
                                        </select>      
                                    </div>}
                                    {selectedStatus == 6 &&
                                    <div className="input-group mb-3">
                                        <select 
                                        {...formikNotes.getFieldProps('reason_id')} 
                                        onChange={(e) => {
                                            formikNotes.setFieldValue('reason_id', e.target.value)
                                            formikNotes.setFieldValue('reply', contactDropReason.find(item => item.id == e.target.value)?.option_value)
                                        }} 
                                        className="form-select main_bg w-100 br_10 text-gray-600">
                                        <option value="" selected disabled >Select</option>
                                            {contactDropReason.map((contactStatusValue,i)=> {
                                            return (
                                                <option value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                            )
                                            })} 
                                        </select>      
                                    </div>}
                                    <div>
                                        <textarea
                                            className='form-control main_bg p-2 resize-none min-h-25px br_10'
                                            data-kt-autosize='true'
                                            {...formikNotes.getFieldProps('reply')} 
                                            rows={7}
                                            placeholder={intl.formatMessage({id: 'reason'})}
                                        ></textarea>
                                        {formikNotes.touched.reply && formikNotes.errors.reply && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={(e) => cancelStatusChange()}>
                                            {intl.formatMessage({id: 'no'})}
                                        </button>
                                        <button className='d-none' id="eljfhuywetgrtlyr8hkj" data-bs-dismiss='modal' type='button'>
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
                <div className='modal fade' id={'reassignToNote'} aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <form noValidate onSubmit={formik.handleSubmit}>
                            <div className='modal-header'>
                                <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                                <div className='btn btn-sm btn-icon btn-active-color-primary' id='reassign_Close' data-bs-dismiss='modal'>
                                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                </div>
                            </div>
                            <div className='modal-body py-lg-10 px-lg-10'>
                            <div className="">
                                <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'reassign_to'})}</label>
                                <div className="input-group mb-3 input_prepend py-1">
                                    <select {...formik.getFieldProps('reassign_to')} className="btn btn-sm w-100 text-start form-select">
                                        <option selected value="">Select</option>
                                        {reassign.map((reass, i) => {
                                            return (<>
                                            <option value={reass.id} key={i}>{reass.first_name}</option>
                                            </>
                                        )})}                                       
                                    </select>
                                </div> 
                                {formik.touched.reassign_to && formik.errors.reassign_to && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.reassign_to}</span>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'note'})}</label>
                                <div>
                                    <textarea {...formik.getFieldProps('note')} className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10' id='reassignNotestoSave'
                                    rows={7}
                                    placeholder='Reason'/>
                                </div>
                                {formik.touched.note && formik.errors.note && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formik.errors.note}</span>
                                    </div>
                                </div>
                                )}
                            </div>
                            </div>
                            <div className='card-footer py-5 text-end' id='kt_contact_footer'>
                                <button
                                type='submit'
                                id='kt_sign_up_submit2' data-bs-dismiss='modal'
                                className='btn btn-sm btn_primary text-primary'
                                disabled={formik.isSubmitting}
                                >
                                {!loading && <span className='indicator-label'>{intl.formatMessage({id: 're_assign'})}
                                </span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display:'block'}}>
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
                <div className='modal fade' id={'delete_contact_popup'} aria-hidden='true'>
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
                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteModel(deleteId)}>
                                        {intl.formatMessage({id: 'yes'})}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal fade' id={'delete_multi_contact_popup'} aria-hidden='true'>
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
                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => multiDeleteModel()}>
                                        {intl.formatMessage({id: 'yes'})}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
                <div className='modal fade' id={'contact_reassign_pop_toggle'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3>{intl.formatMessage({id: 're_assign'})}</h3>
                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={() => setContactCheckList([])}>
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
                                            options={permissions?.assign_list == '1' ? dropList.assign_to_verify : dropList.assign_to}
                                            closeMenuOnSelect={false}
                                            components={makeAnimated()}
                                            getOptionLabel={(option:any) => option.assign_to_name ?? '--No Name--'}
                                            getOptionValue={(option:any) => option.id}
                                            value={dropList.assign_to_verify?.filter((item:any) => bulkAssign.indexOf(item) !== -1)}
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
                                        if(contactCheckList.length > 0 && bulkAssign.length > 0) {
                                            let body = {
                                                'assign_to': bulkAssign?.map((item:any) => item.id?.toString()).join(','),
                                            }
                                            const response = await bulkReassignContact(body, contactCheckList);
                                            if(response.status == 200) {
                                                setAllSelected(false);
                                                setContactCheckList([]);
                                                document.getElementById('kt_contact_reassign_pop_toggle')?.click();
                                                // document.getElementById('contactReload')?.click();
                                                setIsLoading(true);
                                                setBulkAssign([]);
                                                contactListView(requestBody);
                                                const contactRes = await getContacts({...requestBody, limit: 0});
                                                setContacts(contactRes.output);
                                                setContactsCount(contactRes.count);
                                                setRequestBody({...requestBody, limit: 12})
                                                setIsLoading(false);
                                                contacts?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = false);
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
                    <InfiniteScroll
                        dataLength={contacts.length}
                        next={contactListLazyLoad}
                        // pullDownToRefresh={true}
                        hasMore={contactsCount > contacts.length}
                        loader={<>
                        {contactsCount != contacts.length &&
                        <div className='w-100 h-100'>
                            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                <div className="spinner-border taskloader" role="status">                                    
                                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                </div>
                            </div> 
                        </div>}
                        </>}
                        endMessage={<>
                        {contacts.length == 0 ?
                        <div className='w-100 d-flex justify-content-center'>
                            <div>
                                <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                                <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                            </div>
                        </div> : 
                        <div className='w-100 d-flex justify-content-center'>
                            <div>
                                <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" />
                                <h4>{intl.formatMessage({id: 'no_more_contacts_to_show'})}!!!</h4>
                            </div>
                        </div>}</>}
                    >
                    <div className={"contact_page d-block overflow-hidden"}>
                        <div className="row">
                            <div className="card-group">                          
                            {contacts.map((contactUser, i) => {
                                return(
                                <div className="col-sm-6 col-lg-4 col-xl-3 mb-4" key={contactUser.id} id={"jdbfjhdglsrgtergterhte"+contactUser.id}>                                    
                                    <div className="card h-100 mb-5 mb-xl-8 mx-2 bs_1">
                                        <div className='card-body px-3 pt-3 pb-0 overflow-hidden'>
                                            <div className="d-flex align-items-center justify-content-between mb-5">
                                                <div className="d-flex align-items-center overflow-hidden">
                                                    <div>
                                                    </div>
                                                    <form action="">
                                                        <div className="d-flex flex-nowrap">
                                                            <input type="checkbox" className="form-check-input me-1" onClick={(e) => contactOnSelect(e, contactUser.id)} id={"contact"+contactUser.id}/>
                                                            <label className="form-check-label id_label" htmlFor={"contact"+contactUser.id}>
                                                                {contactUser.id}
                                                            </label>
                                                        </div>
                                                    </form>
                                                    <div className="ms-3 ml-2 d-flex align-items-center">
                                                        {/* <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="icon me-2" /> */}
                                                        <p className="mb-0 contact_name py-1 text-nowrap">{(`${contactUser.first_name} ${contactUser.last_name ?? ''}`).slice(0, 1000)}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <a href='#' id={'overview'+contactUser.id} onClick={() => openModal(contactUser.id, 'overview')}><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>
                                                    <div className="btn-group">
                                                        <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                            <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon"/>
                                                        </a>
                                                        <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                            <li><a className="dropdown-item" onClick={() => openModal(contactUser.id, 'overview')}>{intl.formatMessage({id: 'edit'})}</a></li> 
                                                            {currentUser?.designation == 1 && <li><a className="dropdown-item" data-bs-toggle='modal' data-bs-target={'#delete_contact_popup'} onClick={() => setDeleteId(contactUser.id)}>{intl.formatMessage({id: 'delete'})}</a></li>}
                                                            <li><button id={'open_the_lead_form' + contactUser.id} className="dropdown-item" onClick={() => openLeadForm(contactUser)}>{intl.formatMessage({id: 'convert_to_lead'})}</button></li>
                                                            <li><button className="dropdown-item" id={'ljgheoiuteeritgeritgi'+contactUser.id} onClick={() => openTaskForm(contactUser)}>{intl.formatMessage({id: 'add_task'})}</button></li>
                                                        </ul>
                                                    </div>                                                    
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-4">
                                                <div className="flex-shrink-0">
                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={contactUser.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+contactUser.id+'/'+contactUser.profile_image : ''} className="user_img" alt='' />
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <p className="d-flex align-items-center mb-3" title={contactUser.email}>
                                                        <img src={toAbsoluteUrl('/media/custom/envelope.svg')} alt="" className="icon me-1"/>
                                                        <a href={"mailto:" + contactUser.email} className="mb-0 fixed_text text-dark">{contactUser.email}</a>
                                                    </p>
                                                    <div className="">
                                                        <p className="d-flex align-items-center mb-2">
                                                            <a 
                                                            href={"tel:" + contactUser.mobile} 
                                                            className="mb-0 d-flex flex-wrap text-dark cursor-pointer"
                                                            // onClick={async() => {
                                                            //     const formData = new FormData();
                                                            //     formData.append("exenumber", phoneNumber);
                                                            //     formData.append("custnumber", contactUser.mobile);
                                                            //     try {
                                                            //         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/module/mcube_out_bound_call`, {
                                                            //           method: "POST",
                                                            //           body: formData,
                                                            //           headers: {
                                                            //             "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEVfQ0xBSU0iLCJhdWQiOiJUSEVfQVVESUVOQ0UiLCJpYXQiOjE2OTIzNTY0MjQsImV4cF9kYXRhIjoxNzIzOTc4ODI0LCJkYXRhIjp7ImJpZCI6IjYwOTEifX0.HF_Eq9D5QynWMZ2dp7bjDhGUvQhEyVIaCB4XhxIBbaU`
                                                            //           },
                                                            //         });
                                                            //         const result = await response.json();
                                                            //         console.log("Success:", result);
                                                            //       } catch (error) {
                                                            //         console.error("Error:", error);
                                                            //       }
                                                            // }}
                                                            >
                                                                <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
                                                                    {contactUser.mobile}
                                                            </a>
                                                        </p>
                                                        <p className="d-flex align-items-center mb-2">
                                                            <a href={"https://api.whatsapp.com/send?phone="+ contactUser.mobile} target="new" className="mb-0 d-flex flex-wrap text-dark">
                                                                <span><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} alt="" className="icon me-1" /></span>
                                                                    {contactUser.mobile}
                                                            </a>
                                                        </p>
                                                    </div>   
                                                </div>
                                            </div>
                                            <div className='mb-3'>
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <div className="row">
                                                            <div className="col-sm-6 col-6 mb-3" title={contactUser.property_name ?? '--'}>
                                                                <div className="task_content_single">
                                                                    <div className="d-flex align-items-start single_item">
                                                                        <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="me-2"/>
                                                                        <div className="d-flex flex-column">
                                                                            <small className="text_light">{intl.formatMessage({id: 'project_name'})}</small>
                                                                            <p className="mb-0 fw-500">{contactUser.property_name ?? '--'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 col-6 mb-3" title={contactUser.source_name ?? '--'}>
                                                                <div className="task_content_single">
                                                                    <div className="d-flex align-items-start single_item">
                                                                    <img src={toAbsoluteUrl('/media/custom/google_ads.svg')} alt="" className="me-2"/>
                                                                        <div className="d-flex flex-column">
                                                                            <small className="text_light">{intl.formatMessage({id: 'source'})}</small>
                                                                            <p className="mb-0 fw-500">{contactUser.source_name ?? '--'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 col-6 mb-3" title={contactUser.assign_to_name?.split(',').map((item:any) => item?.split('-')[0])?.join(', ') ?? '--'}>
                                                                <div className="task_content_single">
                                                                    <div className="d-flex align-items-start single_item">
                                                                        <img src={toAbsoluteUrl('/media/custom/assign.svg')} alt="" className="me-2"/>
                                                                        <div className="d-flex flex-column">
                                                                            <small className="text_light">{intl.formatMessage({id: 'assigned_to'})}</small>
                                                                            <p className="mb-0 fw-500">{contactUser.assign_to_name?.split(',').map((item:any) => item?.split('-')[0])?.join(', ') ?? '--'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 col-6 mb-3" title={Moment.parseZone(contactUser.created_date).format('DD-MM-YYYY')}>
                                                                <div className="task_content_single">
                                                                    <div className="d-flex align-items-start single_item">
                                                                        <img src={toAbsoluteUrl('/media/custom/calendar.svg')} alt="" className="me-2"/>
                                                                        <div className="d-flex flex-column">
                                                                            <small className="text_light">{intl.formatMessage({id: 'created_date'})}</small>              
                                                                            <p className="mb-0 fw-500">{Moment.parseZone(contactUser.created_date).format('DD-MM-YYYY')}</p>
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
                                                    <div className="col-7 col-xl-8 icons_bar d-flex flex-wrap">
                                                        <a href="#" onClick={() => openModal(contactUser.id, 'notes')} className="btn btn-sm icon_primary rounded-circle position-relative"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Notes">
                                                            <img src={toAbsoluteUrl('/media/custom/notes.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                                {contactUser.notes_count}
                                                            </span>
                                                        </a>
                                                        <a href="#" onClick={() => openModal(contactUser.id, 'files')} className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="File">
                                                            <img src={toAbsoluteUrl('/media/custom/file.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {contactUser.files_count}
                                                            </span>
                                                        </a>
                                                        {/* <a href="#" onClick={() => openModal(contactUser.id, 'message')} className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Message">
                                                            <img src={toAbsoluteUrl('/media/custom/message.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {contactUser.message_count}
                                                            </span>
                                                        </a> */}
                                                        <a href="#" onClick={() => openModal(contactUser.id, 'duplicate')} className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="duplicate">
                                                            <img src={toAbsoluteUrl('/media/custom/duplicate.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                                {contactUser.duplicate_count}
                                                            </span>
                                                        </a>
                                                        <a href="#" onClick={() => openModal(contactUser.id, 'lead')} className="btn btn-sm icon_primary rounded-circle position-relative"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Lead">
                                                            <img src={toAbsoluteUrl('/media/custom/lead.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                                {contactUser.lead_count}
                                                            </span>
                                                        </a>
                                                        <a href="#" onClick={() => openModal(contactUser.id, 'task')} className="btn btn-sm icon_primary rounded-circle position-relative"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task">
                                                            <img src={toAbsoluteUrl('/media/custom/task.svg')} className="svg_icon" alt='' />
                                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                                {contactUser.task_count}
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
                                                        <select className={`form-select toggle_white toggle_white ${contactUser.contact_status == 2 ? 'btn-primary' : contactUser.contact_status == 3 ? 'btn-success' : contactUser.contact_status == 4 ? 'btn-danger' : contactUser.contact_status == 5 ? 'btn-warning' : contactUser.contact_status == 6 ? 'btn-pink' : contactUser.contact_status == 6 ? 'btn-info' : 'btn_primary'} rounded-pill btn-sm cursor-pointer status_btn`} aria-label="Default select example" id={'rkheiurgteriougteirutgeri' + contactUser.id} onChange={event => handleStatus(event, contactUser)}>
                                                            <option disabled value="" >{intl.formatMessage({id: 'status'})}</option>
                                                            {contactStatus?.map((contactStatusValue,i) =>{
                                                                return (
                                                                    <option value={contactStatusValue.id} selected={contactStatusValue.id == contactUser.contact_status} key={i}>{contactStatusValue.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                    <a className="d-none" data-bs-toggle='modal' data-bs-target={'#reassignToNote'} id='reassignModelPopup'>{intl.formatMessage({id: 'delete'})}</a>                                                
                                                    <a className="d-none" href="#" data-bs-toggle='modal' id={'contact_status_pop'+contactUser.id}
                                                    data-bs-target={'#contact_status_changegvubfg'}></a>                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )})}
                            
                            </div>
                        </div>
                    </div>
                    </InfiniteScroll>
                 </>
            }</>}  
            {toggle == 'list' && <>
            {isLoading ? 
            <div className='w-100 h-100'>
                <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                    <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                    <div className="spinner-border taskloader" role="status">                                    
                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                    </div>
                </div> 
            </div> :
            <div className='h-100'>
                <div className="card table_card p-3 h-100">
                    <ContactList contactList={contactsList} handleStatus={handleStatus} formikNotes={formikNotes} cancelStatusChange={cancelStatusChange} selectedStatus={selectedStatus} dropLeadReason={dropLeadReason} contactStatus={contactStatus} contactDropReason={contactDropReason} reassignDropdown={reassignDropdown} openLeadForm={openLeadForm} openModal={openModal} openTaskForm={openTaskForm} setDeleteId={setDeleteId} />
                </div>
            </div>}
            </>}   
            {toggle == 'pipe' && <></>}         
             <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactImgFormatErr">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'image_unsupported_format'})}!
                </div>
            </div>
             <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactImgSizeErr">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'image_unsupported_size'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactStatusToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_status_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactStatusErrToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_status_not_updated'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilterToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_filter_applied'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilterSaveToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_filter_saved'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactSaveToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_created_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactSaveCPToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_already_exist_please_try_after_sometimes'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactImportToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_imported_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactImportErrToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'choose_xlxs_files_only'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactErrorToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'something_went_wrong'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilterResetToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_filter_removed_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactNoteAddToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_note_added_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactNoteEditToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_note_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactNoteDeleteToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_note_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilesUploadedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_files_uploaded_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFileDeletedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_file_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactDeletedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactUpdatedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="StatusUpdateToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_status_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilterSave">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_filter_saved_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactBulkReassign">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_assgned_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactBulkReassignErrMsg">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'choose_contacts_and_users_first'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="cancelStatusChange">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contact_status_not_updated'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactImgrmvErr">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'large_size_files_removed'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactFilterLimit">
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
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactNotSelectedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'select_contacts_first'})}!
                </div>
            </div>            
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="contactExportToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'contacts_export_initiated'})}!
                </div>
            </div>            
        </div>
    )
}

export { ContactPageClone }