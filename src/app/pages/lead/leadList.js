import React,{FC, useState, useEffect} from 'react'
import {useAuth} from '../../../app/modules/auth'
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import { getLeads, getLeadDropdowns, saveLeadNotes, updateLeadStatus } from './core/_requests'
import Moment from 'moment';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
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
import { Offcanvas, Toast } from 'bootstrap';

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
  subject: '',
  message: '',
  reply: '',
  to: '',
}

const LeadList = (props) => {
  const intl = useIntl();
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);
    const {
      body, leadStatus, leadTypeChange, openModal, leadListView
       } = props

    const [lead, setLead] = useState([]);
    const [city, setCity] = useState([]);
    const {currentUser, logout} = useAuth();
    const [pageHeight, setPageHeight] = useState('');
    const [lostStatus, setLostStatus] = useState(null);
    const [leadId, setLeadId] = useState(null);

    const columns = [
      // { title: 'Id', field: 'id'},
      { title: "Sl.No", render: rowData => lead?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
      { title: 'Client Name', field: 'contact_name' },
      { title: 'Contact Number', field: 'contact_mobile', render: rowData => <a href={"tel:" + rowData.contact_mobile} className="mb-0 d-flex flex-wrap text-dark">
      <span><img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" /></span>
          {rowData.contact_mobile}
    </a> },
      { title: 'Email', field: 'contact_email', render: rowData => <a href={"mailto:" + rowData.contact_email} className="mb-0 fixed_text text-dark">{rowData.contact_email}</a> },
      { title: 'Project', field: 'property_name' },
      { title: 'Assigned To', field: 'assign_to_name', render: rowData => rowData.assign_to_name?.split(',')?.map(item => item.split('-')[0]).join(', ')},
      { title: 'Source', field: 'lead_source_name' },
      { title: 'Property Type', field: 'property_type_name' },
      { title: 'Location', field: 'loc_name'},
      { title: 'Bedroom Min', field: 'no_of_bedrooms_min' },
      { title: 'Bedroom Max', field: 'no_of_bedrooms_max' },
      { title: 'Builtup Area Min', field: 'built_up_area_min' },
      { title: 'Builtup Area Max', field: 'built_up_area_max' },
      { title: 'Budget Min', field: 'budget_min', render: rowData => rowData.budget_min?.slice(0, -5) },
      { title: 'Budget Max', field: 'budget_max', render: rowData => rowData.budget_max?.slice(0, -5) },
      { title: 'Posession', field: 'possession_status_name', render: rowData => rowData.possession_status_name?.split(',')?.map(item => item.split('-')[0]).join(', ') },
      { title: 'Lead Priority', field: 'lead_priority_name' },
      { title: 'created_by', field: 'created_by_name' },
      { title: 'Created Date', render: rowData => Moment(rowData.created_at).format('DD-MMMM-YYYY') },
      { title: 'Last Note', field: 'last_note', render: rowData => <p title={rowData.last_note}>{rowData.last_note ? rowData.last_note?.slice(0, 50) : ''}{(rowData.last_note?.length > 50 ? '...' : '')}</p> },
      { title: 'Status', render: rowData => 
      <div className="d-flex">
        <div>
          <select className={`form-select toggle_white toggle_white ${rowData.lead_status == 52 ? 'btn-light border' : rowData.lead_status == 53 ? 'btn-primary' : rowData.lead_status == 54 ? 'btn_primary' : rowData.lead_status == 55 ? 'btn-info' : rowData.lead_status == 56 ? 'btn-dark' : rowData.lead_status == 57 ? 'btn-warning' : rowData.lead_status == 58 ? 'btn-success' : rowData.lead_status == 59 ? 'btn-secondary' : rowData.lead_status == 60 ? 'btn-danger' : rowData.lead_status == 61 ? 'btn-success' : rowData.lead_status == 62 ? 'btn-danger' : 'btn-pink'} rounded-pill btn-sm cursor-pointer status_btn`} aria-label="Default select example" id={'eihriugggefvkdjfgdyfiuegjhrwbe' + rowData.id} onChange={(e) => leadTypeChange(e.target.value, rowData)}>
              {leadStatus?.map((statusVal,i) =>{
                  return (
                      <option value={statusVal.id} selected={statusVal.id == rowData.lead_status} key={i}>{statusVal.option_value}</option> 
              )})}
          </select>
        </div>
        <a href='#' className="d-flex align-items-center justify-content-center" onClick={() => openModal(rowData.id, 'overview')}>
          <span className="svg-icon svg-icon-muted svg-icon-2 ms-2">
              <img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" width="24" height="24"/>
          </span>
        </a>
      </div> },
  ];

  const leadDropdowns = async () => {
    const response = await getLeadDropdowns();      
    setCity(response.output?.city)
}

const leadListByRole =  async () => {
  const characterResponse = await getLeads({
    ...body,
    "limit": '',
  })
  setLead(characterResponse?.output);
}
    
const notesFormSchema = Yup.object().shape({
  reply: Yup.string(),
})

const formikNotes = useFormik({
  initialValues,
  validationSchema: notesFormSchema,
  onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
  //   setIsLoading(true)
    try {
      var notesBody = {
          "reply": values.reply,
          "lead_id": leadId,
          "parent_id": 0
      };
                     
      const leadNotesData = await saveLeadNotes(notesBody)

      if(leadNotesData != null){
          // setIsLoading(false);
          resetForm();
      //   var toastEl = document.getElementById('myToastUpdate');
      //   const bsToast = new Toast(toastEl!);
      //   bsToast.show();                
      }

      const body = {
          "status": lostStatus
      }
      const updateTask = await updateLeadStatus(leadId, body);
      if(updateTask.status == 200){
          // var toastEl = document.getElementById('myToastStatus');
          // const bsToast = new Toast(toastEl!);
          // bsToast.show();
          leadListByRole();
      }

    } catch (error) {
      console.error(error)
      setStatus('The registration details is incorrect')
      setSubmitting(false)
      // setIsLoading(false)
    }
  },
})

    const setHeight = () => {
      let heigh ;
      if(window.innerHeight > 720) {
        heigh = '650px'
      } else {
        heigh = '550px'
      }
      setPageHeight(heigh)
    } 

    useEffect(() => {
      setHeight();
    }, [window.innerHeight]);

    useEffect(() => {
      // leadListByRole();
      // leadDropdowns();
    }, [body]);

    return (
      <div style={{ maxWidth: '100%' }} className="position-relative" >
        <div>
        </div>
        <MaterialTable className="p-3"
          icons={tableIcons}
          columns={columns}
          data={leadListView}
          title="Leads List"
          options={{
            actionsColumnIndex: -1,
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500, lead.length],
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
      </div>
    )
}

export {LeadList}

