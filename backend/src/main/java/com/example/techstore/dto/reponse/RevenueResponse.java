package com.example.techstore.dto.reponse;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    private String period;       // Chuỗi đại diện cho khoảng thời gian (vd: "2024-01-01", "2024-01", "2024")
    private BigDecimal totalRevenue; // Tổng doanh thu
    private Long totalOrders;    // Tổng số đơn hàng
    
    // Có thể thêm các trường khác nếu cần
    // private LocalDate startDate; // Ngày bắt đầu (tuỳ chọn)
    // private LocalDate endDate;   // Ngày kết thúc (tuỳ chọn)

        // Constructor for Daily Revenue (String for period, BigDecimal, Long)


    // You might want other constructors if your period type varies (e.g., LocalDate for daily)
    // For example, if you wanted LocalDate for daily:
    // public RevenueResponse(LocalDate period, BigDecimal totalRevenue, Long totalOrders) {
    //     this.period = period.toString(); // Convert LocalDate to String for common field
    //     this.totalRevenue = totalRevenue;
    //     this.totalOrders = totalOrders;
    // }

    // Getters and setters
    // public RevenueResponse(String period, BigDecimal totalRevenue, Long totalOrders) {
    //     this.period = period;
    //     this.totalRevenue = totalRevenue;
    //     this.totalOrders = totalOrders;
    // }
    // public String getPeriod() {
    //     return period;
    // }
    // public void setPeriod(String period) {
    //     this.period = period;
    // }
    // public BigDecimal getTotalRevenue() {
    //     return totalRevenue;
    // }
    // public void setTotalRevenue(BigDecimal totalRevenue) {
    //     this.totalRevenue = totalRevenue;
    // }
    // public Long getTotalOrders() {
    //     return totalOrders;
    // }
    // public void setTotalOrders(Long totalOrders) {
    //     this.totalOrders = totalOrders;
    // }
    // public LocalDate getStartDate() {
    //     return startDate;
    // }
    // public void setStartDate(LocalDate startDate) {
    //     this.startDate = startDate;
    // }
    // public LocalDate getEndDate() {
    //     return endDate;
    // }

}