package com.example.techstore.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;

import com.example.techstore.dto.CategoryDto;
import com.example.techstore.dto.reponse.PageResponse;
import com.example.techstore.dto.reponse.UserDetailDto;
import com.example.techstore.dto.reponse.UserResponseDto;
import com.example.techstore.dto.request.UserStatusRequest;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.User;
import com.example.techstore.repository.RoleRepository;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.AdminService;
import com.example.techstore.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    @Override
    public List<Category> getCategoryAll(){
        return categoryRepository.findAll();
    };
 
    @Override
    public PageResponse<UserResponseDto> getAllUsers(int page, int size, String sortBy, String sortDir, String search,
            String status, String role) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllUsers'");
    }
   
        @Override
        public boolean deleteUserById(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;        
    };

    @Override
    public List<UserDetailDto> getUserById(Integer id) {
        // TODO Auto-generated method stub      
        List<Object[]> result = userRepository.getInfoOneUser(id);       
        return convertToUserDetailDto(result);       
    }
    @Override
    public Boolean updateUserStatus(Long userId, UserStatusRequest request) {
    //     // TODO Auto-generated method stub
    //     User user = userRepository.findById(userId);
    //     if (user !=null){
    //         user.setIsActive(isActive);
    //         userRepository.save(user);
    //         return true;
    //     }
    //     else{
            
    //         return false;
    //     }
    // Validate input parameters
    if (userId == null || request.getIsActive() == null) {
        throw new IllegalArgumentException("UserId and isActive cannot be null");
    }
    
    // Validate isActive value (should be 0 or 1, or you might prefer boolean)
    if (request.getIsActive() != 0 && request.getIsActive() != 1) {
        throw new IllegalArgumentException("isActive must be 0 (inactive) or 1 (active)");
    }
    
    try {
        // Use Optional to handle potential null values properly
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setIsActive(request.getIsActive());
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    } catch (Exception e) {
        // Log the exception for debugging
        // logger.error("Error updating user status for userId: " + userId, e);
        throw new RuntimeException("Failed to update user status", e);
    }

     }
    
    @Override
    public void deleteUser(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteUser'");
    }

  
    
    private List<UserDetailDto> convertToUserDetailDto(List<Object[]> results) {
        List<UserDetailDto> response = new ArrayList<>();
        for(Object[] result : results){
            Long id = ((Number) result[0]).longValue();
            String name = (String) result[1];
            LocalDate dateOfBirth = LocalDate.parse((String) result[2]);
            String email = (String) result[3];
            String phone = (String) result[4];
            String address = (String) result[5];
            String roleName = (String) result[6];
            Integer isActive = (Integer) result[7];
            LocalDateTime createdAt = (LocalDateTime) result[8];
        UserDetailDto userDetail = new UserDetailDto(id,name, dateOfBirth,email,phone,address,roleName,isActive,createdAt);
            
            response.add(userDetail);
        }
       
        return response;
    }
}
