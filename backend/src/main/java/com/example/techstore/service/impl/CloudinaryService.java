package com.example.techstore.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public Map upLoadFile(MultipartFile file) {
        try {
            return cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "products")); // cố định folder "products"
        } catch (IOException e) {
            throw new RuntimeException("Upload product image failed", e);
        }
    }
}
