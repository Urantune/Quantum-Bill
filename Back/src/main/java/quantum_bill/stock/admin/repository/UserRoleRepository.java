package quantum_bill.stock.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.admin.entity.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
