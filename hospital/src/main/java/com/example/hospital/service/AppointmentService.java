package com.example.hospital.service;

import com.example.hospital.model.Appointment;
import com.example.hospital.model.Patient;
import com.example.hospital.model.Doctor;
import com.example.hospital.repository.AppointmentRepository;
import com.example.hospital.repository.IPatientRepository;
import com.example.hospital.repository.IDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    // Crear o actualizar una cita
    public Appointment saveAppointment(Appointment appointment) {
        // Verificar si el paciente existe
        Optional<Patient> patient = patientRepository.findById(appointment.getPatient().getPatientId());
        if (!patient.isPresent()) {
            throw new RuntimeException("Paciente no encontrado");
        }

        // Verificar si el doctor existe
        Optional<Doctor> doctor = doctorRepository.findById(appointment.getDoctor().getDoctorId());
        if (!doctor.isPresent()) {
            throw new RuntimeException("Doctor no encontrado");
        }

        return appointmentRepository.save(appointment);
    }

    // Obtener todas las citas
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Obtener una cita por ID
    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    // Eliminar una cita por ID
    public void deleteAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }
}
