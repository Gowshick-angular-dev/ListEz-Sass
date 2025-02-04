import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { deleteTemplateWatsapp, getAllTemplatesWatsapp, getTemplateWatsapp, updateTemplateWatsapp } from './core/_requests'
import { Toast } from 'bootstrap';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { saveTemplateWatsapp } from './core/_requests';
import { useIntl } from 'react-intl';

const initialValues = {
    title: "",
    subject: "",
    from: "",
    module_id: "",
    message: "",
}

const Watsapp: FC = () => {
    const intl = useIntl();
    const [toggle, setToggle] = useState(false);
    const [allTemplatesWatsapp, setAllTemplatesWatsapp] = useState<any[]>([]);
    const [loading, setLoading] = useState(false); 
    const [dataBinded, setDataBinded] = useState(false); 
    const [templatesWatsapp, setTemplatesWatsapp] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<String>('');
    const [search, setSearch] = useState<any>("");
    const [filtered, setFiltered] = useState<any[]>([]);
    
    
    const handleHideData = () => {
        setToggle(!toggle);
    };

    const teamsSaveSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),       
        message: Yup.string().required('Body is required'),       
    })

    const formik = useFormik({
        initialValues,
        validationSchema: teamsSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {              
            const body = {
                "name_of_template": '',
                "title" : values.title,
                "body" : values.message,
            }
                
            if(!dataBinded) {
                const saveTemplatWatsappData = await saveTemplateWatsapp(body);
            
                if(saveTemplatWatsappData.status == 200){
                    setLoading(false);
                    var toastEl = document.getElementById('whatsappTempCreate');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                    resetForm();
                    AllTemplatesWatsappList();
                }
            } else {
                const updateTemplatWatsappData = await updateTemplateWatsapp(selectedId, body);
            
                if(updateTemplatWatsappData.status == 200){
                    setLoading(false);
                    var toastEl = document.getElementById('whatsappTempUpdate');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                    resetForm();
                    AllTemplatesWatsappList();
                    setDataBinded(false);
                }
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('tempErrMsg');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})


    const AllTemplatesWatsappList =  async () => {
        const AllTemplatesWatsappResponse = await getAllTemplatesWatsapp()
        setAllTemplatesWatsapp(AllTemplatesWatsappResponse.output);
    }

    const WatsappById = async (val:any) => {
        setSelectedId(val.id);
        // const TemplatesWatsappResponse = await getTemplateWatsapp(id)
        // setTemplatesWatsapp(TemplatesWatsappResponse.output);
        setDataBinded(true);
        formik.setFieldValue('title', val.title ?? '');
        formik.setFieldValue('message', val.body ?? '');
    }

    const deleteWatsapp = async (id:any) => {
        const deleteResponse = await deleteTemplateWatsapp(id);
        if(deleteResponse.status == 200){            
            var toastEl = document.getElementById('whatsappTempDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            formik.resetForm();
            AllTemplatesWatsappList();
            setDataBinded(false);
        }
    }

    const cancelEdit = () => {
        formik.resetForm();
        setDataBinded(false);
    }

    function filterItem(item: any, search: string) {
        if (search.startsWith("@")) {
          const bucket = search.toLowerCase().substring(1).split(":");
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
            return !item.title.toLowerCase().includes(searchFor);
          }
          return item.title.toLowerCase().includes(search);
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
        AllTemplatesWatsappList();
        var filteredData: any[] = [];
        if (search.length > 0) {
            allTemplatesWatsapp.forEach((item) => {
            if (filterItem(item, search.toLowerCase())) {
            filteredData.push({ ...item });
            }
        });
        } else {
            filteredData = [];
        }
        setFiltered(filteredData);
    }, [search]);

    return(
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>
        <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
            <div className='card card-flush h-100'>
            <div className='card-header pt-7' id='kt_chat_contacts_header'>
                <h3>{intl.formatMessage({id: 'whatsapp_list'})}</h3>
                <div className="input-group form_search my-6">
                    <input type="text" className="form-control" name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="button">
                        <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                        </button>
                    </div>
                </div>
            </div>
            <div className='card-body pt-5' id='kt_chat_contacts_body'>
                <div
                className='scroll-y me-n5 pe-5 h-200px h-lg-auto thistab'
                data-kt-scroll='true'
                data-kt-scroll-activate='{default: false, lg: true}'
                data-kt-scroll-max-height='auto'
                data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                data-kt-scroll-offset='0px'
                >
                    <ul className="nav nav-pills mb-5 masters_tab d-block" id="pills-tab" role="tablist">
                    {!search
                        ? allTemplatesWatsapp.map((item) => (
                            <li className="nav-item w-100 mb-3" role="presentation" key={item.title}>
                            <div onClick={() => WatsappById(item)} className='d-flex flex-stack py-2 nav-link active bg-light cursor-pointer' id="contact_status_tab" data-bs-toggle="pill" data-bs-target="#contact_status" role="tab" aria-controls="contact_status" aria-selected="true">
                                <div className='d-flex align-items-center'>
                                    <div className='symbol symbol-35px symbol-circle'>
                                        <span className='symbol-label bg_soft text_primary fs-6 fw-bolder text-capitalize'>
                                        {item.title[0]}
                                        </span>
                                    </div>

                                    <div className='ms-5'>
                                        <p className='fs-5 fw-bolder text-gray-900 mb-0'>
                                        {item.title} 
                                        </p>
                                    </div>
                                </div>
                                <div className='d-flex flex-column align-items-end ms-2'>
                                <span className='text-muted fs-7 mb-1'>
                                    <span className="svg-icon svg-icon-2 svg-icon-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="currentColor"></rect><path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="currentColor"></path></svg></span>
                                </span>
                                </div>
                            </div>
                        </li>
                        ))
                        : filtered.map((item) => (<li className="nav-item w-100 mb-3" role="presentation" key={item.title}>
                        <div onClick={() => WatsappById(item.id)} className='d-flex flex-stack py-2 nav-link active bg-light cursor-pointer' id="contact_status_tab" data-bs-toggle="pill" data-bs-target="#contact_status" role="tab" aria-controls="contact_status" aria-selected="true">
                            <div className='d-flex align-items-center'>
                                <div className='symbol symbol-35px symbol-circle'>
                                    <span className='symbol-label bg_soft text_primary fs-6 fw-bolder text-capitalize'>
                                    {item.title[0]}
                                    </span>
                                </div>

                                <div className='ms-5'>
                                    <p className='fs-5 fw-bolder text-gray-900 mb-0'>
                                    {item.title} 
                                    </p>
                                </div>
                            </div>
                            <div className='d-flex flex-column align-items-end ms-2'>
                            <span className='text-muted fs-7 mb-1'>
                                <span className="svg-icon svg-icon-2 svg-icon-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="currentColor"></rect><path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="currentColor"></path></svg></span>
                            </span>
                            </div>
                        </div>
                    </li>))}                                                                              
                    </ul>
                </div>
            </div>
            </div>
        </div>
        <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
            <div className="card">
                <div className='card-header pt-7' id='kt_chat_contacts_header'>
                    <h3>{intl.formatMessage({id: 'watsapp_field'})}</h3>
                </div>
                <div className="tab-content p-4" id="pills-tabContent">
                    <div className='card tab-pane fade show active' id="contact_status" role="tabpanel" aria-labelledby="contact_status_tab">
                        {/* <WatsappForm/> */}
                        <div className="row">
                            <div className="col-lg-12 col-xxl-12">
                                <div className="card bs_1">
                                    <form noValidate onSubmit={formik.handleSubmit} >
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-md-6">                                            
                                                            <div className="form-group mb-4">
                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'title'})}</label>
                                                                <div className="input-group">
                                                                    <input type="text" className="form-control" placeholder="title" {...formik.getFieldProps('title')}/> 
                                                                </div>
                                                                {formik.touched.title && formik.errors.title && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.title}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                            </div>
                                                        </div>                                                        
                                                        <div className="col-12">                                        
                                                            <div className="form-group mb-4">
                                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'body'})}</label>
                                                                <div className="input-group">
                                                                    <textarea style={{height: '200px'}} className="form-control" placeholder="Message" {...formik.getFieldProps('message')}/> 
                                                                </div>
                                                                {formik.touched.message && formik.errors.message && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.message}</span>
                                                                </div>
                                                            </div>
                                                            )}
                                                            </div>
                                                        </div>                                        
                                                    </div>                                
                                                </div>
                                            </div>
                                        </div>
                                        {dataBinded &&
                                        <div className='card-footer py-5 text-center' id='kt_task_footer'>
                                            <button
                                            type='button'
                                            className='btn btn-secondary text-gray-700'
                                            onClick={cancelEdit}
                                            >
                                                {intl.formatMessage({id: 'cancel'})}
                                            </button>
                                            <button
                                            type='button'
                                            className='btn dlt_btn text-white mx-4'
                                            data-bs-toggle='modal'
                                            data-bs-target={'#delete_confirm_popupwatsapp'+selectedId}
                                            >
                                                <span className='indicator-label'>{intl.formatMessage({id: 'delete'})}
                                                <span className="svg-icon svg-icon-2 text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
                                                </span>
                                            </button>
                                            <button
                                            type='submit'
                                            id='kt_add_teams_submit'
                                            className='btn btn_primary text-primary'
                                            disabled={formik.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'update'})}
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
                                        }
                                        {!dataBinded &&
                                        <div className='card-footer py-5 text-center' id='kt_task_footer'>
                                            <button
                                            type='submit'
                                            id='kt_add_teams_submit'
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
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
        {/* confirm modal */}
        <div className='modal fade' id={'delete_confirm_popupwatsapp'+selectedId} aria-hidden='true'>
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
                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => deleteWatsapp(selectedId)}>
                                {intl.formatMessage({id: 'yes'})}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastAdd">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}{intl.formatMessage({id: 'email'})}</strong>
                <button aria-label="Close" className="btn-close"
                    data-bs-dismiss="toast" type="button">
                </button>
            </div>
            <div className="toast-body">
                {intl.formatMessage({id: 'watsapp_saved_successfully'})}!
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
                {intl.formatMessage({id: 'watsapp_updated_successfully'})}!
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastDelete">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close"
                    data-bs-dismiss="toast" type="button">
                </button>
            </div>
            <div className="toast-body">
                {intl.formatMessage({id: 'watsapp_deleted_successfully'})}!
            </div>
        </div>
    </div>  
)
}  
export {Watsapp}