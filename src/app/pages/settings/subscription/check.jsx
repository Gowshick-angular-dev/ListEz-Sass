import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';

const StripePayment = ({ amount, currency, name, description, stripeKey, onToken }) => {
  const [isPaying, setIsPaying] = useState(false);

  const handleToken = token => {
    setIsPaying(true);
    onToken(token);
  };

  return (
    <StripeCheckout
      name={name}
      description={description}
      amount={amount}
      image={toAbsoluteUrl('/media/logos/logo-1.png')}
      currency={currency}
      stripeKey={stripeKey}
      token={handleToken}
      closed={() => setIsPaying(false)}
      allowRememberMe={false}
      email=""
      alipay 
      bitcoin 
      zipCode={false}
      billingAddress={false}
      shippingAddress={false}
      disabled={isPaying}
      locale="auto"
      zipCodeCheck={false}
      opened={() => console.log("Payment modal opened")}
      // closed={() => console.log("Payment modal closed")}
      
    >
      <button className="btn btn_primary btn-sm br_30" >Buy Now</button>
  </StripeCheckout>
  );
};

export default StripePayment;