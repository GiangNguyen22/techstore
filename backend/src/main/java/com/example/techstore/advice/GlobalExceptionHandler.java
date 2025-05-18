package com.example.techstore.advice;

import com.example.techstore.exceptions.ResourceNotFoundEx;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundEx.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundEx ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", 404);
        error.put("error", "Not Found");
        error.put("message", ex.getMessage()); // Đây là "Cart Not Found!"
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
