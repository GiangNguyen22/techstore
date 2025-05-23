package com.example.techstore.controller;
import com.example.techstore.dto.reponse.ApiResponse;
import com.example.techstore.dto.reponse.DashboardOverviewResponse;
import com.example.techstore.entity.Product;
import com.example.techstore.service.AdminDashboardService;
import com.example.techstore.service.AdminService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import com.example.techstore.entity.Category;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.techstore.service.ProductService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminDashboardService adminDashboardService;
    @GetMapping("/dashboard/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getDashboardOverview() {
        try {
            DashboardOverviewResponse overview = adminDashboardService.getDashboardOverview();
            return ResponseEntity.ok(ApiResponse.success(overview));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch dashboard overview: " + e.getMessage()));
        }
    }
    public final ProductService productService;
    @GetMapping("/products/")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProductsbyAdmin(){
        try {
            List <Product> products = productService.getAllProducts();
            return ResponseEntity.ok(ApiResponse.success(products));
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch products: " + e.getMessage()));
        }
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> getInfoProductById(@PathVariable Integer id) {
      try{
        Product product = productService.getInforOneProduct(id);
        if(product != null){
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(product));
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Product not found"));
        }
    }catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("Failed to fetch product: " + e.getMessage()));

    }
}
    @DeleteMapping("/products/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteOneProduct(@PathVariable Integer id){
        try {

            Boolean result = productService.deleteOneProduct(id);
            if(result){
                return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success("Product deleted successfully"));
            }
            else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Product not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete product: " + e.getMessage()));
        }
    }
    private final AdminService adminService;
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        try {
            List<Category> categories = adminService.getCategoryAll();
            return ResponseEntity.ok(ApiResponse.success(categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch categories: " + e.getMessage()));
        }
    }
    

}
