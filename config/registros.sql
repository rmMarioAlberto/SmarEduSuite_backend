delete from clase;
delete from salon;
delete from usuario;
delete from grupo;
delete from carrera;
delete from materia;

/*Carreras*/
INSERT INTO carrera (id, nombre, status) VALUES 
(1, 'Ingeniería en Sistemas', 1),
(2, 'Licenciatura en Administración', 1),
(3, 'Ingeniería Civil', 0),
(4, 'Licenciatura en Psicología', 1),
(5, 'Ingeniería Electrónica', 0),
(6, 'Licenciatura en Contaduría', 1),
(7, 'Ingeniería Mecánica', 1),
(8, 'Licenciatura en Derecho', 0),
(9, 'Ingeniería Química', 1),
(10, 'Licenciatura en Diseño Gráfico', 1);

/*grupos*/
INSERT INTO grupo (id, nombre, status, "idCarrera") VALUES 
(1, 'Grupo A', 1, 1),  -- Grupo A, Activo, Carrera ID 1 (Ingeniería en Sistemas)
(2, 'Grupo B', 1, 1),  -- Grupo B, Activo, Carrera ID 1 (Ingeniería en Sistemas)
(3, 'Grupo C', 0, 2),  -- Grupo C, Inactivo, Carrera ID 2 (Licenciatura en Administración)
(4, 'Grupo D', 1, 3),  -- Grupo D, Activo, Carrera ID 3 (Ingeniería Civil)
(5, 'Grupo E', 1, 4),  -- Grupo E, Activo, Carrera ID 4 (Licenciatura en Psicología)
(6, 'Grupo F', 0, 5),  -- Grupo F, Inactivo, Carrera ID 5 (Ingeniería Electrónica)
(7, 'Grupo G', 1, 6),  -- Grupo G, Activo, Carrera ID 6 (Licenciatura en Contaduría)
(8, 'Grupo H', 1, 7),  -- Grupo H, Activo, Carrera ID 7 (Ingeniería Mecánica)
(9, 'Grupo I', 0, 8),  -- Grupo I, Inactivo, Carrera ID 8 (Licenciatura en Derecho)
(10, 'Grupo J', 1, 9);  -- Grupo J, Activo, Carrera ID 9 (Ingeniería Química)
/*Materias*/
INSERT INTO materia (id, nombre, status) VALUES 
(1, 'Matemáticas I', 1),
(2, 'Física I', 1),
(3, 'Química I', 1),
(4, 'Programación I', 1),
(5, 'Estructuras de Datos', 1),
(6, 'Base de Datos', 1),
(7, 'Redes de Computadoras', 1),
(8, 'Ética Profesional', 1),
(9, 'Matemáticas II', 1),
(10, 'Física II', 1);
/*Salones*/
INSERT INTO salon (id, nombre, edificio, status) VALUES 
(1, 'Salón 101', 'Edificio A', 1),
(2, 'Salón 102', 'Edificio A', 1),
(3, 'Salón 201', 'Edificio B', 1),
(4, 'Salón 202', 'Edificio B', 0),
(5, 'Salón 301', 'Edificio C', 1),
(6, 'Salón 302', 'Edificio C', 1),
(7, 'Salón 401', 'Edificio D', 0),
(8, 'Salón 402', 'Edificio D', 1),
(9, 'Salón 501', 'Edificio E', 1),
(10, 'Salón 502', 'Edificio E', 1);

-- Insertar 5 administradores
INSERT INTO usuario (id, nombre, "apellidoMa", "apellidoPa", correo, contra, tipo, status, huella, "idGoogle", "idGrupo", token, token_movil) VALUES 
(1, 'Carlos', 'González', 'Pérez', 'carlos.gonzalez@example.com', '123', 3, 1, null, null, null, null, null),
(2, 'María', 'López', 'Martínez', 'maria.lopez@example.com', '123', 3, 1, null, null, null, null, null),
(3, 'José', 'Hernández', 'Ramírez', 'jose.hernandez@example.com', '123', 3, 1, null, null, null, null, null),
(4, 'Ana', 'Torres', 'Sánchez', 'ana.torres@example.com', '123', 3, 1, null, null, null, null, null),
(5, 'Luis', 'Martín', 'García', 'luis.martin@example.com', '123', 3, 1, null, null, null, null, null);

-- Insertar 10 alumnos
INSERT INTO usuario (id, nombre, "apellidoMa", "apellidoPa", correo, contra, tipo, status, huella, "idGoogle", "idGrupo", token, token_movil) VALUES 
(6, 'Sofía', 'Jiménez', 'Cruz', 'sofia.jimenez@example.com', '123', 1, 1, null, null, 1, null, null),  -- Grupo A
(7, 'Diego', 'Morales', 'Ríos', 'diego.morales@example.com', '123', 1, 1, null, null, 1, null, null),  -- Grupo A
(8, 'Valentina', 'Reyes', 'Vargas', 'valentina.reyes@example.com', '123', 1, 1, null, null, 2, null, null),  -- Grupo B
(9, 'Mateo', 'Castillo', 'Salazar', 'mateo.castillo@example.com', '123', 1, 1, null, null, 2, null, null),  -- Grupo B
(10, 'Camila', 'Mendoza', 'Paredes', 'camila.mendoza@example.com', '123', 1, 1, null, null, 3, null, null),  -- Grupo C
(11, 'Lucas', 'Gutiérrez', 'Núñez', 'lucas.gutierrez@example.com', '123', 1, 1, null, null, 3, null, null),  -- Grupo C
(12, 'Isabella', 'Vásquez', 'Cordero', 'isabella.vasquez@example.com', '123', 1, 1, null, null, 4, null, null),  -- Grupo D
(13, 'Sebastián', 'Rojas', 'López', 'sebastian.rojas@example.com', '123', 1, 1, null, null, 4, null, null),  -- Grupo D
(14, 'Valeria', 'Cano', 'Hernández', 'valeria.cano@example.com', '123', 1, 1, null, null, 5, null, null),  -- Grupo E
(15, 'Andrés', 'Salas', 'Mora', 'andres.salas@example.com', '123', 1, 1, null, null, 5, null, null);  -- Grupo E
-- Insertar 10 maestros
INSERT INTO usuario (id, nombre, "apellidoMa", "apellidoPa", correo, contra, tipo, status, huella, "idGoogle", "idGrupo", token, token_movil) VALUES 
(16, 'Patricia', 'Ceballos', 'Alvarez', 'patricia.ceballos@example.com', '123', 2, 1, null, null, null, null, null),
(17, 'Fernando', 'Pérez', 'González', 'fernando.perez@example.com', '123', 2, 1, null, null, null, null, null),
(18, 'Claudia', 'Soto', 'Maldonado', 'claudia.soto@example.com', '123', 2, 1, null, null, null, null, null),
(19, 'Javier', 'Cruz', 'López', 'javier.cruz@example.com', '123', 2, 1, null, null, null, null, null),
(20, 'Lucía', 'Salinas', 'Torres', 'lucia.salinas@example.com', '123', 2, 1, null, null, null, null, null),
(21, 'Ricardo', 'García', 'Hernández', 'ricardo.garcia@example.com', '123', 2, 1, null, null, null, null, null),
(22, 'Elena', 'Mora', 'Pérez', 'elena.mora@example.com', '123', 2, 1, null, null, null, null, null),
(23, 'Oscar', 'Vega', 'Ríos', 'oscar.vega@example.com', '123', 2, 1, null, null, null, null, null),
(24, 'Natalia', 'Cruz', 'Salazar', 'natalia.cruz@example.com', '123', 2, 1, null, null, null, null, null),
(25, 'Hugo', 'Martínez', 'González', 'hugo.martinez@example.com', '123', 2, 1, null, null, null, null, null);


-- clases 

-- Insertar 50 clases para la semana
-- Insertar 50 clases para la semana
-- Insertar 50 clases para la semana
INSERT INTO clase (id, status, inicio, final, dia, "idUsuarioMaestro", "idGrupo", "idMateria", "idSalon") VALUES 
(1, 1, '07:00:00', '09:00:00', 1, 16, 1, 1, 1),  -- Lunes 7 AM - 9 AM, Maestro 16, Grupo A, Matemáticas I, Salón 101
(2, 1, '09:00:00', '11:00:00', 1, 16, 1, 2, 1),  -- Lunes 9 AM - 11 AM, Maestro 16, Grupo A, Física I, Salón 101
(3, 1, '11:00:00', '12:00:00', 1, 17, 1, 3, 1),  -- Lunes 11 AM - 12 PM, Maestro 17, Grupo A, Química I, Salón 101
(4, 1, '12:00:00', '14:00:00', 1, 17, 2, 4, 2),  -- Lunes 12 PM - 2 PM, Maestro 17, Grupo B, Programación I, Salón 102
(5, 1, '14:00:00', '15:00:00', 1, 18, 2, 5, 2),  -- Lunes 2 PM - 3 PM, Maestro 18, Grupo B, Estructuras de Datos, Salón 102
(6, 1, '15:00:00', '17:00:00', 1, 18, 3, 6, 3),  -- Lunes 3 PM - 5 PM, Maestro 18, Grupo C, Base de Datos, Salón 201
(7, 1, '17:00:00', '19:00:00', 1, 19, 3, 7, 3),  -- Lunes 5 PM - 7 PM, Maestro 19, Grupo C, Redes de Computadoras, Salón 201
(8, 1, '19:00:00', '20:00:00', 1, 19, 4, 8, 3),  -- Lunes 7 PM - 8 PM, Maestro 19, Grupo D, Ética Profesional, Salón 201

(9, 1, '07:00:00', '09:00:00', 2, 20, 1, 9, 4),  -- Martes 7 AM - 9 AM, Maestro 20, Grupo A, Matemáticas II, Salón 101
(10, 1, '09:00:00', '10:00:00', 2, 20, 1, 10, 4),  -- Martes 9 AM - 10 AM, Maestro 20, Grupo A, Física II, Salón 101
(11, 1, '10:00:00', '12:00:00', 2, 21, 1, 1, 1),  -- Martes 10 AM - 12 PM, Maestro 21, Grupo A, Matemáticas I, Salón 101
(12, 1, '12:00:00', '14:00:00', 2, 21, 2, 2, 1),  -- Martes 12 PM - 2 PM, Maestro 21, Grupo B, Física I, Salón 102
(13, 1, '14:00:00', '15:00:00', 2, 22, 2, 3, 1),  -- Martes 2 PM - 3 PM, Maestro 22, Grupo B, Química I, Salón 102
(14, 1, '15:00:00', '17:00:00', 2, 22, 3, 4, 2),  -- Martes 3 PM -  5 PM, Maestro 22, Grupo C, Programación I, Salón 201
(15, 1, '17:00:00', '19:00:00', 2, 23, 3, 5, 2),  -- Martes 5 PM - 7 PM, Maestro 23, Grupo C, Estructuras de Datos, Salón 201
(16, 1, '19:00:00', '20:00:00', 2, 23, 4, 6, 3),  -- Martes 7 PM - 8 PM, Maestro 23, Grupo D, Base de Datos, Salón 201

(17, 1, '07:00:00', '09:00:00', 3, 24, 1, 7, 3),  -- Miércoles 7 AM - 9 AM, Maestro 24, Grupo A, Redes de Computadoras, Salón 301
(18, 1, '09:00:00', '11:00:00', 3, 24, 1, 8, 3),  -- Miércoles 9 AM - 11 AM, Maestro 24, Grupo A, Ética Profesional, Salón 301
(19, 1, '11:00:00', '12:00:00', 3, 25, 1, 9, 4),  -- Miércoles 11 AM - 12 PM, Maestro 25, Grupo A, Matemáticas II, Salón 301
(20, 1, '12:00:00', '14:00:00', 3, 25, 2, 10, 4),  -- Miércoles 12 PM - 2 PM, Maestro 25, Grupo B, Física II, Salón 302
(21, 1, '14:00:00', '16:00:00', 3, 16, 2, 1, 2),  -- Miércoles 2 PM - 4 PM, Maestro 16, Grupo B, Química I, Salón 302
(22, 1, '16:00:00', '18:00:00', 3, 16, 3, 2, 3),  -- Miércoles 4 PM - 6 PM, Maestro 16, Grupo C, Programación I, Salón 201
(23, 1, '18:00:00', '20:00:00', 3, 17, 3, 3, 3),  -- Miércoles 6 PM - 8 PM, Maestro 17, Grupo C, Estructuras de Datos, Salón 201

(24, 1, '07:00:00', '09:00:00', 4, 18, 1, 4, 4),  -- Jueves 7 AM - 9 AM, Maestro 18, Grupo A, Matemáticas I, Salón 101
(25, 1, '09:00:00', '11:00:00', 4, 18, 1, 5, 4),  -- Jueves 9 AM - 11 AM, Maestro 18, Grupo A, Física I, Salón 101
(26, 1, '11:00:00', '12:00:00', 4, 19, 1, 6, 1),  -- Jueves 11 AM - 12 PM, Maestro 19, Grupo A, Química I, Salón 101
(27, 1, '12:00:00', '14:00:00', 4, 19, 2, 7, 2),  -- Jueves 12 PM - 2 PM, Maestro 19, Grupo B, Programación I, Salón 102
(28, 1, '14:00:00', '16:00:00', 4, 20, 2, 8, 2),  -- Jueves 2 PM - 4 PM, Maestro 20, Grupo B, Estructuras de Datos, Salón 102
(29, 1, '16:00:00', '18:00:00', 4, 20, 3, 9, 3),  -- Jueves 4 PM - 6 PM, Maestro 20, Grupo C, Base de Datos, Salón 201
(30, 1, '18:00:00', '20:00:00', 4, 21, 3, 10, 3),  -- Jueves 6 PM - 8 PM, Maestro 21, Grupo C, Redes de Computadoras, Salón 201

(31, 1, '07:00:00', '09:00:00', 5, 22, 1, 1, 4),  -- Viernes 7 AM - 9 AM, Maestro 22, Grupo A, Matemáticas I, Salón 101
(32, 1, '09:00:00', '11:00:00', 5, 22, 1, 2, 4),  -- Viernes 9 AM - 11 AM, Maestro 22, Grupo A, Física I, Salón 101
(33, 1, '11:00:00', '12:00:00', 5, 23, 1, 3, 1),  -- Viernes 11 AM - 12 PM, Maestro 23, Grupo A, Química I, Salón 101
(34, 1, '12:00:00', '14:00:00', 5, 23, 2, 4, 2),  -- Viernes 12 PM - 2 PM, Maestro 23, Grupo B, Programación I, Salón 102
(35, 1, '14:00:00', '16:00:00', 5, 24, 2, 5, 2),  -- Viernes 2 PM - 4 PM, Maestro 24, Grupo B, Estructuras de Datos, Salón 102
(36, 1, '16:00:00', '18:00:00', 5, 24, 3, 6, 3),  -- Viernes 4 PM - 6 PM, Maestro 24, Grupo C, Base de Datos, Salón 201
(37, 1, '18:00:00', '20:00:00', 5, 25, 3, 7, 3),  -- Viernes 6 PM - 8 PM, Maestro 25, Grupo C, Redes de Computadoras, Salón 201

(38, 1, '07:00:00', '09:00:00', 6, 16, 1, 8, 4),  -- Sábado 7 AM - 9 AM, Maestro 16, Grupo A, Matemáticas I, Salón 101
(39, 1, '09:00:00', '11:00:00', 6, 16, 1, 9, 4),  -- Sábado 9 AM - 11 AM, Maestro 16, Grupo A, Física I, Salón 101
(40, 1, '11:00:00', '12:00:00', 6, 17, 1, 10, 1),  -- Sábado 11 AM - 12 PM, Maestro 17, Grupo A, Química I, Salón 101
(41, 1, '12:00:00', '14:00:00', 6, 17, 2, 1, 2),  -- Sábado 12 PM - 2 PM, Maestro 17, Grupo B, Programación I, Salón 102
(42, 1, '14:00:00', '16:00:00', 6, 18, 2, 2, 2),  -- Sábado 2 PM - 4 PM, Maestro 18, Grupo B, Estructuras de Datos, Salón 102
(43, 1, '16:00:00', '18:00:00', 6, 18, 3, 3, 3),  -- Sábado 4 PM - 6 PM, Maestro 18, Grupo C, Base de Datos, Salón 201
(44, 1, '18:00:00', '20:00:00', 6, 19, 3, 4, 3),  -- Sábado 6 PM - 8 PM, Maestro 19, Grupo C, Redes de Computadoras, Salón 201

(45, 1, '07:00:00', '09:00:00', 7, 20, 1, 5, 4),  -- Domingo 7 AM - 9 AM, Maestro 20, Grupo A, Matemáticas I, Salón 101
(46, 1, '09:00:00', '11:00:00', 7, 20, 1, 6, 4),  -- Domingo 9 AM - 11 AM, Maestro 20, Grupo A, Física I, Salón 101
(47, 1, '11:00:00', '12:00:00', 7, 21, 1, 7, 1),  -- Domingo 11 AM - 12 PM, Maestro 21, Grupo A, Química I, Salón 101
(48, 1, '12:00:00', '14:00:00', 7, 21, 2, 8, 2),  -- Domingo 12 PM - 2 PM, Maestro 21, Grupo B, Programación I, Salón 102
(49, 1, '14:00:00', '16:00:00', 7, 22, 2, 9, 2),  -- Domingo 2 PM - 4 PM, Maestro 22, Grupo B, Estructuras de Datos, Salón 102
(50, 1, '16:00:00', '18:00:00', 7, 22, 3, 10, 3);  -- Domingo 4 PM - 6 PM, Maestro 22, Grupo C, Base de Datos, Salón 201