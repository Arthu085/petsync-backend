const express = require('express');
const { createAgendamento } = require('../controllers/agendamentosController');
const router = express.Router();

router.post('/agendamentos', createAgendamento);

module.exports = router;