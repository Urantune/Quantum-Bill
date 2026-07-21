package quantum_bill.stock.investor.config;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.repository.RoleRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.admin.repository.UserRoleRepository;
import quantum_bill.stock.admin.entity.UserRole;
import quantum_bill.stock.owner.entity.Wallet;
import quantum_bill.stock.owner.repository.WalletRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final WalletRepository walletRepository;

    public CustomOAuth2UserService(UserRepository userRepository, RoleRepository roleRepository,
                                   UserRoleRepository userRoleRepository, WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = extractEmail(registrationId, attributes);
        String name = extractName(registrationId, attributes);
        String providerId = extractProviderId(registrationId, attributes);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            LocalDateTime now = LocalDateTime.now();
            User newUser = new User();
            newUser.setFullName(name != null ? name : email);
            newUser.setEmail(email);
            newUser.setUsername(registrationId + "_" + (providerId != null ? providerId.substring(0, Math.min(8, providerId.length())) : System.currentTimeMillis()));
            newUser.setPasswordHash("");
            newUser.setStatus("ACTIVE");
            newUser.setCreatedAt(now);
            newUser.setUpdatedAt(now);
            User saved = userRepository.save(newUser);

            // Assign OWNER role
            roleRepository.findByName("OWNER").ifPresent(role -> {
                UserRole userRole = new UserRole();
                userRole.setUser(saved);
                userRole.setRole(role);
                userRoleRepository.save(userRole);
            });

            // Create wallet
            Wallet wallet = new Wallet();
            wallet.setUser(saved);
            wallet.setBalance(new BigDecimal("100000000"));
            wallet.setCurrency("VND");
            wallet.setCreatedAt(now);
            wallet.setUpdatedAt(now);
            walletRepository.save(wallet);

            return saved;
        });

        // Update status if needed
        if (!"ACTIVE".equals(user.getStatus())) {
            user.setStatus("ACTIVE");
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, "email");
    }

    private String extractEmail(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) {
            case "google", "microsoft" -> (String) attributes.get("email");
            case "github" -> (String) attributes.get("email");
            case "facebook" -> (String) attributes.get("email");
            case "discord" -> (String) attributes.get("email");
            case "spotify", "playstation", "netflix" -> (String) attributes.get("email");
            case "telegram" -> {
                Object id = attributes.get("id");
                yield id != null ? id + "@telegram.local" : null;
            }
            default -> (String) attributes.getOrDefault("email",
                    attributes.getOrDefault("mail", null));
        };
    }

    private String extractName(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) {
            case "google" -> (String) attributes.get("name");
            case "github" -> (String) attributes.getOrDefault("name", attributes.get("login"));
            case "facebook" -> (String) attributes.get("name");
            case "discord" -> (String) attributes.getOrDefault("global_name", attributes.get("username"));
            case "microsoft" -> (String) attributes.get("displayName");
            case "spotify", "playstation", "netflix" -> (String) attributes.get("display_name");
            case "telegram" -> {
                String first = (String) attributes.get("first_name");
                String last = (String) attributes.get("last_name");
                yield (first != null ? first : "") + (last != null ? " " + last : "");
            }
            default -> (String) attributes.getOrDefault("name", attributes.get("login"));
        };
    }

    private String extractProviderId(String registrationId, Map<String, Object> attributes) {
        Object id = attributes.getOrDefault("id", attributes.getOrDefault("sub", null));
        return id != null ? id.toString() : null;
    }
}
