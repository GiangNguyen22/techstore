package com.example.techstore.repository;

import com.example.techstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String keyword, String keyword1);


}
