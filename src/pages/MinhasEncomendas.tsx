import React, { useEffect, useState } from "react";
import axios from "axios";
import TravelListPage, { TravelData } from "../pages/minhas_encomendas";
import { useNavigate } from 'react-router-dom';

const MinhasEncomendas: React.FC = () => {
  const [travelData, setTravelData] = useState<TravelData[]>([]); // Estado inicial como array vazio
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        if (!token) {
            navigate('/login'); // Redireciona para login se o token não existir
            return;
        }

        try {
            // Valida o token no servidor
            await axios.get('http://localhost:3000/api/validateToken', {
                headers: {
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                },
            });
        } catch (error) {
            console.error('Token inválido ou expirado:', error);
            localStorage.removeItem('token'); // Remove o token inválido
            navigate('/login'); // Redireciona para login
        }
    };

    validateToken();
}, [navigate]);




  useEffect(() => {
    const fetchTravelData = async () => {

        const token = localStorage.getItem("token"); // Obtém o token do localStorage
        if (!token) {
          navigate("/login"); // Redireciona para login se o token não existir
          return;
        }

        try {
          const response = await axios.get("http://localhost:3000/api/deliverybyuser", {
            headers: {
              Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
            },
          });
        setTravelData((response.data as TravelData[]) || []); // Garante que o estado seja um array
      } catch (error) {
        console.error("Erro ao buscar dados de viagem:", error);
      }
    };

    fetchTravelData();
  }, [navigate]);

  return <TravelListPage data={travelData} userIconSrc="icon_perfil.jpg" />;
};

export default MinhasEncomendas;