package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.PortfolioHolding;

import java.util.List;
import java.util.Optional;

public interface PortfolioHoldingRepository extends JpaRepository<PortfolioHolding, Long> {
	List<PortfolioHolding> findByUserId(Long userId);

	Optional<PortfolioHolding> findByUserIdAndStockId(Long userId, Long stockId);
}
