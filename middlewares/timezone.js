// middlewares/timezone.js
const moment = require('moment-timezone');

// Middleware para convertir fechas a UTC antes de procesar la solicitud
function convertToUTC(req, res, next) {
    if (req.body.date) {
        req.body.date = moment.tz(req.body.date, 'America/Mexico_City').utc().format();
    }
    next();
}

// Middleware para convertir fechas a la zona horaria del cliente antes de enviar la respuesta
function convertToLocalTime(req, res, next) {
    const originalSend = res.send;
    res.send = function (body) {
        if (typeof body === 'object' && body.date) {
            body.date = moment.utc(body.date).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        }
        originalSend.call(this, body);
    };
    next();
}

module.exports = {
    convertToUTC,
    convertToLocalTime
};