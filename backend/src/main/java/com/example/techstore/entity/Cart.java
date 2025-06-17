package com.example.techstore.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItems> items =new ArrayList<>();;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;


    public Cart(User user, List<CartItems> items, BigDecimal totalPrice) {
        this.user = user;
        this.items = (items != null) ? items : new ArrayList<>();
        this.totalPrice = totalPrice;
    }

}
