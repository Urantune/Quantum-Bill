package quantum_bill.stock.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AdjustWalletRequest(
		@NotNull Long userId,
		@NotNull @DecimalMin(value = "0.01") BigDecimal amount,
		String reason
) {
}
