import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Pacientes = () => {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Listado de mis pacientes
        </h1>
      </div>
    </div>
  );
};

export default Lista_Pacientes;
