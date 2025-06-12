package com.example.techstore.controller;

import com.example.techstore.dto.PaymentDto;
import com.example.techstore.dto.response.TotalSaleResponse;
import com.example.techstore.service.impl.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> paymentDtos = paymentService.getAllPayments();
        return new ResponseEntity<>(paymentDtos, HttpStatus.OK);
    }

    @GetMapping("/totals")
    public TotalSaleResponse getTotalSale() {
        return paymentService.getTotalSaleLast7Days();
    }

    @GetMapping("/vnpay-return")
    public void vnpayReturn(@RequestParam Map<String, String> allParams, HttpServletResponse response) throws IOException {
            String result = paymentService.handleVnPayReturn(allParams);
        if ("Successful payment".equals(result)) {
            response.sendRedirect("http://localhost:3000/payment-success");
        } else {
            response.sendRedirect("http://localhost:3000/payment-fail");
        }
    }
}
