import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/buscar_viaj.css'; // Importando o CSS para estilização

const TravelSearch: React.FC = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!origin || !destination) {
      alert('Por favor, selecione a origem e o destino.');
      return;
    }
    console.log(`Buscando viajantes de ${origin} para ${destination}`);
    navigate(`/result_viaj?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div>
      <Header />
      <div className="travel-search-container">
        <form onSubmit={handleSearch} className="travel-search-form">
          <h1 className="form-title">Buscar Viajantes</h1>
          <p className="form-description">
            Selecione a cidade de origem e destino para encontrar viajantes disponíveis.
          </p>
          <div className="form-group">
            <label htmlFor="origin">De</label>
            <select
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="form-select"
            >
              <option value="">Selecione o país de Origem</option>
              <option value="LAD">Angola - Luanda</option>
              <option value="LIS">Portugal - Lisboa</option>
              <option value="OPO">Portugal - Porto</option>
              <option value="CPT">África do Sul - Cidade do Cabo</option>
              <option value="PRW">África do Sul - Pretoria</option>
              <option value="GRU">Brasil - São Paulo</option>
              <option value="GIG">Brasil - Rio de Janeiro</option>
              <option value="ORY">França - Paris</option>
              <option value="BCN">Espanha - Madrid</option>
              <option value="GTW">Reino Unido - Londres</option>
              <option value="PVG">China - Xangai</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="destination">Para</label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="form-select"
            >
              <option value="">Selecione o país de Destino</option>
              <option value="LAD">Angola - Luanda</option>
              <option value="LIS">Portugal - Lisboa</option>
              <option value="POR">Portugal - Porto</option>
              <option value="CT">África do Sul - Cidade do Cabo</option>
              <option value="PRT">África do Sul - Pretoria</option>
              <option value="SP">Brasil - São Paulo</option>
              <option value="RJ">Brasil - Rio de Janeiro</option>
              <option value="ORY">França - Paris</option>
              <option value="MAD">Espanha - Madrid</option>
              <option value="LON">Reino Unido - Londres</option>
              <option value="XG">China - Xangai</option>
            </select>
          </div>
          <button type="submit" className="form-button">
            Buscar Viajantes
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelSearch;
