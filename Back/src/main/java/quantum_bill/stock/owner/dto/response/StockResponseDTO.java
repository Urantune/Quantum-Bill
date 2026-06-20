package quantum_bill.stock.owner.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StockResponseDTO(
        Long id,
        String symbol,
        String companyName,
        String industry,
        String description,
        BigDecimal currentPrice,
        String status,
        LocalDateTime createdAt
) {
}