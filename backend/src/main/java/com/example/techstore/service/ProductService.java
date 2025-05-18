package com.example.techstore.service;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService{
    public boolean isAvailable(Product product);

    List<ProductDto> getAllProducts(Integer categoryId);

    Product addProduct(ProductDto productDto);

    Product updateProduct(ProductDto productDto, Integer id);

    ProductDto getProductById(Integer id);

    void deleteProduct(Integer id);

    List<ProductDto> searchProductsByKey(String keyword);

//    List<ProductDto> findProductByCategory(Integer categoryId);
}
