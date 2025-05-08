// src/components/TravelListPage.tsx
import React from 'react';
import Header from '../components/Header';
import TravelItem from './TravelItem';
import '../styles/TravelList.css';

// Definição do tipo de cada item de viagem
export interface TravelData {
  id: string;
  origin: string;
  destination: string;
  client: string;
  departureDate?: string;
  arrivalDate?: string;
  space: string;
  weight: string;
  disponibilidade?: string;
  relacao_encomenda?: string;
}

// Props esperadas pelo componente
interface TravelListPageProps {
  /** Array de objetos TravelData para renderizar a lista */
  data: TravelData[];
  /** URL da imagem do ícone do usuário (não utilizado no header, pois usaremos nosso ícone) */
  userIconSrc?: string;
}

const TravelListPage: React.FC<TravelListPageProps> = ({ data }) => {
  return (
    <div className="travel-list-page">
      <Header /> {/* Adiciona o header aqui */}
      <div className="travel-list-body">
        <main className="travel-list-content">
          {Array.isArray(data) ? (
            data
              //.filter(item => item.relacao_encomenda === 'cliente') // Filtra apenas os itens do cliente
              .map(item => (
                <TravelItem
                  key={item.id}
                  item={item}
                  isClient={item.relacao_encomenda === 'cliente'} // Verifica se o usuário é cliente
                />
              ))
          ) : (
            <p>Nenhum dado disponível.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default TravelListPage;
