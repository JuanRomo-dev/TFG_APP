import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SidebarPaciente = () => {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 w-80 min-h-screen flex flex-col justify-between">
      <div className="py-12 px-4">
        <h1 className="text-white text-xl font-bold">Plataforma Sanitaria</h1>
        <ul className="mt-16">
          <li className="mb-6">
            <Link href="/dashboard_paciente">
              <span
                className={
                  router.pathname === '/dashboard_paciente'
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                Mis estadísticas
              </span>
            </Link>
          </li>
          <li className="mb-6">
            <Link href="/lista_pacientes">
              <span
                className={
                  router.pathname === '/lista_pacientes'
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                Tablas de ejercicios
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SidebarPaciente;
