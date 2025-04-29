package com.example.hospital.dto;

import com.example.hospital.model.Prescription;
import java.time.LocalDate;

public class PrescriptionDTO {

    private Long prescriptionId;
    private Long patientId;
    private Long doctorId;
    private LocalDate issueDate;

    public PrescriptionDTO() {}

    public PrescriptionDTO(Long prescriptionId, Long patientId, Long doctorId, LocalDate issueDate) {
        this.prescriptionId = prescriptionId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.issueDate = issueDate;
    }

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public static PrescriptionDTO fromEntity(Prescription prescription) {
        return new PrescriptionDTO(
            prescription.getPrescriptionId(),
            prescription.getPatient().getPatientId(),
            prescription.getDoctor().getDoctorId(),
            prescription.getIssueDate()
        );
    }
}
