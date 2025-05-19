package com.example.techstore.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.techstore.entity.User;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.security.models.CustomUserDetails;


@Component
public class CustemUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }
    
    // @Autowired
    // private UserRepository userRepository;
    // @Override
    // public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    //     User user = userRepository.findByEmail(username)
    //             .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    //     return new CustomUserDetails(user);
    // }

}
