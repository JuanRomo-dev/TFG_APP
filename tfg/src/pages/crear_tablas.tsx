import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import router, { useRouter } from 'next/router';
import Sidebar from './api/react_components/sidebar_medico';

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

const FormularioTabla = () => {
  const { user } = useUser();
  const [angle, setAngle] = useState('');
  const [name, setName] = useState('hombros - minigolf');
  const [playerId, setPlayerId] = useState('');
  const [totalReps, setTotalReps] = useState('');
  const [totalSeries, setTotalSeries] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

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
          body: JSON.stringify({
            medicoClerkUserId: user.id,
          }),
        });
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        console.log(
          'Error al obtener el listado de pacientes asignados',
          error
        );
      }
    };
    fetchPacientes();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(
        'Datos a enviar:',
        angle,
        name,
        playerId,
        totalReps,
        totalSeries
      );
      const response = await fetch('/api/mongodb/insert_tabla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          angle,
          name,
          playerId,
          totalReps,
          totalSeries,
        }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error);
      }
      alert(data.message);
      router.push('/lista_pacientes');
    } catch (error) {
      console.error('Error al crear la tabla de ejercicios', error);
      alert(error);
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-8 bg-gray-100">
        <h1 className="text-black text-3xl font-bold mb-14 text-center">
          Tablas de ejercicios
        </h1>

        <form
          className="flex flex-col w-1/2 mx-auto space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg "
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-white font-bold mb-2 mr-2">
                Ángulo:
              </label>
              <input
                type="number"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                max="90"
                min="0"
                className=" px-2 py-1.5 text-center  text-black font-semibold border rounded-lg"
                required
              ></input>
            </div>
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-white font-bold mb-2 mr-2">
                Nombre del ejercicio:
              </label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-2 py-1.5 text-center text-black font-semibold border rounded-lg"
              >
                <option className="font-semibold" value="hombros - minigolf">
                  Hombros - Minigolf
                </option>
                <option className="font-semibold" value="tobillo - jumpgame">
                  Tobillo - Jumpgame
                </option>
              </select>
            </div>
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-white font-bold mb-2 mr-2">
                Paciente:
              </label>
              <select
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value);
                  console.log('Paciente seleccionado:', e.target.value);
                }}
                required
                className="px-2 py-1.5 text-center text-black font-semibold  border rounded-lg"
              >
                {pacientes.map((paciente) => (
                  <option
                    key={paciente.user.email}
                    value={paciente.user.email}
                    className="font-semibold"
                  >
                    {paciente.user.firstName} {paciente.user.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-white font-bold mb-2 mr-2">
                Total de series:
              </label>
              <input
                type="number"
                value={totalSeries}
                onChange={(e) => setTotalSeries(e.target.value)}
                min="1"
                max="10"
                className="px-2 py-1.5 text-center text-black font-semibold  border rounded-lg"
                required
              />
            </div>
            <div className="flex flex-row items-center justify-center">
              <label className="block text-lg text-white font-bold mb-2 mr-2">
                Total de repeticiones:
              </label>
              <input
                type="number"
                value={totalReps}
                onChange={(e) => setTotalReps(e.target.value)}
                min="1"
                max="60"
                className="px-2 py-1.5 text-center text-black font-semibold  border rounded-lg"
                required
              />
            </div>
            <button
              className="mx-72 bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-gray-200 hover:text-black transition duration-300"
              type="submit"
            >
              Crear tabla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioTabla;
