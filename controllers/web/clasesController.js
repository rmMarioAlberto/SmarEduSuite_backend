const db = require('../../config/pg');
const jwtConfig = require('../../config/jwtConfig');

exports.getClases = (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id de usuario es requerido' })
    }

    if (!token) {
        return res.status(400).json({ message: 'El token es requerido' })
    }

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es valido o esta vencido' })
        }

        const query = 'SELECT * from get_clases ORDER BY idclase;'

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: `Error en el servidor ${err}` })
            }

            if (results.rowCount === 0) {
                return res.status(500).json({ message: 'No se encontraron clases registradas' })
            }

            return res.status(200).json(results.rows)
        })
    })
}

exports.getClasesByid = (req, res) => {
    const { idUsuario, token, idClase } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id de usuario es requerido' })
    }

    if (!token) {
        return res.status(400).json({ message: 'El token es requerido' })
    }

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token no es valido o esta vencido' })
        }

        if (!idClase) {
            return res.status(400).json({ message: 'El id de clase es necesario' })
        }

        const query = 'SELECT * from get_clases WHERE idclase = $1 ORDER BY idclase'

        db.query(query, [idClase], (err, results) => {
            if (err) {
                return res.status(500).json({ message: `Error en el servidor ${err}` })
            }

            if (results.rowCount === 0) {
                return res.status(500).json({ message: 'Clase no encontrada' })
            }

            return res.status(200).json(results.rows)
        })
    })
}

exports.addClases = (req, res) => {
    const { status, inicio, final, dia, idMaestro, idGrupo, idMateria, idSalon, idCreate, token } = req.body;

    if (!idCreate) {
        return res.status(400).json({ message: 'El id del usuario es necesario' })
    }

    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' })
    }

    jwtConfig.validateToken(idCreate, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: 'El token del usuario no es valido o esta vencido' })
        }

        if (!status) {
            return res.status(400).json({ message: 'El status de la clase es necesario' })
        }
        if (!inicio) {
            return res.status(400).json({ message: 'La hora de inicio de la clase es necesario' })
        }
        if (!final) {
            return res.status(400).json({ message: 'La hora de final de la clase es necesario' })
        }
        if (!dia) {
            return res.status(400).json({ message: 'El dia de la clase es necesario' })
        }
        if (!idMaestro) {
            return res.status(400).json({ message: 'El id del maestro de la clase es necesario' })
        }
        if (!idGrupo) {
            return res.status(400).json({ message: 'El id del grupo de la clase es necesario' })
        }
        if (!idMateria) {
            return res.status(400).json({ message: 'El id de la materia de la clase es necesario' })
        }
        if (!idSalon) {
            return res.status(400).json({ message: 'El id del salon de la clase es necesario' })
        }
        const query = '';


    })

}

exports.updateClases = (req, res) => {

}

exports.searchClases = (req, res) => {
    const {idUsuario, token, busqueda} =req.body;

    if(!idUsuario){
        return res.status(400).json({message : 'El id del usuario es necesario'})
    }
    if(!token){
        return res.status(400).json({message : 'El token del usuario es necesario'})
    }

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({message : 'EL token no coinicide o esta vencido'})
        }

        if (!busqueda) {
            return res.status(401).json({message : 'EL campo busqueda es necesario'})
        }

        const query = `SELECT * 
                        FROM get_clases 
                        WHERE nombremaestro ILIKE $1
                        OR gruponombre ILIKE $1
                        OR nombremateria ILIKE $1 
                        ORDER BY idclase;`

        const searchTerm = `%${busqueda}%`

        db.query(query, [searchTerm], (err,results) => {
            if (err) {
                return res.status(500).json({message : `Error en el servidor: ${err}`})
            }

            if (results.rowCount === 0) {
                return res.status(301).json({message : 'No se encontraron registros'})
            }

            return res.status(200).json(results.rows);
        })
    })
}

//info crud 

exports.getMateriasActivas = (req, res) => {
    const { idUsuario, token } = req.body;

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM materia where status = 1 ORDER BY id';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if(results.rowCount === 0){
                return res.status(500).json({message : "No se encontraron registros"})
            }

            return res.status(200).json(results.rows);
        });
    });
}

exports.getGruposActivos = (req, res) => {
    const { idUsuario, token } = req.body;

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'select * from grupo WHERE status = 1 ORDER BY id'

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if(result.rowCount === 0){
                return res.status(500).json({message : "No se encontraron registros"})
            }

            return res.status(200).json(result.rows);
        })
    })
}

exports.getMaestrosActivos = (req, res) => {
    const { idUsuario, token } = req.body;

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = `SELECT 
    "id",
    string_agg(nombre || ' ' || "apellidoPa" || ' ' || "apellidoMa", ', ') as nombremaestro,
    "correo",
    "tipo",
    "status" 
FROM 
    usuario 
WHERE 
    tipo = 2 AND status = 1 
GROUP BY 
    "id", "nombre", "apellidoMa", "apellidoPa", "correo", "tipo", "status"
ORDER BY 
    "id";`

        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if(result.rowCount === 0){
                return res.status(500).json({message : "No se encontraron registros"})
            }

            return res.status(200).json(result.rows);
        })
    })
}


exports.getSalonesActivos = (req,res) => {
    const { idUsuario, token } = req.body;

    jwtConfig.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = `SELECT 
    id,
    string_agg(nombre || ' (Edificio: ' || edificio || ')', ', ') as salon
from salon 
where status = 1 
GROUP BY id
ORDER BY id
`
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if(result.rowCount === 0){
                return res.status(500).json({message : "No se encontraron registros"})
            }

            return res.status(200).json(result.rows);
        })
    })
}
