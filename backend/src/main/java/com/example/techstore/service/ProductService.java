package com.example.techstore.service;

import com.example.techstore.entity.Product;
import java.util.List;
public interface ProductService {
    List<Product> getTop10Products();
}
