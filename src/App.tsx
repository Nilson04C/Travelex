import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import BuscarViaj from "./pages/buscar_viaj"; 
import ResultadoViagem from "./pages/result_viaj";
import RegistarOferta from "./pages/registarOferta";
import LoginScreen from './pages/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/buscar_viaj" element={<BuscarViaj/>} />
        <Route path="/result_viaj" element={<ResultadoViagem />} />
        <Route path="/registarOfertas" element={<RegistarOferta />} />
      </Routes>
    </Router>
  );
}

export default App;

