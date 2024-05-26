import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Pacientes = () => {
  const { user } = useUser();
  const router = useRouter();
  const [pacientesAsignados, setPacientesAsignados] = React.useState<string[]>(
    []
  );

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
        console.log('Datos pacientes asignados:', data);
        setPacientesAsignados(data);
      } catch (error) {
        console.log(
          'Error al obtener el listado de pacientes asignados',
          error
        );
      }
    };
    fetchPacientes();
  }, [user]);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-4xl font-bold mt-8 mb-14 text-center">
          Listado de mis pacientes
        </h1>
        <ul className="grid grid-cols-1 gap-6 items-center justify-items-center">
          {pacientesAsignados.map((paciente, index) => (
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
                    <img
                      className="rounded-full"
                      src={paciente.user.image}
                    ></img>
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
                <button
                  className={`border-2 rounded-md px-4 py-2 mt-2 bg-amber-500 text-white font-bold hover:bg-slate-50 hover:text-black`}
                >
                  Consultar estadísticas
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lista_Pacientes;
