package com.example.techstore.security.service;

import com.example.techstore.dto.request.RefreshTokenRequest;
import com.example.techstore.dto.response.AccessTokenResponse;
import com.example.techstore.entity.RefreshToken;
import com.example.techstore.entity.User;
import com.example.techstore.security.service.CustomUserDetailService;
import com.example.techstore.security.service.RefreshTokenService;
import com.example.techstore.config.JWTTokenHelper;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailService userDetailsService;
    private final JWTTokenHelper jwtTokenHelper;

    public AuthService(RefreshTokenService refreshTokenService,
                       CustomUserDetailService userDetailsService,
                       JWTTokenHelper jwtTokenHelper) {
        this.refreshTokenService = refreshTokenService;
        this.userDetailsService = userDetailsService;
        this.jwtTokenHelper = jwtTokenHelper;
    }

    public AccessTokenResponse refreshAccessToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token không hợp lệ!"));

        if (refreshTokenService.isTokenExpired(refreshToken)) {
            refreshTokenService.deleteByUser(refreshToken.getUser());
            throw new RuntimeException("Refresh token đã hết hạn, vui lòng đăng nhập lại!");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtTokenHelper.generateToken(user.getEmail(), user.getId());

        return new AccessTokenResponse(newAccessToken);
    }
}
