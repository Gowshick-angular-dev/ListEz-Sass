import React, { useEffect, useState } from "react";
import StripePayment from "./check";
import { getBusinessSettings } from '../siteSettings/core/_requests';
import moment from 'moment';
import {saveCustomerSubscriptions} from './request';
import {useAuth} from '../../../../app/modules/auth';

const MyPaymentForm = (props) => {
  const {currentUser, logout, setCurrentUser} = useAuth();
  const userId = currentUser?.org_id;
  const subsc = currentUser?.subscription;
  const [razorKey, setRazorKey] = useState({})

  const handlePayment = async (token) => {

    const body = {
      "subscription_id": props.paymentData.id,
      "paid_amount": props.paymentData.amount,
      "start_date": moment(),
      "no_of_days": props.paymentData.no_of_days,
      "mode_of_payment": 0,
      "transaction_id": token.id,
      "transaction_status": 1,
      "transaction_time": moment().format("YYYY-MM-DD HH:mm:ss"),
      "org_id": userId
  }

  const saveData = await saveCustomerSubscriptions(body);
  if(saveData.status == 200) {
    // setCurrentUser({...currentUser, subscription: body});
    window.location.href = '/dashboard';
  }
  };

  console.log("eirhiwurwiurew", razorKey.stripe_key);

  const keyDetails = async () => {
    const response = await getBusinessSettings();
    setRazorKey(response.output)
  }

  useEffect(() => {
    keyDetails();
  }, []);

  return (
    <div>      
      {razorKey.stripe_key && razorKey.payment_gateway == 0 &&
      <StripePayment
        amount={props.paymentData.amount * 100}
        currency="INR"
        name="ListEz"
        description="A payment for my service"
        stripeKey={razorKey.stripe_key}
        onToken={handlePayment}
      />}
    </div>
  );
};

export default MyPaymentForm;