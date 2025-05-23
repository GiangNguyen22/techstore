package com.example.techstore.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.example.techstore.dto.reponse.RevenueResponse;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.service.RevenueService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RevenueServiceImpl implements RevenueService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Override
    public List<RevenueResponse> getRevenueByPeriod(String periodType, 
                                                   LocalDate startDate, 
                                                   LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<Object[]> results = switch (periodType.toLowerCase()) {
            case "daily" -> orderRepository.findDailyRevenue(start, end);
            case "monthly" -> orderRepository.findMonthlyRevenue(start, end);
            case "yearly" -> orderRepository.findYearlyRevenue(start, end);
            default -> throw new IllegalArgumentException("Invalid period type: " + periodType);
        };
        
        return convertToRevenueResponses(results);
    }
    
    private List<RevenueResponse> convertToRevenueResponses(List<Object[]> results) {
        List<RevenueResponse> responses = new ArrayList<>();
        
        for (Object[] result : results) {
            String period = (String) result[0];
            BigDecimal totalRevenue = (BigDecimal) result[1];
            Long totalOrders = ((Number) result[2]).longValue();
            
            RevenueResponse response = new RevenueResponse(period, totalRevenue, totalOrders);
            responses.add(response);
        }
        
        return responses;
    }
}