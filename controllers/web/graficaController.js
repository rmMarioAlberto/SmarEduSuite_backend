const jwtControl = require('../../config/jwtConfig');
const client = require('../../config/mongo');
const dbName = 'SmartEduSuite';
const tempColeccion = 'temperatura';
const luzColeccion = 'iluminacion';

exports.tempGrafica = (req, res) => {    
    const {idUsuario, token, start, end, idSalon} = req.body;
    
    if (!idUsuario) {
        return res.status(400).json({message: 'El id de usuario es necesario'});
    }
    if (!token) {
        return res.status(400).json({message: "El token es necesario"});
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({message: `El token es inválido: ${results.error}`});
        }

        if (!start) {
            return res.status(400).json({message: 'La fecha de inicio es necesaria'});
        }

        if (!end) {
            return res.status(400).json({message: 'La fecha de termino es necesaria'});
        }

        if (idSalon === undefined || idSalon === null) {
            return res.status(400).json({message: 'El id del salon es necesario'});
        }

        try {
            // Obtener la base de datos correctamente
            const db = client.db(dbName);
            
            // Convertir fechas a objetos Date
            const startDate = new Date(start);
            const endDate = new Date(end);
            
            // Convertir idSalon a número
            const salonId = Number(idSalon);
            
            
            // Verificar que las fechas sean válidas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({message: 'Las fechas proporcionadas no son válidas'});
            }
            
            // Consulta que sabemos que funciona en el CLI de MongoDB
            const query = [
                {
                    $match: {
                        fecha: {
                            $gte: startDate,
                            $lte: endDate
                        },
                        idSalon: salonId
                    }
                },
                {
                    $sort: {
                        fecha: 1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        idSalon: 1,
                        clase: 1,
                        estado: 1,
                        temperatura: 1,
                        fecha: 1,
                        fechaFormateada: { 
                            $dateToString: { 
                                format: "%Y-%m-%d %H:%M:%S", 
                                date: "$fecha" 
                            } 
                        }
                    }
                }
            ];
            
            
            db.collection(tempColeccion).aggregate(query).toArray()
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

exports.luzGrafica = (req, res) => {
    // Implementación para la gráfica de luz
};