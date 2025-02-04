/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
}

const ListsWidget1: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className} h-100`}>
      {/* begin::Header */}
      <div className='card-heade border-0 pt-5 d-flex justify-content-between pb-3 pb-xl-0 px-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder text-dark'>Tasks Overview</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Pending 10 tasks</span> */}
        </h3>
        <div className="d-flex align-items-center justify-content-between">
            <select className="form-select dash_btn me-2 mb-2">
              <option selected>Today</option>
              <option value="1">Yersterday</option>
            </select>
            <select className="form-select dash_btn mb-2">
              <option selected>Arjun</option>
              <option value="1">Raj</option>
              <option value="2">Kumar</option>
            </select>
        </div>

        {/* <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          <Dropdown1 />
        </div> */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body pt-5'>
        
        <div className='d-flex align-items-center mb-7 bg-light br_10 p-2'>
          <div className='symbol symbol-35px me-5'>
            <span className='symbol-label bg_pending'>
            </span>
          </div>
          <div className='d-flex justify-content-between w-100'>
            <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
              Pending
            </a>
            <p className="mb-0">68</p>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7 bg-light br_10 p-2'>
          <div className='symbol symbol-35px me-5'>
            <span className='symbol-label bg_inprocess'>
            </span>
          </div>
          <div className='d-flex justify-content-between w-100'>
            <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
              In Process
            </a>
            <p className="mb-0">15</p>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7 bg-light br_10 p-2'>
         
          <div className='symbol symbol-35px me-5'>
            <span className='symbol-label bg_completed'>
            </span>
          </div>
         
          <div className='d-flex justify-content-between w-100'>
            <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
              Completed
            </a>
            <p className="mb-0">50</p>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7 bg-light br_10 p-2'>
          <div className='symbol symbol-35px me-5'>
            <span className='symbol-label bg_cancelled'>
            </span>
          </div>
          <div className='d-flex justify-content-between w-100'>
            <a  className='text-dark text-hover-primary fs-6 fw-bolder'>
              Cancelled
            </a>
            <p className="mb-0">9</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export {ListsWidget1}
