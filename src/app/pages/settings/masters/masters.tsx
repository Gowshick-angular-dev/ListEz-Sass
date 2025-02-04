import { useFormik } from 'formik';
import React,{FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { deleteMasters, getMasters, saveMasters, updateMasters } from './core/_requests';
import * as Yup from 'yup'
import { Toast } from 'bootstrap';
import { useIntl } from 'react-intl';

const initialValues = {
  master_val: '',
}

const Masters: FC = () => {
    const intl = useIntl();
    const [toggle, setToggle] = useState(false);
    const [masters, setMasterList] = useState<any[]>([]);    
    const [filtered, setFiltered] = useState<any[]>([]);
    const [masterName, setMasterName] = useState<any>('');    
    const [loading, setLoading] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [editId, setEditId] = useState('');
    const [masterList, setMastersList] = useState<any[]>(["age_of_property", "amenities", "attendance_status", "call_type", "category", "contact_status", "contact_type", "customer_language", "document_type", "expense_type", "fee_confirmation", "flooring", "furnishing_status", "gender", "invoice_status", "key_custody", "kitchen_type", "lead_drop_reason", "lead_group", "lead_lost_reason", "lead_status", "leave_type", "legal_approval", "marital_status", "nationality", "ownership_type", "payment_mode", "pets", "portal", "posession_status", "priority", "property_status", "property_type_residential", "property_type_commercial", "property_type_plot", "requirement_type", "site_visit_preference", "source", "task_status", "task_type", "unit_type", "vasthu_compliant", "water_supply", "property_indepth", "available_for", "segment", "department", "blood_group", "branch", "reminder", "task_priority", "contact_category", "phone_number_type", "contact_group", "do_not_disturb", "pet_owner", "id_documents", "country_code", "looking_for", "lead_priority", "lead_source", "project_facing", "requirement_location"]);
    
    const mastersList = async(val:any) => {
        setLoading(true);
        editCancel();
        setMasterName(val);
        const response = await getMasters(val.toString())
        setMasterList(response.output);
        setLoading(false);
    }

    useEffect(() => {
      mastersList("age_of_property")
    }, []);

    const searchMaster = async(e:any) => {
      if(e) {
        const newPacientes = ["age_of_property", "amenities", "attendance_status", "call_type", "category", "contact_status", "contact_type", "customer_language", "document_type", "expense_type", "fee_confirmation", "flooring", "furnishing_status", "gender", "invoice_status", "key_custody", "kitchen_type", "lead_drop_reason", "lead_group", "lead_lost_reason", "lead_status", "leave_type", "legal_approval", "marital_status", "nationality", "ownership_type", "payment_mode", "pets", "portal", "posession_status", "priority", "property_status", "property_type_residential", "property_type_commercial", "property_type_plot", "requirement_type", "site_visit_preference", "source", "task_status", "task_type", "unit_type", "vasthu_compliant", "water_supply", "property_indepth", "available_for", "segment", "department", "blood_group", "branch", "reminder", "task_priority", "contact_category", "phone_number_type", "contact_group", "do_not_disturb", "pet_owner", "id_documents", "country_code", "looking_for", "lead_priority", "lead_source", "project_facing", "requirement_location"].filter(value => value.toLowerCase().replace('_', " ").replace('_', " ").includes(e.toLowerCase()));
        setMastersList(newPacientes);
      } else {
        setMastersList(["age_of_property", "amenities", "attendance_status", "call_type", "category", "contact_status", "contact_type", "customer_language", "document_type", "expense_type", "fee_confirmation", "flooring", "furnishing_status", "gender", "invoice_status", "key_custody", "kitchen_type", "lead_drop_reason", "lead_group", "lead_lost_reason", "lead_status", "leave_type", "legal_approval", "marital_status", "nationality", "ownership_type", "payment_mode", "pets", "portal", "posession_status", "priority", "property_status", "property_type_residential", "property_type_commercial", "property_type_plot", "requirement_type", "site_visit_preference", "source", "task_status", "task_type", "unit_type", "vasthu_compliant", "water_supply", "property_indepth", "available_for", "segment", "department", "blood_group", "branch", "reminder", "task_priority", "contact_category", "phone_number_type", "contact_group", "do_not_disturb", "pet_owner", "id_documents", "country_code", "looking_for", "lead_priority", "lead_source", "project_facing", "requirement_location"]);
      }
    }

    const WaterSupplySchema = Yup.object().shape({
      master_val: Yup.string().required(`required`),
  })

  const formik = useFormik({
      initialValues,
      validationSchema: WaterSupplySchema,
      onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        setLoading(true);
        try {
          const body = {
            "option_type": masterName,
            "option_value": values.master_val
        }
          if(!editClicked){
              const saveWaterSupplyData = await saveMasters(body);
              resetForm();
              mastersList(masterName)
              setLoading(false);
              var toastEl = document.getElementById('masterAdd');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
          } else {
              const updateWaterSupplyData = await updateMasters(editId, body);
              setEditClicked(false);
              setEditId('');
              resetForm();
              mastersList(masterName)
              setLoading(false);
              var toastEl = document.getElementById('masterEdit');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
          }
        }
      catch (error) {
        var toastEl = document.getElementById('masterError');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false);
        }
  }})

  const editTap = (value:any, id:any) => {
    console.log(value, id);
    setEditClicked(true);
    setEditId(id);
    formik.setFieldValue('master_val', value);
  }

  const editCancel = () => {
    setEditClicked(false);
    setEditId('');
    formik.setFieldValue('master_val', '');
  }

  const onDelete = async (id:any) => {
    setLoading(true);
    await deleteMasters(id);
    mastersList(masterName)
    setLoading(false);
    var toastEl = document.getElementById('masterDelete');
    const bsToast = new Toast(toastEl!);
    bsToast.show();
  }

    return(
        <div className='row masters_main h-100'>
            <div className={masterName ? 'd-none d-md-block col-md-6 col-lg-5 col-xl-4 col-xxl-3 mb-10 mb-lg-0' : 'col-md-6 col-lg-5 col-xl-4 col-xxl-3 mb-10 mb-lg-0'}>
                <div className='card card-flush h_85vh'>
                <div className='card-header pt-7' id='kt_chat_contacts_header'>
                        <h3>{intl.formatMessage({id: 'master_field'})}</h3>
                        <div className='w-100 position-relative'>
                        <KTSVG
                            path='/media/icons/duotune/general/gen021.svg'
                            className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
                        />
                        <input
                            type='text' onChange={(e) => searchMaster(e.target.value)}
                            className='form-control form-control-solid px-15'
                            name='search'
                            placeholder='Search masters...'
                            autoComplete='off'
                        />
                        </div> 
                </div>
                <div className='card-body pt-5' id='kt_chat_contacts_body'>
                    <div
                    className='scroll-y me-n5 pe-5 h-200px h-lg-auto thistab hide_scroll_bar'
                    data-kt-scroll='true'
                    data-kt-scroll-activate='{default: false, lg: true}'
                    data-kt-scroll-max-height='auto'
                    data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                    data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                    data-kt-scroll-offset='10px'
                    >
                        <ul className="nav nav-pills mb-5 masters_tab d-block" id="pills-tab" role="tablist">                       
                            {masterList?.map((master, i) => {
                                return(
                            <li className="nav-item w-100 mb-3" role="presentation" key={i} onClick={() => mastersList(master)}>
                                <div className={masterName == master ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'} id="ContactStatus_tab" data-bs-toggle="pill" data-bs-target="#ContactStatus" role="tab" aria-controls="ContactStatus" aria-selected="true">
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            {master.split("_")[0][0].toUpperCase()}{master.split("_")[1] == undefined ? '' : master.split("_")[1][0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {master.split("_")[0].charAt(0).toUpperCase()+ master.split("_")[0].slice(1)}{master.split("_")[1] == undefined ? '' : " "+master.split("_")[1].charAt(0).toUpperCase()+master.split("_")[1].slice(1)}{master.split("_")[2] == undefined ? '' : " "+master.split("_")[2].charAt(0).toUpperCase()+master.split("_")[2].slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span>
                                    </div>
                                </div>
                            </li>)})}                                                       
                        </ul>
                    </div>
                </div>
                </div>
            </div>
            <div className={masterName ? 'col-md-6 col-lg-7 col-xl-8 col-xxl-9 ps-lg-2 ps-xl-4' : 'd-none d-md-block col-md-6 col-lg-7 col-xl-8 col-xxl-9 ps-lg-2 ps-xl-4'}>
                {loading ?
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> : 
                <div className="card h_85vh">
                    <div className='card-header pt-5 d-flex align-items-center' id='kt_chat_contacts_header'>                    
                    <div className='fs-4 fw-bolder text-gray-900 me-1 mb-5 lh-1'>
                    <span className='me-3 d-md-none' onClick={() => {
                        setMasterName("");
                    }}>
                        <KTSVG path="/media/icons/duotune/arrows/arr021.svg" className="svg-icon-muted svg-icon-1" />
                    </span>
                        {masterName.split("_")[0].charAt(0).toUpperCase()+ masterName.split("_")[0].slice(1)}{masterName.split("_")[1] == undefined ? '' : " "+masterName.split("_")[1].charAt(0).toUpperCase()+masterName.split("_")[1].slice(1)}{masterName.split("_")[2] == undefined ? '' : " "+masterName.split("_")[2].charAt(0).toUpperCase()+masterName.split("_")[2].slice(1)}
                    </div>
                        <div className='card-toolbar align-items-start justify-content-end'>
                              <form noValidate onSubmit={formik.handleSubmit}>
                                  <div className='me-n3 d-flex align-items-center align-items-end'>
                                      {/* <label className='required text-nowrap me-3'>{masterName.split("_")[0].charAt(0).toUpperCase()+ masterName.split("_")[0].slice(1)}{masterName.split("_")[1] == undefined ? '' : " "+masterName.split("_")[1].charAt(0).toUpperCase()+masterName.split("_")[1].slice(1)}{masterName.split("_")[2] == undefined ? '' : " "+masterName.split("_")[2].charAt(0).toUpperCase()+masterName.split("_")[2].slice(1)}</label> */}
                                      <input type="text" max="25" className="form-control p-2 me-3" {...formik.getFieldProps('master_val')} />
                                      {formik.touched.master_val && formik.errors.master_val && (
                                          <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                              <span role='alert' className='text-danger'>{formik.errors.master_val}</span>
                                          </div>
                                          </div>
                                      )}
                                      <div className="d-flex align-items-center">
                                          {editClicked ?
                                          <>
                                            <button type='button' className='btn btn-sm btn-secondary me-3 d-none d-sm-block' onClick={editCancel}>
                                                {intl.formatMessage({id: 'cancel'})}
                                            </button>
                                          <span onClick={editCancel} className="svg-icon svg-icon-muted svg-icon-2hx me-3 d-sm-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
                                          <rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"/>
                                          <rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"/>
                                          </svg>
                                          </span></>
                                          : null}
                                          <button
                                              type='submit'
                                              
                                              className='btn btn-sm btn_primary text-primary d-none d-sm-block'
                                              disabled={formik.isSubmitting}
                                              >
                                              {!loading && <span className='indicator-label'>{editClicked ? intl.formatMessage({id: 'update'}) : intl.formatMessage({id: 'add'})}
                                              </span>}
                                              {loading && (
                                                  <span className='indicator-progress' style={{display: 'block'}}>
                                                  {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                  </span>
                                              )}
                                          </button>
                                          {editClicked ?
                                            <button type='submit' className="btn btn-icon svg-icon svg-icon-muted svg-icon-2hx text_primary d-sm-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
                                            <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="currentColor"/>
                                            </svg>
                                            </button> : 
                                            <button type='submit' className="btn btn-icon svg-icon svg-icon-muted svg-icon-2hx text_primary d-sm-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
                                            <rect x="10.8891" y="17.8033" width="12" height="2" rx="1" transform="rotate(-90 10.8891 17.8033)" fill="currentColor"/>
                                            <rect x="6.01041" y="10.9247" width="12" height="2" rx="1" fill="currentColor"/>
                                            </svg>
                                            </button>}
                                          </div>
                                  </div>
                              </form>
                          </div>
                    </div>
                    <div className="tab-content p-7" id="pills-tabContent">
                        <div className='tab-pane fade show active' id="ContactStatus" role="tabpanel" aria-labelledby="ContactStatus_tab">
                        <div className='' id='kt_chat_messenger_header'>
                          <div className='card-title'>
                              <div className='symbol-group symbol-hover'></div>
                              <div className='d-flex justify-content-center flex-column me-3'>                                  
                                  {masters.map((Data, i) => {
                                    return(
                                  <div className='mb-0 lh-1 ms-2 mb-2 d-flex justify-content-between' key={i}>
                                    <div className='d-flex align-items-center'>
                                        <span className="svg-icon svg-icon-2 svg-icon-grey"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="currentColor"></rect><path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="currentColor"></path></svg></span>
                                        <span className='fs-7 fw-bold text-gray-700 ps-2 pe-3'>{Data.option_value}</span>
                                    </div>
                                    <div>
                                        <button onClick={(e) => editTap(Data.option_value, Data.id)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                            <span className="svg-icon svg-icon-4">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg>
                                            </span>
                                        </button>
                                        <a href="#" data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup33'+Data.id} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                                            <span className="svg-icon svg-icon-4">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg>
                                            </span>
                                        </a>
                                    </div>
                                          {/* confirm modal */}
                                          <div className='modal fade' id={'delete_confirm_popup33'+Data.id} aria-hidden='true'>
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
                                                              <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(Data.id)}>
                                                                  {intl.formatMessage({id: 'yes'})}
                                                              </button>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                  </div>
                                  )})}
                              </div>        
                          </div>                          
                      </div>
                        </div>                        
                    </div>    
                </div>}
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="masterAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'master_added_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="masterEdit">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'master_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="masterDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'master_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="masterError">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
                </div>
            </div>
        </div>
    )
}
export {Masters}