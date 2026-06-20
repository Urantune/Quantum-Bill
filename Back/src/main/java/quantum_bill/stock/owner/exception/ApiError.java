package quantum_bill.stock.owner.exception;

import java.time.LocalDateTime;

public record ApiError(
        LocalDateTime timestamp,
        int status,
        String message,
        String error
) {
}