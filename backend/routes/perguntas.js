const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM perguntas');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post('/', async (req, res) => {
  const perguntasParaInserir = Array.isArray(req.body) ? req.body : [req.body];

  if (perguntasParaInserir.length === 0) {
    return res.status(400).json({ erro: 'Nenhum dado enviado.' });
  }

  try {
    const idsInseridos = [];

    for (const pergunta of perguntasParaInserir) {
      const { enunciado, opcoes, resposta_correta, dificuldade = 3 } = pergunta;

      const difNum = parseInt(dificuldade);

      if (!enunciado || !opcoes || resposta_correta === undefined) {
        return res.status(400).json({ 
          erro: 'Formato inválido. Faltam dados obrigatórios.' 
        });
      }

      const result = await pool.query(
        'INSERT INTO perguntas (enunciado, opcoes, resposta_correta, dificuldade) VALUES ($1, $2, $3, $4) RETURNING id',
        [enunciado, JSON.stringify(opcoes), resposta_correta, difNum]
      );
      
      idsInseridos.push(result.rows[0].id);
    }

    res.status(201).json({
      mensagem: `${idsInseridos.length} pergunta(s) cadastrada(s) com sucesso!`,
      ids: idsInseridos
    });

  } catch (error) {
    console.error("Erro no SQL:", error);
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;