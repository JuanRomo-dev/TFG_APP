import {MongoClient, ObjectId} from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGO_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { medicoId, pacienteId } = req.body;

        if (!medicoId || !pacienteId) {
            res.status(400).json({ error: 'Faltan parámetros.'});
            return;
        }

        try {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);

            const result = await db.collection('Paciente').updateOne({ _id: new ObjectId(pacienteId) }, { $set: { medicoId: new ObjectId(medicoId) } });

            await client.close();

            if(result.modifiedCount === 1) {
                res.status(200).json({ message: 'Paciente asignado correctamente.' });
            } else {
                res.status(404).json({ error: 'Paciente no encontrado.' });
            }
        }
        catch (error){
            console.error('Error al asignar el paciente', error);
            res.status(500).json({ error: 'Error al asignar el paciente' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}