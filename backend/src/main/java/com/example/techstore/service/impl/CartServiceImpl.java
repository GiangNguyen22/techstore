package com.example.techstore.service.impl;

import com.example.techstore.dto.CartDto;
import com.example.techstore.dto.CartItemDto;
import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.entity.*;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.repository.CartItemRepository;
import com.example.techstore.repository.CartRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Override
    public CartDto viewCart(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(()-> new ResourceNotFoundEx("Cart Not Found!"));

        List<CartItemDto> itemDtos = cart.getItems().stream().map(item -> {
            ProductVariant productVariant = item.getProductVariant();
            Product p = productVariant.getProduct();
            return CartItemDto.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productVariantId(productVariant.getId())
                    .productName(p.getName())
                    .thumbnail(p.getThumbnail())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getProductPrice())
                    .color(productVariant.getColor())
                    .size(productVariant.getSize())
                    .totalPrice(item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();
        }).toList();

        // tính tổng tiền trong cart
        BigDecimal totalPrice = itemDtos.stream().map(CartItemDto::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDto(itemDtos, totalPrice);
    }

    @Override
    public Cart addToCart(AddToCartRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(()-> new ResourceNotFoundEx("User not found!"));

        //nếu user chưa có cart thì tạo cart mới
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(()-> cartRepository.save(new Cart(user, null, BigDecimal.ZERO))
        );

        ProductVariant productVariant = productVariantRepository.findById(request.getProductVariantId())
                                                            .orElseThrow(()-> new ResourceNotFoundEx("Product variant not found!"));

        //kiểm tra xem product đã tồn tại trong giỏ hàng chưa
        CartItems existingItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), productVariant.getId());
        CartItems items;
        //nếu tồn tại thì cộng thêm số lượng
        if(existingItem != null) {
            items = existingItem;
            items.setQuantity(existingItem.getQuantity() + request.getQuantity());
        }else{
            items = new CartItems();
            items.setCart(cart);
            items.setProductVariant(productVariant);
            items.setQuantity(request.getQuantity());
            items.setProductPrice(productVariant.getProduct().getPrice());
        }
        cartItemRepository.save(items);

        //Cập nhật tổng giỏ hàng
        List<CartItems> cartItems = cart.getItems();
        BigDecimal total = cartItems.stream().map(i -> i.getProductPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                                                                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);

        return cartRepository.save(cart);
    }

    @Override
    public CartDto removeFromCart(Integer cartItemId) {
        CartItems item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundEx("Cart item not found!"));
        Cart cart = item.getCart();
        cartItemRepository.delete(item);

        // Cập nhật lại tổng tiền
        List<CartItems> updateItems = cart.getItems();
        BigDecimal total = updateItems.stream().map(i -> i.getProductPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
        cartRepository.save(cart);

        //Trả lại cart Dto
        return viewCart(cart.getUser().getId());
    }

    @Override
    public void updateCartItemQuantity(Integer cartItemId, Integer quantity) {
        CartItems cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundEx("Cart item not found!"));

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        // Cập nhật lại tổng tiền của giỏ hàng
        Cart cart = cartItem.getCart();
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(total);
        cartRepository.save(cart);
    }
}
