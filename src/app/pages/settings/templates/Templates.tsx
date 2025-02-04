import React,{FC, useEffect, useState} from 'react'
import { Mail } from './email';
import { SMS } from './sms';
import { Watsapp } from './watsapp';
import { useIntl } from 'react-intl';

const Templates: FC = () => {
    const intl = useIntl();
    const [clicked1, setClicked1] = useState<Boolean>(false);
    const [clicked2, setClicked2] = useState<Boolean>(false);
    const [params, setParams] = useState<any>('1');

    useEffect(() => {
        const queryString = window.location.search;
        if(queryString) {        
        setParams(queryString.split('?')[1]); 
        }   
    }, [window.location.search]);

    const clickedWatsapp = () => {
        setClicked2(true);
    }

    return(
        <div className="bg_white h-100 p-4 pt-9">    
            <Mail/>        
            <ul className="user_manage_page nav nav-pills mb-5 border-bottom d-none" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className={params == 1 ? "nav-link active" : "nav-link"} id="pills-org-tab" data-bs-toggle="pill" data-bs-target="#pills-org" type="button" role="tab" aria-controls="pills-org" aria-selected="true">{intl.formatMessage({id: 'email'})}</button>
                </li>
                {/* <li className="nav-item" role="presentation">
                    <button className="nav-link" id="user-charts-tab" onClick={clickedSms} data-bs-toggle="pill" data-bs-target="#user-charts" type="button" role="tab" aria-controls="user-charts" aria-selected="false">{intl.formatMessage({id: 'sms'})}</button>
                </li> */}
                <li className="nav-item" role="presentation">
                    <button className={params == 2 ? "nav-link active" : "nav-link"} id="manage-teams-tab" onClick={clickedWatsapp} data-bs-toggle="pill" data-bs-target="#manage-teams" type="button" role="tab" aria-controls="manage-teams" aria-selected="false">{intl.formatMessage({id: 'whatsapp'})}</button>
                </li>                
            </ul>
            {/* <div className="tab-content" id="pills-tabContent">
                <div className={params == 1 ? "tab-pane fade show active" : "tab-pane fade"} id="pills-org" role="tabpanel" aria-labelledby="pills-org-tab">
                    <Mail/>
                </div>
                <div className="tab-pane fade" id="user-charts" role="tabpanel" aria-labelledby="user-charts-tab">
                    { clicked1 && <SMS/> }
                </div>
                <div className={params == 2 ? "tab-pane fade show active" : "tab-pane fade"} id="manage-teams" role="tabpanel" aria-labelledby="manage-teams-tab">
                    { clicked2 && <Watsapp/> }
                </div>                  
            </div> */}
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="mailTempCreate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'mail_template_createted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="mailTempUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'mail_template_updateted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="mailTempDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'mail_template_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="whatsappTempCreate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'whatsapp_template_createted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="whatsappTempUpdate">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'whatsapp_template_updateted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="whatsappTempDelete">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'whatsapp_template_deleted_successfully'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="tempAlreadyExist">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'already_exist'})}!</div>
                </div>
            </div>
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="tempErrMsg">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'error'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'something_went_wrong'})}!</div>
                </div>
            </div>
        </div>
    )
}

export {Templates}