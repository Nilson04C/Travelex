// src/components/TravelItem.tsx
import React, { useState } from 'react';
import { TravelData } from './minhas_encomendas';
import '../styles/TravelList.css';

interface TravelItemProps {
  item: TravelData;
  userIconSrc: string;
}

const TravelItem: React.FC<TravelItemProps> = ({ item, userIconSrc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div
      className={`travel-item ${isOpen ? 'open' : 'collapsed'}`}  
      onClick={toggleOpen}
    >
      <div className="travel-item-header">
        <div className="route">
          {item.origem} → {item.destino}
        </div>
      </div>

      {/* Sumário personalizado quando colapsado: mostra data de partida e peso */}
      {!isOpen && (
        <div className="travel-item-summary">
          <div className="summary-info">
            <span className="departure-date">Data de partida: {item.partida}</span> 
            <span className={`badge weight-badge weight-${item.peso.replace(/[^0-9]/g, '')}`}>Peso: {item.peso}</span>
          </div>
        </div>
      )}

      {/* Detalhes completos quando expandido */}
      {isOpen && (
        <div className="travel-item-details">
          <div className="user-info">
            <img src={userIconSrc} alt="Usuário" className="user-icon" />
            <span className="user-name">{item.nome}</span>
          </div>

          <div className="dates">
            <div>Data de partida: {item.partida}</div>
            <div>Data de chegada: {item.chegada}</div>
          </div>

          <div className="details">
            <span className={`badge size-badge size-${item.tamanho.toLowerCase()}`}>{item.tamanho}</span>
            <span className={`badge weight-badge weight-${item.peso.replace(/[^0-9]/g, '')}`}>{item.peso}</span>
            {item.disponibilidade && (
              <span className="badge disponibilidade-badge">{item.disponibilidade}</span>
            )}
          </div>

          <button className="select-button">Selecionar</button>
        </div>
      )}
    </div>
  );
};

export default TravelItem;
