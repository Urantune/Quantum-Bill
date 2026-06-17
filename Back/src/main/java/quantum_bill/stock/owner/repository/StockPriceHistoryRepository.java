package quantum_bill.stock.owner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.owner.entity.StockPriceHistory;

public interface StockPriceHistoryRepository extends JpaRepository<StockPriceHistory, Long> {
}
