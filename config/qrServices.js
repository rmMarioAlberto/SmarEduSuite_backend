const QRCode = require('qrcode');

const moment = require('moment-timezone');

// Función para generar un código QR en base64
const generateQRCode = async (classId, startTime, validDuration, idUsuario) => {
    try {
        // Generar un identificador único para el QR
        const qrIdentifier = `${classId}-${idUsuario}-${Date.now()}`; 

        const qrData = {
            classId,
            startTime,
            validDuration,
            qrIdentifier 
        };

        const qrString = JSON.stringify(qrData);

        // Generar el código QR en formato base64
        const qrCodeBase64 = await QRCode.toDataURL(qrString);
        return  qrCodeBase64 ; 
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
};

const validateQRCode = (startTime, validDuration) => {
    try {
        if (!startTime || !validDuration) {
            throw new Error('Invalid QR data');
        }

        const startMoment = moment.utc(startTime);
        const currentTime = moment.utc(); 

        const validUntil = startMoment.clone().add(validDuration, 'minutes');

        if (currentTime.isAfter(validUntil)) {
            return 0; 
        }

        return 1; 
    } catch (err) {
        console.error('Error validating QR code:', err);
        return -1; 
    }
};

module.exports = { generateQRCode, validateQRCode };