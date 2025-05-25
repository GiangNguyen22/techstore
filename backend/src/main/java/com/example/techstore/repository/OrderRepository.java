package com.example.techstore.repository;

import com.example.techstore.entity.Orders;
import com.example.techstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUserId(int userId);
}
