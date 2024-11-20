const atencionForm = document.getElementById('atencionForm');
const atencionesTable = document.getElementById('atencionesTable');

// Función para obtener y mostrar las atenciones
function obtenerAtenciones() {
    fetch(`http://localhost:3000/atenciones`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        atencionesTable.innerHTML = '';
        data.forEach(atencion => {
            const row = `
                <tr>
                    <td>${atencion.paciente}</td>
                    <td>${atencion.medico}</td>
                    <td>${atencion.nombre_especialidad}</td>
                    <td>${atencion.nombre_actividad}</td>
                    <td>${atencion.fecha_ingreso}</td>
                    <td>${atencion.fecha_alta}</td>
                    <td>${atencion.diagnostico}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarAtencion(${atencion.id_atencion})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarAtencion(${atencion.id_atencion})">Eliminar</button>
                    </td>
                </tr>
            `;
            atencionesTable.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
}

// Función para guardar una atención
atencionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const atencionId = document.getElementById('atencion_id').value;

    const formData = {
        paciente: document.getElementById('paciente').value,
        medico: document.getElementById('medico').value,
        especialidad: document.getElementById('especialidad').value,
        actividad: document.getElementById('actividad').value,
        fecha_ingreso: document.getElementById('fecha_ingreso').value,
        fecha_alta: document.getElementById('fecha_alta').value,
        diagnostico: document.getElementById('diagnostico').value
    };

    const url = atencionId ? `http://localhost:3000/atenciones/${atencionId}` : 'http://localhost:3000/atenciones';
    const method = atencionId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        obtenerAtenciones();
        atencionForm.reset();
        document.getElementById('atencion_id').value = '';
    })
    .catch(error => console.error('Error:', error));
});

function editarAtencion(id) {
    fetch(`http://localhost:3000/atenciones/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('atencion_id').value = data.id_atencion || '';
            document.getElementById('paciente').value = data.paciente || '';
            document.getElementById('medico').value = data.medico || '';
            document.getElementById('especialidad').value = data.especialidad || '';
            document.getElementById('actividad').value = data.actividad || '';
            
            // Extraer solo la parte de la fecha (yyyy-MM-dd)
            document.getElementById('fecha_ingreso').value = data.fecha_ingreso.split('T')[0] || '';
            document.getElementById('fecha_alta').value = data.fecha_alta.split('T')[0] || '';
            
            document.getElementById('diagnostico').value = data.diagnostico || '';
        })
        .catch(error => console.error('Error:', error));
}


// Función para eliminar una atención
function eliminarAtencion(id) {
    fetch(`http://localhost:3000/atenciones/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        obtenerAtenciones();
    })
    .catch(error => console.error('Error:', error));
}

// Llama a la función para cargar las atenciones al iniciar
obtenerAtenciones();
