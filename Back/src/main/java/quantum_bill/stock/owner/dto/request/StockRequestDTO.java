package quantum_bill.stock.owner.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record StockRequestDTO(
        @NotBlank(message = "Stock symbol is required")
        @Size(min = 2, max = 20, message = "Symbol must be between 2 and 20 characters")
        String symbol,

        @NotBlank(message = "Company name is required")
        String companyName,

        String industry,
        String description,

        @NotNull(message = "Current price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        BigDecimal currentPrice,

        String status,

        Long createdById
) {
}