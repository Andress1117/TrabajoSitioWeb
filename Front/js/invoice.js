const apiUrl = 'http://localhost:8080/api/invoices';
const patientsUrl = 'http://localhost:8080/api/patients';

document.addEventListener('DOMContentLoaded', () => {
    loadInvoices();
    loadPatients();
});

// Cargar pacientes
async function loadPatients() {
    try {
        const res = await fetch(patientsUrl);
        const patients = await res.json();
        const select = document.getElementById('patientSelect');
        select.innerHTML = '<option value="">Seleccione un paciente</option>';
        patients.forEach(patient => {
            select.innerHTML += `<option value="${patient.patientId}">${patient.name}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
    }
}

// Cargar facturas
async function loadInvoices() {
    try {
        const res = await fetch(apiUrl);
        const invoices = await res.json();
        const tbody = document.getElementById('invoiceTableBody');
        tbody.innerHTML = '';

        invoices.forEach(inv => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${inv.invoiceId}</td>
                <td>${inv.patient ? inv.patient.name : 'Sin paciente'}</td>
                <td>${inv.invoiceDate}</td>
                <td>$${inv.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editInvoice(${inv.invoiceId})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteInvoice(${inv.invoiceId})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar las facturas:', error);
    }
}

// Crear o editar factura
document.getElementById('invoiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const invoiceId = document.getElementById('invoiceId').value;
    const patientId = document.getElementById('patientSelect').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const total = document.getElementById('total').value;

    const invoice = { patientId, invoiceDate, total };

    try {
        if (invoiceId) {
            await fetch(`${apiUrl}/${invoiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice)
            });
        } else {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice)
            });
        }

        // Limpiar formulario y recargar facturas
        document.getElementById('invoiceForm').reset();
        document.getElementById('invoiceId').value = '';
        loadInvoices();
    } catch (error) {
        console.error('Error al guardar factura:', error);
        alert('Error al guardar la factura. Por favor intente nuevamente.');
    }
});

// Editar factura
async function editInvoice(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        const inv = await res.json();

        document.getElementById('invoiceId').value = inv.invoiceId;
        document.getElementById('patientSelect').value = inv.patientId;
        document.getElementById('invoiceDate').value = inv.invoiceDate;
        document.getElementById('total').value = inv.total;
    } catch (error) {
        console.error('Error al editar factura:', error);
    }
}

// Eliminar factura
async function deleteInvoice(id) {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            loadInvoices();
        } catch (error) {
            console.error('Error al eliminar factura:', error);
        }
    }
}
