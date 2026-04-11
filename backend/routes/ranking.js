const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Rota: GET /api/ranking
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ranking ORDER BY pontuacao DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota: POST /api/ranking
router.post('/', async (req, res) => {
  const { nome_jogador, pontuacao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ranking (nome_jogador, pontuacao) VALUES ($1, $2) RETURNING id',
      [nome_jogador, pontuacao]
    );
    res.json({ mensagem: "Pontuação salva com sucesso!", id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;