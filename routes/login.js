const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const db = require('../db');

const JWT_SECRET = '2020'; 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
  }

  try {
    const usuario = await db.query('SELECT * FROM petsync.usuarios WHERE email = $1', [email]);

    if (!usuario.rows.length) {
      return res.status(404).json({ success: false, message: 'E-mail ou senha inválidos.' });
    }

    const user = usuario.rows[0];
    const match = await bcrypt.compare(password, user.senha);

    if (!match) {
      return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
    }

    // Gerar um token de autenticação (JWT)
    const token = jwt.sign({ userId: user.id_usuario, accessType: Number(user.id_acesso) }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      success: true,
      message: 'Login bem-sucedido',
      token: token,
      accessType: Number(user.id_acesso),  // Convertendo para número
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
});

module.exports = router;
