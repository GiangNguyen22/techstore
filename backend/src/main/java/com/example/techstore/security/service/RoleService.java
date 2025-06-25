package com.example.techstore.security.service;

import com.example.techstore.entity.Role;
import com.example.techstore.security.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role getUserRole(){
        return roleRepository.findByName("ROLE_USER");
    }

    public Role getAdminRole(){
        return roleRepository.findByName("ROLE_ADMIN");
    }

    public Role createRole(String roleName){
        Role role = Role.builder().name(roleName).build();
        return roleRepository.save(role);
    }

}
