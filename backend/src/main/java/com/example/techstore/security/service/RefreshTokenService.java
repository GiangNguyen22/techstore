package com.example.techstore.security.service;

import com.example.techstore.entity.RefreshToken;
import com.example.techstore.entity.User;
import com.example.techstore.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh.expiration}")  // Thời gian sống của refresh token (giây)
    private Long refreshTokenDurationSec;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    // Tạo refresh token mới cho user
//    public RefreshToken createRefreshToken(User user) {
//        RefreshToken refreshToken = new RefreshToken();
//        refreshToken.setUser(user);
//        refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshTokenDurationSec));
//        refreshToken.setToken(UUID.randomUUID().toString());
//        return refreshTokenRepository.save(refreshToken);
//    }
    public RefreshToken createRefreshToken(User user) {
        // Xóa hết refresh token cũ của user (nếu có)
        refreshTokenRepository.deleteByUser(user);

        // Tạo token mới
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshTokenDurationSec));
        refreshToken.setToken(UUID.randomUUID().toString());

        // Lưu và trả về
        return refreshTokenRepository.save(refreshToken);
    }


    // Tìm refresh token theo chuỗi token
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // Kiểm tra token có hết hạn chưa
    public boolean isTokenExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    // Xóa hết refresh token của user (ví dụ khi logout)
    public int deleteByUser(User user) {
        return refreshTokenRepository.deleteByUser(user);
    }
}
