package com.example.techstore.dto.reponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;
import com.example.techstore.dto.reponse.RecentOrderDto;
import com.fasterxml.jackson.annotation.JsonFormat;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailDto {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String email;
    private String phone;
    private String address;
    private String role;
    private Integer isActive;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
