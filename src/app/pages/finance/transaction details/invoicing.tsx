import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Moment from 'moment';
import { useAuth } from '../../../modules/auth';
import { getTrnsaction, updateTrnsactionsID } from '../../transaction/core/_requests';
import { Toast } from 'bootstrap';
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
}

const InvoicingForm: FC<props> = (props) => {
    const intl = useIntl();
    const {tId} = props
    const {currentUser, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [trnsaction, setTrnsaction] = useState<any[]>([]);
    
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

        formik.setFieldValue('raised', Response.output?.raised ?? '');
        formik.setFieldValue('pending', Response.output?.pending ?? '');
        formik.setFieldValue('payment_status', Response.output?.payment_status ?? '');
        formik.setFieldValue('amount_received', Response.output?.amount_received ?? '');
        formik.setFieldValue('receiving_date', Moment(Response.output?.receiving_date).format('YYYY-MM-DD') == "Invalid date" ? '' : Moment(Response.output?.receiving_date).format('YYYY-MM-DD'));
        formik.setFieldValue('pending_brokerage', Response.output?.pending_brokerage ?? '');
        formik.setFieldValue('s_gst_2', Response.output?.s_gst_2 ?? '');
        formik.setFieldValue('c_gst_3', Response.output?.c_gst_3 ?? '');
        formik.setFieldValue('i_gst_4', Response.output?.i_gst_4 ?? '');
        formik.setFieldValue('gst_amount2', Response.output?.gst_amount2 ?? '');
        formik.setFieldValue('gross_brokerage_value2', Response.output?.gross_brokerage_value2 ?? '');
        formik.setFieldValue('tds_reducted_by_builder3', Response.output?.tds_reducted_by_builder3 ?? '');
        formik.setFieldValue('tds_amount2', Response.output?.tds_amount2 ?? '');
        formik.setFieldValue('after_tds_brokearge5', Response.output?.after_tds_brokearge5 ?? '');
        formik.setFieldValue('pending_receivable_amount', Response.output?.pending_receivable_amount ?? '');

        setLoading(false)
    }

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true);
          try {      
            var userId = currentUser?.id;
            
            var body = {
                "raised": values.raised,
                "pending": values.pending,
                "payment_status": values.payment_status,
                "amount_received": values.amount_received,
                "receiving_date": values.receiving_date == "Invalid date" ? '' : values.receiving_date,
                "pending_brokerage": values.pending_brokerage,
                "s_gst_2": values.s_gst_2,
                "c_gst_3": values.c_gst_3,
                "i_gst_4": values.i_gst_4,
                "gst_amount2": values.gst_amount2,
                "gross_brokerage_value2": values.gross_brokerage_value2,
                "tds_reducted_by_builder3": values.tds_reducted_by_builder3,
                "tds_amount2": values.tds_amount2,
                "after_tds_brokearge5": values.after_tds_brokearge5,
                "pending_receivable_amount": values.pending_receivable_amount,
                "created_by":userId
                }
          
            const saveTaskData = await updateTrnsactionsID(tId, body);
    
            if(saveTaskData != null){
                setLoading(false);
                document.getElementById('kt_invoicing_details_close')?.click();
                var toastEl = document.getElementById('myToastUpdateTransaction');
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

    useEffect(() => {
        tId && transactionDetail();
    }, [tId]);    

    return(
        <>        
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_proforma_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'invoicing_details'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_invoicing_details_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_proforma_body'>
                <form noValidate onSubmit={formik.handleSubmit} className='p-6' >
                    <div className='row'>                                    
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'raised'})} </label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('raised')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending'})} </label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('pending')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'payment_status'})}</label>
                            <div className="input-group mb-3">
                                <input type="text" {...formik.getFieldProps('payment_status')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount_received'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('amount_received')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'receiving_date'})}</label>
                            <div className="input-group mb-3">
                                <input type="date" {...formik.getFieldProps('receiving_date')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_brokerage'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('pending_brokerage')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">S GST %</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('s_gst_2')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">C GST %</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('c_gst_3')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">I GST %</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('i_gst_4')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">GST {intl.formatMessage({id: 'amount'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('gst_amount2')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gross_brokerage_value'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('gross_brokerage_value2')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">TDS % {intl.formatMessage({id: 'deducted_by_builder'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('tds_reducted_by_builder3')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">TDS {intl.formatMessage({id: 'amount'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('tds_amount2')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'after_TDS_brokearge'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('after_tds_brokearge5')} className="form-control"/> 
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mb-3">
                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_receivable_amount'})}</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" {...formik.getFieldProps('pending_receivable_amount')} className="form-control"/> 
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

export {InvoicingForm}