const express = require('express');
const router = express.Router();
const { getAnimais, createAnimal, deleteAnimal, updateAnimal } = require('../controllers/animaisController');

router.get('/animais', getAnimais);
router.post('/animais', createAnimal);
router.delete('/animais/:id', deleteAnimal)
router.put('/animais/:id_animal', updateAnimal);


module.exports = router;