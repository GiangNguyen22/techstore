package com.example.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStats {
        private int customers;
        private int totalProducts;
        private int stockProducts;
        private int outOfStock;
        private int benefit;

}
