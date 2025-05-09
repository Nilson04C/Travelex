import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import BuscarViaj from "./pages/buscar_viaj"; 
import ResultadoViagem from "./pages/result_viaj";
import RegistarOferta from "./pages/registarOferta";
import LoginScreen from './pages/login';
import Registeruser from './pages/registarUser';
import MinhasEncomendas from "./pages/MinhasEncomendas";
//import StripeTest from "./pages/stripeTest"; 
//<Route path="/stripeTest" element={<StripeTest />} />

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/buscar_viaj" element={<BuscarViaj/>} />
        <Route path="/result_viaj" element={<ResultadoViagem />} />
        <Route path="/registarOfertas" element={<RegistarOferta />} />
        <Route path="/register" element={<Registeruser />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/minhas_encomendas" element={<MinhasEncomendas />} />
      </Routes>
    </Router>
  );
}

export default App;

