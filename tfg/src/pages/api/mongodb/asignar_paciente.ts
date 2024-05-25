import {MongoClient, ObjectId} from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { medicoClerkUserId, pacienteId } = req.body;
        console.log('medicoClerkUserId:', medicoClerkUserId);
        console.log('pacienteId:', pacienteId);
        if (!medicoClerkUserId || !pacienteId) {
            res.status(400).json({ error: 'Faltan parámetros.'});
            return;
        }

        try {
            console.log('MONGO_URI:', MONGO_URI);
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            const db = client.db(DATABASE_NAME);



            const medico = await db.collection('Medico').findOne({ 'user.clerkUserId': medicoClerkUserId });
            console.log('Medico:', medico);
            if(!medico) {
                await client.close();
                res.status(404).json({ error: 'Médico no existe' });
                return;
            }


            await db.collection('Paciente').updateOne({ _id: new ObjectId(pacienteId) }, { $set: {  medicoId: medico._id } });

            
            res.status(200).json({ message: 'Paciente asignado correctamente.' });
            await client.close();
        }
        catch (error){
            console.error('Error al asignar el paciente', error);
            res.status(500).json({ error: 'Error al asignar el paciente' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido.' });
    }
}