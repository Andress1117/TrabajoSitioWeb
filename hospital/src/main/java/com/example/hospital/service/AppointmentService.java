package com.example.hospital.service;

import com.example.hospital.dto.AppointmentDTO;
import com.example.hospital.model.Appointment;
import com.example.hospital.model.Doctor;
import com.example.hospital.model.Patient;
import com.example.hospital.repository.IAppointmentRepository;
import com.example.hospital.repository.IDoctorRepository;
import com.example.hospital.repository.IPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.example.hospital.exception.DoctorNotFoundException;

@Service
public class AppointmentService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    @Autowired
    private IPatientRepository patientRepository;

    // Obtener todas las citas
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener cita por ID
    public Optional<AppointmentDTO> getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Obtener citas por doctor
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) {
            return List.of();
        }
        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener citas por paciente
    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        if (patient == null) {
            return List.of();
        }
        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtener citas por rango de fechas
    public List<AppointmentDTO> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Crear nueva cita
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        Appointment appointment = convertToEntity(appointmentDTO);
        appointment = appointmentRepository.save(appointment);
        return convertToDTO(appointment);
    }

    // Actualizar cita
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO appointmentDTO) {
        if (appointmentRepository.existsById(id)) {
            Appointment appointment = convertToEntity(appointmentDTO);
            appointment.setId(id);
            appointment = appointmentRepository.save(appointment);
            return convertToDTO(appointment);
        }
        return null;
    }

    // Eliminar cita
    public boolean deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Convertir de entidad a DTO
    private AppointmentDTO convertToDTO(Appointment appointment) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        appointmentDTO.setId(appointment.getId());
        appointmentDTO.setDoctorId(appointment.getDoctor().getDoctorId());
        appointmentDTO.setDoctorName(appointment.getDoctor().getName());
        appointmentDTO.setPatientId(appointment.getPatient().getPatientId());
        appointmentDTO.setPatientName(appointment.getPatient().getName());
        appointmentDTO.setAppointmentDate(appointment.getAppointmentDate());
        return appointmentDTO;
    }

    // Convertir de DTO a entidad
    private Appointment convertToEntity(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        appointment.setId(appointmentDTO.getId());

        // Buscar el doctor por ID
        Doctor doctor = doctorRepository.findById(appointmentDTO.getDoctorId())
                .orElseThrow(() -> new DoctorNotFoundException(appointmentDTO.getDoctorId()));
        appointment.setDoctor(doctor);

        // Buscar el paciente por ID
        Patient patient = patientRepository.findById(appointmentDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + appointmentDTO.getPatientId()));
        appointment.setPatient(patient);

        System.out.println("Valor de appointmentDate en convertToEntity: " + appointmentDTO.getAppointmentDate()); // Log agregado
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        return appointment;
    }
}
