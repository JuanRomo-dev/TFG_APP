import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);

            const pacientes = await db.collection('Paciente').find().toArray();
            console.log('Pacientes:', pacientes);
            await client.close();
            res.status(200).json(pacientes);
        } catch (error) {
            console.error('Error al obtener el listado de pacientes', error);
            res.status(500).json({ error: 'Error al obtener el listado de pacientes' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}