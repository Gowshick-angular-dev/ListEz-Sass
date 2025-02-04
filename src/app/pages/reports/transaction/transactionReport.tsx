import React,{FC, useEffect, useState} from 'react';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useIntl } from 'react-intl';
import { TransactionReportSource } from './transactionSource';
import { TransactionReportList } from './listTable';
import { TransactionProjectWiseReport } from './projectWisereport';
import { TransactionCityWiseReport } from './cityWiseReport';
import { TransactionPropertyTypeReport } from './propertyTypeReport';
import { TransactionProjectStatusReport } from './propertyStatusReport';
import { TransactionLocalityWiseReport } from './localityReport';
import { TransactionStateWiseReport } from './stateReport';

type Props = {
    users?: any,
    teams?: any
}

const TransactionLead: FC<Props> = (props) => {
    const {users, teams} = props
    const intl = useIntl();
    const [title, setTitle] = useState<any>("project_wise_report");
    const [tab, setTab] = useState<any>("project_wise_report");
    const [contacts, setContacts] = useState<any[]>([]);

    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-4 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" id='wljfguirghdvkhdfifuwerjwer' role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('project_wise_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link active' id="projectwiseTransaction-tab" data-bs-toggle="pill" data-bs-target="#projectwiseTransaction" type="button" role="tab" aria-controls="projectwiseTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'project_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('transaction_source_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="sourceTransaction-tab" data-bs-toggle="pill" data-bs-target="#sourceTransaction" type="button" role="tab" aria-controls="sourceTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'transaction_source_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('citywise_transaction_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="cityWiseTransaction-tab" data-bs-toggle="pill" data-bs-target="#cityWiseTransaction" type="button" role="tab" aria-controls="cityWiseTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'citywise_transaction_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('property_status_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="propertyStatusTransaction-tab" data-bs-toggle="pill" data-bs-target="#propertyStatusTransaction" type="button" role="tab" aria-controls="propertyStatusTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'transaction_status_report'})}
                                    </a>
                                </li>
                                {/* <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('property_type_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="propertyTypeTransaction-tab" data-bs-toggle="pill" data-bs-target="#propertyTypeTransaction" type="button" role="tab" aria-controls="propertyTypeTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'property_type_report'})}
                                    </a>
                                </li>                                
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('locality_wise_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="localityWiseTransaction-tab" data-bs-toggle="pill" data-bs-target="#localityWiseTransaction" type="button" role="tab" aria-controls="localityWiseTransaction" aria-selected="true">
                                        {intl.formatMessage({id: 'locality_wise_report'})}
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation" onClick={() => {
                                    setTitle('');
                                    setTab('state_wise_report');
                                    setContacts([]);
                                }}>
                                    <a className='text-dark nav-link' id="stateWiseTransaction-tab" data-bs-toggle="pill" data-bs-target="#stateWiseTransaction" type="button" role="tab" aria-controls="stateWiseTransaction" aria-selected="true">
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
                            {tab == "project_wise_report" &&
                            <div  className='' id="projectwiseTransaction" role="tabpanel" aria-labelledby="projectwiseTransaction-tab">
                                <TransactionProjectWiseReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                            {tab == "transaction_source_report" &&
                            <div  className='' id="sourceTransaction" role="tabpanel" aria-labelledby="sourceTransaction-tab">
                                <TransactionReportSource setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />                            
                            </div>}
                            {tab == "citywise_transaction_report" &&
                            <div  className='' id="cityWiseTransaction" role="tabpanel" aria-labelledby="cityWiseTransaction-tab">
                                <TransactionCityWiseReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                            {tab == "property_type_report" &&
                            <div  className='' id="propertyTypeTransaction" role="tabpanel" aria-labelledby="propertyTypeTransaction-tab">
                                <TransactionPropertyTypeReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                            {tab == "property_status_report" &&
                            <div  className='' id="propertyStatusTransaction" role="tabpanel" aria-labelledby="propertyStatusTransaction-tab">
                                <TransactionProjectStatusReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                            {tab == "locality_wise_report" &&
                            <div  className='' id="localityWiseTransaction" role="tabpanel" aria-labelledby="localityWiseTransaction-tab">
                                <TransactionLocalityWiseReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                            {tab == "state_wise_report" && 
                            <div  className='' id="stateWiseTransaction" role="tabpanel" aria-labelledby="stateWiseTransaction-tab">
                                <TransactionStateWiseReport setContacts={setContacts} setListTitle={setTitle}  users={users} teams={teams} />
                            </div>}
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <TransactionReportList contacts={contacts} title={title}/>}
                </div>
            </div>
        </section>
    )
}

export{TransactionLead}