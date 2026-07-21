package quantum_bill.stock.owner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.owner.entity.WalletTransaction;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
	List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}
