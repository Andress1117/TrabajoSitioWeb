document.getElementById('formReceta').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
  
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;
    const issueDate = document.getElementById('issueDate').value;
  
    // Crear el objeto de la receta
    const receta = {
      patientId: parseInt(patientId),
      doctorId: parseInt(doctorId),
      issueDate: issueDate
    };
  
    try {
      const response = await fetch('http://localhost:8080/recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receta),
      });
  
      if (response.ok) {
        // Si la receta se guarda correctamente, puedes redirigir o mostrar un mensaje
        alert('Receta guardada exitosamente');
        document.getElementById('formReceta').reset();  // Limpiar el formulario
      } else {
        // Si la respuesta no es OK, mostrar el mensaje de error
        document.getElementById('error-message').style.display = 'block';
      }
    } catch (error) {
      // Manejo de errores de red (problemas con el servidor, etc.)
      console.error('Error al guardar la receta:', error);
      document.getElementById('error-message').style.display = 'block';
    }
  });
  