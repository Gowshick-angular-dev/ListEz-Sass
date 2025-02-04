import React,{useState, useEffect, useRef} from 'react'
import MaterialTable from 'material-table'
import Moment from 'moment';
import { forwardRef } from 'react';
import {useIntl} from 'react-intl';
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
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers';

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

const TransactionListView = (props) => {
  const intl = useIntl();
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);
  const {
    formikNotes, cancelUpdate, transactionsListData, transactionStatusChange, transactionStatus, openModal
      } = props

  const [pageHeight, setPageHeight] = useState('');
      
  const columnsResidential = [
  { title: "Sl.No", render: rowData => transactionsListData?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
  { title: `${intl.formatMessage({id: 'contact_name'})}`, field: 'contact_client_name' },
  { title: `${intl.formatMessage({id: 'email'})}`, field: 'email_id', render: rowData => <a href={"mailto:" + rowData.email_id} className="mb-0 fixed_text text-dark">{rowData.email_id}</a> },
  { title: `${intl.formatMessage({id: 'contact_no'})}`, field: 'contact_number', render: rowData => <a href={"tel:" + rowData.contact_number} className="mb-0 d-flex flex-wrap text-dark">
  <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
      {rowData.contact_number}
  </a> },
  { title: `${intl.formatMessage({id: 'developer_name'})}`, field: 'developer_full_name'},
  { title: `${intl.formatMessage({id: 'team_leader'})}`, field: 'team_leader_name', render: rowData => rowData.team_leader_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
  { title: `${intl.formatMessage({id: 'shared_with'})}`, field: 'shared_with_name', render: rowData => rowData.shared_with_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
  { title: `${intl.formatMessage({id: 'closed_By'})}`, field: 'closed_by_name', render: rowData => rowData.closed_by_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
  { title: `${intl.formatMessage({id: 'locality'})}`, field: 'city_name' },
  { title: `${intl.formatMessage({id: 'booked_date'})}`, field: 'booking_date', render: rowData => Moment(rowData.booking_date).format('DD-MMMM-YYYY') == "Invalid date" ? '' : Moment(rowData.booking_date).format('DD-MMMM-YYYY')},
  { title: `${intl.formatMessage({id: 'project'})}`, field: 'property_name_of_building' },
  { title: `${intl.formatMessage({id: 'basic_price'})}`, field: 'basic_price', render: rowData => parseInt(rowData.basic_price) == 0 ? '' : parseInt(rowData.basic_price)},
  { title: `${intl.formatMessage({id: 'agreement_value'})}`, field: 'agreement_value', render: rowData => parseInt(rowData.agreement_value) == 0 ? '' : parseInt(rowData.agreement_value)},
  { title: `${intl.formatMessage({id: 'cashback'})}`, field: 'discount_value', render: rowData => parseInt(rowData.discount_value) == 0 ? '' : parseInt(rowData.discount_value)},
  { title: `${intl.formatMessage({id: 'source'})}`, field: 'source_name' },
  { title: `${intl.formatMessage({id: 'created_by'})}`, field: 'created_by_name' },
  { title: `${intl.formatMessage({id: 'created_date'})}`, field: 'created_at', render: rowData => Moment(rowData.created_at).format('DD-MMMM-YYYY hh:mm a')}, 
  { title: `${intl.formatMessage({id: 'status'})}`, field: 'transaction_status', render: rowData => 
    <div className="d-flex">
        <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" id={'statusChangeTransaction' + rowData.id} aria-label="Default select example" onChange={(e) => transactionStatusChange(e.target.value, rowData)}>
            {transactionStatus.map((contactStatusValue,i) =>{
                return (
                    <option value={contactStatusValue.id} selected={contactStatusValue.id == rowData.transaction_status} key={i}>{contactStatusValue.option_value}</option> 
            )})}
        </select>
        <a href='#' className="d-flex align-items-center justify-content-center" onClick={() => openModal(rowData, 'overview')}>
          <span className="svg-icon svg-icon-muted svg-icon-2 ms-2">
              <img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" width="24" height="24"/>
          </span>
        </a>
    </div>},
  ];

    const setHeight = () => {
      let heigh;
      if(window.innerHeight > 720) {
        heigh = '650px'
      } else {
        heigh = '550px'
      }
      setPageHeight(heigh)
    }
 
    useEffect(() => {
      setHeight()
    }, [window.innerHeight]);  

    return (<>    
        <a className="d-none" href="#" data-bs-toggle='modal' id={'contact_status_pop'} data-bs-target={'#contact_status_changegvubfg'}></a>
        <div className='modal fade' id={'contact_status_changegvubfg'} aria-hidden='true' data-bs-keyboard="false" data-bs-backdrop="static" tabIndex={-1}>
          <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content'>
                  <div className='modal-header'>
                      <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                      <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={cancelUpdate} data-bs-dismiss='modal'>
                      <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                      </div>
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
      <div style={{ maxWidth: '100%' }} >
        <MaterialTable className="p-3"
          enableRowNumbers={true}
          icons={tableIcons}
          columns={columnsResidential}
          data={transactionsListData}
          title="Transactions List"
          options={{
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500, transactionsListData.length],
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
        />
      </div>
      </>)
}

export {TransactionListView}