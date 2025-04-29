// Esperamos a que cargue todo el DOM
window.addEventListener('DOMContentLoaded', async function () {
    await cargarRecetas(); // Primero cargamos las recetas ya existentes
  
    // Capturamos el formulario
    const formReceta = document.getElementById('formReceta');
  
    formReceta.addEventListener('submit', async function (event) {
      event.preventDefault(); // Evitamos que se recargue la página
  
      // Capturamos los valores de los campos
      const patientId = document.getElementById('patientId').value;
      const doctorId = document.getElementById('doctorId').value;
      const issueDate = document.getElementById('issueDate').value;
  
      // Creamos el objeto receta que vamos a enviar
      const nuevaReceta = {
        patientId: patientId,
        doctorId: doctorId,
        issueDate: issueDate
      };
  
      try {
        // Enviamos la receta al backend (AJAX POST)
        const response = await fetch('http://localhost:8080/recetas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevaReceta)
        });
  
        if (response.ok) {
          // Si todo salió bien, mostramos el mensaje de éxito
          document.getElementById('success-message').style.display = 'block';
          document.getElementById('error-message').style.display = 'none';
  
          // Limpiamos el formulario
          formReceta.reset();
  
          // Recargamos la tabla de recetas
          await cargarRecetas();
        } else {
          throw new Error('Error al guardar la receta.');
        }
      } catch (error) {
        console.error('Error al registrar receta:', error);
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
      }
    });
  });
  
  // Función para cargar recetas y llenar la tabla
  async function cargarRecetas() {
    try {
      const response = await fetch('http://localhost:8080/recetas');
      const recetas = await response.json();
  
      const tablaRecetas = document.getElementById('tablaRecetas');
      tablaRecetas.innerHTML = ''; // Limpiamos la tabla antes de cargar nuevas filas
  
      if (recetas.length > 0) {
        recetas.forEach((receta) => {
          const fila = document.createElement('tr');
  
          const patientName = receta.patient ? receta.patient.name : receta.patientId; // Si hay nombre, lo mostramos; si no, el ID
          const doctorName = receta.doctor ? receta.doctor.name : receta.doctorId; // Lo mismo para doctor
          const issueDate = receta.issueDate || 'Fecha no disponible';
  
          fila.innerHTML = `
            <td>${patientName}</td>
            <td>${doctorName}</td>
            <td>${issueDate}</td>
          `;
  
          tablaRecetas.appendChild(fila);
        });
      } else {
        tablaRecetas.innerHTML = '<tr><td colspan="3" class="text-center">No hay recetas registradas.</td></tr>';
      }
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  }
  