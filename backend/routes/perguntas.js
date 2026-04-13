const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { dificuldade } = req.query;
    let result;

    if (dificuldade && dificuldade !== 'random') {
      const difNum = parseInt(dificuldade);
      
      result = await pool.query(`
        SELECT * FROM perguntas 
        ORDER BY ABS(dificuldade - $1) ASC, RANDOM()
        LIMIT 50
      `, [difNum]);
    } else {
      result = await pool.query('SELECT * FROM perguntas ORDER BY RANDOM() LIMIT 50');
    }

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

// NOVA ROTA: Atualizar perguntas em lote
router.put('/', async (req, res) => {
  const perguntasParaAtualizar = Array.isArray(req.body) ? req.body : [req.body];

  if (perguntasParaAtualizar.length === 0) {
    return res.status(400).json({ erro: 'Nenhum dado enviado para atualização.' });
  }

  try {
    const idsAtualizados = [];

    for (const pergunta of perguntasParaAtualizar) {
      const { id, enunciado, opcoes, resposta_correta, dificuldade } = pergunta;

      if (!id) {
        return res.status(400).json({ 
          erro: 'O campo "id" é obrigatório para realizar a atualização.' 
        });
      }

      if (!enunciado || !opcoes || resposta_correta === undefined) {
        return res.status(400).json({ 
          erro: `Formato inválido na pergunta ID ${id}. Faltam dados obrigatórios.` 
        });
      }

      const difNum = dificuldade ? parseInt(dificuldade) : 3;

      const result = await pool.query(
        'UPDATE perguntas SET enunciado = $1, opcoes = $2, resposta_correta = $3, dificuldade = $4 WHERE id = $5 RETURNING id',
        [enunciado, JSON.stringify(opcoes), resposta_correta, difNum, id]
      );
      
      if (result.rowCount > 0) {
        idsAtualizados.push(result.rows[0].id);
      }
    }

    res.status(200).json({
      mensagem: `${idsAtualizados.length} pergunta(s) atualizada(s) com sucesso!`,
      ids: idsAtualizados
    });

  } catch (error) {
    console.error("Erro no SQL ao atualizar:", error);
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;