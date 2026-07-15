package quantum_bill.stock.auth.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
		Long id,
		String fullName,
		String email,
		String username,
		String status,
		List<String> roles,
		LocalDateTime createdAt
) {
}
