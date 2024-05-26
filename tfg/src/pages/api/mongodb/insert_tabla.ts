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

            const tablaExiste = await db.collection('Juego').findOne({ name, playerId, completed: false });
            console.log('El player id es:', playerId);

            if (tablaExiste) {
                await client.close();
                return res.status(400).json({ error: 'Ya existe una tabla asociada a ese paciente' });
            }
            
            let angle: number;
            angle = parseInt(req.body.angle);
            let totalSeries: number;
            totalSeries = parseInt(req.body.totalSeries);
            let totalReps: number;
            totalReps = parseInt(req.body.totalReps);
            let gameTime = 0.0;

            await db.collection('Juego').insertOne({ angle, gameTime, name, playerId, totalReps, totalSeries, completed: false });
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