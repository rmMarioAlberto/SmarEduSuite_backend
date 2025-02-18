const express = require('express');
const router = express.Router();
const materiaCrud = require('../../controllers/web/materiaCrud');

router.get('/materias', materiaCrud.getMaterias);
router.get('/materiaById', materiaCrud.getMateriaById);
router.post('/addMateria', materiaCrud.addMateria);
router.put('/updateMateria', materiaCrud.updateMateria);

module.exports = router;
