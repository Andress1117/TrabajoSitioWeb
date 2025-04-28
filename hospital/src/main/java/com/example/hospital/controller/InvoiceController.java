package com.example.hospital.controller;

import com.example.hospital.dto.InvoiceDTO;
import com.example.hospital.model.Invoice;
import com.example.hospital.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5500")  // Asegúrate de que el frontend esté configurado con esta URL
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        try {
            Invoice savedInvoice = invoiceService.saveInvoice(invoiceDTO);
            return new ResponseEntity<>(savedInvoice, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Otros métodos CRUD (Get, Update, Delete) si es necesario
}
