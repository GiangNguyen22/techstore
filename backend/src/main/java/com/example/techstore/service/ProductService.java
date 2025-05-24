package com.example.techstore.service;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.entity.Product;
import java.util.List;
public interface ProductService {
        public boolean isAvailable(Product product);

    List<ProductDto> getAllProducts(Integer categoryId);

    Product addProduct(ProductDto productDto);

    Product updateProduct(ProductDto productDto, Integer id);

    ProductDto getProductById(Integer id);

    void deleteProduct(Integer id);

    List<ProductDto> searchProductsByKey(String keyword);

    Product fetchProductById(int productId) throws Exception;
    List<Product> getTop10Products();
    List<Product> getAllProducts();
    Product getInforOneProduct(Integer id);
    Boolean deleteOneProduct(Integer id);
}
