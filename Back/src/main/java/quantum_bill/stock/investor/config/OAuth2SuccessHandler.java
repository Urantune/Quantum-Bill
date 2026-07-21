package quantum_bill.stock.investor.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.auth.service.AuthService;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final AuthService authService;

    public OAuth2SuccessHandler(UserRepository userRepository, @Lazy AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        if (email == null) {
            email = (String) oAuth2User.getAttributes().get("mail");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            response.sendRedirect("http://localhost:5173/auth/login?error=user_not_found");
            return;
        }

        String token = authService.generateToken(user);
        response.sendRedirect("http://localhost:5173/auth/oauth-callback?token=" + token);
    }
}
