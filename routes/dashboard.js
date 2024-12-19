const express = require('express');
const { getClienteNumber, getAnimalNumber, getUsuarioNumber, getAgendamentoNumber, getAgendamentos, editStatusAgendamento } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/cliente-number', getClienteNumber);
router.get('/animal-number', getAnimalNumber);
router.get('/usuario-number', getUsuarioNumber);
router.get('/agendamento-number', getAgendamentoNumber);
router.get('/agendamentos', getAgendamentos);
router.put('/agendamentos/:id_agendamento', editStatusAgendamento);

module.exports = router;