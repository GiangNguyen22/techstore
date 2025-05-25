package com.example.techstore.service.impl;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.mapper.ProductMapper;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.service.ProductService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public boolean isAvailable(Product product) {
        return product.getStockQuantity() > 0;
    }

    @Override
    public List<ProductDto> getAllProducts(Integer categoryId) {
        List<Product> products;
        if(categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElseThrow(()-> new ResourceNotFoundEx("Category not found width "+ categoryId));
            products = productRepository.findByCategoryId(category.getId());
        }else{
            products = productRepository.findAll();
        }

        return products.stream().map(product -> {
            ProductDto productDto = productMapper.mapToProductDto(product);
            productDto.setResources(productMapper.mapToProductResourceDtoList(product.getResourceList()));
            productDto.setVariants(productMapper.mapToProductVariantDtoList(product.getVariantList()));
            return productDto;
        }).toList();
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product not found width id: "+ id));
        return productMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> searchProductsByKey(String keyword) {
        // Ví dụ dùng repository truy vấn database với like '%keyword%'
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        return productMapper.getProductDtoList(products);
    }

    @Override
    public Product fetchProductById(int productId) throws Exception {
        return productRepository.findById(productId).orElseThrow(BadRequestException::new);
    }

    @Override
    public Product addProduct(ProductDto productDto, MultipartFile file) {
        Product product = productMapper.mapToProductEntity(productDto);
        Map uploadResult = cloudinaryService.upLoadFile(file);
        String thumbnail = (String) uploadResult.get("secure_url");
        product.setThumbnail(thumbnail);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(ProductDto productDto, MultipartFile file, Integer id) {
        Product product = productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product not found "));
        productDto.setId(product.getId());
        return productRepository.save(productMapper.mapToProductEntity(productDto));
    }

    @Override
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product not found width id: "+ id));
        productRepository.deleteById(product.getId());
    }



}
