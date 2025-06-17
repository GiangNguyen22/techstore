package com.example.techstore.service.impl;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.mapper.ProductMapper;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.service.ProductService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Value("${thumbnail.upload.dir}")
    private String thumbnailUploadDir;

    @Override
    public boolean isAvailable(Product product) {
        return product.getStockQuantity() > 0;
    }

    @Override
    public List<ProductDto> getAllProducts(Integer categoryId) {
        List<Product> products;
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundEx("Category not found width " + categoryId));
            products = productRepository.findByCategoryId(category.getId());
        } else {
            products = productRepository.findAll();
        }

        return products.stream().map(product -> {
            ProductDto productDto = productMapper.mapToProductDto(product);
            productDto.setStatus(product.getStockQuantity() == 0 ? "Out of Stock" : "Active");
            productDto.setResources(productMapper.mapToProductResourceDtoList(product.getResources()));
            productDto.setVariants(productMapper.mapToProductVariantDtoList(product.getVariants()));
            return productDto;
        }).toList();
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundEx("Product not found width id: " + id));
        return productMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> searchProductsByKey(String keyword) {
        // Ví dụ dùng repository truy vấn database với like '%keyword%'
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        return productMapper.getProductDtoList(products);
    }

    @Override
    public Product fetchProductById(int productId) throws Exception {
        return productRepository.findById(productId).orElseThrow(BadRequestException::new);
    }

    @Override
    public List<Product> filterByPrice(Double minPrice, Double maxPrice) {
        if (minPrice == null) minPrice = 0.0;
        if (maxPrice == null) maxPrice = Double.MAX_VALUE;

        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    //lấy 10 product bán chạy nhất tuần
    @Override
    public List<TopProductResponse> getTopProducts() {
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        List<Product> productList = productRepository.getTop10BestSellingProducts(last7Days);

        return productList.stream().map(product -> {
            return TopProductResponse.builder()
                    .name(product.getName())
                    .thumbnail(product.getThumbnail())
                    .price(product.getPrice())
                    .build();
        }).toList();
    }

    @Override
    public ProductVariant fetchProductVariantById(int variantId) throws Exception {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundEx("Product variant not found with id: " + variantId));
    }

    @Override
    public ProductVariant saveProductVariant(ProductVariant variant) {
        return productVariantRepository.save(variant);
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

        // Thumbnail đã có sẵn trong productDto (từ frontend đã upload)
        product.setThumbnail(productDto.getThumbnail());

        return productRepository.save(product);
    }


    @Override
    public Product updateProduct(ProductDto productDto, Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product not found"));

        // Giữ lại ID cũ và cập nhật dữ liệu mới
        productDto.setId(product.getId());
        productMapper.updateProductEntityFromDto(productDto, product);

        // Cập nhật thumbnail nếu cần
        product.setThumbnail(productDto.getThumbnail());

        // Gán lại mối quan hệ ngược
        if (product.getVariants() != null) {
            product.getVariants().forEach(variant -> variant.setProduct(product));
        }

        if (product.getResources() != null) {
            product.getResources().forEach(resource -> resource.setProduct(product));
        }

        return productRepository.save(product);
    }


    //    @Override
//    public String saveThumbnail(MultipartFile file) {
//        if (file.isEmpty()) throw new RuntimeException("File is empty");
//
//        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//        Path uploadDir = Paths.get(thumbnailUploadDir);  // Dùng cấu hình
//
//        try {
//            if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
//            Path filePath = uploadDir.resolve(fileName);
//            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to save image", e);
//        }
//
//        // Giả sử bạn cấu hình resource mapping tại /images/**
//        return "/images/" + fileName;
//    }
    @Override
    public String saveThumbnail(MultipartFile file) {
        if (file.isEmpty()) throw new RuntimeException("File is empty");

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get(thumbnailUploadDir);

        try {
            if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }

        // Trả về URL để FE load trực tiếp
        return "/images/" + fileName;
    }


    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundEx("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }


}
