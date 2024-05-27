import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { playerId } = req.body;
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);

            playerId.toString();
            const data = db.collection('Juego').find({ playerId, completed: true});

            const juegosDatos = await data.toArray();
            console.log('juegosDatos', juegosDatos)

            await client.close();
            return res.status(200).json(juegosDatos);
        } catch (error) {
            console.error('Error al leer los datos de los juegos', error);
            res.status(500).json({ error: 'Error al leer los datos de los juegos' });
        }
    } else {
        return res.status(405).json({ error: 'Forbidden' });
    }
};