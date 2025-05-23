package com.example.techstore.controller;



import com.example.techstore.entity.Product;
import com.example.techstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
      @Autowired
    private ProductService productService;

    @GetMapping("/top10")
    public List<Product> Top10Products() {
        return productService.getTop10Products();
    }
}
