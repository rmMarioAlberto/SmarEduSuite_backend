const express = require('express');
const router = express.Router();
const clasesController = require('../../controllers/web/clasesController');

router.post('/getClases', clasesController.getClases);
router.post('/getClasesById', clasesController.getClasesByid);
router.post('/addClase', clasesController.addClases);
router.put('/updateClase', clasesController.updateClases);
router.post('/searchClase', clasesController.searchClases);

module.exports = router;
