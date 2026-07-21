package quantum_bill.stock.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
		@NotBlank String fullName,
		@NotBlank @Email String email,
		@NotBlank
		@Pattern(regexp = "^[a-z0-9_]{2,30}$", message = "Username must contain only lowercase ASCII letters, digits, or underscores")
		String username,
		@NotBlank String password,
		@NotBlank String role
) {
}
