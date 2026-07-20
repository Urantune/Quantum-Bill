package quantum_bill.stock.admin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import quantum_bill.stock.admin.dto.AdjustWalletRequest;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.auth.dto.response.UserResponse;
import quantum_bill.stock.auth.service.AuthService;
import quantum_bill.stock.common.ApiMessage;
import quantum_bill.stock.investor.entity.Wallet;
import quantum_bill.stock.investor.entity.WalletTransaction;
import quantum_bill.stock.investor.dto.WalletResponse;
import quantum_bill.stock.investor.repository.WalletRepository;
import quantum_bill.stock.investor.repository.WalletTransactionRepository;
import quantum_bill.stock.owner.entity.Stock;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;
import quantum_bill.stock.owner.dto.response.StockResponseDTO;
import quantum_bill.stock.owner.repository.StockRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
	private final UserRepository userRepository;
	private final StockRepository stockRepository;
	private final WalletRepository walletRepository;
	private final WalletTransactionRepository walletTransactionRepository;
	private final AuthService authService;

	public AdminService(
			UserRepository userRepository,
			StockRepository stockRepository,
			WalletRepository walletRepository,
			WalletTransactionRepository walletTransactionRepository,
			AuthService authService
	) {
		this.userRepository = userRepository;
		this.stockRepository = stockRepository;
		this.walletRepository = walletRepository;
		this.walletTransactionRepository = walletTransactionRepository;
		this.authService = authService;
	}

	public List<UserResponse> getUsers() {
		return userRepository.findAll().stream()
				.map(authService::toResponse)
				.toList();
	}

	@Transactional
	public UserResponse approveOwner(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
		user.setStatus("ACTIVE");
		user.setUpdatedAt(LocalDateTime.now());
		User saved = userRepository.save(user);
		authService.assignRole(saved, "INVESTOR");
		return authService.toResponse(saved);
	}

	@Transactional
	public UserResponse changeUserStatus(Long userId, String status) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
		user.setStatus(status.trim().toUpperCase());
		user.setUpdatedAt(LocalDateTime.now());
		return authService.toResponse(userRepository.save(user));
	}

	@Transactional
	public StockResponseDTO approveStock(Long stockId) {
		Stock stock = stockRepository.findById(stockId)
				.orElseThrow(() -> new ResourceNotFoundException("Stock not found: " + stockId));
		stock.setStatus("ACTIVE");
		stock.setUpdatedAt(LocalDateTime.now());
		return toStockResponse(stockRepository.save(stock));
	}

	@Transactional
	public StockResponseDTO rejectStock(Long stockId) {
		Stock stock = stockRepository.findById(stockId)
				.orElseThrow(() -> new ResourceNotFoundException("Stock not found: " + stockId));
		stock.setStatus("REJECTED");
		stock.setUpdatedAt(LocalDateTime.now());
		return toStockResponse(stockRepository.save(stock));
	}

	@Transactional
	public WalletResponse adjustWallet(AdjustWalletRequest request) {
		Wallet wallet = walletRepository.findByUserId(request.userId())
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + request.userId()));
		var before = wallet.getBalance();
		wallet.setBalance(request.amount());
		wallet.setUpdatedAt(LocalDateTime.now());
		Wallet saved = walletRepository.save(wallet);

		WalletTransaction tx = new WalletTransaction();
		tx.setWallet(saved);
		tx.setType("ADMIN_ADJUST");
		tx.setAmount(request.amount().subtract(before));
		tx.setBalanceBefore(before);
		tx.setBalanceAfter(request.amount());
		tx.setReferenceType(request.reason() == null ? "ADMIN" : request.reason());
		tx.setCreatedAt(LocalDateTime.now());
		walletTransactionRepository.save(tx);

		return toWalletResponse(saved);
	}

	public ApiMessage health() {
		return new ApiMessage("Backend is running");
	}

	private StockResponseDTO toStockResponse(Stock stock) {
		return new StockResponseDTO(
				stock.getId(),
				stock.getSymbol(),
				stock.getCompanyName(),
				stock.getIndustry(),
				stock.getDescription(),
				stock.getCurrentPrice(),
				stock.getStatus(),
				stock.getCreatedAt()
		);
	}

	private WalletResponse toWalletResponse(Wallet wallet) {
		return new WalletResponse(wallet.getId(), wallet.getUser().getId(), wallet.getBalance(), wallet.getCurrency());
	}
}
