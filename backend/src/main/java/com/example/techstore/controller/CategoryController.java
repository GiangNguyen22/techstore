package com.example.techstore.controller;

import com.example.techstore.entity.Category;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.service.impl.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable(name = "id") Integer categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        if(category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Category not found");
        }
        return ResponseEntity.ok(category);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categoryList = categoryService.getAllCategory();
        return new ResponseEntity<>(categoryList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category category1 = categoryService.createCategory(category);
        return new ResponseEntity<>(category1, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable(name = "id") Integer categoryId, @RequestBody Category category) {
        Category category1 = categoryService.updateCategory(category, categoryId);
        return new ResponseEntity<>(category1, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable(name = "id") Integer categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().build();
    }

}
