package com.example.techstore.mapper;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.dto.ProductResourceDto;
import com.example.techstore.dto.ProductVariantDto;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductResource;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.repository.CartItemRepository;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.service.impl.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CartItemRepository cartItemRepository;
    public ProductDto mapToProductDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        if (product.getCategory() != null) {
            productDto.setCategoryId(product.getCategory().getId());
        }
        if(product.getResources() != null) {
            productDto.setResources(mapToProductResourceDtoList(product.getResources()));
        }
        if(product.getVariants() != null) {
            productDto.setVariants(mapToProductVariantDtoList(product.getVariants()));
        }
        return productDto;
    }

    public void updateProductEntityFromDto(ProductDto productDto, Product product) {
        // Update các trường thường
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setType(productDto.getType());
        product.setCompanyName(productDto.getCompanyName());
        System.out.println("Old Thumbnail: " + product.getThumbnail());
        System.out.println("New Thumbnail: " + productDto.getThumbnail());
        product.setThumbnail(productDto.getThumbnail());


        // Update category
        Category category = categoryService.getCategoryById(productDto.getCategoryId());
        if (category != null) {
            product.setCategory(category);
        }

        // Update variants
        if (productDto.getVariants() != null) {
            List<ProductVariantDto> variantDtos = productDto.getVariants();

            // Lấy list các id biến thể mới
            List<Integer> newVariantIds = variantDtos.stream()
                    .map(ProductVariantDto::getId)
                    .filter(id -> id != null)
                    .toList();

            // Xóa biến thể cũ không nằm trong danh sách mới (dựa vào id)
            product.getVariants().removeIf(variant ->
                    variant.getId() != null && !newVariantIds.contains(variant.getId())
            );

            // Cập nhật hoặc thêm mới từng biến thể
            for (ProductVariantDto variantDto : variantDtos) {
                if (variantDto.getId() != null) {
                    // Cập nhật biến thể đã tồn tại
                    product.getVariants().stream()
                            .filter(v -> v.getId().equals(variantDto.getId()))
                            .findFirst()
                            .ifPresent(existingVariant -> {
                                existingVariant.setColor(variantDto.getColor());
                                existingVariant.setSize(variantDto.getSize());
                                existingVariant.setStockQuantity(variantDto.getStockQuantity());
                            });
                } else {
                    // Thêm biến thể mới
                    ProductVariant newVariant = new ProductVariant();
                    newVariant.setColor(variantDto.getColor());
                    newVariant.setSize(variantDto.getSize());
                    newVariant.setStockQuantity(variantDto.getStockQuantity());
                    newVariant.setProduct(product);
                    product.getVariants().add(newVariant);
                }
            }
        }

        // Cập nhật resources tương tự nếu cần
        if (productDto.getResources() != null) {
            List<ProductResource> newResources = mapToProductResources(productDto.getResources(), product);
            product.getResources().clear();
            product.getResources().addAll(newResources);
        }
    }
    public void deleteOrphanVariants(Product product, List<ProductVariantDto> variantDtos) {
        List<Integer> variantIdsInDto = variantDtos.stream()
                .map(ProductVariantDto::getId)
                .filter(id -> id != null)
                .toList();

        List<ProductVariant> toRemove = product.getVariants().stream()
                .filter(v -> v.getId() != null && !variantIdsInDto.contains(v.getId()))
                .toList();

        for (ProductVariant variant : toRemove) {
            // Kiểm tra trong cartItemRepository xem có cartItems dùng variant này không
            boolean isInCart = cartItemRepository.existsByProductVariantId(variant.getId());
            if (!isInCart) {
                product.getVariants().remove(variant);
            } else {
                // Hoặc báo lỗi, hoặc giữ lại
                // Ví dụ throw new RuntimeException("Không thể xóa variant đang có trong giỏ hàng");
            }
        }
    }

    public List<ProductDto> getProductDtoList(List<Product> products) {
        return products.stream().map(this::mapToProductDto).toList();
    }

    public List<ProductVariantDto> mapToProductVariantDtoList(List<ProductVariant> productVariants) {
        return productVariants.stream().map(this::mapToVariantDto).toList();
    }

    private ProductVariantDto mapToVariantDto(ProductVariant productVariant) {
        ProductVariantDto productVariantDto = modelMapper.map(productVariant, ProductVariantDto.class);
        productVariantDto.setProductId(productVariant.getProduct().getId());
        return productVariantDto;
    }

    public List<ProductResourceDto> mapToProductResourceDtoList(List<ProductResource> productResources) {
        return productResources.stream().map(this::mapToResourceDto).toList();
    }

    private ProductResourceDto mapToResourceDto(ProductResource productResources) {
        ProductResourceDto productResourceDto = modelMapper.map(productResources, ProductResourceDto.class);
        productResourceDto.setProductId(productResources.getProduct().getId());
        return productResourceDto;
    }

    public Product mapToProductEntity(ProductDto productDto) {
        Product product = modelMapper.map(productDto, Product.class);
        product.setThumbnail(productDto.getThumbnail());
        Category category = categoryService.getCategoryById(productDto.getCategoryId());


        if(category != null) {
            product.setCategory(category);
        }
        if(productDto.getVariants() != null) {
            product.setVariants(mapToProductVariant(productDto.getVariants(), product));
        }

        if(productDto.getResources() != null) {
            product.setResources(mapToProductResources(productDto.getResources(), product));
        }
        return product;

    }

    private List<ProductResource> mapToProductResources(List<ProductResourceDto> resources, Product product) {
        return resources.stream().map(productResourceDto -> {
            ProductResource productResource = modelMapper.map(productResourceDto, ProductResource.class);
            if(productResourceDto.getId() != null) {
                productResource.setId(productResourceDto.getId());
            }
            productResource.setProduct(product);
            return productResource;
        }).toList();
    }

    private List<ProductVariant> mapToProductVariant(List<ProductVariantDto> variants, Product product) {
        return variants.stream().map(productVariantDto -> {
            ProductVariant productVariant = modelMapper.map(productVariantDto, ProductVariant.class);
            if(productVariantDto.getId() != null) {
                productVariant.setId(productVariantDto.getId());
            }
            productVariant.setProduct(product);
            return productVariant;
        }).toList();
    }


}