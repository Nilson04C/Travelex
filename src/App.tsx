import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScree from "./HomeScreen";
import BuscarViaj from "./buscar_viaj"; 
import ResultadoViagem from "./result_viaj";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScree />} />
        <Route path="/buscar_viaj" element={<BuscarViaj/>} />
        <Route path="/result_viaj" element={<ResultadoViagem />} />
      </Routes>
    </Router>
  );
}

export default App;

