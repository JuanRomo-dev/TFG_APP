import {MongoClient, ObjectId} from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { medicoId } = req.query;

        try {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);

            const pacientesAsignados = await db.collection('Paciente').find({ medicoId});
        } catch (error) {
            console.error('Error al obtener los pacientes asignados del médico', error);
            res.status(500).json({ error: 'Error al obtener los pacientes asignados del médico' });
        }
    } else {
        res.status(405).json({ error: 'Forbidden' });
    }
}