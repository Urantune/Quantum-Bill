package quantum_bill.stock.investor.dto;

import java.math.BigDecimal;

public record RankingResponse(
		Long userId,
		String username,
		String fullName,
		BigDecimal totalAssets,
		BigDecimal profitLoss
) {
}
