import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        
        try {
            const { name, playerId } = req.body;
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);

            const tablaExiste = await db.collection('Juego').findOne({name, playerId, completado: false});

            if (tablaExiste) {
                await client.close();
                return res.status(400).json({ error: 'Ya existe una tabla asociada a ese paciente' });
            }

            const { angle, totalSeries, totalReps } = req.body;

            await db.collection('Juego').insertOne({ name, playerId, angle, totalSeries, totalReps, completado: false });
            await client.close();

            res.status(200).json({ message: 'Tabla del ejercicio insertada correctamente' });
        } catch (error) {
            console.error('Error al insertar la tabla del ejercicio', error);
            res.status(500).json({ error: 'Error al la tabla del ejercicio' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}