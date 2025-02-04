import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {useAuth} from '../../../app/modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { deleteMultipleImagesTransaction, deleteTransactionNotes, getLog, getMultiImageTransaction, getTransactionDropdowns, getTransactionNotes, saveTransactionNotes, updateTransactionNotes, updateTrnsactions, updateTrnsactionsBD, updateTrnsactionsID, uploadMultipleFileTransaction } from './core/_requests';
import { Offcanvas, Toast } from 'bootstrap';
import Moment from 'moment';
import { useIntl } from 'react-intl';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import { useDropzone } from 'react-dropzone';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { getLeadTasks } from '../lead/core/_requests';
import { getMultipleFilesTasks } from '../task/core/_requests';

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
    brokerage_percentage: '',
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
    reply:'',
}

const thumb = {
    display: 'inline-flex',
    borderRadius: 5,
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const logContactcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, headerClassName: 'dg_header' },
    { field: 'user_name', headerName: 'User Name', width: 250, headerClassName: 'dg_header', renderCell: (row) => row.row.user_name?.first_name+' '+row.row.user_name?.last_name },
    { field: 'module_name', headerName: 'Module Name', width: 300, headerClassName: 'dg_header', renderCell: (row) => row.value == 1 ? 'Contact' : row.value == 2 ? 'Lead' : row.value == 3 ? 'Project' : row.value == 4 ? 'Task' : 'Transaction' },
    { field: 'note', headerName: 'Note', width: 600, headerClassName: 'dg_header' },
    { field: 'createdAt', headerName: 'Created At', width: 200, headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
];

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

function getStyles(name: string, aminityName: string[], theme: Theme) {
    return {
        fontWeight:
        aminityName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const logContactTaskcolumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70,headerClassName: 'dg_header' },
    { field: 'task_type_name', headerName: 'Task Type', width: 120,headerClassName: 'dg_header' },
    { field: 'priority_name', headerName: 'priority', width: 150,headerClassName: 'dg_header' },
    { field: 'task_time', headerName: 'Task Time', width: 150,headerClassName: 'dg_header', renderCell: (row) => moment(row.value).format("DD-MM-YYYY hh:mm a") },
    { field: 'property_name', headerName: 'Project', width: 150,headerClassName: 'dg_header' },
    { field: 'contact_name', headerName: 'Contact', width: 150,headerClassName: 'dg_header' },
    { field: 'assign_to_name', headerName: 'Assign To', width: 250,headerClassName: 'dg_header' },
    { field: 'task_status_name', headerName: 'Task Status', width: 150,headerClassName: 'dg_header' },
    { field: 'email', headerName: 'Contact Email', width: 200,headerClassName: 'dg_header' },
    { field: 'mobile', headerName: 'Contact Mobile', width: 200,headerClassName: 'dg_header' },
    { field: 'agenda', headerName: 'Task Note', width: 350,headerClassName: 'dg_header' },
];

type Props = {
    transactionId?: any,
    setDetailClicked: any,
    detailTab: any,
    body: any,
}

const TransactionDetails: FC<Props> = (props) => {
    const intl = useIntl();
    const {
        transactionId, setDetailClicked, detailTab, body
    } = props

    const {currentUser, logout} = useAuth();
    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [logList, setLogList] = useState<any[]>([]);
    const [teamLeaderId, setTeamLeaderId] = useState<any[]>([]);
    const [teamLeaderName, setTeamLeaderName] = useState<any[]>([]);
    const [closedById, setClosedById] = useState<any[]>([]);
    const [closedByName, setClosedByName] = useState<any[]>([]);
    const [sharedWithId, setSharedWithId] = useState<any[]>([]);
    const [sharedWithName, setSharedWithName] = useState<any[]>([]);
    const [dropdowns, setDropdowns] = useState<any>({});    
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [LeadNoteList, setTransactionNoteList] = useState<any[]>([]);
    const [noteEditVal, setNoteEditVal] = useState<any>('');
    const [parentId, setParentId] = useState<String>('');
    const [files, setFiles] = useState<any[]>([]);
    const [client, setClient] = useState<any>('');
    const [developer, setDeveloper] = useState<any>('');
    const [property, setproperty] = useState<any>('');
    const [filesVal, setFilesVal] = useState<any[]>([]);
    const [imgFullView, setImgFullView] = useState(false);
    const [imgSelect, setImgSelect] = useState('');  
    const [taskLead, setTaskLead] = useState<any[]>([]);  

    const theme = useTheme();

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
        brokerage_percentage: Yup.string(),
        brokerage_value: Yup.string(),
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

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {            
            var overview_body = {
                "shared_with": sharedWithId?.map((item:any) => item.id)?.join(',').toString(),
                "booking_date":values.booking_date == "Invalid date" ? '' : values.booking_date,
                "city":values.city,
                "lead_source":values.lead_source,
                "team_leader": teamLeaderId?.map((item:any) => item.id)?.join(',').toString(),
                "closed_by": closedById?.map((item:any) => item.id)?.join(',').toString(),
                "developer_name": developer,
                "project_name": property,
                "client_name": client,
                "contact_number":values.contact_number,
                "email_id":values.email_id,
                "discount_value":values.discount_value,
                "block_no":values.block_no,
                "unit_no":values.unit_no,
                "floor_no":values.floor_no,
                "bhk_type":values.bhk_type,
                "unit_size":values.sizes,
                "basic_price":values.basic_price,
                "frc":values.frc,
                "plc":values.plc,
                "car_parking_cost":values.car_parking_cost,
                "agreement_value":values.agreement_value,
                "pan":values.pan,
                "dob":values.dob == "Invalid date" ? '' : values.dob,
                "doa":values.doa == "Invalid date" ? '' : values.doa,
                "correspondence_address":values.correspondence_address,
                "brokerage_percentage":values.brokerage_percentage,
                "brokerage_value":values.brokerage_value,
                "discount_amount":values.discount_amount,
                "revenue":values.revenue,
                "aop_percentage":values.aop_per,
                "discount_paid_status":values.discount_paid_status,
                "tds_value":values.tds_value
                }
          
            const saveTaskData = await updateTrnsactions(transactionId?.id, overview_body);
    
            if(saveTaskData.status == 200){
                setLoading(false);
                document.getElementById('kt_transaction_details_close')?.click();
                if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                    document.getElementById('transactionListReload')?.click();                    
                    document.getElementById('transactionReloadFilter')?.click();                    
                } else {
                    document.getElementById('transactionReload')?.click();
                    document.getElementById('transactionListReload')?.click();                    
                }
                var toastEl = document.getElementById('updateTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const formikbd = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema ,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try { 
            var bd_body = {
                "s_gst_per": values.s_gst_per,
                "c_gst_per": values.c_gst_per,
                "i_gst_per": values.i_gst_per,
                "gst_amount": values.gst_amount,
                "gross_brokerage_value": values.gross_brokerage_value,
                "tds_reducted_by_builder": values.tds_per_ded_builder,
                "tds_amount": values.tds_amount,
                "after_tds_brokerage": values.after_tds_brokerage,
                "actual_receivable_amount": values.actual_receivable_amount,
                "incentive_per": values.incentive_per,
                "incentive_without_tds": values.incentive_without_tds,
                "tds_per": values.tds_per,
                "net_incentive_earned": values.net_incentive_earned,
                "invoice_status": values.invoice_status
            }
          
            const saveTaskData = await updateTrnsactionsBD(transactionId?.id, bd_body);
    
            if(saveTaskData.status == 200){
                setLoading(false);
                document.getElementById('kt_transaction_details_close')?.click();
                if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                    document.getElementById('transactionListReload')?.click();                    
                    document.getElementById('transactionReloadFilter')?.click();                    
                } else {
                    document.getElementById('transactionReload')?.click();
                    document.getElementById('transactionListReload')?.click();                    
                }
                var toastEl = document.getElementById('updateTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

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
                "pending_receivable_amount": values.pending_receivable_amount
                }
          
            const saveTaskData = await updateTrnsactionsID(transactionId?.id, id_body);
    
            if(saveTaskData.status == 200){
                setLoading(false);
                document.getElementById('kt_transaction_details_close')?.click();
                if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                    document.getElementById('transactionListReload')?.click();                    
                    document.getElementById('transactionReloadFilter')?.click();                    
                } else {
                    document.getElementById('transactionReload')?.click();
                    document.getElementById('transactionListReload')?.click();                    
                }
                var toastEl = document.getElementById('updateTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const transactionDetail =  async (Response:any) => {
        setLoading(true)
        const contactRes = await getTransactionDropdowns();
        setDropdowns(contactRes.output);
        setDeveloper(Response.developer_name ?? '');
        setproperty(Response.project_name ?? '');
        setClient(Response.client_name ?? '');
        setClosedById(Response.closed_by ? contactRes.output?.shared_with?.filter((item:any) => Response.closed_by?.split(',')?.indexOf(item.id.toString()) !== -1) : []);
        setSharedWithId(Response.shared_with ? contactRes.output?.shared_with?.filter((item:any) => Response.shared_with?.split(',')?.indexOf(item.id.toString()) !== -1) : []);
        setTeamLeaderId(Response.team_leader ? contactRes.output?.team_leader?.filter((item:any) => Response.team_leader?.split(',')?.indexOf(item.id.toString()) !== -1) : []);
        formik.setFieldValue('booking_date', Moment(Response.booking_date).format('YYYY-MM-DD') == 'Invalid date' ? '' : Moment(Response.booking_date).format('YYYY-MM-DD'));
        formik.setFieldValue('city', Response.city ?? '');
        formik.setFieldValue('state', Response.state ?? '');
        formik.setFieldValue('country', Response.country ?? '');
        formik.setFieldValue('lead_source', Response.lead_source ?? '');
        // formik.setFieldValue('team_leader', Response.team_leader ?? '');
        // formik.setFieldValue('developer_name', Response.developer_name ?? '');
        // formik.setFieldValue('project_name', Response.project_name ?? '');
        // formik.setFieldValue('client_name', Response.client_name ?? '');
        formik.setFieldValue('contact_number', Response.contact_number ?? '');
        formik.setFieldValue('email_id', Response.email_id ?? '');
        formik.setFieldValue('discount_value', parseInt(Response.discount_value ?? 0));
        formik.setFieldValue('block_no', Response.block_no ?? '');
        formik.setFieldValue('unit_no', Response.unit_no ?? '');
        formik.setFieldValue('floor_no', Response.floor_no ?? '');
        formik.setFieldValue('bhk_type', Response.bhk_type ?? '');
        formik.setFieldValue('sizes', Response.unit_size ?? '');
        formik.setFieldValue('basic_price', parseInt(Response.basic_price ?? 0));
        formik.setFieldValue('frc', Response.frc ?? '');
        formik.setFieldValue('plc', Response.plc ?? '');
        formik.setFieldValue('car_parking_cost', parseInt(Response.car_parking_cost ?? 0));
        formik.setFieldValue('agreement_value', parseInt(Response.agreement_value ?? 0));
        formik.setFieldValue('pan', Response.pan ?? '');
        formik.setFieldValue('dob', Moment(Response.dob).format('YYYY-MM-DD') == "Invalid date" ? '' : Moment(Response.dob).format('YYYY-MM-DD'));
        formik.setFieldValue('doa', Moment(Response.doa).format('YYYY-MM-DD') == "Invalid date" ? '' : Moment(Response.doa).format('YYYY-MM-DD'));
        formik.setFieldValue('correspondence_address', Response.correspondence_address ?? '');
        formik.setFieldValue('brokerage_percentage', parseFloat(Response.brokerage_percentage ?? 0));
        formik.setFieldValue('brokerage_value', parseInt(Response.brokerage_value ?? 0));
        formik.setFieldValue('discount_amount', parseInt(Response.discount_amount ?? 0));
        formik.setFieldValue('revenue', parseInt(Response.revenue ?? 0));
        formik.setFieldValue('aop_per', parseFloat(Response.aop_percentage ?? 0));
        formik.setFieldValue('discount_paid_status', Response.discount_paid_status ?? '');
        formik.setFieldValue('tds_value', parseInt(Response.tds_value ?? 0));

        let states = contactRes.output.state?.filter((state:any) => Response?.country == state.country_id);
        setState(states);
        let cities = contactRes.output.city?.filter((city:any) => Response?.state == city.state_id);
        setCity(cities);

        // var sharedWithArray = [];
        // var sharedWithNameArray = [];
        // if(Response.shared_with != null) {
        //     sharedWithArray = Response.shared_with?.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(Response.shared_with_name != null) {
        //     sharedWithNameArray = Response.shared_with_name?.split(",").map((e:any, i:any) => {
        //         return e;
        //     });
        // }
        // setSharedWithId(sharedWithArray);
        // setSharedWithName(sharedWithNameArray);


        // var teamLeaderArray = [];
        // var teamLeaderNameArray = [];
        // if(Response.team_leader != null) {
        //     teamLeaderArray = Response.team_leader?.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(Response.team_leader_name != null) {
        //     teamLeaderNameArray = Response.team_leader_name?.split(",").map((e:any, i:any) => {
        //         return e;
        //     });
        // }
        // setTeamLeaderId(teamLeaderArray);
        // setTeamLeaderName(teamLeaderNameArray);


        // var closedByArray = [];
        // var closedByNameArray = [];
        // if(Response.closed_by != null) {
        //     closedByArray = Response.closed_by?.split(",").map((e:any) => {
        //         return parseInt(e);
        //     });
        // }
        // if(Response.closed_by_name != null){
        //     closedByNameArray = Response.closed_by_name?.split(",").map((e:any, i:any) => {
        //         return e;
        //     });
        // }
        // setClosedById(closedByArray);
        // setClosedByName(closedByNameArray);

        formikbd.setFieldValue('s_gst_per', parseFloat(Response.s_gst_per ?? 0));
        formikbd.setFieldValue('c_gst_per', parseFloat(Response.c_gst_per ?? 0));
        formikbd.setFieldValue('i_gst_per', parseFloat(Response.i_gst_per ?? 0));
        formikbd.setFieldValue('gst_amount', parseInt(Response.gst_amount ?? 0));
        formikbd.setFieldValue('gross_brokerage_value', parseInt(Response.gross_brokerage_value ?? 0));
        formikbd.setFieldValue('tds_per_ded_builder', parseInt(Response.tds_reducted_by_builder ?? 0));
        formikbd.setFieldValue('tds_amount', parseInt(Response.tds_amount ?? 0));
        formikbd.setFieldValue('after_tds_brokerage', parseInt(Response.after_tds_brokerage ?? 0));
        formikbd.setFieldValue('actual_receivable_amount', parseInt(Response.actual_receivable_amount ?? 0));
        formikbd.setFieldValue('incentive_per', parseFloat(Response.incentive_per ?? 0));
        formikbd.setFieldValue('incentive_without_tds', parseInt(Response.incentive_without_tds ?? 0));
        formikbd.setFieldValue('tds_per', parseFloat(Response.tds_per ?? 0));
        formikbd.setFieldValue('net_incentive_earned', parseInt(Response.net_incentive_earned ?? 0));
        formikbd.setFieldValue('invoice_status', Response.invoice_status ?? '');

        formikid.setFieldValue('raised', parseInt(Response.raised ?? 0));
        formikid.setFieldValue('pending', parseInt(Response.pending ?? 0));
        formikid.setFieldValue('payment_status', Response.payment_status ?? '');
        formikid.setFieldValue('amount_received', parseInt(Response.amount_received ?? 0));
        formikid.setFieldValue('receiving_date', Moment(Response.receiving_date ?? '').format('YYYY-MM-DD'));
        formikid.setFieldValue('pending_brokerage', parseInt(Response.pending_brokerage ?? 0));
        formikid.setFieldValue('s_gst_2', parseInt(Response.s_gst_2 ?? 0));
        formikid.setFieldValue('c_gst_3', parseInt(Response.c_gst_3 ?? 0));
        formikid.setFieldValue('i_gst_4', parseInt(Response.i_gst_4 ?? 0));
        formikid.setFieldValue('gst_amount2', parseInt(Response.gst_amount2 ?? 0));
        formikid.setFieldValue('gross_brokerage_value2', parseInt(Response.gross_brokerage_value2 ?? 0));
        formikid.setFieldValue('tds_reducted_by_builder3', parseInt(Response.tds_reducted_by_builder3 ?? 0));
        formikid.setFieldValue('tds_amount2', parseInt(Response.tds_amount2 ?? 0));
        formikid.setFieldValue('after_tds_brokearge5', parseInt(Response.after_tds_brokearge5 ?? 0));
        formikid.setFieldValue('pending_receivable_amount', parseInt(Response.pending_receivable_amount ?? 0));
        setLoading(false);
    }

    const teamLeaderChange = (event: SelectChangeEvent<typeof teamLeaderName>) => {
        const {
          target: { value },
        } = event;

        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setTeamLeaderId(id);
        setTeamLeaderName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const sharedWithChange = (event: SelectChangeEvent<typeof sharedWithName>) => {
        const {
          target: { value },
        } = event;

        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setSharedWithId(id);
        setSharedWithName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const closedByChange = (event: SelectChangeEvent<typeof closedByName>) => {
        const {
          target: { value },
        } = event;

        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setClosedById(id);

        setClosedByName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const closeDialogue = () => {
        setDetailClicked(false);
    }
    
    const minimaximize = () => {
        setIsExpand(current => !current);
    }
    
    const fullScreenChange = () => {
        setIsFullScreen(current => !current);
    }   

const sum = (a:any, b:any) => {
    let c = parseInt(a) + parseInt(b);
    return c;
}

const transactionDropdowns = async () => {
    
}

const fetchLog = async (leadId:number) => {
    const fetchLogList = await getLog(leadId);
    setLogList(fetchLogList.output);
}

const notesFormSchema = Yup.object().shape({
    reply: Yup.string().required('Enter a note first...'),        
})

const formikNotes = useFormik({
    initialValues,
    validationSchema: notesFormSchema,
    onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
      try {
        var notesBody = {
            "reply": values.reply,
            "module_id": transactionId?.id,
            "module_name": 5,
            "parent_id": 0
        };

        const leadNotesData = await saveTransactionNotes(notesBody)

        if(leadNotesData.status == 200){
            if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                document.getElementById('transactionListReload')?.click();                    
                document.getElementById('transactionReloadFilter')?.click();                    
            } else {
                document.getElementById('transactionReload')?.click();
                document.getElementById('transactionListReload')?.click();                    
            }
          setTransactionNoteList(leadNotesData.output);    
          resetForm();
          var toastEl = document.getElementById('noteSaveTransaction');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        }
      } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('errMsgTransaction');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
})

const editOnSubmit = async (id:any) => {
    setParentId(id);
    let editVal = (document.getElementById('edit_field'+id) as HTMLInputElement)!.value;

    if(editVal != ''){
        try {              
            var notesBody = {
                "reply": editVal,
                "module_id": transactionId?.id,
                "module_name": 5,
            };
                           
            const editNotesData = await updateTransactionNotes(id, notesBody)
    
            if(editNotesData.status == 200){
                if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                    document.getElementById('transactionListReload')?.click();                    
                    document.getElementById('transactionReloadFilter')?.click();                    
                } else {
                    document.getElementById('transactionReload')?.click();
                    document.getElementById('transactionListReload')?.click();                    
                }
              (document.getElementById('edit_field'+id) as HTMLInputElement).value = '';
              setNoteEditVal('');
              setTransactionNoteList(editNotesData.output);
              var toastEl = document.getElementById('noteUpdateTransaction');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }        
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setLoading(false)
          }   
    }    
}

const replyEdit = async (id:any, val:any) => {
    setParentId(id);       
    setNoteEditVal(val);    
}

const cancelEdit = async (id:any) => {
    setParentId('');
}

const replyDelete = async (id:any, parentId:any) => {
    const deleteNotes = await deleteTransactionNotes(id, parentId, transactionId?.id);
    if(deleteNotes.status == 200){
        setTransactionNoteList(deleteNotes.output);
        if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
            document.getElementById('transactionListReload')?.click();                    
            document.getElementById('transactionReloadFilter')?.click();                    
        } else {
            document.getElementById('transactionReload')?.click();
            document.getElementById('transactionListReload')?.click();                    
        }
        var toastEl = document.getElementById('noteDeleteTransaction');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
    }
}

const replyOnSubmit = async (id:any) => {
    setParentId(id);
    let replyVal = (document.getElementById('child_reply'+id) as HTMLInputElement)!.value;

    if(replyVal != ''){
        try {
            var notesBody = {
                "reply": replyVal,
                "module_id": transactionId?.id,
                "module_name": 5,
                "parent_id": id
            };
                           
            const saveContactNotesData = await saveTransactionNotes(notesBody)
    
            if(saveContactNotesData.status == 200){
                if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                    document.getElementById('transactionListReload')?.click();                    
                    document.getElementById('transactionReloadFilter')?.click();                    
                } else {
                    document.getElementById('transactionReload')?.click();
                    document.getElementById('transactionListReload')?.click();                    
                }
              setTransactionNoteList(saveContactNotesData.output);
              (document.getElementById('child_reply'+id) as HTMLInputElement).value = ''
              var toastEl = document.getElementById('saveNoteTransaction');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setLoading(false)
          }   
    }
}

const transactionNoteList =  async () => {   
    const leadNoteResponse = await getTransactionNotes(transactionId?.id);
    setTransactionNoteList(leadNoteResponse.output);
}

const {getRootProps, getInputProps} = useDropzone({
    accept: {
        'image/*': ['.jpeg', '.jpg', '.png','.pdf'],
    },
    onDrop: acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
    })));
    // setFormFiles(acceptedFiles);

    var test: any[] = [];
    acceptedFiles.map(file => {
        let data = {
            "lastModified": file.lastModified,
            "name": file.name,
            "size": file.size,
            "type": file.type,
        }            
        test.push(data);
    });
    },
    // maxSize: 2097152,
}); 

const thumbs = files.map((file:any, index:any) => {
    const pieces = file.path.split('.');
    const last = pieces[pieces.length - 1];
    return(
    <div style={thumb} key={file.name} className="position-relative">
        <div style={thumbInner}>
        { last != 'pdf' ?
            <img
            src={file.preview}
            className='w-100 h-100 img-thumbnail rounded fit_contain'
            onLoad={() => { URL.revokeObjectURL(file.preview) }}
            />: <img
            src={toAbsoluteUrl('/media/svg/files/pdf.svg')}
            className='w-100 h-100 img-thumbnail rounded fit_contain'
            />
            }            
        </div>
        <a onClick={() => handleClick(index)} className='icon position-absolute top-0 end-0 rounded bg-gray border-0'><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"/>
        <rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"/>
        <rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"/>
        </svg>
        </span></a>
    </div>
)});

const handleClick = (index:any) => {
    setFiles([
        ...files.slice(0, index),
        ...files.slice(index + 1, files.length)
    ]);
}

const saveFiles = async () => {
    if(files.length > 0){
        try {
            var formData = new FormData();
            formData.append('module_name', '5');
            for (var i = 0; i < files.length; i++) {
                formData.append('uploadfiles', files[i]);
            }
                           
            const saveContactFiles = await uploadMultipleFileTransaction(transactionId?.id, formData)
    
            if(saveContactFiles.status == 200) {
              setLoading(false);
              if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
                document.getElementById('transactionListReload')?.click();                    
                document.getElementById('transactionReloadFilter')?.click();                    
            } else {
                document.getElementById('transactionReload')?.click();
                document.getElementById('transactionListReload')?.click();                    
            }
              setFilesVal(saveContactFiles.output);
              setFiles([]);
              var toastEl = document.getElementById('saveFilesTransaction');
              const bsToast = new Toast(toastEl!);
              bsToast.show();
            }        
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setLoading(false)
          }   
    }
}

const imgViewChange = (id:any) => {
    setImgFullView(!imgFullView)
    setImgSelect(id)
}

const onDeleteFile = async (id:any) => {
    const deleteRes = await deleteMultipleImagesTransaction(id, transactionId?.id);
    if(deleteRes.status == 200){
        setFilesVal(deleteRes.output);
        if(body.booking_from_date || body.team_leader || body.city || body.source || body.shared_with || body.closed_by || body.developer_name || body.project_id || body.bhk_type_min || body.bhk_type_max || body.agreement_value_min || body.agreement_value_max || body.brokerage_min || body.brokerage_max || body.brokerage_value_min || body.brokerage_value_max || body.discount_min || body.discount_max || body.discount_value_min || body.discount_value_max || body.revenue_min || body.revenue_max || body.status || body.created_by) {
            document.getElementById('transactionListReload')?.click();                    
            document.getElementById('transactionReloadFilter')?.click();                    
        } else {
            document.getElementById('transactionReload')?.click();
            document.getElementById('transactionListReload')?.click();                    
        }
        var toastEl = document.getElementById('deleteFilesTransaction');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
    }
}

const transactionFilesList =  async () => {   
    const contactFileResponse = await getMultiImageTransaction(transactionId?.id)
    setFilesVal(contactFileResponse.output);
}

useEffect(() => {
    transactionDropdowns();
    transactionFilesList();
}, []);

useEffect(() => {
    if(transactionId?.id) { 
        transactionDetail(transactionId);
        console.log("transactionId", transactionId);
        transactionNoteList(); 
        leadTasksList(transactionId?.lead_id); 
        fetchLog(transactionId?.id);          
    }
}, [transactionId]);

const leadTasksList = async (id:any) => {
    const response = await getLeadTasks(id)
    setTaskLead(response.output);
}

    return(
        <div className="w-lg-75 w-md-100 contact_details_page full_screen m-6">
            {
            loading ? 
            <div className="card main_bg h-100">
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center vh-100'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" style={{width:"3rem", height: "3rem"}} role="status">
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> 
            </div> : isExpand ?
            <div className="card main_bg h-100">
                <div className="card-header d-flex align-items-center">
                    <div className="w-100">
                        <div className="d-flex justify-content-end">
                            <div className='card-toolbar'>
                                <button className="btn mx-3 expand_btn" onClick={fullScreenChange}>
                                    <img src={isFullScreen ? toAbsoluteUrl('/media/custom/overview-icons/comp_white.svg') : toAbsoluteUrl('/media/custom/overview-icons/expand_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button className="btn mx-3 minimize_btn" onClick={() => {
                                    minimaximize();
                                    var element = document.getElementById("transaction"+transactionId);
                                    var headerOffset = 350;
                                    var elementPosition:any = element?.getBoundingClientRect().top;
                                    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        // behavior: "smooth"
                                    });
                                }}>
                                    <img src={toAbsoluteUrl('/media/custom/overview-icons/minimize_white.svg')} className="svg_icon" alt='' />
                                </button>
                                <button
                                    type='button'
                                    className='btn mx-3 close_btn'
                                    id='kt_transaction_details_close'
                                    onClick={() => {
                                        var element = document.getElementById("transaction"+transactionId);
                                        var headerOffset = 350;
                                        var elementPosition:any = element?.getBoundingClientRect().top;
                                        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                        
                                        window.scrollTo({
                                            top: offsetPosition,
                                            // behavior: "smooth"
                                        });
                                        closeDialogue();
                                    }}
                                    >
                                        <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon" alt='' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="card-group">
                            <div className="col-xxl-6 col-12 mb-3">
                                <div className="card bs_1 name_card h-100 mx-2">
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="user_img d-flex align-items-center justify-content-center fs-1 fw-bolder bolder bg_primary_lite text-strong text-light">{transactionId.contact_client_name && transactionId.contact_client_name[0]?.toUpperCase()}</div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="d-flex">
                                                            <h4 className="mb-0 ms-2">{transactionId.contact_client_name}</h4>
                                                        </div>
                                                        <p className="mb-0">{transactionId.developer_full_name}</p>
                                                    </div>
                                                    <div className="col-sm-6 text-end">
                                                        <a href={'mailto:'+ transactionId.email_id} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                        <a href={'tel:'+ transactionId.contact_number} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                        {/* <a href="#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a> */}
                                                        <a href={"https://api.whatsapp.com/send?phone="+ transactionId.contact_number} className="btn_soft_primary">
                                                            <img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt='' />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-6 col-12 mb-3">
                                <div className="card bs_1 h-100 mx-2 info_card">
                                    <div className="card-body p-3">
                                        <div className='row w-100 p-3'>
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                                <p className="mb-0">{transactionId.email_id}</p>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                                <p className="mb-0">{transactionId.contact_number}</p>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
                                                <small className="mb-0">{intl.formatMessage({id: 'created_by'})}</small>
                                                <p className="mb-0">{transactionId.created_by_name}</p>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab_container bg_white br_10 bs_1">
                        <div className="row mt-4">
                            <div className="col-12">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={detailTab == 'overview' ? "nav-link active" : "nav-link"} id="overview-tab" data-bs-toggle="pill" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">{intl.formatMessage({id: 'overview'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={detailTab == 'notes' ? "nav-link active" : "nav-link"} id="notes-tab" data-bs-toggle="pill" data-bs-target="#notes" type="button" role="tab" aria-controls="notes" aria-selected="false">{intl.formatMessage({id: 'notes'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={detailTab == 'files' ? "nav-link active" : "nav-link"} id="files-tab" data-bs-toggle="pill" data-bs-target="#files" type="button" role="tab" aria-controls="files" aria-selected="false">{intl.formatMessage({id: 'files'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="message-tab" data-bs-toggle="pill" data-bs-target="#message" type="button" role="tab" aria-controls="message" aria-selected="false">{intl.formatMessage({id: 'messages'})}</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="brokerage_details-tab" data-bs-toggle="pill" data-bs-target="#brokerage_details" type="button" role="tab" aria-controls="brokerage_details" aria-selected="false">{intl.formatMessage({id: 'brokerage_details'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="invoice_details-tab" data-bs-toggle="pill" data-bs-target="#invoice_details" type="button" role="tab" aria-controls="invoice_details" aria-selected="false">{intl.formatMessage({id: 'invoicing_details'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={detailTab == 'task' ? "nav-link active" : "nav-link"} id="task-tab" data-bs-toggle="pill" data-bs-target="#task" type="button" role="tab" aria-controls="task" aria-selected="false">{intl.formatMessage({id: 'task'})}</button>
                                    </li>
                                    {/* <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="duplicate-tab" data-bs-toggle="pill" data-bs-target="#duplicate" type="button" role="tab" aria-controls="duplicate" aria-selected="false">Duplicate</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="tasks-tab" data-bs-toggle="pill" data-bs-target="#tasks" type="button" role="tab" aria-controls="tasks" aria-selected="false">Tasks</button>
                                    </li> */}
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="timeline-tab" data-bs-toggle="pill" data-bs-target="#timeline" type="button" role="tab" aria-controls="timeline" aria-selected="false">{intl.formatMessage({id: 'activity_timeline'})}</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={detailTab == 'overview' ? "tab-pane fade show active" : "tab-pane fade"} id="overview" role="tabpanel" aria-labelledby="overview-tab">
                                        <form noValidate onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'booking_date'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="date" {...formik.getFieldProps('booking_date')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                                        <div className="input-group mb-3 bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('country')} onChange={async (e) => {
                                                            formik.setFieldValue("country", e.target.value);
                                                            let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                                            setState(states);
                                                            formik.setFieldValue("state", '');
                                                            formik.setFieldValue("city", '');
                                                            setCity([]);
                                                        }}>
                                                            <option value="">Select</option>
                                                            {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div> 
                                                    </div>
                                                </div>
                                                {transactionId?.country != 0 &&
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                                        <div className="input-group mb-3 bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                            formik.setFieldValue("state", e.target.value);                                               
                                                            let cities = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                                            setCity(cities);
                                                        }} >
                                                            <option value="">Select</option>
                                                            {state?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select>
                                                        </div>  
                                                    </div>
                                                </div>}
                                                {transactionId?.state != 0 &&
                                                <div className="col-md-6 col-xxl-4 col-12 mb-3">
                                                    <div className="form-group mb-4">
                                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                                        <div className="input-group mb-3 bs_2 py-1">
                                                        <select className="form-select btn-sm text-start" {...formik.getFieldProps('city')}>
                                                            <option value="">Select</option>
                                                            {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                                return(
                                                                    <option value={data.id} key={i}>{data.name}</option>
                                                            )})}
                                                        </select> 
                                                        </div> 
                                                    </div>
                                                </div>}
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'team_leader'})}</label>
                                                    {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            className='input_prepend'
                                                            multiple
                                                            displayEmpty
                                                            value={teamLeaderName}
                                                            onChange={teamLeaderChange}
                                                            input={<OutlinedInput className='input_prepend' />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                var id = [];

                                                                for (let i = 0; i < selected.length; i++) {
                                                                    var fields = selected[i].split('-');

                                                                    var n = fields[0];
                                                                    var d = fields[1];

                                                                    name.push(n);
                                                                    id.push(d);
                                                                }

                                                                if (selected.length === 0) {
                                                                    return <p>{intl.formatMessage({id: 'team_leader'})}</p>;
                                                                }

                                                                return name.join(', ');
                                                            } }
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                            <MenuItem disabled value="">
                                                                <em>{intl.formatMessage({id: 'team_leader'})}</em>
                                                            </MenuItem>
                                                            {dropdowns.team_leader?.map((assignVal:any) => (
                                                                <MenuItem
                                                                    key={assignVal.id}
                                                                    value={assignVal.first_name + ' -' + assignVal.id}
                                                                    style={getStyles(assignVal.first_name, teamLeaderName, theme)}
                                                                >
                                                                    {assignVal.first_name ?? "--No Name--"}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl> */}
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <ReactSelect
                                                        isMulti
                                                        options={dropdowns.team_leader}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        // value={lead?.find((item:any) => contactId == item.id)}
                                                        value={dropdowns.team_leader?.filter((item:any) => teamLeaderId?.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setTeamLeaderId(val);
                                                        }}
                                                        placeholder={"Team Leader.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'shared_with'})}</label>
                                                    {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={sharedWithName}
                                                            onChange={sharedWithChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                var id = [];

                                                                for (let i = 0; i < selected.length; i++) {
                                                                    var fields = selected[i].split('-');

                                                                    var n = fields[0];
                                                                    var d = fields[1];

                                                                    name.push(n);
                                                                    id.push(d);
                                                                }

                                                                if (selected.length === 0) {
                                                                    return <p>{intl.formatMessage({id: 'shared_with'})}</p>;
                                                                }

                                                                return name.join(', ');
                                                            } }
                                                            className='multi_select_field'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                            <MenuItem disabled value="">
                                                                <em>{intl.formatMessage({id: 'shared_with'})}</em>
                                                            </MenuItem>
                                                            {dropdowns.shared_with?.map((assignVal:any) => (
                                                                <MenuItem
                                                                    key={assignVal.id}
                                                                    value={assignVal.first_name + ' -' + assignVal.id}
                                                                    style={getStyles(assignVal.first_name, sharedWithName, theme)}
                                                                >
                                                                    {assignVal.first_name ?? "--No Name--"}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl> */}
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <ReactSelect
                                                        isMulti
                                                        options={dropdowns.shared_with}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        // value={lead?.find((item:any) => contactId == item.id)}
                                                        value={dropdowns.shared_with?.filter((item:any) => sharedWithId?.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setSharedWithId(val);
                                                        }}
                                                        placeholder={"Shared with.."}
                                                        />
                                                    </div>
                                                </div>                                                
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3 edit_page_form">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'closed_by'})}</label>
                                                    {/* <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                                        <Select
                                                            multiple
                                                            displayEmpty
                                                            value={closedByName}
                                                            onChange={closedByChange}
                                                            input={<OutlinedInput />}
                                                            renderValue={(selected) => {
                                                                var name = [];
                                                                var id = [];

                                                                for (let i = 0; i < selected.length; i++) {
                                                                    var fields = selected[i].split('-');

                                                                    var n = fields[0];
                                                                    var d = fields[1];

                                                                    name.push(n);
                                                                    id.push(d);
                                                                }

                                                                if (selected.length === 0) {
                                                                    return <p>{intl.formatMessage({id: 'closed_by'})}</p>;
                                                                }

                                                                return name.join(', ');
                                                            } }
                                                            className='multi_select_field'
                                                            MenuProps={MenuProps}
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                        >
                                                            <MenuItem disabled value="">
                                                                <em>{intl.formatMessage({id: 'closed_by'})}</em>
                                                            </MenuItem>
                                                            {dropdowns.shared_with?.map((assignVal:any) => (
                                                                <MenuItem
                                                                    key={assignVal.id}
                                                                    value={assignVal.first_name + ' -' + assignVal.id}
                                                                    style={getStyles(assignVal.first_name, sharedWithName, theme)}
                                                                >
                                                                    {assignVal.first_name ?? "--No Name--"}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl> */}
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <ReactSelect
                                                        isMulti
                                                        options={dropdowns.shared_with}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        // value={lead?.find((item:any) => contactId == item.id)}
                                                        value={dropdowns.shared_with?.filter((item:any) => closedById?.indexOf(item) !== -1)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setClosedById(val);                                                    
                                                        }}
                                                        placeholder={"Closed By.."}
                                                        />
                                                    </div>
                                                </div>                                                
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('project_name')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.project?.map((task:any,i:any) =>{
                                                                return (
                                                                    <option value={task.id} key={i}>{task.name_of_building}</option> 
                                                            )})}
                                                        </select> */}
                                                        <ReactSelect
                                                        options={dropdowns.project}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.project?.find((item:any) => property == item.id)}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setproperty(val.id);                                                    
                                                        }}
                                                        placeholder={"Project Name.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'source'})}</label>
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('lead_source')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.lead_source?.map((task:any,i:any) =>{
                                                                return (
                                                                    <option value={task.id} key={i}>{task.option_value}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        {/* <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('client_name')}>
                                                        <option value=''>Select</option>
                                                            {dropdowns.client?.map((task:any, i:any) =>{
                                                                return (
                                                                    <option value={task.id} key={i}>{task.first_name}</option> 
                                                            )})}
                                                        </select> */}
                                                        <ReactSelect
                                                        options={dropdowns.client}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.client?.find((item:any) => client == item.id?.toString())}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setClient(val.id);                                                                                                            
                                                        }}
                                                        placeholder={"Client Name.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <ReactSelect
                                                        options={dropdowns.developer_name}
                                                        components={makeAnimated()}
                                                        getOptionLabel={(option:any) => option.developer_name ?? '--No Name--'}
                                                        getOptionValue={(option:any) => option.id}
                                                        value={dropdowns.developer_name?.find((item:any) => developer == item.id?.toString())}
                                                        classNamePrefix="border-0 "
                                                        className={"w-100 "}
                                                        onChange={(val:any) => {
                                                            setDeveloper(val.id);                                                                                                            
                                                        }}
                                                        placeholder={"Developer Name.."}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_number'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('contact_number')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">Email{intl.formatMessage({id: 'email'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="email" {...formik.getFieldProps('email_id')} className="form-control"/> 
                                                    </div>
                                                </div>                                                
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'tower/block'})} (No. /Name)</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('block_no')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'unit_number'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('unit_no')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_number'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('floor_no')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'BHK_type'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('bhk_type')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                {/* <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">BHK Type</label>
                                                    <div className="input-group mb-3">
                                                        <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('bhk_type')}>
                                                        <option value=''>Select</option>
                                                            {unitType.map((taskPrior,i) =>{
                                                                return (
                                                                    <option value={taskPrior.id} key={i}>{taskPrior.name}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div> */}
                                                {/* <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">Unit Size</label>
                                                    <div className="input-group mb-3">
                                                        <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('sizes')}>
                                                        <option value=''>Select</option>
                                                            {taskPriority.map((taskPrior,i) =>{
                                                                return (
                                                                    <option value={taskPrior.id} key={i}>{taskPrior.name}</option> 
                                                            )})}
                                                        </select>
                                                    </div>
                                                </div> */}
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'unit_size'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('sizes')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'basic_price'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('basic_price')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">FRC</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('frc')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">PLC</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('plc')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking_cost'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('car_parking_cost')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pan_number'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('pan')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date_of_birth'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="date" {...formik.getFieldProps('dob')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'anniversary_date'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="date" {...formik.getFieldProps('doa')} className="form-control"/> 
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'agreement_value'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('agreement_value')} className="form-control" id="agreement_value"
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("agreement_value", e.target?.value.replace(/[^0-9.]/g, ""))
                                                        //     let brokeragePer:any = (document.getElementById('brokerage_percentage') as HTMLInputElement)?.value;
                                                        //     let aopPer:any = (document.getElementById('aop_per') as HTMLInputElement)?.value;
                                                        //     let discPer:any = (document.getElementById('discount_value') as HTMLInputElement)?.value;
                                                        //     let brokerageValue:any = e.target.value * sum(brokeragePer, aopPer) / 100;
                                                        //     formik.setFieldValue('brokerage_value', brokerageValue.toFixed(2) ?? ''); 
                                                        //     let discountAmount:any = brokerageValue * discPer / 100;
                                                        //     formik.setFieldValue('discount_amount', discountAmount.toFixed(2) ?? '');  
                                                        //     formik.setFieldValue('tds_value', (brokerageValue * 5 / 100).toFixed(2));  
                                                        //     let revenue:any = brokerageValue - discountAmount;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');                                         
                                                        // }}
                                                         />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('brokerage_percentage')}
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("brokerage_percentage", e.target?.value.replace(/[^0-9.]/g, ""));
                                                        //     let agreementValue:any = (document.getElementById('agreement_value') as HTMLInputElement)?.value;
                                                        //     let aopPer:any = (document.getElementById('aop_per') as HTMLInputElement)?.value;
                                                        //     let discPer:any = (document.getElementById('discount_value') as HTMLInputElement)?.value;
                                                        //     let brokerageValue:any = agreementValue * sum(e.target.value, aopPer) / 100;
                                                        //     formik.setFieldValue('brokerage_value', brokerageValue.toFixed(2) ?? '');
                                                        //     let discountAmount:any = brokerageValue * discPer / 100;
                                                        //     formik.setFieldValue('discount_amount', discountAmount.toFixed(2) ?? ''); 
                                                        //     formik.setFieldValue('tds_value', (brokerageValue * 5 / 100).toFixed(2));
                                                        //     let revenue:any = brokerageValue - discountAmount;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');
                                                        // }}
                                                         className="form-control" id='brokerage_percentage'/>
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">AOP %</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('aop_per')} className="form-control" id='aop_per'
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("aop_per", e.target?.value.replace(/[^0-9.]/g, ""))
                                                        //     let brokeragePer:any = (document.getElementById('brokerage_percentage') as HTMLInputElement)?.value;
                                                        //     let agreementval:any = (document.getElementById('agreement_value') as HTMLInputElement)?.value;
                                                        //     let discPer:any = (document.getElementById('discount_value') as HTMLInputElement)?.value;
                                                        //     let brokerageValue:any = agreementval * sum(brokeragePer, e.target.value) / 100;
                                                        //     formik.setFieldValue('brokerage_value', brokerageValue.toFixed(2) ?? '');  
                                                        //     let discountAmount:any = brokerageValue * discPer / 100;
                                                        //     formik.setFieldValue('discount_amount', discountAmount.toFixed(2) ?? ''); 
                                                        //     formik.setFieldValue('tds_value', (brokerageValue * 5 / 100).toFixed(2)); 
                                                        //     let revenue:any = brokerageValue - discountAmount;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');                                      
                                                        // }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage_value'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('brokerage_value')} className="form-control" id="brokerage_value"
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("brokerage_value", e.target?.value.replace(/[^0-9.]/g, ""))
                                                        //     let discPer:any = (document.getElementById('discount_value') as HTMLInputElement)?.value;
                                                        //     let discountAmount:any = e.target.value * discPer / 100;
                                                        //     formik.setFieldValue('discount_amount', discountAmount.toFixed(2) ?? '');
                                                        //     formik.setFieldValue('tds_value', (e.target.value * 5 / 100).toFixed(2));
                                                        //     let revenue:any = e.target.value - discountAmount;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');
                                                        // }}
                                                         />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount'})} % <small>(if any)</small></label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('discount_value')} className="form-control" id='discount_value'
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("discount_value", e.target?.value.replace(/[^0-9.]/g, ""))
                                                        //     let brokeragePer:any = (document.getElementById('brokerage_percentage') as HTMLInputElement)?.value;
                                                        //     let agreementval:any = (document.getElementById('agreement_value') as HTMLInputElement)?.value;
                                                        //     let aopPer:any = (document.getElementById('aop_per') as HTMLInputElement)?.value;
                                                        //     let brokerageValue:any = agreementval * sum(brokeragePer, aopPer) / 100;
                                                        //     formik.setFieldValue('brokerage_value', brokerageValue.toFixed(2) ?? ''); 
                                                        //     let discountAmount:any = brokerageValue * e.target.value / 100;
                                                        //     formik.setFieldValue('discount_amount', discountAmount.toFixed(2) ?? '');
                                                        //     formik.setFieldValue('tds_value', (brokerageValue * 5 / 100).toFixed(2));
                                                        //     let revenue:any = brokerageValue - discountAmount;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');
                                                        // }}
                                                         />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount_amount'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="number" {...formik.getFieldProps('discount_amount')} className="form-control" id='discount_amount'
                                                        //  onChange={(e:any) => {
                                                        //     formik.setFieldValue("discount_amount", e.target?.value.replace(/[^0-9.]/g, ""));
                                                        //     let brokerageValue:any = (document.getElementById('brokerage_value') as HTMLInputElement).value;
                                                        //     let revenue:any = brokerageValue - e.target.value;
                                                        //     formik.setFieldValue('revenue', revenue.toFixed(2) ?? '');
                                                        //     formik.setFieldValue('tds_value', (brokerageValue * 5 / 100).toFixed(2));
                                                        // }}
                                                         />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'TDS_value'})} @ 5%</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('tds_value')} className="form-control" id='tds_value' onChange={(e:any) => {
                                                            formik.setFieldValue("tds_value", e.target?.value.replace(/[^0-9.]/g, ""))}} />
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount_paid'})}</label>
                                                    <div className="input-group mb-3 bs_2 py-1">
                                                        <select className="btn btn-sm w-100 text-start form-select h-42px" {...formik.getFieldProps('discount_paid_status')}>
                                                            <option value=''>Select</option>
                                                            <option value='1'>Yes</option>
                                                            <option value='0'>No</option>                                                 
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-xxl-4 col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'revenue'})}</label>
                                                    <div className="input-group mb-3 bs_2">
                                                        <input type="text" {...formik.getFieldProps('revenue')} className="form-control" onChange={(e) => formik.setFieldValue("revenue", e.target?.value.replace(/[^0-9.]/g, ""))} />
                                                    </div>
                                                </div>
                                            </div> 
                                            <div className='d-flex justify-content-center mb-6'>           
                                                <button
                                                type='submit'
                                                id='kt_sign_up_submit1'
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
                                    <div className={detailTab == 'notes' ? "tab-pane fade show active" : "tab-pane fade"} id="notes" role="tabpanel" aria-labelledby="notes-tab">
                                        <div className="card mb-5 mb-xl-8">
                                            <div className='card-body pb-0'>
                                                <div className='main_bg px-lg-5 px-4 pt-4 pb-1 mb-6'>
                                                    <form noValidate onSubmit={formikNotes.handleSubmit} className='position-relative mb-6 pb-4 border-bottom border-secondary'>
                                                        <input {...formikNotes.getFieldProps('reply')}
                                                            className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                            data-kt-autosize='true'                                                        
                                                            placeholder='Reply..'
                                                        />
                                                        <div className='position-absolute top-0 end-0 me-n5'>
                                                            <button type='submit' disabled={formikNotes.isSubmitting} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                            </button>
                                                        </div>
                                                        {formikNotes.touched.reply && formikNotes.errors.reply && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </form>
                                                </div>
                                                <div className='notes_list mt-4 card-body'>
                                                    <h4 className='mb-3'>{intl.formatMessage({id: 'notes_list'})}</h4>
                                                    <hr/>
                                                    {LeadNoteList.map((leadNote, i) => {
                                                        return (
                                                    <div className='mb-5' key={leadNote.id}>
                                                        {leadNote.reply1 == 'NO'
                                                        ? <div className='note_question'>
                                                            <div className='d-flex align-items-center mb-3'>
                                                                <div className='d-flex align-items-center flex-grow-1'>
                                                                    <div className='symbol symbol-45px me-5'>

                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={leadNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+leadNote.user_id+'/'+leadNote.user_profile_image : ''} className="user_img" alt='' />

                                                                    </div>
                                                                    <div className='d-flex flex-column'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                                                                        {leadNote.user_name ?? 'user'}
                                                                    </a>
                                                                    <span className='text-gray-400 fw-bold'>{Moment(leadNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='mb-7 pb-5 border-bottom border-secondary d-flex justify-content-between'>
                                                                { noteEditVal != '' && parentId == leadNote.id ?
                                                                <div className='text-gray-800 position-relative w-75'>
                                                                    <input
                                                                        className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                        data-kt-autosize='true'
                                                                        placeholder='Reply..'
                                                                        id={'edit_field'+leadNote.id}
                                                                        defaultValue={noteEditVal}
                                                                    ></input>
                                                                </div>
                                                                : 
                                                                <div className='text-gray-800'>
                                                                    {leadNote.reply}
                                                                </div>
                                                                }
                                                                { currentUser?.designation == 1 &&
                                                                <span>
                                                                    { noteEditVal != '' && parentId == leadNote.id ?
                                                                    <><button type='button' onClick={() => cancelEdit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                    </button>
                                                                    <button type='button' onClick={() => editOnSubmit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                        <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                    </button></> :
                                                                    <button type='button' onClick={() => replyEdit(leadNote.id, leadNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                    <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                    </button>}
                                                                    {currentUser?.designation == 1 && <button type='button'
                                                                    data-bs-toggle='modal'
                                                                    data-bs-target={'#delete_note_popup'+leadNote.id} 
                                                                    className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                    <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                    </button> }
                                                                </span>}
                                                                <div className='modal fade' id={'delete_note_popup'+leadNote.id} aria-hidden='true'>
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
                                                                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(leadNote.id, leadNote.parent_id)}>
                                                                                        {intl.formatMessage({id: 'yes'})}
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> :
                                                        <div className='mb-7 ps-10 note_answer'>
                                                            <div className='d-flex mb-5'>
                                                                <div className='symbol symbol-45px me-5'>

                                                                    <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={leadNote.user_profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+leadNote.user_id+'/'+leadNote.user_profile_image : ''} className="user_img" alt='' />
                                                                </div>
                                                                <div className='d-flex flex-column flex-row-fluid'>
                                                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fw-bolder me-2'>
                                                                    {leadNote.user_name ?? 'User'}
                                                                    </a>
                                                                    <span className='text-gray-400 fw-bold fs-7'>{Moment(leadNote.created_at).format("DD-MMMM-YYYY HH:mm")}</span>
                                                                </div>                                                                
                                                                    <div className=' d-flex justify-content-between'>                                            
                                                                        { noteEditVal != '' && parentId == leadNote.id ?
                                                                        <div className='text-gray-800 position-relative w-75'>
                                                                            <input
                                                                                className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                                data-kt-autosize='true'
                                                                                placeholder='Reply..'
                                                                                id={'edit_field'+leadNote.id}
                                                                                defaultValue={noteEditVal}
                                                                            ></input>
                                                                        </div> : 
                                                                        <div className='text-gray-800'>
                                                                            {leadNote.reply}
                                                                        </div>
                                                                        } 
                                                                            <span>
                                                                            { currentUser?.designation == 1 &&
                                                                        <span>
                                                                            { noteEditVal != '' && parentId == leadNote.id ?
                                                                            <><button type='button' onClick={() => cancelEdit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-icon-2 mb-3"><path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black"></path><path opacity="0.3" d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black"></path></svg>
                                                                            </button>
                                                                            <button type='button' onClick={() => editOnSubmit(leadNote.id)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                            </button></> :
                                                                            <button type='button' onClick={() => replyEdit(leadNote.id, leadNote.reply)} className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                            <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2 mb-3"/>
                                                                            </button>}
                                                                            {currentUser?.designation == 1 && <button type='button'
                                                                            data-bs-toggle='modal'
                                                                            data-bs-target={'#delete_note_popup2'+leadNote.id} 
                                                                            className='btn btn-icon btn-sm btn-active-color-danger ps-0'>
                                                                            <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-2 mb-3" />
                                                                            </button> }
                                                                        </span>}
                                                                            </span>
                                                                        </div>                                                                    
                                                                        </div>
                                                                    <div className='modal fade' id={'delete_note_popup2'+leadNote.id} aria-hidden='true'>
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
                                                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => replyDelete(leadNote.id, leadNote.parent_id)}>
                                                                                            {intl.formatMessage({id: 'yes'})}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div> 
                                                            </div>
                                                        </div>
                                                        }                                                       
                                                       {leadNote.reply1 == 'NO' && 
                                                        <>
                                                        <form className='position-relative mb-6'>
                                                            <input
                                                                className='form-control border-0 p-0 pe-10 resize-none min-h-25px'
                                                                data-kt-autosize='true'
                                                                placeholder='Reply..'
                                                                id={'child_reply'+leadNote.id}
                                                            />
                                                            <div className='position-absolute top-0 end-0 me-n5'>
                                                                <button type='submit' onClick={() => replyOnSubmit(leadNote.id)}  className='btn btn-icon btn-sm btn-active-color-primary ps-0'>
                                                                    <KTSVG path='/media/icons/duotune/general/gen016.svg' className='svg-icon-2 mb-3' />
                                                                </button>
                                                            </div>
                                                        </form>
                                                        </>
                                                       }
                                                        <div className='separator mb-4'></div>
                                                    </div>
                                                        )
                                                    })}                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={detailTab == 'files' ? "tab-pane fade show active" : "tab-pane fade"} id="files" role="tabpanel" aria-labelledby="files-tab">
                                        <div {...getRootProps({className: 'dropzone'})}>
                                            <div className='myDIV'>
                                                <div className="d-flex align-items-center justify-content-center w-100 h-100 vh-25">
                                                    <span className="btn btn-file w-100 h-100">
                                                        <KTSVG
                                                        path='/media/icons/duotune/files/fil022.svg'
                                                        className='svg-icon-1 text_primary ms-2'
                                                        />
                                                        <p className='text_primary'>{intl.formatMessage({id: 'upload_files_here'})}</p>
                                                        <small className='text-dark'>* Note: jpg, jpeg, png, pdf only acceptable</small>
                                                        <input {...getInputProps()}/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <aside className='d-flex flex-wrap mt-5'>
                                            {thumbs}
                                        </aside>
                                        <div className='p-5 text-end'>
                                            <button
                                                type='button'
                                                id='kt_sign_up_submit2'
                                                className='btn btn_primary text-primary'
                                                onClick={saveFiles}
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
                                        {filesVal.length > 0 &&<>
                                        <div className='main_bg p-4 mb-9 rounded'>                                            
                                            <h4>{intl.formatMessage({id: 'files'})}</h4>
                                            <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                                            {filesVal.map((file, i) => {
                                                const pieces = file.fileoriginalname.split('.');
                                                const last = pieces[pieces.length - 1];
                                                return ( 
                                                    <>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3" key={i}>
                                                        <div className="card h-100">
                                                            <div className="card-body d-flex justify-content-center text-center flex-column p-8">
                                                            <a href="#" data-bs-toggle='modal'
                                                            data-bs-target={'#delete_confirm_popup'+file.id} className="btn delete_btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>
                                                                <a href="#" className="text-gray-800 text-hover-primary d-flex flex-column">
                                                                    {last != 'pdf' ? 
                                                                    <a className={imgFullView && imgSelect == file.id ? "img_full_view" : "symbol symbol-75px"} onClick={() => imgViewChange(file.id)}>
                                                                        <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/svg/files/doc.svg') }} src={process.env.REACT_APP_API_BASE_URL+'uploads/contacts/files/'+file.module_id+'/'+file.file} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY")}</div>
                                                                    </a>
                                                                    :
                                                                    <a className="symbol symbol-75px" href={process.env.REACT_APP_API_BASE_URL+'uploads/lead/files/'+file.module_id+'/'+file.file}>
                                                                        <img src={toAbsoluteUrl("/media/svg/files/pdf.svg")} alt=""/>
                                                                        <div className="fs-5 fw-bolder text-dark mb-2">{file.fileoriginalname}</div>
                                                                        <div className="fs-7 fw-bold text-gray-400 mt-auto">{Moment(file.created_at).format("DD-MMMM-YYYY ")}</div>
                                                                    </a>
                                                                    }                                                                    
                                                                </a>                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='modal fade' id={'delete_confirm_popup'+file.id} aria-hidden='true'>
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
                                                                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDeleteFile(file.id)}>
                                                                            {intl.formatMessage({id: 'yes'})}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </>
                                                    )
                                                })}
                                            </div>
                                        </div></>}
                                    </div>
                                    <div className="tab-pane fade" id="message" role="tabpanel" aria-labelledby="message-tab">
                                        {/* <h3>Messages</h3> */}
                                        <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                        <ul className="nav nav-pills mb-3 message_tabs" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="pills-mail-tab" data-bs-toggle="pill" data-bs-target="#pills-mail" type="button" role="tab" aria-controls="pills-mail" aria-selected="true">Email</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-whatsapp-tab" data-bs-toggle="pill" data-bs-target="#pills-whatsapp" type="button" role="tab" aria-controls="pills-whatsapp" aria-selected="false">Whatsapp</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-sms-tab" data-bs-toggle="pill" data-bs-target="#pills-sms" type="button" role="tab" aria-controls="pills-sms" aria-selected="false">Sms</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="pills-calls-tab" data-bs-toggle="pill" data-bs-target="#pills-calls" type="button" role="tab" aria-controls="pills-calls" aria-selected="false">Calls</button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-mail" role="tabpanel" aria-labelledby="pills-mail-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-1  d-flex justify-content-lg-center my-2">
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="mail_icon"><i className="fas fa-envelope"></i></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                    <div className="w-100 d-flex flex-wrap mt-2">
                                                                        <a href="" className="d-flex mail_format me-2 mb-1">
                                                                            <img src={toAbsoluteUrl('/media/technology-logos/Html5.png')} className="mail_format" alt='' />
                                                                            <p className="mb-0">Homeoptions.wrd</p>
                                                                        </a> 
                                                                        <a href="" className="d-flex mail_format mb-1">
                                                                            <img src={toAbsoluteUrl('/media/technology-logos/Html5.png')} className="mail_format" alt='' />
                                                                            <p className="mb-0">Homeoptions.pdf</p>
                                                                        </a> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="pills-whatsapp" role="tabpanel" aria-labelledby="pills-whatsapp-tab">
                                                <div className="mt-4">
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-1  d-flex justify-content-lg-center my-2">
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg"><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card bs_1 mb-4">
                                                        <div className="card-body p-2">
                                                            <div className="row">
                                                                <div className="col-lg-1  d-flex justify-content-lg-center my-2">
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 my-2">
                                                                    <span className="icon_bg"><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/></span>
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                        <p>Raj2020@gmail.com</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-lg-6 my-2">
                                                                    <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in nisi vitae ipsum semper lacinia.</p>
                                                                </div>
                                                                <div className="col-lg-2 d-flex flex-wrap my-2">
                                                                    <p className="pe-3">4.00pm</p>
                                                                    <p>27/04/2022</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="pills-sms" role="tabpanel" aria-labelledby="pills-sms-tab">SMS</div>
                                            <div className="tab-pane fade" id="pills-calls" role="tabpanel" aria-labelledby="pills-calls-tab">Calls</div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="brokerage_details" role="tabpanel" aria-labelledby="brokerage_details-tab">
                                    <form noValidate onSubmit={formikbd.handleSubmit}>
                                        <div className='row'>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">S GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('s_gst_per')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">C GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('c_gst_per')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">I GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('i_gst_per')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">GST {intl.formatMessage({id: 'amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('gst_amount')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gross_brokerage_value'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('gross_brokerage_value')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">TDS % {intl.formatMessage({id: 'deducted_by_builder'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('tds_per_ded_builder')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">TDS {intl.formatMessage({id: 'amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('tds_amount')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'after_TDS_brokearge'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('after_tds_brokerage')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'actual_receivable_amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('actual_receivable_amount')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive'})}%</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('incentive_per')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive_without'})} TDS</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('incentive_without_tds')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">TDS%</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('tds_per')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'net_incentive_earned'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('net_incentive_earned')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'invoice_status'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikbd.getFieldProps('invoice_status')} className="form-control"/> 
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center mb-6'>           
                                            <button
                                            type='submit'
                                            id='kt_sign_up_submit2'
                                            className='btn btn_primary text-primary'
                                            disabled={formikbd.isSubmitting}
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
                                    <div className="tab-pane fade" id="invoice_details" role="tabpanel" aria-labelledby="invoice_details-tab">
                                    <form noValidate onSubmit={formikid.handleSubmit}>
                                        <div className='row'>                                    
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'raised'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('raised')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('pending')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'payment_status'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="text" {...formikid.getFieldProps('payment_status')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'amount_received'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('amount_received')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'receiving_date'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="date" {...formikid.getFieldProps('receiving_date')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_brokerage'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('pending_brokerage')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">S GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('s_gst_2')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">C GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('c_gst_3')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">I GST %</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('i_gst_4')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">GST{intl.formatMessage({id: 'amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('gst_amount2')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gross_brokerage_value'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('gross_brokerage_value2')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">TDS % {intl.formatMessage({id: 'deducted_by_builder'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('tds_reducted_by_builder3')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'TDS_amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('tds_amount2')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'after_TDS_brokearge'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('after_tds_brokearge5')} className="form-control"/> 
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12 mb-3">
                                                <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pending_receivable_amount'})}</label>
                                                <div className="input-group mb-3 bs_2">
                                                    <input type="number" min="0" {...formikid.getFieldProps('pending_receivable_amount')} className="form-control"/> 
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center mb-6'>           
                                            <button
                                            type='submit'
                                            id='kt_sign_up_submit3'
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
                                    {/* <div className="tab-pane fade" id="duplicate" role="tabpanel" aria-labelledby="duplicate-tab">
                                    <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                    </div>
                                    <div className="tab-pane fade" id="tasks" role="tabpanel" aria-labelledby="tasks-tab">
                                    <div className="d-flex flex-column flex-center mb-9">   
                                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                                        <h2>Under Construction</h2>
                                    </div>
                                    </div>   */}
                                    <div className="tab-pane fade" id="timeline" role="tabpanel" aria-labelledby="timeline-tab">
                                        <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                            {logList.length > 0
                                            ?
                                            <DataGrid
                                                rows={logList}
                                                columns={logContactcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_timeline_contacts_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={detailTab == 'task' ? "tab-pane fade show active" : "tab-pane fade"} id={"task"} role="tabpanel" aria-labelledby="task-tab">
                                    <div className='mb-9' style={{ height: 550, width: '100%',}}>
                                        {taskLead.length > 0
                                            ?
                                        <DataGrid
                                                rows={taskLead}
                                                columns={logContactTaskcolumns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                checkboxSelection
                                                sx={{
                                                    fontSize:14,
                                                    fontWeight:500,
                                                }}
                                            />
                                            : <div className="text-center w-100">
                                                <span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM12.5 18C12.5 17.4 12.6 17.5 12 17.5H8.5C7.9 17.5 8 17.4 8 18C8 18.6 7.9 18.5 8.5 18.5L12 18C12.6 18 12.5 18.6 12.5 18ZM16.5 13C16.5 12.4 16.6 12.5 16 12.5H8.5C7.9 12.5 8 12.4 8 13C8 13.6 7.9 13.5 8.5 13.5H15.5C16.1 13.5 16.5 13.6 16.5 13ZM12.5 8C12.5 7.4 12.6 7.5 12 7.5H8C7.4 7.5 7.5 7.4 7.5 8C7.5 8.6 7.4 8.5 8 8.5H12C12.6 8.5 12.5 8.6 12.5 8Z" fill="currentColor"></path><rect x="7" y="17" width="6" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="12" width="10" height="2" rx="1" fill="currentColor"></rect><rect x="7" y="7" width="6" height="2" rx="1" fill="currentColor"></rect><path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="currentColor"></path></svg></span>
                                                <p className='mt-3'>{intl.formatMessage({id: 'no_tasks_available'})}</p>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="card bg_primary">
                <div className="card-body d-flex justify-content-between">
                    <div>
                        <h5 className='text-white'>{intl.formatMessage({id: 'transaction_details'})}</h5>
                    </div>
                    <button onClick={minimaximize} className="mx-3 btn p-0">
                        <i className="fas fa-window-maximize text-white"></i>
                    </button>
                    <button type='button' data-bs-dismiss="offcanvas" id='kt_expand_close' onClick={closeDialogue} className="mx-3 btn p-0">
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>
            </div>}
        </div>
    )

}
export {TransactionDetails}