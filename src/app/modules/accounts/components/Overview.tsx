/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { getUser } from '../../../pages/settings/userManagement/core/_requests';
import { useAuth } from '../../auth';
import Moment from 'moment'
import {useIntl} from 'react-intl'
import moment from 'moment';
import { KTSVG } from '../../../../_metronic/helpers';
import { AccountHeader } from '../AccountHeader';
import { SignInMethod } from './settings/cards/SignInMethod';

export function Overview() {
  const intl = useIntl();
  const {currentUser, logout} = useAuth();
  const [userInfo, setUserInfo] = useState<any>({})
  const orgId = currentUser?.org_id;
  const userId = currentUser?.id;

  const FetchContactDetails =  async () => {
    const response = await getUser(userId)
    setUserInfo(response.output[0]);
  }

  useEffect(() => {
    FetchContactDetails();
  }, []);

  return (
    <>
  {orgId != 1 &&
    <AccountHeader />}
    <div>      
    {orgId != 1 &&
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>{intl.formatMessage({id: 'profile_details'})}</h3>
          </div>
          <Link to='/crafted/account/settings' className='btn btn_primary align-self-center'>
            {intl.formatMessage({id: 'edit_profile'})}
          </Link>
        </div>

        <div className='card-body p-9'>
          
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'full_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userInfo?.first_name+' '+userInfo?.last_name}</span>
            </div>
          </div>
        
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'employee_id'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userInfo?.employee_id}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'designation'})}</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{userInfo?.designation == 1 ? 'Admin' : userInfo?.designation == 2 ? 'Team Leader' : 'Excecutive'}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {intl.formatMessage({id: 'department'})}
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{userInfo?.department_name}</span>

            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {intl.formatMessage({id: 'email'})}
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{userInfo?.email}</span>

              <span className='badge badge-success'>{intl.formatMessage({id: 'verified'})}</span>
            </div>
          </div>

          {/* <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'branch'})}</label>

            <div className='col-lg-8'>
            <span className='fw-bolder fs-6 me-2'>{userInfo?.branch_name}</span>
            </div>
          </div> */}

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {intl.formatMessage({id: 'personal_contact_number'})}
            </label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userInfo?.p_phone_number}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'official_contact_number'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userInfo?.o_phone_number}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'emergency_contact_number'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.emergency_contact_no}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'blood_group'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.blood_group_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'official_mail'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.o_email}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'aadhar_number'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.aadhar_number}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'pan_number'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.pan_number}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'date_of_birth'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{moment(userInfo?.dob).format('DD-MMMM-YYYY')}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'past_employment_history'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.last_company}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'date_of_joining'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{Moment(userInfo?.date_of_joining).format('DD-MMMM-YYYY')}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'permenent_address'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.permenent_address}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'correspondant_address'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.correspondence_address}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'father_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.fathers_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'marital_status'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.marital_status_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'spouse_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.spouse_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'spouse_dob'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{moment(userInfo?.spouse_dob).format('DD-MMMM-YYYY') == "Invalid date" ? '' : moment(userInfo?.spouse_dob).format('DD-MMMM-YYYY')}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'no_of_kids'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.no_of_kids}</span>
            </div>
          </div>
          {userInfo?.no_of_kids > 0 &&
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'kid_name_1'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.kid_name_1}</span>
            </div>
          </div>}
          {userInfo?.no_of_kids > 1 &&
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'kid_name_2'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.kid_name_2}</span>
            </div>
          </div>}
          {userInfo?.no_of_kids > 2 &&
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'kid_name_3'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.kid_name_3}</span>
            </div>
          </div>}
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'anniversary_date'})}</label>
            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{moment(userInfo?.anniversary_date).format('DD-MMMM-YYYY') == "Invalid date" ? '' : moment(userInfo?.anniversary_date).format('DD-MMMM-YYYY')}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'emergency_contact_person_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.emergency_contact_person_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'emergency_contact_person_relation'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.relation_person}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'account_number'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.acc_number}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'ifsc_code'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.ifsc_code}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'bank_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.branch_name}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'bank_record_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.bank_record_name}</span>
            </div>
          </div>
          {/* <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'branch_name'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.branch_name}</span>
            </div>
          </div> */}
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: 'secondary_mobile'})}</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{userInfo?.sec_mobile}</span>
            </div>
          </div>          
        </div>
      </div>}     
    </div>
    <SignInMethod />
    <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="userProfileUpdate">
        <div className="toast-header">
            <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
            <button aria-label="Close" className="btn-close" 
                    data-bs-dismiss="toast" type="button">
            </button>
        </div>
        <div className="toast-body">
            {intl.formatMessage({id: 'profile_updated_successfully'})}!
        </div>
    </div>
    <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="profileErrMsg">
        <div className="toast-header">
            <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
            <button aria-label="Close" className="btn-close" 
                    data-bs-dismiss="toast" type="button">
            </button>
        </div>
        <div className="toast-body">
            {intl.formatMessage({id: 'something_went_wrong'})}!
        </div>
    </div>
    <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="profileimgSizeErr">
        <div className="toast-header">
            <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
            <button aria-label="Close" className="btn-close" 
                    data-bs-dismiss="toast" type="button">
            </button>
        </div>
        <div className="toast-body">
            {intl.formatMessage({id: 'file_size_must_be_below_2mb'})}!
        </div>
    </div>
    <div aria-atomic="true" aria-live="assertive" className="toast bg_primary toast_position text-white position-fixed end-0 bottom-0 m-3" id="profileimgFileErr">
        <div className="toast-header">
            <strong className="me-auto">{intl.formatMessage({id: 'warning'})}</strong>
            <button aria-label="Close" className="btn-close" 
                    data-bs-dismiss="toast" type="button">
            </button>
        </div>
        <div className="toast-body">
            {intl.formatMessage({id: 'wrong_file_format'})}!
        </div>
    </div>
    </>
  )
}
