package com.example.techstore.mapper;

import com.example.techstore.dto.ProductDto;
import com.example.techstore.dto.ProductResourceDto;
import com.example.techstore.dto.ProductVariantDto;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductResource;
import com.example.techstore.entity.ProductVariant;
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

    public ProductDto mapToProductDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        if (product.getCategory() != null) {
            productDto.setCategoryId(product.getCategory().getId());
        }
        if(product.getResourceList() != null) {
            productDto.setResources(mapToProductResourceDtoList(product.getResourceList()));
        }
        if(product.getVariantList() != null) {
            productDto.setVariants(mapToProductVariantDtoList(product.getVariantList()));
        }
        return productDto;
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
        Category category = categoryService.getCategoryById(productDto.getCategoryId());
        if(category != null) {
            product.setCategory(category);
        }
        if(productDto.getVariants() != null) {
            product.setVariantList(mapToProductVariant(productDto.getVariants(), product));
        }

        if(productDto.getResources() != null) {
            product.setResourceList(mapToProductResources(productDto.getResources(), product));
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