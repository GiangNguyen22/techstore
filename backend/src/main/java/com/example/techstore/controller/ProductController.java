package com.example.techstore.controller;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.entity.Product;
import com.example.techstore.service.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

    @Autowired
    private ProductService productService;

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

    @GetMapping("/best-selling")
    public List<TopProductResponse> getTopProducts() {
        return productService.getTopProducts();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<Product> products = productService.filterByPrice(minPrice, maxPrice);
        return ResponseEntity.ok(products);
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



    @PostMapping("/upload-thumbnail")
    public ResponseEntity<String> uploadThumbnail(@RequestPart("file") MultipartFile file) {
        String thumbnailUrl = productService.saveThumbnail(file);
        return ResponseEntity.ok(thumbnailUrl); // Trả về URL ảnh
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
         productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

}
