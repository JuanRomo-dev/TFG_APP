import {useState} from 'react';
import {useRouter} from 'next/router';

const SelectUserType = () => {
    const router = useRouter();
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserType(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const userDataWithUserType = { ...userData, userType };

            await fetch('/api/mongodb/insertUserType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataWithUserType),
            });

            if (userType === 'medico') {
                router.push('/dashboard-medico');
            } else if (userType === 'paciente') {
                router.push('/dashboard-paciente');
            }
        } catch (error) {
            console.error('Error al procesar el tipo de usuario: ', error);
        }
    };

    return (
        <div>
            <h1>
                Por favor, selecciona tu tipo de usuario.
            </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="radio" value="medico" checked={userType === 'medico'} onChange={handleUserTypeChange} />
                    Médico
                </label>
                <label>
                    <input type="radio" value="paciente" checked={userType === 'paciente'} onChange={handleUserTypeChange} />
                    Paciente
                </label>
                <button type="submit">
                    Confirmar
                </button>
            </form>
        </div>
    );
};

export default SelectUserType;