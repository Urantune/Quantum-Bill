package quantum_bill.stock.auth.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.entity.InvalidatedToken;
import quantum_bill.stock.admin.entity.Role;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.entity.UserRole;
import quantum_bill.stock.admin.repository.InvalidatedTokenRepository;
import quantum_bill.stock.admin.repository.RoleRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.admin.repository.UserRoleRepository;
import quantum_bill.stock.auth.dto.request.*;
import quantum_bill.stock.auth.dto.response.AuthenticationResponse;
import quantum_bill.stock.auth.dto.response.IntrospectResponse;
import quantum_bill.stock.auth.dto.response.UserResponse;
import quantum_bill.stock.auth.exception.AppException;
import quantum_bill.stock.auth.exception.ErrorCode;
import quantum_bill.stock.investor.entity.RefreshToken;
import quantum_bill.stock.investor.entity.Wallet;
import quantum_bill.stock.investor.repository.WalletRepository;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    static final BigDecimal INITIAL_BALANCE = new BigDecimal("100000000");

    UserRepository userRepository;
    RoleRepository roleRepository;
    UserRoleRepository userRoleRepository;
    WalletRepository walletRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;
    EmailService emailService;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;


    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        String roleName = normalizeRole(request.role());
        if (!roleName.equals("INVESTOR") && !roleName.equals("OWNER")) {
            throw new IllegalArgumentException("Only INVESTOR or OWNER can register");
        }

        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus(roleName.equals("INVESTOR") ? "PENDING" : "ACTIVE");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        User saved = userRepository.save(user);

        if (roleName.equals("OWNER")) {
            assignRole(saved, "OWNER");
            createWallet(saved, now);
        }

        return toResponse(saved);
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException, AppException {
        System.out.println("TOKEN = " + request.getToken());
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (Exception e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }


    public AuthenticationResponse authenticated(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (!user.getStatus().equals("ACTIVE")) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.LOGIN_ERROR);
        }
        String token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("safe_senior.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli())) // time token
                .jwtID(UUID.randomUUID().toString())
//                .claim("scope", buildScope(user))
                .claim("id", user.getId())
                .claim("roles",
                        user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .toList())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException, AppException {

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if (!(verified && expirationTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) throws ParseException, JOSEException {
        var signJWT = verifyToken(request.getToken(), true);
        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiration(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);
        var username = signJWT.getJWTClaimsSet().getSubject();
        var user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
            if (!invalidatedTokenRepository.existsById(jit)) {
                InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                        .id(jit)
                        .expiration(expiryTime)
                        .build();
                invalidatedTokenRepository.save(invalidatedToken);
            }

        } catch (AppException e) {
        }
    }

    public void forgotPassword(ForgotPassRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new AppException(ErrorCode.FORGOT_PASSWORD_EMAIL));
        if (!user.getStatus().equals("ACTIVE")) {
            throw new AppException(ErrorCode.USER_NOT_ACTIVE);
        }
        String kyTuMau = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 9; i++) {
            int index = secureRandom.nextInt(kyTuMau.length());
            sb.append(kyTuMau.charAt(index));
        }

        String newPassword = sb.toString();
        String subject = "Khôi phục mật khẩu";
        String content = "Đây là mật khẩu được cấp lại: "
                + newPassword
                + ". Vui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập.";

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), subject, content);
    }


    @Transactional
    public void assignRole(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
        if (userRoleRepository.existsByUserIdAndRoleName(user.getId(), roleName)) {
            return;
        }
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleRepository.save(userRole);
    }

    @Transactional
    public void createWallet(User user, LocalDateTime now) {
        if (walletRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(INITIAL_BALANCE);
        wallet.setCurrency("VND");
        wallet.setCreatedAt(now);
        wallet.setUpdatedAt(now);
        walletRepository.save(wallet);
    }

    public UserResponse toResponse(User user) {
        List<String> roles = userRoleRepository.findByUserId(user.getId()).stream()
                .map(userRole -> userRole.getRole().getName())
                .toList();
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getUsername(),
                user.getStatus(),
                roles,
                user.getCreatedAt()
        );
    }

    private String normalizeRole(String role) {
        return role.trim().toUpperCase(Locale.ROOT).replace("ROLE_", "");
    }
}
