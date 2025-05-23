package com.example.techstore.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.techstore.entity.Orders;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    // Theo ngày - sử dụng native query với MySQL
    @Query(value = "SELECT " +
           "DATE_FORMAT(order_date, '%Y-%m-%d') as period, " +
           "SUM(total_amount) as totalRevenue, " +
           "COUNT(id) as totalOrders " +
           "FROM orders " +
           "WHERE order_date BETWEEN :start AND :end " +
           "GROUP BY DATE_FORMAT(order_date, '%Y-%m-%d')", 
           nativeQuery = true)
    List<Object[]> findDailyRevenue(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);
    
    // Theo tháng
    @Query(value = "SELECT " +
           "DATE_FORMAT(order_date, '%Y-%m') as period, " +
           "SUM(total_amount) as totalRevenue, " +
           "COUNT(id) as totalOrders " +
           "FROM orders " +
           "WHERE order_date BETWEEN :start AND :end " +
           "GROUP BY DATE_FORMAT(order_date, '%Y-%m')",
           nativeQuery = true)
    List<Object[]> findMonthlyRevenue(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
    
    // Theo năm
    @Query(value = "SELECT " +
           "DATE_FORMAT(order_date, '%Y') as period, " +
           "SUM(total_amount) as totalRevenue, " +
           "COUNT(id) as totalOrders " +
           "FROM orders " +
           "WHERE order_date BETWEEN :start AND :end " +
           "GROUP BY DATE_FORMAT(order_date, '%Y')",
           nativeQuery = true)
    List<Object[]> findYearlyRevenue(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);
}