const { json } = require('micro');
const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req: any, res: any) => {
    try {
        await client.connect();
        const data = await json(req);
        
        const db = client.db('tfg');
        const collection = db.collection('Usuarios');
        await collection.insertOne(data);
        
        res.status(200).send('OK connection');
    } catch (error: any) {
        res.status(500).send('Error connecting to the database');
        res.end();
    } finally {
        await client.close();
    }
}