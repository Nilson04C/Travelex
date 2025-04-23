import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TravelSearch: React.FC = () => {
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const navigate = useNavigate();

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(`Buscando viajantes de ${origin} para ${destination}`);
        // Redireciona para o arquivo resultad_viaj
        navigate(`/result_viaj?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="origin">De</label>
                    <select
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    >
                        <option value="">Selecione o país de Origem</option>
                        <option value="LIS">Lisboa</option>
                        <option value="ORY">Paris</option>
                        <option value="Espanha">Espanha</option>
                        <option value="Madrid">Madrid</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="destination">Para</label>
                    <select
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    >
                        <option value="">Selecione o país de Destino</option>
                        <option value="ORY">Paris</option>
                        <option value="Alemanha">Alemanha</option>
                        <option value="Italia">Itália</option>
                        <option value="Espanha">Espanha</option>
                        <option value="Luanda">Luanda</option>
                    </select>
                </div>
                <button type="submit">Buscar Viajantes</button>
            </form>
        </div>
    );
};

export default TravelSearch;
