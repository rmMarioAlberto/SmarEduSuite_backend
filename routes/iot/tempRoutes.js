const express = require('express');
const router = express.Router();
const sensorTemController = require('../../controllers/iot/sensorTem');

router.post('/temperatura', sensorTemController.registrarTemperatura);

module.exports = router;