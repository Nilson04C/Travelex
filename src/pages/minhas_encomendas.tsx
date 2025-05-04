// src/components/TravelListPage.tsx
import React from 'react';
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
}

// Props esperadas pelo componente
interface TravelListPageProps {
  /** Array de objetos TravelData para renderizar a lista */
  data: TravelData[];
  /** URL da imagem do ícone do usuário */
  userIconSrc: string;
}

const logoSrc = 'TEX_2.png'; // URL da logo

const TravelListPage: React.FC<TravelListPageProps> = ({ data, userIconSrc }) => {
  return (
    <div className="travel-list-page">
      <header className="travel-list-header">
        <img src={logoSrc} alt="Logo da aplicação" className="travel-list-logo" />
        <img src={userIconSrc} alt="Ícone do usuário" className="travel-list-user-icon" />
      </header>
      <div className="travel-list-body">
        <main className="travel-list-content">
          {Array.isArray(data) ? (
            data.map(item => (
              <TravelItem
                key={item.id}
                item={item}
                userIconSrc={userIconSrc}
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
