const QRCode = require('qrcode');

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
        const currentTime = new Date();
        const startTime = new Date(qrData.startTime);
        const validUntil = new Date(startTime.getTime() + qrData.validDuration * 60000);

        if (currentTime > validUntil) {
            throw new Error('QR code has expired');
        }

        return true;
    } catch (err) {
        console.error('Error validating QR code:', err);
        return false;
    }
};



module.exports = { generateQRCode, validateQRCode };