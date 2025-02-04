import React,{FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Toast } from 'bootstrap'
import { deleteSubscriptions, getSubscriptions, saveSubscriptions, updateSubscriptions, updateSubscriptionStatus } from './request'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { SubscriptionsToolbar } from './subscriptionToolbar'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useAuth } from '../../../modules/auth'
import StripePay from './stripePay'
import MyPaymentForm from './stripePay'
import MaterialTable from 'material-table'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef } from 'react';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const initialValues = {
    "subscription_name": "",
    "amount": "",
    "no_of_days": "",
    "subscription_id": "",
    "paid_amount": "",
    "start_date": "",
    "mode_of_payment": "",
    "transaction_id": "",
    "transaction_status": "",
    "transaction_time": "",
    "org_id": "",
}

const Subscriptions = () => {
    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const roleId = currentUser?.id;
    const [subscription, setSubscription] = useState([]);
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [editId, setEditId] = useState('');
    const [pageHeight, setPageHeight] = useState('');

    const setHeight = () => {
        let heigh ;
        if(window.innerHeight > 720) {
          heigh = '650px'
        } else {
          heigh = '500px'
        }
        setPageHeight(heigh)
      }
  
      useEffect(() => {
          setHeight()
        }, [window.innerHeight]);

    const subscriptionSchema = Yup.object().shape({
        subscription_name: Yup.string().required(`Subscription name is required`),
        amount: Yup.string().max(20, "Max 20 characters allowed").required(`Amount is required`),
        no_of_days: Yup.string().matches(/^[0-9]+$/, "Special Characters Not Allowed").required(`No. of days is required`)
    })

    const subscriptionsColoumns = [
        { title: "Sl.No", render: rowData => subscription?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { title: `${intl.formatMessage({id: 'subscription_name'})}`, field: 'subscription_name' },
        { title: `${intl.formatMessage({id: 'amount'})}`, field: 'amount', render: rowData => rowData.amount?.slice(0, -2) },
        { title: `${intl.formatMessage({id: 'validity'})}`, field: 'no_of_days'},
        // { title: `${intl.formatMessage({id: 'status'})}`, field: 'status', render: rowData => <span className={rowData.status == 1 ? "bg-success rounded px-3 py-1" : "bg-danger rounded px-3 py-1"}>{rowData.status == 1 ? "Active" : "Inactive"}</span> },
        { title: `${intl.formatMessage({id: 'actions'})}`, field: '', render: rowData => <div className='d-flex'>
        <button data-bs-toggle='modal' data-bs-target='#subscription_form' onClick={() => editTap(rowData, rowData.id)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>

        <a href="#" data-bs-toggle='modal' onClick={() => setEditId(rowData.id)}
        data-bs-target={'#delete_confirm_popup453453453453534534534'} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>

        <div className="form-check form-switch d-flex align-items-center ps-2" title='language on/off'>
            <input className="form-check-input ms-1" type="checkbox" role="switch" id="flexSwitchCheckDefault" defaultChecked={rowData.status == 1 ? true : false} onChange={async(e) => {
                let body = {
                    "status": e.target.checked ? 1 : 2
                }
                const response = await updateSubscriptionStatus(rowData.id, body);
            }} />
        </div>        
        </div> },
      ];

    const subscriptionRequest =  async (loc) => {
        setLoading(true)
        const Response = await getSubscriptions()
        setSubscription(Response.output);
        setSubscriptionList(Response.output);
        setLoading(false)
    }

    useEffect(() => {
        if(roleId == 1) {
        subscriptionRequest('Subscription');
        }
    }, [roleId]);

    const formikSubscription = useFormik({
        initialValues,
        validationSchema: subscriptionSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {    
            const body = {
                "subscription_name": values.subscription_name,
                "amount": values.amount,
                "no_of_days": values.no_of_days
            }        
            if(!editClicked){                    
                    const saveData = await saveSubscriptions(body);
                    resetForm();
                    setSubscription(saveData.output);
                    document.getElementById('subscriptionForm')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl);
                    bsToast.show();
            } else {
                const updateData = await updateSubscriptions(editId, body);
                setSubscription(updateData.output);
                setEditClicked(false);
                setEditId('');
                resetForm();
                document.getElementById('subscriptionForm')?.click();
                setLoading(false)
                var toastEl = document.getElementById('localEdit');
                const bsToast = new Toast(toastEl);
                bsToast.show();
            }
          }
        catch (error) {
            var toastEl = document.getElementById('localError');
            const bsToast = new Toast(toastEl);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const editTap = (value, id) => {
        setEditClicked(true);
        setEditId(id);
        formikSubscription.setFieldValue('subscription_name', value.subscription_name);
        formikSubscription.setFieldValue('amount', value.amount?.slice(0, -5));
        formikSubscription.setFieldValue('no_of_days', value.no_of_days);
    }

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        formikSubscription.resetForm();
    }

    const onDelete = async (id) => {
        console.log(id);
        const response = await deleteSubscriptions(id);
        setSubscription(response.output);
        setEditId('');
        var toastEl = document.getElementById('localDelete');
        const bsToast = new Toast(toastEl);
        bsToast.show();
    } 

    return(<>
        <SubscriptionsToolbar mod={"subscription"}/>
        {/* <StripePay/>
        <Payment/> */}
        
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>             
            <div className='modal fade' id={'subscription_form'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'subscription'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' id='subscriptionForm' data-bs-dismiss='modal' onClick={() => editCancel()}>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form className='w-100' noValidate onSubmit={formikSubscription.handleSubmit}>
                                <div className='row'>
                                    <div className="col-12 form-group mb-4 w-100">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'subscription_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="subscription name" {...formikSubscription.getFieldProps('subscription_name')}/> 
                                        </div>
                                        {formikSubscription.touched.subscription_name && formikSubscription.errors.subscription_name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.subscription_name}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                             
                                    <div className="col-md-6 form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Amount" {...formikSubscription.getFieldProps('amount')} onChange={(e) => formikSubscription.setFieldValue("amount", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={10}/> 
                                        </div>
                                        {formikSubscription.touched.amount && formikSubscription.errors.amount && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.amount}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="col-md-6 form-group mb-4">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'no_of_days'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="No. of days" {...formikSubscription.getFieldProps('no_of_days')} onChange={(e) => formikSubscription.setFieldValue("no_of_days", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={5}/> 
                                        </div>
                                        {formikSubscription.touched.no_of_days && formikSubscription.errors.no_of_days && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formikSubscription.errors.no_of_days}</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>                              
                                    <div className="d-flex align-items-center">
                                        {editClicked &&
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' onClick={() => editCancel()}>
                                            {intl.formatMessage({id: 'cancel'})}
                                        </button>}
                                        <button
                                            type='submit'
                                            id='kt_sign_up_submit1'
                                            className='btn btn-sm btn_primary text-primary mt-3'
                                            disabled={formikSubscription.isSubmitting}
                                            >
                                            {!loading && <span className='indicator-label'>{editClicked ? `${intl.formatMessage({id: "update"})}` : `${intl.formatMessage({id: "create"})}` }
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
                            </form>
                        </div>
                    </div>
                </div>
            </div> 
            <div className='modal fade' id={'delete_confirm_popup453453453453534534534'} aria-hidden='true'>
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
                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(editId)}>
                                {intl.formatMessage({id: 'yes'})}
                            </button>
                        </div>
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
                <div className="card bs_2 mt-0 mt-md-5">
                    <div className='card-body sus_height p-0 br_15'>
                        <div style={{ maxWidth: '100%' }} >
                            {subscription.length > 0 ? 
                                <MaterialTable className="p-3"
                                enableRowNumbers={true}
                                columns={subscriptionsColoumns}
                                icons={tableIcons}
                                data={subscription}
                                title="Subscriptions Plans"
                                options={{
                                    selection: true,
                                    pageSize: 25,
                                    pageSizeOptions: [25, 50, 100],
                                    actionsColumnIndex: -1,
                                    maxBodyHeight: pageHeight,
                                    // exportButton: true,
                                    columnsButton: true,
                                    headerStyle: {
                                        backgroundColor: '#ececec',
                                        color: '#000'
                                    },
                                    rowStyle: {
                                        backgroundColor: '#fff',
                                        fontSize: '12px'
                                    }
                                }}
                                />
                                : 
                                <div className='w-100 d-flex justify-content-center'>
                                    <div className=''>
                                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                                        <h4>Nothing To Show!!!</h4>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>}
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="localAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `subscription_added_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="localEdit">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `subscription_updated_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="localDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `subscription_deleted_successfully`})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="localError">
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
        
        </>)
}
export {Subscriptions}