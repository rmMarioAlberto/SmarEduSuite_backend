const express = require('express');

const routes = express.Router();

const authController = require('../../controllers/movil/authController');

routes.post('/login', authController.loginMovil);
routes.post('/change-password', authController.changePassword);
routes.post('/logout', authController.logoutMovil);

module.exports = routes;
