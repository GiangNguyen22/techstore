package com.example.techstore.repository;

import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import com.example.techstore.entity.UserRole;
public interface UserRoleRepository extends JpaAttributeConverter<UserRole, Integer> {
    // Define any custom query methods if needed
    
}
