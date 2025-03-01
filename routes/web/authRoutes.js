const express = require('express');
const router = express.Router();
const authController = require('../../controllers/web/authController');

router.post('/login', authController.login);

router.post('/change-password', authController.changePassword);

router.post('/loginGoogle', authController.loginGoogle);

module.exports = router;