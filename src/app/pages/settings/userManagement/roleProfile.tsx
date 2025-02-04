import React,{FC, useEffect, useState} from 'react'
import { KTSVG } from '../../../../_metronic/helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { deleteRoleManagement, getRoleManagementList, saveRoleManagement, updateRoleManagement, updateRolePermission } from './core/_requests';
import { useAuth } from '../../../modules/auth';
import makeAnimated from "react-select/animated";
import { useIntl } from 'react-intl';
import ReactSelect from 'react-select';

const initialValues = {
    designation: '',
}

const RoleProfile: FC = () => {

    const intl = useIntl();
    const {currentUser, logout} = useAuth();
    const DesignationSchema = Yup.object().shape({
        designation: Yup.string().required('Designation is required'),
    })

    const [Designation, setDesignation] = useState<any[]>([]);
    const [selectedVal, setSelectedVal] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [editId, setEditId] = useState('');
    const modules:any[] = ['Contact', 'Leads', 'Project', 'Transaction', 'Task', 'Finance', 'File', 'Message', 'Report', 'Support', 'Settings', 'Export', 'Assign_List','console'];

    const DesignationList =  async () => {
        const DesignationResponse = await getRoleManagementList()
        setDesignation(DesignationResponse.output);
    }

    useEffect(() => {
        DesignationList();
    }, []);
    
    const formik = useFormik({
        initialValues,
        validationSchema: DesignationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            const body = {
                'role_name': values.designation,
                'reporting_to': selectedVal.map((data) => data.id)?.join(',')
            }
            if(!editClicked){
                const saveDesignationData = await saveRoleManagement(body);
                if(saveDesignationData.status == 200) {
                    setLoading(false)
                    resetForm();
                    DesignationList();
                }
            } else {
                const updateDesignationData = await updateRoleManagement(editId, body);
                if(updateDesignationData.status == 200) {
                    setLoading(false)
                    setEditClicked(false);
                    setEditId('');
                    resetForm();
                    DesignationList();
                }
            }
          }
        catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
    }})

    const editTap = async (value:any) => {  
        setEditClicked(true);
        setEditId(value.id);
        document.getElementById('kt_addprofile_open')?.click();
        formik.setFieldValue('designation', value.role_name ?? '');        
        setTimeout(() => setSelectedVal(Designation?.filter((item:any) => value.reporting_to?.split(',')?.indexOf(item.id?.toString()) !== -1)), 300);       
    }

    const editCancel = () => {
        setEditClicked(false);
        setEditId('');
        formik.setFieldValue('designation', '');
    }

    const onDelete = async (id:any) => {
        await deleteRoleManagement(id);
        DesignationList();
    }

    return(
        <section className="role_profile">
            <div className="row">
                <div className="card-group">
                    <div className="col-12 mb-4">
                        <div className="card h-100 bs_1 mx-3">
                            <div className="card-header d-flex justify-content-between">                               
                                    <h4>{intl.formatMessage({id: 'profile_setting'})}</h4>
                                    <button className="btn btn-icon" type="button" id='kt_addprofile_open' data-bs-toggle='modal'
                                data-bs-target={'#add_profile_popup'}>
                                        <KTSVG path="/media/icons/duotune/general/gen041.svg" className="svg-icon-muted svg-icon-2hx" />
                                    </button>     
                            <div className='modal fade' id={'add_profile_popup'} aria-hidden='true' data-bs-backdrop="static" data-bs-keyboard="false">
                                <div className='modal-dialog modal-dialog-centered'>
                                    <div className='modal-content'>
                                        <div className='modal-header'>
                                            <h3>{intl.formatMessage({id: 'add_profile'})}</h3>
                                            <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={editCancel} data-bs-dismiss='modal'>
                                            <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                            </div>
                                        </div>
                                        <div className='modal-body py-lg-10 px-lg-10'>
                                            <form noValidate onSubmit={formik.handleSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'designation'})}</label>
                                                    <div className="input-group first mb-3 input_prepend bs_1 br_10">
                                                        <input type="text" {...formik.getFieldProps('designation')}
                                                            className="form-control border-0" placeholder="Designation..." />
                                                    </div>
                                                    {formik.touched.designation && formik.errors.designation && (
                                                        <div className='fv-plugins-message-container'>
                                                            <div className='fv-help-block'>
                                                                <span role='alert' className='text-danger'>{formik.errors.designation}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'reporting_to'})}</label>
                                                    <div className="input-group first mb-3 input_prepend bs_1 br_10">
                                                        <div className='w-100'>
                                                            <ReactSelect
                                                            isMulti
                                                            options={Designation}
                                                            closeMenuOnSelect={false}
                                                            components={makeAnimated()}
                                                            getOptionLabel={(option:any) => option.role_name ?? '--No Name--'}
                                                            getOptionValue={(option:any) => option.id}
                                                            value={Designation?.filter((item:any) => selectedVal?.indexOf(item) !== -1)}
                                                            classNamePrefix="border-0 "
                                                            className={""}
                                                            onChange={(val:any) => {
                                                                setSelectedVal(val);                                                
                                                            }}
                                                            placeholder={"Reporting to.."}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='me-n3 d-flex flex-column align-items-end'>
                                                <div className="d-flex align-items-center">
                                                    {editClicked &&
                                                    <button className='btn btn-sm btn-secondary mt-3 me-3' onClick={editCancel} data-bs-toggle='modal'>
                                                        {intl.formatMessage({id: 'cancel'})}
                                                    </button>}
                                                    <button
                                                        type='submit'
                                                        data-bs-toggle='modal'
                                                        
                                                        className='btn btn-sm btn_primary text-primary mt-3'
                                                        disabled={formik.isSubmitting}
                                                        >
                                                        {!loading && <span className='indicator-label'>{editClicked ? intl.formatMessage({id: 'update'}) : intl.formatMessage({id: 'create'}) }
                                                        </span>}
                                                        {loading && (
                                                            <span className='indicator-progress' style={{display: 'block'}}>
                                                            {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="card-body p-0">
                            <table className='table table-striped border role_table mb-0'>
                                <thead>
                                <tr className='bg-gray-200'>
                                    <td className='ps-5' scope="col">Id</td>
                                    <td scope="col">{intl.formatMessage({id: 'name'})}</td>
                                    <td scope="col">{intl.formatMessage({id: 'reporting_to'})}</td>
                                    <td scope="col">{intl.formatMessage({id: 'actions'})}</td>
                                </tr>
                                </thead>
                                <tbody>
                                {Designation.map((Data, i) => {
                                return(
                                <tr className='' key={i}>
                                    <td className='ps-5' scope="row">{i+1}</td>
                                    <td>{Data.role_name}</td>
                                    <td>{Data.reporting_name}</td>
                                    <td className='d-flex shrink-0 h-100 w-100 p-1'> 
                                     <>                                   
                                    <button onClick={(e) => editTap(Data)} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></span></button>
                                    {Data.id != 1 && Data.id != 2 && Data.id != 3 && Data.id != 4 && Data.id != 5 && Data.id != 6 &&
                                    <a href="#" data-bs-toggle='modal'
                                    data-bs-target={'#grerweret5yhrv6jm6uvhergwererwerweethrtr'+Data.id} className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1"><span className="svg-icon svg-icon-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></span></a>}

                                    <button type='button' data-bs-toggle='modal' data-bs-target={'#grerweret5yhrv6jm6uvhergwere'+Data.id} className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" title='permissions'>
                                        <KTSVG path="/media/icons/duotune/ecommerce/ecm008.svg" className="svg-icon-muted svg-icon-1" />
                                    </button>

                                    <div className='modal fade' id={'grerweret5yhrv6jm6uvhergwererwerweethrtr'+Data.id} aria-hidden='true'>
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
                                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' onClick={(e) => onDelete(Data.id)}>
                                                        {intl.formatMessage({id: 'yes'})}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className='modal fade' id={'grerweret5yhrv6jm6uvhergwere'+Data.id} aria-hidden='true'>
                                    <div className='modal-dialog modal-dialog-centered'>
                                        <div className='modal-content'>
                                            <div className='modal-header'>
                                                <h3>{intl.formatMessage({id: `permissions_of`}) + ' ' + Data.role_name}</h3>
                                                <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                                </div>
                                            </div>
                                            <div className='modal-body py-lg-10 px-lg-10'>
                                            <form action="">
                                                <div className="row">
                                                    <div className="col-12">
                                                        {modules.map((item:any, i:any) => {
                                                        return(
                                                            <div className='d-flex justify-content-between px-5 py-2 br_15 bg-gray-100 mb-3' key={i}>
                                                                <span>{item.replace('_', ' ')}</span>
                                                                <span className='d-flex'>
                                                                    {item == 'Assign_List' && <p className='m-0 me-7'>Reporting</p>}
                                                                    <div className="form-check form-switch">
                                                                        <input className="form-check-input" type="checkbox" defaultChecked={(Designation.find(item => item.id == Data.id)[item.toLowerCase()]) == 1 ? true : false} onChange={async (e) => {
                                                                            let body = {
                                                                                "module": item.toLowerCase(),
                                                                                "val": e.target.checked ? 1 : 0
                                                                            }
                                                                            await updateRolePermission(Data.id, body)
                                                                        }}/>
                                                                    </div>
                                                                    {item == 'Assign_List' && <p className='m-0'>All</p>}
                                                                </span>
                                                            </div>                                                    
                                                        )})}
                                                    </div>
                                                </div>
                                            </form>
                                            </div>
                                        </div>
                                    </div>
                                    </div></>
                                    </td>
                                </tr>                 
                                )})}
                                </tbody>
                            </table>                            
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12 mb-4 d-none">
                        <div className="card h-100 bs_1 mx-3">
                            <div className="card-header">
                                <h4>{intl.formatMessage({id: 'role_setting'})}</h4>
                            </div>
                            <div className="card-body">
                                <form action="">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingOne">
                                                        <button className="accordion-button p-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                            {intl.formatMessage({id: 'contact'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault1"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" ata-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingTwo">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                            {intl.formatMessage({id: 'lead'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault2"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault2"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingThree">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                            {intl.formatMessage({id: 'project'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault3"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault3"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingFour">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                                            {intl.formatMessage({id: 'transactions'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault4"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault4"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingFive">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                                            {intl.formatMessage({id: 'task'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault5"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault5"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingSix">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                                            {intl.formatMessage({id: 'file'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault6"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault6"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingSeven">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                                            {intl.formatMessage({id: 'finance'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault7"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault7"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Own Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Hidden Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Read Only Fields-Other Records</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Contact Type</option>
                                                                                <option>Source</option>
                                                                                <option>Assigned To</option>
                                                                                <option>Created Date</option>
                                                                                <option>Email</option>
                                                                                <option>Phone Number</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingEight">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                                                            {intl.formatMessage({id: 'message'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault8"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault8"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseEight" className="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingTen">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
                                                            {intl.formatMessage({id: 'console'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault10"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault10"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseTen" className="accordion-collapse collapse" aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex flex-center" id="headingNine">
                                                        <button className="accordion-button p-4 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
                                                            {intl.formatMessage({id: 'reports'})}
                                                        </button>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault9"/>
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault9"></label>
                                                        </div>
                                                    </h2>
                                                    {/* <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <div className="row">
                                                                <div className="col-12 d-md-flex justify-content-between">
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">View*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Edit*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Delete*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="basic-url" className="form-label">Archive*</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>All</option>
                                                                                <option>Team</option>
                                                                                <option>Own</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-none">
                                                                    <div className="form-group mb-4">
                                                                        <label htmlFor="basic-url" className="form-label">Permission</label>
                                                                        <div className="input-group mb-3 input_prepend">
                                                                            <select className="btn_secondary btn btn-sm w-100">
                                                                                <option>Assign</option>
                                                                                <option>Bulk Edit</option>
                                                                                <option>Create</option>
                                                                                <option>Import</option>
                                                                                <option>Export</option>
                                                                                <option>Notify</option>
                                                                            </select>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </section>
    )
}
export {RoleProfile}