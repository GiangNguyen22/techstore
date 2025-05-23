package com.example.techstore.service.impl;

import com.example.techstore.dto.BestSellingProductDto;
import com.example.techstore.dto.MonthlyRevenueDto;
import com.example.techstore.dto.reponse.DashboardOverviewResponse;
import com.example.techstore.dto.reponse.RevenueResponse;
import com.example.techstore.repository.AdminDashboardRepository;
import com.example.techstore.service.AdminDashboardService;
import com.example.techstore.dto.reponse.DashboardOverviewResponse;
import com.example.techstore.repository.AdminDashboardRepository;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class AdminDashboardServiceImpl implements AdminDashboardService {
    private final AdminDashboardRepository adminDashboardRepository;
    @Override
    public DashboardOverviewResponse getDashboardOverview() {
        DashboardOverviewResponse response = new DashboardOverviewResponse();
        response.setTotalRevenue(adminDashboardRepository.getTotalRevenue());
        response.setTotalOrders(adminDashboardRepository.getTotalOrders());
        response.setTotalUsers(adminDashboardRepository.getTotalUsers());
        response.setTotalProducts(adminDashboardRepository.getTotalProducts());
        response.setPendingOrders(adminDashboardRepository.getPendingOrders());
                // Lấy top 5 sản phẩm bán chạy
        response.setBestSellingProducts(
            convertToBestSellingProductDto(adminDashboardRepository.getBestSellingProducts())
                .stream()
                .limit(5)
                .toList()
        );
        
        // Lấy doanh thu theo tháng
        response.setMonthlyRevenue(convertToMonthlyRevenueDto(adminDashboardRepository.getMonthlyRevenue()));

        return response;
    }

    private List<BestSellingProductDto> convertToBestSellingProductDto(List<Object[]> results) {
        List<BestSellingProductDto> responses = new ArrayList<>();
        
        for (Object[] result : results) {
            Long productId = ((Number) result[0]).longValue();
            String name = (String) result[1];
            Long sold = ((Number) result[2]).longValue();
                       
            BestSellingProductDto response = new BestSellingProductDto(productId, name, sold);
            responses.add(response);
        }
        
        return responses;
    }

    private List<MonthlyRevenueDto> convertToMonthlyRevenueDto(List<Object[]> results){
        List<MonthlyRevenueDto> responses = new ArrayList<>();
        
        for(Object[] result : results){
            String month = (String) result[0];
             BigDecimal totalRevenue = (BigDecimal) result[1]; 
            
            MonthlyRevenueDto response = new MonthlyRevenueDto(month, totalRevenue);
            responses.add(response);
        }
        return responses;
    }
    // Implement the methods defined in the AdminDashboardService interface
    // This class will handle the business logic for the admin dashboar
    
}
