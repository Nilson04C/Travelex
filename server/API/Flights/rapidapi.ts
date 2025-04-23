import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.RAPIDAPI_KEY;
const router = Router();

// Endpoint para buscar ofertas por rota
router.get("/getflightdata", async (req, res) => {
  const { data, numero, codigoCompanhia } = req.query;

  const options = {
    method: 'GET',
    url: 'https://flight-info-api.p.rapidapi.com/status',
    params: {
      DepartureDateTime: data,
      CarrierCode: codigoCompanhia,
      FlightNumber: numero,
      version: 'v2',
      CodeType: 'IATA'
    },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'flight-info-api.p.rapidapi.com'
    }
  };
  

    try {
      const response = await axios.request(options);
      const flightData = (response.data as { data: any[] }).data[0];

      const result = {
        departureDateUTC: flightData.departure?.date?.utc || null,
        arrivalDateUTC: flightData.arrival?.date?.utc || null,
        departureAirportIATA: flightData.departure?.airport?.iata || null,
        arrivalAirportIATA: flightData.arrival?.airport?.iata || null
      };

      res.json(result); // Envio da resposta ao cliente
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar dados do voo" });
    }

});

export default router;