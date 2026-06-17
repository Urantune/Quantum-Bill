package quantum_bill.stock.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.admin.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(String name);
}
