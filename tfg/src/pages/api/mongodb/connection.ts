import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
const MONGO_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(MONGO_URI)
    const client = new MongoClient(MONGO_URI);

    if (req.method === 'GET') {
        try {
            await client.connect();
            const db = client.db(DATABASE_NAME);
            console.log("Connection with MongoDB established!");
            res.status(200);
        } catch (e) {
            console.error('Error while connecting to MongoDB', e);
            throw e;
        }
        finally {
            await client.close();
            console.log("Connection with MongoDB closed!");
        }
    }
};
  