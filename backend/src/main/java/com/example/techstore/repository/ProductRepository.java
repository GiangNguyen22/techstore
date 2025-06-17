package com.example.techstore.repository;

import com.example.techstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String keyword, String keyword1);


    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    @Query(value = """
                SELECT p.* FROM product p
                JOIN order_details od ON od.product_id = p.id
                JOIN orders o ON o.id = od.order_id
                WHERE o.order_date >= :last7Days
                GROUP BY p.id
                ORDER BY SUM(od.quantity) DESC
                LIMIT 10
            """, nativeQuery = true)
    List<Product> getTop10BestSellingProducts(LocalDateTime last7Days);

    List<Product> findByNameContainingIgnoreCase(String keyword);
}
