import React, { useState, useRef, useEffect } from 'react';
//import '../styles/TravelList.css';
import '../styles/Header.css';
import { useNavigate } from "react-router-dom";

const logoSrc = 'TEX_2.png'; // URL da logo

// Componente do ícone de perfil
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
    <path d="M12,14c-5.33,0-8,2.67-8,4v2h16v-2C20,16.67,17.33,14,12,14z" fill="#555" />
  </svg>
);

// Componente do ícone de casa
const HomeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="#555"
    className="home-icon"
    style={{ display: 'block', margin: '0 auto' }}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const Header: React.FC = () => {
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

  const navigate = useNavigate();
  return (
    <header className="travel-list-header">
      {/* Área da esquerda: logo da aplicação */}
      <div className="header-left">
        <img src={logoSrc} alt="Logo da aplicação" className="travel-list-logo" />
      </div>

      {/* Área da direita: link para a página principal e dropdown do usuário */}
      <div className="header-right">
        <a href="/" className="home-link" style={{ textAlign: 'center' }}>
          <HomeIcon /> {/* Ícone de casa acima do texto */}
        </a>
        <div className="user-dropdown" ref={dropdownRef}>
          <ProfileIcon onClick={handleUserIconClick} />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="/minhas_encomendas" className="dropdown-item">
                Minhas Encomendas
              </a>
              <button className="dropdown-item logout-button" onClick={() => navigate("/login")}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;