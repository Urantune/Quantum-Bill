package quantum_bill.stock.investor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.investor.entity.MarketNews;

public interface MarketNewsRepository extends JpaRepository<MarketNews, Long> {
}
