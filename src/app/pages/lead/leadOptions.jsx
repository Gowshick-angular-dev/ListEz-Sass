import React,{FC, useState,useEffect} from 'react'
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../modules/auth'
import * as Yup from 'yup'
import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import { getAllTemplatesMail } from '../settings/templates/core/_requests'

const initialValues = {
    uploadfile: '',
}

const LeadOptions = (props) => {
  const intl = useIntl();
  const {setLeads} = props
  const ref = React.createRef();
  const [allTemplatesMail, setTemplatesMail] = useState([]);
  const [exp, setExp] = useState(false);
  const [expId, setExpId] = useState('');
  const [code, setCode] = useState(null);
  const [template, setTemplate] = useState({
    "title":'',
    "logo":0,
    "img1":0,
    "img2":0,
    "img3":0,
    "img4":0,
    "mobile":0,
    "email":0,
    "property_type":0,
    "locality":0,
    "city":0,
    "developer_name":0,
    "property_name":0,
    "property_status":0,
    "uds":0,
    "property_tower":0,
    "no_of_units":0,
    "rera_number":0,
    "plot_area":0,
    "builtup_area":0,
    "price":0,
    "no_of_floors":0,
    "configuration":0,
    "bathrooms":0,
    "facing":0,
    "car_parking":0,
    "amenities":0,
    "vasthu_complient":0,
    "download":'',
    "share":''
    });

    console.log("efjhwieurgwur", template);

  const MailById = async () => {
    const TemplatesMailResponse = await getAllTemplatesMail()
    setTemplatesMail(TemplatesMailResponse.output);
}

useEffect(() => {
  MailById();
}, []);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://js/jsPDF/dist/jspdf.umd.js';
  //   script.async = true;
  //   script.charset = 'utf-8';
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

return(<div>
      <div className='d-flex flex-wrap mb-5'>
      {allTemplatesMail.map((item, i) => {
        return(
            <div key={i} className='p-3'>
              <div className="mb-3 mb-md-0">
                <div className="form-check d-flex">
                  <input className="form-check-input" type="checkbox"/>
                  <label className="form-check-label mx-3" htmlFor="filterCheck">
                    {intl.formatMessage({id: item.title})}
                  </label>
                </div>
              </div>
              <div className='w-150px h-150px position-relative' data-bs-toggle='modal' data-bs-target={'#lead_option_over_popup'}
              onClick={() => {
                setCode(item.body);
              }}
              onMouseOver={() => {
                setExp(true);
                setExpId(i);
              }}
              onMouseOut={() => {
                setExp(false);
                setExpId('');
              }}>
                <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} className={exp && expId == i ? 'w-100 h-100 blur_effect' : 'w-100 h-100'} />
                {exp && expId == i && <img src={toAbsoluteUrl('/media/custom/overview-icons/expand_white.svg')} className='hover_icon_ov' width="25" height="25" fill="white" />}
              </div>
            </div>
        )})}
        <div className='modal fade' id={'lead_option_over_popup'} aria-hidden='true'>
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content border overflow-auto'>
              <div className='w-100' dangerouslySetInnerHTML={{ __html: code }}></div>
            </div>
          </div>
        </div>
        </div>
        <div className='mb-5'>
          <h3>{intl.formatMessage({id: 'select_fields'})}</h3>
          <div className='row mt-5'>
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox" onChange={(e) => setTemplate({...template, logo: e.target.checked ? 1 : 0})}/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck">
                          {intl.formatMessage({id: 'logo'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox" onChange={(e) => setTemplate({...template, img1: e.target.checked ? 1 : 0, img2: e.target.checked ? 1 : 0, img3: e.target.checked ? 1 : 0, img4: e.target.checked ? 1 : 0})}/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck">
                          {intl.formatMessage({id: 'images'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, mobile: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'mobile'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, email: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'email'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, property_type: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'property_type'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, locality: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'locality'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, city: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'city'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, developer_name: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'developer_name'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, property_name: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'project_name'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, property_status: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'project_status'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, uds: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'uds'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, property_tower: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'project_tower'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, no_of_units: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'no_of_units'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, rera_number: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'rera_number'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, plot_area: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'plot_area'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, builtup_area: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'builtup_area'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, price: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'price'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, no_of_floors: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'no_of_floors'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, configuration: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'configuration'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, bathrooms: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'bathrooms'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, facing: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'facing'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, car_parking: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'car_parking'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, amenities: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'amenities'})}
                      </label>
                  </div>
              </div>
            </div>    
            <div className='col-md-6 col-lg-4 col-xl-3 mb-4'>
              <div className="mb-3 mb-md-0">
                  <div className="form-check d-flex">
                      <input className="form-check-input" type="checkbox"/>
                      <label className="form-check-label mx-3" htmlFor="filterCheck" onChange={(e) => setTemplate({...template, vasthu_complient: e.target.checked ? 1 : 0})}>
                          {intl.formatMessage({id: 'vasthu_complient'})}
                      </label>
                  </div>
              </div>
            </div>               
          </div>
        </div> 
        <div className='d-flex justify-content-end me-3 mb-3'>
          <button type='button' className='btn btn-sm btn_primary me-3 br_15'>{intl.formatMessage({id: 'preview'})}<span class="svg-icon svg-icon-muted svg-icon-2 m-0 ps-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.7 18.9L18.6 15.8C17.9 16.9 16.9 17.9 15.8 18.6L18.9 21.7C19.3 22.1 19.9 22.1 20.3 21.7L21.7 20.3C22.1 19.9 22.1 19.3 21.7 18.9Z" fill="white"/>
          <path opacity="" d="M11 20C6 20 2 16 2 11C2 6 6 2 11 2C16 2 20 6 20 11C20 16 16 20 11 20ZM11 4C7.1 4 4 7.1 4 11C4 14.9 7.1 18 11 18C14.9 18 18 14.9 18 11C18 7.1 14.9 4 11 4ZM8 11C8 9.3 9.3 8 11 8C11.6 8 12 7.6 12 7C12 6.4 11.6 6 11 6C8.2 6 6 8.2 6 11C6 11.6 6.4 12 7 12C7.6 12 8 11.6 8 11Z" fill="white"/>
          </svg></span></button>
          <button type='button' id="downloadDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" className='btn btn-sm btn_primary me-3 br_15'>{intl.formatMessage({id: 'download'})}<span class="svg-icon svg-icon-muted svg-icon-2 m-0 ps-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path opacity="" d="M19 15C20.7 15 22 13.7 22 12C22 10.3 20.7 9 19 9C18.9 9 18.9 9 18.8 9C18.9 8.7 19 8.3 19 8C19 6.3 17.7 5 16 5C15.4 5 14.8 5.2 14.3 5.5C13.4 4 11.8 3 10 3C7.2 3 5 5.2 5 8C5 8.3 5 8.7 5.1 9H5C3.3 9 2 10.3 2 12C2 13.7 3.3 15 5 15H19Z" fill="white"/>
          <path d="M13 17.4V12C13 11.4 12.6 11 12 11C11.4 11 11 11.4 11 12V17.4H13Z" fill="white"/>
          <path opacity="" d="M8 17.4H16L12.7 20.7C12.3 21.1 11.7 21.1 11.3 20.7L8 17.4Z" fill="white"/>
          </svg></span></button>
          <ul className="dropdown-menu" aria-labelledby="downloadDropdown">
              <li><a className="dropdown-item cursor-pointer">{intl.formatMessage({id: 'pdf'})}</a></li>              
              <li><a className="dropdown-item cursor-pointer">{intl.formatMessage({id: 'jpeg'})}</a></li>              
          </ul>
          <button type='button' id="shareDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" className='btn btn-sm btn_primary br_15'>{intl.formatMessage({id: 'share'})}<span class="svg-icon svg-icon-muted svg-icon-3 m-0 ps-2"><svg width="15" height="15" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z" fill="white"/>
          <path opacity="" d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z" fill="white"/>
          </svg></span></button>
          <ul className="dropdown-menu" aria-labelledby="shareDropdown">
              <li><a className="dropdown-item cursor-pointer">{intl.formatMessage({id: 'copy_link'})}</a></li>              
              <li><a className="dropdown-item cursor-pointer">{intl.formatMessage({id: 'mail'})}</a></li>              
              <li><a className="dropdown-item cursor-pointer">{intl.formatMessage({id: 'whatsapp'})}</a></li>              
          </ul>
        </div>     
  </div>)
}

export {LeadOptions}