import React,{FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Toast } from 'bootstrap'
import { deleteLanguage, deleteTransaction, getLanguage, getTranslation, getTranslationById, saveLanguage, saveTransaction, updateLanguage, updateTransaction } from './core/requests'
import {useIntl} from 'react-intl';

const initialValues = {
    lang_name: '',
    lang: '',
    lang_key: '',
    lang_value: '',
}

const Translation: FC = () => {
    const intl = useIntl();
    const [translation, setTranslation] = useState<any[]>([]);
    const [language, setLanguage] = useState<any[]>([]);
    const [state, setState] = useState<any[]>([]);
    const [searchTranslation, setSearchTranslation] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [langStatus, setLangStatus] = useState(false);
    const [editId, setEditId] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('');
    const [masterId, setMasterId] = useState<any>('Language');

    useEffect(() => {
        // console.log("rjthekutheirhtierut", langStatus)
    }, [langStatus]);

    const languageSchema = Yup.object().shape({
        lang_name: Yup.string().required(`${masterId} is required`),
        lang: Yup.string().required(`${masterId} code is required`),
    })
    const translationSchema = Yup.object().shape({
        lang: Yup.string().required(`${masterId} is required`),
        lang_key: Yup.string().required(`Language Key is required`),
        lang_value: Yup.string().required(`Language Value is required`),
    })

    const translationRequest =  async (loc:any) => {
        setMasterId(loc);
        if(loc == 'Language') {
            setLoading(true)
            const Response = await getLanguage()
            setTranslation(Response.output);
            setLanguage(Response.output);
            setLangStatus(Response.output?.status == 1 ? true : false)
            setLoading(false)
        } else if(loc == 'Translation') {
            setLoading(true)
            const Response = await getTranslation()
            setTranslation(Response.output);
            setSearchTranslation(Response.output);
            setLoading(false)
        }
    }

    //.filter(value => value.toLowerCase().includes(e.toLowerCase()))

    useEffect(() => {
        translationRequest('Language');
    }, []);

    const langMessage = () => {
        let msgs = ["Cloning Whole lnaguage data", "This will take a while", "Please wait", "Just a moment", "Almost done"];
        setLoadingMessage(msgs[0])
        setTimeout(() => {
            setLoadingMessage(msgs[1])
        }, 10000)
        setTimeout(() => {
            setLoadingMessage(msgs[2])
        }, 20000)
        setTimeout(() => {
            setLoadingMessage(msgs[3])
        }, 30000)
        setTimeout(() => {
            setLoadingMessage(msgs[4])
        }, 40000)
    }

    const formikLanguage = useFormik({
        initialValues,
        validationSchema: languageSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          langMessage();
          try {    
            const body = {
                'lang_name': values.lang_name,
                'lang': values.lang,
                'status': langStatus ? 1 : 2,
            }        
            if(!editClicked){                    
                const saveStatusData = await saveLanguage(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    translationRequest('Language');
                    setMasterId('Language');
                    document.getElementById('languageModalClose')?.click();
                    document.getElementById('uyuyuyuyuyuyrtgehgrhvfdhfjdhv')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('translationAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(saveStatusData.status == 400) {
                    setLoading(false);
                    var toastEl = document.getElementById('translationExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }                   
            } else {
                const updateStatusData = await updateLanguage(editId, body);
                if(updateStatusData.status == 200) {
                translationRequest('Language');
                setMasterId('Language');
                document.getElementById('languageModalClose')?.click();
                document.getElementById('uyuyuyuyuyuyrtgehgrhvfdhfjdhv')?.click();
                setEditClicked(false);
                setEditId('');
                resetForm();
                setLoading(false);
                var toastEl = document.getElementById('translationEdit');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else if(updateStatusData.status == 400) {
                setLoading(false);
                var toastEl = document.getElementById('translationExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('translationError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formikState = useFormik({
        initialValues,
        validationSchema: translationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            const body = {
                "lang": values.lang,
                "lang_key": values.lang_key,
                "lang_value": values.lang_value
            }         
            if(!editClicked){                    
                const saveStatusData = await saveTransaction(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    translationRequest('Translation');
                    setMasterId('Translation');
                    document.getElementById('languageModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('translationAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(saveStatusData.status == 400) {
                    setLoading(false);
                    var toastEl = document.getElementById('translationExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
                    
            } else {
                const updateStatusData = await updateTransaction(editId, body);
                if(updateStatusData.status == 200) {
                    translationRequest('Translation');
                    setMasterId('Translation');
                    document.getElementById('languageModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('translationEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(updateStatusData.status == 400) {
                    setLoading(false);
                    var toastEl = document.getElementById('translationExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }                
            }
          }
        catch (error) {
            var toastEl = document.getElementById('translationError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const editTap = (value:any, code:any, key:any, val:any, id:any) => {
        setEditClicked(true);
        setEditId(id);
        if(masterId == 'Language') {
            formikLanguage.setFieldValue('lang_name', value);
            formikLanguage.setFieldValue('lang', code);
        } else if(masterId == 'Translation') {
            formikState.setFieldValue('lang', code);
            formikState.setFieldValue('lang_value', val);
            formikState.setFieldValue('lang_key', key);
        }
    }

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        if(masterId == 'Language') {
            formikLanguage.resetForm();
        } else if(masterId == 'Translation') {
            formikState.resetForm();
        }
    }

    const onDelete = async (id:any) => {
        console.log(id);
        if(masterId == 'Language') {
            await deleteLanguage(id);
            document.getElementById('uyuyuyuyuyuyrtgehgrhvfdhfjdhv')?.click();
            translationRequest('Language');
            var toastEl = document.getElementById('translationDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(masterId == 'Translation') {
            await deleteTransaction(id);
            translationRequest('Translation');
            var toastEl = document.getElementById('translationDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    } 

    return(
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>
            <div className='modal fade' id={'Translations_form'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: masterId.toLowerCase()})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' id='languageModalClose' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                        {masterId == 'Language' ?
                        <form className='w-100' noValidate onSubmit={formikLanguage.handleSubmit}>
                            <div className='me-n3 d-flex flex-column align-items-end'>
                                <div className="form-group mb-4 w-100">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder={masterId} {...formikLanguage.getFieldProps('lang_name')}/> 
                                    </div>
                                    {formikLanguage.touched.lang_name && formikLanguage.errors.lang_name && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikLanguage.errors.lang_name}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>                              
                                <div className="form-group mb-4 w-100">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: `${masterId.toLowerCase()}_code`})}</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder={masterId+" code"} {...formikLanguage.getFieldProps('lang')}/> 
                                    </div>
                                    {formikLanguage.touched.lang && formikLanguage.errors.lang && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikLanguage.errors.lang}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                {loading && <> 
                                <div className="container">    
                                    <div className="progress progress-striped p-0">
                                        <div className="progress-bar">
                                        </div>                       
                                    </div> 
                                </div>
                                <div className='w-100 text-center'>
                                    <span className='fs-6'>{loadingMessage}!</span>
                                </div>
                                </>}                            
                                <div className="d-flex align-items-center">
                                    {editClicked &&
                                    <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                        {intl.formatMessage({id: 'cancel'})}
                                    </button>}
                                    {!loading && 
                                    <button
                                        type='submit'
                                        
                                        className='btn btn-sm btn_primary text-primary mt-3'
                                        disabled={formikLanguage.isSubmitting}
                                        >
                                        <span className='indicator-label'>{editClicked ? "Update" : "Create" }</span>
                                        {/* {loading && (
                                            <span className='indicator-progress' style={{display: 'block'}}>
                                            {intl.formatMessage({id: 'please_wait'})}...{' '}
                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                            </span>
                                        )} */}
                                    </button>}
                                    </div>
                            </div>
                        </form> :  
                        <form className='w-100' noValidate onSubmit={formikState.handleSubmit}>
                            <div className='me-n3 d-flex flex-column align-items-end'>                             
                                <div className="form-group mb-4 w-100">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'language'})}</label>
                                    <select className="form-select" {...formikState.getFieldProps('lang')}>
                                        <option disabled value="">Select</option>
                                        {language.map((data, i) => {
                                            return(
                                            <option value={data.lang} key={i}>{data.lang_name}</option>
                                        )})}
                                    </select>
                                    {formikState.touched.lang && formikState.errors.lang && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikState.errors.lang}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>                                        
                                <div className="form-group mb-4 w-100">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'language_key'})}</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Language Key" {...formikState.getFieldProps('lang_key')}/> 
                                    </div>
                                    {formikState.touched.lang_key && formikState.errors.lang_key && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikState.errors.lang_key}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>                              
                                <div className="form-group mb-4 w-100">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'language_value'})}</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="language Value" {...formikState.getFieldProps('lang_value')}/> 
                                    </div>
                                    {formikState.touched.lang_value && formikState.errors.lang_value && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formikState.errors.lang_value}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>                              
                                <div className="d-flex align-items-center">
                                    {editClicked &&
                                    <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                        {intl.formatMessage({id: 'cancel'})}
                                    </button>}
                                    <button
                                        type='submit'
                                        
                                        className='btn btn-sm btn_primary text-primary mt-3'
                                        disabled={formikState.isSubmitting}
                                        >
                                        {!loading && <span className='indicator-label'>{editClicked ? "Update" : "Create" }
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
                        </form>}
                        </div>
                    </div>
                </div>
            </div>
            {loading ? 
            <div className='w-100 h-100'>
                <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                    <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                    <div className="spinner-border taskloader" role="status">                                    
                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                    </div>
                </div> 
            </div> : 
            <div className='flex-lg-row-fluid'>                
                <div className="">                    
                    <div className="tab-content h-100" id="pills-tabContent">
                        <div className='card bs_2 h_81vh' id="ContactStatus" role="tabpanel" aria-labelledby="ContactStatus_tab">
                        <div className='card-header' id='kt_chat_messenger_header'>
                            <div className='card-title'>
                                <div className='d-flex align-items-center me-3'>
                                {masterId != 'Language' &&
                                <span className='me-3' onClick={() => {
                                    translationRequest('Language');
                                    setMasterId('Language');
                                    setEditClicked(false);
                                    setEditId('');
                                }}>
                                    <KTSVG path="/media/icons/duotune/arrows/arr021.svg" className="svg-icon-muted svg-icon-1" />
                                </span>} 
                                <a href='#' className='fs-4 fw-bolder text-gray-900 text-hover-primary lh-1'>
                                    {masterId}
                                </a>
                                </div>
                            </div>
                            <div className='card-toolbar d-flex flex-nowrap'>
                                {masterId != 'Language' && <>
                                <div className="input-group form_search my-3 me-3 dropdown-item">
                                <input type="text" className="form-control" name="search" placeholder="Search" onChange={(e) => {
                                    console.log("qih", e.target.value)
                                    setTranslation(searchTranslation.filter(value => value.lang_key?.toLowerCase().includes(e.target.value.toLowerCase()) || value.lang_value?.toLowerCase().includes(e.target.value.toLowerCase())))
                                }} />
                                <div className="input-group-append">
                                    <button className="btn btn-secondary" type="button">
                                    <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                    </button>
                                </div>
                                </div></>}
                                <span onClick={() => editCancel()} data-bs-toggle='modal' data-bs-target={'#Translations_form'}>
                                    <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted svg-icon-2hx" />
                                </span>                                
                            </div>                                               
                        </div>
                        <div className='card-body p-0'>
                            {translation.length > 0 ?
                            <table className='table table-striped border role_table align-middle'>
                                <thead className='text-nowrap'>
                                    <tr className='bg-gray-200'>
                                        <th className='text-center ps-4'>No.</th>
                                        <th>{masterId == 'Language' ? intl.formatMessage({id: 'language_name'}) : intl.formatMessage({id: 'language_key'})}</th>
                                        <th className='text-center'>{masterId == 'Language' ? intl.formatMessage({id: 'language_code'}) : intl.formatMessage({id: 'language_value'})}</th>
                                        <th className='text-center pe-4'>{intl.formatMessage({id: 'actions'})}</th>
                                    </tr>
                                </thead>                                
                                <tbody>
                                    {translation?.map((data, i) => {
                                    return(                                
                                    <tr key={i}>
                                        <td className='text-center ps-4'>{i+1}</td>
                                        <td>{masterId == 'Language' ? data.lang_name : data.lang_key}</td>
                                        <td className='text-center'>{masterId == 'Language' ? data.lang : editId == data.id ? <div className="input-group">
                                        <input type="text" className="form-control" defaultValue={data.lang_value} id={"lang_val"+data.id}/> 
                                        </div> : data.lang_value}</td>
                                        
                                        <td className='d-flex flex-nowrap pe-3 justify-content-center pe-4'>
                                        {masterId != 'Language' ? <>
                                        {editId == data.id ? <>
                                        <button type='button' className="btn btn-icon svg-icon svg-icon-muted svg-icon-2hx text_primary" onClick={async() => {
                                            setLoadingBtn(true);
                                            const body = {
                                                "lang": data.lang,
                                                "lang_key": data.lang_key,
                                                "lang_value": (document.getElementById("lang_val"+data.id) as HTMLInputElement)?.value
                                            }

                                            const updateStatusData = await updateTransaction(editId, body);
                                                if(updateStatusData.status == 200) {
                                                    const response = await getTranslationById(data.lang);
                                                    setTranslation(response.output);
                                                    setSearchTranslation(response.output);
                                                    setMasterId('Translation');
                                                    setEditClicked(false);
                                                    setEditId('');
                                                    setLoadingBtn(false)
                                                    var toastEl = document.getElementById('translationEdit');
                                                    const bsToast = new Toast(toastEl!);
                                                    bsToast.show();
                                                } else if(updateStatusData.status == 400) {
                                                    setLoadingBtn(false);
                                                    var toastEl = document.getElementById('translationExist');
                                                    const bsToast = new Toast(toastEl!);
                                                    bsToast.show();
                                                }
                                        }}>
                                        {loadingBtn ? 
                                        <div className="spinner-border taskloader" role="status">                                    
                                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                        </div> :
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
                                        <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="currentColor"/>
                                        </svg>}
                                        </button></> : 
                                        <button type='button' onClick={() => {
                                            setEditId(data.id);
                                        }} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>}</> :
                                        <button data-bs-toggle='modal' data-bs-target='#Translations_form' onClick={() => editTap(data.lang_name, data.lang, data.lang_key, data.lang_value, data.id)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>}

                                        {masterId == 'Language' && <><button type='button' onClick={async() => {
                                            setLoading(true);
                                            setMasterId('Translation');
                                            const response = await getTranslationById(data.lang);
                                            setTranslation(response.output);
                                            setSearchTranslation(response.output);
                                            setLoading(false);
                                            }} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                            <KTSVG path="/media/icons/duotune/ecommerce/ecm008.svg" className="svg-icon-muted svg-icon-1" />
                                        </button>
                                        {data.lang != 'En' && <>
                                        <a href="#" data-bs-toggle='modal'
                                        data-bs-target={'#delete_confirm_popup453453453453534534534'+data.id} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>                                        
                                        <div className="form-check form-switch d-flex align-items-center ps-2" title='language on/off'>
                                            <input className="form-check-input ms-1" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked={data.status == 1 ? true : false} onChange={async(e) => {
                                                const body = {
                                                    'lang_name': data.lang_name,
                                                    'lang': data.lang,
                                                    'status': e.target.checked ? 1 : 2,
                                                }
                                                const updateStatusData = await updateLanguage(data.id, body);
                                                if(updateStatusData.status == 200) {
                                                    setMasterId('Language');
                                                    setEditClicked(false);
                                                    setEditId('');
                                                    document.getElementById('uyuyuyuyuyuyrtgehgrhvfdhfjdhv')?.click();
                                                    var toastEl = document.getElementById('translationEdit');
                                                    const bsToast = new Toast(toastEl!);
                                                    bsToast.show();
                                                } else if(updateStatusData.status == 400) {
                                                    setLoading(false);
                                                    var toastEl = document.getElementById('translationExist');
                                                    const bsToast = new Toast(toastEl!);
                                                    bsToast.show();
                                                }
                                                }} />
                                        </div></>}</>}
                                        <div className='modal fade' id={'delete_confirm_popup453453453453534534534'+data.id} aria-hidden='true'>
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
                                                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(data.id)}>
                                                                {intl.formatMessage({id: 'yes'})}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </td>                                  
                                    </tr>)})}
                                </tbody>
                            </table>  : 
                            <div className='w-100 d-flex justify-content-center'>
                                <div className=''>
                                    <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                                    <h4>Nothing To Show!!!</h4>
                                </div>
                            </div>}
                            <div className=''>
                            
                            {/* <div className=' thistab2 overflow-auto'>
                            {translation.map((Data, i) => {
                            return(
                            <div className='mb-0 lh-1 ms-2 mb-2 d-flex justify-content-between' key={i}>
                                <div className='d-flex align-items-center'>
                                <span className="svg-icon svg-icon-2 svg-icon-grey"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="currentColor"></rect><path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="currentColor"></path></svg></span>
                                <a href="#" className='fs-7 fw-bold text-gray-700 ps-2 pe-3'>{masterId == 'Language' ? Data.lang_name+" - "+Data.lang : Data.lang_key+" - "+Data.lang_value}</a>
                                </div>
                                
                                <div className='d-flex flex-nowrap'> 
                                <><button onClick={(e) => editTap(Data.lang_name, Data.lang, Data.lang_key, Data.lang_value, Data.id)} data-bs-toggle='modal' data-bs-target={'#Translations_form'} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>
                                {masterId != 'Translation' &&
                                <a href="#" data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup678hjgejyfuyeuw'+Data.id} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>}</>
                                </div>
                                    <div className='modal fade' id={'delete_confirm_popup678hjgejyfuyeuw'+Data.id} aria-hidden='true'>
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
                            </div> */}
                            </div>                            
                            </div>                        
                        </div>                        
                    </div>    
                </div>
            </div>}
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="translationAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_added_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="translationEdit">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_updated_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="translationDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_deleted_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="translationError">
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
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="translationExist">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'already_exist'})}!</div>
                </div>
            </div>
        </div>
    )
}
export {Translation}