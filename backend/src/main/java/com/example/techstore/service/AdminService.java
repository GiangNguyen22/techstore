package com.example.techstore.service;

import com.example.techstore.dto.reponse.UserDetailDto;
import com.example.techstore.dto.reponse.UserResponseDto;
import com.example.techstore.dto.request.UserStatusRequest;
import com.example.techstore.entity.Category;
import com.example.techstore.repository.RoleRepository;
import com.example.techstore.repository.UserRepository;

import java.util.List;

import com.example.techstore.dto.CategoryDto;
import com.example.techstore.dto.reponse.PageResponse;

public interface AdminService {

   PageResponse<UserResponseDto> getAllUsers(int page, int size, String sortBy, 
                                                   String sortDir, String search, 
                                                   String status, String role);

    List<UserDetailDto>  getUserById(Integer id);
    
    public void deleteUser(Long id);
    public Boolean updateUserStatus(Long userId, UserStatusRequest request);
    public boolean deleteUserById(Integer id);
    public List<Category> getCategoryAll();

}
