package com.example.hospital.dto;

import java.time.LocalDateTime;

public class AppointmentDTO {

    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;

    // Constructor vacío
    public AppointmentDTO() {
    }

    // Constructor con parámetros
    public AppointmentDTO(Long patientId, Long doctorId, LocalDateTime appointmentDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
    }

    // Getters y Setters
    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
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

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
}
