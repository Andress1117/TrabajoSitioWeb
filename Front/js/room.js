document.addEventListener('DOMContentLoaded', () => {
    // Cargar departamentos en el desplegable
    fetch('http://localhost:8080/api/departments')
      .then(response => response.json())
      .then(departments => {
        const departmentSelect = document.getElementById('departmentId');
        departments.forEach(department => {
          const option = document.createElement('option');
          option.value = department.departmentId;
          option.textContent = department.name;
          departmentSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error cargando departamentos:', error));

    // Enviar el formulario
    const roomForm = document.getElementById('roomForm');
    roomForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(roomForm);
      const roomData = {
        number: formData.get('number'),
        departmentId: formData.get('departmentId'),
        status: formData.get('status')
      };

      fetch('http://localhost:8080/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
          }
          return response.json();
        })
        .then(data => {
          console.log('Habitación registrada:', data);
          alert('Habitación registrada exitosamente.');
          roomForm.reset(); // Limpiar el formulario después de registrar
          loadRooms(); // Recargar la tabla
        })
        .catch(error => {
          alert('Error: ' + error.message);
        });
    });

    // Cargar habitaciones registradas
    function loadRooms() {
      fetch('http://localhost:8080/api/rooms')
        .then(response => response.json())
        .then(rooms => {
          const tableBody = document.getElementById('roomTableBody');
          tableBody.innerHTML = ''; // Limpiar la tabla

          rooms.forEach(room => {
            const row = document.createElement('tr');
            // Verificar si 'room.department' existe antes de acceder a 'name'
            const departmentName = room.department ? room.department.name : 'Sin departamento';
            row.innerHTML = `
              <td>${room.number}</td>
              <td>${departmentName}</td>
              <td>${room.status}</td>
            `;
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error('Error cargando habitaciones:', error));
    }

    // Cargar habitaciones al cargar la página
    loadRooms();
});
