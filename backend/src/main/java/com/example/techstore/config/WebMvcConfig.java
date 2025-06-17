package com.example.techstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Đường dẫn file system lưu ảnh uploads/images, cách khai báo phải đúng với folder bạn dùng
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:D:/Techstore/BE/techstore/backend/uploads/images/");
    }
}
