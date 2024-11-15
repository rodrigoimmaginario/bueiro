console.log("URI do MongoDB:", process.env.MONGO_URI);
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
const uri = "mongodb+srv://rimmaginario:iER0P9ZVMdBeA7r7@bueiros.4x2w8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


let collection;

// Conexão com o banco
async function connectDB() {
    try {
        await client.connect();
        const database = client.db("monitoramento");
        collection = database.collection("enderecos");
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
}

// Rota para buscar endereços
app.get('/enderecos', async (req, res) => {
    try {
        const enderecos = await collection.find({}).toArray();
        res.json(enderecos);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).send("Erro ao buscar dados");
    }
});

// Inicializar servidor
app.listen(port, async () => {
    await connectDB();
    console.log(`Servidor rodando em http://localhost:${port}`);
});
