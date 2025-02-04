import React,{FC, useEffect, useState} from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Toast } from 'bootstrap';
import { useIntl } from 'react-intl';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { getAdminUsers } from './core/_requests';
import { useAuth } from '../../modules/auth';
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

const AdminUsers = () => {
    const {currentUser, logout} = useAuth();
    var roleId = currentUser?.id;
    const intl = useIntl();
    const [users, setusers] = useState([]);
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

    const columnsResidential = [
        { title: "Sl.No", render: rowData => users.findIndex(item => item === rowData) + 1, field: '' },
        { title: `${intl.formatMessage({id: 'email'})}`, field: 'email' },
    ];

    const customerSubSchema = Yup.object().shape({
        subscription_id: Yup.string().required(`Subscription is required`),
        paid_amount: Yup.string().max(9, "Max 9 characters allowed").required(`Paid amount is required`),
        start_date: Yup.string().required(`Start date is required`),
        no_of_days: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed").required(`No. of days is required`),
        mode_of_payment: Yup.string().required(`Mode of payment is required`),
        transaction_id: Yup.string().required(`Transaction is required`),
        transaction_status: Yup.string().required(`Transaction status is required`),
        transaction_time: Yup.string().required(`Transaction time is required`),
        org_id: Yup.string().required(`Organization time is required`),
    })

    const adminUsersList = async () => {
        setLoading(true);
        const response = await getAdminUsers()
        setusers(response.output);
        setLoading(false);
    }

    useEffect(() => {
        if(roleId == 1) {
            adminUsersList();
        }
    }, [roleId]);

    const formikCustSubscription = useFormik({
        initialValues,
        validationSchema: customerSubSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {        
            if(!editClicked){
                    resetForm();
                    document.getElementById('customerSubscriptionForm')?.click();
                    setLoading(false);
                    var toastEl = document.getElementById('localAdd');
                    const bsToast = new Toast(toastEl);
                    bsToast.show();
            } else {
                setEditClicked(false);
                setEditId('');
                resetForm();
                document.getElementById('customerSubscriptionForm')?.click();
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

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        formikCustSubscription.resetForm();
    }

    const onDelete = async (id) => {
        var toastEl = document.getElementById('localDelete');
        const bsToast = new Toast(toastEl);
        bsToast.show(); 
    } 

    return(
        <>
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>       
            <div className='modal fade' id={'admin_users_form'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'users'})}</h3>
                            <div onClick={() => editCancel()} className='btn btn-sm btn-icon btn-active-color-primary' id='customerSubscriptionForm' data-bs-dismiss='modal'>
                                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form className='w-100' noValidate onSubmit={formikCustSubscription.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>
                                    <div className='row'>
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
                                            disabled={formikCustSubscription.isSubmitting}
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
            <div className='modal fade' id={'delete_confirm_popup_admin_users'} aria-hidden='true'>
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
                        {users.length > 0 ? 
                        <MaterialTable className="p-3"
                        enableRowNumbers={true}
                        columns={columnsResidential}
                        icons={tableIcons}
                        data={users}
                        title="Users"
                        options={{
                            selection: true,
                            pageSize: 25,
                            pageSizeOptions: [25, 50, 100, 500],
                            actionsColumnIndex: -1,
                            maxBodyHeight: pageHeight,
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
                                <h4>{intl.formatMessage({id: 'nothing_to_how'})}!!!</h4>
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
                    <div>{intl.formatMessage({id: `client_subscription added_successfully`})}!</div>
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
                    <div>{intl.formatMessage({id: `client_subscription updated_successfully`})}!</div>
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
                    <div>{intl.formatMessage({id: `client_subscription deleted_successfully`})}!</div>
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
export {AdminUsers}