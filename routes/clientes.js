const express = require('express');
const router = express.Router();
const { createCliente, getClientes, deleteCliente, updateCliente } = require('../controllers/clientesController');

router.post('/clientes', createCliente);
router.delete('/clientes/:id', deleteCliente);
router.get('/clientes', getClientes);
router.put('/clientes/:id_cliente', updateCliente);


module.exports = router;
