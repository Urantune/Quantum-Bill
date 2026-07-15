package quantum_bill.stock.auth.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import quantum_bill.stock.auth.dto.LoginRequest;
import quantum_bill.stock.auth.dto.RegisterRequest;
import quantum_bill.stock.auth.dto.UserResponse;
import quantum_bill.stock.auth.service.AuthService;

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
	public UserResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}
}
