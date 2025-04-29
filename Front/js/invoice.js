document.addEventListener('DOMContentLoaded', function() {
    const invoiceForm = document.getElementById('invoiceForm');

    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const invoiceData = {
                patientId: document.getElementById('patientId').value,
                date: document.getElementById('date').value,
                total: document.getElementById('total').value
            };

            fetch('http://localhost:8080/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceData)
            })
            .then(response => {
                const alertMessage = document.getElementById('alertMessage');
                if (alertMessage) {  // Verifica que el elemento alertMessage exista
                    if (response.ok) {
                        alertMessage.textContent = 'Factura creada con éxito';
                        alertMessage.classList.remove('error');
                        alertMessage.classList.add('success');
                        alertMessage.style.display = 'block';
                    } else {
                        alertMessage.textContent = 'Error al crear la factura';
                        alertMessage.classList.remove('success');
                        alertMessage.classList.add('error');
                        alertMessage.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const alertMessage = document.getElementById('alertMessage');
                if (alertMessage) {  // Verifica que el elemento alertMessage exista
                    alertMessage.textContent = 'Error al conectar con el servidor';
                    alertMessage.classList.remove('success');
                    alertMessage.classList.add('error');
                    alertMessage.style.display = 'block';
                }
            });
        });
    } else {
        console.error('Formulario no encontrado');
    }
});
