// Configuración de la URL base del API
const API_URL = 'http://localhost:8080/api';

// Variables globales
let currentAppointmentId = null;
let doctors = [];
let patients = [];
let appointments = [];

// Elementos del DOM - Verificar que existan antes de asignar eventos
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const editAppointmentForm = document.getElementById('editAppointmentForm');
    const appointmentTable = document.getElementById('appointmentTable').querySelector('tbody');
    const filterInput = document.getElementById('filterInput');
    const filterDate = document.getElementById('filterDate');
    const filterDoctor = document.getElementById('filterDoctor');
    const updateAppointmentButton = document.getElementById('updateAppointmentButton');
    
    // Inicializar modal de edición
    const editAppointmentModalElement = document.getElementById('editAppointmentModal');
    const editAppointmentModal = new bootstrap.Modal(editAppointmentModalElement);
    
    // Cargar datos iniciales
    loadDoctors();
    loadPatients();
    loadAppointments();
    
    // Event listeners
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', createAppointment);
    }
    
    if (updateAppointmentButton) {
        updateAppointmentButton.addEventListener('click', updateAppointment);
    }
    
    if (filterInput) {
        filterInput.addEventListener('input', filterAppointments);
    }
    
    if (filterDate) {
        filterDate.addEventListener('change', filterAppointments);
    }
    
    if (filterDoctor) {
        filterDoctor.addEventListener('change', filterAppointments);
    }
    
    // Función para crear una nueva cita
    async function createAppointment(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const doctorId = document.getElementById('doctorId').value;
        const patientId = document.getElementById('patientId').value;
        const appointmentDate = document.getElementById('appointmentDate').value;
        const appointmentTime = document.getElementById('appointmentTime').value;
        
        // Verificar que se hayan completado todos los campos
        if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
            showMessage('error', 'Por favor complete todos los campos');
            return;
        }
        
        // Crear objeto de cita para enviar al servidor
        const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
        const appointmentData = {
            doctorId: parseInt(doctorId),
            patientId: parseInt(patientId),
            appointmentDate: appointmentDateTime
        };
        
        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la cita');
            }
            
            // Recargar la lista de citas
            loadAppointments();
            appointmentForm.reset();
            showMessage('success', 'Cita agendada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', error.message || 'No se pudo agendar la cita');
        }
    }
    
    // Función para abrir el modal de edición
    function openEditModal(appointment) {
        currentAppointmentId = appointment.id;
        
        // Convertir la fecha y hora
        const dateTime = new Date(appointment.appointmentDate);
        const date = dateTime.toISOString().split('T')[0];
        const time = dateTime.toTimeString().slice(0, 5);
        
        // Establecer los valores en el formulario de edición
        document.getElementById('editDoctorId').value = appointment.doctorId;
        document.getElementById('editPatientId').value = appointment.patientId;
        document.getElementById('editAppointmentDate').value = date;
        document.getElementById('editAppointmentTime').value = time;
        
        // Mostrar el modal
        editAppointmentModal.show();
    }
    
    // Función para actualizar una cita
    async function updateAppointment() {
        // Obtener los valores del formulario
        const doctorId = document.getElementById('editDoctorId').value;
        const patientId = document.getElementById('editPatientId').value;
        const appointmentDate = document.getElementById('editAppointmentDate').value;
        const appointmentTime = document.getElementById('editAppointmentTime').value;
        
        // Verificar que se hayan completado todos los campos
        if (!doctorId || !patientId || !appointmentDate || !appointmentTime) {
            showMessage('error', 'Por favor complete todos los campos');
            return;
        }
        
        // Crear objeto de cita para enviar al servidor
        const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
        const appointmentData = {
            id: currentAppointmentId,
            doctorId: parseInt(doctorId),
            patientId: parseInt(patientId),
            appointmentDate: appointmentDateTime
        };
        
        try {
            const response = await fetch(`${API_URL}/appointments/${currentAppointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la cita');
            }
            
            // Cerrar el modal
            editAppointmentModal.hide();
            
            // Recargar la lista de citas
            loadAppointments();
            showMessage('success', 'Cita actualizada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', error.message || 'No se pudo actualizar la cita');
        }
    }
    
    // Función para eliminar una cita
    async function deleteAppointment(id) {
        if (!confirm('¿Está seguro de que desea eliminar esta cita?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/appointments/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la cita');
            }
            
            // Recargar la lista de citas
            loadAppointments();
            showMessage('success', 'Cita eliminada con éxito');
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', error.message || 'No se pudo eliminar la cita');
        }
    }
    
    // Función para filtrar citas
    function filterAppointments() {
        const filterText = filterInput.value.toLowerCase();
        const filterDateValue = filterDate.value;
        const filterDoctorValue = filterDoctor.value;
        
        // Filtrar las citas según los criterios
        const filteredAppointments = appointments.filter(appointment => {
            // Filtro por texto (nombre de doctor o paciente)
            const textMatch = 
                appointment.doctorName.toLowerCase().includes(filterText) || 
                appointment.patientName.toLowerCase().includes(filterText);
            
            // Filtro por fecha
            let dateMatch = true;
            if (filterDateValue) {
                const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
                dateMatch = appointmentDate === filterDateValue;
            }
            
            // Filtro por doctor
            let doctorMatch = true;
            if (filterDoctorValue) {
                doctorMatch = appointment.doctorId.toString() === filterDoctorValue;
            }
            
            return textMatch && dateMatch && doctorMatch;
        });
        
        renderAppointments(filteredAppointments);
    }
    
    // Función para renderizar la tabla de citas
    function renderAppointments(appointments) {
        appointmentTable.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay citas registradas</td>
                </tr>
            `;
            return;
        }
        
        appointments.forEach(appointment => {
            // Formatear fecha y hora
            const dateObj = new Date(appointment.appointmentDate);
            const formattedDate = dateObj.toLocaleDateString('es-ES');
            const formattedTime = dateObj.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.doctorName}</td>
                <td>${appointment.patientName}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${appointment.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${appointment.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            
            // Agregar event listeners para los botones de editar y eliminar
            const editBtn = row.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => openEditModal(appointment));
            }
            
            const deleteBtn = row.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteAppointment(appointment.id));
            }
            
            appointmentTable.appendChild(row);
        });
    }
});

// Función para cargar los doctores
async function loadDoctors() {
    try {
        console.log('Cargando doctores...');
        const response = await fetch(`${API_URL}/doctors`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar los doctores');
        }
        
        doctors = await response.json();
        console.log('Doctores cargados:', doctors);
        
        // Llenar los desplegables de doctores
        populateDoctorSelect(document.getElementById('doctorId'), doctors);
        populateDoctorSelect(document.getElementById('editDoctorId'), doctors);
        populateDoctorSelect(document.getElementById('filterDoctor'), doctors, true);
        
    } catch (error) {
        console.error('Error al cargar doctores:', error);
        showMessage('error', error.message || 'No se pudieron cargar los doctores');
    }
}

// Función para cargar los pacientes
async function loadPatients() {
    try {
        console.log('Cargando pacientes...');
        const response = await fetch(`${API_URL}/patients`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar los pacientes');
        }
        
        patients = await response.json();
        console.log('Pacientes cargados:', patients);
        
        // Llenar los desplegables de pacientes
        populatePatientSelect(document.getElementById('patientId'), patients);
        populatePatientSelect(document.getElementById('editPatientId'), patients);
        
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        showMessage('error', error.message || 'No se pudieron cargar los pacientes');
    }
}

// Función para cargar las citas
async function loadAppointments() {
    try {
        console.log('Cargando citas...');
        const response = await fetch(`${API_URL}/appointments`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar las citas');
        }
        
        appointments = await response.json();
        console.log('Citas cargadas:', appointments);
        
        // Renderizar la tabla de citas
        const appointmentTable = document.getElementById('appointmentTable').querySelector('tbody');
        if (appointmentTable) {
            renderAppointments(appointments);
        }
        
    } catch (error) {
        console.error('Error al cargar citas:', error);
        showMessage('error', error.message || 'No se pudieron cargar las citas');
    }
}

// Función para poblar selects de doctores
function populateDoctorSelect(selectElement, doctors, includeAll = false) {
    if (!selectElement) {
        console.error('El elemento select para doctores no existe');
        return;
    }
    
    console.log('Poblando selector de doctores:', selectElement.id);
    selectElement.innerHTML = '';
    
    if (includeAll) {
        const optionAll = document.createElement('option');
        optionAll.value = '';
        optionAll.textContent = 'Todos los doctores';
        selectElement.appendChild(optionAll);
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un doctor';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);
    }
    
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = doctor.name;
        selectElement.appendChild(option);
    });
    
    console.log('Selector de doctores poblado con', doctors.length, 'opciones');
}

// Función para poblar selects de pacientes
function populatePatientSelect(selectElement, patients) {
    if (!selectElement) {
        console.error('El elemento select para pacientes no existe');
        return;
    }
    
    console.log('Poblando selector de pacientes:', selectElement.id);
    selectElement.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione un paciente';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.patientId;
        option.textContent = patient.name;
        selectElement.appendChild(option);
    });
    
    console.log('Selector de pacientes poblado con', patients.length, 'opciones');
}

// Función para renderizar la tabla de citas
function renderAppointments(appointments) {
    const appointmentTable = document.getElementById('appointmentTable').querySelector('tbody');
    if (!appointmentTable) {
        console.error('La tabla de citas no existe');
        return;
    }
    
    appointmentTable.innerHTML = '';
    
    if (appointments.length === 0) {
        appointmentTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay citas registradas</td>
            </tr>
        `;
        return;
    }
    
    appointments.forEach(appointment => {
        // Formatear fecha y hora
        const dateObj = new Date(appointment.appointmentDate);
        const formattedDate = dateObj.toLocaleDateString('es-ES');
        const formattedTime = dateObj.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.doctorName}</td>
            <td>${appointment.patientName}</td>
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${appointment.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${appointment.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        // Agregar event listeners para los botones de editar y eliminar
        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const appointmentToEdit = appointments.find(a => a.id === appointment.id);
            
            // Inicializar modal si no existe
            const editAppointmentModalElement = document.getElementById('editAppointmentModal');
            const editAppointmentModal = new bootstrap.Modal(editAppointmentModalElement);
            
            // Función para abrir el modal de edición
            const openEditModal = (appointment) => {
                currentAppointmentId = appointment.id;
                
                // Convertir la fecha y hora
                const dateTime = new Date(appointment.appointmentDate);
                const date = dateTime.toISOString().split('T')[0];
                const time = dateTime.toTimeString().slice(0, 5);
                
                // Establecer los valores en el formulario de edición
                document.getElementById('editDoctorId').value = appointment.doctorId;
                document.getElementById('editPatientId').value = appointment.patientId;
                document.getElementById('editAppointmentDate').value = date;
                document.getElementById('editAppointmentTime').value = time;
                
                // Mostrar el modal
                editAppointmentModal.show();
            };
            
            openEditModal(appointmentToEdit);
        });
        
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
                deleteAppointment(appointment.id);
            }
        });
        
        appointmentTable.appendChild(row);
    });
}

// Función para eliminar una cita
async function deleteAppointment(id) {
    try {
        console.log('Eliminando cita con ID:', id);
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar la cita');
        }
        
        // Recargar la lista de citas
        loadAppointments();
        showMessage('success', 'Cita eliminada con éxito');
    } catch (error) {
        console.error('Error:', error);
        showMessage('error', error.message || 'No se pudo eliminar la cita');
    }
}

// Función para mostrar mensajes temporales
function showMessage(type, message) {
    // Crear un elemento para el mensaje
    const messageElement = document.createElement('div');
    messageElement.classList.add('alert', type === 'error' ? 'alert-danger' : 'alert-success', 'message-toast');
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.right = '20px';
    messageElement.style.zIndex = '9999';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    // Agregar al DOM
    document.body.appendChild(messageElement);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}