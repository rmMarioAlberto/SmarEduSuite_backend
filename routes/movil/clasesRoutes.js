const express = require('express')
const routes = express.Router();
const clasesController = require('../../controllers/movil/clasesController');

routes.post('/clasesActivasMaestro', clasesController.getClasesActivasMaestro);
routes.post('/horarioMaestro', clasesController.getHorarioMaestro);

routes.post('/clasesActivasAlumno', clasesController.getClasesActivasDiaAlumno);
routes.post('/horarioAlumno', clasesController.getHorarioDiaAlumno);


module.exports = routes;