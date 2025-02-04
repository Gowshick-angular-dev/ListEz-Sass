import React, { useEffect, useState } from "react";
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import axios from 'axios';
import {Route, Routes, Navigate} from 'react-router-dom'
import { getBusinessSettings } from '../siteSettings/core/_requests';
import moment from 'moment';
import {saveCustomerSubscriptions} from './request';
import {useAuth} from '../../../../app/modules/auth';

const Payment = (props) => {
  const {currentUser, logout, setCurrentUser} = useAuth();
  const userId = currentUser?.org_id;
  const subsc = currentUser?.subscription;
  const [colour, setColour] = useState('')
  const [razorKey, setRazorKey] = useState('')

  const keyDetails = async () => {
    const response = await getBusinessSettings();
    setRazorKey(response.output)
  }

  const options = {
    key: razorKey?.razor_key,
    amount: (props.paymentData.amount * 100).toString(), // 100 = INR 1
    name: "ListEz",
    description: "some description",
    image: toAbsoluteUrl('/media/logos/logo-1.png'),
    handler: async function(response) {

      console.log("fjkguyfgf", response)

      const body = {
        "subscription_id": props.paymentData.id,
        "paid_amount": props.paymentData.amount,
        "start_date": moment(),
        "no_of_days": props.paymentData.no_of_days,
        "mode_of_payment": 1,
        "transaction_id": response.razorpay_payment_id,
        "transaction_status": 1,
        "transaction_time": moment().format("YYYY-MM-DD HH:mm:ss"),
        "org_id": userId
    }

    const saveData = await saveCustomerSubscriptions(body);
      if(saveData.status == 200) {
        setCurrentUser({...currentUser, subscription: body});
        window.location.href = '/dashboard';
      }
    },
    prefill: {
      name: "Gowshick",
      contact: "7010288569",
      email: "demo@demo.com"
    },
    notes: {
      address: "some address"
    },
    theme: {
      color: colour,
      hide_topbar: false
    },
  };

  const openPayModal = options => {
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  useEffect(() => {
    keyDetails();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem('usersData')
    const djfghsfj = JSON.parse(userData);
    setColour(djfghsfj.primary_color);
}, []);

  return (
    <>
    {razorKey.payment_gateway == 1 &&
      <button type="button" className="btn btn_primary btn-sm br_30" onClick={() => openPayModal(options)}>Buy Now</button>}
    </>
  );
};
export default Payment;