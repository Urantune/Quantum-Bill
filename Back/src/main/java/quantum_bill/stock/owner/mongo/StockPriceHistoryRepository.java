package quantum_bill.stock.owner.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import quantum_bill.stock.owner.document.StockPriceHistory;

import java.time.LocalDateTime;
import java.util.List;

public interface StockPriceHistoryRepository extends MongoRepository<StockPriceHistory, String> {
	List<StockPriceHistory> findByStockIdOrderByRecordedAtDesc(Long stockId);

	List<StockPriceHistory> findBySymbolIgnoreCaseOrderByRecordedAtDesc(String symbol);

	List<StockPriceHistory> findByRecordedAtBetweenOrderByRecordedAtDesc(LocalDateTime from, LocalDateTime to);
}
