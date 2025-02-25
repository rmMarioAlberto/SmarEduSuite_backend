const express = require('express');
const router = express.Router();
const carreraCrud = require('../../controllers/web/carreraCrud');

router.get('/carrera', carreraCrud.getCarrera);

module.exports = router;