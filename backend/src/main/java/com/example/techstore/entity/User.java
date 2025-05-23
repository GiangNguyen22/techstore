package com.example.techstore.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.techstore.entity.Orders;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    private String dateOfBirth;

    @Column(unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 20)
    private String phone;
    @Column(nullable = false, length = 100)
    private String address;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

     @Column(nullable = false)
    private int isActive= 1;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Orders> orders;

    public void setIsActive() {
        this.isActive = 1;
    }
    public Integer getIsActive() {
        return isActive;
    }

    // public User(String name, String dateOfBirth, String email, String password, String phone, String address, Role role) {
    //     this.name = name;
    //     this.dateOfBirth = dateOfBirth;
    //     this.email = email;
    //     this.password = password;
    //     this.phone = phone;
    //     this.address = address;
    //     this.role = role;
    //     this.isActive = true; // Mặc định là true
    // }
    
}

