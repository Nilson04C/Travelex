import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/registarOferta.css'; // Importando o CSS para estilização
import { FaPlane, FaMapMarkerAlt } from 'react-icons/fa'; // Importando ícones

const AddOferta: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState<string>('');
    const [weight, setWeight] = useState<number>(0);
    const [space, setSpace] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [flightDetails, setFlightDetails] = useState<any>(null); // Armazena os dados do voo
    const [errorDetails, setErrorDetails] = useState<string | null>(null); // Armazena erros
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar o carregamento
    const [buttonText, setButtonText] = useState<string>("Publicar Oferta"); // Estado para o texto do botão
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
    

const fetchFlightDetails = async () => {
    setErrorDetails(null); // Reseta os erros antes da busca
    setFlightDetails(null); // Reseta os detalhes do voo antes da busca

    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (!token) {
        console.error('Token não encontrado. Redirecionando para login.');
        navigate('/login'); // Redireciona para login se o token não existir
        return;
    }


    // Separar os caracteres (código da companhia) dos números (número do voo)
    const match = flightNumber.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) {
        setErrorDetails('Número do voo inválido. Certifique-se de que está no formato correto (ex: FR1234).');
        return;
    }
    const codigo = match[1]; // Parte com os caracteres (código da companhia)
    const numero = match[2]; // Parte com os números (número do voo)



    interface FlightData {
        departureAirportIATA: string;
        arrivalAirportIATA: string;
        departureDateUTC: string;
        arrivalDateUTC: string;
    }

    const url = `http://localhost:3000/api/getflightdata?data=${date}&numero=${numero}&codigoCompanhia=${codigo}`; // Substitua "FR" pelo código da companhia aérea, se necessário

    try {
        const response = await axios.get<FlightData>(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
            },
        });

        const flightData = response.data;
        console.log('Dados do voo:', flightData); // Imprime os dados do voo no console para depuração

        if (flightData) {
            setFlightDetails({
                origin: {
                    airport: flightData.departureAirportIATA || 'Desconhecido',
                    dateUTC: flightData.departureDateUTC || 'Desconhecido',
                },
                destination: {
                    airport: flightData.arrivalAirportIATA || 'Desconhecido',
                    dateUTC: flightData.arrivalDateUTC || 'Desconhecido',
                },
            });

            // Atualiza o texto do botão para "Confirmar Voo"
            setButtonText("Confirmar Voo");

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
        setIsLoading(true);
        await fetchFlightDetails();
        
        if (!flightDetails) {
            console.error('Detalhes do voo não encontrados. Não foi possível criar a oferta.');
            setIsLoading(false);
            return;
        }

        const offerData = {
            flightNumber,
            origin: flightDetails.origin.airport,
            destination: flightDetails.destination.airport,
            departureDate: flightDetails.origin.dateUTC,
            arrivalDate: flightDetails.destination.dateUTC,
            weight,
            space,
        };

        try {
            //imprimir "entrei"
            console.log('Dados da oferta:', offerData);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="offer-container">
                <div className="offer-content">
                    <form onSubmit={setOffer} className="offer-form">
                        <h1 className="form-title">Registar Oferta</h1>
                        <div className="form-group">
                            <label htmlFor="flightNumber">Número do Voo</label>
                            <input
                                type="text"
                                id="flightNumber"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weight">Peso Disponível (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="space">Espaço Disponível</label>
                            <select
                                id="space"
                                value={space}
                                onChange={(e) => setSpace(e.target.value)}
                                required
                                className="form-select"
                            >
                                <option value="">Selecione</option>
                                <option value="small">Pequeno</option>
                                <option value="medium">Médio</option>
                                <option value="large">Grande</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Data do Voo</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button" disabled={isLoading}>
                            {isLoading ? "Carregando..." : buttonText}
                        </button>
                    </form>

                    {/* Detalhes do voo exibidos ao lado do formulário */}
                    {flightDetails && (
                        <div className="flight-details">
                            <h3>Detalhes do Voo</h3>
                            <p><FaPlane /> <strong>Companhia Aérea:</strong> {flightDetails.airline}</p>
                            <p><FaMapMarkerAlt /> <strong>Origem:</strong> {flightDetails.origin.airport}</p>
                            <p><FaMapMarkerAlt /> <strong>Destino:</strong> {flightDetails.destination.airport}</p>
                        </div>
                    )}
                </div>

                {/* Mensagem de erro exibida abaixo */}
                {errorDetails && <p className="error-message">{errorDetails}</p>}
            </div>
        </div>
    );
};

export default AddOferta;
