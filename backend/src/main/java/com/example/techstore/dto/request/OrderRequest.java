package com.example.techstore.dto.request;

import com.example.techstore.entity.OrderDetails;
import com.example.techstore.enums.PaymentMethod;
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
public class OrderRequest {
    private int userId;
    private String address;
    private String phone;
    private PaymentMethod paymentMethod;
    private List<OrderDetailRequest> orderDetailRequests;
    private BigDecimal totalAmount;

}
