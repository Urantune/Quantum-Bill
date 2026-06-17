package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.StockTransaction;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
}
