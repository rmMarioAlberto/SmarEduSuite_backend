const express = require('express')
const routes = express.Router();
const clasesController = require('../../controllers/movil/clasesController');

routes.post('/claseActualTeacher', clasesController.getClasesActivasMaestro);
routes.post('/horarioTeacher', clasesController.getHorarioMaestro);

routes.post('/claseActualStudent', clasesController.getHorarioDiaAlumno);
routes.post('/horarioStudent', clasesController.getClasesActivasDiaAlumno);


module.exports = routes;