const client = require('../../config/mongo');
const db = require('../../config/pg');
const dbName = 'SmartEduSuite';
const collectionName = 'listas';
const qr = require('../../config/qrServices');
const jwtControl = require('../../config/jwtConfig');
const moment = require('moment-timezone');

exports.scanQR = async (req, res) => {
    const { classId, startTime, validDuration, idUsuario, token, qrIdentifier } = req.body;

    if (!classId || !startTime || !validDuration || !idUsuario || !token || !qrIdentifier) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    try {
        // Validar token
        const results = await new Promise((resolve, reject) => {
            jwtControl.validateTokenMovil(idUsuario, token, (result) => {
                result ? resolve(result) : reject(new Error('Error al validar el token'));
            });
        });

        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es válido' });
        }

        // Validar clase
        const classQuery = 'SELECT "idGrupo" FROM clase WHERE id = $1';
        const { rows: classRows } = await db.query(classQuery, [classId]);

        if (classRows.length === 0) {
            return res.status(400).json({ message: 'No se encontró la clase' });
        }

        const idGrupo = classRows[0].idGrupo;

        // Validar usuario
        const userQuery = 'SELECT * FROM usuario WHERE "idGrupo" = $1 AND id = $2';
        const { rows: userRows } = await db.query(userQuery, [idGrupo, idUsuario]);

        if (userRows.length === 0) {
            return res.status(400).json({ message: 'El usuario no pertenece al grupo' });
        }

        // Parsear startTime como CDMX y convertir a UTC
        const startTimeCDMX = moment.tz(startTime, 'America/Mexico_City');
        if (!startTimeCDMX.isValid()) {
            return res.status(400).json({ message: 'Formato de startTime inválido' });
        }
        const startTimeUTC = startTimeCDMX.utc().toDate();

        // Validar código QR (usando hora actual en CDMX)
        const nowCDMX = moment().tz('America/Mexico_City');
        const validUntil = startTimeCDMX.clone().add(validDuration, 'minutes');
        const asistencia = nowCDMX.isBetween(startTimeCDMX, validUntil, null, '[]') ? 1 : 0;

        // Crear objeto de pase de lista
        const paseLista = {
            claseId: classId,
            idUsuario: idUsuario,
            startTime: startTimeUTC,
            asistencia: asistencia,
            fecha: moment().utc().toDate(),  // Almacenar fecha actual en UTC
            qrIdentifier: qrIdentifier
        };

        // Conectar a MongoDB
        const dbMongo = client.db(dbName);
        const collection = dbMongo.collection(collectionName);

        // Verificar registro existente
        const existingRecord = await collection.findOne({ qrIdentifier: qrIdentifier });

        if (existingRecord) {
            return res.status(409).json({ message: 'Ya se ha registrado la asistencia para esta clase.' });
        }

        // Insertar registro
        const result = await collection.insertOne(paseLista);

        // Respuesta exitosa
        const tipoAsistencia = asistencia === 1 ? 'Asistencia' : 'Asistencia con falta';
        return res.status(201).json({ 
            message: `Pase de lista registrado. Tipo: ${tipoAsistencia}`,
            result,
            tipoAsistencia
        });

    } catch (err) {
        console.error('Error al procesar el escaneo del QR:', err);
        return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};