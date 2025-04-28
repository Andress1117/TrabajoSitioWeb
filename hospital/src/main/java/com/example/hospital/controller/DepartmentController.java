package com.example.hospital.controller;

import com.example.hospital.dto.DepartmentDTO;
import com.example.hospital.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*") // Permitir frontend local (localhost)
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    // Método para obtener todos los departamentos (para el select del frontend)
    @GetMapping
    public List<DepartmentDTO> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // Método para crear un departamento
    @PostMapping
    public DepartmentDTO createDepartment(@RequestBody DepartmentDTO departmentDTO) {
        return departmentService.createDepartment(departmentDTO);
    }

    // Método para actualizar un departamento por su ID
    @PutMapping("/{departmentId}")
    public DepartmentDTO updateDepartment(@PathVariable Long departmentId, @RequestBody DepartmentDTO departmentDTO) {
        return departmentService.updateDepartment(departmentId, departmentDTO);
    }

    // Método para eliminar un departamento por su ID
    @DeleteMapping("/{departmentId}")
    public void deleteDepartment(@PathVariable Long departmentId) {
        departmentService.deleteDepartment(departmentId);
    }
}
