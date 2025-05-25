package com.example.techstore.controller;

import com.example.techstore.service.impl.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> allParams) {
            String result = paymentService.handleVnPayReturn(allParams);
            if(result.equals("Successful payment")) {
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.badRequest().body(result);

    }
}
