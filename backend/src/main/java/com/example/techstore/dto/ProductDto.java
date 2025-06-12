package com.example.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String status;
    private String thumbnail;
    private String type;
    private String companyName;
    private Integer categoryId;
    private List<ProductVariantDto> variants;
    private List<ProductResourceDto> resources;
}
