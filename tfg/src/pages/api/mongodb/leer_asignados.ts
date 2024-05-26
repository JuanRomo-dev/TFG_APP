import {MongoClient, ObjectId} from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { medicoClerkUserId } = req.body;
        if (!medicoClerkUserId) {
            res.status(400).json({ error: 'Falta el id del usuario de clerk' });
        }
        
        try {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);
            
            const medico = await db.collection('Medico').findOne({ 'user.clerkUserId': medicoClerkUserId});

            if (!medico) {
                await client.close();
                res.status(404).json({ error: 'Médico no existe' });
                return;
            }
            
            const medicoId = medico._id;
            
            const pacientesAsignados = await db.collection('Paciente').find({ medicoId: new ObjectId(medicoId) }).toArray(); 
            res.status(200).json(pacientesAsignados);
            await client.close();
        } catch (error) {
            console.error('Error al obtener los pacientes asignados del médico', error);
            res.status(500).json({ error: 'Error al obtener los pacientes asignados del médico' });
        }
    } else {
        res.status(405).json({ error: 'Forbidden' });
    }
}