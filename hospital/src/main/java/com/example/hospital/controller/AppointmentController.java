package com.example.hospital.controller;

import com.example.hospital.model.Appointment;
import com.example.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Clase para la respuesta de error
class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Crear o actualizar una cita
    @PostMapping
    public ResponseEntity<?> createOrUpdateAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment savedAppointment = appointmentService.saveAppointment(appointment);
            return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            // Retornar un objeto de error con el mensaje
            ErrorResponse errorResponse = new ErrorResponse("Error al crear o actualizar la cita.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    // Obtener todas las citas
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    // Obtener una cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable("id") Long id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar una cita por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable("id") Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            // Retornar un mensaje en caso de error
            ErrorResponse errorResponse = new ErrorResponse("No se encontró la cita para eliminar.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}
