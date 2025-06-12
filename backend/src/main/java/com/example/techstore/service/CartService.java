package com.example.techstore.service;


import com.example.techstore.dto.CartDto;
import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.entity.Cart;
import com.example.techstore.entity.CartItems;
import com.example.techstore.entity.User;

public interface CartService {
    CartDto viewCart(Integer userId);

    Cart addToCart(AddToCartRequest request, User user);

    CartDto removeFromCart(Integer cartItemId);
    void validateOwnership(Integer cartItemId, String username);

    void updateCartItemQuantity(Integer cartItemId, Integer quantity);
}
