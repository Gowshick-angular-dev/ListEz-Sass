import React,{FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { deleteLocalizationCity, deleteLocalizationCountry, deleteLocalizationCurrency, deleteLocalizationState, getLocalizationCity, getLocalizationCountry, getLocalizationCurrency, getLocalizationState, saveLocalizationCity, saveLocalizationCountry, saveLocalizationCurrency, saveLocalizationState, updateLocalizationCity, updateLocalizationCountry, updateLocalizationCurrency, updateLocalizationState, getLocality, saveLocality, updateLocality, deleteLocality} from './core/requests'
import { Toast } from 'bootstrap'
import { useIntl } from 'react-intl'

const initialValues = {
    name: '',
    state_id: '',
    country_id: '',
    symbol: '',
}

const Localization: FC = () => {
    const intl = useIntl();
    const [localization, setLocalization] = useState<any[]>([]);
    const [country, setCountry] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [editId, setEditId] = useState('');
    const [masterId, setMasterId] = useState<any>('Country');
    const [masterName, setMasterName] = useState<any>('');

    const countrySchema = Yup.object().shape({
        name: Yup.string().max(25, "Max 25 Characters").required(`${masterId} is required`),
    })
    const stateSchema = Yup.object().shape({
        name: Yup.string().max(25, "Max 25 Characters").required(`${masterId} is required`),
        country_id: Yup.string().required(`Country is required`),
    })
    const citySchema = Yup.object().shape({
        name: Yup.string().max(25, "Max 25 Characters").required(`${masterId} is required`),
        country_id: Yup.string().required(`Country is required`),
        state_id: Yup.string().required(`State is required`),
    })
    const currencySchema = Yup.object().shape({
        name: Yup.string().max(25, "Max 25 Characters").required(`${masterId} is required`),
        symbol: Yup.string().max(2, "Max 2 Characters").required(`symbol is required`),
    })
    const localitySchema = Yup.object().shape({
        name: Yup.string().max(25, "Max 25 Characters").required(`${masterId} is required`),
    })

    const localizationRequest =  async (loc:any) => {
        setMasterId(loc);
        setMasterName(loc);
        if(loc == 'Country') {
            setLoading(true)
            const Response = await getLocalizationCountry()
            setLocalization(Response.output);
            setCountry(Response.output);
            setLoading(false)
        } else if(loc == 'State') {
            setLoading(true)
            const Response = await getLocalizationState()
            setLocalization(Response.output);
            setState(Response.output);
            StateList();
            setLoading(false)
        } else if(loc == 'City') {
            setLoading(true)
            // setState([])
            const Response = await getLocalizationCity()
            setLocalization(Response.output);
            setCity(Response.output);
            setLoading(false)
        } else if (loc == 'Currency') {
            setLoading(true)
            const Response = await getLocalizationCurrency()
            setLocalization(Response.output);
            setLoading(false)
        } else if (loc == 'Locality') {
            setLoading(true)
            const Response = await getLocality()
            setLocalization(Response.output);
            setLoading(false)
        }
    }

    useEffect(() => {
        localizationRequest('Country');
        StateList();
    }, []);

    const StateList = async () => {
        const response = await getLocalizationState()
        setStates(response.output);
    }

    const formikCountry = useFormik({
        initialValues,
        validationSchema: countrySchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {    
            const body = {
                'name': values.name,
            }        
            if(!editClicked){                    
                const saveStatusData = await saveLocalizationCountry(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    localizationRequest('Country');
                    setMasterId('Country');
                    document.getElementById('localModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show(); 
                }
            } else {
                const updateStatusData = await updateLocalizationCountry(editId, body);
                if(updateStatusData.status == 200) {
                    localizationRequest('Country');
                    setMasterId('Country');
                    document.getElementById('localModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('localEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formikState = useFormik({
        initialValues,
        validationSchema: stateSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            const body = {
                "country_id": values.country_id,
                'name': values.name,
            }         
            if(!editClicked){                    
                const saveStatusData = await saveLocalizationState(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    localizationRequest('State');
                    setMasterId('State');
                    document.getElementById('localModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                const updateStatusData = await updateLocalizationState(editId, body);
                if(updateStatusData.status == 200) {
                    localizationRequest('State');
                    setMasterId('State');
                    document.getElementById('localModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('localEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formikCity = useFormik({
        initialValues,
        validationSchema: citySchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            const body = {
                "country_id": values.country_id,
                "state_id": values.state_id,
                'name': values.name,
            }         
            if(!editClicked){
                const saveStatusData = await saveLocalizationCity(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    localizationRequest('City');
                    setMasterId('City');
                    document.getElementById('localModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                const updateStatusData = await updateLocalizationCity(editId, body);
                if(updateStatusData.status == 200) {
                    localizationRequest('City');
                    setMasterId('City');
                    document.getElementById('localModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('localEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else{
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formikCurrency = useFormik({
        initialValues,
        validationSchema: currencySchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {     
            const body = {
                'name': values.name,
                'symbol': values.symbol,
            }       
            if(!editClicked){
                const saveStatusData = await saveLocalizationCurrency(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    localizationRequest('Currency');
                    setMasterId('Currency');
                    document.getElementById('localModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                const updateStatusData = await updateLocalizationCurrency(editId, body);
                if(updateStatusData.status == 200) {
                    localizationRequest('Currency');
                    setMasterId('Currency');
                    document.getElementById('localModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('localEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})
    const formikLocality = useFormik({
        initialValues,
        validationSchema: localitySchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {     
            const body = {
                'name': values.name,
            }       
            if(!editClicked){
                const saveStatusData = await saveLocality(body);
                if(saveStatusData.status == 200) {
                    resetForm();
                    localizationRequest('Locality');
                    setMasterId('Locality');
                    document.getElementById('localModalClose')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } else {
                const updateStatusData = await updateLocality(editId, body);
                if(updateStatusData.status == 200) {
                    localizationRequest('Locality');
                    setMasterId('Locality');
                    document.getElementById('localModalClose')?.click();
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    setLoading(false)
                    var toastEl = document.getElementById('localEdit');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else {
                    setLoading(false);
                    var toastEl = document.getElementById('alreadyExist');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const editTap = async (value:any) => {
        setEditClicked(true);
        setEditId(value.id);
        if(masterId == 'Country') {
            formikCountry.setFieldValue('name', value.name);
        } else if(masterId == 'State') {
            formikState.setFieldValue('country_id', value.country_id);
            formikState.setFieldValue('name', value.name);
        } else if(masterId == 'City') {
            const Response = await getLocalizationState();
            let states = Response.output?.filter((city:any) => value.country_id == city.country_id);
            setState(states);
            formikCity.setFieldValue('country_id', value.country_id);
            formikCity.setFieldValue('state_id', value.state_id);
            formikCity.setFieldValue('name', value.name);
        } else if(masterId == 'Currency') {
            formikCurrency.setFieldValue('name', value.name);
            formikCurrency.setFieldValue('symbol', value.symbol);
        } else if(masterId == 'Locality') {
            formikLocality.setFieldValue('name', value.name);
        }
    }

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        if(masterId == 'Country') {
            formikCountry.resetForm();
        } else if(masterId == 'State') {
            formikState.resetForm();
        } else if(masterId == 'City') {
            formikCity.resetForm();
        } else if(masterId == 'Currency') {
            formikCurrency.resetForm();
        } else if(masterId == 'Locality') {
            formikLocality.resetForm();
        }
    }

    const onDelete = async (id:any) => {
        console.log(id);
        if(masterId == 'Country') {
            await deleteLocalizationCountry(id);
            localizationRequest('Country');
            setMasterId('Country');
            var toastEl = document.getElementById('localDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(masterId == 'State') {
            await deleteLocalizationState(id);
            localizationRequest('State');
            setMasterId('State');
            var toastEl = document.getElementById('localDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(masterId == 'City') {
            await deleteLocalizationCity(id);
            localizationRequest('City');
            setMasterId('City');
            var toastEl = document.getElementById('localDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(masterId == 'Currency') {
            await deleteLocalizationCurrency(id);
            localizationRequest('Currency');
            setMasterId('Currency');
            var toastEl = document.getElementById('localDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        } else if(masterId == 'Locality') {
            await deleteLocality(id);
            localizationRequest('Locality');
            setMasterId('Locality');
            var toastEl = document.getElementById('localDelete');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }   

    return(
        <div className='row masters_main h-100'>            
            <div className='modal fade' id='Localization_form' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: masterId.toLowerCase()})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' id='localModalClose' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            {masterId == 'Country' ?                                
                            <form className='w-100' noValidate onSubmit={formikCountry.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikCountry.getFieldProps('name')}/> 
                                        </div>
                                        {formikCountry.touched.name && formikCountry.errors.name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCountry.errors.name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                            {intl.formatMessage({id: "cancel"})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit1'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikCountry.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
                                            </span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                {intl.formatMessage({id: "please_wait"})}...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form> : masterId == 'State' ? 
                            <form className='w-100' noValidate onSubmit={formikState.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>                             
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: "country"})}</label>
                                        <select className="form-select" {...formikState.getFieldProps('country_id')}>
                                            <option disabled value="">Select</option>
                                            {country.map((data, i) => {
                                                return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select>
                                        {formikState.touched.country_id && formikState.errors.country_id && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikState.errors.country_id}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                                        
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikState.getFieldProps('name')}/> 
                                        </div>
                                        {formikState.touched.name && formikState.errors.name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikState.errors.name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                            {intl.formatMessage({id: "cancel"})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit2'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikState.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
                                            </span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                {intl.formatMessage({id: "please_wait"})}...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}
                                        </button>
                                        </div>
                                </div>
                            </form> : masterId == 'City' ?
                            <form className='w-100' noValidate onSubmit={formikCity.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>                            
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: "country"})}</label>
                                        <select className="form-select" {...formikCity.getFieldProps('country_id')} onChange={async (e) => {
                                            formikCity.setFieldValue("country_id", e.target.value);
                                            const Response = await getLocalizationState()                                                               
                                            let states = Response.output?.filter((city:any) => e.target.value == city.country_id);
                                            setState(states);
                                        }}>
                                            <option disabled value="">Select</option>
                                            {country.map((data, i) => {
                                                return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select>
                                        {formikCity.touched.country_id && formikCity.errors.country_id && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCity.errors.country_id}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: "state"})}</label>
                                        <select className="form-select" {...formikCity.getFieldProps('state_id')}>
                                            <option disabled value="">Select</option>
                                            {state.map((data, i) => {
                                                return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select>
                                        {formikCity.touched.state_id && formikCity.errors.state_id && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCity.errors.state_id}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikCity.getFieldProps('name')}/> 
                                        </div>
                                        {formikCity.touched.name && formikCity.errors.name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCity.errors.name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                            {intl.formatMessage({id: "cancel"})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit3'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikCity.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
                                            </span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                {intl.formatMessage({id: "please_wait"})}...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}
                                        </button>
                                        </div>
                                </div>
                            </form> : masterId == 'Currency' ?
                            <form className='w-100' noValidate onSubmit={formikCurrency.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikCurrency.getFieldProps('name')}/> 
                                        </div>
                                        {formikCurrency.touched.name && formikCurrency.errors.name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCurrency.errors.name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'symbol'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikCurrency.getFieldProps('symbol')}/> 
                                        </div>
                                        {formikCurrency.touched.symbol && formikCurrency.errors.symbol && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikCurrency.errors.symbol}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                            {intl.formatMessage({id: "cancel"})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit4'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikCurrency.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
                                            </span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                {intl.formatMessage({id: "please_wait"})}...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form> : 
                            <form className='w-100' noValidate onSubmit={formikLocality.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>
                                    <div className="form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: masterId.toLowerCase()})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder={masterId} {...formikLocality.getFieldProps('name')}/> 
                                        </div>
                                        {formikLocality.touched.name && formikLocality.errors.name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikLocality.errors.name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={editCancel}>
                                            {intl.formatMessage({id: "cancel"})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit4'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikLocality.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
                                            </span>}
                                            {loading && (
                                                <span className='indicator-progress' style={{display: 'block'}}>
                                                {intl.formatMessage({id: "please_wait"})}...{' '}
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
            <div className={masterName ? 'd-none d-md-block col-md-6 col-lg-5 col-xl-4 col-xxl-3' : 'col-md-6 col-lg-5 col-xl-4 col-xxl-3'}>
                <div className='card card-flush h_85vh'>
                <div className='card-header pt-7' id='kt_chat_contacts_header'>
                <h3>{intl.formatMessage({id: "localizations"})}</h3>
                </div>
                <div className='card-body pt-2' id='kt_chat_contacts_body'>
                    <div
                    className='scroll-y me-n5 pe-3 h-200px h-lg-auto thistab'
                    data-kt-scroll='true'
                    data-kt-scroll-activate='{default: false, lg: true}'
                    data-kt-scroll-max-height='auto'
                    data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                    data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                    data-kt-scroll-offset='0px'
                    >
                        <ul className="nav nav-pills mb-5 masters_tab d-block" id="pills-tab" role="tablist">                       
                            <li className="nav-item w-100 mb-3" role="presentation" onClick={() => localizationRequest('Country')}>
                                <div className={masterId == 'Country' ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'}>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            C
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {intl.formatMessage({id: "country"})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span>                          
                                    </div>
                                </div>
                            </li>                                                 
                            <li className="nav-item w-100 mb-3" role="presentation" onClick={() => localizationRequest('State')}>
                                <div className={masterId == 'State' ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'}>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            S
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {intl.formatMessage({id: "state"})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span> 
                                    </div>
                                </div>
                            </li>                                                 
                            <li className="nav-item w-100 mb-3" role="presentation" onClick={() => localizationRequest('City')}>
                                <div className={masterId == 'City' ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'}>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            C
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {intl.formatMessage({id: "city"})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span> 
                                    </div>
                                </div>
                            </li>                                                 
                            <li className="nav-item w-100 mb-3" role="presentation" onClick={() => localizationRequest('Currency')}>
                                <div className={masterId == 'Currency' ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'}>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            C
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {intl.formatMessage({id: "currency"})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span> 
                                    </div>
                                </div>
                            </li>                                                 
                            <li className="nav-item w-100 mb-3" role="presentation" onClick={() => localizationRequest('Locality')}>
                                <div className={masterId == 'Locality' ? 'd-flex flex-stack nav-link active activetab cursor-pointer py-1' : 'd-flex flex-stack nav-link active bg-light cursor-pointer py-1'}>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-35px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary fs-4 fw-bolder'>
                                            C
                                            </span>
                                        </div>
                                        <div className='ms-5'>
                                            <p className='fs-6 fw-bolder text-gray-900 mb-0'>
                                            {intl.formatMessage({id: "locality"})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column align-items-end ms-2'>
                                        <span className='text-muted fs-7 mb-1 inverse_text'>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor"></path></svg>
                                        </span> 
                                    </div>
                                </div>
                            </li>                                                 
                        </ul>
                    </div>
                </div>
                </div>
            </div>             
            <div className={masterName ? 'col-md-6 col-lg-7 col-xl-8 col-xxl-9 ps-lg-2 ps-xl-4 ps-lg-2 ps-xl-4' : 'd-none d-md-block col-md-6 col-lg-7 col-xl-8 col-xxl-9 ps-lg-2 ps-xl-4 ps-lg-2 ps-xl-4'}>
                {loading ? 
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: "loading"})}...</span>
                        </div>
                    </div> 
                </div> :
                <div className="card h_85vh">                    
                    <div className="tab-content p-0" id="pills-tabContent">
                        <div className='' id="ContactStatus" role="tabpanel" aria-labelledby="ContactStatus_tab">
                        <div className='card-header' id='kt_chat_messenger_header'>
                            <div className='card-title'>
                                <div className='d-flex flex-column me-3'>
                                <div className='fs-4 fw-bolder text-gray-900 text-hover-primary lh-1'>
                                    <span className='me-3 d-md-none' onClick={() => {
                                        setMasterName("");
                                    }}>
                                        <KTSVG path="/media/icons/duotune/arrows/arr021.svg" className="svg-icon-muted svg-icon-1" />
                                    </span>
                                    {intl.formatMessage({id: masterId.toLowerCase()})}
                                </div>
                                </div>
                            </div>  
                            <div className='card-toolbar'>
                                <span onClick={() => editCancel()} data-bs-toggle='modal' data-bs-target={'#Localization_form'}>
                                    <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted svg-icon-2hx" />
                                </span>
                            </div>                                              
                        </div>
                        <div className='card-body ps-3 overflow-auto shadow-sm p-3 mb-5 bg-body rounded' style={{height:'600px'}}>
                            {masterId == "State" &&
                            <div className="ps-5">
                                <div className="form-group mb-4">
                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                    <div className="input-group">
                                    <select className="form-select btn-sm text-start" onChange={async (e) => {
                                        if(e.target.value) {
                                            let states = state?.filter((state:any) => e.target.value == state.country_id);
                                            setLocalization(states);  
                                        } else {
                                            setLocalization(state);
                                        }                                      
                                    }} >
                                        <option selected value="">Select</option>
                                        {country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                            return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                        )})}
                                    </select> 
                                    </div> 
                                </div>
                            </div>}
                            {masterId == "City" &&
                            <div className='row ps-5'>
                                <div className="col-sm-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                        <div className="input-group">
                                        <select className="form-select btn-sm text-start" onChange={async (e) => {
                                            if(e.target.value) {
                                                let stateeee = states?.filter((state:any) => e.target.value == state.country_id);
                                                setState(stateeee);
                                                setLocalization([]);
                                                (document.getElementById('wlejruievbgy') as HTMLInputElement).value = "";
                                            } else {
                                                setState(states);
                                                setLocalization([]);
                                                (document.getElementById('wlejruievbgy') as HTMLInputElement).value = ""; 
                                            }
                                        }} >
                                            <option selected value="">Select</option>
                                            {country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select> 
                                        </div> 
                                    </div>
                                </div>
                                {state.length > 0 &&
                                <div className="col-sm-6">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                        <div className="input-group">
                                        <select className="form-select btn-sm text-start" id='wlejruievbgy' onChange={async (e) => {
                                            if(e.target.value) {
                                                let states = city?.filter((city:any) => e.target.value == city.state_id);
                                                setLocalization(states);
                                            } else {
                                                setLocalization(city);
                                            }                                          
                                        }} >
                                            <option value="">Select</option>
                                            {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                return(
                                                <option value={data.id} key={i}>{data.name}</option>
                                            )})}
                                        </select>
                                        </div>  
                                    </div>
                                </div>}
                            </div>}
                            <div className=''>
                            {localization.map((Data, i) => {
                            return(
                            <div className='mb-0 lh-1 ms-2 mb-2 d-flex justify-content-between' key={i}>
                                <div className='d-flex align-items-center'>
                                <span className="svg-icon svg-icon-2 svg-icon-grey"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="18" y="13" width="13" height="2" rx="1" transform="rotate(-180 18 13)" fill="currentColor"></rect><path d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z" fill="currentColor"></path></svg></span>
                                <span className='fs-7 fw-bold text-gray-700 ps-2 pe-3'>{Data.name}{masterId == "Currency" ? " ("+Data.symbol+')' : ''}</span>
                                </div>
                                
                                <div>
                                <><button onClick={(e) => editTap(Data)} data-bs-toggle='modal' data-bs-target={'#Localization_form'} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>
                                <a href="#" data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup67845'+Data.id} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a></>
                                </div>
                                    <div className='modal fade' id={'delete_confirm_popup67845'+Data.id} aria-hidden='true'>
                                        <div className='modal-dialog modal-dialog-centered'>
                                            <div className='modal-content'>
                                                <div className='modal-header'>
                                                    <h3>{intl.formatMessage({id: "confirmation"})}</h3>
                                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                                    </div>
                                                </div>
                                                <div className='modal-body py-lg-10 px-lg-10'>
                                                    <p>{intl.formatMessage({id: "are_you_sure_want_to_delete"})}?</p>
                                                    <div className='d-flex align-items-center justify-content-end'>
                                                        <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
                                                            {intl.formatMessage({id: "no"})}
                                                        </button>
                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(Data.id)}>
                                                            {intl.formatMessage({id: "yes"})}
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
                </div>}
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="localAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: "success"})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_added_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="localEdit">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: "success"})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_updated_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="localDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: "success"})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_deleted_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="alreadyExist">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: "warning"})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `${masterId.toLowerCase()}_already_exist`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3 p-0" id="localError">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: "error"})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button"></button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: "something_went_wrong"})}!</div>
                </div>
            </div>
        </div>
    )
}
export {Localization}