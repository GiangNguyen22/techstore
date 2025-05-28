package com.example.techstore.dto;

import com.example.techstore.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDto {
    private Integer paymentId;
    private String customerName;
    private LocalDate paymentDate;
    private String paymentStatus;
    private BigDecimal amount;

}
