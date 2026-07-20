package quantum_bill.stock.investor.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TopUpSessionRequest(
		@NotNull Long userId,
		@NotNull @DecimalMin(value = "1000.00") BigDecimal amount
) {
}
