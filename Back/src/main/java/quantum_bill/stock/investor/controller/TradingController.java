package quantum_bill.stock.investor.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import quantum_bill.stock.investor.dto.*;
import quantum_bill.stock.investor.service.TradingService;

import java.util.List;

@RestController
@RequestMapping("/api/trading")
public class TradingController {
	private final TradingService tradingService;

	public TradingController(TradingService tradingService) {
		this.tradingService = tradingService;
	}

	@PostMapping("/buy")
	public TradeResponse buy(@Valid @RequestBody TradeRequest request) {
		return tradingService.buy(request);
	}

	@PostMapping("/sell")
	public TradeResponse sell(@Valid @RequestBody TradeRequest request) {
		return tradingService.sell(request);
	}

	@GetMapping("/wallet/{userId}")
	public WalletResponse wallet(@PathVariable Long userId) {
		return tradingService.wallet(userId);
	}

	@GetMapping("/portfolio/{userId}")
	public PortfolioSummaryResponse portfolio(@PathVariable Long userId) {
		return tradingService.portfolio(userId);
	}

	@GetMapping("/transactions/{userId}")
	public List<TransactionResponse> transactions(@PathVariable Long userId) {
		return tradingService.transactionHistory(userId);
	}

	@GetMapping("/transactions")
	public List<TransactionResponse> allTransactions() {
		return tradingService.allTransactions();
	}

	@GetMapping("/orders/pending")
	public List<TransactionResponse> pendingOrders() {
		return tradingService.pendingOrders();
	}

	@PostMapping("/orders/{orderId}/approve")
	public TradeResponse approveOrder(@PathVariable Long orderId) {
		return tradingService.approveOrder(orderId);
	}

	@PostMapping("/orders/{orderId}/reject")
	public TransactionResponse rejectOrder(@PathVariable Long orderId) {
		return tradingService.rejectOrder(orderId);
	}

	@GetMapping("/ranking")
	public List<RankingResponse> ranking() {
		return tradingService.ranking();
	}

	@PostMapping("/topup-sessions")
	public TopUpSessionResponse createTopUpSession(@Valid @RequestBody TopUpSessionRequest request) {
		return tradingService.createTopUpSession(request);
	}

	@PostMapping("/topup-sessions/{token}/complete")
	public WalletResponse completeTopUp(@PathVariable String token) {
		return tradingService.completeTopUp(token);
	}
}
