import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Global = () => {
  const { user } = useUser();
  const router = useRouter();
  const [pacientes, setPacientes] = React.useState([]);
  const [pacientesAsignados, setPacientesAsignados] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/mongodb/leer_pacientes');
        const data = await response.json();
        console.log('Datos de pacientes:', data);
        setPacientes(data);
        console.log('Pacientesss:', pacientes);

        const pacientesAsignadosStorage = localStorage.getItem('pacientesAsignados');
        if (pacientesAsignadosStorage) {
          setPacientesAsignados(JSON.parse(pacientesAsignadosStorage));
        }
      } catch (error) {
        console.error('Error al obtener el listado de pacientes', error);
      }
    };
    fetchData();
  }, []);

  const asignarPaciente = async (pacienteId: string): Promise<void> => {
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      const response = await fetch('api/mongodb/asignar_paciente', {   // Cambiar ruta API a asignar un paciente al medico (asignar_paciente.tsx)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicoClerkUserId: user.id,
          pacienteId: pacienteId,
        }),
      });
      console.log('Respuesta:', response);

      if (response.ok) {
        console.log('Paciente vinculado correctamente');
        setPacientesAsignados([...pacientesAsignados, pacienteId]);
        localStorage.setItem('pacientesAsignados', JSON.stringify([...pacientesAsignados, pacienteId]));
      } else {
        console.error('Error al vincular al paciente');
      }
    } catch (error) {
      console.error('Error al vincular al paciente', error);
    }
  };


  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-4xl font-bold mt-8 mb-14 text-center">
          Listado global de pacientes
        </h1>
        <ul className="grid grid-cols-1 gap-6 items-center justify-items-center">
          {pacientes.map((paciente, index) => (
            <li
              key={index}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 w-2/3 border-gray-200 p-4 h-32 flex flex-col"
            >
              <div className="p-4 flex flex-row gap-x-14 items-start ml-14">
                <div className="w-16">
                  {paciente.user.image === '' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="250"
                      height="250"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#000000"
                        fill-rule="evenodd"
                        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-7-3a3 3 0 1 1-6 0a3 3 0 0 1 6 0m-3 11.5a8.46 8.46 0 0 0 4.807-1.489c.604-.415.862-1.205.51-1.848C16.59 15.83 15.09 15 12 15c-3.09 0-4.59.83-5.318 2.163c-.351.643-.093 1.433.511 1.848A8.46 8.46 0 0 0 12 20.5"
                        clip-rule="evenodd"
                      />
                    </svg>
                  ) : (
                    <img className="rounded-full" src={paciente.user.image} />
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                  <h2 className="text-white font-bold mb-2">
                    {`${paciente.user.firstName} ${
                      paciente.user.lastName === null
                        ? (paciente.user.lastName = '')
                        : paciente.user.lastName
                    }`}
                  </h2>
                  <p className="text-white mb-2">
                    Email: {paciente.user.email}
                  </p>
                </div>
                <button onClick={() => asignarPaciente(paciente._id)} 
                    className={`border-2 rounded-md px-4 py-2 mt-2 ${
                      pacientesAsignados.includes(paciente._id)
                        ? 'bg-green-700 text-white'
                        : 'border-white text-white hover:bg-slate-50 hover:text-black'
                    }`}
                    disabled={pacientesAsignados.includes(paciente._id)}
                >                 
                  {pacientesAsignados.includes(paciente._id) ? 'Asignado' : 'Asignar paciente'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lista_Global;
