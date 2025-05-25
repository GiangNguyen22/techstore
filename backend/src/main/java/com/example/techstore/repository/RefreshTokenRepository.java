package com.example.techstore.repository;

import com.example.techstore.entity.RefreshToken;
import com.example.techstore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying // chỉ áp dụng được trên method repository.
    @Transactional //nên áp dụng trên service hoặc method repository.
                    //Thêm 2 annotation @Modifying và @Transactional cho method deleteByUser
                      // để câu lệnh xóa hoạt động chính xác.
    int deleteByUser(User user);
}
