package com.example.techstore.security.repository;

import com.example.techstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}
