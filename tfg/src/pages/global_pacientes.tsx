import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Global = () => {
  const router = useRouter();
  const [pacientes, setPacientes] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/mongodb/leer_pacientes');
        const data = await response.json();
        console.log('Datos de pacientes:', data);
      } catch (error) {
        console.error('Error al obtener el listado de pacientes', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Listado global de pacientes
        </h1>
        <ul>
          {pacientes.map((paciente, index) => (
            <li key={index}>
              <div>
                <h2>{`${paciente.user.firstName} ${paciente.user.lastName}`}</h2>
                <p>Email: {paciente.user.email}</p>
                <img
                  src={paciente.user.image}
                  alt={`Imagen de ${paciente.user.firstName}`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lista_Global;
