package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.Stock;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
	Optional<Stock> findBySymbol(String symbol);
	boolean existsBySymbolIgnoreCase(String symbol);
	boolean existsByCompanyNameIgnoreCase(String companyName);

	List<Stock> findByStatus(String status);

	List<Stock> findByCreatedByIdOrderByCreatedAtDesc(Long userId);

	Optional<Stock> findFirstByCompanyNameIgnoreCase(String companyName);

	List<Stock> findBySymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(String symbol, String companyName);
}
