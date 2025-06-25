package com.example.techstore.exceptions;

public class ProductDeleteException extends RuntimeException {
    public ProductDeleteException(String message) {
        super(message);
    }
}
