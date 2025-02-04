import React,{useState, useEffect, useRef} from 'react'
import MaterialTable, {MTableToolbar} from 'material-table'
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

const ContactList = (props) => {
  const intl = useIntl();
  const {
      contactList, handleStatus, formikNotes, cancelStatusChange, selectedStatus, contactDropReason, contactStatus, reassignDropdown, openLeadForm, openModal, openTaskForm, setDeleteId
      } = props

  const [pageHeight, setPageHeight] = useState('');
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);

  console.log("rktgytgugtitiutert", permissions);
      
  const columnsResidential = [
  { title: "Sl.No", render: rowData => contactList?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
//   { title: `${intl.formatMessage({id: 'contact_type'})}`, field: 'contact_type_name' },
  { title: `${intl.formatMessage({id: 'name'})}`, field: 'first_name', render: rowData => rowData.first_name + ' ' + rowData.last_name},
  { title: `${intl.formatMessage({id: 'contact_no'})}`, field: 'mobile', render: rowData => <a href={"tel:" + rowData.mobile} className="mb-0 d-flex flex-wrap text-dark">
  <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
      {rowData.mobile}
</a> },
  { title: `${intl.formatMessage({id: 'email'})}`, field: 'email', render: rowData => <a href={"mailto:" + rowData.email} className="mb-0 fixed_text text-dark">{rowData.email}</a> },
  { title: `${intl.formatMessage({id: 'project'})}`, field: 'property_name' },
  { title: `${intl.formatMessage({id: 'source'})}`, field: 'source_name' },
  { title: 'created_by', field: 'created_by_name' },
  { title: `${intl.formatMessage({id: 'created_date'})}`, field: 'created_at', render: rowData => Moment(rowData.created_date).format('DD-MMMM-YYYY hh:mm a')},
  { title: `${intl.formatMessage({id: 'assigned_to'})}`, field: 'assign_to_name', render: rowData => rowData.assign_to_name?.split(',').map((item) => item.split('-')[0])?.join(', ')}, 
  { title: `${intl.formatMessage({id: 'last_note'})}`, field: 'last_note', render: rowData => <p title={rowData.last_note}>{rowData.last_note?.slice(0, 50) ?? ''}{(rowData.last_note?.length > 50 ? '...' : '') ?? <span>...</span>}</p>}, 
//   { title: `${intl.formatMessage({id: 'last_task_date'})}`, field: 'last_task_date'},   
//   { title: `${intl.formatMessage({id: 'next_task_date'})}`, field: 'next_task_date'}, 
  { title: `${intl.formatMessage({id: 'status'})}`, field: 'contact_status_name', render: rowData =><>
  <div className="d-flex">
  <select className={`form-select toggle_white toggle_white ${rowData.contact_status == 2 ? 'btn-primary' : rowData.contact_status == 3 ? 'btn-success' : rowData.contact_status == 4 ? 'btn-danger' : rowData.contact_status == 5 ? 'btn-warning' : rowData.contact_status == 6 ? 'btn-pink' : rowData.contact_status == 6 ? 'btn-info' : 'btn_primary'} rounded-pill btn-sm cursor-pointer status_btn`} id={'rkheiurgteriougteirutgeri' + rowData.id} aria-label="Default select example" onChange={event => handleStatus(event, rowData)}>
      <option disabled selected>{intl.formatMessage({id: 'status'})}</option>
      {contactStatus?.map((contactStatusValue,i) =>{
        return (
            <option value={contactStatusValue.id} selected={contactStatusValue.id == rowData.contact_status} key={i}>{contactStatusValue.option_value}</option> 
        )})}
  </select>
    <a href='#' className='d-flex align-items-center justify-content-center' id={'overview'+rowData.id} onClick={() => openModal(rowData.id, 'overview')}>
        <span className="svg-icon svg-icon-muted svg-icon-2 ms-2">
            <img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" width="24" height="24"/>
        </span>
    </a>

  <button id={'open_the_lead_form'+rowData.id} className="dropdown-item d-none" onClick={() => openLeadForm(rowData)}>{intl.formatMessage({id: 'convert_to_lead'})}</button>
  <button id={'ljgheoiuteeritgeritgi'+rowData.id} className="dropdown-item d-none" onClick={() => openTaskForm(rowData)}>{intl.formatMessage({id: 'convert_to_task'})}</button>

</div>
</>},
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
                      <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => cancelStatusChange()} data-bs-dismiss='modal'>
                      <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                      </div>
                  </div>
                  <div className='modal-body py-lg-10 px-lg-10'>
                      <form noValidate onSubmit={formikNotes.handleSubmit}>
                          {selectedStatus == 7 &&
                            <div className="input-group mb-3">
                                <select 
                                {...formikNotes.getFieldProps('reassign_to')}  
                                className="form-select main_bg w-100 br_10 text-gray-600">
                                <option value="" selected disabled hidden>Select</option>
                                    {reassignDropdown.map((contactStatusValue,i)=> {
                                    return (
                                        <option value={contactStatusValue.user_id} key={i}>{contactStatusValue.user_name}</option>
                                    )
                                    })} 
                                </select>      
                            </div>}
                            {selectedStatus == 6 &&
                            <div className="input-group mb-3">
                                <select 
                                {...formikNotes.getFieldProps('reason_id')} 
                                onChange={(e) => {
                                    formikNotes.setFieldValue('reason_id', e.target.value)
                                    formikNotes.setFieldValue('reply', contactDropReason.find(item => item.id == e.target.value)?.option_value)
                                }} 
                                className="form-select main_bg w-100 br_10 text-gray-600">
                                <option value="" selected disabled >Select</option>
                                    {contactDropReason.map((contactStatusValue,i)=> {
                                    return (
                                        <option value={contactStatusValue.id} key={i}>{contactStatusValue.option_value}</option>
                                    )
                                    })} 
                                </select>      
                            </div>}
                          <div>
                              <textarea
                                  className='form-control main_bg p-2 resize-none min-h-25px br_10'
                                  data-kt-autosize='true'
                                  {...formikNotes.getFieldProps('reply')} 
                                  rows={7}
                                  placeholder={intl.formatMessage({id: 'reason'})}
                              ></textarea>
                              {formikNotes.touched.reply && formikNotes.errors.reply && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                  <span role='alert' className='text-danger'>{formikNotes.errors.reply}</span>
                                  </div>
                              </div>
                              )}
                          </div>
                          <div className='d-flex align-items-center justify-content-end'>
                              <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={(e) => cancelStatusChange()}>
                                  {intl.formatMessage({id: 'no'})}
                              </button>
                              <button className='d-none' id="eljfhuywetgrtlyr8hkj" data-bs-dismiss='modal' type='button'>
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
          data={contactList}
          title="Contacts List"
          options={{
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500, contactList.length],
            actionsColumnIndex: -1,
            maxBodyHeight: pageHeight,
            // exportButton: permissions.export == 1 ? true : false,
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

export {ContactList}