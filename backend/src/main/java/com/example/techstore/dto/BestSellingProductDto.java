package com.example.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BestSellingProductDto {
    private Long productId;
    private String name;
    private Long sold;
}