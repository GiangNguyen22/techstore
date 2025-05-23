package com.example.techstore.dto.reponse;

import java.math.BigDecimal;
import java.util.List;

import com.example.techstore.dto.BestSellingProductDto;
import com.example.techstore.dto.MonthlyRevenueDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOverviewResponse {
        private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;
    private Long pendingOrders;
    private List<BestSellingProductDto> bestSellingProducts;
    private List<MonthlyRevenueDto> monthlyRevenue;
}
