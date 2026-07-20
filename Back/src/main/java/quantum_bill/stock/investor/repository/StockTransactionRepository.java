package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.StockTransaction;

import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
	List<StockTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

	List<StockTransaction> findAllByOrderByCreatedAtDesc();

	List<StockTransaction> findByStatusOrderByCreatedAtDesc(String status);
}
