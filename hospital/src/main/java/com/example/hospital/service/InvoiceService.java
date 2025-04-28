package com.example.hospital.service;

import com.example.hospital.dto.InvoiceDTO;
import com.example.hospital.model.Invoice;
import com.example.hospital.model.Patient;
import com.example.hospital.repository.InvoiceRepository;
import com.example.hospital.repository.IPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private IPatientRepository patientRepository;  // Para acceder a los pacientes

    public Invoice saveInvoice(InvoiceDTO invoiceDTO) {
        // Crear una nueva instancia de Invoice
        Invoice invoice = new Invoice();

        // Asignar los valores del DTO a la entidad Invoice
        invoice.setDate(invoiceDTO.getDate());
        invoice.setTotal(invoiceDTO.getTotal());

        // Obtener el paciente por su ID
        Optional<Patient> patient = patientRepository.findById(invoiceDTO.getPatientId());
        if (patient.isPresent()) {
            invoice.setPatient(patient.get());  // Asignar el paciente a la factura
        } else {
            throw new RuntimeException("Paciente no encontrado");  // Manejar el caso cuando no se encuentra el paciente
        }

        // Guardar la factura en la base de datos
        return invoiceRepository.save(invoice);
    }
}
