package quantum_bill.stock.owner.dto;

import java.math.BigDecimal;

public record TradeResponse(
		Long transactionId,
		String type,
		String symbol,
		Long quantity,
		BigDecimal price,
		BigDecimal grossAmount,
		BigDecimal fee,
		BigDecimal netAmount,
		BigDecimal walletBalance
) {
}
