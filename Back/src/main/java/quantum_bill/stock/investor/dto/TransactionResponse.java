package quantum_bill.stock.investor.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
		Long id,
		String type,
		String symbol,
		Long quantity,
		BigDecimal price,
		BigDecimal totalAmount,
		LocalDateTime createdAt
) {
}
