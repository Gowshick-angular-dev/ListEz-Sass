import React,{FC, useState, useEffect, forwardRef} from 'react'
import { Offcanvas, Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import {useAuth} from '../../../modules/auth'
import moment from 'moment';
import { OrgToolbar } from './organizationToolbar';
import { OrganizationDrawer } from './organizationDrawer';
import { OrganizationEdit } from './editOrganization';
import {useIntl} from 'react-intl'
import { deleteOrganozationCompany, getAllOrganozationCompany, updateApproval, getAllOrganozationCompanyLazy } from './core/_requests';
import MaterialTable from 'material-table';
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
import InfiniteScroll from 'react-infinite-scroll-component';


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

const OrganizationList = () => {
    const intl = useIntl();
    
    const [loading, setLoading] = useState(false);
    const {currentUser, logout} = useAuth();
    const [orgsList, setOrgsList] = useState([]);
    const [orgsListLazy, setOrgsListLazy] = useState([]);
    const [editId, setEditId] = useState({});
    const [deleteId, setDeleteId] = useState({});
    const [layout, setLayout] = useState('grid');
    const [pageHeight, setPageHeight] = useState('');
    const [approval, setApproval] = useState('');

    console.log("egweritwe8rtugfrk", deleteId);

    const setHeight = () => {
      let heigh ;
      if(window.innerHeight > 720) {
        heigh = '650px'
      } else {
        heigh = '500px'
      }
      setPageHeight(heigh)
    }

    useEffect(() => {
        setHeight()
      }, [window.innerHeight]);

    const roleId = currentUser?.id;

    const orgList = async () => {
        setLoading(true);
        const response = await getAllOrganozationCompany()
        if(response?.status == 200) {
            setOrgsList(response?.output);
        }
        const responseLazy = await getAllOrganozationCompanyLazy(0)
        if(responseLazy?.status == 200) {
        setOrgsListLazy(responseLazy.output)
        setLoading(false)
        }
    }
    
    const orgListLazyLoad = async () => {
        const response = await getAllOrganozationCompanyLazy(orgsListLazy.length)
        setOrgsListLazy([...orgsListLazy, ...response.output])
    }

    const deleteOrg = async (data) => {
        // setLoading(true)
        const response = await deleteOrganozationCompany(data.id)
        if(response.status == 200) {            
            // setOrgsListLazy(orgsListLazy?.splice(data.index, 1));
            orgList();
            // setOrgsList(response.output?.slice(0, -1));
            setEditId({});
            // setLoading(false)
            var toastEl = document.getElementById('myToastDeleteStatus');
            const bsToast = new Toast(toastEl);
            bsToast.show();
        } 
    }

    const organizationColoumns = [
        { title: "Sl.No", render: rowData => orgsList?.findIndex(item => item === rowData) + 1, field: '', width: '50'},
        { title: `${intl.formatMessage({id: 'organization_name'})}`, field: 'organization_name' },
        { title: `${intl.formatMessage({id: 'phone_number'})}`, field: 'phone_number' },
        { title: `${intl.formatMessage({id: 'email'})}`, field: '', render: rowData => rowData.user[0]?.email},
        { title: `${intl.formatMessage({id: 'website'})}`, field: 'website' },
        { title: `${intl.formatMessage({id: 'city'})}`, field: 'city_name', render: rowData => rowData.city_name?.name },
        { title: `${intl.formatMessage({id: 'created_at'})}`, field: '', render: rowData => moment(rowData.createdAt).format('DD-MM-YYYY, hh:mm a')},

        { field: '', title: `${intl.formatMessage({id: 'actions'})}`, render: (index) => <div className='d-flex'>
        <button id='kt_organization_edit_toggle' onClick={() => setEditId(index)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>

        <a href="#" data-bs-toggle='modal' onClick={() => setDeleteId({"id": index.id, "index": orgsList?.findIndex(item => item === index)})}
        data-bs-target={'#delete_confirm_popup_organization'} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a> 

        <div className="form-check form-switch d-flex align-items-center ps-2 me-3" title='language on/off'>
            <input className="form-check-input ms-1" type="checkbox" role="switch" onChange={async(e) => {
                const response = await updateApproval(index.id, e.target.checked ? 1 : 0)
            }} defaultChecked={index.approval == 1 ? true : false} id="flexSwitchCheckDefault" />
        </div>      
        </div> },
      ];

      const layoutChange = (val) => {
        setLayout(val)
      }

    // const updateApproval = (id) => {
    //     alert(id)
    // }

    useEffect(() => {
        if(roleId == 1) {
            orgList();
        }
    }, [roleId]);

    // useEffect(() => {
    //     approval && alert("wuirbf")
    // }, [approval]);

    return(<>
        <OrgToolbar layoutOnChange={layoutChange}/>
        <OrganizationDrawer setList={setOrgsList} />
        <a className='d-none' id='orgReload' onClick={() => orgList()}></a>
        <div
            id='kt_organization_edit'
            className='bg-opacity-0'
            data-kt-drawer='true'
            data-kt-drawer-name='organization_edit'
            data-kt-drawer-activate='true'
            data-kt-drawer-overlay='true'
            data-kt-drawer-width="{default:'100%', 'md': '700px'}"
            data-kt-drawer-direction='end'
            data-kt-drawer-toggle='#kt_organization_edit_toggle'
            data-kt-drawer-close='#kt_organization_edit_close'
        >
            <OrganizationEdit orgId={editId} setList={setOrgsList}/>
        </div>
        <div>
        {loading ? 
        <div className='w-100 h-100'>
            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                <div className="spinner-border taskloader" role="status">                                    
                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                </div>
            </div> 
        </div> :
        <div className='taskpage'> 
        <div className="row">            
            <div className='modal fade' id={'delete_confirm_popup_organization'} aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                            <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                            </div>
                        </div>
                        <div className='modal-body py-lg-5 px-lg-10'>
                            <p>{intl.formatMessage({id: 'are_you_sure_want_to_delete'})}?</p>
                            <div className='d-flex align-items-center justify-content-end'>
                                <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal'>
                                    {intl.formatMessage({id: 'no'})}
                                </button>
                                <button className='btn btn-sm btn_primary text-primary mt-3' onClick={() => deleteOrg(deleteId)} data-bs-dismiss='modal'>
                                    {intl.formatMessage({id: 'yes'})}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {layout == 'grid' ?            
                <InfiniteScroll
                dataLength={orgsListLazy.length}
                next={orgListLazyLoad}
                hasMore={orgsList.length > orgsListLazy.length}
                loader={<>
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                        <div className="spinner-border taskloader" role="status">                                    
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div>
                </>}
                endMessage={<>
                {orgsListLazy.length == 0 ? 
                <div className='w-100 d-flex justify-content-center'>
                    <div>
                        <img src={toAbsoluteUrl("/media/icons/duotune/communication/Icons_search.svg")} className="under_construction_img w-100" />
                        <h4>{intl.formatMessage({id: 'nothing_to_show'})}!!!</h4>
                    </div>
                </div> : 
                <div className='w-100 d-flex justify-content-center'>
                    <div className='mt-5'>
                        {/* <img src={toAbsoluteUrl("/media/icons/duotune/communication/Warning.svg")} className="under_construction_img w-100" /> */}
                        <h4>{intl.formatMessage({id: 'no_more_organizations_to_show'})}!!!</h4>
                    </div>
                </div>}</>}>
                    <div className="card-group">
                    {orgsListLazy?.map((org, i) => {
                        if(org.id == 1) {
                            return
                        }
                        return(                            
                        <div className="col-sm-6 col-xl-4 mt-3 mb-2" key={i} id={"nhcfiegbwecgburfjwruwrgbg"+org.id}>                    
                            <div className="card h-100 mb-xl-4 mx-2 task_card bs_1">
                                <div className='card-body px-3 pt-3 pb-0'>                       
                                <div>
                                    <div className="d-flex align-items-center justify-content-between mb-5">   
                                        <div className="d-flex align-items-center">
                                            <form action="">
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" id={"organization"+org.id}/>
                                                    <label className="form-check-label id_label" htmlFor={"organization"+org.id}>
                                                        {org.id}
                                                    </label>
                                                </div>
                                            </form>
                                            <div className="ms-3 ml-2 d-flex align-items-center">
                                                <img src={toAbsoluteUrl('/media/custom/project.svg')} alt="" className="icon me-2" />
                                                <p className="mb-0 fixed_text pb-1">{org.organization_name}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="form-check form-switch d-flex align-items-center ps-2 me-3" title='language on/off'>
                                                <input className="form-check-input ms-1" type="checkbox" role="switch" onChange={async(e) => {
                                                    const response = await updateApproval(org.id, e.target.checked ? 1 : 0)
                                                }} defaultChecked={org.approval == 1 ? true : false} id="flexSwitchCheckDefault" />
                                            </div>
                                            <a  id='kt_organization_edit_toggle'
                                            onClick={() => setEditId(org)}
                                            ><img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></a>
                                            <div className="btn-group">                                        
                                                <a className="" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                    <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                    <li><a className="dropdown-item btn_secondary" id='kt_organization_edit_toggle'
                                                    onClick={() => setEditId(org)}
                                                    >{intl.formatMessage({id: 'edit'})}</a></li>
                                                    <li><a className="dropdown-item btn_secondary" data-bs-toggle='modal' onClick={() => setDeleteId({"id": org.id, "index": i})}
                                                        data-bs-target={'#delete_confirm_popup_organization'}>{intl.formatMessage({id: 'delete'})}</a></li>
                                                </ul>
                                            </div>                                    
                                        </div>
                                    </div>
                                    <div className='px-2'>
                                        <div className="row mb-4 bg-gray-100 py-3 br_10 px-2 overflow-hidden">
                                            <div className="col-3 px-3 d-flex align-items-center justify-content-center">
                                                <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/logos/logo-1.png') }} src={org.id && org.logo ? process.env.REACT_APP_API_BASE_URL+'uploads/organization/logo/'+org.id+'/'+org.logo : ''} className="logo_list_view" alt='' />
                                            </div>
                                            <div className="col-9 flex-grow-1 ps-4">                                    
                                                <a href={"mailto:"+ org.user?.map((e) => e.email)} className="d-flex align-items-center pb-2 text-dark">
                                                    <img src={toAbsoluteUrl('/media/custom/envelope.svg')} alt="" className="icon me-1"/>
                                                    <p className="mb-0 py-1 fixed_text">{org.user?.map((e) => e.email)}</p>
                                                </a>
                                                <a href={"tel:" + org.phone_number} className="d-flex align-items-center pb-2 text-dark">
                                                    <img src={toAbsoluteUrl('/media/custom/phone.svg')} alt="" className="icon me-1" />
                                                    <p className="mb-0 py-1 fixed_text">
                                                        {org.phone_number}
                                                    </p>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <div className="row">
                                            <div className="col-xl-12">
                                                <div className="row">
                                                    <div className="col-sm-6 col-6 mb-3">
                                                        <div className="task_content_single overflow-hidden" title={org.user_name ?? ""}>
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="me-2"/>
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'admin_name'})}</small>
                                                                    <p className="mb-0 fw-500">{org.user_name ?? ''}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-6 mb-3" title={org.city_name?.name ?? '--'}>
                                                        <div className="task_content_single overflow-hidden">
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/project.svg')} alt="" className="me-2"/>
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'city'})}</small>
                                                                    <p className="mb-0 fw-500">{org.city_name?.name ?? '--'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-6 mb-3" title={org.website ?? '--'}>
                                                        <div className="task_content_single overflow-hidden">
                                                            <div className="d-flex align-items-start single_item">
                                                                <img src={toAbsoluteUrl('/media/custom/subdomain.svg')} alt="" className="me-2"/>
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'website'})}</small>
                                                                    <p className="mb-0 fw-500">{org.website ?? '--'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-6 mb-3" title={moment(org.createdAt).format('DD-MMMM-YYYY, HH:mm')}>
                                                        <div className="task_content_single overflow-hidden">
                                                            <div className="d-flex align-items-start single_item">
                                                                <span className="svg-icon svg-icon-muted me-2"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path opacity="0.3" d="M19 3.40002C18.4 3.40002 18 3.80002 18 4.40002V8.40002H14V4.40002C14 3.80002 13.6 3.40002 13 3.40002C12.4 3.40002 12 3.80002 12 4.40002V8.40002H8V4.40002C8 3.80002 7.6 3.40002 7 3.40002C6.4 3.40002 6 3.80002 6 4.40002V8.40002H2V4.40002C2 3.80002 1.6 3.40002 1 3.40002C0.4 3.40002 0 3.80002 0 4.40002V19.4C0 20 0.4 20.4 1 20.4H19C19.6 20.4 20 20 20 19.4V4.40002C20 3.80002 19.6 3.40002 19 3.40002ZM18 10.4V13.4H14V10.4H18ZM12 10.4V13.4H8V10.4H12ZM12 15.4V18.4H8V15.4H12ZM6 10.4V13.4H2V10.4H6ZM2 15.4H6V18.4H2V15.4ZM14 18.4V15.4H18V18.4H14Z" fill="currentColor"/>
                                                                <path d="M19 0.400024H1C0.4 0.400024 0 0.800024 0 1.40002V4.40002C0 5.00002 0.4 5.40002 1 5.40002H19C19.6 5.40002 20 5.00002 20 4.40002V1.40002C20 0.800024 19.6 0.400024 19 0.400024Z" fill="currentColor"/>
                                                                </svg>
                                                                </span>
                                                                <div className="d-flex flex-column">
                                                                    <small className="text_light">{intl.formatMessage({id: 'created_date'})}</small>
                                                                    <p className="mb-0 fw-500">{moment(org.createdAt).format('DD-MM-YYYY, HH:mm')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>  
                                            </div>
                                        </div>
                                    </div>                            
                                    </div> 
                                </div>
                            </div>   
                        </div>
                    )})}
                    </div>
                </InfiniteScroll>
            :
            <div className='flex-lg-row-fluid'>                     
                <div className="card bs_2 mt-0 mt-md-5">
                    <div className='card-body sus_height p-0 br_15'>
                        <div style={{ maxWidth: '100%' }} >
                            <MaterialTable className="p-3"
                            enableRowNumbers={true}
                            columns={organizationColoumns}
                            icons={tableIcons}
                            data={orgsList}
                            title="Organizations"
                            options={{
                                selection: true,
                                pageSize: 25,
                                pageSizeOptions: [25, 50, 100],
                                actionsColumnIndex: -1,
                                maxBodyHeight: pageHeight,
                                // exportButton: true,
                                columnsButton: true,
                                headerStyle: {
                                    backgroundColor: '#ececec',
                                    color: '#000',
                                },
                                rowStyle: {
                                    backgroundColor: '#fff',
                                    fontSize: '12px'
                                }
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    </div>}

            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToast">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'organization_updated_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastDeleteStatus">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close" 
                            data-bs-dismiss="toast" type="button">
                    </button>
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'organization_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="myToastAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'organization_created_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="mailErrorMsg">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="mailAlreadyExist">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'email_already_exist'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="imgSizeErr">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'please_upload_image_size_below_2_MB'})}!</div>
                </div>
            </div>
        </div>
        </>)
}

export {OrganizationList}
