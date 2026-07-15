package quantum_bill.stock.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.admin.entity.UserRole;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
	List<UserRole> findByUserId(Long userId);

	boolean existsByUserIdAndRoleName(Long userId, String roleName);
}
