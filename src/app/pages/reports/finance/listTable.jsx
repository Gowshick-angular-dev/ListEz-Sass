import React,{useState, useEffect} from 'react'
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

const FinanceReportList = (props) => {
  const intl = useIntl();
  const permis = sessionStorage.getItem('permissions');
  const permissions = JSON.parse(permis);
  const {
      contacts, title
    } = props
 
  const [pageHeight, setPageHeight] = useState('');
      
  const columnsResidential = [
  { title: "Sl.No", render: rowData => contacts?.findIndex(item => item === rowData) + 1, field: '', width: '50' },
  { title: `${intl.formatMessage({id: 'contact_name'})}`, field: 'contact_name' },
  { title: `${intl.formatMessage({id: 'email'})}`, field: 'email_id' },
  { title: `${intl.formatMessage({id: 'contact_no'})}`, field: 'contact_number'},
  { title: `${intl.formatMessage({id: 'developer'})}`, field: 'developer_name' },
  { title: `${intl.formatMessage({id: 'team_leader'})}`, field: 'team_leader_name' },
  { title: `${intl.formatMessage({id: 'shared_with'})}`, field: 'shared_with_name'},
  { title: `${intl.formatMessage({id: 'closed_by'})}`, field: 'closed_by_name'},
  { title: `${intl.formatMessage({id: 'locality'})}`, field: 'city_name'},
  { title: `${intl.formatMessage({id: 'booked_date'})}`, field: 'booking_date'},
  { title: `${intl.formatMessage({id: 'project'})}`, field: 'property_name'},
  { title: `${intl.formatMessage({id: 'basic_price'})}`, field: 'basic_price'},
  { title: `${intl.formatMessage({id: 'agreement_value'})}`, field: 'agreement_value'},
  { title: `${intl.formatMessage({id: 'cashback'})}`, field: 'cashback'},
  { title: `${intl.formatMessage({id: 'source'})}`, field: 'source'},
  { title: `${intl.formatMessage({id: 'created_by'})}`, field: 'created_by_name'},
  { title: `${intl.formatMessage({id: 'created_date'})}`, field: 'created_at'},
];

    const setHeight = () => {
      let heigh;
      if(window.innerHeight > 720) {
        heigh = '650px'
      } else {
        heigh = '450px'
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
          title={title}
          options={{
            // selection: true,
            pageSize: 25,
            pageSizeOptions: [25, 50, 100, 500],
            actionsColumnIndex: -1,
            maxBodyHeight: pageHeight,
            exportButton: permissions.export == 1 ? true : false,
            exportAllData: true,
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

export {FinanceReportList}