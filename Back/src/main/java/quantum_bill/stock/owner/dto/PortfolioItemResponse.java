package quantum_bill.stock.owner.dto;

import java.math.BigDecimal;

public record PortfolioItemResponse(
		Long stockId,
		String symbol,
		String companyName,
		Long quantity,
		BigDecimal averageBuyPrice,
		BigDecimal currentPrice,
		BigDecimal marketValue,
		BigDecimal profitLoss
) {
}
