import React,{FC, useState} from 'react'
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {uploadFileProperty, getProperties} from './core/_requests'
import {useAuth} from '../../../app/modules/auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useIntl } from 'react-intl';

const initialValues = {
    uploadfile: '',
}

type Props = {
  setProperty?: any
}

const PropertyImportForm: FC<Props> = (props) => {
  const {setProperty} = props
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  var userId = currentUser?.id;

    const propertyImportSchema = Yup.object().shape({
        uploadfile: Yup.string(),
    })

    const [loading, setLoading] = useState(false)
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema: propertyImportSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();
            formData.append('uploadfile', profileImage);
            const headers = {headers: {
                    "Content-type": "multipart/form-data",},                    
            }

            const savePropertyData = await uploadFileProperty(formData, headers)     
            if(savePropertyData != null){
                setLoading(false);
                document.getElementById('kt_property_import_close')?.click();
                var toastEl = document.getElementById('myToastUpload');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                const characterResponse = await getProperties(userId)
                setProperty(characterResponse)
                setProfileImagePreview('');
                setProfileImage('');
                resetForm();
            }
        } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })

    const handleProfileImagePreview = (e:any) => {
        let image_as_base64:any = URL.createObjectURL(e.target.files[0])
        let image_as_files:any = e.target.files[0];      
        setProfileImagePreview(image_as_base64);
        setProfileImage(image_as_files);
    }

    return(        
        <div className='card shadow-none rounded-0 w-100'>
          <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_property_import_header'>
            <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'import_excel_sheet'})}</h3>            
            <div className='card-toolbar'>
              <div>
              <a href={toAbsoluteUrl('/sheets/properties.xlsx')} title='Download sample file for import' className="me-4 btn btn-sm me-4 d-block" download="projects_sheet.xlsx">
                  <KTSVG path='/media/icons/duotune/files/fil021.svg' className='svg-icon-4 svg-icon-dark me-1'/>
                  {intl.formatMessage({id: 'sample_file'})}
                </a>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                id='kt_property_import_close'
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
                {intl.formatMessage({id: 'project_imported_successfully'})}!
            </div>
          </div>
          <div className='card-body position-relative' id='kt_property_import_body'>          
          <div className="accordion" id="accordionExample"> 
          <form noValidate onSubmit={formik.handleSubmit} className='property_form'>
                <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                        {profileImagePreview != null && (
                            <div className='d-flex align-items-center flex-column'>
                             <img src={toAbsoluteUrl('/media/svg/files/folder-document.svg')} alt="image preview" height={100} width={100}/>
                             <p>{profileImagePreview}</p>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <span className="btn btn-file">
                        <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload_sheet'})}
                        <input type="file" name="profile_image" onChange={handleProfileImagePreview}/>
                        </span>
                    </div>
                </div>
              <div className='card-footer py-5 text-center' id='kt_property_import_footer'>
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
        </div>
    )}

export {PropertyImportForm}