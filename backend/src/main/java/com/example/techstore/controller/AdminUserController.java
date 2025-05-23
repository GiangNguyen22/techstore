package com.example.techstore.controller;


import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.techstore.service.AdminService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

import com.example.techstore.dto.reponse.ApiResponse;
import com.example.techstore.dto.reponse.UserDetailDto;
import com.example.techstore.dto.request.UserStatusRequest;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminService userService;
   

  
    @GetMapping("/{id}")
   public ResponseEntity<ApiResponse<List<UserDetailDto>>> getUserById(@PathVariable Integer id) {
        List<UserDetailDto> userDetail = userService.getUserById(id);
        ApiResponse<List<UserDetailDto>> response = ApiResponse.<List<UserDetailDto>>builder()
                .success(true)
                .message("User details retrieved successfully")
                .data(userDetail)
                .build();
        return ResponseEntity.ok(response);
    }


 private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);
    
    /**
     * Update user status (active/inactive)
     * @param id User ID
     * @param request Request body containing the new status
     * @return ResponseEntity with success message or error message
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable Long id, 
                                                 @RequestBody UserStatusRequest request) {
        logger.info("=== DEBUG START ===");
        logger.info("Request received - UserId: {}, IsActive: {}", id, request.getIsActive());
        try {
            logger.info("Calling userService.updateUserStatus...");
            Boolean result = userService.updateUserStatus(id, request);
            logger.info("Service result: {}", result);
            
            if (result) {
                logger.info("SUCCESS: User status updated successfully");
                return ResponseEntity.ok("User status updated successfully");
            } else {
                logger.warn("ERROR: User not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("EXCEPTION occurred: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Failed to update user status: " + e.getMessage());
        } finally {
            logger.info("=== DEBUG END ===");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("User not found.");
        }
    }
    // @PatchMapping("/{userId}/status") // Hoặc dùng @PutMapping
    // public ResponseEntity<Void> updateUserStatus(@PathVariable Long userId, @Valid @RequestBody UserStatusRequest request) {
    //     userService.updateUserStatus(userId, request.getIsActive());
    //     return ResponseEntity.ok().build();
    // }

//     @PatchMapping("/{userId}/status")
// public ResponseEntity<String> updateUserStatus(@PathVariable Long userId, 
//                                              @Valid @RequestBody UserStatusRequest request) {
//     try {
//         Boolean result = userService.updateUserStatus(userId, request.getIsActive());
//         System.out.println("USER_ID"+userId);
//         System.out.println("IsActive"+request.getIsActive());
//         if (result) {
//             return ResponseEntity.ok("User status updated successfully");
//         } else {
//             return ResponseEntity.notFound().build();
//         }
//     } catch (Exception e) {
//         return ResponseEntity.badRequest().body("Failed to update user status: " + e.getMessage());
//     }
// }

    // @PatchMapping("/{id}/status")
    // public ResponseEntity<Void> updateUserStatus(
    //     @PathVariable Long id,
    //     @RequestBody UserStatusRequest request
    // ) {
    //     userService.updateUserStatus(id, request.getIsActive() ? "activate" : "deactivate");
    //     return ResponseEntity.noContent().build();
    // }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    //     userService.deleteUser(id);
    //     return ResponseEntity.noContent().build();
    // }
}