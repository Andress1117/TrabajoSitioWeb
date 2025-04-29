package com.example.hospital.service;

import com.example.hospital.model.Medication;
import com.example.hospital.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationService {

    @Autowired
    private MedicationRepository medicationRepository;

    // Crear un nuevo medicamento
    public Medication createMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    // Obtener todos los medicamentos
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    // Obtener un medicamento por su ID
    public Optional<Medication> getMedicationById(Long id) {
        return medicationRepository.findById(id);
    }

    // Actualizar un medicamento existente
    public Medication updateMedication(Long id, Medication medication) {
        if (medicationRepository.existsById(id)) {
            medication.setMedicationId(id);
            return medicationRepository.save(medication);
        }
        return null;
    }

    // Eliminar un medicamento por su ID
    public boolean deleteMedication(Long id) {
        if (medicationRepository.existsById(id)) {
            medicationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
