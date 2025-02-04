import React,{FC, useState, useEffect} from 'react'
import {useAuth} from '../../../app/modules/auth'
import Moment from 'moment';
import MaterialTable from 'material-table'
import { forwardRef } from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import { updatePropertyStatus } from './core/_requests';
import { Offcanvas, Toast } from 'bootstrap';
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

const PropertyListView = (props) => {
    const intl = useIntl();
    const permis = sessionStorage.getItem('permissions');
    const permissions = JSON.parse(permis);
    const {
        propertyListView, propertyStatus, propertyStatusChange, openModal
       } = props
    
    const columns = [
        { title: "Id", field: 'id', width: '50' },
        { title: 'Property', field: 'name_of_building' },
        { title: 'Contact Name', field: 'contact_name' },
        { title: 'Location', field: 'locality' },
        { title: 'Property Type', field: 'property_type_name' },
        { title: 'Segment', field: 'segment_name' },
        { title: 'Features', field: 'project_unit_type', width: '500', render: rowData => <div className='mb-3 w-300px'>
          <div className="row">
              <div className="col-xl-12">
                  <div className="accordion" id="accordionPanelsStayOpenExample">
                      {rowData.project_unit_type != null ? 
                      <div className="accordion-item border-0">
                          <p className="accordion-header" id="panelsStayOpen-headingOne">
                              <button className="accordion-button collapsed py-2 px-xxl-5 px-md-4 px-3 text-dark fw-bold fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_features"+rowData.id} aria-expanded="true" aria-controls={"property_features"+rowData.id}>
                                  {intl.formatMessage({id: 'project_features'})}
                              </button>
                          </p>                                                        
                          <div id={"property_features"+rowData.id} className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                              <div className="accordion property_accordion px-2 py-1" id="property_accordion2">
                              {JSON.parse(rowData.project_unit_type)?.map((unitData, index) => {
                              return (
                                  <>
                                  <div className="accordion-item px-xxl-4" key={index}>
                                      <p className="accordion-header d-flex justify-content-between fs-8" id={"headingTwo"}>
                                          <button className="accordion-button collapsed fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_info"} aria-expanded="false" aria-controls={"property_info"}>
                                          <img src={toAbsoluteUrl('/media/custom/lead/bhk_4.svg')} className="svg_icon me-1" alt='' />
                                          <span className='fs-8'>{unitData.unit_type}</span>
                                          </button>
                                          <p className='mb-0 fs-8'>{unitData.builtup_area_min}-{unitData.builtup_area_max} Sqft</p>         
                                      </p>
                                      <div id={"property_info"} className="accordion-collapse collapse" aria-labelledby={"headingTwo"} data-bs-parent="#property_accordion2">
                                          <div className="accordion-body px-0 py-2">
                                              <div className="d-flex justify-content-between">
                                              <p className='mb-0 fs-8'>{unitData.price_min}-{unitData.price_max} {unitData.currency_name}</p>
                                                  <p className='mb-0 fs-8'>{unitData.total_units} Units</p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  </>
                                  )})}
                              </div>
                          </div>
                      </div> 
                      : <>
                      <div className="accordion-item border-0">
                          <p className="accordion-header" id="panelsStayOpen-headingOne">
                              <button className="accordion-button collapsed py-2 px-xxl-5 px-md-4 px-3 text-dark fw-bold fs-8" type="button" data-bs-toggle="collapse" data-bs-target={"#property_features"+rowData.id} aria-expanded="true" aria-controls={"property_features"+rowData.id}>
                                  {intl.formatMessage({id: 'poject_features'})}
                              </button>
                          </p>
                          <div id={"property_features"+rowData.id} className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                              <div className='accordion-item px-xxl-4 mb-1 fs-8'>
                              {intl.formatMessage({id: 'no_features_available'})}
                              </div>
                          </div>
                          </div>
                      </>}                                        
                  </div>                
              </div>
          </div>
      </div> },
        { title: 'Assigned To', field: 'assign_to_name', render: rowData => rowData.assign_to_name?.split(',')?.map(item => item.split('-')[0]).join(', ') },
        { title: 'created_by', field: 'created_by_name' },
        { title: 'Created Date', field: 'created_at', render: rowData => Moment(rowData.created_at).format('DD-MMMM-YYYY') },  
        { title: 'Status', render: rowData => <div className="d-flex">
          <select className="form-select toggle_white toggle_white btn_primary rounded-pill btn-sm cursor-pointer status_btn" aria-label="Default select example" id={'property_statusnkjkjb_rgkbjtyrtyrtyryrt'+rowData.id} value={rowData.property_status} onChange={(e) => {
            propertyStatusChange(e, rowData);
            document.getElementById('property_statusnkjkjb_rgkbjtyrtyrtyryrt'+rowData.id).value = rowData.property_status?.toString();
            }}>
              {propertyStatus.map((statusVal,i) =>{
                  return (
                      <option value={statusVal.id} key={i}>{statusVal.option_value}</option>
              )})}
          </select>
          <a href='#' className='d-flex align-items-center justify-content-center' onClick={() => openModal(rowData, 'overview')} id="kt_property_add_form_toggle">
            <span className="svg-icon svg-icon-muted svg-icon-2 ms-2">
                <img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" width="24" height="24"/>
            </span>
        </a>
      </div> },  
    ];

    const [pageHeight, setPageHeight] = useState('');
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
      setHeight()
    }, [window.innerHeight]);

    return (<>
      <div style={{ maxWidth: '100%'}} > 
        <MaterialTable className="p-3"
          icons={tableIcons}
          columns={columns}
          data={propertyListView}
          title="Projects List"
          options={{
            actionsColumnIndex: -1,
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500, propertyListView.length],
            maxBodyHeight: pageHeight,
            exportButton: permissions.export == 1 ? true : false,
            columnsButton: true,
            headerStyle: {
                backgroundColor: '#ececec',
                color: '#000'
            },
            rowStyle: {
                backgroundColor: '#fff',
            }
          }}
        />
      </div>
      </>)}

export {PropertyListView}