package quantum_bill.stock.common;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import quantum_bill.stock.admin.entity.Role;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.entity.UserRole;
import quantum_bill.stock.admin.repository.RoleRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.admin.repository.UserRoleRepository;

import java.time.LocalDateTime;

@Component
public class DataBootstrap implements CommandLineRunner {
	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final PasswordEncoder passwordEncoder;

	public DataBootstrap(
			RoleRepository roleRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder
	) {
		this.roleRepository = roleRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		ensureRole("ADMIN", "System administrator");
		ensureRole("OWNER", "Exchange owner");
		ensureRole("INVESTOR", "Investor");
		ensureAdmin();
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
			user.setPasswordHash(passwordEncoder.encode("admin123"));
			user.setStatus("ACTIVE");
			user.setCreatedAt(now);
			user.setUpdatedAt(now);
			return userRepository.save(user);
		});
		if (!userRoleRepository.existsByUserIdAndRoleName(admin.getId(), "ADMIN")) {
			UserRole userRole = new UserRole();
			userRole.setUser(admin);
			userRole.setRole(roleRepository.findByName("ADMIN").orElseThrow());
			userRoleRepository.save(userRole);
		}
	}
}
