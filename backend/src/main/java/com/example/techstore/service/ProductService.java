package com.example.techstore.service;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface ProductService{
    public boolean isAvailable(Product product);

    List<ProductDto> getAllProducts(Integer categoryId);

    Product addProduct(ProductDto productDto);

    Product updateProduct(ProductDto productDto, Integer id);
    String saveThumbnail(MultipartFile file);

    ProductDto getProductById(Integer id);

    void deleteProduct(Integer id);

    List<ProductDto> searchProductsByKey(String keyword);

    Product fetchProductById(int productId) throws Exception;

    List<Product> filterByPrice(Double minPrice, Double maxPrice);

    List<TopProductResponse> getTopProducts();
    ProductVariant fetchProductVariantById(int variantId) throws Exception;
    ProductVariant saveProductVariant(ProductVariant variant);

//    List<ProductDto> findProductByCategory(Integer categoryId);
}
