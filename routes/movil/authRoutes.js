const express = require('express');

const routes = express.Router();

const authController = require('../../controllers/movil/authController');
const clasesController = require('../../controllers/movil/clasesController');

routes.post('/login', authController.loginMovil);
routes.post('/change-password', authController.changePassword);
routes.post('/logout', authController.logoutMovil);

routes.post('/claseActualTeacher', clasesController.getClasesActivasMaestro);
routes.post('/horarioTeacher', clasesController.getHorarioMaestro);

routes.post('/claseActualStudent', clasesController.getHorarioDiaAlumno);
routes.post('/horarioStudent', clasesController.getClasesActivasDiaAlumno);

module.exports = routes;
