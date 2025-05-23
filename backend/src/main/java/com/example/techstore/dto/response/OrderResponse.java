package com.example.techstore.dto.response;

import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private int orderId;
    private PaymentMethod paymentMethod;
    private OrderStatus orderStatus;
    private String paymentUrl; //dùng cho thanh toán VNPAY
}
