import React,{FC, useState,useEffect} from 'react'
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {uploadFileContact, getContacts, getContactByRole} from './core/_requests'
import {useAuth} from '../../../app/modules/auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useIntl} from 'react-intl';

const initialValues = {
    uploadfile: '',
}

type Props = {
  setContacts?: any,
  sortByOnChange?: any
}

const ContactImportForm:  FC<Props> = (props) => {
  const intl = useIntl();
    const {
      setContacts, sortByOnChange
    } = props

    const contactImportSchema = Yup.object().shape({
        uploadfile: Yup.string(),
    })

    const [loading, setLoading] = useState(false)

    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profileImageName, setProfileImageName] = useState('');
    const {currentUser, logout} = useAuth();

    const formik = useFormik({
        initialValues,
        validationSchema: contactImportSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();

            formData.append('uploadfile', profileImage);

            const headers = {
                headers: {
                    "Content-type": "multipart/form-data",
                },                    
              }
      
            const saveContactData = await uploadFileContact(formData, headers)
     
            if(saveContactData != null){
                setLoading(false);
                setProfileImagePreview('');
                setProfileImage('');
                resetForm();
                document.getElementById('kt_contact_import_close')?.click();
                document.getElementById('contactReload')?.click();
                var toastEl = document.getElementById('myToastUpload');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
        } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })

    // const handleProfileImagePreview = (e:any) => {
    //     let image_as_base64:any = URL.createObjectURL(e.target.files[0])
    //     let image_as_files:any = e.target.files[0];

    //     if (image_as_files) {
    //       const fileExtension = image_as_files.name?.split('.').pop().toLowerCase();
    //       if (fileExtension === 'xlsx' || fileExtension === 'csv') {
    //         setProfileImagePreview(image_as_base64);
    //         setProfileImage(image_as_files);
    //         setProfileImageName(image_as_files.name);
    //       } else {
    //         (document.getElementById('ksdgiuriugtiughrtiuhr') as HTMLInputElement).value = "";
    //         var toastEl = document.getElementById('contactImportErrToast');
    //         const bsToast = new Toast(toastEl!);
    //         bsToast.show();
    //       }
    //     }

    //     console.log("ehwrguyguwrevfjhgefw", image_as_base64, image_as_files);
        
      
        
    // }

    const isValidDocumentUploaded=(file:any)=>{
      console.log("wjuweiueriwuegrwer",file)
      const validExtensions = ['xls', 'xlsx']
      const fileExtension = file.type.split('/')[1]
      const fileName = file.name.split('.')[1]
      if(validExtensions.includes(fileExtension)) {
      return validExtensions.includes(fileExtension)
    } else {
        return validExtensions.includes(fileName)
      }
    }
    
    const handleProfileImagePreview = (e:any) => {
        if(e.target.files[0].size > 2097152) {
          var toastEl = document.getElementById('contactImportErrToast');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
          (document.getElementById('ksdgiuriugtiughrtiuhr') as HTMLInputElement).value = '';
          return;
        } else {
        const file = e.target.files[0];
        if(isValidDocumentUploaded(file)){
          let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
          let image_as_files:any = e.target.files[0];
          setProfileImagePreview(image_as_base64);
          setProfileImage(image_as_files);
        }else{
          (document.getElementById('ksdgiuriugtiughrtiuhr') as HTMLInputElement).value = '';
          var toastEl = document.getElementById('contactImportErrToast');
          const bsToast = new Toast(toastEl!);
          bsToast.show();
        }}
    }

    return(
        
        <div className='card shadow-none rounded-0 w-100'>
          <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_contact_import_header'>
            <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'import_excel_sheet'})}</h3>            
            <div className='card-toolbar'>
              <div>
              <a href={toAbsoluteUrl('/sheets/contacts.xlsx')} title='Download sample file for import' className="me-3 btn btn-sm d-block text-nowrap" download="contacts_sheet.xlsx">
                  <KTSVG path='/media/icons/duotune/files/fil021.svg' className='svg-icon-4 svg-icon-dark me-1'/>
                  {intl.formatMessage({id: 'sample_file'})}
                </a>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                id='kt_contact_import_close'
              >
                  <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
              </button>
            </div>
          </div>
          <div aria-atomic="true" aria-live="assertive" className="toast bg-success text-white position-absolute end-0 bottom-0 m-3" id="myToastUpload">
            <div className="toast-header">
              <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
              <button aria-label="Close" className="btn-close" 
                data-bs-dismiss="toast" type="button">
              </button>
            </div>
            <div className="toast-body">
                {intl.formatMessage({id: 'contact_imported_successfully'})}!
            </div>
          </div>
          <div className='card-body position-relative' id='kt_contact_import_body'>
          
          <div className="accordion" id="accordionExample"> 

          <form noValidate onSubmit={formik.handleSubmit} className='contact_form'>
                <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                        {profileImagePreview != null && (
                            <div className='d-flex align-items-center flex-column'>
                             <img src={toAbsoluteUrl('/media/svg/files/folder-document.svg')} alt="image preview" height={100} width={100}/>
                             <p>{profileImageName}</p>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <span className="btn btn-file">
                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_sheet'})}
                        <input type="file" name="profile_image" id='ksdgiuriugtiughrtiuhr' onChange={handleProfileImagePreview}/>
                        <small className='text-dark required' >Note: .xlxs only acceptable and max 2mb</small>
                        </span>
                    </div>
                </div>
              <div className='card-footer py-5 text-center' id='kt_contact_import_footer'>
                  <button
                  type='submit'
                  
                  className='btn btn_primary text-primary'
                  disabled={formik.isSubmitting}
                >
                  {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                  <KTSVG
                  path='/media/custom/save_white.svg'
                  className='svg-icon-3 svg-icon-primary ms-2'
                />
                  </span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      {intl.formatMessage({id: 'please_wait'})}...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
                  
              </div>
          </form>
        </div>

          </div>
          {/* <div className='card-footer py-5 text-center' id='kt_contact_footer'>
            <Link to='/dashboard' className='btn btn_primary text-primary'>
            Save
              <KTSVG
                path='/media/custom/save_white.svg'
                className='svg-icon-3 svg-icon-primary ms-2'
              />
            </Link>
          </div> */}
         
        </div>
    )
}

export {ContactImportForm}