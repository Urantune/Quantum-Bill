package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
}
