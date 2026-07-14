package quantum_bill.stock.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.entity.Role;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.entity.UserRole;
import quantum_bill.stock.admin.repository.RoleRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.admin.repository.UserRoleRepository;
import quantum_bill.stock.auth.dto.LoginRequest;
import quantum_bill.stock.auth.dto.RegisterRequest;
import quantum_bill.stock.auth.dto.UserResponse;
import quantum_bill.stock.investor.entity.Wallet;
import quantum_bill.stock.investor.repository.WalletRepository;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class AuthService {
	private static final BigDecimal INITIAL_BALANCE = new BigDecimal("100000000");

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserRoleRepository userRoleRepository;
	private final WalletRepository walletRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(
			UserRepository userRepository,
			RoleRepository roleRepository,
			UserRoleRepository userRoleRepository,
			WalletRepository walletRepository,
			PasswordEncoder passwordEncoder
	) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userRoleRepository = userRoleRepository;
		this.walletRepository = walletRepository;
		this.passwordEncoder = passwordEncoder;
	}

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
		user.setStatus(roleName.equals("OWNER") ? "PENDING" : "ACTIVE");
		user.setCreatedAt(now);
		user.setUpdatedAt(now);
		User saved = userRepository.save(user);

		if (roleName.equals("INVESTOR")) {
			assignRole(saved, "INVESTOR");
			createWallet(saved, now);
		}

		return toResponse(saved);
	}

	@Transactional
	public UserResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.username())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new IllegalArgumentException("Invalid password");
		}
		if (!user.getStatus().equals("ACTIVE")) {
			throw new IllegalArgumentException("User is not active: " + user.getStatus());
		}
		user.setLastLoginAt(LocalDateTime.now());
		return toResponse(userRepository.save(user));
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
