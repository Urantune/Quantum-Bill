package quantum_bill.stock.investor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import quantum_bill.stock.investor.dto.MarketSimulationResponse;

import java.util.List;

@Component
@ConditionalOnProperty(prefix = "app.market.scheduler", name = "enabled", havingValue = "true", matchIfMissing = true)
public class MarketPriceScheduler {
	private static final Logger log = LoggerFactory.getLogger(MarketPriceScheduler.class);

	private final MarketSimulationService marketSimulationService;

	public MarketPriceScheduler(MarketSimulationService marketSimulationService) {
		this.marketSimulationService = marketSimulationService;
	}

	@Scheduled(fixedRateString = "${app.market.scheduler.fixed-rate-ms:15000}")
	public void updateMarketPrices() {
		List<MarketSimulationResponse> updates = marketSimulationService.simulateMarketTick(true);
		if (!updates.isEmpty()) {
			log.info("Auto market tick updated {} active stocks", updates.size());
		}
	}
}
