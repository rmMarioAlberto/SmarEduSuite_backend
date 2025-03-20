const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const collectionName = 'listas';
const qr = require('../../config/qrServices');
const jwtControl = require('../../config/jwtConfig'); // Asegúrate de tener esto configurado
const moment = require('moment-timezone');

exports.scanQR = async (req, res) => {
    const { classId, startTime, validDuration, idUsuario, token, qrIdentifier } = req.body;

    // Validar los parámetros requeridos
    if (!idUsuario) {
        return res.status(400).json({ message: 'El idUsuario es requerido' });
    }

    if (!token) {
        return res.status(400).json({ message: 'El token es requerido' });
    }

    if (!qrIdentifier) {
        return res.status(400).json({ message: 'El identificador del QR es requerido' });
    }

    // Obtener la hora actual en UTC
    const nowUTC = moment.utc();

    // Validar el token
    jwtControl.validateTokenMovil(idUsuario, token, async (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es válido' });
        }

        // Validar el código QR
        const asistencia = qr.validateQRCode(startTime, validDuration);

        // Verificar si la validación fue exitosa
        if (asistencia === -1) {
            return res.status(400).json({ message: 'Error en la validación del QR.' });
        }

        // Crear el objeto de pase de lista
        const paseLista = {
            claseId: classId,
            idUsuario: idUsuario,
            startTime: startTime,
            asistencia: asistencia,
            fecha: nowUTC.toDate(),
            qrIdentifier: qrIdentifier 
        };

        try {
            // Conectar a la base de datos
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            // Verificar si ya existe un registro para esta clase y usuario
            const existingRecord = await collection.findOne({
                qrIdentifier: qrIdentifier // Verificar por el identificador único
            });

            if (existingRecord) {
                return res.status(409).json({ message: 'Ya se ha registrado la asistencia para esta clase.' });
            }

            // Insertar el nuevo registro
            const result = await collection.insertOne(paseLista);

            // Enviar respuesta exitosa con tipo de asistencia
            const tipoAsistencia = asistencia === 1 ? 'Asistencia' : 'Asistencia con falta';
            return res.status(201).json({ message: `Pase de lista registrado exitosamente. Tipo de asistencia: ${tipoAsistencia}`, result });
        } catch (error) {
            console.error('Error al registrar el pase de lista:', error);
            return res.status(500).json({ message: 'Error al registrar el pase de lista', error });
        }
    });
};