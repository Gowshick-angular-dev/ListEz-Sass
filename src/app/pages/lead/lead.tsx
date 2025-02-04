import React,{FC, useState,useEffect} from 'react'
import {bulkReassignLead, deleteLead, getLeadDetail, getLeads, saveLeadNotes, sendMail, updateLeadStatus} from './core/_requests'
import { LeadDrawer } from './leadDrawers';
import { Offcanvas, Toast } from 'bootstrap';
import Moment from 'moment';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { LeadDetails } from './leadDetails';
import { LeadToolbar } from './leadToolbar';
import { LeadList } from './leadList';
import { getReassignDropdown, getSortContact } from '../contact/core/_requests';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useIntl} from 'react-intl';
import { getMasters } from '../settings/orgMasters/core/_requests';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { getUsers } from '../settings/userManagement/core/_requests';
import { ControlledBoardLead } from './leadKanban';

const initialValues = {
    subject: '',
    reason_id: '',
    message: '',
    reply: '',
    to: '',
}

const LeadPage: FC = () => {  
    const intl = useIntl();
    const URL = window.location?.origin;
    
    const [lead, setLead] = useState<any[]>([]);
    const [leadStatus, setLeadStatus] = useState<any[]>([]);
    const [leadListView, setLeadListView] = useState<any[]>([]);
    const [reassignDropdown, setReassignDropdown] = useState<any[]>([]);
    const [bulkAssign, setBulkAssign] = useState<any[]>([]);
    const {currentUser, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [detailData, setDetailData] = useState('');
    const [lostStatus, setLostStatus] = useState<any>('');
    const [deleteId, setDeleteId] = useState<any>('');
    const [detailTab, setDetailTab] = useState('');
    const [detailClick, setDetailClick] = useState(false);
    const [taskClicked, setTaskClicked] = useState(false);
    const [transactionClicked, setTransactionClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toggle, setToggle] = useState('grid');
    const [leadId, setLeadId] = useState('');
    const [leadsCount, setLeadsCount] = useState<any>('');
    const [leadCheckList, setLeadCheckList] = useState<any[]>([]);
    const [leadDetails, setLeadDetails] = useState<any>({});
    const [kanbanData, setKanbanData] = useState<any>({});
    const [body, setBody] = useState({
        "looking_for": '',
        "lead_source": '',
        "lead_group": '',
        "fee_oppurtunity": '',
        "status": '',
        "assign_to": '',
        "budget_min": '',
        "budget_max": '',
        "lead_unit_type": '',
        "no_of_bedrooms_min": '',
        "no_of_bedrooms_max": '',
        "no_of_bathrooms_min": '',
        "no_of_bathrooms_max": '',
        "built_up_area_min": '',
        "built_up_area_max": '',
        "built_up_area_min_ut": '',
        "built_up_area_max_ut": '',
        "plot_area_min": '',
        "plot_area_max": '',
        "plot_area_min_ut": '',
        "plot_area_max_ut": '',
        "possession_status": '',
        "age_of_property": '',
        "vasthu_compliant": '',
        "property": '',
        "priority": '',
        "property_type": '',
        "furnishing": '',
        "car_park_min": '',
        "car_park_max": '',
        "timeline_for_closure_min": '',
        "timeline_for_closure_max": '',
        "amenities": '',
        "created_date": '',
        "created_end_date": '',
        "created_by": '',
        "filter_name": '',
        "limit": 0,
        "sortBy": '',
    });
    const [currentContactName, setCurrentContactName] = useState<{[key: string]: any}>({});
    const [lostLeadReason, setLostLeadReason] = useState<any[]>([]);
    const [dropLeadReason, setDropLeadReason] = useState<any[]>([]);

    // const handleHideData = (e:any) => {
    //     setToggle(e.target.value);
    // };

    const handleHideData = (e:any) => {
        setToggle(e.target.value);
        if(e.target.value == 'grid') {
            leadList();
        } else if(e.target.value == 'pipe') {
            kanbanView();
        }
    };

    const kanbanView = async () => {
        const taskResponse = await getLeads({
            ...body,
            "limit": ''
        })   
        setKanbanData(taskResponse)     
    }
    const mastersList = async() => {
        const response = await getMasters("lead_lost_reason")
        setLostLeadReason(response.output);
        const dropResponse = await getMasters("lead_drop_reason")
        setDropLeadReason(dropResponse.output);
    }

    const leadMailSchema = Yup.object().shape({

        to: Yup.string().email().required('To address is required'),
        // priority: Yup.string().required('Priority is required'),
        // task_time: Yup.string().required('Task time is required'),
        // finish_time: Yup.string(),
        // project: Yup.string(),
        // contact: Yup.string(),
        // // agenda: Yup.string(),
        // assign_to: Yup.array(),
        // task_note: Yup.string().required('Task Description is required'),
        // task_status: Yup.string(),
    })



    const formik = useFormik({
        initialValues,
        validationSchema: leadMailSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
                const body = {
                    "lead_id": leadId,
                    "to": values.to,
                    "subject": values.subject,
                    "message": values.message  
                }

                const updateTask = await sendMail(body);

                if(updateTask.status == 200){
                    setLoading(false)
                    document.getElementById('lead_mail_close')?.click();
                    var toastEl = document.getElementById('mailSendLead');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                    resetForm();
                }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const leadList =  async () => { 
        console.log('dfdfdfdfddffdf');
        
        setIsLoading(true);
        let reqRody = {
            "looking_for": '',
            "lead_source": '',
            "lead_group": '',
            "fee_oppurtunity": '',
            "status": '',
            "assign_to": '',
            "budget_min": '',
            "budget_max": '',
            "lead_unit_type": '',
            "no_of_bedrooms_min": '',
            "no_of_bedrooms_max": '',
            "no_of_bathrooms_min": '',
            "no_of_bathrooms_max": '',
            "built_up_area_min": '',
            "built_up_area_max": '',
            "built_up_area_min_ut": '',
            "built_up_area_max_ut": '',
            "plot_area_min": '',
            "plot_area_max": '',
            "plot_area_min_ut": '',
            "plot_area_max_ut": '',
            "possession_status": '',
            "age_of_property": '',
            "vasthu_compliant": '',
            "property": '',
            "priority": '',
            "property_type": '',
            "furnishing": '',
            "car_park_min": '',
            "car_park_max": '',
            "timeline_for_closure_min": '',
            "timeline_for_closure_max": '',
            "amenities": '',
            "created_date": '',
            "created_end_date": '',
            "created_by": '',
            "filter_name": '',
            "limit": 0,
            "sortBy": '',
        };
        const characterResponse = await getLeads(reqRody)
        setLead(characterResponse.output);
        setLeadsCount(characterResponse.count);
        setBody({...reqRody, limit:12});
        setIsLoading(false);
    }

    const leadListFilter =  async () => {
        const characterResponse = await getLeads({...body, limit: 0})
        setLead(characterResponse.output);
        setLeadsCount(characterResponse.count);
        setBody({...body, limit:12});
    }

    const leadListLazyLoad = async () => {
        const characterResponse = await getLeads(body)
        setLead((post) => [...post, ...characterResponse.output]);
        setBody({...body, limit: lead.length + 12});
    }

    const leadStatusList = async () => {
        const response = await getMasters("lead_status")
        setLeadStatus(response.output?.reverse());
    } 

    const leadTypeChange = async (e:any, lead:any) => {
        setLostStatus(e);
        setLeadId(lead.id);
        if(e == 55) {
            document.getElementById('rjkthiutyeoritgujhgeruity'+lead.id)?.click();
            (document.getElementById('tertertertertertetretertertert'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
            (document.getElementById('eihriugggefvkdjfgdyfiuegjhrwbe'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
        } else if (e == 61) {
            document.getElementById('gAddTransaction'+lead.id)?.click();
            (document.getElementById('tertertertertertetretertertert'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
            (document.getElementById('eihriugggefvkdjfgdyfiuegjhrwbe'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
        
        } else {
            document.getElementById('lead_status_pop')?.click();
            (document.getElementById('tertertertertertetretertertert'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
            (document.getElementById('eihriugggefvkdjfgdyfiuegjhrwbe'+lead.id) as HTMLInputElement).value = lead.lead_status?.toString();
        }
    }

    const openTaskForm = (val:any) => {
        console.log("ekjheriterouithelrtheiru", val);
        
        var data = {'id': val.contact_id, 'name': val.name, 'property_id': val.property_id, 'property_name': val.property_name, 'assign_to': val.assign_to, 'assign_to_name': val.assign_to_name};
        setCurrentContactName(data);
        document.getElementById('kt_task_toggle')?.click();
    }

    const openTransactionForm = (data:any) => {
        setLeadDetails(data);
        setTransactionClicked(true);
        document.getElementById('kt_transaction_toggle')?.click();
    } 
    var div = document.getElementById('lead-tran')
       
    if(div?.style.display){
        div.style.display = "none";
    } 
    
    const openModal = (leadId:any, tabType:any) => {
        setDetailData(leadId);
        setLeadId(leadId);
        setDetailTab(tabType);
        setDetailClick(true);
        document.body.className += ' detail_opened';
        var offCanvasEl = document.getElementById('kt_expand'+leadId);
        offCanvasEl?.classList.remove('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.show();
    }

    const deleteModel = async (leadData:any) => {
        setIsLoading(false);
        await deleteLead(leadData);
        leadList();
        var toastEl = document.getElementById('myToastDeleteStatus');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setIsLoading(false);
    } 
    
    const sortByChangeLead = async(e:any) => {
        const sortContacts = await getLeads({...body, limit:0, sortBy:e});        
        if(sortContacts.status == 200){
            // var toastEl = document.getElementById('myToastSort');
            // const bsToast = new Toast(toastEl!);
            // bsToast.show();
            setLead(sortContacts.output);
            setBody({...body, limit:12, sortBy:e});
        }
    };

    useEffect(() => {
        leadList();
        mastersList();
        leadStatusList();        
        reassignDroplist();
        // LostLeadReasonList();
    }, []);

    useEffect(() => {
        leadListByRole();
    }, [body]);

    //table view
    const data = [];
    for (var i = 0; i < lead.length; i++) {
        let object = {
            id: lead[i].id,
            contactId: lead[i].contact_id,
            lookingFor: lead[i].looking_for,
            propertyType: lead[i].property_type,
            city: lead[i].city,
            leadSource: lead[i].lead_source,
            leadGroup: lead[i].lead_group,
            segment: lead[i].segment,
            feeOppurtunity: lead[i].fee_oppurtunity,
            status: lead[i].status,
            assignTo: lead[i].assign_to_name,
            createdAt: Moment(lead[i].created_at).format("DD-MMMM-YYYY HH:mm"),
            updatedAt: Moment(lead[i].updated_at).format("DD-MMMM-YYYY HH:mm"),
            deletedAt: Moment(lead[i].deleted_at).format("DD-MMMM-YYYY HH:mm"),
            lookingForName: lead[i].looking_for_name,
            propertyTypeName: lead[i].property_type_name,
            leadSourceName: lead[i].lead_source_name,
            leadGroupName: lead[i].lead_group_name,
            leadStatusName: lead[i].lead_status_name,
            furnishingStatusName: lead[i].furnishing_status_name,
            amenitiesName: lead[i].amenities_name,
            posessionStatusName: lead[i].posession_status_name,
            sortable: true, 
        }
        data.push(object)
    }

    const leadOnSelect = (e:any, id:any) => {
        const newArr = [...leadCheckList];
        if(e.target.checked != false){
            setLeadCheckList(leadCheckList => [...leadCheckList, id]);
        } else {
            newArr.splice(newArr.findIndex(item => item === id), 1);
            setLeadCheckList(newArr);
        }
    }

    const leadOnSelectAll = () => {
        setAllSelected(true);
        lead?.map((item:any) => (document.getElementById('lead'+item.id) as HTMLInputElement).checked = true);
        setLeadCheckList(leadListView?.map((item:any) => item.id));
        setLeadCheckList(kanbanData.output?.map((item:any) => item.id));
    }

    const leadListByRole =  async () => {
        const characterResponse = await getLeads({
          ...body,
          "limit": '',
        })
        setLeadListView(characterResponse.output);
    }
    
    useEffect(() => {
        if(allSelected) {
            leadOnSelectAll();
        }
    }, [lead]);

    const leadOnUnselectAll = () => {
        setAllSelected(false);
        lead?.map((item:any) => (document.getElementById('lead'+item.id) as HTMLInputElement).checked = false);
        setLeadCheckList([]);
    }

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string(),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        //   setIsLoading(true)
          try {

            var notesBody = {
                "reply": values.reply,
                "reason_id": values.reason_id,
                "module_id": leadId,
                "status_id": lostStatus,
                "module_name": 2,
                "lead_id": leadId,
                "parent_id": 0
            };
                           
            const leadNotesData = await saveLeadNotes(notesBody)
    
            if(leadNotesData.status == 200){
                // setIsLoading(false);
              resetForm();
            //   var toastEl = document.getElementById('myToastUpdate');
            //   const bsToast = new Toast(toastEl!);
            //   bsToast.show();                
            

            const body = {
                "lead_status": lostStatus
            }
            const updateTask = await updateLeadStatus(leadId, body);
            if(updateTask.status == 200){
                setLead(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === leadId);
                    
                    if (objectToUpdate) {
                      objectToUpdate.lead_status = lostStatus;
                    }
                    
                    return updatedData;
                  });
                document.getElementById('lead_status_pop')?.click();
                var toastEl = document.getElementById('myToastStatus');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
            }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
    })
    
    const reassignDroplist = async () => {
        const response = await getUsers();
        setReassignDropdown(response.output)
    }

    const cancelStatusChange = () => {
    }

    const multiDeleteModel = async () => {
        let contactVal = leadCheckList?.join(',')
          const deleteRes = deleteLead(contactVal);
          if(deleteRes != null) {
            document.getElementById('leadReload')?.click();
            setLeadCheckList([]);           
            var toastEl = document.getElementById('contactDeletedToast');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
          }
      }

    return(
        <div className="h-100 overflow-hidden">
            <div className='d-none'>
                <ThemeBuilder/>
            </div>
            <LeadToolbar sortByOnChangeLead={sortByChangeLead} layoutOnChange={handleHideData} selectedLeads={leadCheckList} body={body} leadCount={leadsCount} leadOnSelectAll={leadOnSelectAll} leadOnUnselectAll={leadOnUnselectAll}/>
            <LeadDrawer setLeadList={setLead} body={body} setLeadsCount={setLeadsCount} setBody={setBody} leadId={leadDetails} currentContactName={currentContactName} leadDetails={leadDetails} />
            <button type="button" className='d-none' id='leadReload' onClick={leadList} >reload</button>
            <button type="button" className='d-none' id='leadReloadFilter' onClick={leadListFilter} >reload</button>
            <button className='d-none' id="kt_lead_reassign_pop_toggle" data-bs-toggle='modal' data-bs-target={'#lead_reassign_pop_toggle'}>pop</button>
            <button type='button' className='d-none' id={'ewioyruihrenroiwehrjnuiqh2wkemqd'} onClick={async () => {
                if(lostStatus == '') {
                    return;
                }
                const body = {
                    "lead_status": lostStatus
                }

                const updateTask = await updateLeadStatus(leadId, body);

                if(updateTask.status == 200) {
                    // document.getElementById('eljfhuywetgrtlyr8hkj')?.click();
                        setLead(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === leadId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.lead_status = lostStatus;
                        }
                        
                        return updatedData;
                        });
                        setLeadListView(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === leadId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.lead_status = lostStatus;
                        }
                        
                        return updatedData;
                        });
                    (document.getElementById('tertertertertertetretertertert' + leadId) as HTMLInputElement).value = lostStatus?.toString();
                    (document.getElementById('eihriugggefvkdjfgdyfiuegjhrwbe' + leadId) as HTMLInputElement).value = lostStatus?.toString();
                    // setNoteSaved(false);
                    setLostStatus('');
                    var toastEl = document.getElementById('myToastStatus');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }} >status</button>
            <button type='button' className='d-none' id={'KOK_ADD_TRANSACTION_CLICK'} onClick={async () => {
                console.log('KOK_ADD_TRANSACTION_CLICK', lostStatus);
                
                // if(lostStatus == '') {
                //     return;
                // }
                const body = {
                    "lead_status": 61
                }
                
                const updateTask = await updateLeadStatus(leadId, body);
                leadList();
                if(updateTask.status == 200) {
                    // document.getElementById('eljfhuywetgrtlyr8hkj')?.click();
                        setLead(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === leadId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.lead_status = 61;
                        }
                        
                        return updatedData;
                        });
                        setLeadListView(prevData => {
                        const updatedData = [...prevData];
                        const objectToUpdate = updatedData.find(obj => obj.id === leadId);
                        
                        if (objectToUpdate) {
                            objectToUpdate.lead_status = 61;
                        }
                        
                        return updatedData;
                        });
                    (document.getElementById('tertertertertertetretertertert' + leadId) as HTMLInputElement).value = lostStatus?.toString();
                    (document.getElementById('eihriugggefvkdjfgdyfiuegjhrwbe' + leadId) as HTMLInputElement).value = lostStatus?.toString();
                    // setNoteSaved(false);
                    setLostStatus('');
                    var toastEl = document.getElementById('myToastStatus');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }} >status</button>
            <div>
                {detailClick && detailData && 
                <div
                    id={'kt_expand'+detailData}
                    className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                >
                    <LeadDetails leadId={detailData} setLeadList={setLead} tabInfo={detailTab} setDetailClicked={setDetailClick} body={body} />
                </div>
                }
            </div>
            <div className='modal fade' id={'contact_status_change'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form noValidate onSubmit={formikNotes.handleSubmit}>
                                {lostStatus == 62 &&
                                <div className="input-group mb-3">
                                    <select 
                                    {...formikNotes.getFieldProps('reason_id')} 
                                    className="form-select main_bg w-100 br_10 text-gray-600">
                                    <option value='' selected disabled hidden>Select</option>
                                        {dropLeadReason.map((contactStatusValue,i)=> {
                                        return (
                                            <option value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                        )
                                        })} 
                                    </select>      
                                </div>}
                                {lostStatus == 60 &&
                                <div className="input-group mb-3">
                                    <select 
                                    {...formikNotes.getFieldProps('reason_id')} 
                                    className="form-select main_bg w-100 br_10 text-gray-600">
                                    <option value='' selected disabled hidden>Select</option>
                                        {lostLeadReason.map((contactStatusValue,i)=> {
                                        return (
                                            <option value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                        )
                                        })} 
                                    </select>      
                                </div>}
                                <textarea
                                    className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10'
                                    data-kt-autosize='true'
                                    {...formikNotes.getFieldProps('reply')} 
                                    rows={7}
                                    placeholder='Reason'
                                ></textarea>
                                <div className='d-flex align-items-center justify-content-end'>
                                    <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={(e) => cancelStatusChange()}>
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
            <div className='modal fade' id={'lead_reassign_pop_toggle'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 're_assign'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={() => setLeadCheckList([])}>
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
                                    if(leadCheckList.length > 0 && bulkAssign.length > 0) {
                                        let body = {
                                            'assign_to': bulkAssign?.map((item:any) => item.id?.toString()).join(','),
                                        }
                                        const response = await bulkReassignLead(body, leadCheckList);
                                        if(response.status == 200) {
                                            setAllSelected(false);
                                            setLeadCheckList([]);
                                            setBulkAssign([]);
                                            document.getElementById('kt_lead_reassign_pop_toggle')?.click();
                                            leadList();
                                            lead?.map((item:any) => (document.getElementById('contact'+item.id) as HTMLInputElement).checked = false);
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
                                <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteModel(deleteId)}>
                                    {intl.formatMessage({id: 'yes'})}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal fade' id={'delete_multi_lead_popup'} aria-hidden='true'>
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
            <div className='modal fade' id={'lead_send_mail_popup'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header py-2'>
                            <h3>{intl.formatMessage({id: 'send_mail'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-5 px-lg-10'>
                            <form noValidate onSubmit={formik.handleSubmit} className='lead_form'>
                                <div className="row">
                                    <div className="col-12">
                                        <label className="form-label required">{intl.formatMessage({id: 'to'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="email" {...formik.getFieldProps('to')} className="form-control" placeholder="Title"/>
                                        </div>
                                        {formik.touched.to && formik.errors.to && (
                                        <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.to}</span>
                                        </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="col-12">
                                    <label className="form-label">{intl.formatMessage({id: 'subject'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <input type="text" {...formik.getFieldProps('subject')} className="form-control" placeholder="Subject"/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                    <label className="form-label">{intl.formatMessage({id: 'message'})}</label>
                                        <div className="input-group first mb-3 input_prepend">
                                            <textarea rows={5} {...formik.getFieldProps('message')} className="form-control" placeholder=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-footer py-2 text-center' id='kt_contact_footer'>
                                    <button id='lead_mail_close' type='button' className='btn btn-secondary btn-sm' data-bs-dismiss='modal'>{intl.formatMessage({id: 'cancel'})}</button>
                                    <button
                                    type='submit'
                                    
                                    className='btn btn-sm btn_primary text-primary ms-2'
                                    disabled={formik.isSubmitting}
                                    >
                                    {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'send'})}
                                    <KTSVG path="/media/icons/duotune/general/gen016.svg" className="svg-icon-white svg-icon-1hx ms-2 me-0" />
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

        
            {/* kanban view */}
            <div className={toggle == 'pipe' ? "taskpage d-block": 'd-none'}>
                {/* {intl.formatMessage({id: 'pipeline'})} */}
                <ControlledBoardLead boardData={kanbanData} reload={kanbanView}/>
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
            <div className='h-100'>
            <div className={toggle == 'grid' ? "contact_page d-block" : 'd-none'}>
                <div className="row">
                <InfiniteScroll
                    dataLength={lead.length}
                    next={leadListLazyLoad}
                    hasMore={leadsCount > lead.length}
                    loader={<>
                    {leadsCount != lead.length &&
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
                    {lead.length == 0 ?
                    <div className='w-100 d-flex justify-content-center'>
                        <div>
                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                            <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                        </div>
                    </div> : 
                    <div className='w-100 d-flex justify-content-center'>
                        <div>
                            <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" />
                            <h4>{intl.formatMessage({id: 'no_more_leads_to_show'})}!!!</h4>
                        </div>
                    </div>}</>}
                >
                    <div className="card-group">
                        {lead.map((leadData, i) => {
                            return(
                            <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4" key={i} id={"nrewwicrgoiergviugbeguecgr"+leadData.id}>
                                <div className="card h-100 mx-2 bs_1 lead_card">
                                    <div className='card-body px-3 py-3'>
                                        <div className="d-flex align-items-center justify-content-between mb-5">
                                            <div className="d-flex align-items-center">                                                
                                                <form action="">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" onClick={(e) => leadOnSelect(e, leadData.id)} id={"lead"+leadData.id}/>
                                                        <label className="form-check-label id_label" htmlFor={"lead"+leadData.id}>
                                                            {leadData.id}
                                                        </label>
                                                    </div>
                                                </form>
                                                <div className="ms-3 ml-2 d-flex align-items-center">
                                                    <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="icon me-2" />
                                                    <p className="mb-0 contact_name py-1">{leadData.contact_name}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                <a href='#' onClick={() => openModal(leadData.id, 'overview')}><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>                                                
                                                <div className="btn-group">
                                                    <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" onClick={() => setLeadId(leadData.id)}>
                                                        <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                                    </a>
                                                    <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                        <li><a className="dropdown-item cursor-pointer" onClick={() => openModal(leadData.id, 'overview')}>{intl.formatMessage({id: 'edit'})}</a></li>
                                                        {currentUser?.designation == 1 &&
                                                        <li><a className="dropdown-item cursor-pointer" data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup418'} onClick={() => setDeleteId(leadData.id)}>{intl.formatMessage({id: 'delete'})}</a></li>}
                                                        <li><a className="dropdown-item cursor-pointer" id={'rjkthiutyeoritgujhgeruity'+leadData.id} onClick={() => openTaskForm(leadData)}>{intl.formatMessage({id: 'add_task'})}</a></li>
                                                        <li><a className="dropdown-item cursor-pointer" id={'gAddTransaction'+leadData.id} onClick={() => openTransactionForm(leadData)}>{intl.formatMessage({id: 'add_transaction'})}</a></li>
                                                        <li><a className="dropdown-item cursor-pointer" data-bs-toggle='modal' data-bs-target={'#lead_send_mail_popup'}>{intl.formatMessage({id: 'send_mail'})}</a></li>
                                                        <li><a className="dropdown-item cursor-pointer" onClick={() => {
                                                            navigator.clipboard.writeText(URL+'/menu/lead/leadReq/'+leadData.id);
                                                            var toastEl = document.getElementById('copiedToast');
                                                            const bsToast = new Toast(toastEl!);
                                                            bsToast.show();
                                                            }}>{intl.formatMessage({id: 'requirement_form_link'})}</a></li>
                                                    </ul>
                                                </div>                                                
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="flex-shrink-0">
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/custom/buyer.svg') }} src={leadData.contact_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/contacts/profile_image/'+leadData.contact_id+'/'+leadData.contact_profile_image : ''} className="user_img" alt='' />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <a href={`mailto:${leadData.contact_email}`} className="col-md-12 d-flex justify-content-between align-items-center mb-3 text-dark">                                                        
                                                        <p className="mb-0 fixed_text"><img src={toAbsoluteUrl('/media/custom/envelope.svg')} alt="" className="icon me-2"/>{leadData.contact_email}</p>
                                                    </a>
                                                    {/* <span className="col-md-6 d-flex align-items-center mb-3 text-dark">                                                        
                                                        <p className="mb-0 fixed_text"><img src={toAbsoluteUrl('/media/custom/lead/location_10.svg')} className="icon me-2" alt='' />{leadData.requirement_location_name != null ? leadData.requirement_location_name?.length > 10 ? leadData.requirement_location_name?.slice(0, 10) + '...' : leadData.requirement_location_name : '-'}</p>
                                                    </span> */}
                                                </div>
                                                <div className="row">
                                                    <a href={"tel:" + leadData.contact_mobile} className="col-md-6 d-flex align-items-center mb-2 text-dark" title={leadData.contact_mobile}>
                                                        <p className="mb-0 d-flex flex-wrap">
                                                            <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
                                                            {leadData.contact_mobile?.length > 10 ? leadData.contact_mobile?.slice(0, 10) + '...' : leadData.contact_mobile}
                                                        </p>
                                                    </a>
                                                    <a href={"https://api.whatsapp.com/send?phone="+ leadData.contact_mobile} target="new" className="col-md-6 d-flex align-items-center mb-2 text-dark" title={leadData.contact_mobile}>
                                                        <p className="mb-0 d-flex flex-wrap">
                                                            <span><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} alt="" className="icon me-1" /></span>
                                                            {leadData.contact_mobile?.length > 10 ? leadData.contact_mobile?.slice(0, 10) + '...' : leadData.contact_mobile}
                                                        </p>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <div className="row">
                                                <div className="col-xl-12">
                                                    <div className="row">
                                                    <div className="col-xl-8 col-md-8 col-sm-8 col-6 mb-4 py-1" title={leadData.property_name ?? ''}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/lead_1.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'project'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.property_name ?? ''}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.property_type_name ?? ''}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/residential_5.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'property_type'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.property_type_name ?? '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.budget_min ?? '0' + '-' + leadData.budget_max ?? '0'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/flat_6.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'property_budget'})}</small>
                                                                    {/* <p className="mb-0 fw-500">{leadData.budget_min != null ? leadData.budget_min.slice(0, -5) : '0'} - {leadData.budget_max != null ? leadData.budget_max.slice(0, -5) : '0'}</p> */}
                                                                    <p className="mb-0 fw-500">{leadData.budget_min_ut == '1' ? (leadData.budget_min / 10000000) +' '+ 'C' : leadData.budget_min_ut == '2' ? (leadData.budget_min / 100000)  +' '+ 'L' : leadData.budget_min_ut == '3' ? (leadData.budget_min / 1000) +' '+ 'K' : '0'} - {leadData.budget_max_ut == '1' ? (leadData.budget_max / 10000000) +' '+ 'C' : leadData.budget_max_ut == '2' ? (leadData.budget_max / 100000)  +' '+ 'L' : leadData.budget_max_ut == '3' ? (leadData.budget_max / 1000) +' '+ 'K' : '0'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.lead_source_name ?? ''}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'source'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.lead_source_name != null ? leadData.lead_source_name : '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.possession_status_name ?? '0'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'possession'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.possession_status_name != null ? leadData.possession_status_name: '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.built_up_area_min ?? '0' + '-' + leadData.built_up_area_max ?? '0'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'builtup_area'})}</small>
                                                                    {/* <p className="mb-0 fw-500">{leadData.built_up_area_min != null ? leadData.built_up_area_min : '0' } - {leadData.built_up_area_max != null ? leadData.built_up_area_max+' Sqft' : '0' }</p> */}
                                                                    <p className="mb-0 fw-500">{leadData.built_up_area_min_ut == '357' ? (leadData.built_up_area_min)+" "+ 'Acers' : leadData.built_up_area_min_ut == '355' ? (leadData.built_up_area_min)+" "+ 'Sq.ft' : leadData.built_up_area_min_ut == '356' ? (leadData.built_up_area_min)+" "+ 'Sq.mt' : '0' } - {leadData.built_up_area_max_ut == '357' ? (leadData.built_up_area_max)+" "+ 'Acers' : leadData.built_up_area_max_ut == '355' ? (leadData.built_up_area_max)+" "+ 'Sq.ft' : leadData.built_up_area_max_ut == '356' ? (leadData.built_up_area_max)+" "+ 'Sq.mt' : '0' } </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.no_of_bedrooms_min ?? '0' + '-' + leadData.no_of_bedrooms_max ?? '0'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'bedrooms'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.no_of_bedrooms_min ? leadData.no_of_bedrooms_min + ' BHK' : '0' } - {leadData.no_of_bedrooms_max ? leadData.no_of_bedrooms_max + ' BHK' : '0' }</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.no_of_bathrooms_min ?? '0' + '-' + leadData.no_of_bathrooms_max ?? '0'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'bathrooms'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.no_of_bathrooms_min ? leadData.no_of_bathrooms_min : '0' } - {leadData.no_of_bathrooms_max ? leadData.no_of_bathrooms_max : '0' }</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1">
                                                            <div className="d-flex align-items-start single_item" title={leadData.assign_to_name?.split(',')?.map((item: string) => item.split('-')[0]).join(', ') ?? '-'}>
                                                                <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'assign_to'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.assign_to_name?.split(',')?.map((item: string) => item.split('-')[0]).join(', ') ?? '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={leadData.lead_priority_name ?? '-'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'lead_priority'})}</small>
                                                                    <p className="mb-0 fw-500">{leadData.lead_priority_name ?? '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-4 col-6 mb-4 py-1" title={Moment(leadData.created_at).format('DD-MM-YYYY')  ?? '-'}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/calendar.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'created_at'})}</small>
                                                                    <p className="mb-0 fw-500">{Moment(leadData.created_at).format('DD-MM-YYYY')}</p>
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
                                                    <a onClick={() => openModal(leadData.id, 'notes')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="Notes">
                                                        <img src={toAbsoluteUrl('/media/custom/notes.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {leadData.notes_count}
                                                        </span>
                                                    </a>
                                                    <a onClick={() => openModal(leadData.id, 'files')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="File">
                                                        <img src={toAbsoluteUrl('/media/custom/file.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {leadData.files_count}
                                                        </span>
                                                    </a>
                                                    {/* <a onClick={() => openModal(leadData.id, 'matches')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="Merge">
                                                        <img src={toAbsoluteUrl('/media/custom/merge.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            0
                                                        </span>
                                                    </a> */}
                                                    <a onClick={() => openModal(leadData.id, 'task')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task">
                                                        <img src={toAbsoluteUrl('/media/custom/task.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {leadData.task_count}
                                                        </span>
                                                    </a>
                                                    {/* <a onClick={() => openModal(leadData.id, 'message')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="Message">
                                                        <img src={toAbsoluteUrl('/media/custom/message.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            {leadData.notes_count}
                                                        </span>
                                                    </a> */}
                                                    {/* <a onClick={() => openModal(leadData.id, 'register')} className="btn btn-sm icon_primary rounded-circle position-relative"data-bs-toggle="tooltip" data-bs-placement="bottom" title="Register">
                                                        <img src={toAbsoluteUrl('/media/custom/register.svg')} className="svg_icon" alt='' />
                                                        <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                            0
                                                        </span>
                                                    </a> */}
                                                </div>
                                                <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
                                                    <select className={`form-select toggle_white toggle_white ${leadData.lead_status == 52 ? 'btn-light border' : leadData.lead_status == 53 ? 'btn-primary' : leadData.lead_status == 54 ? 'btn_primary' : leadData.lead_status == 55 ? 'btn-info' : leadData.lead_status == 56 ? 'btn-dark' : leadData.lead_status == 57 ? 'btn-warning' : leadData.lead_status == 58 ? 'btn-success' : leadData.lead_status == 59 ? 'btn-secondary' : leadData.lead_status == 60 ? 'btn-danger' : leadData.lead_status == 61 ? 'btn-success' : leadData.lead_status == 62 ? 'btn-danger' : 'btn-pink'} rounded-pill btn-sm cursor-pointer status_btn`} aria-label="Default select example" id={'tertertertertertetretertertert'+leadData.id} onChange={(e) => leadTypeChange(e.target.value, leadData)}>
                                                        {leadStatus?.map((statusVal,i) => {
                                                        return (
                                                            <option value={statusVal.id} selected={statusVal.id == leadData.lead_status} key={i}>{statusVal.option_value}</option> 
                                                        )})}
                                                    </select>
                                                </div>
                                                <a className="d-none" data-bs-toggle='modal' id='lead_status_pop'
                                                data-bs-target={'#contact_status_change'}></a>                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                    </InfiniteScroll>
                </div>
            </div>
            {toggle == 'list' &&
                <div className='h-100'>
                    <div className="card table_card p-3 overflow-auto">
                        <LeadList body={body} leadStatus={leadStatus} leadTypeChange={leadTypeChange} openModal={openModal} leadListView={leadListView} />
                    </div>
                </div>
            }
            </div>
            }
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="leadAddToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_created_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="copiedToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'requirement_form_copied'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastStatus">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_status_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastDeleteStatus">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="leadFilesDeleteStatus">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_files_deleted_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="errMsgToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'something_went_wrong'})}!!!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastUpload">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'lead_imported_successfully'})}!
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
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="mailSendLead">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'mail_sent'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="leadNotSelectedToast">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'select_leads_first'})}!
                </div>
            </div>
        </div>
)}

export {LeadPage}
