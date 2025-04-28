document.getElementById('invoiceForm').addEventListener('submit', function(e) {
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
        if (response.ok) {
            alert('Factura creada con éxito');
        } else {
            alert('Error al crear la factura');
        }
    })
    .catch(error => console.error('Error:', error));
});