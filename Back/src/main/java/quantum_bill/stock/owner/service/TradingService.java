package quantum_bill.stock.owner.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.common.service.TradingTimeService;
import quantum_bill.stock.owner.dto.*;
import quantum_bill.stock.owner.entity.PortfolioHolding;
import quantum_bill.stock.owner.entity.StockTransaction;
import quantum_bill.stock.owner.entity.Wallet;
import quantum_bill.stock.owner.entity.WalletTransaction;
import quantum_bill.stock.owner.repository.PortfolioHoldingRepository;
import quantum_bill.stock.owner.repository.StockTransactionRepository;
import quantum_bill.stock.owner.repository.WalletRepository;
import quantum_bill.stock.owner.repository.WalletTransactionRepository;
import quantum_bill.stock.investor.entity.Stock;
import quantum_bill.stock.investor.exception.ResourceNotFoundException;
import quantum_bill.stock.investor.repository.StockRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TradingService {
	private static final BigDecimal FEE_RATE = new BigDecimal("0.036");
	private static final BigDecimal INITIAL_BALANCE = new BigDecimal("100000000");

	private final UserRepository userRepository;
	private final StockRepository stockRepository;
	private final WalletRepository walletRepository;
	private final PortfolioHoldingRepository holdingRepository;
	private final StockTransactionRepository stockTransactionRepository;
	private final WalletTransactionRepository walletTransactionRepository;
	private final TradingTimeService tradingTimeService;
	private final Map<String, TopUpSession> topUpSessions = new ConcurrentHashMap<>();

	public TradingService(
			UserRepository userRepository,
			StockRepository stockRepository,
			WalletRepository walletRepository,
			PortfolioHoldingRepository holdingRepository,
			StockTransactionRepository stockTransactionRepository,
			WalletTransactionRepository walletTransactionRepository,
			TradingTimeService tradingTimeService
	) {
		this.userRepository = userRepository;
		this.stockRepository = stockRepository;
		this.walletRepository = walletRepository;
		this.holdingRepository = holdingRepository;
		this.stockTransactionRepository = stockTransactionRepository;
		this.walletTransactionRepository = walletTransactionRepository;
		this.tradingTimeService = tradingTimeService;
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

		StockTransaction tx = saveStockTransaction(user, stock, "BUY", request.quantity(), stock.getCurrentPrice(), gross, "PENDING");
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
		StockTransaction tx = saveStockTransaction(user, stock, "SELL", request.quantity(), stock.getCurrentPrice(), gross, "PENDING");
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
	public List<TransactionResponse> allTransactions() {
		return stockTransactionRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(this::toTransactionResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<TransactionResponse> pendingOrders() {
		return stockTransactionRepository.findByStatusOrderByCreatedAtDesc("PENDING").stream()
				.map(this::toTransactionResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<TransactionResponse> pendingOrdersForCompany(Long companyUserId) {
		findActiveInvestor(companyUserId);
		return stockTransactionRepository
				.findByStatusAndStockCreatedByIdOrderByCreatedAtDesc("PENDING", companyUserId)
				.stream()
				.map(this::toTransactionResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<TransactionResponse> companyTransactions(Long companyUserId) {
		findActiveInvestor(companyUserId);
		return stockTransactionRepository
				.findByStockCreatedByIdOrderByCreatedAtDesc(companyUserId)
				.stream()
				.map(this::toTransactionResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public WalletResponse wallet(Long userId) {
		return toWalletResponse(findWallet(userId));
	}

	public TopUpSessionResponse createTopUpSession(TopUpSessionRequest request) {
		findWallet(request.userId());
		String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
		LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);
		topUpSessions.put(token, new TopUpSession(request.userId(), request.amount(), expiresAt));
		return new TopUpSessionResponse(token, "/owner/topup/" + token, request.amount(), expiresAt);
	}

	@Transactional
	public WalletResponse completeTopUp(String token) {
		TopUpSession session = topUpSessions.remove(token);
		if (session == null) {
			throw new IllegalArgumentException("Top up link is invalid or already used");
		}
		if (LocalDateTime.now().isAfter(session.expiresAt())) {
			throw new IllegalArgumentException("Top up link has expired");
		}

		Wallet wallet = findWallet(session.userId());
		BigDecimal before = wallet.getBalance();
		wallet.setBalance(before.add(session.amount()));
		wallet.setUpdatedAt(LocalDateTime.now());
		Wallet saved = walletRepository.save(wallet);
		saveWalletTransaction(saved, "TOPUP", session.amount(), before, saved.getBalance(), "QR_TOPUP", null);
		return toWalletResponse(saved);
	}

	@Transactional
	public TradeResponse approveOrder(Long orderId) {
		StockTransaction tx = stockTransactionRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (!"PENDING".equals(normalizedStatus(tx))) {
			throw new IllegalArgumentException("Only pending orders can be approved");
		}
		if ("BUY".equals(tx.getType())) {
			return executeApprovedBuy(tx);
		}
		if ("SELL".equals(tx.getType())) {
			return executeApprovedSell(tx);
		}
		throw new IllegalArgumentException("Unsupported order type: " + tx.getType());
	}

	@Transactional
	public TradeResponse approveOrder(Long orderId, Long companyUserId) {
		StockTransaction tx = findCompanyOrder(orderId, companyUserId);
		if ("BUY".equals(tx.getType())) return executeApprovedBuy(tx);
		if ("SELL".equals(tx.getType())) return executeApprovedSell(tx);
		throw new IllegalArgumentException("Unsupported order type: " + tx.getType());
	}

	@Transactional
	public TransactionResponse rejectOrder(Long orderId) {
		StockTransaction tx = stockTransactionRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (!"PENDING".equals(normalizedStatus(tx))) {
			throw new IllegalArgumentException("Only pending orders can be rejected");
		}
		tx.setStatus("REJECTED");
		tx.setApprovedAt(LocalDateTime.now());
		return toTransactionResponse(stockTransactionRepository.save(tx));
	}

	@Transactional
	public TransactionResponse rejectOrder(Long orderId, Long companyUserId) {
		StockTransaction tx = findCompanyOrder(orderId, companyUserId);
		tx.setStatus("REJECTED");
		tx.setApprovedAt(LocalDateTime.now());
		return toTransactionResponse(stockTransactionRepository.save(tx));
	}

	private StockTransaction findCompanyOrder(Long orderId, Long companyUserId) {
		findActiveInvestor(companyUserId);
		StockTransaction tx = stockTransactionRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (!"PENDING".equals(normalizedStatus(tx))) {
			throw new IllegalArgumentException("Only pending orders can be processed");
		}
		User company = tx.getStock().getCreatedBy();
		if (company == null || !companyUserId.equals(company.getId())) {
			throw new IllegalArgumentException("This order does not belong to your company");
		}
		return tx;
	}

	private User findActiveInvestor(Long userId) {
		User user = findUser(userId);
		boolean investor = user.getRoles().stream().anyMatch(role -> "INVESTOR".equals(role.getName()));
		if (!investor || !"ACTIVE".equalsIgnoreCase(user.getStatus())) {
			throw new IllegalArgumentException("Active INVESTOR account is required");
		}
		return user;
	}

	private TradeResponse executeApprovedBuy(StockTransaction tx) {
		User user = tx.getUser();
		Wallet wallet = findWallet(user.getId());
		BigDecimal gross = tx.getTotalAmount();
		BigDecimal fee = fee(gross);
		BigDecimal net = gross.add(fee);
		if (wallet.getBalance().compareTo(net) < 0) {
			throw new IllegalArgumentException("Insufficient balance at approval time");
		}

		BigDecimal before = wallet.getBalance();
		wallet.setBalance(before.subtract(net));
		wallet.setUpdatedAt(LocalDateTime.now());
		walletRepository.save(wallet);

		PortfolioHolding holding = holdingRepository.findByUserIdAndStockId(user.getId(), tx.getStock().getId())
				.orElseGet(() -> newHolding(user, tx.getStock()));
		BigDecimal oldCost = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
		long newQuantity = holding.getQuantity() + tx.getQuantity();
		holding.setQuantity(newQuantity);
		holding.setAverageBuyPrice(oldCost.add(gross).divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP));
		holding.setUpdatedAt(LocalDateTime.now());
		holdingRepository.save(holding);

		tx.setStatus("APPROVED");
		tx.setApprovedAt(LocalDateTime.now());
		StockTransaction saved = stockTransactionRepository.save(tx);
		saveWalletTransaction(wallet, "BUY", net.negate(), before, wallet.getBalance(), "STOCK_TRANSACTION", saved.getId());
		return toTradeResponse(saved, fee, net, wallet.getBalance());
	}

	private TradeResponse executeApprovedSell(StockTransaction tx) {
		User user = tx.getUser();
		Wallet wallet = findWallet(user.getId());
		PortfolioHolding holding = holdingRepository.findByUserIdAndStockId(user.getId(), tx.getStock().getId())
				.orElseThrow(() -> new IllegalArgumentException("Seller does not own this stock anymore"));
		if (holding.getQuantity() < tx.getQuantity()) {
			throw new IllegalArgumentException("Not enough stock quantity at approval time");
		}

		BigDecimal gross = tx.getTotalAmount();
		BigDecimal fee = fee(gross);
		BigDecimal net = gross.subtract(fee);
		BigDecimal before = wallet.getBalance();
		wallet.setBalance(before.add(net));
		wallet.setUpdatedAt(LocalDateTime.now());
		walletRepository.save(wallet);

		holding.setQuantity(holding.getQuantity() - tx.getQuantity());
		holding.setUpdatedAt(LocalDateTime.now());
		if (holding.getQuantity() == 0) {
			holdingRepository.delete(holding);
		} else {
			holdingRepository.save(holding);
		}

		tx.setStatus("APPROVED");
		tx.setApprovedAt(LocalDateTime.now());
		StockTransaction saved = stockTransactionRepository.save(tx);
		saveWalletTransaction(wallet, "SELL", net, before, wallet.getBalance(), "STOCK_TRANSACTION", saved.getId());
		return toTradeResponse(saved, fee, net, wallet.getBalance());
	}

	private void assertTradingHours() {
		tradingTimeService.assertOpen("Trading");
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

	private StockTransaction saveStockTransaction(User user, Stock stock, String type, Long quantity, BigDecimal price, BigDecimal gross, String status) {
		StockTransaction tx = new StockTransaction();
		tx.setUser(user);
		tx.setStock(stock);
		tx.setType(type);
		tx.setQuantity(quantity);
		tx.setPrice(price);
		tx.setTotalAmount(gross);
		tx.setStatus(status);
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
				normalizedStatus(tx),
				tx.getUser().getId(),
				tx.getUser().getUsername(),
				tx.getStock().getSymbol(),
				tx.getQuantity(),
				tx.getPrice(),
				tx.getTotalAmount(),
				tx.getCreatedAt()
		);
	}

	private String normalizedStatus(StockTransaction tx) {
		return tx.getStatus() == null || tx.getStatus().isBlank() ? "APPROVED" : tx.getStatus();
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

	private record TopUpSession(Long userId, BigDecimal amount, LocalDateTime expiresAt) {
	}
}
