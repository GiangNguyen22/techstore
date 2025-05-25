package com.example.techstore.controller;

import com.example.techstore.dto.OrderDetailDto;
import com.example.techstore.dto.request.OrderRequest;
import com.example.techstore.dto.request.UpdateOrderStatusRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.entity.Orders;
import com.example.techstore.service.impl.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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

    @GetMapping("/user")
    public ResponseEntity<List<OrderDetailDto>> getOrderByUser(Principal principal) {
        List<OrderDetailDto> orderDetailDtos = orderService.getOrderByUser(principal.getName());
        return new ResponseEntity<>(orderDetailDtos, HttpStatus.OK);
    }

    @PutMapping("/user/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestBody UpdateOrderStatusRequest request) {
        try {
            Orders updatedOrder = orderService.updateOrderStatus(orderId, request.getOrderStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id,Principal principal){
        orderService.cancelOrder(id,principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
