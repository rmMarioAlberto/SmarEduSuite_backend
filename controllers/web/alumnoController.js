const jwtControl = require('../../config/jwtConfig');
const db = require('../../config/pg');

// Obtener todos los alumnos
exports.getAlumnos = (req, res) => {
    const { idUsuario, token } = req.body;

    if (!idUsuario) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
    }
    if (!token) {
        return res.status(400).json({ message: 'El token del usuario es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM vista_alumnos_completa ORDER BY "idGrupo", "nombreCompletoUsuario"';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron alumnos' });
            }

            return res.status(200).json(results.rows);
        });
    });
};

// Obtener alumno por ID
exports.getAlumnosById = (req, res) => {
    const { idUsuario, token, idAlumno } = req.body;

    if (!idUsuario || !token) {
        return res.status(400).json({ message: 'El id del usuario y token son necesarios' });
    }

    if (!idAlumno) {
        return res.status(400).json({ message: 'El id del alumno es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM get_alumno_by_id($1)';

        db.query(query, [idAlumno], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'Alumno no encontrado' });
            }

            return res.status(200).json(results.rows[0]);
        });
    });
};

// Buscar alumnos por nombre
exports.searchAlumno = (req, res) => {
    const { idUsuario, token, busqueda } = req.body;

    if (!idUsuario || !token) {
        return res.status(400).json({ message: 'El id del usuario y token son necesarios' });
    }

    if (!busqueda) {
        return res.status(400).json({ message: 'El término de búsqueda es necesario' });
    }

    jwtControl.validateToken(idUsuario, token, (results) => {
        if (!results.valid) {
            return res.status(401).json({ message: results.error });
        }

        const query = 'SELECT * FROM search_alumno($1)';

        db.query(query, [busqueda], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            if (results.rows.length === 0) {
                return res.status(404).json({ message: 'No se encontraron alumnos con ese nombre' });
            }

            return res.status(200).json(results.rows);
        });
    });
};

// Funciones para agregar y actualizar alumnos (a implementar)
exports.addAlumno = (req, res) => {
    const {nombre, 
        apellidoMa, 
        apellidoPa,
        correo,
        status,
        idGrupo,
        idCreate,
        tokenCreate
    } = req.body;
    
    if (!idCreate) {
        return res.status(400).json({message: 'El id del usuario es necesario(1)'})
    }
    if (!tokenCreate) {
        return res.status(400).json({message: 'EL token del usuario es necesario(1)'})
    }

    jwtControl.validateToken(idCreate,tokenCreate, (results) => {
        if (!results.valid) {
            return res.status(401).json({message : 'El token no es valido'});
        }
        if (!nombre) {
            return res.status(400).json({message: 'EL nombre del usuario es necesario(2)'})
        }
        if (!apellidoMa) {
            return res.status(400).json({message: 'EL apellido materno del usuario es necesario(2)'})
        }
        if (!apellidoPa) {
            return res.status(400).json({message: 'EL apellido parterno del usuario es necesario(2)'})
        }
        if (!correo) {
            return res.status(400).json({message: 'EL correo del usuario es necesario(2)'})
        }
        if (!status) {
            return res.status(400).json({message: 'EL status del usuario es necesario(2)'})
        }
        if (!idGrupo) {
            return res.status(400).json({message: 'EL id del grupo del usuario es necesario(2)'})
        }

        const query = `
        INSERT INTO usuario 
        (nombre,"apellidoPa","apellidoMa", correo, tipo, status,"idGrupo") 
        VALUES ($1,$2,$3,$4,1,$5,$6)`

        db.query(query, [nombre, apellidoPa, apellidoMa, correo, status, idGrupo], (err, results) => {
            if (err) {
                return res.status(500).json({message : `Error al insertar el usuario: ${err.message}`})
            }
            

            return res.status(201).json({message: 'Usuario insertado correctamente'});
        })
    })
};

exports.updateAlumno = (req, res) => {

    const {
        idUsuario,
        nombre, 
        apellidoMa, 
        apellidoPa,
        correo,
        status,
        idGrupo,
        idCreate,
        tokenCreate
    } = req.body;

    if (!idCreate) {
        return res.status(400).json({message: 'El id del usuario es necesario(1)'})
    }
    if (!tokenCreate) {
        return res.status(400).json({message: 'EL token del usuario es necesario(1)'})
    }

    jwtControl.validateToken(idCreate,tokenCreate, (results) => {
        if (!results.valid) {
            return res.status(401).json({message : 'El token no es valido'});
        }
        if (!nombre) {
            return res.status(400).json({message: 'EL nombre del usuario es necesario(2)'})
        }
        if (!idUsuario) {
            return res.status(400).json({message: 'EL id del usuario es necesario(2)'})
        }
        if (!apellidoMa) {
            return res.status(400).json({message: 'EL apellido materno del usuario es necesario(2)'})
        }
        if (!apellidoPa) {
            return res.status(400).json({message: 'EL apellido parterno del usuario es necesario(2)'})
        }
        if (!correo) {
            return res.status(400).json({message: 'EL correo del usuario es necesario(2)'})
        }
        if (!status) {
            return res.status(400).json({message: 'EL status del usuario es necesario(2)'})
        }
        if (!idGrupo) {
            return res.status(400).json({message: 'EL id del grupo del usuario es necesario(2)'})
        }

        const query = `
        UPDATE usuario 
        SET nombre = $1, 
        "apellidoMa" = $2,
        "apellidoPa" = $3, 
        "correo" = $4, 
        status = $5, 
        "idGrupo" = $6 
        WHERE id = $7`

        db.query(query, [nombre, apellidoMa, apellidoPa, correo, status , idGrupo ,idUsuario], (err, results) => {
            if (err) {
                return res.status(500).json({message : `Error al actualizar el usuario: ${err.message}`})
            }

            if(results.rowCount === 0 ){
                return res.status(500).json({message : `Usuario no encontrado`})
            }

            return res.status(200).json({message: 'Usuario actualizado correctamente'});
        })
    })
};