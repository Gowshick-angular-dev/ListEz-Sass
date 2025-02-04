import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import FontPicker from "font-picker-react";
import { useFormik } from 'formik';
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { updateOrganizationTheme } from './request';

const initialValues = {
    module_id: "",
    font_family: "",
    primary: "",
    secondary: "",
    tertiary: "",
}

const ThemeBuilder: FC = () => {
    const userData:any = localStorage.getItem('themeData')
    const djfghsfj = JSON.parse(userData);
    const intl = useIntl();
    const {currentUser, setCurrentUser, logout} = useAuth();
    const [activeFontFamily, setFont] = useState<any>(djfghsfj?.font);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const themes:any = localStorage.getItem('themeData')
        const djfghsfj = JSON.parse(themes);
        if(djfghsfj) {
            // setFont(djfghsfj.font?.toString())
            document.documentElement.style.setProperty('--terlogo-color', `${djfghsfj.tertiary_color}`);
            document.documentElement.style.setProperty('--seclogo-color', `${djfghsfj.secondary_color}`);
            document.documentElement.style.setProperty('--logo-color', `${djfghsfj.primary_color}`);
            formik.setFieldValue('primary', djfghsfj?.primary_color);
            formik.setFieldValue('secondary', djfghsfj?.secondary_color);
            formik.setFieldValue('tertiary', djfghsfj?.tertiary_color);
        } 
    }, []);

    const formik = useFormik({
        initialValues,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            setLoading(true);
            try {
                var formData = new FormData();
                formData.append('font_family', activeFontFamily);
                formData.append('primary_color', values.primary);
                formData.append('secondary_color', values.secondary);
                formData.append('tertiary_color', values.tertiary);

                const updatethemeData = await updateOrganizationTheme(formData);

                console.log(updatethemeData);
                if (updatethemeData != null) {
                    setLoading(false);
                    const kjergiwer:any = {font: activeFontFamily, primary_color: values.primary, secondary_color: values.secondary, tertiary_color: values.tertiary}
                    localStorage.setItem('themeData', JSON.stringify(kjergiwer)) 
                    var toastEl = document.getElementById('orgThemeUpdate');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                    // resetForm();
                }

            } catch (error) {
                // console.error(error)
                setStatus('The registration details is incorrect')
                setSubmitting(false)
                setLoading(false)
            }
        }
    })
    
    return(
        <div>
            <form noValidate onSubmit={formik.handleSubmit}>
                <div className="">
                    <div className="card-group">
                        <div className="w-100 w-md-75 w-xl-50 mx-auto">
                            <div className="card h-100 bs_1 mx-2 mb-2">
                                <div className="card-header d-flex align-items-center">
                                    <h3>{intl.formatMessage({id: 'theme_setup'})}</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'font_family'})}</label>
                                        <div className="font-picker" >
                                            <FontPicker 
                                            apiKey="AIzaSyDM92xbiSLIpKOBc9ckeWpcK5Xm_bBAxWE"
                                            limit={1000}
                                            activeFontFamily={activeFontFamily}
                                            onChange={(nextFont) =>{
                                                setFont(nextFont.family);
                                                }} 
                                            />
                                            {/* <FontPickerComponent/> */}
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="primary" className="form-label">{intl.formatMessage({id: 'primary'})}</label>
                                        <input type="color" id="primary" {...formik.getFieldProps('primary')} onChange={(e) => {
                                            document.documentElement.style.setProperty('--logo-color', `${e.target.value}`);
                                            formik.setFieldValue('primary', e.target.value);
                                        }}/>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="secondary" className="form-label">{intl.formatMessage({id: 'secondary'})}</label>
                                        <input type="color" id="secondary" {...formik.getFieldProps('secondary')} onChange={(e) => {
                                            document.documentElement.style.setProperty('--seclogo-color', `${e.target.value}`);
                                            formik.setFieldValue('secondary', e.target.value);                                            
                                        }}/>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="tertiary" className="form-label">{intl.formatMessage({id: 'tertiary'})}</label>
                                        <input type="color" id="tertiary" {...formik.getFieldProps('tertiary')} onChange={(e) => {
                                            document.documentElement.style.setProperty('--terlogo-color', `${e.target.value}`);
                                            formik.setFieldValue('tertiary', e.target.value);                                            
                                        }}/>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
                                    <button type="button" className="btn btn_secondary me-2" onClick={async() => {
                                        document.documentElement.style.setProperty('--terlogo-color', "#ffffff");
                                        document.documentElement.style.setProperty('--seclogo-color', "#444444");
                                        document.documentElement.style.setProperty('--logo-color', "#ff6700");
                                        formik.setFieldValue('tertiary', "#ffffff"); 
                                        formik.setFieldValue('secondary', "#444444");  
                                        formik.setFieldValue('primary', "#ff6700");

                                        var formData = new FormData();
                                        formData.append('font_family', "Open Sans");
                                        formData.append('primary_color', "#ff6700");
                                        formData.append('secondary_color', "#444444");
                                        formData.append('tertiary_color', "#ffffff");

                                        const updatethemeData = await updateOrganizationTheme(formData);
                                        if(updatethemeData.status == 200) {
                                            const kjergiwer:any = {font: "Open Sans", primary_color: "#ff6700", secondary_color: "#444444", tertiary_color: "#ffffff"}
                                            localStorage.setItem('themeData', JSON.stringify(kjergiwer)) 
                                            var toastEl = document.getElementById('orgThemeReset');
                                            const bsToast = new Toast(toastEl!);
                                            bsToast.show();
                                        }}}>{intl.formatMessage({id: 'reset'})}</button>
                                    <button
                                        type='submit'
                                        id='kt_add_org_submit'
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
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 d-none">
                            <div className="card h-100 bs_1 mx-2 mb-2">
                                <div className="card-header d-flex align-items-center">
                                    <h3>{intl.formatMessage({id: 'module_setting'})}</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="contactColor" className="form-label">{intl.formatMessage({id: 'contact'})}:</label>
                                        <input type="color" id="contactColor" name="contactColor" defaultValue="#ff6700"/>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="leadColor" className="form-label">{intl.formatMessage({id: 'lead'})}</label>
                                        <input type="color" id="leadColor" name="leadColor" defaultValue="#e6e6e6"/>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="projectColor" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                        <input type="color" id="projectColor" name="projectColor" defaultValue="#f5f8fa"/>
                                    </div>
                                    <div className="form-group d-flex flex-column mb-4">
                                        <label htmlFor="taskColor" className="form-label">{intl.formatMessage({id: 'task'})}</label>
                                        <input type="color" id="taskColor" name="taskColor" defaultValue="#f6f6f6"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="orgThemeUpdate">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'theme_updated_successfully'})}!
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="orgThemeReset">
                <div className="toast-header">
                        <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                        <button aria-label="Close" className="btn-close" 
                                data-bs-dismiss="toast" type="button">
                        </button>
                </div>
                <div className="toast-body">
                    {intl.formatMessage({id: 'theme_reset_successfully'})}!
                </div>
            </div>
        </div>
    )
}

export {ThemeBuilder}
