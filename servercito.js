const { ifError } = require('assert');
const { error } = require('console');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 3000;

//Configuracion de MYSQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'testeo',
    password: 'permiso',
    database: 'urgencias_medicas',
});

//Conectar a la base de datos.
db.connect((error) => {
    if (error) throw error;
    console.log('Conectado a la base de datos Urgencias Medicas');
});

//Configuracion para recibir datos en formato JSON
app.use(express.json());
app.use(cors());

//Ruta de prueba
app.get('/',(req, res) => {
    res.send('Servidor y base de datos estan configurados correctamente. ');
});

//Ruta para listar todas las atenciones.
app.get('/atenciones', (req, res) => {
    const query = `
    SELECT a.id_atencion, p.nombre AS paciente, p.apellido AS paciente_apellido,
    m.nombre AS medico, m.apellido AS medico_apellido,
    e.nombre_especialidad, act.nombre_actividad,
    a.fecha_ingreso, a.fecha_alta, a.diagnostico
    FROM Atenciones a
    JOIN Pacientes p ON a.paciente_id = p.id_paciente
    JOIN Medicos m ON a.medico_id = m.id_medico
    JOIN Especialidades e ON a.especialidad_id = e.id_especialidad
    JOIN Actividades act ON a.actividad_id = act.id_actividad;
    `;
    db.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//Ruta para agregar nueva atencion.
app.post('/atenciones', (req, res) => {
    const { paciente_id, medico_id, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico } = req.body;
    const query = `
    INSERT INTO Atenciones (paciente_id, medico_id, especialidad_id,
    actividad_id, fecha_ingreso, fecha_alta, diagnostico)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    db.query(query, [paciente_id, medico_id, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico], (error,results) => {
        if (error) throw error;
        res.json({message: 'Atencion agregada exitosamente', id: results.insertId});
    });

});

//Ruta para actualizar una atencion.
app.put('/atenciones/:id', (req, res) => {
    const { id } = req.params;
    const { paciente_id, medico_id, especialidad_id, actividad_id, fecha_ingreso, fecha_alta, diagnostico } = req.body;
    const query = `
        UPDATE Atenciones
        SET paciente_id = ?, medico_id = ?, especialidad_id = ?, actividad_id =?, fecha_ingreso = ?, fecha_alta = ?, diagnostico = ?
        WHERE id_atencion = ?;
        `;

    db.query(query,[paciente_id, medico_id,especialidad_id,actividad_id, fecha_ingreso, fecha_alta, diagnostico, id], (error,results) => {
        if (error) throw error;
        res.json({ message: 'Atencion actualizada exitosamente'});
    });
});

//Ruta para eliminar una atencion.
app.delete('/atenciones/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Atenciones WHERE id_atencion = ?;';
    db.query(query, [id], (error, results) => {
        if (error) throw error;
        res.json({message: 'Atencion eliminada exitosamente'});

    });
});

app.get('/atenciones/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT a.id_atencion, p.nombre AS paciente, p.apellido AS paciente_apellido,
               m.nombre AS medico, m.apellido AS medico_apellido,
               e.nombre_especialidad, act.nombre_actividad,
               a.fecha_ingreso, a.fecha_alta, a.diagnostico
        FROM Atenciones a
        JOIN Pacientes p ON a.paciente_id = p.id_paciente
        JOIN Medicos m ON a.medico_id = m.id_medico
        JOIN Especialidades e ON a.especialidad_id = e.id_especialidad
        JOIN Actividades act ON a.actividad_id = act.id_actividad
        WHERE a.id_atencion = ?;
    `;
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error en la consulta de la atención' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Atención no encontrada' });
        } else {
            res.json(results[0]);
        }
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});