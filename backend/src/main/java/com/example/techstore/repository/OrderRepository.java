package com.example.techstore.repository;

import com.example.techstore.entity.Orders;
import com.example.techstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUserId(int userId);

    @Query("SELECT o FROM Orders o WHERE LOWER(o.user.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Orders> searchByCustomerName(@Param("customerName") String customerName);

    @Query("SELECT count(o.id) FROM Orders o WHERE o.orderDate >= :last7Days")
    Integer getTotalOrderLast7Days(@Param("last7Days") LocalDateTime last7Days);

    List<Orders> findByOrderDateAfter(LocalDateTime last7Days);
}
