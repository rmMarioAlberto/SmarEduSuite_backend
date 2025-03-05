const express = require('express');
const router = express.Router();
const materiaCrud = require('../../controllers/web/materiaCrud');

router.post('/materias', materiaCrud.getMaterias);
router.post('/materiaById', materiaCrud.getMateriaById);
router.post('/addMateria', materiaCrud.addMateria);
router.put('/updateMateria', materiaCrud.updateMateria);
router.post('/searchMateria', materiaCrud.searchMateria);

module.exports = router;
