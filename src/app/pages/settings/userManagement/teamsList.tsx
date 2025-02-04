import React,{FC, useEffect, useState} from 'react';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { getTeams, deleteTeam, getTeamsList, getTeamList, getUsers } from './core/_requests';
import { Offcanvas, Toast } from 'bootstrap';
import { useAuth } from '../../../modules/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';

const initialValues = {
    team_name: '',
    branch_id: '',
    project_id: '',
    team_leader: '',
    executives: '',
}

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

const TeamsList: FC = () => {
    const intl = useIntl();
    const [teams, setTeams] = useState<any[]>([]);
    const [detailData, setDetailData] = useState('');
    const {currentUser, logout} = useAuth(); 
    const [detailClicked, setDetailClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assignToName, setAssignToName] = useState<string[]>([]);
    const [assignToId, setAssignToId] = useState<string[]>([]);
    const [teamsGroupBy, setTeamsGroupBy] = useState<any>({});

    const teamsList =  async () => {
        const Response = await getTeams()
        setTeams(Response.output);

        const groupedData = Response.output?.reduce((groups:any, item:any) => {
            const category = item.role_name;
            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(item);
            return groups;
          }, {});
          
          setTeamsGroupBy(groupedData);
    }

    const openModal = (Id:any) => {
        setDetailClick(true);
        setDetailData(Id);
        document.getElementById("teamd_add_popup0071234")?.click();
    }

    const onDelete = async (id:any) => {
        const Response = await deleteTeam(id)
        if(Response != null) {
            const Response = await getTeams()
            setTeams(Response.output);
            var toastEl = document.getElementById('myToastUpdate');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
        }        
    }

    let registrationSchema = Yup.object().shape({
        team_name: Yup.string()
        .required('team_name is required'),
        branch_id: Yup.string()            
        .required('branch_id is required'),          
        project_id: Yup.string()
        .required('project_id is required'),
        team_leader: Yup.string()
        .required('team_leader is required'),
        executives: Yup.string()
        .required('executives is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try { 
            let body = {
            "team_name": values.team_name,
            "branch_id": values.branch_id,
            "project_id": values.project_id,
            "team_leader": values.team_leader,
            "executives": values.executives,
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })

    const assingToChange = (event: SelectChangeEvent<typeof assignToName>) => {
        const {
          target: { value },
        } = event;
    
        var name = [];
        var id = [];
    
        for(let i = 0; i < value.length; i++){
          var fields = value[i].split('-');
    
          var n = fields[0];
          var d = fields[1];
    
          name.push(n);
          id.push(d);
        }
    
        setAssignToId(id);
        setAssignToName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {
        teamsList();
    }, []);

    return(
        <>
        <button className='d-none' id='teamListReload' onClick={teamsList}>ReLoad</button>
        <button className='d-none' data-bs-toggle='modal' data-bs-target={'#teamd_add_popup007werertgfdbgfhd'} id='teamd_add_popup0071234'>add+</button>
        <div className='modal fade' id={'teamd_add_popup007werertgfdbgfhd'} aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h3>{intl.formatMessage({id: 'teams'})}</h3>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                    </div>
                    <div className='modal-body py-lg-10 px-lg-10'>   
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <div className='row'>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'team_name'})}</label>
                                    <div className="input-group">
                                        <input type="text" {...formik.getFieldProps('team_name')} className="form-control" placeholder="Enter Id" />
                                    </div>
                                    {formik.touched.team_name && formik.errors.team_name && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.team_name}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'branch_id'})}</label>
                                    <div className="input-group mb-3">
                                        <select 
                                            {...formik.getFieldProps('branch_id')} 
                                            className="form-select">
                                            <option value=''>Select</option>
                                            {/* {dropdowns.roles?.map((designValue:any,i:any)=> {
                                            return (
                                            <option value={designValue.id} key={i}>{designValue.role_name}</option>
                                            )
                                            })}  */}
                                        </select>
                                    </div>
                                    {formik.touched.branch_id && formik.errors.branch_id && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.branch_id}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'project_id'})}</label>
                                    <div className="input-group mb-3">
                                        <select 
                                            {...formik.getFieldProps('project_id')} 
                                            className="form-select">
                                            <option value=''>Select</option>
                                            {/* {dropdowns.roles?.map((designValue:any,i:any)=> {
                                            return (
                                            <option value={designValue.id} key={i}>{designValue.role_name}</option>
                                            )
                                            })}  */}
                                        </select>
                                    </div>
                                    {formik.touched.project_id && formik.errors.project_id && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.project_id}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'team_leader'})}</label>
                                    <div className="input-group mb-3">
                                        <select 
                                            {...formik.getFieldProps('team_leader')} 
                                            className="form-select">
                                            <option value=''>Select</option>
                                            {/* {dropdowns.roles?.map((designValue:any,i:any)=> {
                                            return (
                                            <option value={designValue.id} key={i}>{designValue.role_name}</option>
                                            )
                                            })}  */}
                                        </select>
                                    </div>
                                    {formik.touched.team_leader && formik.errors.team_leader && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.team_leader}</span>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="col-12 mb-3">
                                    <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'assign_to'})}</label>
                                    <FormControl sx={{ m: 0, width: '100%', mt: 0 }}>
                                        <Select
                                            multiple
                                            displayEmpty
                                            value={assignToName}
                                            onChange={assingToChange}
                                            input={<OutlinedInput />}
                                            renderValue={(selected) => {
                                                var name = [];
                                                var id = [];

                                                for(let i = 0; i < selected.length; i++){
                                                var fields = selected[i].split('-');

                                                var n = fields[0];
                                                var d = fields[1];

                                                name.push(n);
                                                id.push(d);
                                                }
                                                if (selected.length === 0) {
                                                    return <p>{intl.formatMessage({id: 'assign_to'})}</p>;
                                                }

                                                return(
                                                    <ul className='m-0'>
                                                    {name?.map((data, i) => {
                                                        return(
                                                        <li key={i}>{data}</li>
                                                        )
                                                    })}                                          
                                                    </ul>
                                                )
                                            }}
                                            className='multi_select_field'
                                            MenuProps={MenuProps}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                            <MenuItem disabled value="">
                                                <em>{intl.formatMessage({id: 'assign_to'})}</em>
                                            </MenuItem>
                                            {/* {dropList.assign_to?.map((assignVal:any) => (
                                                <MenuItem
                                                key={assignVal.user_id}
                                                value={assignVal.assign_to_name+'-'+assignVal.user_id}
                                                style={getStyles(assignVal.assign_to_name, assignToName, theme)}
                                                >
                                                {assignVal.assign_to_name}
                                                </MenuItem>
                                            ))} */}
                                        </Select>
                                        </FormControl>
                                    </div>
                            </div>
                        </form>                         
                    </div>
                </div>
            </div>
        </div>
        <div className="">
            <div className="card-group">
                {Object.keys(teamsGroupBy)?.map((item:any) => (<div className='w-100' key={item}>
                    <h2 className={item == 'Admin' ? 'bg-gray-300 w-100 ps-4 py-3 br_10' : 'mt-5 bg-gray-300 w-100 ps-4 py-3 br_10'}>{item}</h2>
                    <div className='row'>
                        {teamsGroupBy[item]?.map((teamData:any, i:any) => {
                        return(
                            <div className="col-xxl-2 col-xl-3 col-md-4 col-sm-6 p-2" key={i}>
                                <div className="card h-100 user_card bs_2">
                                    <div className="card-header px-0 d-flex justify-content-between align-items-center">                        
                                        <div>
                                            <p className="mb-0"><span>ID:</span> {teamData.team_leader_id}</p>
                                        </div>
                                        <div className="d-flex">
                                            {/* <button className="btn btn-sm p-1"
                                            onClick={() => openModal(teamData.team_leader.id)}
                                            >
                                                <img src={toAbsoluteUrl('/media/custom/expand.svg')} alt="" className="icon me-2"/></button> */}
                                            <div className="btn-group">
                                                {/* <button className="btn p-1 btn-sm" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                                    <img src={toAbsoluteUrl('/media/custom/more.svg')} alt="" className="icon me-2"/>
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                    <li><button className="dropdown-item" onClick={() => openModal(teamData.team_leader.id)}>{intl.formatMessage({id: 'edit'})}</button></li>                                                                                            
                                                    <li><button data-bs-toggle='modal' data-bs-target={'#delete_confirm_popup123123'+teamData.team_leader.id} className="dropdown-item">{intl.formatMessage({id: 'delete'})}</button>
                                                    </li>
                                                </ul> */}
                                                <div className='modal fade' id={'delete_confirm_popup123123'+teamData.team_leader_id} aria-hidden='true'>
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
                                                                    <button className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' 
                                                                    onClick={(e) => onDelete(teamData.team_leader_id)}
                                                                    >
                                                                        {intl.formatMessage({id: 'yes'})}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="d-flex flex-center">
                                        <div className='symbol symbol-75px symbol-circle'>
                                            <span className='symbol-label bg_soft text_primary name_label fw-bolder'>
                                            {teamData.team_leader_name?.split(" ")[0][0]?.toUpperCase()}
                                            {teamData.team_leader_name?.split(" ")[1] ? teamData.team_leader_name?.split(" ")[1][0]?.toUpperCase() : ''}
                                            {/* {teamData.team_leader_name} */}
                                            </span>
                                        </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            <div className="d-flex justify-content-center mb-2 text-center">
                                                {/* <img src={toAbsoluteUrl('/media/custom/user.svg')} alt="" className="icon me-2" /> */}
                                                <p className="mb-0 contact_name">{teamData.team_leader_name}</p>
                                            </div>
                                                {/* <p className="mb-3 text_secondary">{teamData.team_leader_name?.split('-')[0]}</p> */}
                                        </div>
                                        <div>
                                            <div className="row">
                                                <div className={teamData.user_name?.split(',').length > 3 ? "col-12 h-150px scroll-y" : "col-12 scroll-"}>
                                                    {/* <div className="d-flex align-items-start single_item mb-3">
                                                        <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="svg_icon me-2"/>     
                                                        <div className="d-flex flex-column">
                                                            <p className="mb-0 fw-500">{teamData.tl_name}</p>
                                                        </div>
                                                    </div> */}
                                                    {teamData.user_name &&
                                                    teamData.user_name?.split(',').map((members: any, i: any) => {
                                                        return(
                                                    <div className="d-flex align-items-start single_item mb-3 " key={i}>
                                                        <img src={toAbsoluteUrl('/media/custom/buyer.svg')} alt="" className="svg_icon me-2"/>
                                                        <div className="d-flex flex-column">
                                                            <p className="mb-0 fw-500">{members.split('-')[0]}</p>
                                                        </div>
                                                    </div>)})}                                       
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>))}
                
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'team_created_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'team_updated_successfully'})}!</div>
                </div>
            </div>
        </div>
        </>
    )
}
export {TeamsList}