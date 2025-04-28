package com.example.hospital.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvoiceDTO {

    private Long patientId;  // ID del paciente
    private LocalDate date;  // Fecha de la factura
    private BigDecimal total;  // Total de la factura

    // Getters y setters
    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
