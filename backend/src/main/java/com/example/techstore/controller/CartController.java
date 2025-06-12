package com.example.techstore.controller;

import com.example.techstore.dto.CartDto;
import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.dto.request.RemoveFromCartRequest;
import com.example.techstore.entity.Cart;
import com.example.techstore.entity.User;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")  // cho phép React app truy cập
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;
//    @GetMapping("/{userId}")
//    public ResponseEntity<CartDto> viewCart(@PathVariable Integer userId){
//        CartDto cartDto = cartService.viewCart(userId);
//        return ResponseEntity.ok(cartDto);
//    }
@GetMapping
public ResponseEntity<CartDto> viewCart(Authentication authentication) {
    String username = authentication.getName(); // lấy từ JWT
    User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundEx("User not found"));
    CartDto cartDto = cartService.viewCart(user.getId());
    return ResponseEntity.ok(cartDto);
}

//    @PostMapping("/items") // sau chỉnh lại tham số
//    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request){
//        Cart cart = cartService.addToCart(request);
//        return ResponseEntity.ok(cart);
//    }
@PostMapping("/items")
public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request, Authentication authentication){
    String username = authentication.getName();
    User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ResourceNotFoundEx("User not found"));

    Cart cart = cartService.addToCart(request, user); // truyền User
    System.out.println("Add to cart called with productVariantId = " + request.getProductVariantId());

    return ResponseEntity.ok(cart);
}

//    @DeleteMapping
//    public ResponseEntity<CartDto> removeFromCart(@RequestBody RemoveFromCartRequest request){
//       CartDto cartDto =  cartService.removeFromCart(request.getCartItemId());
//        return ResponseEntity.ok(cartDto);
//    }
@DeleteMapping("/items/{cartItemId}")
public ResponseEntity<CartDto> removeFromCart(@PathVariable Integer cartItemId, Authentication authentication){
    String username = authentication.getName();
    cartService.validateOwnership(cartItemId, username); // kiểm tra quyền sở hữu

    CartDto cartDto = cartService.removeFromCart(cartItemId);
    return ResponseEntity.ok(cartDto);
}



//    @PutMapping("/items/{id}")
//    public ResponseEntity<?> updateProductQuantity(@PathVariable(name = "id") Integer cartItemId, @RequestBody Integer quantity){
//            cartService.updateCartItemQuantity(cartItemId, quantity);
//            return ResponseEntity.ok("Cart updated successfully");
//    }
@PutMapping("/items/{id}")
public ResponseEntity<?> updateProductQuantity(@PathVariable(name = "id") Integer cartItemId, @RequestBody Integer quantity, Authentication authentication){
    String username = authentication.getName();
    cartService.validateOwnership(cartItemId, username);

    cartService.updateCartItemQuantity(cartItemId, quantity);
    return ResponseEntity.ok("Cart updated successfully");
}

}
