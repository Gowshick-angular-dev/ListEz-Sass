import React,{FC} from 'react';
import { toAbsoluteUrl } from '../../../_metronic/helpers';
import { DashboardPieChart } from '../dashboard/pieChart';

const FavoriteLead: FC = () => {
    return(
        <section className='report_lead'>
            <div className="row">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-4 pb-5">
                    <div className="card h-100 bg-light type_card">
                        <div className="card-header">
                            <div className="input-group form_search me-3">
                                <input type="text" className="form-control" placeholder="Search"/>
                                <div className="input-group-append">
                                    <button className="btn btn-secondary" type="button">
                                    <img src={toAbsoluteUrl('/media/custom/header-icons/search.svg')} className="svg_icon" alt='' />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body px-4">
                            <ul className="nav nav-pills masters_tab d-block px-3 border-0" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link active' id="leadreport-tab" data-bs-toggle="pill" data-bs-target="#leadreport" type="button" role="tab" aria-controls="leadreport" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Lead Report
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="leadsource-tab" data-bs-toggle="pill" data-bs-target="#leadsource" type="button" role="tab" aria-controls="leadsource" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Lead Source
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="tranreport-tab" data-bs-toggle="pill" data-bs-target="#tranreport" type="button" role="tab" aria-controls="tranreport" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Transaction Report
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="sitevisit-tab" data-bs-toggle="pill" data-bs-target="#sitevisit" type="button" role="tab" aria-controls="sitevisit" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Site Visit
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="bwrreport-tab" data-bs-toggle="pill" data-bs-target="#bwrreport" type="button" role="tab" aria-controls="bwrreport" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Builder Wise Revenue Report
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="pwlreport-tab" data-bs-toggle="pill" data-bs-target="#pwlreport" type="button" role="tab" aria-controls="pwlreport" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    Project Wise Lead Report
                                    </a>                                     
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className='text-dark nav-link' id="cwlreport-tab" data-bs-toggle="pill" data-bs-target="#cwlreport" type="button" role="tab" aria-controls="cwlreport" aria-selected="true">
                                    {/* <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr001.svg')} className="svg_icon me-2" alt='' /> */}
                                    City Wise Lead Report
                                    </a>                                     
                                </li>                                
                            </ul>                            
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-8">                    
                    <div className="card-group">
                    <div className="tab-content w-100" id="pills-tabContent">
                        <div  className="tab-pane fade show active" id="leadreport" role="tabpanel" aria-labelledby="leadreport-tab">
                            <div className="row">
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">                                
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Lead Report</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div  className="tab-pane fade" id="leadsource" role="tabpanel" aria-labelledby="leadsource-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Lead Source</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                        <div  className="tab-pane fade" id="tranreport" role="tabpanel" aria-labelledby="tranreport-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Transaction Report</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                        <div  className="tab-pane fade" id="sitevisit" role="tabpanel" aria-labelledby="sitevisit-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Site Visit</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                        <div  className="tab-pane fade" id="bwrreport" role="tabpanel" aria-labelledby="bwrreport-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Builder Wise Revenue Report</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                        <div  className="tab-pane fade" id="pwlreport" role="tabpanel" aria-labelledby="pwlreport-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>Project Wise Lead Report</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                        <div  className="tab-pane fade" id="cwlreport" role="tabpanel" aria-labelledby="cwlreport-tab">
                            <div className="row">                          
                                <div className="col-xxl-4 col-xl-6 col-lg-8 col-md-10 col-sm-12 mb-4">
                                    <div className="card h-100 bs_1 mx-3">
                                        <div className="card-header">
                                            <h4>City Wise Lead Report</h4>
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="d-flex me-3">
                                                    <i className="fa fa-star me-2 text-warning" aria-hidden="true"></i>
                                                    <i className="fa fa-download me-2" aria-hidden="true"></i>
                                                </div>
                                                <select className="form-select dash_btn me-2 mb-1">
                                                    <option selected>Teams</option>
                                                    <option value="1">Brigade Sales Team</option>
                                                    <option value="1">Godrej Sales Team</option>
                                                    <option value="1">Shriram Sales Team</option>
                                                </select>                                                
                                            </div>
                                        </div>
                                        <div className="card-body p-3">
                                            <DashboardPieChart/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                            
                    </div>                        
                    </div>
                </div>
            </div>
        </section>
    )
}
export{FavoriteLead}