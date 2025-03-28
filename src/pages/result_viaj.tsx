import React, { useEffect, useState } from "react";
import "../styles/resultado_viaj.css"; // Certifique-se de incluir um estilo para formatar os resultados.
import { useSearchParams } from "react-router-dom";




interface Traveler {
  id: number;
  name: string;
  origin: string;
  destination: string;
}

const ResultadoViaj: React.FC = () => {

  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {

    if (!origin || !destination) return;

    const fetchTravelers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/offerbyroute?origin=${origin}&destination=${destination}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar viajantes");
        }

        const data = await response.json();

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    };
    fetchTravelers();
  }, [origin, destination]);

  // Supondo que você tenha os resultados buscados
  const travelers: Traveler[] = [
    { id: 1, name: "João Silva", origin: "Portugal", destination: "França" },
    { id: 2, name: "Maria Oliveira", origin: "Brasil", destination: "Alemanha" },
    { id: 3, name: "Carlos Santos", origin: "Espanha", destination: "Itália" },
  ];

  return (
    <div className="resultado-viaj-container">
      <h1>Viajantes Encontrados</h1>
      <ul className="traveler-list">
        {travelers.map((traveler) => (
          <li key={traveler.id} className="traveler-item">
            <p><strong>Nome:</strong> {traveler.name}</p>
            <p><strong>De:</strong> {traveler.origin}</p>
            <p><strong>Para:</strong> {traveler.destination}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultadoViaj;
