
package com.example.techstore.service.impl;

import com.example.techstore.entity.Product;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class productServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getTop10Products() {
        // Lấy 10 sản phẩm đầu tiên
        Pageable top10 = PageRequest.of(0, 10);
        return productRepository.findAll(top10).getContent();
    }
}
