import React,{FC, useState} from 'react';
import { useIntl } from 'react-intl';
import { AttendanceReport } from './attendanceReport';
import { LeaveTypeReport } from './leaveTypeReport';
import { AgeReport } from './ageReport';
import { LocationReport } from './branchReport';
import { HrReportList } from './listTable';
import { GenderReport } from './genderReport';
import { HRSummaryReport } from './hrSummary';

type Props = {
    users?: any,
    teams?: any
}

const HrLead: FC<Props> = (props) => {
    const intl = useIntl();
    const [title, setTitle] = useState<any>("contact_reports");
    const [tab, setTab] = useState<any>("hr_summary_report");
    const [contacts, setContacts] = useState<any[]>([]);
    const {users, teams} = props
    
    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-4 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link active' id="hrSummary-tab" data-bs-toggle="pill" data-bs-target="#hrSummary" type="button" role="tab" aria-controls="hrSummary" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('hr_summary_report');
                                    }}>
                                    {intl.formatMessage({id: 'hr_summary_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="genderReport-tab" data-bs-toggle="pill" data-bs-target="#genderReport" type="button" role="tab" aria-controls="genderReport" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('gender_report');
                                    }}>
                                    {intl.formatMessage({id: 'gender_report'})}
                                    </a>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="ageReport-tab" data-bs-toggle="pill" data-bs-target="#ageReport" type="button" role="tab" aria-controls="ageReport" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('age_report');
                                    }}>
                                    {intl.formatMessage({id: 'age_report'})}
                                    </a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="userlocation-tab" data-bs-toggle="pill" data-bs-target="#userlocation" type="button" role="tab" aria-controls="userlocation" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('user_location');
                                    }}>
                                    {intl.formatMessage({id: 'user_location'})}
                                    </a>
                                </li> */}
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="attendance-tab" data-bs-toggle="pill" data-bs-target="#attendance" type="button" role="tab" aria-controls="attendance" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('attendance_report');
                                    }}>
                                    {intl.formatMessage({id: 'attendance_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="leavetype-tab" data-bs-toggle="pill" data-bs-target="#leavetype" type="button" role="tab" aria-controls="leavetype" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                    setTab('leave_type_report');
                                    }}>
                                    {intl.formatMessage({id: 'leave_type_report'})}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-8">                    
                    <div className="card-group">
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div  className="tab-pane fade show active" id="hrSummary" role="tabpanel" aria-labelledby="hrSummary-tab">
                            <HRSummaryReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="genderReport" role="tabpanel" aria-labelledby="genderReport-tab">
                            <GenderReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="ageReport" role="tabpanel" aria-labelledby="ageReport-tab">
                            <AgeReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="userlocation" role="tabpanel" aria-labelledby="userlocation-tab">
                            <LocationReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="attendance" role="tabpanel" aria-labelledby="attendance-tab">
                            <AttendanceReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="leavetype" role="tabpanel" aria-labelledby="leavetype-tab">
                            <LeaveTypeReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>
                    </div>
                    </div>
                </div>
                {tab != 'hr_summary_report' &&
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <HrReportList contacts={contacts} title={title}/>}
                </div>}
            </div>
        </section>
    )
}

export{HrLead}