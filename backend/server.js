require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importando as rotas separadas
const perguntasRoutes = require('./routes/perguntas');
const rankingRoutes = require('./routes/ranking');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Plugando as rotas no servidor
app.use('/api/perguntas', perguntasRoutes);
app.use('/api/ranking', rankingRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando lisinho na porta ${port}`);
});