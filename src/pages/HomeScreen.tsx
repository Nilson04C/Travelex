import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlane, FaBox } from "react-icons/fa";
import Header from '../components/Header';

export default function HomeScreen() {
  const navigate = useNavigate(); // Hook para navegação

  return (
    <div>
      <Header />
      <div className="home-background">
        <div className="home-card">
          <div className="user-icon">
            <FaUserCircle />
          </div>
          <h1>Travelex</h1>
          <p>Conectando viajantes e remetentes para entregas rápidas e econômicas.</p>

          <div className="home-card-buttons">
            <button
              className="home-button home-button-primary"
              onClick={() => navigate("/registarOfertas")}
            >
              <FaPlane className="home-button-icon" /> Levar Encomenda
            </button>

            <button
              className="home-button home-button-secondary"
              onClick={() => navigate("/buscar_viaj")}
            >
              <FaBox className="home-button-icon" /> Receber Encomenda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
