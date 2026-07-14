package quantum_bill.stock.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
		@NotBlank String fullName,
		@NotBlank @Email String email,
		@NotBlank String username,
		@NotBlank String password,
		@NotBlank String role
) {
}
