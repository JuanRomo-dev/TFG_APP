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
    <div className="text-black">
      <h1>Por favor, selecciona tu tipo de usuario.</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="medico"
            checked={userType === 'medico'}
            onChange={handleUserTypeChange}
          />
          Médico
        </label>
        <label>
          <input
            className="ml-4 mr-4 border-black border-2 rounded-md"
            type="radio"
            value="paciente"
            checked={userType === 'paciente'}
            onChange={handleUserTypeChange}
          />
          Paciente
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
          ></input>
        </label>
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
};

export default IndexPage;
