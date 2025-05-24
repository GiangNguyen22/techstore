package com.example.techstore.controller;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.entity.Product;
import com.example.techstore.service.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;
     @GetMapping("/top10")
    public List<Product> Top10Products() {
        return productService.getTop10Products();
    }


    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(@RequestParam(required = false) Integer categoryId) {
        List<ProductDto> productDtos = productService.getAllProducts(categoryId);
        return ResponseEntity.ok(productDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Integer id) {
        ProductDto productDto = productService.getProductById(id);
        return ResponseEntity.ok(productDto);
    }
//    @GetMapping
//    public ResponseEntity<List<ProductDto>> getProductsByCategory(@RequestParam Integer categoryId) {
//        List<ProductDto> productDtos = productService.findProductByCategory(categoryId);
//        return ResponseEntity.ok(productDtos);
//    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String keyword, HttpServletResponse response) {
        List<ProductDto> productList = productService.searchProductsByKey(keyword);
        response.setHeader("Content-Range", String.valueOf(productList.size()));
        return ResponseEntity.ok(productList);
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody ProductDto productDto) {
        Product product = productService.addProduct(productDto);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@RequestBody ProductDto productDto, @PathVariable Integer id) {
        Product product = productService.updateProduct(productDto, id);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
         productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

}
