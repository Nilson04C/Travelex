// src/components/ResultadoViaj.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles/resultado_viaj.css";
import Header from '../components/Header';

// Stripe setup
const stripePromise = loadStripe(
  "pk_test_51RLsYuDFYFHmIZ3TD5kTlkzTcDREqeMnG0yCiFyXE6Pb0m4ahSQt3luoVSkYsne4yjisv2SVWEt4eDppbTeHV29K00X8YgdY3w"
);

interface Offer {
  id: string;
  flight: string;
  user: string;
  user_name: string;
  weight: number;
  space: string;
  a_date: string;
}

// Inner checkout form, must be used inside <Elements>
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  clientSecret: string;
  offerId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, offerId, amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!
        }
      });
      if (result.error) {
        setStatus(`❌ ${result.error.message}`);
        onError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === "succeeded") {
        setStatus("✅ Pagamento concluído!");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Falha no pagamento");
      onError('Payment exception');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Pagamento - Encomenda {offerId}</h2>
      <p>Valor: {(amount / 100).toFixed(2)} {currency.toUpperCase()}</p>

      <label htmlFor="card-number" className="checkout-label">Número do Cartão</label>
      <div className="card-element">
        <CardNumberElement id="card-number" options={{ showIcon: true, placeholder: '1234 1234 1234 1234' }} />
      </div>

      <div className="expiry-cvc-row">
        <div className="expiry-field">
          <label htmlFor="card-expiry" className="checkout-label">Validade</label>
          <CardExpiryElement id="card-expiry" options={{ placeholder: 'MM/AA' }} />
        </div>
        <div className="cvc-field">
          <label htmlFor="card-cvc" className="checkout-label">CVC</label>
          <CardCvcElement id="card-cvc" options={{ placeholder: 'CVC' }} />
        </div>
      </div>

      <button type="submit" disabled={!stripe} className="pay-button">
        Pagar {(amount / 100).toFixed(2)} {currency.toUpperCase()}
      </button>

      {status && <p className="payment-status">{status}</p>}
    </form> 
  );
};

// Modal component
interface CheckoutModalProps {
  offerId: string;
  flightId: string;
  travelerId: string;
  amount: number;
  currency: string;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ offerId, amount, currency, flightId, travelerId, onClose }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post<{ clientSecret: string }>(
      "http://localhost:3000/api/create-payment-intent",
      {amount, currency }
    )
      .then(resp => setClientSecret(resp.data.clientSecret))
      .catch(err => console.error("Erro ao criar PaymentIntent", err))
      .then(() => setLoading(false));
  }, [offerId, amount, currency]);

  const handleSuccess = async () => {
    try {

      // Prepare the delivery data
      const deliveryData = {
        offerId,
        travelerId, // Extracted from the offer
        content: "Descrição da entrega", // Replace with the actual content
        flightId, // Extracted from the offer
        status: "pending", // Initial status of the delivery
      };

      console.log("Delivery data:", deliveryData);

      // Send the request to create the delivery
      await axios.post("http://localhost:3000/api/setdelivery", deliveryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Envia o token no cabeçalho
        },
      });

      // Redirect to the orders page
      navigate("/minhas_encomendas");
    } catch (error) {
      console.error("Erro ao criar delivery:", error);
    }
  };

  const handleError = (msg: string) => console.error("Payment error:", msg);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {loading || !clientSecret ? (
          <p className="loading">Preparando pagamento...</p>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              offerId={offerId}
              amount={amount}
              currency={currency}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

// Main component
const ResultadoViaj: React.FC = () => {
  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeOffer, setActiveOffer] = useState<{ id: string; amount: number; currency: string; flight: string; traveler: string } | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;
    fetch(`http://localhost:3000/api/offerbyroute?origin=${origin}&destination=${destination}`)
      .then(res => { if (!res.ok) throw new Error('Erro'); return res.json(); })
      .then(data => setOffers(data))
      .catch(err => console.error(err))
      .then(() => setLoading(false));
  }, [origin, destination]);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div>
      <Header />
    <div className="page-content">
    <div className="resultado-viaj-container">
      <h1>Ofertas Encontradas</h1>
      <ul className="traveler-list">
        {offers.map(o => {
          const amount = o.weight * 1000;
          const currency = 'usd';
          const flight = o.flight; // Assuming flight is a string
          const traveler = o.user; // Assuming user is the traveler ID
          return (
            <li key={o.id} className="traveler-item">
              <p><strong>Chegada:</strong> {o.a_date}</p>
              <p><strong>Entregador:</strong> {o.user_name}</p>
              <p><strong>Peso Máximo:</strong> {o.weight} kg</p>
              <p><strong>Espaço Máximo:</strong> {o.space}</p>
              <button className="select-pay-button" onClick={() => setActiveOffer({ id: o.id, amount, currency, flight, traveler })}>
                Selecionar e Pagar
              </button>
            </li>
          );
        })}
      </ul>

      {activeOffer && (
        <CheckoutModal
          offerId={activeOffer.id}
          flightId={activeOffer.flight}
          travelerId={activeOffer.traveler}
          amount={activeOffer.amount}
          currency={activeOffer.currency}
          onClose={() => setActiveOffer(null)}
        />
      )}
    </div>
    </div>
    </div>
  );
};

export default ResultadoViaj;
