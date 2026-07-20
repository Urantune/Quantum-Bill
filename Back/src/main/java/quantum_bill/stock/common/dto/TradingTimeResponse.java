package quantum_bill.stock.common.dto;

public record TradingTimeResponse(
		String openTime,
		String closeTime,
		boolean marketOpen
) {
}
