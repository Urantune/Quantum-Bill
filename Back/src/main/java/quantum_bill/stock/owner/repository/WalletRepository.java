package quantum_bill.stock.owner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.owner.entity.Wallet;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
	Optional<Wallet> findByUserId(Long userId);
}
