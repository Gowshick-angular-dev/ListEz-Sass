import React,{FC, useState,useEffect} from 'react';
import Payment from '../subscription/razorPay';
import {useIntl} from 'react-intl'
import { getPaymentDetailsByOrg, getSubscriptions } from '../subscription/request';
import { useAuth } from '../../../modules/auth';    
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import MyPaymentForm from '../subscription/stripePay';
import moment from 'moment';

const UserSubscriptionPage: FC = () => {
    const intl = useIntl()
    const {currentUser, logout} = useAuth();
    var subsc = currentUser?.subscription;
    const orgId = currentUser?.org_id;
    const [subscription, setSubscription] = useState<any[]>([]);
    const [plans, setPlans] = useState<any>({});

    const subscriptionRequest =  async () => {
        const Response = await getSubscriptions()
        setSubscription(Response.output);
    }

    const paymentDetailsByOrg = async () => {
        const response = await getPaymentDetailsByOrg(orgId)  
        // let alertDate:any = response.output[0].start_date
        let body = {
            "active_plan": response.active_plan[0],
            "upcomming_plan": response.upcoming_plan[0]
        }
        setPlans(body);
      }

      console.log("jferegrhjegriuwtrub", moment(plans?.active_plan?.start_date).add(plans?.active_plan?.no_of_days, 'days').diff(moment(), 'days'));
      

    useEffect(() => {
        subscriptionRequest();
        paymentDetailsByOrg();
    },[]);

    return(
        <div className='h_85vh overflow-auto'>
            <div className='position-relative'>
                <div
                className='d-flex flex-column bgi-no-repeat rounded-top bg_primary plan_container text-light text-center'
                style={{ backgroundImage: `url('${toAbsoluteUrl('/media/misc/patteren-123.png')}')` }}
                >
                <h2 className='text-light plan_text_head mb-0'>{intl.formatMessage({id: "your_plans"})}!</h2>
                <div className='plan_card_des mt-0'>
                    <div className='d-flex justify-content-center'>
                        {plans?.active_plan?.id ?
                        <div className='p-3'>
                            <div className='br_10 p-5'>
                                <h5 className='text-center text-light fs-5'>{intl.formatMessage({id: "current_plan"})}</h5>
                                <h5 className='text-center fs-1 plan_name'>{plans?.active_plan?.lz_subscription?.subscription_name}</h5>
                                <h2 className='text-center text-light py-2'>{plans?.active_plan?.paid_amount?.slice(0, -2)}/<small className='fs-8'>{plans?.active_plan?.no_of_days+" days"}</small></h2>
                                <p className='text-center mb-0 fs-7'>{intl.formatMessage({id: "valid_till"})} {moment(plans?.active_plan?.start_date).add(plans?.active_plan?.no_of_days, 'days').format('DD-MM-YYYY')}</p>
                            </div>
                        </div> : 
                        <div className='text-center text-light fs-1'>{intl.formatMessage({id: "no_active_plan"})}!</div>
                        }
                        {plans?.upcomming_plan?.id &&
                        <div className='d-flex align-items-center'>
                            <div className='bg_secondary br_10 p-3'>
                                <h5 className='text-center'>{intl.formatMessage({id: "upcomming_plan"})}</h5>
                                <h5 className='text-center fs-1 plan_name'>{plans?.upcomming_plan?.lz_subscription?.subscription_name}</h5>
                                <h2 className='text-center fs-5 py-2'>{plans?.upcomming_plan?.paid_amount?.slice(0, -2)}/<small className='fs-9'>{plans?.upcomming_plan?.no_of_days+" days"}</small></h2>
                                <p className='text-center fs-9 mb-0 text-dark'>{intl.formatMessage({id: "starts_on"})} {moment(plans?.upcomming_plan?.start_date).format('DD-MM-YYYY')}</p>
                            </div>
                        </div>}
                    </div>
                </div>
                </div>
                <div className="row ps-6 cards_positions_in_banner w-100">  
                    <div className='modal fade' id={'user_subscription_exist_popup'} aria-hidden='true'>
                        <div className='modal-dialog modal-dialog-centered d-flex justify-content-center'>
                            <div className='modal-content subscription_alert'>
                                <div className='modal-header border-0 pb-0'>
                                    <h3 className='w-100 text-center'>{intl.formatMessage({id: 'subscription'})}</h3>
                                    {/* <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                                    </div> */}
                                </div>
                                <div className='modal-body py-lg-5 px-lg-10 text-center'>
                                    <span className="svg-icon svg-icon-muted svg-icon-5hx"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.3" d="M20.9 12.9C20.3 12.9 19.9 12.5 19.9 11.9C19.9 11.3 20.3 10.9 20.9 10.9H21.8C21.3 6.2 17.6 2.4 12.9 2V2.9C12.9 3.5 12.5 3.9 11.9 3.9C11.3 3.9 10.9 3.5 10.9 2.9V2C6.19999 2.5 2.4 6.2 2 10.9H2.89999C3.49999 10.9 3.89999 11.3 3.89999 11.9C3.89999 12.5 3.49999 12.9 2.89999 12.9H2C2.5 17.6 6.19999 21.4 10.9 21.8V20.9C10.9 20.3 11.3 19.9 11.9 19.9C12.5 19.9 12.9 20.3 12.9 20.9V21.8C17.6 21.3 21.4 17.6 21.8 12.9H20.9Z" fill="currentColor"/>
                                        <path d="M16.9 10.9H13.6C13.4 10.6 13.2 10.4 12.9 10.2V5.90002C12.9 5.30002 12.5 4.90002 11.9 4.90002C11.3 4.90002 10.9 5.30002 10.9 5.90002V10.2C10.6 10.4 10.4 10.6 10.2 10.9H9.89999C9.29999 10.9 8.89999 11.3 8.89999 11.9C8.89999 12.5 9.29999 12.9 9.89999 12.9H10.2C10.4 13.2 10.6 13.4 10.9 13.6V13.9C10.9 14.5 11.3 14.9 11.9 14.9C12.5 14.9 12.9 14.5 12.9 13.9V13.6C13.2 13.4 13.4 13.2 13.6 12.9H16.9C17.5 12.9 17.9 12.5 17.9 11.9C17.9 11.3 17.5 10.9 16.9 10.9Z" fill="#ff6700"/>
                                        </svg>
                                    </span>
                                    <h2 className='py-3'>Hey!!!</h2>
                                    <p>{intl.formatMessage({id: "you_have_a_active_subscription_plan"})}!</p>
                                    <div className='p-3'>
                                        <div className='bg_secondary br_10 p-3'>
                                            <h5 className='text-center'>{intl.formatMessage({id: "your_plan"})}</h5>
                                            <h2 className='text-center py-2'>{plans.active_plan?.paid_amount.slice(0, -2)}/<small className='fs-8'>{plans.active_plan?.no_of_days+" days"}</small></h2>
                                            <p className='text-center mb-0'>{intl.formatMessage({id: "valid_till"})} {moment(plans.active_plan?.start_date).add(plans.active_plan?.no_of_days, 'days').format('DD-MM-YYYY')}</p>
                                        </div>
                                    </div>
                                    <p>{intl.formatMessage({id: "try_5_days_before_plan_expire"})}</p>
                                    <button type='button' className="btn btn_primary btn-sm br_30" data-bs-dismiss='modal'>{intl.formatMessage({id: "close"})}</button>
                                </div>
                            </div>
                        </div>
                    </div>                         
                    {subscription.map((data, i) => {
                    if(data.status == 1) { 
                    return(
                        <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-2 px-4 mb-4" key={i}>
                            <div className="card bs_2 position-relative card_bg_clr">
                                <div className='card-header border-0'>
                                    <div className="bg_primary px-5 py-3 plan_title w-100 text-start fs-4 fw-bolder text-white position-absolute plan_position text-nowrap d-none d-xxl-block" title={data.subscription_name}>
                                        {data.subscription_name.slice(0, 13)}{data.subscription_name?.length > 13 && '...'} 
                                    </div>
                                    <div className="bg_primary px-5 py-3 plan_title w-100 text-start fs-4 fw-bolder text-white position-absolute plan_position text-nowrap d-none d-xl-block" title={data.subscription_name}>
                                        {data.subscription_name.slice(0, 15)}{data.subscription_name?.length > 15 && '...'} 
                                    </div>
                                    <div className="bg_primary px-5 py-3 plan_title w-100 text-start fs-4 fw-bolder text-white position-absolute plan_position text-nowrap d-none d-md-block d-xl-none" title={data.subscription_name}>
                                        {data.subscription_name.slice(0, 20)}{data.subscription_name?.length > 20 && '...'} 
                                    </div>
                                    <div className="bg_primary px-5 py-3 plan_title w-100 text-start fs-4 fw-bolder text-white position-absolute plan_position text-nowrap d-none d-sm-block d-md-none" title={data.subscription_name}>
                                        {data.subscription_name.slice(0, 23)}{data.subscription_name?.length > 23 && '...'} 
                                    </div>
                                    <div className="bg_primary px-5 py-3 plan_title w-100 text-start fs-4 fw-bolder text-white position-absolute plan_position text-nowrap d-sm-none d-md-none" title={data.subscription_name}>
                                        {data.subscription_name.slice(0, 27)}{data.subscription_name?.length > 27 && '...'} 
                                    </div>
                                    <div className='plan_card_shadow position-absolute'></div>
                                </div>                                
                                <div className="card-body">                                            
                                    <div className='text-center text-nowrap fs-1'>₹{data.amount.slice(0, -2)}</div>
                                    <div className='text-center text-nowrap fs-6'>{data.no_of_days} Days</div>
                                </div>
                                <div className='card-footer border-0 text-center'>
                                    {subsc?.status == 1 && moment(plans?.active_plan?.start_date).add(plans?.active_plan?.no_of_days, 'days').diff(moment(), 'days') + 1 >= 5 ?
                                    <button type="button" data-bs-toggle='modal' data-bs-target='#user_subscription_exist_popup' className="btn btn_primary btn-sm br_30" >Buy Now</button>       
                                    : <>
                                    <Payment paymentData={data}/>                            
                                    <MyPaymentForm paymentData={data}/>
                                    </>}
                                </div>
                            </div>
                        </div>
                    )}})}
                </div>
            </div> 
        </div>   
    )
}

export {UserSubscriptionPage};