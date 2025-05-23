package com.example.techstore.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.techstore.dto.reponse.RevenueResponse;
import java.util.List;
public interface RevenueService {
     public List<RevenueResponse> getRevenueByPeriod(String periodType, 
                                                   LocalDate startDate, 
                                                   LocalDate endDate);
}
