const express = require('express');
const router = express.Router();
const listaController = require('../../controllers/web/listaCrudController');

router.post('/gruposMaestro', listaController.gruposMaestro);
router.post('/getLista', listaController.listas);


module.exports = router;