exports.up = (pgm) => {
  // Criando a tabela de Perguntas (Agora com JSONB e INTEGER)
  pgm.sql(`
    CREATE TABLE perguntas (
      id SERIAL PRIMARY KEY,
      enunciado TEXT NOT NULL,
      opcoes JSONB NOT NULL,
      resposta_correta INTEGER NOT NULL
    );
  `);

  // Criando a tabela de Ranking
  pgm.sql(`
    CREATE TABLE ranking (
      id SERIAL PRIMARY KEY,
      nome_jogador VARCHAR(100) NOT NULL,
      pontuacao INTEGER NOT NULL,
      data_tentativa TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE ranking;`);
  pgm.sql(`DROP TABLE perguntas;`);
};