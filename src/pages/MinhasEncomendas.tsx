import React, { useEffect, useState } from "react";
import axios from "axios";
import TravelListPage, { TravelData } from "../pages/minhas_encomendas";

const MinhasEncomendas: React.FC = () => {
  const [travelData, setTravelData] = useState<TravelData[]>([]); // Estado inicial como array vazio
  const userId = "YcH8obUMSZYjFuYrhNRc"; // Substitua pelo ID do usuário autenticado
  useEffect(() => {
    const fetchTravelData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/deliverybyuser", {
          params: { user: userId },
        });
        setTravelData((response.data as TravelData[]) || []); // Garante que o estado seja um array
      } catch (error) {
        console.error("Erro ao buscar dados de viagem:", error);
      }
    };

    fetchTravelData();
  }, [userId]);

  return <TravelListPage data={travelData} userIconSrc="icon_perfil.jpg" />;
};

export default MinhasEncomendas;