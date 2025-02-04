import React,{FC, useEffect, useState} from 'react';
import { useIntl } from 'react-intl';
import { ProjectReportList } from './projectReportList';
import { ProjectStatusDoughnutReport } from './projectStatusReport';
import { ProjectTypeDoughnutReport } from './projectTypeReport';
import { ProjectWiseDoughnutReport } from './projectWiseReport';
import { ProjectBuilderDoughnutReport } from './builderWiseReport';
import { ProjectCityDoughnutReport } from './cityWiseReport';
import {getProperties} from '../../property/core/_requests';
import { ProjectSegmentDoughnutReport } from './projectSegmentReport';
import { ProjectSiteInspectionDoughnutReport } from './projectSiteInspectionReport';
import { ProjectConfigurationDoughnutReport } from './projectConfigurationReport';
import { ProjectLocalityDoughnutReport } from './projectLocalityReport';
import { ProjectCompanyDoughnutReport } from './projectCompanyReport';
import { ProjectSourceDoughnutReport } from './projectSourceReport';
import { ProjectStateDoughnutReport } from './projectStateReport';
import { UserWiseDoughnutReport } from './userWiseReport';

type Props = {
    users?: any,
    teams?: any,
  }

const ProjectLead: FC<Props> = (props) => {
    const {
        users, teams
    } = props;
    const intl = useIntl(); 
    const [title, setTitle] = useState<any>("contact_reports");
    const [contacts, setContacts] = useState<any[]>([]);  
    const [propertiesList, setPropertiesList] = useState<any[]>([]);  

    const propertyListView = async () => {
        const response = await getProperties({
          "available_for": '',
          "project": '',
          "amenities": '',
          "commission_min": '',
          "commission_max": '',
          "property_type": '',
          "property_source": '',
          "property_status": '',
          "legal_approval": '',
          "property_indepth": '',
          "country": '',
          "state": '',
          "city": '',
          "segment": '',
          "zip_code": '', 
          "locality": '',
          "age_of_property": '',
          "property_facing": '',
          "project_stage": '',
          "gated_community": '',
          "vasthu_compliant": '',
          "no_of_units_min": '',                      
          "no_of_units_max": '',
          "no_of_floors_min": '',
          "no_of_floors_max": '',
          "rera_registered": '',
          "created_date": '',
          "created_by": '',
          "created_end_date": '',
          "available_start_date": '',
          "available_end_date": '',
          "filter_name": '',
          "limit": '',
          "sortBy": '',
      })
        setPropertiesList(response.output);
      }

      useEffect(() => {
        propertyListView();
      }, []);

    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-4 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link active' id="siteinspection-tab" data-bs-toggle="pill" data-bs-target="#siteinspection" type="button" role="tab" aria-controls="siteinspection" aria-selected="true">{intl.formatMessage({id: 'site_inspection_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="leadprojectwise-tab" data-bs-toggle="pill" data-bs-target="#leadprojectwise" type="button" role="tab" aria-controls="leadprojectwise" aria-selected="true">{intl.formatMessage({id: 'project_wise_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="citywiseproject-tab" data-bs-toggle="pill" data-bs-target="#citywiseproject" type="button" role="tab" aria-controls="citywiseproject" aria-selected="true">{intl.formatMessage({id: 'city_wise_project_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="builderwise-tab" data-bs-toggle="pill" data-bs-target="#builderwise" type="button" role="tab" aria-controls="builderwise" aria-selected="true">{intl.formatMessage({id: 'builder_wise_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="configurationwie-tab" data-bs-toggle="pill" data-bs-target="#configurationwise" type="button" role="tab" aria-controls="configurationwise" aria-selected="true">{intl.formatMessage({id: 'configuration_wise_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="propertytypewise-tab" data-bs-toggle="pill" data-bs-target="#propertytypewise" type="button" role="tab" aria-controls="propertytypewise" aria-selected="true">{intl.formatMessage({id: 'property_type_wise_report'})}</a>
                                </li> */}
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link active' id="projectstatus-tab" data-bs-toggle="pill" data-bs-target="#projectstatus" type="button" role="tab" aria-controls="projectstatus" aria-selected="true">{intl.formatMessage({id: 'project_status_report'})}</a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="projectsource-tab" data-bs-toggle="pill" data-bs-target="#projectsource" type="button" role="tab" aria-controls="projectsource" aria-selected="true">{intl.formatMessage({id: 'project_source_report'})}</a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="userwise-tab" data-bs-toggle="pill" data-bs-target="#userwise" type="button" role="tab" aria-controls="userwise" aria-selected="true">{intl.formatMessage({id: 'user_wise_report'})}</a>
                                </li>
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="projectsegment-tab" data-bs-toggle="pill" data-bs-target="#projectsegment" type="button" role="tab" aria-controls="projectsegment" aria-selected="true">{intl.formatMessage({id: 'project_segment_report'})}</a>
                                </li> */}
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="project_locality-tab" data-bs-toggle="pill" data-bs-target="#project_locality" type="button" role="tab" aria-controls="project_locality" aria-selected="true">{intl.formatMessage({id: 'project_locality_report'})}</a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="projectstate-tab" data-bs-toggle="pill" data-bs-target="#projectstate" type="button" role="tab" aria-controls="projectstate" aria-selected="true">{intl.formatMessage({id: 'project_state_wise_report'})}</a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="project_company_wise-tab" data-bs-toggle="pill" data-bs-target="#project_company_wise" type="button" role="tab" aria-controls="project_company_wise" aria-selected="true">{intl.formatMessage({id: 'company_wise_report'})}</a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-8">
                    <div className="card-group">
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div  className="tab-pane fade" id="siteinspection" role="tabpanel" aria-labelledby="siteinspection-tab">
                            <ProjectSiteInspectionDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />    
                        </div>
                        <div  className="tab-pane fade" id="leadprojectwise" role="tabpanel" aria-labelledby="leadprojectwise-tab">
                            <ProjectWiseDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />                            
                        </div>
                        <div  className="tab-pane fade" id="citywiseproject" role="tabpanel" aria-labelledby="citywiseproject-tab">
                            <ProjectCityDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="builderwise" role="tabpanel" aria-labelledby="builderwise-tab">
                            <ProjectBuilderDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="configurationwise" role="tabpanel" aria-labelledby="configurationwise-tab">
                            <ProjectConfigurationDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />  
                        </div>
                        <div  className="tab-pane fade" id="propertytypewise" role="tabpanel" aria-labelledby="propertytypewise-tab">
                            <ProjectTypeDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade show active" id="projectstatus" role="tabpanel" aria-labelledby="projectstatus-tab">
                            <ProjectStatusDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="projectlocality" role="tabpanel" aria-labelledby="projectlocality-tab">
                            <ProjectLocalityDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="projectcompany" role="tabpanel" aria-labelledby="projectcompany-tab">
                            <ProjectCompanyDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="projectsource" role="tabpanel" aria-labelledby="projectsource-tab">
                            <ProjectSourceDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="projectstate" role="tabpanel" aria-labelledby="projectstate-tab">
                            <ProjectStateDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="projectsegment" role="tabpanel" aria-labelledby="projectsegment-tab">
                            <ProjectSegmentDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                        <div  className="tab-pane fade" id="userwise" role="tabpanel" aria-labelledby="userwise-tab">
                            <UserWiseDoughnutReport setContacts={setContacts} setListTitle={setTitle} users={propertiesList} teams={teams} />
                        </div>
                    </div>
                    </div>
                </div>
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <ProjectReportList contacts={contacts} title={title}/>}
                </div>
            </div>
        </section>
    )
}

export{ProjectLead}