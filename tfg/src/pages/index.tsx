import { useState } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('api/mongodb/insertUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, email }),
      });

      if (userType === 'medico') {
        router.push('/dashboard-medico');
      } else if (userType === 'paciente') {
        router.push('/dashboard-paciente');
      }
    } catch (error) {
      console.error('Error al procesar el formulario: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center  bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Por favor, selecciona tu tipo de usuario.
      </h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md text-center p-4 items-center">
        <form
          className="flex flex-col justify-items-center items-center space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-row gap-x-5">
            <label className="block text-lg font-medium">
              Tipo de usuario:
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="form-radio h-4 w-4"
                type="radio"
                value="medico"
                checked={userType === 'medico'}
                onChange={handleUserTypeChange}
              />
              <span>Médico</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                className="form-radio h-4 w-4"
                type="radio"
                value="paciente"
                checked={userType === 'paciente'}
                onChange={handleUserTypeChange}
              />
              <span>Paciente</span>
            </label>
          </div>
          <label className="block text-lg font-medium">
            Email:
            <input
              className="ml-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="email"
              value={email}
              onChange={handleEmailChange}
            ></input>
          </label>
          <button
            type="submit"
            className="w-1/2 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-900 transition duration-300"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;
