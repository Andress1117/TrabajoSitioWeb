package com.example.hospital.service;

import com.example.hospital.dto.PrescriptionDTO;
import com.example.hospital.model.Doctor;
import com.example.hospital.model.Patient;
import com.example.hospital.model.Prescription;
import com.example.hospital.repository.IDoctorRepository;
import com.example.hospital.repository.IPatientRepository;
import com.example.hospital.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private IPatientRepository patientRepository;

    @Autowired
    private IDoctorRepository doctorRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public Prescription createPrescription(PrescriptionDTO dto) throws Exception {
        Patient patient = patientRepository.findById(dto.getPatientId())
                            .orElseThrow(() -> new Exception("Paciente no encontrado"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                            .orElseThrow(() -> new Exception("Doctor no encontrado"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setIssueDate(dto.getIssueDate());

        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, PrescriptionDTO dto) throws Exception {
        if (!prescriptionRepository.existsById(id)) {
            throw new Exception("Receta no encontrada");
        }

        Patient patient = patientRepository.findById(dto.getPatientId())
                            .orElseThrow(() -> new Exception("Paciente no encontrado"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                            .orElseThrow(() -> new Exception("Doctor no encontrado"));

        Prescription prescription = new Prescription();
        prescription.setPrescriptionId(id);
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setIssueDate(dto.getIssueDate());

        return prescriptionRepository.save(prescription);
    }

    public boolean deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            return false;
        }
        prescriptionRepository.deleteById(id);
        return true;
    }
}
