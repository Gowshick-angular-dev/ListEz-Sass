import React,{FC, useState} from 'react'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'

import DataTable from 'react-data-table-component'; 



const AlertsAndNotificationSettings: FC = () => {
    
    const [toggle, setToggle] = useState(false);

    const handleHideData = () => {
        setToggle(!toggle);
    };

    return(
        
        <div className="tab-pane" id="pills-personal" role="tabpanel" aria-labelledby="pills-personal-tab">
            <div className="d-flex flex-column flex-center mb-9">   
                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                <h2>Under Construction</h2>
            </div>
        <form action="" className=''>
            <div className="row">
                <div className="col-lg-12 col-xxl-12">
                    <div className="card bs_1">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">                                    
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Alert Template</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Alert Title</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Host"/> 
                                                </div>
                                            </div>
                                        </div>                                      
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Record Type</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Event Type</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Alert Type</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Sender Id</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">CC</label>
                                                <select className="form-select btn-sm text-start">
                                                    <option value="default">Select</option>
                                                    <option>Option 1</option>
                                                    <option>Option 2</option>
                                                </select>  
                                            </div>                                                    
                                        </div>
                                        <div className="col-xl-4">                                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Email Subject</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="User Id"/> 
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-4">                                        
                                            <div className="form-group mb-4">
                                                <label htmlFor="basic-url" className="form-label">Text</label>
                                                <div className="input-group">
                                                    <textarea className="form-control" placeholder="Encryption"/> 
                                                </div>
                                            </div>
                                        </div>                                                
                                    </div>
                                    <div className='text-end mt-4'>
                                        <button className='btn btn_primary'>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    )
}
export {AlertsAndNotificationSettings}