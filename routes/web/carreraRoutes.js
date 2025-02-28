const express = require('express');
const router = express.Router();
const carreraCrud = require('../../controllers/web/carreraCrud');

router.post('/carrea', carreraCrud.getCarrera);
router.post('/carreaById', carreraCrud.getCarreraById);
router.post('/addCarrera', carreraCrud.addCarrera);
router.put('/updateCarrera', carreraCrud.updateCarrera);
router.post('/findCarrea', carreraCrud.searchCarrera)

module.exports = router;