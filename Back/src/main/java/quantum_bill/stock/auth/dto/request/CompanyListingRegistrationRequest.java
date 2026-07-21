package quantum_bill.stock.auth.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CompanyListingRegistrationRequest(
        @NotBlank String companyName,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp = "^[a-z0-9_]{2,30}$") String username,
        @NotBlank @Size(min = 6) String password,
        @NotBlank @Size(min = 2, max = 20) String symbol,
        String industry,
        String description,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal initialPrice
) {
}
