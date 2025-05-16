package com.example.techstore.repository;

import com.example.techstore.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    Page<Product> findAll(Pageable pageable);
}
