const express = require('express');
const router = express.Router();
const luzController = require('../../controllers/iot/sensorLuz');

router.post('/luzRegistro', luzController.registrarLuz);

module.exports = router;