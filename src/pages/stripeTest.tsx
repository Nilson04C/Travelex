
// src/components/stripeTest.tsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/stripeTeste.css";

const stripePromise = loadStripe(
  "pk_test_51RLsYuDFYFHmIZ3TD5kTlkzTcDREqeMnG0yCiFyXE6Pb0m4ahSQt3luoVSkYsne4yjisv2SVWEt4eDppbTeHV29K00X8YgdY3w"
);

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offerId');
  const amountParam = searchParams.get('amount');
  const currency = searchParams.get('currency') || 'usd';
  const amount = amountParam ? parseInt(amountParam) : 0;

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post<CreatePaymentIntentResponse>(
          "http://localhost:3000/api/create-payment-intent",
          { offerId, amount, currency }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Erro ao criar PaymentIntent", error);
      } finally {
        setLoading(false);
      }
    };

    if (offerId && amount > 0) createPaymentIntent();
    else setLoading(false);
  }, [offerId, amount, currency]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) setPaymentStatus(`❌ Payment failed: ${result.error.message}`);
      else if (result.paymentIntent?.status === "succeeded") {
        setPaymentStatus("✅ Payment succeeded!");
        navigate('/minhas_encomendas');
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStatus("❌ Payment failed. Please try again.");
    }
  };

  if (loading) return <div className="loading">Preparando pagamento...</div>;

  return (
    <div className="checkout-form">
      <h2>Pagamento para Encomenda {offerId}</h2>
      <p>Valor: {(amount / 100).toFixed(2)} {currency.toUpperCase()}</p>
      <form onSubmit={handleSubmit}>
        <div className="card-input">
          <CardElement />
        </div>
        <button type="submit" disabled={!stripe} className="pay-button">
          Pagar {(amount / 100).toFixed(2)} {currency.toUpperCase()}
        </button>
      </form>
      {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
    </div>
  );
};

const PaymentPage: React.FC = () => (
  <div className="payment-page">
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default PaymentPage;
