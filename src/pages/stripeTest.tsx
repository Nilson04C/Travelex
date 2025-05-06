import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles/stripeTeste.css"; // Arquivo CSS para estilização



const stripePromise = loadStripe("pk_test_51RLsYuDFYFHmIZ3TD5kTlkzTcDREqeMnG0yCiFyXE6Pb0m4ahSQt3luoVSkYsne4yjisv2SVWEt4eDppbTeHV29K00X8YgdY3w");

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      interface PaymentIntentResponse {
        clientSecret: string;
      }

      const { data } = await axios.post<PaymentIntentResponse>("http://localhost:3000/api/create-payment-intent", {
        amount: 1000, // Amount in cents (e.g., $10.00)
        currency: "usd",
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setPaymentStatus(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentStatus("✅ Payment succeeded!");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStatus("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="checkout-form">
      <h2>Complete Your Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="card-input">
          <CardElement />
        </div>
        <button type="submit" disabled={!stripe} className="pay-button">
          Pay $10.00
        </button>
      </form>
      {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
    </div>
  );
};

const PaymentPage: React.FC = () => {
  return (
    <div className="payment-page">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;