import React,{FC, useEffect, useState} from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers';
import { CallLead } from './contact/contactReports';
import { FavoriteLead } from './favoriteLead';
import { FinanceLead } from './finance/financeReport';
import { HrLead } from './HR/hrReports';
import { ProjectLead } from './project/projectReport';
import { ReportsLead } from './lead/reportsLead';
import { ReportToolbar } from './reportToolbar';
import { TaskLead } from './task/taskReport';
import { TransactionLead } from './transaction/transactionReport';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import { getDashboardDropdowns } from '../dashboard/core/requests';
import { useIntl } from 'react-intl';


const Reports: FC = () => {
    const intl = useIntl();
    const [toggle, setToggle] = useState(false);
    const [teams, setTeams] = useState<any[]>([]); 
    const [users, setUsers] = useState<any[]>([]);

    const handleHideData = () => {
        setToggle(!toggle);
    };

    const dashboardDropdowns = async () => {
        const response = await getDashboardDropdowns();
        setUsers(response.output?.users?.map((item:any) => {
          return {
          'first_name': item.user_name,
          'id': item.user_id
          }
        }));
        setTeams(response.output?.teams);
    }

    useEffect(() => {
        dashboardDropdowns();
    }, []);

    return(
        <>
        <div className='d-none'>
            <ThemeBuilder/>
        </div>
        <div className="reports_tab_page bg_white h-100 p-4">
                <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="favorite-tab" data-bs-toggle="pill" data-bs-target="#favorite" type="button" role="tab" aria-controls="favorite" aria-selected="true">{intl.formatMessage({id: 'favorite'})}</button>
                    </li> */}
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="call-tab" data-bs-toggle="pill" data-bs-target="#call" type="button" role="tab" aria-controls="call" aria-selected="false">{intl.formatMessage({id: 'contact'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="lead-tab" data-bs-toggle="pill" data-bs-target="#lead" type="button" role="tab" aria-controls="lead" aria-selected="false">{intl.formatMessage({id: 'lead'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="project-tab" data-bs-toggle="pill" data-bs-target="#project" type="button" role="tab" aria-controls="project" aria-selected="false">{intl.formatMessage({id: 'project'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="transaction-tab" data-bs-toggle="pill" data-bs-target="#transaction" type="button" role="tab" aria-controls="transaction" aria-selected="false">{intl.formatMessage({id: 'transaction'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="task-tab" data-bs-toggle="pill" data-bs-target="#task" type="button" role="tab" aria-controls="task" aria-selected="false">{intl.formatMessage({id: 'task'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="finance-tab" data-bs-toggle="pill" data-bs-target="#finance" type="button" role="tab" aria-controls="finance" aria-selected="false">{intl.formatMessage({id: 'finance'})}</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="hr-tab" data-bs-toggle="pill" data-bs-target="#hr" type="button" role="tab" aria-controls="hr" aria-selected="false">{intl.formatMessage({id: 'hr'})}</button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    {/* <div className="tab-pane fade show active" id="favorite" role="tabpanel" aria-labelledby="favorite-tab">
                        <FavoriteLead />
                    </div> */}
                    <div className="tab-pane fade" id="lead" role="tabpanel" aria-labelledby="lead-tab">
                        <ReportsLead users={users} teams={teams} />
                    </div>
                    <div className="tab-pane fade" id="transaction" role="tabpanel" aria-labelledby="transaction-tab">
                        <TransactionLead users={users} teams={teams} />
                    </div>
                    <div className="tab-pane fade show active" id="call" role="tabpanel" aria-labelledby="call-tab">
                        <CallLead users={users} teams={teams} />
                    </div>
                    <div className="tab-pane fade" id="project" role="tabpanel" aria-labelledby="project-tab">
                        <ProjectLead users={users} teams={teams}  />
                    </div>
                    <div className="tab-pane fade" id="task" role="tabpanel" aria-labelledby="task-tab">
                        <TaskLead users={users} teams={teams} />
                    </div>
                    <div className="tab-pane fade" id="finance" role="tabpanel" aria-labelledby="finance-tab">
                        <FinanceLead users={users} teams={teams} />
                    </div>
                    <div className="tab-pane fade" id="hr" role="tabpanel" aria-labelledby="hr-tab">
                        <HrLead users={users} teams={teams} />
                    </div>
                </div>
            </div></>
    )
}
export {Reports}