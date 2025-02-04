import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { FinanceDrawer } from './financeDrawers';
import { FinanceToolbar } from './financeToolbar';
import Moment from 'moment';
import { Expenses } from './expense/expenses';
import { FeeConfirmation } from './fee confirmation/feeConfirmation';
import { ProformaInvoice } from './proforma_invoice/proformaInvoice';
import { Invoice } from './invoice/invoice';
import { Collection } from './collection/collection';
import { Incentive } from './incentive/incentive';
import { Cashback } from './cashback/cashback';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {useAuth} from '../../modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import { getTrnsactions } from '../transaction/core/_requests';
import { getFinanceDropdowns } from './core/_requests';
import { BrokerageForm } from './transaction details/brokerage';
import { InvoicingForm } from './transaction details/invoicing';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
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
import { useIntl } from 'react-intl';

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


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, aminityName, theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

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
  
const Finance = () => { 
    const intl = useIntl();
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const [pageHeight, setPageHeight] = useState('');
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

    const theme = useTheme(); 
    const {currentUser, logout} = useAuth();
    const [tab, setTab] = useState('transaction');
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [transactionsId, setTransactionsId] = useState('');
    const [dropdowns, setDropdowns] = useState({});


    const dropdownsList = async () => {
        const response = await getFinanceDropdowns()
        setDropdowns(response.output);
    }

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

    const formikid = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var id_body = {
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
                }
          
            // const saveTaskData = await updateTrnsactionsID(transactionId, id_body);
    
            // console.log('saveTaskData');
            // console.log(saveTaskData);
            // // document.getElementById('kt_contact')?.classList.remove('drawer-on');
            // if(saveTaskData != null){
            //     setLoading(false);
            //     document.getElementById('kt_transaction_details_close')?.click();
            //     document.getElementById('transaction_refresh_btn')?.click();
            //     var toastEl = document.getElementById('myToastUpdateTransaction');
            //     const bsToast = new Toast(toastEl!);
            //     bsToast.show();
            //     // resetForm();
            // }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const TransactionsList =  async () => {
        setLoading(true)
        const Response = await getTrnsactions({
            "booking_from_date": '',
            "booking_to_date": '',
            "city": '',
            "source": '',
            "team_leader": '',
            "shared_with": '',
            "closed_by": '',
            "developer_name": '',
            "project_id": '',
            "bhk_type_min": '',
            "bhk_type_max": '',
            "agreement_value_min": '',
            "agreement_value_max": '',
            "brokerage_min": '',
            "brokerage_max": '',
            "brokerage_value_min": '',
            "brokerage_value_max": '',
            "discount_min": '',
            "discount_max": '',
            "discount_value_min": '',
            "discount_value_max": '',
            "revenue_min": '',
            "revenue_max": '',
            "status": '',
            "created_by": '',
            "limit": '',
            "sortby": ''
        })
        setTransactions(Response.output);
        setLoading(false)
    }

      const columns = [
        { title: "Sl.No", render: rowData => transactions?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { field: 'id', title: 'Actions', cellStyle: {whiteSpace: 'nowrap'}, render: rowData => <>
            <button className='btn btn-sm btn-icon' title='More' id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                <KTSVG path="/media/icons/duotune/general/gen052.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                <li className="list-group p-2 ps-4 btn-icon btn-active-bg-gray-700"><a type='button' id='kt_feeconfirmation_form_toggle' onClick={() => setTransactionsId(rowData.id)}>Fee Confirmation</a></li>
                <li className="list-group p-2 ps-4 btn-icon btn-active-bg-gray-700"><a type='button' id='kt_proformaInvoice_form_toggle' onClick={() => setTransactionsId(rowData.id)}>Proforma Invoice</a></li>
                <li className="list-group p-2 ps-4 btn-icon btn-active-bg-gray-700"><a type='button' id='kt_Invoice_form_toggle' onClick={() => setTransactionsId(rowData.id)}>Invoice</a></li>
                <li className="list-group p-2 ps-4 btn-icon btn-active-bg-gray-700"><a type='button' id='kt_expense_form_toggle'>Add Expense</a></li>
            </ul>
            <button className='btn btn-sm btn-icon' title='Brokerage Details' id='kt_brokerage_details_toggle'
            onClick={() => {
                setTransactionsId(rowData.id);
            }}
            >
                <KTSVG path="/media/icons/duotune/graphs/gra006.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" />
            </button>
            <button className='btn btn-sm btn-icon' title='Invoicing Details' id='kt_invoicing_details_toggle'
            onClick={() => setTransactionsId(rowData.id)}
            >
                <KTSVG path="/media/icons/duotune/general/gen005.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" />
            </button>
            </>, headerName: 'Actions', width: 150, headerClassName: 'dg_header', disableReorder: false },
        { title: `${intl.formatMessage({id: 'contact_name'})}`, field: 'contact_client_name' },
        { title: `${intl.formatMessage({id: 'email'})}`, field: 'email_id' },
        { title: `${intl.formatMessage({id: 'contact_no'})}`, field: 'contact_number' },
        { title: `${intl.formatMessage({id: 'developer_name'})}`, field: 'developer_full_name'},
        { title: `${intl.formatMessage({id: 'team_leader'})}`, field: 'team_leader_name', render: rowData => rowData.team_leader_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
        { title: `${intl.formatMessage({id: 'shared_with'})}`, field: 'shared_with_name', render: rowData => rowData.shared_with_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
        { title: `${intl.formatMessage({id: 'closed_By'})}`, field: 'closed_by_name', render: rowData => rowData.closed_by_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
        { title: `${intl.formatMessage({id: 'locality'})}`, field: 'city_name' },
        { title: `${intl.formatMessage({id: 'booked_date'})}`, field: 'booking_date', render: rowData => Moment(rowData.booking_date).format('DD-MMMM-YYYY') == "Invalid date" ? '' : Moment(rowData.booking_date).format('DD-MMMM-YYYY')},
        { title: `${intl.formatMessage({id: 'project'})}`, field: 'property_name_of_building' },
        { title: `${intl.formatMessage({id: 'basic_price'})}`, field: 'basic_price', render: rowData => parseInt(rowData.basic_price) == 0 || parseInt(rowData.basic_price) == "NaN" ? '' : parseInt(rowData.basic_price ?? 0)},
        { title: `${intl.formatMessage({id: 'agreement_value'})}`, field: 'agreement_value', render: rowData => parseInt(rowData.agreement_value) == 0 || parseInt(rowData.agreement_value) == "NaN" ? '' : parseInt(rowData.agreement_value ?? 0)},
        { title: `${intl.formatMessage({id: 'cashback'})}`, field: 'discount_value', render: rowData => parseInt(rowData.discount_value) == 0 || parseInt(rowData.discount_value) == "NaN" ? '' : parseInt(rowData.discount_value ?? 0)},
        { title: `${intl.formatMessage({id: 'source'})}`, field: 'source_name' },
        { title: `${intl.formatMessage({id: 'created_by'})}`, field: 'created_by_name' },
        { title: `${intl.formatMessage({id: 'created_date'})}`, field: 'created_at', render: rowData => Moment(rowData.created_at).format('DD-MMMM-YYYY hh:mm a')},   
    ];

    useEffect(() => {
        // LeadSourceList();
        TransactionsList();
        // projectList();
        // UnitTypeList();
        // CityList();
        dropdownsList();
    }, [])
    

    return(
        <>
        <div className='d-none'>
            <ThemeBuilder/>
        </div>
        <FinanceToolbar tabDetails={tab}/>
        <FinanceDrawer tabDetails={tab} tId={transactionsId} dropdowns={dropdowns}/>
        <button id='transIdReset' onClick={() => setTransactionsId('')} className='d-none'>transaction reset</button>
        {/* <button id='expenseDeleteButton' className='d-none' onClick={() => expenseDelete()}></button> */}
        <div className="user_manage_page bg_white h-100 p-4">
                <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation" onClick={() => setTab('transaction')}>
                        <button className="nav-link active" id="transaction-tab" data-bs-toggle="pill" data-bs-target="#transaction" type="button" role="tab" aria-controls="transaction" aria-selected="true">{intl.formatMessage({id: 'transaction'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('feeConfirmation')}>
                        <button className="nav-link" id="pills-org-tab" data-bs-toggle="pill" data-bs-target="#pills-org" type="button" role="tab" aria-controls="pills-org" aria-selected="true">{intl.formatMessage({id: 'fee_confirmation'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('proformaInvoice')}>
                        <button className="nav-link" id="user-charts-tab" data-bs-toggle="pill" data-bs-target="#user-charts" type="button" role="tab" aria-controls="user-charts" aria-selected="false">{intl.formatMessage({id: 'proforma_invoice'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('invoice')}>
                        <button className="nav-link" id="manage-teams-tab" data-bs-toggle="pill" data-bs-target="#manage-teams" type="button" role="tab" aria-controls="manage-teams" aria-selected="false">{intl.formatMessage({id: 'invoice'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('collection')}>
                        <button className="nav-link" id="attendance-tab" data-bs-toggle="pill" data-bs-target="#attendance" type="button" role="tab" aria-controls="attendance" aria-selected="false">{intl.formatMessage({id: 'collection'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('expenses')}>
                        <button className="nav-link" id="performance-tab" data-bs-toggle="pill" data-bs-target="#performance" type="button" role="tab" aria-controls="performance" aria-selected="false">{intl.formatMessage({id: 'expenses'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('incentive')}>
                        <button className="nav-link" id="time-sheets-tab" data-bs-toggle="pill" data-bs-target="#time-sheets" type="button" role="tab" aria-controls="time-sheets" aria-selected="false">{intl.formatMessage({id: 'incentive'})}</button>
                    </li>
                    <li className="nav-item" role="presentation" onClick={() => setTab('cashback')}>
                        <button className="nav-link" id="cashback-tab" data-bs-toggle="pill" data-bs-target="#cashback" type="button" role="tab" aria-controls="cashback" aria-selected="false">{intl.formatMessage({id: 'cashback'})}</button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="transaction" role="tabpanel" aria-labelledby="transaction-tab">
                    <div
                            id='kt_finance_brokerage_details'
                            className='bg-white'
                            data-kt-drawer='true'
                            data-kt-drawer-name='finance_brokerage_details'
                            data-kt-drawer-activate='true'
                            data-kt-drawer-overlay='true'
                            data-kt-drawer-width="{default:'100%', 'md': '700px'}"
                            data-kt-drawer-direction='end'
                            data-kt-drawer-toggle='#kt_brokerage_details_toggle'
                            data-kt-drawer-close='#kt_brokerage_details_close'
                        >
                            <BrokerageForm tId={transactionsId} dropdowns={dropdowns} />
                        </div>
                        <div
                            id='kt_finance_invoicing_details'
                            className='bg-white'
                            data-kt-drawer='true'
                            data-kt-drawer-name='finance_invoicing_details'
                            data-kt-drawer-activate='true'
                            data-kt-drawer-overlay='true'
                            data-kt-drawer-width="{default:'100%', 'md': '700px'}"
                            data-kt-drawer-direction='end'
                            data-kt-drawer-toggle='#kt_invoicing_details_toggle'
                            data-kt-drawer-close='#kt_invoicing_details_close'
                        >
                            <InvoicingForm tId={transactionsId} dropdowns={dropdowns} />
                        </div>
                        <div style={{ width: '100%', }} className="position-relative"> 
                        {loading ? 
                            <div className='w-100 h-100'>
                                <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                                    <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                    <div className="spinner-border taskloader" role="status">                                    
                                        <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                                    </div>
                                </div> 
                            </div> :   <>                    
                        {transactions.length > 0
                        ? <>
                            <MaterialTable className="p-3"
                                enableRowNumbers={true}
                                icons={tableIcons}
                                columns={columns}
                                data={transactions}
                                title="Transactions"
                                options={{
                                    pageSize: 25,
                                    pageSizeOptions: [25, 50, 100, 500, transactions.length],
                                    actionsColumnIndex: -1,
                                    maxBodyHeight: pageHeight,
                                    exportButton: permissions.export == 1 ? true : false,
                                    columnsButton: true,
                                    headerStyle: {
                                        backgroundColor: '#ececec',
                                        color: '#000'
                                    },
                                    rowStyle: {
                                        backgroundColor: '#fff',
                                        fontSize: "10px"
                                    },
                                }}
                                /></>
                        : <div className="text-center w-100">
                            <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                            <p className='mt-3'>{intl.formatMessage({id: 'no_transactions_available'})}</p>
                        </div>}</>}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="invoicingDetails" role="tabpanel" aria-labelledby="invoicingDetails-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <form noValidate onSubmit={formikid.handleSubmit}>
                                <div className='row'>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'raised'})} %</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('raised')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending'})} %</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('pending')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'payment_status'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formikid.getFieldProps('payment_status')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount_received'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('amount_received')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'receiving_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formikid.getFieldProps('receiving_date')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_brokerage'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('pending_brokerage')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">S GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('s_gst_2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">C GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('c_gst_3')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">I GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('i_gst_4')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">GST {intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('gst_amount2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'Gross Brokerage Value'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('gross_brokerage_value2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS % {intl.formatMessage({id: 'deducted_by_builder'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('tds_reducted_by_builder3')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS {intl.formatMessage({id: 'amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('tds_amount2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'after_TDS_brokearge'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('after_tds_brokearge5')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_receivable_amount'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="number" min="0" {...formikid.getFieldProps('pending_receivable_amount')} className="form-control"/> 
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mb-6'>           
                                    <button
                                    type='submit'
                                    
                                    className='btn btn_primary text-primary'
                                    disabled={formikid.isSubmitting}
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
                    <div className="tab-pane fade" id="pills-org" role="tabpanel" aria-labelledby="pills-org-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <FeeConfirmation dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="user-charts" role="tabpanel" aria-labelledby="user-charts-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <ProformaInvoice dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="manage-teams" role="tabpanel" aria-labelledby="manage-teams-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <Invoice dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="attendance" role="tabpanel" aria-labelledby="attendance-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <Collection dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="performance" role="tabpanel" aria-labelledby="performance-tab">
                        <div className='row d-none'>                            
                            <div className='col-md-3'>
                                <div className='card bs_1 d-flex align-items-between'>
                                    <div className="d-flex align-items-center py-3">
                                        <span className="bullet bullet-vertical h-50px bg-danger"></span>
                                        <div className="form-check form-check-custom form-check-solid mx-5">
                                            <input className="form-check-input" type="checkbox" value="" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <a href="#" className="text-gray-800 text-hover-danger fw-bold fs-6">100000</a>
                                            <span className="text-muted fw-semibold d-block">total_expense</span>
                                        </div>
                                        <span className="badge badge-light-danger fs-8 fw-bold">New</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='card bs_1 d-flex align-items-between'>
                                    <div className="d-flex align-items-center py-3">
                                        <span className="bullet bullet-vertical h-50px bg-success"></span>
                                        <div className="form-check form-check-custom form-check-solid mx-5">
                                            <input className="form-check-input" type="checkbox" value="" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <a href="#" className="text-gray-800 text-hover-success fw-bold fs-6">30000</a>
                                            <span className="text-muted fw-semibold d-block">expense 1</span>
                                        </div>
                                        <span className="badge badge-light-success fs-8 fw-bold">New</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='card bs_1 d-flex align-items-between'>
                                    <div className="d-flex align-items-center py-3">
                                        <span className="bullet bullet-vertical h-50px bg-primary"></span>
                                        <div className="form-check form-check-custom form-check-solid mx-5">
                                            <input className="form-check-input" type="checkbox" value="" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <a href="#" className="text-gray-800 text-hover-primary fw-bold fs-6">25000</a>
                                            <span className="text-muted fw-semibold d-block">expense 2</span>
                                        </div>
                                        <span className="badge badge-light-primary fs-8 fw-bold">New</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className='card bs_1 d-flex align-items-between'>
                                    <div className="d-flex align-items-center py-3">
                                        <span className="bullet bullet-vertical h-50px bg-info"></span>
                                        <div className="form-check form-check-custom form-check-solid mx-5">
                                            <input className="form-check-input" type="checkbox" value="" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <a href="#" className="text-gray-800 text-hover-info fw-bold fs-6">10000</a>
                                            <span className="text-muted fw-semibold d-block">expense 3</span>
                                        </div>
                                        <span className="badge badge-light-info fs-8 fw-bold">New</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4' style={{ height: 630, width: '100%', }}>
                            <Expenses dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="cashback" role="tabpanel" aria-labelledby="pills-cashback-tab">
                        <div style={{ height: 630, width: '100%', }}>
                            <Cashback dropdowns={dropdowns} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="time-sheets" role="tabpanel" aria-labelledby="time-sheets-tab">
                        <div style={{ height: 630, width: '100%', }}>                            
                            <Incentive dropdowns={dropdowns} />
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export {Finance}


