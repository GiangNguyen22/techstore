package com.example.techstore.repository;

import com.example.techstore.dto.reponse.UserDetailDto;
import com.example.techstore.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String username);
    Boolean existsByEmail(String email);
        @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR u.name LIKE %:search% OR u.email LIKE %:search%) " +
           "AND (:isActive IS NULL OR u.isActive = :isActive) " +
           "AND (:roleId IS NULL OR u.role.id = :roleId)")
    Page<User> findAllUsers(
        @Param("search") String search,
        @Param("isActive") Boolean isActive,
        @Param("roleId") Integer roleId,
        Pageable pageable
    );
@Query("SELECT u.id, u.name, u.dateOfBirth, u.email, u.phone, u.address, r.name, u.isActive, u.createdAt " +
           "FROM User u JOIN u.role r WHERE u.id = :id")
    List<Object[]> getInfoOneUser(@Param("id") Integer id);
    Optional<User> findById(Long id);
    
}
