import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlane, FaBox } from "react-icons/fa";

export default function HomeScreen() {
  const navigate = useNavigate(); // Hook para navegação

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative">
        <div className="absolute top-4 right-4 text-gray-600 text-2xl">
          <FaUserCircle />
        </div>
        <h1 className="text-xl font-bold">Travelex</h1>
        <p className="text-gray-500 text-sm mt-1">
          Conectando viajantes e remetentes para entregas rápidas e econômicas.
        </p>

        <div className="mt-6 space-y-4">
          <button
            className="w-full flex items-center justify-center bg-black text-white px-4 py-2 rounded-xl shadow hover:opacity-80"
            onClick={() => navigate("/registarOfertas")} >
            <FaPlane className="mr-2" /> Levar Encomenda
          </button>

          <button className="w-full flex items-center justify-center bg-gray-200 text-black px-4 py-2 rounded-xl shadow hover:bg-gray-300"  
            onClick={() => navigate("/buscar_viaj")} >
            <FaBox className="mr-2" /> Receber Encomenda
          </button>

          <button className="w-full flex items-center justify-center bg-gray-200 text-black px-4 py-2 rounded-xl shadow hover:bg-gray-300"  
            onClick={() => navigate("/minhas_encomendas")} >
            <FaBox className="mr-2" /> Minhas encomendas
          </button>
        </div>
      </div>
    </div>
  );
}
