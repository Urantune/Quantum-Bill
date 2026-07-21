package quantum_bill.stock.investor.controller;

import org.springframework.web.bind.annotation.*;
import quantum_bill.stock.investor.document.StockPriceHistory;
import quantum_bill.stock.investor.dto.MarketSimulationResponse;
import quantum_bill.stock.investor.service.MarketSimulationService;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketController {
	private final MarketSimulationService marketSimulationService;

	public MarketController(MarketSimulationService marketSimulationService) {
		this.marketSimulationService = marketSimulationService;
	}

	@PostMapping("/simulate")
	public List<MarketSimulationResponse> simulate(@RequestParam(defaultValue = "false") boolean force) {
		return marketSimulationService.simulateMarketTick(force);
	}

	@GetMapping("/stocks/{stockId}/history")
	public List<StockPriceHistory> history(@PathVariable Long stockId) {
		return marketSimulationService.history(stockId);
	}
}
