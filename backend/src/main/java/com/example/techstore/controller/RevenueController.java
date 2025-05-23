package com.example.techstore.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.techstore.dto.reponse.RevenueResponse;
import com.example.techstore.service.RevenueService;
import com.example.techstore.dto.reponse.ApiResponse;
import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RevenueResponse>>> getRevenue(
            @RequestParam String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<RevenueResponse> data = revenueService.getRevenueByPeriod(period, start, end);
        
        ApiResponse<List<RevenueResponse>> response = ApiResponse.<List<RevenueResponse>>builder()
                .success(true)
                .message("Revenue data retrieved successfully")
                .data(data)
                .build();

        return ResponseEntity.ok(response);
    }
}