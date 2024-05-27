import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

interface DatosCrudo {
    _id: ObjectId;
    angle: number;
    playerId: string;
    timeStamp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('req.method', req.method);
    if (req.method === 'POST') {
        try {
            const { rawInputIds } = req.body;
            if (!rawInputIds) {
                return res.status(400).json({ message: 'Faltan los datos crudos' });
            }

            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);
            
            const objectIds = rawInputIds.map((id: string) => new ObjectId(id));
            console.log('objectIds', objectIds);
            const rawData = await db.collection('Datos_En_Crudo').find({ _id: { $in: objectIds } }).toArray();
            await client.close();
            
            return res.status(200).json(rawData);
        } catch (error) {
            console.error('Error al obtener los datos en crudo de la sesión de juego', error);
            res.status(500).json({ message: 'Error al obtener los datos en crudo de la sesión de juego' });
        }
    } else {
        res.status(405).json({ message: 'Forbidden' });
    }
};