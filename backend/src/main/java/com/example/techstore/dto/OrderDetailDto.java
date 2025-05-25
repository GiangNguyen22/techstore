package com.example.techstore.dto;

import com.example.techstore.entity.Product;
import com.example.techstore.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDto {
    private int id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String productName;
    private int productVariantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private OrderStatus orderStatus;
}
