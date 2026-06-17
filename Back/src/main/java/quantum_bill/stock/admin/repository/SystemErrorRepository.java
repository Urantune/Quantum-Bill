package quantum_bill.stock.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.admin.entity.SystemError;

public interface SystemErrorRepository extends JpaRepository<SystemError, Long> {
}
