import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddOferta: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState<string>('');
    const [weight, setWeight] = useState<number>(0);
    const [space, setSpace] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [flightDetails, setFlightDetails] = useState<any>(null); // Armazena os dados do voo
    const [errorDetails, setErrorDetails] = useState<string | null>(null); // Armazena erros
    const navigate = useNavigate();

    const API_KEY = 'cd70dccf670d9d357718feaba8e66c4e'; // Dá para chamar a api 100 vezes por mês com esse plano gratuito.

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

    const fetchFlightDetails = async () => {
        setErrorDetails(null); // Reseta os erros antes da busca
        setFlightDetails(null); // Reseta os detalhes do voo antes da busca

        const url = `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}`;
        try {
            const response = await axios.get(url);
            const flights = (response.data as { data: any[] }).data;

            // Filtra o voo pela data fornecida
            const matchingFlight = flights.find(
                (flight) => flight.flight_date === date
            );

            if (matchingFlight) {
                setFlightDetails({
                    airline: matchingFlight.airline?.name || 'Desconhecido',
                    origin: {
                        airport: matchingFlight.departure?.airport || 'Desconhecido',
                        timezone: matchingFlight.departure?.timezone || 'Timezone desconhecido',
                    },
                    destination: {
                        airport: matchingFlight.arrival?.airport || 'Desconhecido',
                        timezone: matchingFlight.arrival?.timezone || 'Timezone desconhecido',
                    },
                });
            } else {
                setErrorDetails('Voo não encontrado na data especificada.');
            }
        } catch (error: any) {
            console.error('Erro ao buscar voo:', error);
            setErrorDetails('Erro ao buscar voo. Verifique a conexão ou os parâmetros fornecidos.');
        }
    };

    const setOffer = async (event: React.FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem('token'); // Obtém o token do localStorage
        if (!token) {
            console.error('Token não encontrado. Redirecionando para login.');
            navigate('/login'); // Redireciona para login se o token não existir
            return;
        }

        // Verifica os detalhes do voo antes de criar a oferta
        await fetchFlightDetails();
        if (!flightDetails) {
            console.error('Detalhes do voo não encontrados. Não foi possível criar a oferta.');
            return;
        }

        const offerData = {
            flightNumber,
            airline: flightDetails.airline,
            origin: flightDetails.origin,
            destination: flightDetails.destination,
            weight,
            space,
            date,
        };

        try {
            // Envia os dados para a API com o token no cabeçalho Authorization
            const response = await axios.post('http://localhost:3000/api/setOffer', offerData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                },
            });
            console.log('Oferta criada com sucesso:', response.data);

            // Redireciona para outra página após o sucesso
            navigate('/');
        } catch (error) {
            console.error('Erro ao criar a oferta:', error);
        }
    };

    return (
        <div>
            <form onSubmit={setOffer}>
                <div>
                    <label htmlFor="flightNumber">Número do voo</label>
                    <input
                        type="text"
                        id="flightNumber"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        required
                    />
                    <br />

                    <label htmlFor="weight">Peso Disponível</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        required
                    />
                    <br />

                    <label htmlFor="space">Espaço Disponível</label>
                    <select
                        id="space"
                        value={space}
                        onChange={(e) => setSpace(e.target.value)}
                        required
                    >
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio</option>
                        <option value="large">Grande</option>
                    </select>
                    <br />

                    <label htmlFor="date">Data do Voo</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <br />
                </div>
                <button type="submit">Publicar Oferta</button>
            </form>

            {flightDetails && (
                <div>
                    <h3>Detalhes do Voo</h3>
                    <p><strong>Companhia Aérea:</strong> {flightDetails.airline}</p>
                    <p><strong>Origem:</strong> {flightDetails.origin.airport}, Timezone: {flightDetails.origin.timezone}</p>
                    <p><strong>Destino:</strong> {flightDetails.destination.airport}, Timezone: {flightDetails.destination.timezone}</p>
                </div>
            )}
            {errorDetails && <p style={{ color: 'red' }}>{errorDetails}</p>}
        </div>
    );
};

export default AddOferta;
