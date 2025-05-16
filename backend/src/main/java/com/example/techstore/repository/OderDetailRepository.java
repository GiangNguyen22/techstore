package com.example.techstore.repository;
import com.example.techstore.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface OderDetailRepository extends JpaRepository<OrderDetails, Integer> {
    // Define any custom query methods if needed
}