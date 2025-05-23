package com.example.techstore.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.techstore.dto.BestSellingProductDto;
import com.example.techstore.dto.MonthlyRevenueDto;
import com.example.techstore.entity.Orders;
import java.util.List;
public interface AdminDashboardRepository extends JpaRepository<Orders, Long> {
    
    // Tổng doanh thu từ đơn hàng đã hoàn thành
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Orders o WHERE o.status IN ('completed', 'delivered')")
    BigDecimal getTotalRevenue();
    
    //Tong Orders
    @Query("SELECT COUNT(o) FROM Orders o ")
    Long getTotalOrders();

    //Tong Users
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = 'USER'")
    Long getTotalUsers();

    //Tong Products
    @Query("select count(p) from Product p")
    Long getTotalProducts();

    //Don hang dang xu ly
    @Query("select count(o) from Orders o where o.status in ('pending', 'processing')")
    Long getTotalPendingOrders();

        // Đơn hàng đang chờ xử lý
    @Query("SELECT COUNT(o) FROM Orders o WHERE o.status IN ('pending', 'processing')")
    Long getPendingOrders();
    
    // Top 5 sản phẩm bán chạy
    // @Query(value = """
    //     SELECT new com.techstore.dto.response.BestSellingProductDto(
    //         p.id, 
    //         p.name, 
    //         COALESCE(SUM(od.quantity), 0)
    //     )
    //     FROM Product p 
    //     LEFT JOIN OrderDetails od ON p.id = od.product.id
    //     LEFT JOIN Orders o ON od.order.id = o.id AND o.status IN ('completed', 'delivered')
    //     GROUP BY p.id, p.name
    //     ORDER BY COALESCE(SUM(od.quantity), 0) DESC
    //     """)
    // List<Object[]> getBestSellingProducts();
        @Query("SELECT p.id, p.name, COALESCE(SUM(od.quantity), 0) as totalSold " +
           "FROM Product p " +
           "LEFT JOIN OrderDetails od ON p.id = od.product.id " +
           "LEFT JOIN Orders o ON od.order.id = o.id AND o.status IN ('completed', 'delivered') " +
           "GROUP BY p.id, p.name " +
           "ORDER BY COALESCE(SUM(od.quantity), 0) DESC")
    List<Object[]> getBestSellingProducts();
    
    // Doanh thu theo tháng (12 tháng gần nhất)
    // @Query(value = """
    //     SELECT new com.techstore.dto.response.MonthlyRevenueDto(
    //         FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m'),
    //         COALESCE(SUM(o.totalAmount), 0)
    //     )
    //     FROM Orders o 
    //     WHERE o.status IN ('completed', 'delivered')
    //     AND o.orderDate >= FUNCTION('DATE_SUB', CURRENT_DATE, 12, 'MONTH')
    //     GROUP BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m')
    //     ORDER BY FUNCTION('DATE_FORMAT', o.orderDate, '%Y-%m') ASC
    //     """)
    // List<Object[]> getMonthlyRevenue();
    
       @Query(value = "SELECT DATE_FORMAT(o.order_date, '%Y-%m') as month, " +
                   "COALESCE(SUM(o.total_amount), 0) as revenue " +
                   "FROM orders o " +
                   "WHERE o.status IN ('completed', 'delivered') " +
                   "AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH) " +
                   "GROUP BY DATE_FORMAT(o.order_date, '%Y-%m') " +
                   "ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getMonthlyRevenue();
}
