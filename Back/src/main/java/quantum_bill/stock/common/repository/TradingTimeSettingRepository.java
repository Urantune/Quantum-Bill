package quantum_bill.stock.common.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import quantum_bill.stock.common.document.TradingTimeSetting;

public interface TradingTimeSettingRepository extends MongoRepository<TradingTimeSetting, String> {
}
