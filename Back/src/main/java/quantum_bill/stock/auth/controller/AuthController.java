package quantum_bill.stock.auth.controller;

import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.auth.dto.request.*;
import quantum_bill.stock.auth.dto.response.ApiResponse;
import quantum_bill.stock.auth.dto.response.AuthenticationResponse;
import quantum_bill.stock.auth.dto.response.IntrospectResponse;
import quantum_bill.stock.auth.dto.response.UserResponse;
import quantum_bill.stock.auth.service.AuthService;

import java.text.ParseException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}
//    @GetMapping("/verify")
//    public String verifyEmail(@RequestParam("token") String token) {
//        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
//                .orElse(null);
//        if (verificationToken == null || verificationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
//            return "Token không hợp lệ hoặc đã hết hạn.";
//        }
//        User user = verificationToken.getUser();
//        user.setIsActive(true);
//        userRepository.save(user);
//        emailVerificationTokenRepository.delete(verificationToken);
//        return "Xác thực email thành công. Bạn có thể đăng nhập.";
//    }

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
