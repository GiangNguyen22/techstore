package com.example.techstore.security.models;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.techstore.entity.User;
import java.util.List;
public class CustomUserDetails implements UserDetails {
    private final User user;
    public CustomUserDetails(User user) {
        this.user = user;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return List.of(new SimpleGrantedAuthority(user.getRole().getName()));
        
    }
    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
       return user.getPassword();
    }
    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return user.getEmail();
        
    }
    

}