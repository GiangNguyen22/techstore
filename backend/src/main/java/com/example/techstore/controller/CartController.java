package com.example.techstore.controller;

import com.example.techstore.dto.CartDto;
import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.dto.request.RemoveFromCartRequest;
import com.example.techstore.entity.Cart;
import com.example.techstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> viewCart(@PathVariable Integer userId){
        CartDto cartDto = cartService.viewCart(userId);
        return ResponseEntity.ok(cartDto);
    }

    @PostMapping("/items") // sau chỉnh lại tham số
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request){
        Cart cart = cartService.addToCart(request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    public ResponseEntity<CartDto> removeFromCart(@RequestBody RemoveFromCartRequest request){
       CartDto cartDto =  cartService.removeFromCart(request.getCartItemId());
        return ResponseEntity.ok(cartDto);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateProductQuantity(@PathVariable(name = "id") Integer cartItemId, @RequestBody Integer quantity){
            cartService.updateCartItemQuantity(cartItemId, quantity);
            return ResponseEntity.ok("Cart updated successfully");
    }
}
