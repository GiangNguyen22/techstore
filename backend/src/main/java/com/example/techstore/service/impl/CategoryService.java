package com.example.techstore.service.impl;

import com.example.techstore.entity.Category;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService  {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }


    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        category.setId(null);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category, Integer categoryId) {
        Category category1 = categoryRepository.findById(categoryId).orElseThrow(()-> new ResourceNotFoundEx("Category not found with id " + categoryId));
        if(category.getName() != null) {
            category1.setName(category.getName());
        }
        return categoryRepository.save(category1);
    }

    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(()-> new ResourceNotFoundEx("Category not found with id " + categoryId)) ;
        categoryRepository.deleteById(categoryId);
    }
}
