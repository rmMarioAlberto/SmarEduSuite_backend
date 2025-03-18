const QRCode = require('qrcode');

const moment = require('moment-timezone');

// Función para generar un código QR en base64
const generateQRCode = async (classId, startTime, validDuration) => {
    try {
        const qrData = {
            classId,
            startTime,
            validDuration,
        };

        // Convertir el objeto a una cadena JSON
        const qrString = JSON.stringify(qrData);

        // Generar el código QR en formato base64
        const qrCodeBase64 = await QRCode.toDataURL(qrString);
        return qrCodeBase64;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
};

// Función para validar el contenido del QR
const validateQRCode = (qrString) => {
    try {
        // Parsear la cadena JSON
        const qrData = JSON.parse(qrString);

        // Validar los campos necesarios
        if (!qrData.classId || !qrData.startTime || !qrData.validDuration) {
            throw new Error('Invalid QR data');
        }

        // Validar la duración
        const currentTime = moment.utc(); // Obtener la hora actual en UTC
        const startTime = moment.utc(qrData.startTime); // Asegurarse de que startTime esté en UTC
        const validUntil = startTime.clone().add(qrData.validDuration, 'minutes');

        if (currentTime.isAfter(validUntil)) {
            throw new Error('QR code has expired');
        }

        return true;
    } catch (err) {
        console.error('Error validating QR code:', err);
        return false;
    }
};



module.exports = { generateQRCode, validateQRCode };