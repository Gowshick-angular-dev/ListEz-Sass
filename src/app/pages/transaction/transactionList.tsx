import React,{FC, useEffect, useState} from 'react';
import { Offcanvas, Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';
import { deleteTrnsaction, getTrnsactions, saveTransactionNotes, updateTransactionStatus } from './core/_requests';
import { TransactionToolbar } from './transactionToolbar';
import Moment from 'moment';
import { TransactionDetails } from './transactionDetails';
import { useAuth } from '../../modules/auth';
import { TransactionDrawer } from './transactionDrawer';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import { useIntl } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getMasters } from '../settings/orgMasters/core/_requests';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TransactionListView } from './transactionListView';

const initialValues = {
    reply: "",
}

const TransactionList: FC = () => {
    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionsCount, setTransactionsCount] = useState<any>('');
    const [id, setId] = useState<any>('');
    const [status, setStatus] = useState<any>('');
    const [detailData, setDetailData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [detailTab, setDetailTab] = useState('');
    const [view, setView] = useState('grid');
    const [detailClick, setDetailClick] = useState(false);
    const [transactionCheckList, setTransactionCheckList] = useState<any[]>([]);
    const [transactionStatus, setTransactionStatus] = useState<any[]>([]);
    const [transactionsListData, setTransactionsListView] = useState<any[]>([]);
    const [body, setBody] = useState<any>({
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
    })

    const mastersList = async() => {
        const response = await getMasters("transaction_status")
        setTransactionStatus(response.output?.reverse());
    }

    const transactionsList =  async () => {
        setLoading(true);
        const Response = await getTrnsactions(body)
        setBody({...body, limit: 12})
        setTransactions(Response.output);
        setTransactionsCount(Response.count);
        setLoading(false);
    }

    const transactionsListView =  async () => {
        const Response = await getTrnsactions({...body, limit: ''})
        setTransactionsListView(Response.output);
    }

    const TransactionsListReload =  async () => {
        let hgdf = {
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
        const Response = await getTrnsactions(hgdf)
        setBody({...hgdf, limit: 12})
        setTransactions(Response.output);
        setTransactionsCount(Response.count);
        const response = await getTrnsactions({...hgdf, limit: ''})
        setTransactionsListView(response.output);
    }

    const transactionsFilterView =  async () => {
        const Response = await getTrnsactions({...body, limit: 0})
        setBody({...body, limit: 12})
        setTransactions(Response.output);
        setTransactionsCount(Response.count);
        const response = await getTrnsactions({...body, limit: ''})
        setTransactionsListView(response.output);
    }

    const openModal = (Id:any, tabType:any) => {
        setDetailData(Id);
        setDetailTab(tabType);
        setDetailClick(true);
        document.body.className += ' detail_opened';
        var offCanvasEl = document.getElementById('kt_expand');
        offCanvasEl?.classList.remove('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.show();
    }

    const transactionDelete = async (id:any) => {
        const response = await deleteTrnsaction(id)
        if (response != null) {
            // transactionsList()
            TransactionsListReload();
            var toastEl = document.getElementById('deleteTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }
    }

    const transactionOnSelect = (e:any, id:any) => {
        const newArr = [...transactionCheckList];
        if(e.target.checked != false){
            setTransactionCheckList(transactionCheckList => [...transactionCheckList, id]);
        } else {
            newArr.splice(newArr.findIndex(item => item === id), 1);
            setTransactionCheckList(newArr);
        }
        console.log(transactionCheckList);
    }

    const transactionListLazyLoad = async () => {
        const Response = await getTrnsactions(body)
        setTransactions((data) => [...data, ...Response.output]);
        setBody({...body, limit: transactions.length + 12})
    }

    const sortByOnChange = async (sort:any) => {
        setLoading(true);
        const Response = await getTrnsactions({...body, sortby: sort, limit: 0})
        setBody({...body, sortby: sort, limit: 12});
        setTransactions(Response.output);
        setLoading(false);
        document.getElementById('transactionListReload')?.click();
    }

    const transactionStatusChange = (event:any, tData:any) => {
        setId(tData.id);
        setStatus(event);
        (document.getElementById('statusChangeTransaction' + tData.id) as HTMLInputElement).value = tData.transaction_status?.toString();
        document.getElementById('transaction_status_pop')?.click();
    }

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string().required('Give a reason to change status'),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          try {    
                let body = {
                    "transaction_status": status,
                    "reply": values.reply,
                    "module_id": id,
                    "module_name": 5,
                    "parent_id": 0
                }
            const updateStatus = await updateTransactionStatus(id, body);
            if(updateStatus.status == 200) {
                await saveTransactionNotes(body)
                document.getElementById('transaction_status_pop')?.click(); 
                resetForm();               
                setTransactions(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === id);                    
                    if (objectToUpdate) {
                      objectToUpdate.transaction_status = status;
                    }                    
                    return updatedData;
                });
                setTransactionsListView(prevData => {
                    const updatedData = [...prevData];
                    const objectToUpdate = updatedData.find(obj => obj.id === id);                    
                    if (objectToUpdate) {
                      objectToUpdate.transaction_status = status;
                    }                    
                    return updatedData;
                });
                var toastEl = document.getElementById('statusUpdateTransaction');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else if(updateStatus.status == 404) {
                document.getElementById('transaction_status_pop')?.click();
                var toastEl = document.getElementById('taskNotUpdated');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            var toastEl = document.getElementById('errMsgTransaction');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setSubmitting(false)
          }
        },
    })

    const cancelUpdate = () => {
        formikNotes.setFieldValue("reply", '');
        setId('');
        var toastEl = document.getElementById('transactionNotUpdated');
        const bsToast = new Toast(toastEl!);
        bsToast.show();
    }

    const layoutOnChange = (view:any) => {
        setView(view);
    }

    useEffect(() => {
        transactionsList();
        transactionsListView();
        mastersList();
    }, []);

    return(
        <div className="transaction_page">
            <div className='d-none'>
                <ThemeBuilder/>
            </div>
            <TransactionToolbar sortByOnChange={sortByOnChange} body={body} transactionCheckList={transactionCheckList} layoutOnChange={layoutOnChange} transactionsCount={transactionsCount}/>
            <TransactionDrawer body={body} setBody={setBody} setTransactions={setTransactions} setTransactionsCount={setTransactionsCount} />
            <button type='button' className='d-none' onClick={TransactionsListReload} id='transactionReload' ></button>
            <button type='button' className='d-none' onClick={transactionsListView} id='transactionListReload' ></button>
            <button type='button' className='d-none' onClick={transactionsFilterView} id='transactionReloadFilter' ></button>
            <a className="d-none" href="#" data-bs-toggle='modal' id='transaction_status_pop' data-bs-target={'#transaction_status_change'}></a>
            <div className='modal fade' id={'transaction_status_change'} tabIndex={-1} role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={cancelUpdate}>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                            <button className='d-none' data-bs-dismiss='modal' id='kjgfuyeurygwerjhq'>close</button>
                        </div>
                        <div className='modal-body py-lg-10 px-lg-10'>
                            <form noValidate onSubmit={formikNotes.handleSubmit}>
                                <textarea
                                    className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10'
                                    data-kt-autosize='true'
                                    {...formikNotes.getFieldProps('reply')} 
                                    rows={7}
                                    placeholder='Reason'
                                ></textarea>
                                {formikNotes.touched.reply && formikNotes.errors.reply && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                    <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                    </div>
                                </div>
                                )}
                                <div className='d-flex align-items-center justify-content-end'>
                                    <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={cancelUpdate}>
                                        {intl.formatMessage({id: 'no'})}
                                    </button>
                                    <button disabled={formikNotes.isSubmitting} className='btn btn-sm btn_primary text-primary mt-3' type='submit'>
                                        {intl.formatMessage({id: 'yes'})}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="AddTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'transaction_created_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="updateTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'transaction_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="deleteTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'transaction_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="noteSaveTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'note_saved_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="noteUpdateTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'note_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="noteDeleteTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'note_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="saveFilesTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'files_saved_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="deleteFilesTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'files_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="filterSaveTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'filter_saved_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="filterTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'filter_applied_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="filterResetTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'filter_reset_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="statusUpdateTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'status_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="errMsgTransaction">
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
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="filterLimitTransaction">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'filter_limit_reached__delete_some_filter_to_add_new'})}!</div>
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
            </div> :  <> 
            {detailClick && detailData &&
                <div
                    id={'kt_transaction_details_toggle'+detailData?.id}
                    className='expand_area detail_page_view offcanvas offcanvas-end justify-content-end w-100 bg-transparent d-flex'
                >
                    <TransactionDetails transactionId={detailData} setDetailClicked={setDetailClick} detailTab={detailTab} body={body} />
                </div>}
            {view == 'grid' ?          
            <div className="row">                
            <InfiniteScroll
                dataLength={transactions.length}
                next={transactionListLazyLoad}  
                hasMore={transactionsCount > transactions.length}
                loader={<>
                {transactionsCount != transactions.length &&
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div>}
                </>}
                endMessage={<>
                {transactions.length == 0 ?
                <div className='w-100 d-flex justify-content-center'>
                    <div>
                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                        <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                    </div>
                </div> : 
                <div className='w-100 d-flex justify-content-center'>
                    <div>
                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" />
                        <h4>{intl.formatMessage({id: 'no_more_transactions_to_show'})}!!!</h4>
                    </div>
                </div>}</>}
            >
                <div className="card-group">
                    {transactions.map((trans, i) => {
                    return(
                    <div className="col-xxl-4 col-xl-6 col-lg-12 col-md-12 col-sm-12 mb-4" key={i} >
                        <div className="card h-100 mb-5 mb-xl-8 mx-2 bs_1" id={"asdhfafaudyfaiduyfededgh"+trans.id}>
                            <div className='card-body px-3 pt-3 pb-0'>
                                <div className="d-flex align-items-center justify-content-between mb-5">
                                    <div className="d-flex align-items-center">
                                        <form action="">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" onClick={(e) => transactionOnSelect(e, trans.id)} id={"transaction"+trans.id}/>
                                                <label className="form-check-label id_label" htmlFor={"transaction"+trans.id}>
                                                    {trans.id}
                                                </label>
                                            </div>
                                        </form>
                                        <div className="ms-3 ml-2 d-flex align-items-center">
                                            <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="icon me-2" />
                                            <p className="mb-0 contact_name">{trans.contact_client_name}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <a href='#' onClick={() => openModal(trans, 'overview')}><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>
                                        <div className="btn-group">
                                            <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                <li><a className="dropdown-item" href="#"  onClick={() => openModal(trans, 'overview')}>{intl.formatMessage({id: 'edit'})}</a></li>
                                                {currentUser?.designation == 1 && <li><a className="dropdown-item" href="#" data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup_transaction'+trans.id}>{intl.formatMessage({id: 'delete'})}</a></li>}
                                            </ul>
                                        </div>
                                        <div className='modal fade' id={'delete_confirm_popup_transaction'+trans.id} aria-hidden='true'>
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
                                                            <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal'  onClick={() => transactionDelete(trans.id)}>
                                                                {intl.formatMessage({id: 'yes'})}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0">
                                        {/* <img src={toAbsoluteUrl('/media/avatars/300-23.jpg')} className="user_img" alt='' /> */}
                                        <div className="user_img d-flex align-items-center justify-content-center fs-1 fw-bolder bolder bg_primary_lite text-strong text-light">{trans.contact_client_name && trans.contact_client_name[0]?.toUpperCase()}</div> 
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className='d-flex align-items-center mb-3 '>
                                        <a href={'mailto:'+ trans.email_id} className="text-dark d-flex align-items-center">
                                            <img src={toAbsoluteUrl('/media/custom/envelope.svg')} alt="" className="icon me-2"/>
                                            <p className="mb-0 fixed_text">{trans.email_id}</p>
                                        </a>
                                        </div>                                        
                                        <div className="">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <a href={'tel:'+ trans.contact_number} className="mb-0 d-flex flex-wrap text-dark">
                                                    <span>
                                                        <img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-2" />
                                                    </span>
                                                        {trans.contact_number}
                                                </a>
                                                <a href={"https://api.whatsapp.com/send?phone="+ trans.contact_number} target="popup" onClick={(e) => window.open('http://kanishkkunal.com','popup','width=1400,height=800')} className="d-flex align-items-center mb-2 text-dark">
                                                    <p className="mb-0 d-flex flex-wrap">
                                                        <span><img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} alt="" className="icon me-1" /></span>
                                                            {trans.contact_number}
                                                    </p>
                                                </a>
                                            </div>
                                        </div>   
                                    </div>
                                </div>
                                <div className='mb-3 mt-6 transaction_details'>
                                    <div className="row">
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.developer_full_name}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'developer'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.developer_full_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.city_name}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/location_10.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'locality'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.city_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.property_name_of_building}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/project_type.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'project'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.property_name_of_building}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.block_no}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'block_no'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.block_no}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.floor_no}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/floor.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'floor'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.floor_no}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.client_name}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/project_name.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'client'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.client_name}</p>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.team_leader_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/location_10.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'team_leader'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.team_leader_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.bhk_type}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">BHK {intl.formatMessage({id: 'type'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.bhk_type}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.shared_with_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'shared_with'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.shared_with_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.closed_by_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/lead_1.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'closed_by'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.closed_by_name?.split(',').map((item:any) => item.split('-')[0])?.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={(parseInt(trans.basic_price))?.toString()}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/budget_3.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'basic_price'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{parseInt(trans.basic_price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={(parseInt(trans.agreement_value))?.toString()}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/budget_3.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'agreement_value'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{parseInt(trans.agreement_value)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.amount_received}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/budget_3.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'collected'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.amount_received}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.pending_receivable_amount}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/budget_3.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'due'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.pending_receivable_amount}</p>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={(parseInt(trans.discount_value))?.toString()}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/budget_3.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'cashback'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{parseInt(trans.discount_value)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.source_name}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/source_2.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'sources'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.source_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={trans.created_by_name}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'created_by'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{trans.created_by_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={Moment(trans.booking_date).format('DD-MMMM-YYYY') == "Invalid date" ? '--' : Moment(trans.booking_date).format('DD-MM-YYYY')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/created_8.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'booked_date'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{Moment(trans.booking_date).format('DD-MM-YYYY') == "Invalid date" ? '--' : Moment(trans.booking_date).format('DD-MM-YYYY')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={Moment(trans.created_at).format('DD-MMMM-YYYY')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/created_8.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'created_date'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{Moment(trans.created_at).format('DD-MM-YYYY')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-xxl-4 col-xl-3 col-md-2 col-sm-4 col-6 mb-4 py-1" title={Moment(trans.updated_at).format('DD-MMMM-YYYY')}>
                                            <div className="d-flex align-items-center single_item overflow-hidden">
                                                <img src={toAbsoluteUrl('/media/custom/lead/created_8.svg')} className="svg_icon mb-1 me-2" alt='' />
                                                <div className="d-flex flex-column">
                                                    <small className="text_light">{intl.formatMessage({id: 'updated_date'})}</small>
                                                    <p className="mb-0 fw-500 text-nowrap">{Moment(trans.updated_at).format('DD-MM-YYYY')}</p>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="card-footer border-0 p-1">
                                    <div className="row">
                                        <div className="col-7 col-xl-8 icons_bar d-flex flex-wrap">
                                            <a href="#" onClick={() => openModal(trans, 'notes')} id='kt_expand_toggle' className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Notes">
                                                <img src={toAbsoluteUrl('/media/custom/notes.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    {trans.notes_count}
                                                </span>
                                            </a>
                                            <a href="#" onClick={() => openModal(trans, 'files')} id='kt_expand_toggle' className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="File">
                                                <img src={toAbsoluteUrl('/media/custom/file.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    {trans.files_count}
                                                </span>
                                            </a>
                                            <a href="#" onClick={() => openModal(trans, 'task')} id='kt_expand_toggle' className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task">
                                                <img src={toAbsoluteUrl('/media/custom/task.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    0
                                                </span>
                                            </a>
                                            {/* <a href="#" id='kt_expand_toggle' className="btn btn-sm icon_primary rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Message">
                                                <img src={toAbsoluteUrl('/media/custom/message.svg')} className="svg_icon" alt='' />
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    5
                                                </span>
                                            </a>
                                            <a href="#" id='kt_expand_toggle' className="btn btn-sm icon_bg rounded-circle position-relative" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Whatsapp">
                                                <img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt=''/>
                                                <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger">
                                                    13
                                                </span>
                                            </a> */}
                                        </div>
                                        <div className="col-5 col-xl-4 d-flex align-items-center justify-content-end">
                                            <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" id={'statusChangeTransaction' + trans.id} onChange={(e) => transactionStatusChange(e.target.value, trans)} aria-label="Default select example">
                                                {transactionStatus.map((item, i) => {
                                                    return(
                                                        <option value={item.id} selected={item.id == trans.transaction_status} key={i}>{item.option_value}</option>
                                                )})}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )})}
                </div>
            </InfiniteScroll>
            </div> : 
                <TransactionListView formikNotes={formikNotes} cancelUpdate={cancelUpdate} transactionsListData={transactionsListData} transactionStatusChange={transactionStatusChange} transactionStatus={transactionStatus} openModal={openModal} />}
            </>}
        </div>
    )
}

export {TransactionList}