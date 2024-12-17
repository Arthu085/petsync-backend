const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); 

router.post('/login', async (req, res) => {
  const { email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
  }

  try {
    // Obter usuário do banco de dados
    const usuario = await db.query('SELECT * FROM petsync.usuarios WHERE email = $1', [email]);

    // Verificar se o usuário existe
    if (!usuario.rows.length) {
      return res.status(404).json({ success: false, message: 'Email não encontrado' });
    }

    const hash = usuario.rows[0].senha; // Obter hash armazenado

    // Verificar se o hash foi encontrado
    if (!hash) {
      return res.status(500).json({ success: false, message: 'Senha do usuário está inválida no banco de dados' });
    }

    // Comparar senha com o hash
    const match = await bcrypt.compare(password, hash); // Alterado para "password" para coincidir com o frontend

    if (!match) {
      return res.status(401).json({ success: false, message: 'Senha inválida' });
    }

    // Retornar sucesso (exemplo: token de autenticação ou apenas uma mensagem de sucesso)
    res.status(200).json({ success: true, message: 'Login bem-sucedido' });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
});

module.exports = router;
