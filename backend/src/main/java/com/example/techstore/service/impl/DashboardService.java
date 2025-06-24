package com.example.techstore.service.impl;

import com.example.techstore.dto.DashboardStats;
import com.example.techstore.repository.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DashboardService {
    @Autowired
    private DashboardRepository repo;

    public DashboardStats getStatsThisWeek() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        return DashboardStats.builder()
                .customers(repo.countCustomers(sevenDaysAgo))
                .totalProducts(repo.countOrdersLast7Days(sevenDaysAgo))
                .stockProducts(repo.countStockProducts())
                .outOfStock(repo.countOutOfStock())
                .benefit(repo.totalBenefit(sevenDaysAgo))
                .build();
    }
}
