import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Theme, useTheme } from '@mui/material/styles';
import { Toast } from 'bootstrap';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAuth } from '../../modules/auth';
import Moment from 'moment';
import { useIntl } from 'react-intl';
import { deleteFilter, getTransactionDropdowns, getTransactionFilters, getTrnsactions, saveTransactionFilter } from './core/_requests';
import ReactSelect from 'react-select';
import makeAnimated from "react-select/animated";

const initialValues = {
    booking_from_date: '',
    booking_to_date: '',
    city: '',
    source: '',
    team_leader: '',
    shared_with: '',
    closed_by: '',
    developer_name: '',
    project_id: '',
    bhk_type_min: '',
    bhk_type_max: '',
    agreement_value_min: '',
    agreement_value_max: '',
    brokerage_min: '',
    brokerage_max: '',
    brokerage_value_min: '',
    brokerage_value_max: '',
    discount_min: '',
    discount_max: '',
    discount_value_min: '',
    discount_value_max: '',
    revenue_min: '',
    revenue_max: '',
    status: '',
    created_by: '',
    limit: '',
    filter_name: '',
    sortby: '',   
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

type Props = {
    body?: any,
    setBody?: any,
    setTransactions?: any,
    setTransactionsCount?: any,
}

const TransactionFilter:  FC<Props> = (props) => {

    const {
        body, setBody, setTransactions, setTransactionsCount
    } = props        
    const intl = useIntl();
    const theme = useTheme(); 
    const {currentUser, logout} = useAuth();
    const [save, setSave] = useState(false); 
    const [filters, setFilters] = useState<any[]>([]);  
    const [dropdowns, setDropdowns] = useState<any>({});
    const [bookingDate, setBookingDate] = useState<any>('');
    const [city, setCity] = useState<any[]>([]);
    const [teamLeader, setTeamLeader] = useState<any[]>([]);
    const [sharedWith, setSharedWith] = useState<any[]>([]);
    const [property, setproperty] = useState<any[]>([]);
    const [developerName, setDeveloperName] = useState<any[]>([]);
    const [closedBy, setClosedBy] = useState<any[]>([]);
    const [source, setSource] = useState<any[]>([]);
    const [status, setStatus] = useState<any[]>([]);

    const transactionFilterListDelete = async (data:any) => {
        const response = await deleteFilter(data.id);
        if(response.status == 200) {
            filterList();
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object().shape({}),
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
        try {
        const reqBody = {
            ...body,
            'booking_from_date': values.booking_from_date,
            'booking_to_date': values.booking_to_date,
            'city': city.length ? city?.map((item:any) => item.id).join(',').toString() : '',
            'source': source.length ? source?.map((item:any) => item.id).join(',').toString() : '',
            'team_leader': teamLeader.length ? teamLeader?.map((item:any) => item.id).join(',').toString() : '',
            'shared_with': sharedWith.length ? sharedWith?.map((item:any) => item.id).join(',').toString() : '',
            'closed_by': closedBy.length ? closedBy?.map((item:any) => item.id).join(',').toString() : '',
            'developer_name': developerName.length ? developerName?.map((item:any) => item.id).join(',').toString() : '',
            'project_id': property.length ? property?.map((item:any) => item.id).join(',').toString() : '',
            'property_id': property.length ? property?.map((item:any) => item.id).join(',').toString() : '',
            'bhk_type_min': values.bhk_type_min,
            'bhk_type_max': values.bhk_type_max,
            'agreement_value_min': values.agreement_value_min,
            'agreement_value_max': values.agreement_value_max,
            'brokerage_min': values.brokerage_min,
            'brokerage_max': values.brokerage_max,
            'brokerage_percentage_min': values.brokerage_min,
            'brokerage_percentage_max': values.brokerage_max,
            'brokerage_value_min': values.brokerage_value_min,
            'brokerage_value_max': values.brokerage_value_max,
            'discount_min': values.discount_min,
            'discount_max': values.discount_max,
            'discount_percentage_min': values.discount_min,
            'discount_percentage_max': values.discount_max,
            'discount_value_min': values.discount_value_min,
            'discount_value_max': values.discount_value_max,
            'revenue_min': values.revenue_min,
            'revenue_max': values.revenue_max,
            'created_by': values.created_by,
            'status': status?.map((item:any) => item.id).join(',').toString(),
            'filter_name': values.filter_name,
            'limit': 0,
        } 

          if(save) {
            const filterLeadData = await saveTransactionFilter(reqBody);
                if(filterLeadData.status == 200) {
                    filterList();
                    document.getElementById('kt_transaction_filter_close')?.click();
                    resetForm();
                    setTeamLeader([]);
                    setSharedWith([]);
                    setproperty([]);
                    setDeveloperName([]);
                    setClosedBy([]);
                    setCity([]);
                    setSource([]);                  
                    setStatus([]);                  
                    var toastEl = document.getElementById('filterSaveTransaction');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                } else if(filterLeadData.status == 400) {
                    var toastEl = document.getElementById('filterLimitTransaction');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            } 
            else {
                const filterPropertyData = await getTrnsactions(reqBody);
                if(filterPropertyData.status == 200) {
                    setBody({...reqBody, limit: 12});
                    setTransactions(filterPropertyData.output);
                    setTransactionsCount(filterPropertyData.count);
                    document.getElementById('kt_transaction_filter_close')?.click();                   
                    resetForm();
                    setTeamLeader([]);
                    setSharedWith([]);
                    setproperty([]);
                    setDeveloperName([]);
                    setClosedBy([]);
                    setCity([]);
                    setSource([]);
                    setStatus([]);
                    document.getElementById('transactionListReload')?.click();
                    var toastEl = document.getElementById('filterTransaction');
                    const bsToast = new Toast(toastEl!);
                    bsToast.show();
                }
            }
        } catch (error) {
        console.error(error)
        var toastEl = document.getElementById('errMsgTransaction');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        }
    }})

    const dropdownsTransaction = async () => {
        const contactRes = await getTransactionDropdowns();
        setDropdowns(contactRes.output);
    }

    const filterTap =  async (data: any) => {          
        formik.setFieldValue('booking_from_date', data.booking_from_date);
        formik.setFieldValue('booking_to_date', data.booking_to_date);
        formik.setFieldValue('bhk_type_min', data.bhk_type_min);
        formik.setFieldValue('bhk_type_max', data.bhk_type_max);
        formik.setFieldValue('agreement_value_min', data.agreement_value_min);
        formik.setFieldValue('agreement_value_max', data.agreement_value_max);
        formik.setFieldValue('brokerage_min', data.brokerage_percentage_min);
        formik.setFieldValue('brokerage_max', data.brokerage_percentage_max);
        formik.setFieldValue('brokerage_value_min', data.brokerage_value_min);
        formik.setFieldValue('brokerage_value_max', data.brokerage_value_max);
        formik.setFieldValue('discount_min', data.discount_percentage_min);
        formik.setFieldValue('discount_max', data.discount_percentage_max);
        formik.setFieldValue('discount_value_min', data.discount_value_min);
        formik.setFieldValue('discount_value_max', data.discount_value_max);
        formik.setFieldValue('revenue_min', data.revenue_min);
        formik.setFieldValue('revenue_max', data.revenue_max);
        // formik.setFieldValue('status', data.transaction_status);
        formik.setFieldValue('created_by', data.created_by);

        setClosedBy(dropdowns.shared_with?.filter((item:any) => data.closed_by?.split(',')?.indexOf(item.id.toString()) !== -1));        
        setCity(dropdowns.city?.filter((item:any) => data.city?.split(',')?.indexOf(item.id.toString()) !== -1));        
        setTeamLeader(dropdowns.team_leader?.filter((item:any) => data.team_leader?.split(',')?.indexOf(item.id.toString()) !== -1));        
        setSharedWith(dropdowns.shared_with?.filter((item:any) => data.shared_with?.split(',')?.indexOf(item.id.toString()) !== -1));        
        setproperty(dropdowns.project?.filter((item:any) => data.property_id?.split(',')?.indexOf(item.id.toString()) !== -1));        
        setDeveloperName(dropdowns.developer_name?.filter((item:any) => data.developer_name?.split(',')?.indexOf(item.id.toString()) !== -1));     
        setSource(dropdowns.lead_source?.filter((item:any) => data.source?.split(',')?.indexOf(item.id.toString()) !== -1));
        setStatus(dropdowns.transaction_status?.filter((item:any) => data.transaction_status?.split(',')?.indexOf(item.id.toString()) !== -1));
    }

    const resetFilter = async () => {
        let resetBody = {
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
            "limit": 0,
            "sortby": '',
        }
        const filterPropertyData = await getTrnsactions(resetBody);
            if(filterPropertyData.status == 200) {
                setBody({...resetBody, limit: 12});
                document.getElementById('kt_transaction_filter_close')?.click();                   
                formik.resetForm();
                setTeamLeader([]);
                setSharedWith([]);
                setproperty([]);
                setDeveloperName([]);
                setClosedBy([]);
                setCity([]);
                setSource([]);
                setStatus([]);
                setTransactions(filterPropertyData.output);
                setTransactionsCount(filterPropertyData.count);
                document.getElementById('transactionListReload')?.click();
                var toastEl = document.getElementById('filterResetTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }        
    }

    const filterList = async () => {
        const response = await getTransactionFilters()
        setFilters(response.output);
    }

    useEffect(() => {  
        dropdownsTransaction();
        filterList(); 
    }, []);

    return(
        <div className='card shadow-none rounded-0 w-100'>
            <div className='card-header w-100' id='kt_filter_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'transaction_filter'})}</h3>
                <div className='card-toolbar'>
                    <button
                    type='button'
                    className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                    id='kt_transaction_filter_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>
            <div className='card-body position-relative' id='kt_filter_body'>
            <form noValidate onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className={bookingDate ? "col-md-3 col-6 mb-3" : "col-md-6 col-12 mb-3"}>
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'booking_from_date'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <input type="date" className="form-control bg-gray-100 border-0" {...formik.getFieldProps('booking_from_date')} onChange={(e) => {
                                setBookingDate(e.target.value);
                                formik.setFieldValue('booking_from_date', e.target.value);
                            }} placeholder="date"/> 
                        </div>
                    </div>
                    {bookingDate &&
                    <div className="col-md-3 col-6 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'booking_to_date'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <input type="date" min={bookingDate} className="form-control bg-gray-100 border-0" {...formik.getFieldProps('booking_to_date')} placeholder="date"/> 
                        </div>
                    </div>}
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            {/* <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('status')}>
                                <option value=''>select</option>
                                {dropdowns.transaction_status?.map((Data:any, i:any) => {
                            return(
                                <option value={Data.id} key={i}>{Data.option_value}</option>
                                )})}
                            </select>  */}
                            <ReactSelect
                                isMulti
                                options={dropdowns.transaction_status}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.transaction_status?.filter((item:any) => status.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={"w-100 "}
                                onChange={(val:any) => {
                                    setStatus(val);                                                
                                }}
                                placeholder={"Status.."}
                                />     
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'created_by'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <select className="form-select bg-gray-100 border-0" {...formik.getFieldProps('created_by')}>
                                <option value=''>select</option>
                                {dropdowns.shared_with?.map((Data:any, i:any) => {
                                return(
                                <option value={Data.id} key={i}>{Data.first_name + ' '}{Data.last_name ?? ''}</option>
                                )})}
                            </select>      
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bhk_type'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('bhk_type_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('bhk_type_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'agreement_value'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('agreement_value_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('agreement_value_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('brokerage_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('brokerage_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'brokerage_value'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('brokerage_value_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('brokerage_value_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('discount_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('discount_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount_value'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('discount_value_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('discount_value_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'revenue'})}</label>
                        <div className="row">
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Min" {...formik.getFieldProps('revenue_min')}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="input-group bs_2 bg-gray-100 br_10 mb-3">
                                    <input type="number" min="0" className="form-control bg-gray-100 border-0" placeholder="Max" {...formik.getFieldProps('revenue_max')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'source'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.lead_source}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.option_value ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.lead_source?.filter((item:any) => source.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={""}
                                onChange={(val:any) => {
                                    setSource(val);                                                
                                }}
                                placeholder={"Source.."}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'project_name'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.project}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.name_of_building ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.project?.filter((item:any) => property.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={""}
                                onChange={(val:any) => {
                                    setproperty(val);                                                
                                }}
                                placeholder={"Project Name.."}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'developer_name'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.developer_name}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.developer_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.developer_name?.filter((item:any) => developerName.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={""}
                                onChange={(val:any) => {
                                    setDeveloperName(val);                                                   
                                }}
                                placeholder={"Developer Name.."}
                                />
                            </div>
                        </div>
                    </div>                    
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.city}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.city?.filter((item:any) => city.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={""}
                                onChange={(val:any) => {
                                    setCity(val);                                    
                                }}
                                placeholder={"Developer Name.."}
                                />
                            </div>
                        </div>
                    </div>                    
                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'team_leader'})}</label>
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.team_leader}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.team_leader?.filter((item:any) => teamLeader.indexOf(item) !== -1)}
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
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.shared_with}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.shared_with?.filter((item:any) => sharedWith.indexOf(item) !== -1)}
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
                        <div className="input-group mb-3 bs_2 br_10">
                            <div className='w-100'>                                       
                                <ReactSelect
                                isMulti
                                options={dropdowns.shared_with}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                getOptionLabel={(option:any) => option.first_name ?? '--No Name--'}
                                getOptionValue={(option:any) => option.id}
                                value={dropdowns.shared_with?.filter((item:any) => closedBy.indexOf(item) !== -1)}
                                classNamePrefix="border-0 "
                                className={""}
                                onChange={(val:any) => {
                                    setClosedBy(val);                                                    
                                }}
                                placeholder={"Closed By.."}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-footer py-5 text-center filter_footer d-flex flex-column flex-md-row align-items-center justify-content-end'>
                    <div className="mb-3 mb-md-0">
                        <button type='button' className='btn btn-sm btn_soft_primary save_btn p-3 pr-0 mx-3 br_10' data-bs-toggle='modal' data-bs-target={'#task_filter_save_popup'} title="Save">
                            <KTSVG
                                path='/media/custom/save_orange.svg'
                                className='svg-icon-3 svg-icon-primary me-0'
                            />
                        </button>
                        <button type='button' className='btn btn-sm reset_btn mx-3 br_10' onClick={resetFilter}>
                            <i className="fas fa-undo"></i>
                            {intl.formatMessage({id: 'reset'})}
                        </button>
                        <button className='btn btn-sm btn_primary mx-3 br_10' onClick={(e) => setSave(false)}>
                            <KTSVG path='/media/custom/search_white.svg' className='svg-icon-5 svg-icon-gray-500 me-1'
                            />
                            {intl.formatMessage({id: 'search'})}
                        </button>
                    </div>
                    <div className='modal fade' id={'task_filter_save_popup'} aria-hidden='true'>
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h3>{intl.formatMessage({id: 'want_to_save_filter'})}?</h3>
                                    <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                    <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                    </div>
                                </div>
                                <div className='modal-body py-lg-10 px-lg-10'>
                                    <div className="mb-3 text-start">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'filter_name'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" className="input-group btn w-100 text-start input_prepend bg-gray-100 rounded" {...formik.getFieldProps('filter_name')}/> 
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <button type='button' className='btn btn-sm btn-secondary mt-3 me-3' onClick={() => formik.setFieldValue('filter_name', '')} data-bs-dismiss='modal'>
                                            {intl.formatMessage({id: 'no'})}
                                        </button>
                                        <button type='submit' className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => setSave(true)}>
                                            {intl.formatMessage({id: 'yes'})}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {filters.length > 0 &&
            <div className='row'>
                <div className='col-12'>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {intl.formatMessage({id: 'saved_filters'})}
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className='row'>
                                {filters.slice(0, 5)?.map((Data, i) => {
                                return(
                                    <div className='col-x12' key={i}>
                                        <div className='row'>
                                            <div onClick={(e) => filterTap(Data)} className="col-11 d-sm-flex cursor_pointer align-items-center justify-content-between bg_soft rounded py-5 px-4 mb-7">
                                                <a href="#" className="fw-bold text-gray-800 text-hover-primary fs-6">{Data.filter_name}</a>
                                                <span className="text-muted fw-semibold d-block">{Moment(Data.created_at).format("DD-MMMM-YYYY hh:mm a")}</span>
                                            </div>
                                            <span className="col-1 svg-icon svg-icon-4 px-md-5 bg_soft mb-7 d-flex align-items-center rounded-end cursor_pointer px-0" title='delete' onClick={() => transactionFilterListDelete(Data)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>
                    </div>
                </div>                    
                </div>
            </div>}
            </div>
        </div>
    )
}

export {TransactionFilter}