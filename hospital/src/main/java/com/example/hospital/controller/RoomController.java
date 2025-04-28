package com.example.hospital.controller;

import com.example.hospital.dto.RoomDTO;
import com.example.hospital.model.Department;
import com.example.hospital.model.Room;
import com.example.hospital.repository.DepartmentRepository;
import com.example.hospital.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomDTO roomDTO) {
        try {
            Department department = departmentRepository.findById(roomDTO.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));

            Room room = new Room();
            room.setNumber(roomDTO.getNumber());
            room.setStatus(roomDTO.getStatus());
            room.setDepartment(department);

            Room savedRoom = roomService.createRoom(room);

            return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        try {
            Department department = departmentRepository.findById(roomDTO.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));

            Room updatedRoom = roomService.updateRoom(id, roomDTO, department);

            return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
