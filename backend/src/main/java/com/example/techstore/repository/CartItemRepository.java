package com.example.techstore.repository;

import com.example.techstore.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItems, Integer> {
    CartItems findByCartIdAndProductVariantId(Integer id, Integer id1);
}
