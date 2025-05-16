package com.example.techstore.repository;

import com.example.techstore.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    // Define any custom query methods if needed
}
