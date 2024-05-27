import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

interface Juego {
  _id: string;
  angle: number;
  gameTime: number;
  name: string;
  playerId: string;
  totalReps: number;
  totalSeries: number;
  totalScore: number;
  totalBallHit?: number;
  totalBombHit?: number;
  rawInput: string[];
  completed: boolean;
  dateTime: string;
}

interface DatosCrudo {
  _id: string;
  angle: number;
  playerId: string;
  timeStamp: number;
}

interface ChartComponentProps {
  juegos: Juego[];
  juegoName: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  juegos,
  juegoName,
}) => {
  const [filteredJuegos, setFilteredJuegos] = useState<Juego[]>([]);
  const [rawData, setRawData] = useState<DatosCrudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRawData = async (rawInputIds: string[]) => {
      try {
        const response = await fetch('/api/mongodb/leer_datos_crudos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rawInputIds }),
        });
        const data = await response.json();
        setRawData(data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error al obtener los datos crudos', error);
      }
    };

    const filtered = juegos.filter((juego) => juego.name === juegoName);
    setFilteredJuegos(filtered);

    if (filtered.length > 0) {
      const rawInputIds = filtered.flatMap((juego) => juego.rawInput);
      fetchRawData(rawInputIds);
    }
  }, [juegos, juegoName]);

  const dataForChart = {
    labels: rawData.map((d) => d.timeStamp),
    datasets: [
      {
        label: 'Ángulo',
        data: rawData.map((d) => d.angle),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return isLoading ? <div>Cargando...</div> : <Line data={dataForChart} />;
};

export default ChartComponent;
