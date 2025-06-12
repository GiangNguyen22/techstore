package com.example.techstore.repository;

import com.example.techstore.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
        Optional<Cart> findByUserId(Integer userId);
}
