package quantum_bill.stock.common;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.entity.Role;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.entity.UserRole;
import quantum_bill.stock.admin.repository.RoleRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.admin.repository.UserRoleRepository;
import quantum_bill.stock.owner.entity.Wallet;
import quantum_bill.stock.owner.repository.WalletRepository;
import quantum_bill.stock.investor.entity.Stock;
import quantum_bill.stock.investor.repository.StockRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class DataBootstrap implements CommandLineRunner {
	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final WalletRepository walletRepository;
	private final PasswordEncoder passwordEncoder;
	private final StockRepository stockRepository;

	public DataBootstrap(
			RoleRepository roleRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			WalletRepository walletRepository,
			PasswordEncoder passwordEncoder,
			StockRepository stockRepository
	) {
		this.roleRepository = roleRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.walletRepository = walletRepository;
		this.passwordEncoder = passwordEncoder;
		this.stockRepository = stockRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		ensureRole("ADMIN", "System administrator");
		ensureRole("OWNER", "Stock investor");
		ensureRole("INVESTOR", "Listed company owner");
		ensureAdmin();
		ensureSampleUser("hehe", "hehe@quantumbill.local", "Người đầu tư mẫu", "OWNER", "ACTIVE", true);
		ensureCompanyAccounts();
	}

	private void ensureCompanyAccounts() {
		Map<String, User> accountsByCompany = new HashMap<>();
		for (Stock stock : stockRepository.findAll()) {
			String companyKey = stock.getCompanyName().trim().toLowerCase(Locale.ROOT);
			User company = accountsByCompany.get(companyKey);
			if (company == null) {
				String username = stock.getSymbol().trim().toLowerCase(Locale.ROOT);
				company = userRepository.findByUsername(username)
						.orElseGet(() -> stock.getCreatedBy() != null ? stock.getCreatedBy() : createCompanyUser(stock));
				company.setUsername(username);
				company.setFullName(stock.getCompanyName().trim());
				company.setStatus("ACTIVE");
				company.setPasswordHash(passwordEncoder.encode("123"));
				company.setUpdatedAt(LocalDateTime.now());
				company = userRepository.save(company);
				removeUnexpectedRoles(company, "INVESTOR");
				ensureUserRole(company, "INVESTOR");
				accountsByCompany.put(companyKey, company);
			}
			stock.setCreatedBy(company);
			stock.setUpdatedAt(LocalDateTime.now());
			stockRepository.save(stock);
		}
	}

	private User createCompanyUser(Stock stock) {
				LocalDateTime now = LocalDateTime.now();
				User user = new User();
				user.setFullName(stock.getCompanyName());
				user.setEmail("company-" + stock.getId() + "@quantumbill.local");
				user.setUsername(stock.getSymbol().trim().toLowerCase(Locale.ROOT));
				user.setPasswordHash(passwordEncoder.encode("123"));
				user.setStatus("ACTIVE");
				user.setCreatedAt(now);
				user.setUpdatedAt(now);
				return userRepository.save(user);
	}

	private void ensureRole(String name, String description) {
		roleRepository.findByName(name).orElseGet(() -> {
			Role role = new Role();
			role.setName(name);
			role.setDescription(description);
			return roleRepository.save(role);
		});
	}

	private void ensureAdmin() {
		User admin = userRepository.findByUsername("admin").orElseGet(() -> {
			LocalDateTime now = LocalDateTime.now();
			User user = new User();
			user.setFullName("System Admin");
			user.setEmail("admin@quantumbill.local");
			user.setUsername("admin");
			user.setPasswordHash(passwordEncoder.encode("123"));
			user.setStatus("ACTIVE");
			user.setCreatedAt(now);
			user.setUpdatedAt(now);
			return userRepository.save(user);
		});
		removeUnexpectedRoles(admin, "ADMIN");
		if (!userRoleRepository.existsByUserIdAndRoleName(admin.getId(), "ADMIN")) {
			UserRole userRole = new UserRole();
			userRole.setUser(admin);
			userRole.setRole(roleRepository.findByName("ADMIN").orElseThrow());
			userRoleRepository.save(userRole);
		}
	}

	private void ensureSampleUser(String username, String email, String fullName, String roleName, String status, boolean withWallet) {
		User user = userRepository.findByUsername(username).orElseGet(() -> {
			LocalDateTime now = LocalDateTime.now();
			User nextUser = new User();
			nextUser.setFullName(fullName);
			nextUser.setEmail(email);
			nextUser.setUsername(username);
			nextUser.setPasswordHash(passwordEncoder.encode("123"));
			nextUser.setStatus(status);
			nextUser.setCreatedAt(now);
			nextUser.setUpdatedAt(now);
			return userRepository.save(nextUser);
		});
		removeUnexpectedRoles(user, roleName);
		ensureUserRole(user, roleName);
		if (withWallet) {
			ensureWallet(user);
		}
	}

	private void removeUnexpectedRoles(User user, String expectedRole) {
		userRoleRepository.findByUserId(user.getId()).stream()
				.filter(userRole -> !expectedRole.equals(userRole.getRole().getName()))
				.forEach(userRoleRepository::delete);
	}

	private void ensureUserRole(User user, String roleName) {
		if (!userRoleRepository.existsByUserIdAndRoleName(user.getId(), roleName)) {
			UserRole userRole = new UserRole();
			userRole.setUser(user);
			userRole.setRole(roleRepository.findByName(roleName).orElseThrow());
			userRoleRepository.save(userRole);
		}
	}

	private void ensureWallet(User user) {
		walletRepository.findByUserId(user.getId()).orElseGet(() -> {
			LocalDateTime now = LocalDateTime.now();
			Wallet wallet = new Wallet();
			wallet.setUser(user);
			wallet.setBalance(new BigDecimal("100000000"));
			wallet.setCurrency("VND");
			wallet.setCreatedAt(now);
			wallet.setUpdatedAt(now);
			return walletRepository.save(wallet);
		});
	}
}
