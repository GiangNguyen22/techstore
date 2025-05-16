package com.example.techstore.repository;

import com.example.techstore.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
 Optional<Role> findByCode(String code);
}
