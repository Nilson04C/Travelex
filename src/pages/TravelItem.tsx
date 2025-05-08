// src/components/TravelItem.tsx
import React, { useState } from 'react';
import { TravelData } from './minhas_encomendas';
import { FaUserCircle } from 'react-icons/fa'; // Importa o ícone de usuário
import '../styles/TravelList.css';

const locationMap: { [key: string]: string } = {
  LAD: ' Luanda',
  LIS: ' Lisboa',
  POR: ' Porto',
  CT: ' Cidade do Cabo',
  PRT: ' Pretoria',
  SP: ' São Paulo',
  RJ: ' Rio de Janeiro',
  ORY: ' Paris',
  MAD: ' Madrid',
  LON: ' Londres',
  XG: ' Xangai',
};

interface TravelItemProps {
  item: TravelData;
  isClient: boolean; // Indica se o usuário atual é um cliente
}

const TravelItem: React.FC<TravelItemProps> = ({ item, isClient }) => {
  console.log(item);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true); // Se a encomenda está ativa
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento do botão

  const toggleOpen = () => setIsOpen(prev => !prev);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const handleMarkAsReceived = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsActive(false);
    } catch (error) {
      console.error('Erro ao marcar como recebida:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsActive(false);
    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Se não estiver ativo, não renderiza o cartão
  if (!isActive) {
    return null;
  }

  return (
    <div 
      className={`travel-item ${isOpen ? 'open' : 'collapsed'}`}
      onClick={toggleOpen}
    >
      <div className="travel-item-header">
        <div className="route">
          {locationMap[item.origin] || item.origin} → {locationMap[item.destination] || item.destination}
        </div>
        {/* Informação de status sempre visível no canto direito */}
        <div className="relation-description">
          {isClient 
            ? <span className="status-text pending">Por receber</span>
            : <span className="status-text pending">Por entregar</span>
          }
        </div>
      </div>

      {/* Sumário (quando a caixa está colapsada) */}
      {!isOpen && (
        <div className="travel-item-summary">
          <div className="summary-info">
            <span className="departure-date">Data de partida: {formatDate(item.departureDate)}</span>
            <span className="badge weight-badge weight">Peso:{item.weight} g</span>
          </div>
        </div>
      )}

      {/* Detalhes expandidos */}
      {isOpen && (
        <>
          <div className="travel-item-details">
            <div className="user-info">
              <FaUserCircle className="user-icone" /> {/* Substitui a imagem pelo ícone */}
              <span className="user-name">{item.name}</span>
            </div>
            <div className="dates">
              <div>Data de partida: {formatDate(item.departureDate)}</div>
              <div>Data de chegada: {formatDate(item.arrivalDate)}</div>
            </div>
            <div className="details">
              <span className={`badge size-badge size-${item.space.toLowerCase()}`}>{item.space}</span>
              <span className="badge weight-badge weight">{item.weight} g</span>
              {item.disponibilidade && (
                <span className="badge disponibilidade-badge">{item.disponibilidade}</span>
              )}
            </div>
          </div>
          {/* Botão no final do cartão (apenas exibido quando aberto) */}
          <div className="action-button">
            {isClient ? (
              <button
                className="select-button"
                onClick={handleMarkAsReceived}
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Recebida'}
              </button>
            ) : (
              <button
                className="select-button"
                onClick={handleMarkAsDelivered}
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Entregue'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TravelItem;
