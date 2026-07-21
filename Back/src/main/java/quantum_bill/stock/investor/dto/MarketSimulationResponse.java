package quantum_bill.stock.investor.dto;

import java.math.BigDecimal;

public record MarketSimulationResponse(
		Long stockId,
		String symbol,
		BigDecimal oldPrice,
		BigDecimal newPrice,
		BigDecimal changeAmount,
		BigDecimal changePercent,
		String direction
) {
}
