import Sidebar from './api/react_components/sidebar_medico';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartComponent from './api/react_components/charts/chart_component';

Chart.register(...registerables);

interface User {
  _id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface Paciente {
  _id: string;
  user: User;
  medicoId: string;
}

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

const DashboardMedico = () => {
  const { user } = useUser();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<string>('');
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [rawData, setRawData] = useState<DatosCrudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        if (!user) {
          console.error('Usuario no autenticado');
          return;
        }

        const response = await fetch('/api/mongodb/leer_asignados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ medicoClerkUserId: user.id }),
        });
        const data = await response.json();
        setPacientes(data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error al obtener la lista de pacientes asignados', error);
      }
    };
    fetchPacientes();
  }, [user]);

  useEffect(() => {
    if (selectedPaciente) {
      const fetchJuegos = async () => {
        try {
          const response = await fetch('/api/mongodb/leer_juegos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId: selectedPaciente }),
          });
          const data = await response.json();
          setJuegos(data);
        } catch (error) {
          console.log('Error al obtener la lista de juegos completados', error);
        }
      };
      fetchJuegos();
    }
  }, [selectedPaciente]);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 bg-gray-100">
        <h1 className="text-black text-3xl font-bold mb-14 text-center">
          Dashboard Médico
        </h1>
        {isLoading ? (
          <div className="text-black text-xl font-bold">Cargando lista...</div>
        ) : (
          <div className="bg-gray-100 flex flex-col space-y-6">
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-black font-bold mb-2 mr-2">
                Seleccionar paciente:
              </label>
              <select
                value={selectedPaciente}
                onChange={(e) => setSelectedPaciente(e.target.value)}
                className="px-2 py-1.5 text-center text-black font-semibold items-center justify-items-center border rounded-lg"
              >
                <option value="" disabled>
                  Selecciona un paciente
                </option>
                {pacientes.map((paciente) => (
                  <option key={paciente.user.email} value={paciente.user.email}>
                    {paciente.user.firstName} {paciente.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {selectedPaciente && juegos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Estadísticas ejercicio hombro - Golf Game
                  </h2>
                  <ChartComponent
                    juegos={juegos}
                    juegoName="Hombro - Golf Game"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Estadísticas tobillo - Jump Game
                  </h2>
                  <ChartComponent
                    juegos={juegos}
                    juegoName="Tobillo - Jump Game"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMedico;
