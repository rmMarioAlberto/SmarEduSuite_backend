const jwtControl = require('../../config/jwtConfig');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const puertaColeccion = 'puerta';

exports.puertaReporte = (req, res) => {
    const { idUsuario, token, idSalon, inicioDate, finDate } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id de usuario es necesario' });
    }

    if (!token) {
        return res.status(400).json({ message: "El token es necesario" });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: `El token es inválido: ${results.error}` });
        }

        if (!inicioDate) {
            return res.status(400).json({ message: 'La fecha de inicio es necesaria' });
        }

        if (!finDate) {
            return res.status(400).json({ message: 'La fecha de termino es necesaria' });
        }

        if (idSalon === undefined || idSalon === null) {
            return res.status(400).json({ message: 'El id del salón es necesario' });
        }

        try {
            // Obtener la base de datos correctamente
            const db = client.db(dbName);

            // Convertir fechas a objetos Date
            const startDate = new Date(inicioDate);
            const endDate = new Date(finDate);

            // Convertir idSalon a número
            const salon = Number(idSalon);

            // Verificar que las fechas sean válidas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas' });
            }

            // Construir el query
            const query = [
                {
                    $match: {
                        idSalon: salon,
                        fechaStart: { $gte: startDate },
                        fechaEnd: { $lte: endDate }
                    }
                }
            ];

            db.collection(puertaColeccion).aggregate(query).toArray()
                .then(resultados => {
                    if (resultados.length === 0) {
                        return res.status(400).json({
                            success: true,
                            message: 'No se encontraron registros para los criterios especificados'
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        count: resultados.length,
                        data: resultados
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        success: false,
                        message: 'Error al consultar los datos de temperatura',
                        error: error.message
                    });
                });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error en el procesamiento de la solicitud',
                error: error.message
            });
        }
    });
};