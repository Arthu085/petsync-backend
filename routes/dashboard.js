const express = require('express');
const { getClienteNumber, getAnimalNumber, getUsuarioNumber } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/cliente-number', getClienteNumber);
router.get('/animal-number', getAnimalNumber);
router.get('/usuario-number', getUsuarioNumber);

module.exports = router;