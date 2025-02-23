const jwt = require('jsonwebtoken');
const pg = require('./pg');
const mongo = require('./mongo');

const secretKey = 'smartEduSuite';

const createToken = (idUser, correoUser) => {
    const payload = {
        id: idUser,
        correo: correoUser
    }

    const options = {
        expiresIn: '1h'
    }

    return jwt.sign(payload, secretKey, options);
}


const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, decoded }
    } catch (err) {
        return { valid: false, error: err.message };
    }
}


module.exports = {
    createToken,
    validateToken
}