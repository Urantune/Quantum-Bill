package quantum_bill.stock.common.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import quantum_bill.stock.common.dto.TradingTimeRequest;
import quantum_bill.stock.common.dto.TradingTimeResponse;
import quantum_bill.stock.common.service.TradingTimeService;

@RestController
@RequestMapping("/api/settime")
public class TradingTimeController {
	private final TradingTimeService tradingTimeService;

	public TradingTimeController(TradingTimeService tradingTimeService) {
		this.tradingTimeService = tradingTimeService;
	}

	@GetMapping
	public TradingTimeResponse current() {
		return tradingTimeService.current();
	}

	@PostMapping
	public TradingTimeResponse update(@Valid @RequestBody TradingTimeRequest request) {
		return tradingTimeService.update(request.openTime(), request.closeTime());
	}
}
