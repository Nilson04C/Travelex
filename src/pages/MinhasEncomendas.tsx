// src/pages/MinhasEncomendas.tsx
import React from 'react';
import TravelListPage, { TravelData } from '../pages/minhas_encomendas';

// Substitui por onde estiveres a obter os dados reais
const dados: TravelData[] = [
   { id: '1', origem: 'Lisboa', destino: 'Porto', nome: 'Maria', partida: '2025-07-10', chegada: '2025-07-11', tamanho: 'Médio', peso: '3kg', disponibilidade: 'Livre' },
];

const MinhasEncomendas: React.FC = () => {
  return (
    <TravelListPage
      data={dados}
      userIconSrc="icon_perfil.jpg"   // ou o caminho do teu ficheiro de ícone
    />
  );
};

export default MinhasEncomendas;
