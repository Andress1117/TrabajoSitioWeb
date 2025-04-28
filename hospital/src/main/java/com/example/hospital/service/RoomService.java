package com.example.hospital.service;

import com.example.hospital.model.Room;
import com.example.hospital.model.Department;
import com.example.hospital.repository.RoomRepository;
import com.example.hospital.dto.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(Room room) {
        // Validar número
        validateRoomNumber(room.getNumber());

        // Validar si ya existe ese número
        if (roomRepository.existsByNumber(room.getNumber())) {
            throw new RuntimeException("Ya existe una habitación con el número: " + room.getNumber());
        }

        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room updateRoom(Long id, RoomDTO roomDTO, Department department) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));

        validateRoomNumber(roomDTO.getNumber());

        // Solo validar número repetido si el número cambió
        if (!room.getNumber().equals(roomDTO.getNumber()) && roomRepository.existsByNumber(roomDTO.getNumber())) {
            throw new RuntimeException("Ya existe una habitación con el número: " + roomDTO.getNumber());
        }

        room.setNumber(roomDTO.getNumber());
        room.setStatus(roomDTO.getStatus());
        room.setDepartment(department);

        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // Método para validar el número
    private void validateRoomNumber(String number) {
        if (number == null || number.trim().isEmpty()) {
            throw new RuntimeException("El número de habitación no puede estar vacío.");
        }

        try {
            int num = Integer.parseInt(number);

            if (num <= 0) {
                throw new RuntimeException("El número de habitación debe ser un número positivo.");
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("El número de habitación debe ser un número válido.");
        }
    }
}
