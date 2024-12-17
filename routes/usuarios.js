const express = require('express');
const { getUsuario, deleteUsuario, editUsuario } = require('../controllers/usuariosController');
const router = express.Router();

router.get('/usuarios', getUsuario);
router.delete('/usuarios/:id', deleteUsuario);
router.put('/usuarios/:id_usuario', editUsuario);

module.exports = router;