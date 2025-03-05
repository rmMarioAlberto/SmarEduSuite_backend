const express = require('express');
const router = express.Router();
const sensorHuella = require('../../controllers/iot/sensorHuella');

router.post('/startClass', sensorHuella.startClass);
router.post('/closeClass', sensorHuella.endClass);

module.exports = router;
