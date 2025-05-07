// src/components/TravelListPage.tsx
import React, { useState, useRef, useEffect } from 'react';
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
  /** URL da imagem do ícone do usuário (não utilizado no header, pois usaremos nosso ícone) */
  userIconSrc?: string;
}

const logoSrc = 'TEX_2.png'; // URL da logo

// Componente do ícone de perfil, utilizando SVG
const ProfileIcon: React.FC<{ onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void }> = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
    className="travel-list-user-icon"
    style={{ cursor: 'pointer' }}
  >
    <circle cx="12" cy="8" r="4" fill="#555" />
    <path d="M12,14c-5.33,0-8,2.67-8,4v2h16v-2C20,16.67,17.33,14,12,14z" fill="#555"/>
  </svg>
);

const TravelListPage: React.FC<TravelListPageProps> = ({ data, userIconSrc }) => {
  // Estado para controlar a exibição do dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Alterna o dropdown ao clicar no ícone do usuário
  const handleUserIconClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    setDropdownOpen(prev => !prev);
  };

  // Fecha o dropdown se o clique ocorrer fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="travel-list-page">
      <header className="travel-list-header">
        {/* Área da esquerda: logo da aplicação */}
        <div className="header-left">
          <img src={logoSrc} alt="Logo da aplicação" className="travel-list-logo" />
        </div>

        {/* Área da direita: link para a página principal e dropdown do usuário */}
        <div className="header-right">
          <a href="/" className="home-link">
            HOME
          </a>
          <div className="user-dropdown" ref={dropdownRef}>
            <ProfileIcon onClick={handleUserIconClick} />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <a href="/minhas_encomendas" className="dropdown-item">
                  Minhas Encomendas
                </a>
                <a href="/logout" className="dropdown-item">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="travel-list-body">
        <main className="travel-list-content">
          {Array.isArray(data) ? (
            data.map(item => (
              <TravelItem key={item.id} item={item} userIconSrc={userIconSrc || ''} />
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
