const express = require('express');
const router = express.Router();
const alumnoCrud = require('../../controllers/web/alumnoController');

router.post('/alumnos', alumnoCrud.getAlumnos);
router.post('/alumnosById', alumnoCrud.getAlumnosById);
router.post('/addAlumno', alumnoCrud.addAlumno);
router.put('/updateAlumno', alumnoCrud.updateAlumno);
router.post('/searchAlumno', alumnoCrud.searchAlumno);

module.exports = router;
