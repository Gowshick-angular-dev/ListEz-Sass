import React,{FC, useEffect, useState} from 'react';
import { useIntl } from 'react-intl';
import { LeadStatusReport } from './leadStatusReport';
import { LeadReportList } from './listTable';
import { LeadGroupReport } from './leadGroupReport';
import { LeadSourceReport } from './leadSourceReport';
import { LeadPropertyTypeReport } from './propertyTypeReport';
import { LeadLookingForReport } from './lookingForReport';
import { LeadSBudgetReport } from './leadBudgetReport';
import { LeadCampaignReport } from './leadCampainReport';
import { LeadLostReport } from './leadLostReport';
import { LeadReAssignmentReport } from './leadReassignmentReport';
import { LeadTaskReport } from './leadTaskReport';
import { LeadCityReport } from './leadCityReport';
import { LeadStateReport } from './leadStateReport';
import { LeadPropertyReport } from './leadPropertyReport';
import { LeadLocalityReport } from './leadLocalityReport';

type props = {
    users?:any,
    teams?:any,
}

const ReportsLead: FC<props> = (props) => { 
    const intl = useIntl();
    const { users, teams } = props

    const [contacts, setContacts] = useState<any[]>([]);
    const [tabName, setTabName] = useState<any>("lead_status_report");
    const [title, setTitle] = useState<any>("lead_reports");

    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-lg-4 col-sm-12 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_status_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link active' id="leadstagereport-tab" data-bs-toggle="pill" data-bs-target="#leadstagereport" type="button" role="tab" aria-controls="leadstagereport" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_status_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_source_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadsourcereport-tab" data-bs-toggle="pill" data-bs-target="#leadsourcereport" type="button" role="tab" aria-controls="leadsourcereport" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_source_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_group_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadgroupchart-tab" data-bs-toggle="pill" data-bs-target="#leadgroupchart" type="button" role="tab" aria-controls="leadgroupchart" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_group_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("property_type_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadbypropertytype-tab" data-bs-toggle="pill" data-bs-target="#leadbypropertytype" type="button" role="tab" aria-controls="leadbypropertytype" aria-selected="true">
                                    {intl.formatMessage({id: 'property_type_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_budget_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadbudgetwise-tab" data-bs-toggle="pill" data-bs-target="#leadbudgetwise" type="button" role="tab" aria-controls="leadbudgetwise" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_budget_wise_report'})}
                                    </a>
                                </li>
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_campaign_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadcampaign-tab" data-bs-toggle="pill" data-bs-target="#leadcampaign" type="button" role="tab" aria-controls="leadcampaign" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_campaign_wise_report'})}
                                    </a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lost_lead_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="lostlead-tab" data-bs-toggle="pill" data-bs-target="#lostlead" type="button" role="tab" aria-controls="lostlead" aria-selected="true">
                                    {intl.formatMessage({id: 'lost_lead_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_reassignment_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadreassignment-tab" data-bs-toggle="pill" data-bs-target="#leadreassignment" type="button" role="tab" aria-controls="leadreassignment" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_reassignment_report'})}
                                    </a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("lead_task_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="leadtask-tab" data-bs-toggle="pill" data-bs-target="#leadtask" type="button" role="tab" aria-controls="leadtask" aria-selected="true">
                                    {intl.formatMessage({id: 'lead_task_report'})}
                                    </a>
                                </li> */}
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("citywise_leads_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="citywiseleads-tab" data-bs-toggle="pill" data-bs-target="#citywiseleads" type="button" role="tab" aria-controls="citywiseleads" aria-selected="true">
                                    {intl.formatMessage({id: 'citywise_leads_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("looking_for_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="looking_for-tab" data-bs-toggle="pill" data-bs-target="#looking_for" type="button" role="tab" aria-controls="looking_for" aria-selected="true">
                                    {intl.formatMessage({id: 'looking_for_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("state_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="state-tab" data-bs-toggle="pill" data-bs-target="#state" type="button" role="tab" aria-controls="state" aria-selected="true">
                                    {intl.formatMessage({id: 'state_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("property_name_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="property-tab" data-bs-toggle="pill" data-bs-target="#property" type="button" role="tab" aria-controls="property" aria-selected="true">
                                    {intl.formatMessage({id: 'property_name_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTabName("locality_wise_report");
                                    setTitle('');
                                    setContacts([]);
                                    }}>
                                    <a className='text-dark nav-link' id="locality-tab" data-bs-toggle="pill" data-bs-target="#locality" type="button" role="tab" aria-controls="locality" aria-selected="true">
                                    {intl.formatMessage({id: 'locality_wise_report'})}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-12 col-sm-12">                    
                    <div className="card-group">
                        <div className="tab-content w-100" id="pills-tabContent">
                            {/* <div className="tab-pane fade" id="leadReport" role="tabpanel" aria-labelledby="leadReport-tab">
                                
                            </div> */}
                            <div className="tab-pane fade show active" id="leadstagereport" role="tabpanel" aria-labelledby="leadstagereport-tab">
                                <LeadStatusReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadsourcereport" role="tabpanel" aria-labelledby="leadsourcereport-tab">
                                <LeadSourceReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>                            
                            <div className="tab-pane fade" id="leadgroupchart" role="tabpanel" aria-labelledby="leadgroupchart-tab">
                                <LeadGroupReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadbypropertytype" role="tabpanel" aria-labelledby="leadbypropertytype-tab">
                                <LeadPropertyTypeReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadbudgetwise" role="tabpanel" aria-labelledby="leadbudgetwise-tab">
                                <LeadSBudgetReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadcampaign" role="tabpanel" aria-labelledby="leadcampaign-tab">
                                <LeadCampaignReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="lostlead" role="tabpanel" aria-labelledby="lostlead-tab">
                                <LeadLostReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadreassignment" role="tabpanel" aria-labelledby="leadreassignment-tab">
                                <LeadReAssignmentReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            <div className="tab-pane fade" id="leadtask" role="tabpanel" aria-labelledby="leadtask-tab">
                                <LeadTaskReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            {/* <div className="tab-pane fade" id="leadcost" role="tabpanel" aria-labelledby="leadcost-tab">
                                
                            </div> */}
                            <div className="tab-pane fade" id="citywiseleads" role="tabpanel" aria-labelledby="citywiseleads-tab">
                                <LeadCityReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>
                            {/* <div className="tab-pane fade" id="leadregistration" role="tabpanel" aria-labelledby="leadregistration-tab">
                                
                            </div> */}
                            <div className="tab-pane fade" id="looking_for" role="tabpanel" aria-labelledby="looking_for-tab">
                                <LeadLookingForReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>                            
                            <div className="tab-pane fade" id="state" role="tabpanel" aria-labelledby="state-tab">
                                <LeadStateReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>                            
                            <div className="tab-pane fade" id="property" role="tabpanel" aria-labelledby="property-tab">
                                <LeadPropertyReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>                            
                            <div className="tab-pane fade" id="locality" role="tabpanel" aria-labelledby="locality-tab">
                                <LeadLocalityReport setContacts={setContacts} setListTitle={setTitle} contacts={contacts} users={users} teams={teams} />
                            </div>                            
                        </div>                        
                    </div>
                </div>
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <LeadReportList contacts={contacts} title={title}/>}
                </div>
            </div>
        </section>
    )
}
export{ReportsLead}