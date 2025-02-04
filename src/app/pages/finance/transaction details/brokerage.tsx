import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Theme, useTheme } from '@mui/material/styles';
import { useAuth } from '../../../modules/auth';
import { Toast } from 'bootstrap';
import { getTrnsaction, updateTrnsactionsBD } from '../../transaction/core/_requests';
import { useIntl } from 'react-intl';

const initialValues = {
    lead_creation_date: '',
    booking_date: '',
    city: '',
    lead_source: '',
    team_leader: '',
    closed_by: '',
    shared_with: '',
    developer_name: '',
    project_name: '',
    client_name: '',
    contact_number: '',
    email_id: '',
    discount_value: '',
    block_no: '',
    unit_no: '',
    floor_no: '',
    bhk_type: '',
    sizes: '',
    basic_price: '',
    frc: '',
    plc: '',
    car_parking_cost: '',
    agreement_value: '',
    pan: '',
    dob: '',
    doa: '',
    correspondence_address: '',
    Brokerage_percentage: '',
    brokerage_value: '',
    discount_amount: '',
    revenue: '',
    aop_per: '',
    discount_paid_status: '',
    tds_value: '',
    s_gst_per: '',
    c_gst_per: '',
    i_gst_per: '',
    gst_amount: '',
    gross_brokerage_value: '',
    tds_per_ded_builder: '',
    tds_amount: '',
    after_tds_brokerage: '',
    actual_receivable_amount: '',
    incentive_per: '',
    incentive_without_tds: '',
    tds_per: '',
    net_incentive_earned: '',
    invoice_status: '',
    raised: '',
    pending: '',
    payment_status: '',
    amount_received: '',
    receiving_date: '',
    pending_brokerage: '',
    s_gst_2: '',
    c_gst_3: '',
    i_gst_4: '',
    gst_amount2: '',
    gross_brokerage_value2: '',
    tds_reducted_by_builder3: '',
    tds_amount2: '',
    after_tds_brokearge5: '',
    pending_receivable_amount: '',
    created_by: '',
}

type props = {
    tId:any,
    dropdowns:any,
}

const BrokerageForm: FC<props> = (props) => {
    const intl = useIntl();
    const {tId, dropdowns} = props
    
    const {currentUser, logout} = useAuth();
    const[loading, setLoading] = useState(false);
    const[trnsaction, setTrnsaction] = useState<any[]>([]);

    const transactionSaveSchema = Yup.object().shape({
        date: Yup.string(),
        lead_creation_date: Yup.string(),
        booking_date: Yup.string(),
        city: Yup.string(),
        lead_source: Yup.string(),
        team_leader: Yup.string(),
        closed_by: Yup.string(),
        shared_with: Yup.string(),
        developer_name: Yup.string(),
        project_name: Yup.string(),
        client_name: Yup.string(),
        contact_number: Yup.string(),
        email_id: Yup.string(),
        discount_value: Yup.string(),
        block_no: Yup.string(),
        unit_no: Yup.string(),
        floor_no: Yup.string(),
        bhk_type: Yup.string(),
        sizes: Yup.string(),
        basic_price: Yup.string(),
        frc: Yup.string(),
        plc: Yup.string(),
        car_parking_cost: Yup.string(),
        agreement_value: Yup.string(),
        pan: Yup.string(),
        dob: Yup.string(),
        doa: Yup.string(),
        correspondence_address: Yup.string(),
        Brokerage_percentage: Yup.string(),
        Brokerage_value: Yup.string(),
        discount_amount: Yup.string(),
        revenue: Yup.string(),
        aop_per: Yup.string(),
        discount_paid_status: Yup.string(),
        tds_value: Yup.string(),
        s_gst_per: Yup.string(),
        c_gst_per: Yup.string(),
        i_gst_per: Yup.string(),
        gst_amount: Yup.string(),
        gross_brokerage_value: Yup.string(),
        tds_per_ded_builder: Yup.string(),
        tds_amount: Yup.string(),
        after_tds_brokerage: Yup.string(),
        actual_receivable_amount: Yup.string(),
        incentive_per: Yup.string(),
        incentive_without_tds: Yup.string(),
        tds_per: Yup.string(),
        net_incentive_earned: Yup.string(),
        invoice_status: Yup.string(),
        raised: Yup.string(),
        pending: Yup.string(),
        payment_status: Yup.string(),
        amount_received: Yup.string(),
        receiving_date: Yup.string(),
        pending_brokerage: Yup.string(),
        s_gst_2: Yup.string(),
        c_gst_3: Yup.string(),
        i_gst_4: Yup.string(),
        gst_amount2: Yup.string(),
        gross_brokerage_value2: Yup.string(),
        tds_reducted_by_builder3: Yup.string(),
        tds_amount2: Yup.string(),
        after_tds_brokearge5: Yup.string(),
        pending_receivable_amount: Yup.string(),
    }) 
    
    const transactionDetail =  async () => {
        setLoading(true)
        const Response = await getTrnsaction(tId)
        setTrnsaction(Response.output);
        
        formik.setFieldValue('s_gst_per', Response.output?.s_gst_per ?? '');
        formik.setFieldValue('c_gst_per', Response.output?.c_gst_per ?? '');
        formik.setFieldValue('i_gst_per', Response.output?.i_gst_per ?? '');
        formik.setFieldValue('gst_amount', parseInt(Response.output?.gst_amount) == 0 ? '' : parseInt(Response.output?.gst_amount));
        formik.setFieldValue('gross_brokerage_value', parseInt(Response.output?.gross_brokerage_value) == 0 ? '' : parseInt(Response.output?.gross_brokerage_value));
        formik.setFieldValue('tds_per_ded_builder', Response.output?.tds_per_ded_builder ?? '');
        formik.setFieldValue('tds_amount', parseInt(Response.output?.tds_amount) == 0 ? '' : parseInt(Response.output?.tds_amount));
        formik.setFieldValue('after_tds_brokerage', parseInt(Response.output?.after_tds_brokerage) == 0 ? '' : parseInt(Response.output?.after_tds_brokerage));
        formik.setFieldValue('actual_receivable_amount', parseInt(Response.output?.actual_receivable_amount) == 0 ? '' : parseInt(Response.output?.actual_receivable_amount));
        formik.setFieldValue('incentive_per', Response.output?.incentive_per ?? '');
        formik.setFieldValue('incentive_without_tds', parseInt(Response.output?.incentive_without_tds) == 0 ? '' : parseInt(Response.output?.incentive_without_tds));
        formik.setFieldValue('tds_per', Response.output?.tds_per ?? '');
        formik.setFieldValue('net_incentive_earned', parseInt(Response.output?.net_incentive_earned) == 0 ? '' : parseInt(Response.output?.net_incentive_earned));
        formik.setFieldValue('invoice_status', Response.output?.invoice_status ?? '');

        setLoading(false)
    }

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {      

            var userId = currentUser?.id;
            var roleId = currentUser?.designation;
            
            var body = {
                "s_gst_per": values.s_gst_per,
                "c_gst_per": values.c_gst_per,
                "i_gst_per": values.i_gst_per,
                "gst_amount": values.gst_amount,
                "gross_brokerage_value": values.gross_brokerage_value,
                "tds_per_ded_builder": values.tds_per_ded_builder,
                "tds_amount": values.tds_amount,
                "after_tds_brokerage": values.after_tds_brokerage,
                "actual_receivable_amount": values.actual_receivable_amount,
                "incentive_per": values.incentive_per,
                "incentive_without_tds": values.incentive_without_tds,
                "tds_per": values.tds_per,
                "net_incentive_earned": values.net_incentive_earned,
                "invoice_status": values.invoice_status,
                "created_by":userId
                }
          
            const saveTaskData = await updateTrnsactionsBD(tId, body);
    
            
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_brokerage_details_close')?.click();
                var toastEl = document.getElementById('myToastUpdateTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // resetForm();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    useEffect(() => {
        tId && transactionDetail();
    }, [tId]);

    return(
        <>        
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'brokerage_details'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_brokerage_details_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_proforma_body'>
            <form noValidate onSubmit={formik.handleSubmit} className='p-6' >
                <div className='row'>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">S GST %</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('s_gst_per')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">C GST %</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('c_gst_per')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">I GST %</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('i_gst_per')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">GST {intl.formatMessage({id: 'amount'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('gst_amount')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gross_brokerage_value'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('gross_brokerage_value')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">TDS % {intl.formatMessage({id: 'deducted_by_builder'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('tds_per_ded_builder')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">TDS {intl.formatMessage({id: 'amount'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('tds_amount')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'after_TDS_brokearge'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('after_tds_brokerage')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'actual_receivable_amount'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('actual_receivable_amount')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive'})}%</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('incentive_per')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive_without'})} TDS</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('incentive_without_tds')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">TDS%</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('tds_per')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'net_incentive_earned'})}</label>
                        <div className="input-group mb-3">
                            <input type="text" {...formik.getFieldProps('net_incentive_earned')} className="form-control"/> 
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_status'})}</label>
                        <div className="input-group mb-3">
                            <select className="form-control w-100" {...formik.getFieldProps('invoice_status')}>
                            <option value=''>Select</option>
                                {dropdowns.invoice_status?.map((trans:any,i:any) =>{
                                    return (
                                    <option value={trans.id} key={i}>{trans.option_value}</option>
                                )})}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mb-6'>           
                    <button
                    type='submit'
                    
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
            </form>
            </div>
        </div>
        </>
    )
}

export {BrokerageForm}