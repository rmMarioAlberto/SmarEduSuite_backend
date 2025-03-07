const express = require('express');
const router = express.Router();
const graficas = require('../../controllers/web/graficaController');

router.post('/tempGrafica', graficas.tempGrafica);
router.post('/luzGrafica', graficas.luzGrafica);

module.exports = router;