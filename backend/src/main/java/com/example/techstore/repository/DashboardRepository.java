package com.example.techstore.repository;

import com.example.techstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface DashboardRepository extends JpaRepository<User, Integer> {

    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN Orders o ON o.user = u " +
            "WHERE u.isActive = true AND u.createdAt >= :sevenDaysAgo")
    int countCustomers(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    @Query("SELECT COUNT(o) FROM Orders o WHERE o.orderDate >= :sevenDaysAgo")
    int countOrdersLast7Days(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity > 0")
    int countStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity = 0")
    int countOutOfStock();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paidAt >= :sevenDaysAgo")
    int totalBenefit(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);
}
