import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import BuscarViaj from "./pages/buscar_viaj"; 
import ResultadoViagem from "./pages/result_viaj";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/buscar_viaj" element={<BuscarViaj/>} />
        <Route path="/result_viaj" element={<ResultadoViagem />} />
      </Routes>
    </Router>
  );
}

export default App;

