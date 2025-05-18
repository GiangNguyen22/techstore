package com.example.techstore.dto;

import com.example.techstore.entity.Role;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Integer id;
    private String name;
    private String dateOfBirth;
    private String email;
    private String roleId;
    private String phone;
    private String address;
    private Boolean isActive;
}
