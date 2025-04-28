package com.example.hospital.repository;

import com.example.hospital.model.Appointment;
import com.example.hospital.model.Doctor;
import com.example.hospital.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Doctor doctor);

    List<Appointment> findByPatient(Patient patient);

    List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findByDoctorAndAppointmentDateBetween(Doctor doctor, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatientAndAppointmentDateBetween(Patient patient, LocalDateTime start, LocalDateTime end);
}