import React,{FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Toast } from 'bootstrap'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getTicketList } from './core/_requests'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useAuth } from '../../modules/auth'
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
    "ticket_name": "",
    "amount": "",
    "no_of_days": "",
    "ticket_id": "",
    "paid_amount": "",
    "start_date": "",
    "mode_of_payment": "",
    "transaction_id": "",
    "transaction_status": "",
    "transaction_time": "",
    "org_id": "",
}

const SupportTickets = () => {
    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const roleId = currentUser?.id;
    const [ticket, setTicket] = useState([]);
    const [ticketList, setTicketList] = useState([]);
    const [dropdowns, setDropdowns] = useState({});
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

    const customerSubSchema = Yup.object().shape({
        ticket_id: Yup.string().required(`Ticket is required`),
        paid_amount: Yup.string().max(9, "Max 9 characters allowed").required(`Paid amount is required`),
        start_date: Yup.string().required(`Start date is required`),
        no_of_days: Yup.string().matches(/^[0-9]+$/, "Special Characters Not Allowed").required(`No. of days is required`),
        mode_of_payment: Yup.string().required(`Mode of payment is required`),
        transaction_id: Yup.string().required(`Transaction is required`),
        transaction_status: Yup.string().required(`Transaction status is required`),
        transaction_time: Yup.string().required(`Transaction time is required`),
        org_id: Yup.string().required(`Organization time is required`),
    })

    const ticketsColoumns = [
        { title: "Sl.No", render: rowData => ticket?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { title: `${intl.formatMessage({id: 'title'})}`, field: 'title' },
        { title: `${intl.formatMessage({id: 'organization'})}`, field: 'org_name', render: rowData => rowData.org_name?.organization_name},
        { title: `${intl.formatMessage({id: 'priority'})}`, field: 'priority_status', render: rowData => <span className={rowData.priority_status?.option_value == "low" ? "bg-success rounded px-3 py-1" : rowData.priority_status?.option_value == "High" ? "bg-danger rounded px-3 py-1" : "bg-warning rounded px-3 py-1"}>{rowData.priority_status?.option_value}</span>},
        { title: `${intl.formatMessage({id: 'ticket'})}`, field: 'ticket', render: rowData => rowData.ticket?.option_value},
        { title: `${intl.formatMessage({id: 'actions'})}`, field: '', render: rowData => <>
        <button data-bs-toggle='modal' data-bs-target='#support_ticket_form' onClick={() => editTap(rowData, rowData.id)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>
        {/* <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
            <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" aria-label="Default select example" onChange={(e) => {

            }}>
                <option >Low</option>
                <option >Mid</option>
                <option >High</option>
                <option >Very High</option>
            </select>
        </div>         */}
        </>},
      ];

    const ticketRequest =  async () => {
        setLoading(true)
        const Response = await getTicketList()
        setTicket(Response.output);
        setLoading(false)
    }

    // const ticketDropdowns = async () => {
    //     const response = await getCustomerTicketDropdown()
    //     setDropdowns(response.output);
    // }

    useEffect(() => {
        if(roleId == 1) {
            ticketRequest();
        }
    }, [roleId]);

    const formikCustTicket = useFormik({
        initialValues,
        validationSchema: customerSubSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            const body = {
                "ticket_id": values.ticket_id,
                "paid_amount": values.paid_amount,
                "start_date": values.start_date,
                "no_of_days": values.no_of_days,
                "mode_of_payment": values.mode_of_payment,
                "transaction_id": values.transaction_id,
                "transaction_status": values.transaction_status,
                "transaction_time": values.transaction_time,
                "org_id": values.org_id
            }         
            if(!editClicked){                    
                    // const saveData = await saveCustomerTickets(body);
                    // resetForm();
                    // setTicket(saveData.output);
                    // document.getElementById('customerTicketForm')?.click();
                    // setLoading(false);
                    // var toastEl = document.getElementById('localAdd');
                    // const bsToast = new Toast(toastEl!);
                    // bsToast.show();
            } else {
                // const updateData = await updateCustomerTickets(editId, body);
                // setTicket(updateData.output);
                // setEditClicked(false);
                // setEditId('');
                // resetForm();
                // document.getElementById('customerTicketForm')?.click();
                // setLoading(false)
                // var toastEl = document.getElementById('localEdit');
                // const bsToast = new Toast(toastEl!);
                // bsToast.show();
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
        formikCustTicket.setFieldValue('ticket_id', value.ticket_id);
        formikCustTicket.setFieldValue('paid_amount', value.paid_amount);
        formikCustTicket.setFieldValue('start_date', moment(value.start_date).format('YYYY-MM-DD'));
        formikCustTicket.setFieldValue('no_of_days', value.no_of_days);
        formikCustTicket.setFieldValue('mode_of_payment', value.mode_of_payment);
        formikCustTicket.setFieldValue('transaction_id', value.transaction_id);
        formikCustTicket.setFieldValue('transaction_status', value.transaction_status);
        formikCustTicket.setFieldValue('transaction_time', moment(value.transaction_time).format('YYYY-MM-DD')+'T'+moment(value.transaction_time).format('HH:mm'));
        formikCustTicket.setFieldValue('org_id', value.org_id);
    }

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        formikCustTicket.resetForm();
    } 

    return(
        <div className='d-flex flex-column flex-lg-row masters_main h-100'>       
            <div className='modal fade' id={'support_ticket_formrter'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'support_ticket'})}</h3>
                            <div onClick={() => editCancel()} className='btn btn-sm btn-icon btn-active-color-primary' id='customerTicketForm' data-bs-dismiss='modal'>
                                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form className='w-100' noValidate onSubmit={formikCustTicket.handleSubmit}>
                                <div className='me-n3 d-flex flex-column align-items-end'>
                                    <div className='row'>
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'organization_name'})}</label>
                                            <div className="input-group">
                                                <select className="form-select" {...formikCustTicket.getFieldProps('org_id')}>
                                                    <option value="">select</option>
                                                    {dropdowns.org_name?.map((data, i) => {
                                                        if(data.id != 1) {
                                                        return(
                                                            <option value={data.id} key={i}>{data.organization_name}</option>
                                                        )}
                                                    })}
                                                </select>
                                            </div>
                                            {formikCustTicket.touched.org_id && formikCustTicket.errors.org_id && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.org_id}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                              
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'ticket_name'})}</label>
                                            <div className="input-group">
                                                <select className="form-select" {...formikCustTicket.getFieldProps('ticket_id')}>
                                                    <option value="">select</option>
                                                    {dropdowns.ticket?.map((data, i) => {
                                                        return(
                                                            <option value={data.id} key={i}>{data.ticket_name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            {formikCustTicket.touched.ticket_id && formikCustTicket.errors.ticket_id && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.ticket_id}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                              
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'paid_amount'})}</label>
                                            <div className="input-group">
                                                <input type="number" className="form-control" placeholder="Paid Amount" {...formikCustTicket.getFieldProps('paid_amount')}/> 
                                            </div>
                                            {formikCustTicket.touched.paid_amount && formikCustTicket.errors.paid_amount && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.paid_amount}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                              
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'start_date'})}</label>
                                            <div className="input-group">
                                                <input type="date" className="form-control" placeholder="Start Date" {...formikCustTicket.getFieldProps('start_date')}/> 
                                            </div>
                                            {formikCustTicket.touched.start_date && formikCustTicket.errors.start_date && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.start_date}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                              
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'no_of_days'})}</label>
                                            <div className="input-group">
                                                <input type="number" className="form-control" placeholder="No. of days" {...formikCustTicket.getFieldProps('no_of_days')}/> 
                                            </div>
                                            {formikCustTicket.touched.no_of_days && formikCustTicket.errors.no_of_days && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.no_of_days}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'mode_of_payment'})}</label>
                                            <div className="input-group">
                                                <select className="form-select" {...formikCustTicket.getFieldProps('mode_of_payment')}>
                                                    <option value="">select</option>
                                                    {dropdowns.payment_gateway?.map((data, i) => {
                                                        return(
                                                            <option value={data.id} key={i}>{data.payment_gateway}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            {formikCustTicket.touched.mode_of_payment && formikCustTicket.errors.mode_of_payment && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.mode_of_payment}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'transaction'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Transaction" {...formikCustTicket.getFieldProps('transaction_id')}/> 
                                            </div>
                                            {formikCustTicket.touched.transaction_id && formikCustTicket.errors.transaction_id && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.transaction_id}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                              
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'transaction_status'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Transaction Status" {...formikCustTicket.getFieldProps('transaction_status')}/> 
                                            </div>
                                            {formikCustTicket.touched.transaction_status && formikCustTicket.errors.transaction_status && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.transaction_status}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>                                  
                                        <div className="col-md-6 form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'transaction_time'})}</label>
                                            <div className="input-group">
                                                <input type="datetime-local" className="form-control" placeholder="Transaction Time" {...formikCustTicket.getFieldProps('transaction_time')}/> 
                                            </div>
                                            {formikCustTicket.touched.transaction_time && formikCustTicket.errors.transaction_time && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikCustTicket.errors.transaction_time}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div> 
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
                                            disabled={formikCustTicket.isSubmitting}
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
            <div className='flex-lg-row-fluid'> 
                {loading ? 
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> :                    
                <div className="card bs_2 mt-0 mt-md-5">  
                    <div className='card-body sus_height p-0 br_15'>                         
                            <div style={{ maxWidth: '100%' }} >
                            {ticket.length > 0 ? 
                                <MaterialTable className="p-3"
                                enableRowNumbers={true}
                                columns={ticketsColoumns}
                                icons={tableIcons}
                                data={ticket}
                                title="Support Ticket"
                                options={{
                                    selection: true,
                                    pageSize: 10,
                                    pageSizeOptions: [5, 10, 25, 50, 100],
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
                </div>}
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0" id="localEdit">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: `support_ticket_updated_successfully`})}!</div>
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
    )
}
export {SupportTickets}