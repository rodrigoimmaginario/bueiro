console.log("URI do MongoDB:", process.env.MONGO_URI);
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importar o middleware de CORS
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer'); // Importar o módulo nodemailer

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir requisições de diferentes origens
app.use(cors());

// Conectar ao MongoDB
const uri = "mongodb+srv://rimmaginario:iER0P9ZVMdBeA7r7@bueiros.4x2w8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


let collection;


// Função para enviar e-mails
async function sendEmail(ponto) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'MonitorBueiros@gmail.com',
                pass: process.env.EMAIL_PASS || 'cowl ihpn ioki xpcu' // Use senha de aplicativo
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'MonitorBueiros@gmail.com',
            to: 'MonitorBueiros@gmail.com', // Substitua pelo destinatário
            subject: `Alerta: Ponto Marcado`,
            text: `O ponto "${ponto.nome}" foi marcado como ativo. Endereço: ${ponto.endereco}`
        };

        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso para o ponto:', ponto.nome);
    } catch (error) {
        console.error('Erro ao enviar e-mail para o ponto:', ponto.nome, error);
    }
}


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

        // Enviar e-mails para pontos marcados como "mostrar: true"
        for (const ponto of enderecos) {
            if (ponto.mostrar) {
                await sendEmail(ponto);
            }
        }
        
        res.json(enderecos);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).send("Erro ao buscar dados");
    }
});

// Inicializar servidor
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
