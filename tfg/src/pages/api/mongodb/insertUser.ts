import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log('MONGO_URI:', MONGO_URI);
        const { userType, email } = req.body;
        
        try {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);
            
            const user = await db.collection('Usuarios').findOne({ email });
            if (!user) {
                await client.close();
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            if (userType === 'medico') {
                await db.collection('Medico').insertOne({ user });
                await client.close();
                res.status(200).json({ message: 'Tipo de usuario médico insertado correctamente.' });
            } else if (userType === 'paciente') {
                await db.collection('Paciente').insertOne({ user });
                await client.close();
                res.status(200).json({ message: 'Tipo de usuario paciente insertado correctamente.' });
            }
            else {
                await client.close();
                res.status(400).json({ error: 'Tipo de usuario no válido.' });
            }
        } catch (error) {
            console.error('Error al insertar el tipo de usuario', error);
            res.status(500).json({ error: 'Error al insertar el tipo de usuario' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}