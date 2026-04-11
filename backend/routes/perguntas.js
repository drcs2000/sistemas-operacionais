const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Rota: GET /api/perguntas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM perguntas');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;