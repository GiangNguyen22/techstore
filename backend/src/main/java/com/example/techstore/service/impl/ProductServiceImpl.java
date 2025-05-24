package com.example.techstore.service.impl;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.mapper.ProductMapper;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public boolean isAvailable(Product product) {
        return product.getStockQuantity() > 0;
    }

    @Override
    public List<ProductDto> getAllProducts(Integer categoryId) {
        List<Product> products;
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundEx("Category not found with id " + categoryId));
            products = productRepository.findByCategoryId(category.getId());
        } else {
            products = productRepository.findAll();
        }
        return products.stream()
                .map(productMapper::mapToProductDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product not found with id: " + id));
        return productMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> searchProductsByKey(String keyword) {
        List<Product> products = productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        return productMapper.getProductDtoList(products);
    }

    @Override
    public Product addProduct(ProductDto productDto) {
        Product product = productMapper.mapToProductEntity(productDto);

        // Gán ngược product vào variant và resource
        if (product.getVariants() != null) {
            product.getVariants().forEach(variant -> variant.setProduct(product));
        }
        if (product.getResources() != null) {
            product.getResources().forEach(resource -> resource.setProduct(product));
        }

        return productRepository.save(product);
    }


    @Override
    public Product updateProduct(ProductDto productDto, Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product not found with id " + id));

        productMapper.updateProductEntityFromDto(productDto, product);

        // Gán lại mối quan hệ ngược
        if (product.getVariants() != null) {
            product.getVariants().forEach(variant -> variant.setProduct(product));
        }

        if (product.getResources() != null) {
            product.getResources().forEach(resource -> resource.setProduct(product));
        }

        return productRepository.save(product);
    }


    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundEx("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
