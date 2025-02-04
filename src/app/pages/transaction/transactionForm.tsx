import React,{FC, useState,useEffect} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import { Theme, useTheme } from '@mui/material/styles';
import { Toast } from 'bootstrap';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getTransactionDropdowns, saveTrnsactions } from './core/_requests';
import { getLeadDetail } from '../lead/core/_requests';
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { useIntl } from 'react-intl';

const initialValues = {
    contact_id : '',
    lead_creation_date: '',
    booking_date: '',
    city: '',
    state: '',
    country: '',
    lead_source: '',
    team_leader: '',
    closed_by: '',
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
    discount_paid_status: '',
    pan: '',
    dob: '',
    doa: '',
    correspondence_address: '',
    brokerage_percentage: '',
    aop_per: '',
    brokerage_value: '',
    discount_amount: '',
    revenue: '',
    lead_id: '',
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
    transaction_status: '338',
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

const mystyle = {
    padding: "0px",
    height: "34px",
    maxHeight: "200px",
    overflowY: "scroll",
};


  type Props = {
    setLeads?: any,
    leadName?: any,
    transactionEnabled?: any
    transactionData?: any,
    leadDetails?: any,
}

const TransactionForm: FC<Props> = (props) => {
    const intl = useIntl();
    const {
        transactionEnabled, transactionData, leadName, leadDetails
       } = props

    const transactionSaveSchema = Yup.object().shape({
        date: Yup.string(),
        lead_creation_date: Yup.string(),
        booking_date: Yup.string(),
        city: Yup.string(),
        lead_source: Yup.string(),
        team_leader: Yup.string(),
        closed_by: Yup.string(),
        developer_name: Yup.string(),
        project_name: Yup.string(),
        client_name: Yup.string(),
        contact_number: Yup.string(),
        email_id: Yup.string(),
        discount_value: Yup.string(),
        block_no: Yup.string(),
        discount_paid_status: Yup.string(),
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
        aop_per: Yup.string(),
        brokerage_value: Yup.string(),
        discount_amount: Yup.string(),
        revenue: Yup.string(),
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
    
    const theme = useTheme(); 
    const [loading, setLoading] = useState(false);
    const [assignToName, setAssignToName] = useState<any[]>([]);
    const [assignToId, setAssignToId] = useState<any[]>([]);
    const [sharedWithId, setSharedWithId] = useState<any[]>([]);
    const [sharedWithName, setSharedWithName] = useState<any[]>([]);
    const [closedById, setClosedById] = useState<any[]>([]);
    const [closedByName, setClosedByName] = useState<any[]>([]);
    const [teamLeaderName, setTeamLeaderName] = useState<any[]>([]);
    const [teamLeaderId, setTeamLeaderId] = useState<any[]>([]);
    const [teamLeader, setTeamLeader] = useState<any[]>([]);
    const [sharedWith, setSharedWith] = useState<any[]>([]);
    const [lead, setLead] = useState<any[]>([]);
    const [leadDetail, setLeadDetail] = useState<any>({});
    const [dropdowns, setDropdowns] = useState<any>({});
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [contactId, setContactId] = useState<any>('');
    const [developerName, setDeveloperName] = useState<any>('');
    const [property, setproperty] = useState<any>('');
    const [client, setClient] = useState<any>('');
    const {currentUser, logout} = useAuth();

    useEffect(() => {
        if(leadDetails?.id) {          
            setContactId(leadDetails?.id);
            setproperty(leadDetails?.property_id);
            setClient(leadDetails?.contact_id);
            let states = dropdowns.state?.filter((state:any) => leadDetails?.country == state.country_id);
            setState(states);
            let cities = dropdowns.city?.filter((city:any) => leadDetails?.state == city.state_id);
            setCity(cities);
            formik.setFieldValue('lead_id', leadDetails?.id == 0 ? '' : leadDetails?.id);
            formik.setFieldValue('city', leadDetails?.city == 0 ? '' : leadDetails?.city);
            formik.setFieldValue('state', leadDetails?.state == 0 ? '' : leadDetails?.state);
            formik.setFieldValue('country', leadDetails?.country == 0 ? '' : leadDetails?.country);
            formik.setFieldValue('lead_source', leadDetails?.lead_source ?? '');
            formik.setFieldValue('developer_name', leadDetails?.company_name ?? '');
            formik.setFieldValue('project_name', leadDetails?.property_id ?? '');
            formik.setFieldValue('contact_number', leadDetails?.contact_mobile ?? '');
            formik.setFieldValue('email_id', leadDetails?.contact_email ?? '');
        }
    }, [leadDetails]);

    const transactionDropdowns = async () => {
        const contactRes = await getTransactionDropdowns();
        setDropdowns(contactRes.output);
        const data = contactRes.output?.lead;

        let contact:any[] = [];
        for(let key in data) {
            let body = {
                id: data[key].id,
                name: data[key].contact_name
            }
            contact.push(body);
        }
        setLead(contact);
    }

    const formatResult = (item:any) => {
        return (
            <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
            </>
        )
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

    const formik = useFormik({
        initialValues,
        validationSchema: transactionSaveSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true);
          try {
            var body = {
                "lead_id": values.lead_id,
                "shared_with": sharedWith?.map((item:any) => item.id).join(',').toString(),
                "booking_date": values.booking_date == "Invalid date" ? '' : values.booking_date,
                "city": values.city,
                "state": values.state,
                "country": values.country,
                "lead_source": values.lead_source,
                "team_leader": teamLeader?.map((item:any) => item.id).join(',').toString(),
                "closed_by": closedById?.map((item:any) => item.id).join(',').toString(),
                "developer_name": developerName,
                "project_name":property,
                "client_name":client,
                "contact_number":values.contact_number,
                "transaction_status":values.transaction_status,
                "email_id":values.email_id,
                "discount_paid_status":values.discount_paid_status,
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
                "aop_percentage":values.aop_per,
                "discount_amount":values.discount_amount,
                "revenue":values.revenue,
                "tds_value":values.tds_value,
                "s_gst_per": '',
                "c_gst_per": '',
                "i_gst_per": '',
                "gst_amount": '',
                "gross_brokerage_value": '',
                "tds_per_ded_builder": '',
                "tds_amount": '',
                "after_tds_brokerage": '',
                "actual_receivable_amount": '',
                "incentive_per": '',
                "incentive_without_tds": '',
                "tds_per": '',
                "net_incentive_earned": '',
                "invoice_status": '',
                "raised": '',
                "pending": '',
                "payment_status": '',
                "amount_received": '',
                "receiving_date": '',
                "pending_brokerage": '',
                "s_gst_2": '',
                "c_gst_3": '',
                "i_gst_4": '',
                "gst_amount2": '',
                "gross_brokerage_value2": '',
                "tds_reducted_by_builder3": '',
                "tds_amount2": '',
                "after_tds_brokearge5": '',
                "pending_receivable_amount": ''
                }

            const saveTaskData = await saveTrnsactions(body);
    
            if(saveTaskData.status == 200){
                setLoading(false);                
                resetForm();
                setContactId('');
                setDeveloperName('');
                setproperty('');
                setClient('');
                setClosedById([]);
                setSharedWith([]);
                setTeamLeader([]);
                setClosedById([]);
                setSharedWithId([]);
                setTeamLeaderId([]);
                setClosedByName([]);
                setSharedWithName([]);
                setTeamLeaderName([]);
                document.getElementById('KOK_ADD_TRANSACTION_CLICK')?.click();
                document.getElementById('kt_transaction_close')?.click();
                document.getElementById('transactionReload')?.click();
                var toastEl = document.getElementById('AddTransaction');
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

    const sum = (a:any, b:any) => {       
        if(!a && b) {
            let c = 0 + parseFloat(b);
            return c;
        } else if(!b && a) {
            let c = parseFloat(a) + 0;
            return c;
        } else {
            let c = parseFloat(a) + parseFloat(b);
            return c;
        }        
    }

    const closeTransaction = () => {
        setContactId('');
        setDeveloperName('');
        setproperty('');
        setClient('');
        setClosedById([]);
        setSharedWith([]);
        setTeamLeader([]);
        setClosedById([]);
        formik.resetForm();
    }

    const contactDropSelect = async (id:any, name:any) => {
        setContactId(id);
        // formik.setFieldValue('contact_id', id ?? '');
        const fetchDetails = await getLeadDetail(id)
        setLeadDetail(fetchDetails.output[0]);

        setproperty(fetchDetails.output[0]?.property_id);
        setClient(fetchDetails.output[0]?.contact_id);
        // setClosedById(dropdowns?.shared_with?.filter((item:any) => fetchDetails.output[0]?.closed_by?.split(',')?.indexOf(item.id.toString()) !== -1));
        // setSharedWith(dropdowns?.shared_with?.filter((item:any) => fetchDetails.output[0]?.shared_with?.split(',')?.indexOf(item.id.toString()) !== -1));
        // setTeamLeader(dropdowns?.team_leader?.filter((item:any) => fetchDetails.output[0]?.team_leader?.split(',')?.indexOf(item.id.toString()) !== -1));

        let states = dropdowns.state?.filter((state:any) => fetchDetails.output[0]?.country == state.country_id);
        setState(states);
        let cities = dropdowns.city?.filter((city:any) => fetchDetails.output[0]?.state == city.state_id);
        setCity(cities);

        formik.setFieldValue('lead_id', fetchDetails.output[0]?.id ?? '');
        formik.setFieldValue('city', fetchDetails.output[0]?.city ?? '');
        formik.setFieldValue('state', fetchDetails.output[0]?.state ?? '');
        formik.setFieldValue('country', fetchDetails.output[0]?.country ?? '');
        formik.setFieldValue('lead_source', fetchDetails.output[0]?.lead_source ?? '');
        formik.setFieldValue('developer_name', fetchDetails.output[0]?.company_name ?? '');
        formik.setFieldValue('contact_number', fetchDetails.output[0]?.contact_mobile ?? '');
        formik.setFieldValue('email_id', fetchDetails.output[0]?.contact_email ?? '');
      } 

    useEffect(() => {
        transactionDropdowns();
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_transaction_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_transaction'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_transaction_close'
                    onClick={closeTransaction}
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_transaction_body'>
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
                                    <div className={leadDetails?.id ? 'col-md-6 col-12 mb-3 d-none' : 'col-md-6 col-12 mb-3'} id='lead-tran'>
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'select_lead'})}</label> 
                                        <div className="input-group mb-3"> 
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                options={lead}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.name}
                                                getOptionValue={(option:any) => option.id}
                                                value={lead?.find((item:any) => contactId == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    contactDropSelect(val.id, val.name);
                                                }}
                                                placeholder={"lead.."}
                                                />
                                            </div>
                                        </div>
                                        {formik.touched.contact_id && formik.errors.contact_id && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.contact_id}</span>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'booking_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('booking_date')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                            <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" defaultValue={""} {...formik.getFieldProps('country')} onChange={async (e) => {
                                                formik.setFieldValue("country", e.target.value);
                                                let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                                setState(states);
                                                (document.getElementById('augrwferhbkwjdhwiueoi') as HTMLInputElement).value = "";
                                            }} >
                                                <option value="">Select</option>
                                                {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>
                                    {state.length != 0 &&
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                            <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" id="augrwferhbkwjdhwiueoi" {...formik.getFieldProps('state')} onChange={async (e) => {
                                                formik.setFieldValue("state", e.target.value);                                               
                                                let states = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                                setCity(states);
                                                (document.getElementById('egruygerwgurewgrug') as HTMLInputElement).value = "";
                                            }} >
                                                <option selected value="">Select</option>
                                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select>
                                            </div>  
                                        </div>
                                    </div>}
                                    {city.length != 0 &&
                                    <div className="col-md-6 col-12 mb-3">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                            <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" id='egruygerwgurewgrug' {...formik.getFieldProps('city')}>
                                                <option selected value="">Select</option>
                                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'source'})}</label>
                                        <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('lead_source')}>
                                                <option value=''>Select</option>
                                                {dropdowns.lead_source?.map((task:any, i:any) => {
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                                        <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('transaction_status')}>
                                                <option value=''>Select</option>
                                                {dropdowns.transaction_status?.map((task:any, i:any) => {
                                                    return (
                                                        <option value={task.id} key={i}>{task.option_value}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'team_leader'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                isMulti
                                                options={dropdowns.team_leader}
                                                closeMenuOnSelect={false}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.team_leader?.filter((item:any) => teamLeader?.indexOf(item) !== -1)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setTeamLeader(val);                                                    
                                                }}
                                                placeholder={"Team Leader.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'shared_with'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                isMulti
                                                options={dropdowns.shared_with}
                                                closeMenuOnSelect={false}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.shared_with?.filter((item:any) => sharedWith?.indexOf(item) !== -1)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setSharedWith(val);                                                    
                                                }}
                                                placeholder={"Shared With.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'closed_by'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                isMulti
                                                options={dropdowns.shared_with}
                                                closeMenuOnSelect={false}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.shared_with?.filter((item:any) => closedById?.indexOf(item) !== -1)}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setClosedById(val);                                                    
                                                }}
                                                placeholder={"Closed By.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>
                                                <ReactSelect
                                                options={dropdowns.developer_name}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.developer_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.developer_name?.find((item:any) => contactId == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setDeveloperName(val.id);
                                                }}
                                                placeholder={"Developer Name.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                options={dropdowns.project}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.project?.find((item:any) => property == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setproperty(val.id);                                                    
                                                }}
                                                placeholder={"Project Name.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'client_name'})}</label>
                                        <div className="input-group mb-3">
                                            <div className='w-100'>                                       
                                                <ReactSelect
                                                options={dropdowns.client}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                                getOptionValue={(option:any) => option.id}
                                                value={dropdowns.client?.find((item:any) => client == item.id) ?? []}
                                                classNamePrefix="border-0 "
                                                className={""}
                                                onChange={(val:any) => {
                                                    setClient(val.id);                                            
                                                }}
                                                placeholder={"Client Name.."}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'contact_number'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('contact_number')} className="form-control" onChange={(e) => formik.setFieldValue("contact_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                        </div>
                                    </div><div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'email'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="email" {...formik.getFieldProps('email_id')} className="form-control" />
                                        </div>
                                    </div>                                                
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'tower/block'})} (No. /Name)</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('block_no')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'unit_number'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('unit_no')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'floor_number'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('floor_no')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'BHK_type'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('bhk_type')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'unit_size'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('sizes')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'basic_price'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('basic_price')} className="form-control" onChange={(e) => formik.setFieldValue("basic_price", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">FRC</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('frc')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">PLC</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('plc')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'car_parking_cost'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('car_parking_cost')} className="form-control" onChange={(e) => formik.setFieldValue("car_parking_cost", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={10} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pan_number'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('pan')} className="form-control" onChange={(e) => formik.setFieldValue("pan", e.target?.value.replace(/[^A-Za-z0-9]/g, ""))} maxLength={10} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date_of_birth'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('dob')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'anniversary_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('doa')} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'agreement_value'})}</label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage'})}</label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">AOP %</label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage_value'})}</label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount'})} % <small>(if any)</small></label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount_amount'})}</label>
                                        <div className="input-group mb-3">
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
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'TDS_value'})} @ 5%</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('tds_value')} className="form-control" id='tds_value' onChange={(e:any) => {
                                                formik.setFieldValue("tds_value", e.target?.value.replace(/[^0-9.]/g, ""))}} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount_paid'})}</label>
                                        <div className="input-group mb-3 py-2">
                                            <select className="form-select btn-sm text-start" {...formik.getFieldProps('discount_paid_status')}>
                                                <option value=''>Select</option>
                                                <option value='1'>Yes</option>
                                                <option value='0'>No</option>                                                 
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'revenue'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('revenue')} className="form-control" onChange={(e:any) => {
                                                formik.setFieldValue("revenue", e.target?.value.replace(/[^0-9.]/g, ""))}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Tax Details
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
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
                                        <label htmlFor="basic-url" className="form-label">GST Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('gst_amount')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Gross Brokerage Value</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('gross_brokerage_value')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS % Deducted by Builder</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('tds_per_ded_builder')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('tds_amount')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">After TDS Brokearge</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('after_tds_brokerage')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Actual Receivable Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('actual_receivable_amount')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Incentive%</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('incentive_per')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Incentive Without TDS</label>
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
                                        <label htmlFor="basic-url" className="form-label">Net Incentive Earned</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('net_incentive_earned')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Invoice Status</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('invoice_status')} className="form-control"/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Payment Details
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className='row'>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Raised %</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('raised')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Pending %</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('pending')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Payment Status</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('payment_status')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Amount Received</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('amount_received')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Receiving Date</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('receiving_date')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Pending Brokerage</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('pending_brokerage')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">S GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('s_gst_2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">C GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('c_gst_3')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">I GST %</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('i_gst_4')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">GST Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="date" {...formik.getFieldProps('gst_amount2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Gross Brokerage Value</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('gross_brokerage_value2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS % Deducted by Builder</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('tds_reducted_by_builder3')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">TDS Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('tds_amount2')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">After TDS Brokearge</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('after_tds_brokearge5')} className="form-control"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">Pending Receivable Amount</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik.getFieldProps('pending_receivable_amount')} className="form-control"/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
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
    )
}

export {TransactionForm}