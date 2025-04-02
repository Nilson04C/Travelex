import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const addOferta: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState<string>('');
    const [weight, setWeight] = useState<number>(0);
    const [space, setSpace] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const navigate = useNavigate();

    const setOffer = async (event: React.FormEvent) => {
        event.preventDefault();
        const offerData = {
            flight: "fligtid teste",
            weight,
            space,
            date,
        };
        
        try {
            // Envia os dados para a API usando POST
            const response = await fetch('http://localhost:3000/api/setOffer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offerData), // Envia os dados no corpo da requisição
            });

            if (!response.ok) {
                throw new Error('Erro ao criar a oferta');
            }

            const result = await response.json();
            console.log('Oferta criada com sucesso:', result);

            // Redireciona para outra página após o sucesso
            //navigate('/result_viaj');
        } catch (error) {
            console.error('Erro ao criar a oferta:', error);
        }


        console.log(`Criando oferta para o voo ${flightNumber} com peso ${weight} e espaço ${space} na data ${date}`);
        // Redireciona para o arquivo resultad_viaj
        //navigate(``);
    };

    return (
        <div>
            <form onSubmit={setOffer}>
                <div>
                    <label htmlFor="flightNumber">Número do voo</label>
                    <br></br>
                    <input
                        type="text"
                        id="flightNumber"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                    >
                    </input>
                    <br></br>

                    <label htmlFor="weigth">Peso Disponivel</label>
                    <br></br>
                    <input
                        type="number"
                        id="weigth"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                    >
                    </input>
                    <br></br>

                    
                    <label htmlFor="space">Espaço Disponivel</label>
                    <br></br>
                    <select
                        id="space"     
                        value={space}
                        onChange={(e) => setSpace(e.target.value)}
                    >
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio</option>
                        <option value="large">Grande</option>
                    </select>
                    <br></br>


                    <label htmlFor="date">Data do Voo</label>
                    <br></br>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    >
                    </input>
                    <br></br>

                </div>
                <button type="submit">Publicar Oferta</button>
            </form>
        </div>
    );
};

export default addOferta;
