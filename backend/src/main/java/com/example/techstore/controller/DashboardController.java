package com.example.techstore.controller;

import com.example.techstore.dto.DashboardStats;
import com.example.techstore.service.impl.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class DashboardController {
    @Autowired
    private DashboardService service;

    @GetMapping("/this-week")
    public DashboardStats getThisWeekStats() {
        return service.getStatsThisWeek();
    }
}
