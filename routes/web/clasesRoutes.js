const express = require('express');
const router = express.Router();
const clasesController = require('../../controllers/web/clasesController');

router.post('/getClases', clasesController.getClases);
router.post('/getClasesById', clasesController.getClasesByid);
router.post('/addClase', clasesController.addClases);
router.put('/updateClase', clasesController.updateClases);
router.post('/searchClase', clasesController.searchClases);


//info alta
router.post('/getMateriasActivas', clasesController.getMateriasActivas);
router.post('/getGruposActivos', clasesController.getGruposActivos);
router.post('/getMaestrosActivos', clasesController.getMaestrosActivos);
router.post('/getSalonesActivos', clasesController.getSalonesActivos);

module.exports = router;
