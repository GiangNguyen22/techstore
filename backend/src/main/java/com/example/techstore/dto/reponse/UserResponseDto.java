package com.example.techstore.dto.reponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
         private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
}
