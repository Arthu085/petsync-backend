const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg'); // Conectar ao banco PostgreSQL

const router = express.Router();

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

module.exports = pool;

// Rota para criar um usuário
router.post('/registrar', async (req, res) => {
  const { email, senha, id_acesso } = req.body;

  try {
    // Verificar se o email já está cadastrado
    const result = await pool.query('SELECT * FROM petsync.usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Gerando o hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o número de rounds para o bcrypt

    // Inserir o novo usuário com o hash da senha
    const insertResult = await pool.query(
      'INSERT INTO petsync.usuarios (email, senha, id_acesso) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, id_acesso]
    );

    // Enviar resposta de sucesso
    return res.status(201).json({ message: 'Usuário criado com sucesso!', usuario: insertResult.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar o usuário' });
  }
});

module.exports = router;
