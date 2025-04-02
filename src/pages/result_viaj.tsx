import React, { useEffect, useState } from "react";
import "../styles/resultado_viaj.css"; // Certifique-se de incluir um estilo para formatar os resultados.
import { useSearchParams } from "react-router-dom";


interface Offer {
  id: string;
  flight: string;
  user: string;
  user_name: string;
  weight: number;
  space: string;
  a_date: string;
}

const ResultadoViaj: React.FC = () => {

  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  const [offers, setOffers] = useState<Offer[]>([]); // Estado para armazenar as ofertas
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {

    if (!origin || !destination) return;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/offerbyroute?origin=${origin}&destination=${destination}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar viajantes");
        }

        const data = await response.json();
        setOffers(data); // Atualiza o estado com as ofertas retornadas pela API

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [origin, destination]);


  if(loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="resultado-viaj-container">
      <h1>Ofertas Encontradas</h1>
      <ul className="traveler-list">
        {offers.map((offer) => (
          <li key={offer.id} className="traveler-item">
            <p><strong>chegada:</strong> {offer.a_date}</p>
            <p><strong>Entregador</strong> {offer.user_name}</p>
            <p><strong>Peso Máximo:</strong> {offer.weight} kg</p>
            <p><strong>Espaço máximo:</strong> {offer.space}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultadoViaj;
