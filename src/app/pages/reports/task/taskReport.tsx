import React,{FC, useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { DashboardBarChart } from '../../dashboard/barChart';
import { getCountStatusTask, getCountTaskType } from '../core/_request';
import { useIntl } from 'react-intl';
import { TaskTypeReport } from './taskTypeReport';
import { TaskStatusReport } from './taskStatusReport';
// import { typeOf } from 'react-is';
import { TaskReportList } from './taskReportList';
import { TaskPriorityReport } from './taskPriorityReport';
import { TaskSummaryReport } from './taskSummaryReport';
import { TaskProjectReport } from './taskProjectReport';
import { TaskStateReport } from './stateReport';
import { TaskCityReport } from './cityReport';
import { TaskLocalityReport } from './localityReport';

type Props = {
users?: any,
teams?: any,
}

const TaskLead: FC<Props> = (props) => {

    const { users, teams } = props;
    const intl = useIntl();
    const [contacts, setContacts] = useState<any[]>([]);
    const [tabName, setTabName] = useState<any>("task_summary");
    const [title, setTitle] = useState<any>("task_summary");

    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-4 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("task_summary");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link active' id="tasksummary-tab" data-bs-toggle="pill" data-bs-target="#tasksummary" type="button" role="tab" aria-controls="tasksummary" aria-selected="true">
                                        {intl.formatMessage({id: 'task_summary_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("task_status");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="taskstatus-tab" data-bs-toggle="pill" data-bs-target="#taskstatus" type="button" role="tab" aria-controls="taskstatus" aria-selected="true">
                                        {intl.formatMessage({id: 'task_status_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("task_status");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="tasktype-tab" data-bs-toggle="pill" data-bs-target="#tasktype" type="button" role="tab" aria-controls="tasktype" aria-selected="true">
                                        {intl.formatMessage({id: 'task_type_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("Priority");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="Priority-tab" data-bs-toggle="pill" data-bs-target="#Priority" type="button" role="tab" aria-controls="Priority" aria-selected="true">
                                        {intl.formatMessage({id: 'task_Priority_report'})}
                                    </a>
                                </li>                                                                  
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("project_task");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="projectTask-tab" data-bs-toggle="pill" data-bs-target="#projectTask" type="button" role="tab" aria-controls="projectTask" aria-selected="true">
                                        {intl.formatMessage({id: 'project_task_report'})}
                                    </a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("locality");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="locality-tab" data-bs-toggle="pill" data-bs-target="#locality" type="button" role="tab" aria-controls="locality" aria-selected="true">
                                        {intl.formatMessage({id: 'locality_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("city");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="city-tab" data-bs-toggle="pill" data-bs-target="#city" type="button" role="tab" aria-controls="city" aria-selected="true">
                                        {intl.formatMessage({id: 'city_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("state");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="state-tab" data-bs-toggle="pill" data-bs-target="#state" type="button" role="tab" aria-controls="state" aria-selected="true">
                                        {intl.formatMessage({id: 'state_wise_report'})}
                                    </a>
                                </li> */}
                            </ul>                            
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-8">                    
                    <div className="card-group">
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="tasksummary" role="tabpanel" aria-labelledby="tasksummary-tab">
                            <TaskSummaryReport setContacts={setContacts} contacts={contacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="taskstatus" role="tabpanel" aria-labelledby="taskstatus-tab">
                            <TaskStatusReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="tasktype" role="tabpanel" aria-labelledby="tasktype-tab">
                            <TaskTypeReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="Priority" role="tabpanel" aria-labelledby="Priority-tab">
                            <TaskPriorityReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="projectTask" role="tabpanel" aria-labelledby="projectTask-tab">
                            <TaskProjectReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="locality" role="tabpanel" aria-labelledby="locality-tab">
                            <TaskLocalityReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="city" role="tabpanel" aria-labelledby="city-tab">
                            <TaskCityReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div className="tab-pane fade" id="state" role="tabpanel" aria-labelledby="state-tab">
                            <TaskStateReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                    </div>
                    </div>
                </div>
                {tabName != "task_summary" &&
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <TaskReportList contacts={contacts} title={title}/>}
                </div>}
            </div>
        </section>
    )
}

export{TaskLead}