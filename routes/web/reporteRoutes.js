const express = require('express');
const router = express.Router();
const reporteController  = require('../../controllers/web/reportesController')

router.post('/puertaReportes', reporteController.puertaReporte);

module.exports = router;
