package quantum_bill.stock.owner.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.owner.document.StockPriceHistory;
import quantum_bill.stock.owner.dto.MarketSimulationResponse;
import quantum_bill.stock.owner.entity.Stock;
import quantum_bill.stock.owner.mongo.StockPriceHistoryRepository;
import quantum_bill.stock.owner.repository.StockRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.SplittableRandom;

@Service
public class MarketSimulationService {
	private static final BigDecimal DAILY_LIMIT = new BigDecimal("0.09");
	private static final LocalTime MARKET_OPEN = LocalTime.of(13, 0);
	private static final LocalTime MARKET_CLOSE = LocalTime.of(18, 0);

	private final StockRepository stockRepository;
	private final StockPriceHistoryRepository historyRepository;
	private final SplittableRandom random = new SplittableRandom();

	public MarketSimulationService(StockRepository stockRepository, StockPriceHistoryRepository historyRepository) {
		this.stockRepository = stockRepository;
		this.historyRepository = historyRepository;
	}

	@Transactional
	public List<MarketSimulationResponse> simulateMarketTick(boolean force) {
		if (!force) {
			assertTradingHours();
		}
		return stockRepository.findByStatus("ACTIVE").stream()
				.map(this::simulateStock)
				.toList();
	}

	public List<StockPriceHistory> history(Long stockId) {
		return historyRepository.findByStockIdOrderByRecordedAtDesc(stockId);
	}

	private MarketSimulationResponse simulateStock(Stock stock) {
		BigDecimal oldPrice = stock.getCurrentPrice();
		BigDecimal reference = referencePrice(stock, oldPrice);
		BigDecimal minPrice = reference.multiply(BigDecimal.ONE.subtract(DAILY_LIMIT));
		BigDecimal maxPrice = reference.multiply(BigDecimal.ONE.add(DAILY_LIMIT));

		BigDecimal randomMove = nextPriceMove();
		BigDecimal candidate = oldPrice.multiply(BigDecimal.ONE.add(randomMove));
		BigDecimal newPrice = clamp(candidate, minPrice, maxPrice).setScale(2, RoundingMode.HALF_UP);
		if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
			newPrice = new BigDecimal("0.01");
		}

		stock.setCurrentPrice(newPrice);
		stock.setUpdatedAt(LocalDateTime.now());
		stockRepository.save(stock);

		BigDecimal changeAmount = newPrice.subtract(oldPrice);
		BigDecimal changePercent = oldPrice.compareTo(BigDecimal.ZERO) == 0
				? BigDecimal.ZERO
				: changeAmount.multiply(BigDecimal.valueOf(100)).divide(oldPrice, 4, RoundingMode.HALF_UP);
		String direction = direction(changeAmount);
		saveHistory(stock, oldPrice, newPrice, changeAmount, changePercent, direction);

		return new MarketSimulationResponse(stock.getId(), stock.getSymbol(), oldPrice, newPrice, changeAmount, changePercent, direction);
	}

	private BigDecimal referencePrice(Stock stock, BigDecimal fallback) {
		LocalDate today = LocalDate.now();
		return historyRepository.findByStockIdOrderByRecordedAtDesc(stock.getId()).stream()
				.filter(history -> history.getRecordedAt() != null && history.getRecordedAt().toLocalDate().isBefore(today))
				.findFirst()
				.map(StockPriceHistory::getNewPrice)
				.orElse(fallback);
	}

	private BigDecimal nextPriceMove() {
		double marketMood = random.nextGaussian() * 0.004;
		double eventShock = random.nextDouble() < 0.08 ? random.nextGaussian() * 0.018 : 0.0;
		double liquidityNoise = (random.nextDouble() - 0.5) * 0.006;
		double move = marketMood + eventShock + liquidityNoise;
		move = Math.max(-0.025, Math.min(0.025, move));
		return BigDecimal.valueOf(move);
	}

	private BigDecimal clamp(BigDecimal value, BigDecimal min, BigDecimal max) {
		if (value.compareTo(min) < 0) return min;
		if (value.compareTo(max) > 0) return max;
		return value;
	}

	private void saveHistory(Stock stock, BigDecimal oldPrice, BigDecimal newPrice, BigDecimal changeAmount, BigDecimal changePercent, String direction) {
		StockPriceHistory history = new StockPriceHistory();
		history.setStockId(stock.getId());
		history.setSymbol(stock.getSymbol());
		history.setOldPrice(oldPrice);
		history.setNewPrice(newPrice);
		history.setChangeAmount(changeAmount);
		history.setChangePercent(changePercent);
		history.setDirection(direction);
		history.setChangeReason("RANDOM_MARKET_TICK");
		history.setRecordedAt(LocalDateTime.now());
		historyRepository.save(history);
	}

	private String direction(BigDecimal changeAmount) {
		if (changeAmount.compareTo(BigDecimal.ZERO) > 0) return "UP";
		if (changeAmount.compareTo(BigDecimal.ZERO) < 0) return "DOWN";
		return "UNCHANGED";
	}

	private void assertTradingHours() {
		LocalTime now = LocalTime.now();
		if (now.isBefore(MARKET_OPEN) || now.isAfter(MARKET_CLOSE)) {
			throw new IllegalStateException("Market simulation is only allowed from 13:00 to 18:00");
		}
	}
}
