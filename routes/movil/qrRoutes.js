const express = require('express');
const routes = express.Router();
const qrController = require('../../controllers/movil/qrController');

routes.post('/paseLista', qrController.scanQR);

module.exports = routes;