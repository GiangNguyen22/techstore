package com.example.techstore.service.impl;

import com.example.techstore.entity.Category;
import com.example.techstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService  {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }
}
