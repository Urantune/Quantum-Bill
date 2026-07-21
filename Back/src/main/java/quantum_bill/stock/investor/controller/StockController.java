package quantum_bill.stock.investor.controller;

import quantum_bill.stock.investor.dto.request.StockRequestDTO;
import quantum_bill.stock.investor.dto.response.StockResponseDTO;
import quantum_bill.stock.investor.service.IStockService;
import quantum_bill.stock.investor.service.MarketSimulationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {

    private final IStockService stockService;
    private final MarketSimulationService marketSimulationService;

    public StockController(IStockService stockService, MarketSimulationService marketSimulationService) {
        this.stockService = stockService;
        this.marketSimulationService = marketSimulationService;
    }

    @GetMapping
//    @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER')")
    public Page<StockResponseDTO> getAllStocks(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stockService.findAll(pageable);
    }

    @GetMapping("/active")
    public List<StockResponseDTO> getActiveStocks(@RequestParam(required = false) String q) {
        return stockService.findActive(q);
    }

    @GetMapping("/company/{userId}")
    public List<StockResponseDTO> getCompanyStocks(@PathVariable Long userId) {
        return stockService.findByCompanyUser(userId);
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER')")
    public StockResponseDTO getStockById(@PathVariable Long id) {
        return stockService.findById(id);
    }

    @PostMapping
//    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public StockResponseDTO saveStock(@Valid @RequestBody StockRequestDTO stockRequestDTO) {
        return stockService.save(stockRequestDTO);
    }

    @PostMapping("/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public StockResponseDTO submitStock(@Valid @RequestBody StockRequestDTO stockRequestDTO) {
        return stockService.submitForApproval(stockRequestDTO);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public StockResponseDTO updateStock(@PathVariable Long id, @Valid @RequestBody StockRequestDTO stockRequestDTO) {
        return stockService.update(id, stockRequestDTO);
    }

    @PutMapping("/{id}/set-price")
    public StockResponseDTO setStockPrice(
            @PathVariable Long id,
            @RequestParam Long companyUserId,
            @RequestParam BigDecimal price) {
        return stockService.setPrice(id, companyUserId, price);
    }

    @GetMapping("/{id}/reference-price")
    public Map<String, BigDecimal> getReferencePrice(@PathVariable Long id) {
        BigDecimal ref = marketSimulationService.getReferencePrice(id);
        return Map.of("referencePrice", ref, "maxPrice", ref.multiply(new BigDecimal("1.09")), "minPrice", ref.multiply(new BigDecimal("0.91")));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStock(@PathVariable Long id, @RequestParam Long companyUserId) {
        stockService.delete(id, companyUserId);
    }
}
