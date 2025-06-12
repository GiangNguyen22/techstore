package com.example.techstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TotalSaleResponse {
    private Double totalSale;
    private Double previousSale;
    private Double increaseSale;
}
