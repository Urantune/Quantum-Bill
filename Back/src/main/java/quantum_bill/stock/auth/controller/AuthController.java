package quantum_bill.stock.auth.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import quantum_bill.stock.auth.dto.request.*;
import quantum_bill.stock.auth.dto.response.ApiResponse;
import quantum_bill.stock.auth.dto.response.AuthenticationResponse;
import quantum_bill.stock.auth.dto.response.IntrospectResponse;
import quantum_bill.stock.auth.dto.response.UserResponse;
import quantum_bill.stock.auth.service.AuthService;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public UserResponse register(@Valid @RequestBody RegisterRequest request) {
		return authService.register(request);
	}

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authentication(@RequestBody LoginRequest request) {
        var result = authService.authenticated(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authentication(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) throws ParseException, JOSEException {
        var result = authService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/forgot-password")
    ApiResponse<Void> forgotPassword(@RequestBody ForgotPassRequest request) {
        authService.forgotPassword(request);
        return ApiResponse.<Void>builder()
                .build();
    }


}
