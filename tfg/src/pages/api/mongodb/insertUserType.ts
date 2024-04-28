import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGO_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const client = new MongoClient(MONGO_URI);
        try {
            await client.connect();
            const db = client.db(DATABASE_NAME);
            const { userType } = req.body;

            if (userType === 'medico') {
                await db.collection('Medico').insertOne({ userType });
                res.status(200).json({ message: 'Tipo de usuario médico insertado correctamente.' });
            } else if (userType === 'paciente') {
                await db.collection('Paciente').insertOne({ userType });
                res.status(200).json({ message: 'Tipo de usuario paciente insertado correctamente.' });
            }
        } catch (error) {
            console.error('Error al insertar el tipo de usuario', error);
            res.status(500).json({ error: 'Error al insertar el tipo de usuario' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}