package com.example.hospital.dto;

public class MedicationDTO {

    private Long medicationId;
    private String name;
    private String description;

    public MedicationDTO(Long medicationId, String name, String description) {
        this.medicationId = medicationId;
        this.name = name;
        this.description = description;
    }

    // Getters y Setters

    public Long getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(Long medicationId) {
        this.medicationId = medicationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
