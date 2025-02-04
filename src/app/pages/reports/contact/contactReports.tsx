import React,{FC, useState} from 'react';
import {useIntl} from 'react-intl';
import { ContactDoughnutReport } from './pieChartStatus';
import { ContactReportList } from './listTable';
import { ContactDoughnutReportSource } from './pieChartSource';
import { ContactPieReport } from './contactCountReport';
import { ContactDoughnutReportCity } from './contactCityReport';
import { ContactCompanyReport } from './companyReport';
import { ContactCategoryReport } from './contactCategoryReport';
import { ContactGroupReport } from './contactGroupReport';
import { ContactTypeReport } from './contactTypeReport';
import { ContactGenderReport } from './genderReport';
import { ContactLocalityReport } from './localityReport';
import { ContactNationalityReport } from './nationalityReport';
import { ContactProjectReport } from './projectReport';
import { ContactStateReport } from './stateReport';
import { ContactCreatedbyReport } from './createdByReport';

type Props = {
    users?: any,
    teams?: any,
  }

const CallLead: FC<Props> = (props) => {

    const {
        users, teams
    } = props;
    const intl = useIntl();

    const [contacts, setContacts] = useState<any[]>([]);
    const [tabName, setTabName] = useState<any>("user_productivity_reports");
    const [title, setTitle] = useState<any>("contact_reports");

    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-md-4 d-none d-sm-block pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("user_productivity_reports");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link active' id="contact_reports-tab" data-bs-toggle="pill" data-bs-target="#contact_reports" type="button" role="tab" aria-controls="contact_reports" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_reports'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("contact_status_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="contact_status_report-tab" data-bs-toggle="pill" data-bs-target="#contact_status_report" type="button" role="tab" aria-controls="contact_status_report" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_status_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("contact_source_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="contact_source_report-tab" data-bs-toggle="pill" data-bs-target="#contact_source_report" type="button" role="tab" aria-controls="contact_source_report" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_source_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("citywise_contact_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="citywise_contact_report-tab" data-bs-toggle="pill" data-bs-target="#citywise_contact_report" type="button" role="tab" aria-controls="citywise_contact_report" aria-selected="true">
                                    {intl.formatMessage({id: 'citywise_contact_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("contact_type_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="contact_type_report-tab" data-bs-toggle="pill" data-bs-target="#contact_type_report" type="button" role="tab" aria-controls="contact_type_report" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_type_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("contact_category_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="contact_category_report-tab" data-bs-toggle="pill" data-bs-target="#contact_category_report" type="button" role="tab" aria-controls="contact_category_report" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_category_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("contact_group_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="contact_group_report-tab" data-bs-toggle="pill" data-bs-target="#contact_group_report" type="button" role="tab" aria-controls="contact_group_report" aria-selected="true">
                                    {intl.formatMessage({id: 'contact_group_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("locality_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="locality_wise_report-tab" data-bs-toggle="pill" data-bs-target="#locality_wise_report" type="button" role="tab" aria-controls="locality_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'locality_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("state_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="state_wise_report-tab" data-bs-toggle="pill" data-bs-target="#state_wise_report" type="button" role="tab" aria-controls="state_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'state_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("gender_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="gender_wise_report-tab" data-bs-toggle="pill" data-bs-target="#gender_wise_report" type="button" role="tab" aria-controls="gender_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'gender_wise_report'})}
                                    </a>
                                </li>
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("nationality_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="nationality_wise_report-tab" data-bs-toggle="pill" data-bs-target="#nationality_wise_report" type="button" role="tab" aria-controls="nationality_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'nationality_wise_report'})}
                                    </a>
                                </li> */}
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("project_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="project_wise_report-tab" data-bs-toggle="pill" data-bs-target="#project_wise_report" type="button" role="tab" aria-controls="project_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'project_wise_report'})}
                                    </a>
                                </li>
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("company_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="company_wise_report-tab" data-bs-toggle="pill" data-bs-target="#company_wise_report" type="button" role="tab" aria-controls="company_wise_report" aria-selected="true">
                                    {intl.formatMessage({id: 'company_wise_report'})}
                                    </a>
                                </li> */}
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("createdby_report");
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="createdby_report-tab" data-bs-toggle="pill" data-bs-target="#createdby_report" type="button" role="tab" aria-controls="createdby_report" aria-selected="true">
                                    {intl.formatMessage({id: 'createdby_report'})}
                                    </a>
                                </li>
                            </ul>                            
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-md-8 col-sm-12">                    
                    <div className="card-group">
                        <div className="tab-content w-100" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="contact_reports" role="tabpanel" aria-labelledby="contact_reports-tab">
                                <ContactPieReport setContacts={setContacts} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="contact_status_report" role="tabpanel" aria-labelledby="contact_status_report-tab">
                                <ContactDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="contact_source_report" role="tabpanel" aria-labelledby="contact_source_report-tab">
                                <ContactDoughnutReportSource setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="citywise_contact_report" role="tabpanel" aria-labelledby="citywise_contact_report-tab">
                                <ContactDoughnutReportCity setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="contact_type_report" role="tabpanel" aria-labelledby="contact_type_report-tab">
                                <ContactTypeReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="contact_category_report" role="tabpanel" aria-labelledby="contact_category_report-tab">
                                <ContactCategoryReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="contact_group_report" role="tabpanel" aria-labelledby="contact_group_report-tab">
                                <ContactGroupReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="locality_wise_report" role="tabpanel" aria-labelledby="locality_wise_report-tab">
                                <ContactLocalityReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="state_wise_report" role="tabpanel" aria-labelledby="state_wise_report-tab">
                                <ContactStateReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="gender_wise_report" role="tabpanel" aria-labelledby="gender_wise_report-tab">
                                <ContactGenderReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="nationality_wise_report" role="tabpanel" aria-labelledby="nationality_wise_report-tab">
                                <ContactNationalityReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="project_wise_report" role="tabpanel" aria-labelledby="project_wise_report-tab">
                                <ContactProjectReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="company_wise_report" role="tabpanel" aria-labelledby="company_wise_report-tab">
                                <ContactCompanyReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="createdby_report" role="tabpanel" aria-labelledby="createdby_report-tab">
                                <ContactCreatedbyReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                            </div>
                        </div>
                    </div>
                </div>
                {tabName != "user_productivity_reports" &&
                <div className='col-12'>
                    {contacts.length > 0 && 
                    <ContactReportList contacts={contacts} title={title}/>}
                </div>}
            </div>
        </section>
    )
}

export{CallLead}