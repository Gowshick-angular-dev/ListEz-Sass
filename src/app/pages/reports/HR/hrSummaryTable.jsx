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

const HrSummaryTable = (props) => {
  const intl = useIntl();
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);
  const {
      contacts
      } = props

  const [pageHeight, setPageHeight] = useState('');
      
  const columnsResidential = [
  { title: "Sl.No", render: rowData => contacts?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
  { title: `${intl.formatMessage({id: 'user_name'})}`, field: 'user_name'},
  { title: `${intl.formatMessage({id: 'present_days'})}`, field: 'present_count'},
  { title: `${intl.formatMessage({id: 'absent_days'})}`, field: 'absent_count'},
  { title: `${intl.formatMessage({id: 'half_days'})}`, field: 'half_count'},
  { title: `${intl.formatMessage({id: 'sick_leave_days'})}`, field: 'sick_leave'},
  { title: `${intl.formatMessage({id: 'casual_leave_days'})}`, field: 'casual_leave'},
  ];

    const setHeight = () => {
      let heigh;
      if(window.innerHeight > 720) {
        heigh = '350px'
      } else {
        heigh = '250px'
      }
      setPageHeight(heigh)
    }
 
    useEffect(() => {
      setHeight()
    }, [window.innerHeight]);  

    return (<>       
      <div style={{ maxWidth: '100%' }} >
        <MaterialTable className="p-3"
          enableRowNumbers={true}
          icons={tableIcons}
          columns={columnsResidential}
          data={contacts}
          title="HR Summary Report"
          options={{
            // selection: true,
            pageSize: 100,
            pageSizeOptions: [100],
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

export {HrSummaryTable}