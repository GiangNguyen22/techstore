package com.example.techstore.dto.request;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserStatusRequest {    
    @NotNull(message = "isActive field is required")
    @JsonProperty("isActive")
    private Integer isActive;  
}