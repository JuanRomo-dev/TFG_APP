import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Pacientes = () => {
  const { user } = useUser();
  const router = useRouter();
  const [pacientesAsignados, setPacientesAsignados] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {

        const medicoId = router.query.medicoId;
        console.log('MedicoId:', medicoId);
        const response = await fetch(`/api/mongodb/leer_asignados?medicoId=${medicoId}`);
        const data = await response.json();
        console.log('Datos de pacientes asignados:', data);
        setPacientesAsignados(data);
      } catch (error) {
        console.error('Error al obtener el listado de pacientes asignados', error);
      }
    };
    fetchPacientes();
  }, [router.query.medicoId]);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Listado de mis pacientes
        </h1>
        <ul>
          {pacientesAsignados.map((paciente, index) => (
            <li key={index}>
              <p>{`${paciente.user.firstName} ${paciente.user.lastName}`}</p>
              <p>Email: {paciente.user.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lista_Pacientes;
