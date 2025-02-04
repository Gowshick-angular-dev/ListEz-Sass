import React,{FC, useState} from 'react';
import { useIntl } from 'react-intl';
import { ExpenseReport } from './expenseReport';
import { FinanceSummaryReport } from './financeSummaryReport';
import { InvoiceCreatedReport } from './invoiceCreatedReport';
import { FinanceReportList } from './listTable';

type Props = {
    users?: any,
    teams?: any
}

const FinanceLead: FC<Props> = (props) => {
    const intl = useIntl();
    const [title, setTitle] = useState<any>("contact_reports");
    const [tabName, setTabName] = useState<any>("contact_reports");
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
                                    <a className='text-dark nav-link active' id="financeSummary-tab" data-bs-toggle="pill" data-bs-target="#financeSummary" type="button" role="tab" aria-controls="financeSummary" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setTabName('financeSummary');
                                    setContacts([]);
                                    }}>
                                    {intl.formatMessage({id: 'invoice_created_report'})}
                                    </a>                                     
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="invoicecreated-tab" data-bs-toggle="pill" data-bs-target="#invoicecreated" type="button" role="tab" aria-controls="invoicecreated" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setTabName('invoicecreated');
                                    setContacts([]);
                                    }}>
                                    {intl.formatMessage({id: 'invoice_created_report'})}
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="expenses-tab" data-bs-toggle="pill" data-bs-target="#expenses" type="button" role="tab" aria-controls="expenses" aria-selected="true" onClick={() => {
                                    setTitle('');
                                    setTabName('expenses');
                                    setContacts([]);
                                    }}>
                                    {intl.formatMessage({id: 'expenses_report'})}
                                    </a>                                     
                                </li> */}
                            </ul>                            
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-8">                    
                    <div className="card-group">
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div  className="tab-pane fade show active" id="financeSummary" role="tabpanel" aria-labelledby="financeSummary-tab">
                            <FinanceSummaryReport setContacts={setContacts} contacts={contacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>                                                  
                        <div  className="tab-pane fade" id="invoicecreated" role="tabpanel" aria-labelledby="invoicecreated-tab">
                            <InvoiceCreatedReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>                                                  
                        <div  className="tab-pane fade" id="expenses" role="tabpanel" aria-labelledby="expenses-tab">
                            <ExpenseReport setContacts={setContacts} setListTitle={setTitle} users={users} teams={teams} />
                        </div>                            
                    </div>                        
                    </div>
                </div>
                {tabName != "financeSummary" &&
                <div className='col-12'>
                    {contacts.length > 0 &&
                    <FinanceReportList contacts={contacts} title={title}/>}
                </div>}
            </div>
        </section>
    )
}

export{FinanceLead}