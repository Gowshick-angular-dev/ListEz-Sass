import React,{FC, useState,useEffect} from 'react'
import { Toast } from 'bootstrap';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import {useAuth} from '../../../app/modules/auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'

const initialValues = {
    uploadfile: '',
}

type Props = {
  setTasks?: any
}

const TaskImportForm:  FC<Props> = (props) => {

  const {setTasks} = props

    const TaskImportSchema = Yup.object().shape({
        uploadfile: Yup.string(),
    })

    const [loading, setLoading] = useState(false)
    const {currentUser, logout} = useAuth();
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema: TaskImportSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {

            var formData = new FormData();

            formData.append('uploadfile', profileImage);

            var userId = currentUser?.id;
            var roleId = currentUser?.designation;

            const headers = {
                headers: {
                    "Content-type": "multipart/form-data",
                },                    
            }
      
            // const saveTaskData = await uploadFileTask(formData, headers)
     
            // if(saveTaskData != null){
            //     setLoading(false);
            //     document.getElementById('kt_task_import_close')?.click();
            //     var toastEl = document.getElementById('myToastUpload');
            //     const bsToast = new Toast(toastEl!);
            //     bsToast.show();
            //     const characterResponse = await getTasksByRole(userId, roleId);
            //     setTasks(characterResponse)
            //     setProfileImagePreview('');
            //     setProfileImage('');
            //     resetForm();
            // }
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
          <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_task_import_header'>
            <h3 className='card-title fw-bolder text-dark'>Import Excel sheet</h3>
            
            <div className='card-toolbar'>
              <div>
              <a href={toAbsoluteUrl('/sheets/tasks.xlsx')} title='Download sample file for import' className="me-4 btn btn-sm me-4 d-block" download="tasks_sheet.xlsx">
                  <KTSVG path='/media/icons/duotune/files/fil021.svg' className='svg-icon-4 svg-icon-dark me-1'/>
                  Sample File
                </a>
              </div>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                id='kt_task_import_close'
              >
                  <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
              </button>
            </div>
          </div>
          <div aria-atomic="true" aria-live="assertive" className="toast bg-success text-white position-absolute end-0 bottom-0 m-3" id="myToastUpload">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button aria-label="Close" className="btn-close" 
                data-bs-dismiss="toast" type="button">
              </button>
            </div>
            <div className="toast-body">
                Task Imported Successfully!
            </div>
          </div>
          <div className='card-body position-relative' id='kt_task_import_body'>
          
          <div className="accordion" id="accordionExample"> 

          <form noValidate onSubmit={formik.handleSubmit} className='task_form'>
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
                        <i className="fa fa-upload my-2" aria-hidden="true"></i>Upload Sheet
                        <input type="file" name="profile_image" onChange={handleProfileImagePreview}/>
                        </span>
                    </div>
                </div>
              <div className='card-footer py-5 text-center' id='kt_task_import_footer'>
                  <button
                  type='submit'
                  
                  className='btn btn_primary text-primary'
                  disabled={formik.isSubmitting}
                >
                  {!loading && <span className='indicator-label'>Submit
                  <KTSVG
                  path='/media/custom/save_white.svg'
                  className='svg-icon-3 svg-icon-primary ms-2'
                />
                  </span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
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

export {TaskImportForm}