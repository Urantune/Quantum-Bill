package quantum_bill.stock.investor.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TopUpSessionResponse(
		String token,
		String paymentPath,
		BigDecimal amount,
		LocalDateTime expiresAt
) {
}
