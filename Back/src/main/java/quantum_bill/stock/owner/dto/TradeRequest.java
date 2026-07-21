package quantum_bill.stock.owner.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TradeRequest(
		@NotNull Long userId,
		@NotNull Long stockId,
		@NotNull @Min(1) Long quantity
) {
}
