import React,{FC} from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers'


const MessagePage: FC = () => {
    return(
        <>
        <div className="d-flex flex-column flex-center">   
            <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
            <h1>Under Construction</h1>
        </div>
        <div className="d-flex flex-column flex-lg-row d-none">
        <div className="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
            <div className="card card-flush">
                <div className="card-header pt-7" id="kt_chat_contacts_header">
                    <form className="w-100 position-relative" autoComplete="off">
                        <span className="svg-icon svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor"></rect><path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor"></path>
                            </svg>
                        </span>
                        <input type="text" className="form-control form-control-solid px-15" name="search" placeholder="Search by username or email..."/>
                    </form>
                </div>
                <div className="card-body pt-5" id="kt_chat_contacts_body">
                    <div className="scroll-y me-n5 pe-5 h-200px h-lg-auto" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header" data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body" data-kt-scroll-offset="0px">
                        <div className="d-flex flex-stack py-4">
                            <div className="d-flex align-items-center">
                                <div className="symbol symbol-45px symbol-circle">
                                    <span className="symbol-label bg-light-danger text-danger fs-6 fw-bolder">M</span>
                                </div>
                                <div className="ms-5">
                                    <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Melody Macy</a>
                                    <div className="fw-bold text-gray-400">melody@altbox.com</div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end ms-2">
                                <span className="text-muted fs-7 mb-1">5 hrs</span>
                            </div>
                        </div>
                        <div className="separator separator-dashed d-none"></div>
                        <div className="d-flex flex-stack py-4">
                            <div className="d-flex align-items-center">
                                <div className="symbol symbol-45px symbol-circle">
                                    <img alt="Pic" src="/media/avatars/300-1.jpg"/>
                                </div>
                                <div className="ms-5">
                                    <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Max Smith</a>
                                    <div className="fw-bold text-gray-400">max@kt.com</div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end ms-2">
                                <span className="text-muted fs-7 mb-1">20 hrs</span>
                            </div>
                        </div>
                        <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <img alt="Pic" src="/media/avatars/300-5.jpg"/>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Sean Bean</a>
                                        <div className="fw-bold text-gray-400">sean@dellito.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">20 hrs</span>
                                    <span className="badge badge-sm badge-circle badge-light-success">6</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Brian Cox</a>
                                        <div className="fw-bold text-gray-400">brian@exchange.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">20 hrs</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <span className="symbol-label bg-light-warning text-warning fs-6 fw-bolder">M</span>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Mikaela Collins</a>
                                        <div className="fw-bold text-gray-400">mikaela@pexcom.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">1 day</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <img alt="Pic" src="/media/avatars/300-9.jpg"/>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Francis Mitcham</a>
                                        <div className="fw-bold text-gray-400">f.mitcham@kpmg.com.au</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">5 hrs</span>
                                    <span className="badge badge-sm badge-circle badge-light-success">6</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <span className="symbol-label bg-light-danger text-danger fs-6 fw-bolder">O</span>
                                        <div className="symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n2 mt-n2"></div>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Olivia Wild</a>
                                        <div className="fw-bold text-gray-400">olivia@corpmail.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">1 week</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <span className="symbol-label bg-light-primary text-primary fs-6 fw-bolder">N</span>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Neil Owen</a>
                                        <div className="fw-bold text-gray-400">owen.neil@gmail.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">20 hrs</span>
                                    <span className="badge badge-sm badge-circle badge-light-success">6</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <img alt="Pic" src="/media/avatars/300-23.jpg"/>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Dan Wilson</a>
                                        <div className="fw-bold text-gray-400">dam@consilting.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">2 weeks</span>
                                    <span className="badge badge-sm badge-circle badge-light-warning">9</span>
                                </div>
                            </div>
                            <div className="separator separator-dashed d-none"></div>
                            <div className="d-flex flex-stack py-4">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-45px symbol-circle">
                                        <span className="symbol-label bg-light-danger text-danger fs-6 fw-bolder">E</span>
                                        <div className="symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n2 mt-n2"></div>
                                    </div>
                                    <div className="ms-5">
                                        <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2">Emma Bold</a>
                                        <div className="fw-bold text-gray-400">emma@intenso.com</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-2">
                                    <span className="text-muted fs-7 mb-1">1 day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-lg-row-fluid ms-lg-7 ms-xl-10">
                <div className="card" id="kt_chat_messenger">
                    <div className="card-header" id="kt_chat_messenger_header">
                        <div className="card-title">
                            <div className="symbol-group symbol-hover">
                                <div className="symbol symbol-35px symbol-circle">
                                    <img alt="Pic" src="/media/avatars/300-5.jpg"/>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <span className="symbol-label bg-light-warning text-warning 40px">M</span>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <img alt="Pic" src="/media/avatars/300-9.jpg"/>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <span className="symbol-label bg-light-danger text-danger 40px">O</span>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <span className="symbol-label bg-light-primary text-primary 40px">N</span>
                                </div>
                                <div className="symbol symbol-35px symbol-circle">
                                    <img alt="Pic" src="/media/avatars/300-23.jpg"/>
                                </div>
                                <a href="#" className="symbol symbol-35px symbol-circle">
                                    <span className="symbol-label fs-8 fw-bolder" data-bs-toggle="tooltip" data-bs-trigger="hover" title="View more users">+42</span>
                                </a>
                            </div>
                        </div>
                        <div className="card-toolbar">
                            <div className="me-n3">
                                <button className="btn btn-sm btn-icon btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                    <i className="bi bi-three-dots fs-2"></i>
                                </button>
                                <div className="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true">
                                    <div className="px-7 py-5">
                                        <div className="fs-5 text-dark fw-bolder">Filter Options</div>
                                    </div>
                                    <div className="separator border-gray-200"></div>
                                    <div className="px-7 py-5">
                                        <div className="mb-10">
                                            <label className="form-label fw-bold">Status:</label>
                                            <div>
                                                <select className="form-select form-select-solid" data-kt-select2="true" data-placeholder="Select option" data-allow-clear="true">
                                                    <option></option>
                                                    <option value="1" selected>Approved</option>
                                                    <option value="2">Pending</option>
                                                    <option value="3">In Process</option>
                                                    <option value="4">Rejected</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-10">
                                            <label className="form-label fw-bold">Member Type:</label>
                                            <div className="d-flex">
                                                <label className="form-check form-check-sm form-check-custom form-check-solid me-5">
                                                    <input className="form-check-input" type="checkbox" value="1"/>
                                                    <span className="form-check-label">Author</span>
                                                </label>
                                                <label className="form-check form-check-sm form-check-custom form-check-solid">
                                                    <input className="form-check-input" type="checkbox" value="2" checked />
                                                    <span className="form-check-label">Customer</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mb-10">
                                            <label className="form-label fw-bold">Notifications:</label>
                                            <div className="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                                <input className="form-check-input" type="checkbox" name="notifications" value="" checked/>
                                                <label className="form-check-label">Enabled</label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button type="reset" className="btn btn-sm btn-light btn-active-light-primary me-2" data-kt-menu-dismiss="true">Reset</button>
                                            <button type="submit" className="btn btn-sm btn-primary" data-kt-menu-dismiss="true">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" id="kt_chat_messenger_body">
                        <div className="scroll-y me-n5 pe-5 h-300px h-lg-auto" data-kt-element="messages" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer" data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body" data-kt-scroll-offset="5px">
                            <div className="d-flex d-flex justify-content-start mb-10 mb-10">
                                <div className="d-flex flex-column align-items align-items-start">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="symbol  symbol-35px symbol-circle ">
                                            <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                        </div>
                                        <div className="ms-3">
                                            <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">Brian Cox</a>
                                            <span className="text-muted fs-7 mb-1">2 mins</span>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start" data-kt-element="message-text">How likely are you to recommend our company to your friends and family ?</div>
                                </div>
                            </div>
                            <div className="d-flex d-flex justify-content-end mb-10 mb-10">
                                <div className="d-flex flex-column align-items align-items-end">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="me-3">
                                            <span className="text-muted fs-7 mb-1">5 mins</span>
                                            <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1">You</a>
                                        </div>
                                        <div className="symbol  symbol-35px symbol-circle ">
                                            <img alt="Pic" src="/media/avatars/300-1.jpg"/>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end" data-kt-element="message-text">Hey there, we’re just writing to let you know that you’ve been subscribed to a repository on GitHub.</div>
                                </div>
                            </div>
                            <div className="d-flex d-flex justify-content-start mb-10 mb-10">
                                <div className="d-flex flex-column align-items align-items-start">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="symbol  symbol-35px symbol-circle ">
                                            <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                        </div>
                                        <div className="ms-3">
                                            <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">Brian Cox</a>
                                            <span className="text-muted fs-7 mb-1">1 Hour</span>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start" data-kt-element="message-text">Ok, Understood!</div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-end mb-10 mb-10">
                                    <div className="d-flex flex-column align-items align-items-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="me-3">
                                                <span className="text-muted fs-7 mb-1">2 Hours</span>
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1">You</a>
                                            </div>
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-1.jpg"/>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end" data-kt-element="message-text">You’ll receive notifications for all issues, pull requests!</div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-start mb-10 mb-10">
                                    <div className="d-flex flex-column align-items align-items-start">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                            </div>
                                            <div className="ms-3">
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">Brian Cox</a>
                                                <span className="text-muted fs-7 mb-1">3 Hours</span>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start" data-kt-element="message-text">You can unwatch this repository immediately by clicking here: 
                                        <a href="https://keenthemes.com">Keenthemes.com</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-end mb-10 mb-10">
                                    <div className="d-flex flex-column align-items align-items-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="me-3">
                                                <span className="text-muted fs-7 mb-1">4 Hours</span>
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1">You</a>
                                            </div>
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-1.jpg"/>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end" data-kt-element="message-text">Most purchased Business courses during this sale!</div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-start mb-10 mb-10">
                                    <div className="d-flex flex-column align-items align-items-start">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                            </div>
                                            <div className="ms-3">
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">Brian Cox</a>
                                                <span className="text-muted fs-7 mb-1">5 Hours</span>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start" data-kt-element="message-text">Company BBQ to celebrate the last quater achievements and goals. Food and drinks provided</div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-end mb-10 mb-10 d-none">
                                    <div className="d-flex flex-column align-items align-items-end">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="me-3">
                                                <span className="text-muted fs-7 mb-1">Just now</span>
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1">You</a>
                                            </div>
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-1.jpg"/>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-primary text-dark fw-bold mw-lg-400px text-end" data-kt-element="message-text"></div>
                                    </div>
                                </div>
                                <div className="d-flex d-flex justify-content-start mb-10 mb-10 d-none">
                                    <div className="d-flex flex-column align-items align-items-start">
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="symbol  symbol-35px symbol-circle ">
                                                <img alt="Pic" src="/media/avatars/300-25.jpg"/>
                                            </div>
                                            <div className="ms-3">
                                                <a href="#" className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">Brian Cox</a>
                                                <span className="text-muted fs-7 mb-1">Just now</span>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start" data-kt-element="message-text">Right before vacation season we have the next Big Deal for you.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer pt-4" id="kt_chat_messenger_footer">
                                <textarea className="form-control form-control-flush mb-3" rows={1} data-kt-element="input" placeholder="Type a message"></textarea>
                                <div className="d-flex flex-stack">
                                    <div className="d-flex align-items-center me-2">
                                        <button className="btn btn-sm btn-icon btn-active-light-primary me-1" type="button" data-bs-toggle="tooltip" title="Coming soon">
                                            <i className="bi bi-paperclip fs-3"></i>
                                        </button>
                                        <button className="btn btn-sm btn-icon btn-active-light-primary me-1" type="button" data-bs-toggle="tooltip" title="Coming soon">
                                            <i className="bi bi-upload fs-3"></i>
                                        </button>
                                    </div>
                                    <button className="btn btn-primary" type="button" data-kt-element="send">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export {MessagePage}