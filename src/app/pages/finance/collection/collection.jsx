import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React,{FC, useEffect, useState} from 'react'
import Moment from 'moment';
import { KTSVG } from '../../../../_metronic/helpers';
import { Toast } from 'bootstrap';
import { deleteCollection, getCollections } from '../core/_requests';
import { CollectionEditForm } from './collectionEdit';
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
import { parse } from 'date-fns';

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

const Collection = (props) => {
    const {dropdowns} = props
    const intl = useIntl();
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const [finance, setFinance] = useState([])
    const [collectionId, setcollectionId] = useState('')
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

    const collections = [
        { title: "Sl.No", render: rowData => finance?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
        { field: 'invoice_number', title: 'Invoice ID', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'transaction_id', title: 'Transaction ID', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'client_fullname', title: 'Client Name', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'developer_fullname', title: 'Developer Name', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'property_name', title: 'Project Name', cellStyle: {whiteSpace: 'nowrap'}},
        { field: 'team_leader_name', title: 'Team Leader ', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'shared_with_name', title: 'Shared with', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'aggrement_value', title: 'Agreement Value', cellStyle: {whiteSpace: 'nowrap'}, render: row => parseInt(row.aggrement_value ?? 0) == 0 ? '' : parseInt(row.aggrement_value)},
        { field: 'brokerage_value', title: 'Brokerage Value', cellStyle: {whiteSpace: 'nowrap'}, render: row => parseInt(row.brokerage_value ?? 0) == 0 ? '' : parseInt(row.brokerage_value) },
        { field: 'total_collection_value', title: 'Collected Amount', cellStyle: {whiteSpace: 'nowrap'}, render: row => parseInt(row.total_collection_value ?? 0) == 0 ? '' : parseInt(row.total_collection_value) },
        { field: 'total_due_value', title: 'Due Amount', cellStyle: {whiteSpace: 'nowrap'}, render: row => parseInt(row.total_due_value ?? 0) == 0 ? '' : parseInt(row.total_due_value) },
        { field: 'due_date', title: 'Due Date', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'lead_source_name', title: 'Source', cellStyle: {whiteSpace: 'nowrap'} },
        { field: 'created_at', title: 'Created on', cellStyle: {whiteSpace: 'nowrap'}, render: row => Moment(row.created_at).format('DD-MMMM-YYYY') == "Invalid date" ? '' : Moment(row.created_at).format('DD-MMMM-YYYY')},
        { field: 'created_name', title: 'Assigned To', cellStyle: {whiteSpace: 'nowrap'} },
        // { field: 'payment_mode', title: 'Mode', cellStyle: {whiteSpace: 'nowrap'} },      
        { field: 'id', render: rowData => <>
        <button className='btn btn-sm btn-icon' title='Edit' onClick={() => collectionEdit(rowData.id)}>
            <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-primary btn-active-bg-gray-400" />
        </button>
        <button className='btn btn-sm btn-icon' title='Delete' onClick={() => collectionDeletePop(rowData.id)}>
            <KTSVG path="/media/icons/duotune/general/gen027.svg" className="svg-icon-muted svg-icon-2 btn-icon btn btn-sm btn-active-color-danger btn-active-bg-gray-400" />
        </button>
        </>, title: 'Actions', cellStyle: {whiteSpace: 'nowrap'} },
      ];


const collectionList = async () => {
        const response = await getCollections()
        setFinance(response.output)
    }

    const collectionEdit = async (id) => {
        setcollectionId(id);
        document.getElementById('kt_collection_details_toggle')?.click();
    }

    const collectionDeletePop = (id) => {
        setcollectionId(id);
        document.getElementById('collectionDeletePopup')?.click();
    }

    const collectionDelete = async () => {
        const response = await deleteCollection(collectionId)
        if(response != null) {
            document.getElementById('collectionReload')?.click();
            var toastEl = document.getElementById('myToastExpenseRemove');
            const bsToast = new Toast(toastEl);
            bsToast.show();
            setcollectionId('');
        }
    }

    useEffect(() => {
        collectionList();
    }, []);

    return(<>
    <div
        id='kt_finance_collection'
        className='bg-white'
        data-kt-drawer='true'
        data-kt-drawer-name='finance_collection'
        data-kt-drawer-activate='true'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'100%', 'md': '700px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_collection_details_toggle'
        data-kt-drawer-close='#kt_collection_details_close'
      >
        <CollectionEditForm collectionsId={collectionId} dropdowns={dropdowns}/>
    </div>
    <button className='d-none' id='collectionReload' onClick={() => collectionList()}>Reload</button>
    <button className='d-none' id='kt_collection_details_toggle'>edit</button>
    <button data-bs-toggle='modal' data-bs-target={'#collection_delete_confirm_popup'} className="d-none" id='collectionDeletePopup'>Delete</button>
    <div className='modal fade' id={'collection_delete_confirm_popup'} aria-hidden='true'>
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
                        <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => collectionDelete()}>
                            {intl.formatMessage({id: 'yes'})}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="expenseAdd">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'collection_created_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="expenseDelete">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'collection_removed_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="expenseUpdate">
            <div className="toast-header">
                <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                <button aria-label="Close" className="btn-close btn-close-color-white" 
                    data-bs-dismiss="toast" type="button">
                </button> 
            </div>
            <div className="toast-body">
                <div>{intl.formatMessage({id: 'collection_updated_successfully'})}!</div>
            </div>
        </div>
        <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="expenseErrMsg">
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
            columns={collections}
            data={finance}
            title="Collections"
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
            <p className='mt-3'>{intl.formatMessage({id: 'no_collections_available'})}</p>
        </div>}
    </>

    )
}

export {Collection}