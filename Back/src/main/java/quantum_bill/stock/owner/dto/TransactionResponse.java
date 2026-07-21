package quantum_bill.stock.owner.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
		Long id,
		String type,
		String status,
		Long userId,
		String username,
		String symbol,
		Long quantity,
		BigDecimal price,
		BigDecimal totalAmount,
		LocalDateTime createdAt
) {
}
