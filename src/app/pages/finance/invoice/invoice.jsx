import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React,{FC, useEffect, useState} from 'react'
import { deleteExpense, deleteInvoice, deleteProinvoice, getInvoice, getProformaInvoice } from '../core/_requests'
import Moment from 'moment';
import { KTSVG } from '../../../../_metronic/helpers';
import { Toast } from 'bootstrap';
import { InvoiceEditForm } from './editInvoice';
import { forwardRef } from 'react';
import MaterialTable from 'material-table'
import { useIntl } from 'react-intl';
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

const Invoice = (props) => {
    const {dropdowns} = props
    const intl = useIntl();
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const [pageHeight, setPageHeight] = useState('');
    const [finance, setFinance] = useState([])
    const [invoiceId, setInvoiceId] = useState('')

    const setHeight = () => {
      let heigh ;
      if(window.innerHeight > 720) {
        heigh = '600px'
      } else {
        heigh = '450px'
      }
      setPageHeight(heigh)
    } 
    useEffect(() => {
        setHeight()
      }, [window.innerHeight]);

    const invoices = [
        { title: "Sl.No", render: rowData => finance?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { field: 'transaction_id', title: 'Transaction ID', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'team_leader_name', title: 'Team Leader ', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'shared_with_name', title: 'Shared with', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'aggrement_value', title: 'Agreement Value', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => parseInt(rowData.aggrement_value ?? 0) == 0 ? '' : parseInt(rowData.aggrement_value)},
        { field: 'brokerage_value', title: 'Brokerage Value', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => parseInt(rowData.brokerage_value ?? 0) == 0 ? '' : parseInt(rowData.brokerage_value)},
        { field: 'lead_source_name', title: 'Source', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'created_at', title: 'Created on', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => Moment(rowData.due_date).format('DD-MMMM-YYYY') == "Invalid date" ? '' : Moment(rowData.due_date).format('DD-MMMM-YYYY')},
        { field: 'client_fullname', title: 'Client Name', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'property_name', title: 'Project Name', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'developer_name', title: 'Developer Name', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'due_date', render: rowData => Moment(rowData.due_date).format('DD-MMMM-YYYY') == "Invalid date" ? '' : Moment(rowData.due_date).format('DD-MMMM-YYYY'), title: 'Due Date', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'tax', title: 'Tax', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => parseInt(rowData.tax ?? 0) == 0 ? '' : parseInt(rowData.tax)},
        { field: 'total_amount', title: 'Total Amount', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => parseInt(rowData.total_amount ?? 0) == 0 ? '' : parseInt(rowData.total_amount)},
        { field: 'invoice_status_name', title: 'Invoice Status', cellStyle: {whiteSpace: 'nowrap'}},         
        { field: 'expense_name', title: 'Expenses', cellStyle: {whiteSpace: 'nowrap'} },         
        { field: 'id', render: rowData => <>
        <button className='btn btn-sm btn-icon' title='Edit' onClick={() => invoiceEdit(rowData.id)}>
            <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" />
        </button>
        <button className='btn btn-sm btn-icon' title='Delete' onClick={() => invoiceDeletePop(rowData.id)}>
            <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-danger btn-active-bg-gray-400" />
        </button>
        </>, title: 'Actions', cellStyle: {whiteSpace: 'nowrap'} },
      ];


const invoiceList = async () => {
        const response = await getInvoice()
        setFinance(response.output);
    }

    const invoiceEdit = async (id) => {
        setInvoiceId(id);
        document.getElementById('kt_Invoice_details_toggle')?.click();

    }

    const invoiceDeletePop = (id) => {
        setInvoiceId(id);
        document.getElementById('invoiceDeletePopup')?.click();
    }

    const invoiceDelete = async () => {
        const response = await deleteInvoice(invoiceId)
        if(response != null) {
            document.getElementById('invoiceReload')?.click();
            var toastEl = document.getElementById('myToastExpenseRemove');
            const bsToast = new Toast(toastEl);
            bsToast.show();
            setInvoiceId('');
        }
    }

    useEffect(() => {
        invoiceList();
    }, []);

    return(<>
    <div
        id='kt_finance_invoice'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='finance_invoice'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_Invoice_details_toggle'
        data-kt-drawer-close='#kt_Invoice_details_close'
      >
       <InvoiceEditForm invoicesId={invoiceId} dropdowns={dropdowns}/> 
    </div>
    <button className='d-none' id='invoiceReload' onClick={() => invoiceList()}>Reload</button>
    <button className='d-none' id='kt_Invoice_details_toggle'>edit</button>
    <button data-bs-toggle='modal' data-bs-target={'#invoice_delete_confirm_popup'} className="d-none" id='invoiceDeletePopup'>Delete</button>
    <div className='modal fade' id={'invoice_delete_confirm_popup'} aria-hidden='true'>
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
                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => invoiceDelete()}>
                            {intl.formatMessage({id: 'yes'})}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="ExpenseAdd">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'invoice_created_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="ExpenseDelete">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'invoice_removed_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="ExpenseUpdate">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'invoice_updated_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="ExpenseErrMsg">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
            </div>
        </div>
        {finance.length > 0
        ? 
        <MaterialTable className="p-3"
            enableRowNumbers={true}
            icons={tableIcons}
            columns={invoices}
            data={finance}
            title="Invoices"
            options={{
                pageSize: 25,
                pageSizeOptions: [25, 50, 100, 500, finance.length],
                actionsColumnIndex: -1,
                maxBodyHeight: pageHeight,
                exportButton: permissions.export == 1 ? true : false,
                columnsButton: true,
                headerStyle: {
                    position: "sticky",
                    backgroundColor: '#ececec',
                    color: '#000',
                    whiteSpace: 'nowrap'
                },
                rowStyle: {
                    backgroundColor: '#fff',
                }
            }}
            />
        : <div className="text-center w-100">
            <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
            <p className='mt-3'>{intl.formatMessage({id: 'no_invoices_available'})}</p>
        </div>}
    </>

    )
}

export {Invoice}