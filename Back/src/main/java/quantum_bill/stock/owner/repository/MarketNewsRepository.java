package quantum_bill.stock.owner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import quantum_bill.stock.owner.entity.MarketNews;

public interface MarketNewsRepository extends JpaRepository<MarketNews, Long> {
}
