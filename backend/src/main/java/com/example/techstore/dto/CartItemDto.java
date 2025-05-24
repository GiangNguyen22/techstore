package com.example.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDto {
    private Integer id;
    private Integer productId;
    private Integer productVariantId;
    private String productName;
    private String thumbnail;
    private String color;
    private String size;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;

    // Thêm trường tồn kho biến thể

    private Integer stockQuantity;

}
