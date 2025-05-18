package com.example.techstore.service;


import com.example.techstore.dto.CartDto;
import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.entity.Cart;
import com.example.techstore.entity.CartItems;

public interface CartService {
    CartDto viewCart(Integer userId);

    Cart addToCart(AddToCartRequest request);

    CartDto removeFromCart(Integer cartItemId);

    void updateCartItemQuantity(Integer cartItemId, Integer quantity);
}
