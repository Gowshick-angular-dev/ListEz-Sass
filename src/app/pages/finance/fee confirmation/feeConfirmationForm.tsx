import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React,{FC, useEffect, useState} from 'react'
import Moment from 'moment';
import * as Yup from 'yup'
import { Theme, useTheme } from '@mui/material/styles';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { useFormik } from 'formik';
import { saveFeeConfirmation } from '../core/_requests';
import { getTrnsaction, getTrnsactions } from '../../transaction/core/_requests';
import { useIntl } from 'react-intl';

const initialValues = {
    transaction_id: '',
    fee_confirmation_date: '',
    contact_name: '',
    developer_name: '',
    project_name: '',
    brokerage_value: '',
    due_date: '',
    description: '',
    status: '',
    created_by: ''
}

type props = {
    transId?:any,
    dropdowns?:any,
    }

const FeeConfirmationForm: FC<props> = (props) => {
    const intl = useIntl();
    const{ transId, dropdowns } = props

    const theme = useTheme();

    const transactionSaveSchema = Yup.object().shape({
        transaction_id: Yup.string(),       
    })

    const {currentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [transaction, setTrnsaction] = useState({});

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var body ={
                "transaction_id": transId ? transId : values.transaction_id,
                "fee_confirmation_date": values.fee_confirmation_date,
                "contact_name": values.contact_name,
                "developer_name": values.developer_name,
                "project_name": values.project_name,
                "brokerage_value": values.brokerage_value,
                "due_date": values.due_date,
                "description": values.description,
                "transaction_status": values.status
            }
          
            const saveTaskData = await saveFeeConfirmation(body);
            if(saveTaskData.status == 200){
                setLoading(false);
                resetForm();
                document.getElementById('kt_feeconfirmation_form_close')?.click();
                document.getElementById('feeConfirmationReload')?.click();
                var toastEl = document.getElementById('FeeConfirmationAdd');
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

    const transactionDetail =  async (id:any) => {
        formik.setFieldValue('transaction_id', id);
        const Response = await getTrnsaction(id);
        // setTrnsaction(Response.output);

        formik.setFieldValue('contact_name', Response.output?.client_name ?? '');
        formik.setFieldValue('developer_name', Response.output?.developer_fullname ?? '');
        formik.setFieldValue('project_name', Response.output?.project_name ?? '');
        formik.setFieldValue('brokerage_value', Response.output?.brokerage_value ?? '');
    }

    useEffect(() => {
        transId && transactionDetail(transId)
    }, [transId]);

    return(
        <>
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_feeConfirmation_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_fee_confirmation'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_feeconfirmation_form_close' onClick={() => document.getElementById('transIdReset')?.click()}>
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_feeConfirmation_body'>
                <form noValidate onSubmit={formik.handleSubmit}>
                <div className="accordion" id="accordionExample"> 
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'basic_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row">
                                    {!transId &&
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'transaction'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('transaction_id')} onChange={(e) => transactionDetail(e.target.value)}>
                                            <option value=''>Select</option>
                                                {dropdowns.transaction?.map((trans:any,i:any) =>{
                                                    return (
                                                    <option value={trans.id} key={i}>{trans.contact_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fee_confirmation_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('fee_confirmation_date')} className="form-control" placeholder="date"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('contact_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.client_name?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.contact_name ?? '--No Name--'}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('developer_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.developer_name?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.contact_id} key={i}>{task.developer_name ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('project_name')}>
                                            <option value=''>Select</option>
                                                {dropdowns.project?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.property_id} key={i}>{task.name_of_building ?? '--No Name--'}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage_value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formik.getFieldProps('brokerage_value')} className="form-control" placeholder="Brokerage Value..."/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'due_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('due_date')} className="form-control" placeholder="Due Date..."/> 
                                        </div>
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('status')}>
                                            <option value=''>Select</option>
                                                {dropdowns.fee_confirmation_status?.map((task:any,i:any) =>{
                                                    return (
                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'description'})}</label>
                                        <div className="input-group mb-3">
                                            <textarea {...formik.getFieldProps('description')} className="form-control" placeholder="Description..."/> 
                                        </div>
                                    </div>                                                            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                
                <div className='d-flex justify-content-center'>           
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
        </>
    )
}

export {FeeConfirmationForm}