   package com.example.techstore.dto;

   import lombok.AllArgsConstructor;
   import lombok.Builder;
   import lombok.Data;
   import lombok.NoArgsConstructor;

   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   @Builder
   public class ProductVariantDto {
      private Integer id;
      private String color;
      private String size;
      private Integer stockQuantity;
      private Integer productId;
   }
