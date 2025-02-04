import React,{FC} from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers'


const File: FC = () => {
    return(
        <>
        <div className="d-flex flex-column flex-center" data-theme="dark">   
            <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
            <h2>Under Construction</h2>
        </div>
        {/* <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className='myDIV'>
            <div className='d-flex align-items-center justify-content-center h-100 vh-50'>
        {
            isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or <span className='text-primary'>click</span> to select files</p>
        }
        </div>
        </div>
        <div className='p-5 text-end'>
        <button
            type='submit'
            
            className='btn btn_primary text-primary'
            disabled={formik.isSubmitting}
            >
            {!loading && <span className='indicator-label'>Save
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
        </div> */}
        </>
    )
}

export {File}