const express = require('express');
const router = express.Router();
const carreraCrud = require('../../controllers/web/carreraCrud');

router.post('/carrera', carreraCrud.getCarrera);
router.post('/carreraById', carreraCrud.getCarreraById);
router.post('/addCarrera', carreraCrud.addCarrera);
router.put('/updateCarrera', carreraCrud.updateCarrera);
router.post('/findCarrera', carreraCrud.searchCarrera)

module.exports = router;