package com.example.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserToken {
    private String token;
    private String email;
    private String role;  // thêm để phân quyền FE
    private String refreshToken;
}
