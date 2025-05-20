package com.example.techstore.dto;

import com.example.techstore.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetailsDto {
    private Integer id;
    private String name;
    private String dateOfBirth;
    private String email;
    private Role role;
    private String phone;
    private String address;
}
