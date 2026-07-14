package quantum_bill.stock.investor.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.investor.dto.*;
import quantum_bill.stock.investor.entity.PortfolioHolding;
import quantum_bill.stock.investor.entity.StockTransaction;
import quantum_bill.stock.investor.entity.Wallet;
import quantum_bill.stock.investor.entity.WalletTransaction;
import quantum_bill.stock.investor.repository.PortfolioHoldingRepository;
import quantum_bill.stock.investor.repository.StockTransactionRepository;
import quantum_bill.stock.investor.repository.WalletRepository;
import quantum_bill.stock.investor.repository.WalletTransactionRepository;
import quantum_bill.stock.owner.entity.Stock;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;
import quantum_bill.stock.owner.repository.StockRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class TradingService {
	private static final BigDecimal FEE_RATE = new BigDecimal("0.036");
	private static final BigDecimal INITIAL_BALANCE = new BigDecimal("100000000");
	private static final LocalTime MARKET_OPEN = LocalTime.of(13, 0);
	private static final LocalTime MARKET_CLOSE = LocalTime.of(18, 0);

	private final UserRepository userRepository;
	private final StockRepository stockRepository;
	private final WalletRepository walletRepository;
	private final PortfolioHoldingRepository holdingRepository;
	private final StockTransactionRepository stockTransactionRepository;
	private final WalletTransactionRepository walletTransactionRepository;

	public TradingService(
			UserRepository userRepository,
			StockRepository stockRepository,
			WalletRepository walletRepository,
			PortfolioHoldingRepository holdingRepository,
			StockTransactionRepository stockTransactionRepository,
			WalletTransactionRepository walletTransactionRepository
	) {
		this.userRepository = userRepository;
		this.stockRepository = stockRepository;
		this.walletRepository = walletRepository;
		this.holdingRepository = holdingRepository;
		this.stockTransactionRepository = stockTransactionRepository;
		this.walletTransactionRepository = walletTransactionRepository;
	}

	@Transactional
	public TradeResponse buy(TradeRequest request) {
		assertTradingHours();
		User user = findUser(request.userId());
		Stock stock = findActiveStock(request.stockId());
		Wallet wallet = findWallet(user.getId());
		BigDecimal gross = stock.getCurrentPrice().multiply(BigDecimal.valueOf(request.quantity()));
		BigDecimal fee = fee(gross);
		BigDecimal net = gross.add(fee);
		if (wallet.getBalance().compareTo(net) < 0) {
			throw new IllegalArgumentException("Insufficient balance");
		}

		BigDecimal before = wallet.getBalance();
		wallet.setBalance(before.subtract(net));
		wallet.setUpdatedAt(LocalDateTime.now());
		walletRepository.save(wallet);

		PortfolioHolding holding = holdingRepository.findByUserIdAndStockId(user.getId(), stock.getId())
				.orElseGet(() -> newHolding(user, stock));
		BigDecimal oldCost = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
		BigDecimal addedCost = gross;
		long newQuantity = holding.getQuantity() + request.quantity();
		holding.setQuantity(newQuantity);
		holding.setAverageBuyPrice(oldCost.add(addedCost).divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP));
		holding.setUpdatedAt(LocalDateTime.now());
		holdingRepository.save(holding);

		StockTransaction tx = saveStockTransaction(user, stock, "BUY", request.quantity(), stock.getCurrentPrice(), gross);
		saveWalletTransaction(wallet, "BUY", net.negate(), before, wallet.getBalance(), "STOCK_TRANSACTION", tx.getId());
		return toTradeResponse(tx, fee, net, wallet.getBalance());
	}

	@Transactional
	public TradeResponse sell(TradeRequest request) {
		assertTradingHours();
		User user = findUser(request.userId());
		Stock stock = findActiveStock(request.stockId());
		Wallet wallet = findWallet(user.getId());
		PortfolioHolding holding = holdingRepository.findByUserIdAndStockId(user.getId(), stock.getId())
				.orElseThrow(() -> new IllegalArgumentException("You do not own this stock"));
		if (holding.getQuantity() < request.quantity()) {
			throw new IllegalArgumentException("Not enough stock quantity");
		}

		BigDecimal gross = stock.getCurrentPrice().multiply(BigDecimal.valueOf(request.quantity()));
		BigDecimal fee = fee(gross);
		BigDecimal net = gross.subtract(fee);
		BigDecimal before = wallet.getBalance();
		wallet.setBalance(before.add(net));
		wallet.setUpdatedAt(LocalDateTime.now());
		walletRepository.save(wallet);

		holding.setQuantity(holding.getQuantity() - request.quantity());
		holding.setUpdatedAt(LocalDateTime.now());
		if (holding.getQuantity() == 0) {
			holdingRepository.delete(holding);
		} else {
			holdingRepository.save(holding);
		}

		StockTransaction tx = saveStockTransaction(user, stock, "SELL", request.quantity(), stock.getCurrentPrice(), gross);
		saveWalletTransaction(wallet, "SELL", net, before, wallet.getBalance(), "STOCK_TRANSACTION", tx.getId());
		return toTradeResponse(tx, fee, net, wallet.getBalance());
	}

	@Transactional(readOnly = true)
	public PortfolioSummaryResponse portfolio(Long userId) {
		Wallet wallet = findWallet(userId);
		List<PortfolioItemResponse> items = holdingRepository.findByUserId(userId).stream()
				.map(this::toPortfolioItem)
				.toList();
		BigDecimal holdingsValue = items.stream().map(PortfolioItemResponse::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal investedCost = items.stream()
				.map(item -> item.averageBuyPrice().multiply(BigDecimal.valueOf(item.quantity())))
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal profitLoss = holdingsValue.subtract(investedCost);
		return new PortfolioSummaryResponse(userId, wallet.getBalance(), holdingsValue, wallet.getBalance().add(holdingsValue), profitLoss, items);
	}

	@Transactional(readOnly = true)
	public List<RankingResponse> ranking() {
		return userRepository.findAll().stream()
				.filter(user -> walletRepository.findByUserId(user.getId()).isPresent())
				.map(user -> {
					PortfolioSummaryResponse summary = portfolio(user.getId());
					return new RankingResponse(user.getId(), user.getUsername(), user.getFullName(), summary.totalAssets(), summary.profitLoss());
				})
				.sorted(Comparator.comparing(RankingResponse::totalAssets).reversed())
				.toList();
	}

	@Transactional(readOnly = true)
	public List<TransactionResponse> transactionHistory(Long userId) {
		return stockTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
				.map(this::toTransactionResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public WalletResponse wallet(Long userId) {
		return toWalletResponse(findWallet(userId));
	}

	private void assertTradingHours() {
		LocalTime now = LocalTime.now();
		if (now.isBefore(MARKET_OPEN) || now.isAfter(MARKET_CLOSE)) {
			throw new IllegalStateException("Trading is only allowed from 13:00 to 18:00");
		}
	}

	private User findUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
	}

	private Stock findActiveStock(Long stockId) {
		Stock stock = stockRepository.findById(stockId)
				.orElseThrow(() -> new ResourceNotFoundException("Stock not found: " + stockId));
		if (!"ACTIVE".equals(stock.getStatus())) {
			throw new IllegalArgumentException("Stock is not active");
		}
		return stock;
	}

	private Wallet findWallet(Long userId) {
		return walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));
	}

	private PortfolioHolding newHolding(User user, Stock stock) {
		PortfolioHolding holding = new PortfolioHolding();
		holding.setUser(user);
		holding.setStock(stock);
		holding.setQuantity(0L);
		holding.setAverageBuyPrice(BigDecimal.ZERO);
		holding.setCreatedAt(LocalDateTime.now());
		return holding;
	}

	private BigDecimal fee(BigDecimal gross) {
		return gross.multiply(FEE_RATE).setScale(2, RoundingMode.HALF_UP);
	}

	private StockTransaction saveStockTransaction(User user, Stock stock, String type, Long quantity, BigDecimal price, BigDecimal gross) {
		StockTransaction tx = new StockTransaction();
		tx.setUser(user);
		tx.setStock(stock);
		tx.setType(type);
		tx.setQuantity(quantity);
		tx.setPrice(price);
		tx.setTotalAmount(gross);
		tx.setCreatedAt(LocalDateTime.now());
		return stockTransactionRepository.save(tx);
	}

	private void saveWalletTransaction(Wallet wallet, String type, BigDecimal amount, BigDecimal before, BigDecimal after, String refType, Long refId) {
		WalletTransaction tx = new WalletTransaction();
		tx.setWallet(wallet);
		tx.setType(type);
		tx.setAmount(amount);
		tx.setBalanceBefore(before);
		tx.setBalanceAfter(after);
		tx.setReferenceType(refType);
		tx.setReferenceId(refId);
		tx.setCreatedAt(LocalDateTime.now());
		walletTransactionRepository.save(tx);
	}

	private TradeResponse toTradeResponse(StockTransaction tx, BigDecimal fee, BigDecimal net, BigDecimal balance) {
		return new TradeResponse(
				tx.getId(),
				tx.getType(),
				tx.getStock().getSymbol(),
				tx.getQuantity(),
				tx.getPrice(),
				tx.getTotalAmount(),
				fee,
				net,
				balance
		);
	}

	private WalletResponse toWalletResponse(Wallet wallet) {
		return new WalletResponse(wallet.getId(), wallet.getUser().getId(), wallet.getBalance(), wallet.getCurrency());
	}

	private TransactionResponse toTransactionResponse(StockTransaction tx) {
		return new TransactionResponse(
				tx.getId(),
				tx.getType(),
				tx.getStock().getSymbol(),
				tx.getQuantity(),
				tx.getPrice(),
				tx.getTotalAmount(),
				tx.getCreatedAt()
		);
	}

	private PortfolioItemResponse toPortfolioItem(PortfolioHolding holding) {
		BigDecimal marketValue = holding.getStock().getCurrentPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
		BigDecimal cost = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
		return new PortfolioItemResponse(
				holding.getStock().getId(),
				holding.getStock().getSymbol(),
				holding.getStock().getCompanyName(),
				holding.getQuantity(),
				holding.getAverageBuyPrice(),
				holding.getStock().getCurrentPrice(),
				marketValue,
				marketValue.subtract(cost)
		);
	}
}
