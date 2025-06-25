package com.example.techstore.repository;

import com.example.techstore.entity.OrderDetails;
import com.example.techstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetails, Integer> {
    boolean existsByProduct(Product product);
}
