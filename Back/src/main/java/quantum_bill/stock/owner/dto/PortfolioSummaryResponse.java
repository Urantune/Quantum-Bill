package quantum_bill.stock.owner.dto;

import java.math.BigDecimal;
import java.util.List;

public record PortfolioSummaryResponse(
		Long userId,
		BigDecimal cashBalance,
		BigDecimal holdingsValue,
		BigDecimal totalAssets,
		BigDecimal profitLoss,
		List<PortfolioItemResponse> holdings
) {
}
