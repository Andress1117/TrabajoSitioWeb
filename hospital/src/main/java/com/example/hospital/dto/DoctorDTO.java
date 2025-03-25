package com.example.hospital.dto;

public class DoctorDTO {
    private Long doctorId;
    private String name;
    private String specialty;
    private String phone;
    private String email;

    public DoctorDTO() {
    }

    public DoctorDTO(Long doctorId, String name, String specialty, String phone, String email) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialty = specialty;
        this.phone = phone;
        this.email = email;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    
}
