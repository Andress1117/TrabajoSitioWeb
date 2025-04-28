package com.example.hospital.exception;

public class DoctorNotFoundException extends RuntimeException {
    public DoctorNotFoundException(Long id) {
        super("Doctor no encontrado con ID: " + id);
    }
}