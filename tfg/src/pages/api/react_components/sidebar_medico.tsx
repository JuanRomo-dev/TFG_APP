import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 w-80 min-h-screen flex flex-col justify-between">
      <div className="py-12 px-4">
        <h1 className="text-white text-xl font-bold">Plataforma Sanitaria</h1>
        <ul className="mt-16">
          <li className="mb-6">
            <Link href="/dashboard_medico">
              <span
                className={
                  router.pathname === '/dashboard_medico'
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                Panel de estadísticas
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
                Mis pacientes
              </span>
            </Link>
          </li>
          <li className="mb-6">
            <Link href="/global_pacientes">
              <span
                className={
                  router.pathname === '/global_pacientes'
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                Listado global de pacientes
              </span>
            </Link>
          </li>
          <li className="mb-6">
            <Link href="/crear_tablas">
              <span
                className={
                  router.pathname === '/crear_tablas'
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                Crear tablas de ejercicios
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
