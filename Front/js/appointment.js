const apiUrl = 'http://localhost:8080/api/appointments';  // Cambia esto si tu API está en otro puerto

// Obtener todas las citas y mostrarlas en la tabla
function loadAppointments() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('appointmentsTableBody');
            tableBody.innerHTML = '';  // Limpiar la tabla antes de llenarla
            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.appointmentId}</td>
                    <td>${appointment.patient.patientId}</td>
                    <td>${appointment.doctor.doctorId}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.status}</td>
                    <td>
                        <button class="btn btn-info" onclick="editAppointment(${appointment.appointmentId})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteAppointment(${appointment.appointmentId})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener las citas:', error));
}

// Crear o Editar cita
document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const appointmentId = document.getElementById('appointmentId').value;
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const status = document.getElementById('status').value;

    const appointmentData = {
        patient: { patientId },
        doctor: { doctorId },
        date,
        time,
        status
    };

    if (appointmentId) {
        // Actualizar cita existente
        fetch(`${apiUrl}/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        })
        .then(response => response.json())
        .then(() => {
            loadAppointments();  // Recargar citas
            alert('Cita actualizada');
        })
        .catch(error => console.error('Error al actualizar la cita:', error));
    } else {
        // Crear nueva cita
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        })
        .then(response => response.json())
        .then(() => {
            loadAppointments();  // Recargar citas
            alert('Cita creada');
        })
        .catch(error => console.error('Error al crear la cita:', error));
    }
});

// Editar cita (cargar datos en el formulario)
function editAppointment(appointmentId) {
    fetch(`${apiUrl}/${appointmentId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('appointmentId').value = data.appointmentId;
            document.getElementById('patientId').value = data.patient.patientId;
            document.getElementById('doctorId').value = data.doctor.doctorId;
            document.getElementById('date').value = data.date;
            document.getElementById('time').value = data.time;
            document.getElementById('status').value = data.status;
        })
        .catch(error => console.error('Error al cargar la cita:', error));
}

// Eliminar cita
function deleteAppointment(appointmentId) {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
        fetch(`${apiUrl}/${appointmentId}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadAppointments();  // Recargar citas
            alert('Cita eliminada');
        })
        .catch(error => console.error('Error al eliminar la cita:', error));
    }
}

// Cargar las citas al cargar la página
loadAppointments();