package com.example.techstore.repository;

import com.example.techstore.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paidAt >= :sevenDaysAgo")
    Double getTotalSaleLast7Days(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

}
