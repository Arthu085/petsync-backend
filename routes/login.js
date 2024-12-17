const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Adaptar ao seu banco

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Verificar se os campos necessários estão presentes
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Obter usuário do banco de dados
    const usuario = await db.query('SELECT * FROM petsync.usuarios WHERE email = $1', [email]);
    
    // Verificar se o usuário existe
    if (!usuario.rows.length) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const hash = usuario.rows[0].senha; // Obter hash armazenado

    // Verificar se o hash foi encontrado
    if (!hash) {
      return res.status(500).json({ message: 'Senha do usuário está inválida no banco de dados' });
    }

    // Comparar senha com o hash
    const match = await bcrypt.compare(senha, hash);

    if (!match) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // Retornar sucesso (exemplo: token de autenticação)
    res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

module.exports = router;
