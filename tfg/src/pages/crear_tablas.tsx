import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from './api/react_components/sidebar_medico';

const Lista_Global = () => {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          Tablas de ejercicios
        </h1>
      </div>
    </div>
  );
};

export default Lista_Global;
