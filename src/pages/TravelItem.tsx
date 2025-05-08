// src/components/TravelItem.tsx
import React, { useState } from 'react';
import { TravelData } from './minhas_encomendas';
import '../styles/TravelList.css';

interface TravelItemProps {
  item: TravelData;
  userIconSrc: string;
  isClient: boolean; // Indica se o usuário atual é um cliente
}

const TravelItem: React.FC<TravelItemProps> = ({ item, userIconSrc, isClient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true); // Estado para controlar se a encomenda está ativa

  const toggleOpen = () => setIsOpen(prev => !prev);

  const handleMarkAsReceived = () => {
    // Atualiza o estado para remover a encomenda da interface
    setIsActive(false);
  };

  // Não renderiza o item se ele não estiver ativo ou se o usuário não for um cliente
  if (!isActive || !isClient) {
    return null; // Não renderiza nada para viajantes
  }

  return (
    <div
      className={`travel-item ${isOpen ? 'open' : 'collapsed'}`}
      onClick={toggleOpen}
    >
      <div className="travel-item-header">
        <div className="route">
          {item.origin} → {item.destination}
        </div>
      </div>

      {!isOpen && (
        <div className="travel-item-summary">
          <div className="summary-info">
            <span className="departure-date">Data de partida: {item.departureDate}</span>
            <span className="badge weight-badge weight">{item.weight} g</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="travel-item-details">
          <div className="user-info">
            <img src={userIconSrc} alt="Usuário" className="user-icon" />
            <span className="user-name">{item.client}</span>
          </div>

          <div className="dates">
            <div>Data de partida: {item.departureDate}</div>
            <div>Data de chegada: {item.arrivalDate}</div>
          </div>

          <div className="details">
            <span className={`badge size-badge size-${item.space.toLowerCase()}`}>{item.space}</span>
            <span className="badge weight-badge weight">{item.weight} g</span>
            {item.disponibilidade && (
              <span className="badge disponibilidade-badge">{item.disponibilidade}</span>
            )}
          </div>

          {/* Exibe o botão apenas para clientes */}
          {isClient && (
            <button className="select-button" onClick={handleMarkAsReceived}>
               Recebida
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelItem;
