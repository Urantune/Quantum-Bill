package quantum_bill.stock.common.dto;

import jakarta.validation.constraints.NotBlank;

public record TradingTimeRequest(
		@NotBlank String openTime,
		@NotBlank String closeTime
) {
}
