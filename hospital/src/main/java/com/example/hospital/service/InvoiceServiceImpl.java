package com.example.hospital.service;

import com.example.hospital.dto.InvoiceDTO;
import com.example.hospital.model.Invoice;
import com.example.hospital.model.Patient;
import com.example.hospital.repository.InvoiceRepository;
import com.example.hospital.repository.IPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        try {
            // Log para verificar los datos recibidos
            System.out.println("Creando factura con los siguientes datos: " + invoiceDTO);

            // Validación para asegurarse de que patientId no sea nulo
            if (invoiceDTO.getPatientId() == null) {
                throw new RuntimeException("El ID del paciente no puede ser nulo.");
            }

            // Buscar al paciente
            Patient patient = patientRepository.findById(invoiceDTO.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

            // Crear la factura
            Invoice invoice = new Invoice();
            invoice.setDate(invoiceDTO.getDate());
            invoice.setTotal(invoiceDTO.getTotal());
            invoice.setPatient(patient);

            // Guardar la factura en la base de datos
            invoice = invoiceRepository.save(invoice);

            // Establecer el ID de la factura en el DTO y devolverlo
            invoiceDTO.setInvoiceId(invoice.getInvoiceId());
            return invoiceDTO;
        } catch (RuntimeException e) {
            // Log de error
            System.err.println("Error al crear la factura: " + e.getMessage());
            throw new RuntimeException("Error al crear la factura: " + e.getMessage());
        }
    }

    @Override
    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        InvoiceDTO dto = new InvoiceDTO();
        dto.setInvoiceId(invoice.getInvoiceId());
        dto.setPatientId(invoice.getPatient().getPatientId());
        dto.setDate(invoice.getDate());
        dto.setTotal(invoice.getTotal());

        return dto;
    }

    @Override
    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream().map(invoice -> {
            InvoiceDTO dto = new InvoiceDTO();
            dto.setInvoiceId(invoice.getInvoiceId());
            dto.setPatientId(invoice.getPatient().getPatientId());
            dto.setDate(invoice.getDate());
            dto.setTotal(invoice.getTotal());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        invoice.setDate(invoiceDTO.getDate());
        invoice.setTotal(invoiceDTO.getTotal());

        Patient patient = patientRepository.findById(invoiceDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        invoice.setPatient(patient);

        invoiceRepository.save(invoice);

        return invoiceDTO;
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
