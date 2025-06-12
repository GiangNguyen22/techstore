package com.example.techstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalOrderResponse {
    private int totalOrders;
    private int previousTotalOrders;
    private double percent;
}
