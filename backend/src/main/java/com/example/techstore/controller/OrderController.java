package com.example.techstore.controller;

import com.example.techstore.dto.request.OrderRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.entity.Orders;
import com.example.techstore.service.impl.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    private  OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Principal principal, HttpServletRequest httpServletRequest) throws Exception {
        OrderResponse orderResponse = orderService.createOrder(request, principal, httpServletRequest);
            return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

}
