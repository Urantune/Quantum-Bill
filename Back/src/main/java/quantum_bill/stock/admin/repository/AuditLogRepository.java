package quantum_bill.stock.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.admin.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
