package quantum_bill.stock.investor.dto;

import java.math.BigDecimal;

public record WalletResponse(
		Long id,
		Long userId,
		BigDecimal balance,
		String currency
) {
}
