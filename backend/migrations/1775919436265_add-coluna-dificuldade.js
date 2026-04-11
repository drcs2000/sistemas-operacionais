exports.up = (pgm) => {
  // Adiciona a coluna como Inteiro e com valor padrão 3
  pgm.sql(`
    ALTER TABLE perguntas 
    ADD COLUMN dificuldade INTEGER DEFAULT 3;
  `);
};

exports.down = (pgm) => {
  // O "down" simplesmente remove a coluna se você precisar reverter
  pgm.sql(`
    ALTER TABLE perguntas 
    DROP COLUMN dificuldade;
  `);
};