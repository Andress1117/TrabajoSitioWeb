package com.example.hospital.service;

import com.example.hospital.dto.InvoiceDTO;
import java.util.List;

public interface InvoiceService {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    InvoiceDTO getInvoiceById(Long id);

    List<InvoiceDTO> getAllInvoices();

    InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO);

    void deleteInvoice(Long id);
}
