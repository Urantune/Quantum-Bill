package quantum_bill.stock.owner.controller;

import quantum_bill.stock.owner.dto.request.StockRequestDTO;
import quantum_bill.stock.owner.dto.response.StockResponseDTO;
import quantum_bill.stock.owner.service.IStockService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final IStockService stockService;

    public StockController(IStockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
//    @PreAuthorize("hasAnyAuthority('ADMIN', 'CUSTOMER')")
    public Page<StockResponseDTO> getAllStocks(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stockService.findAll(pageable);
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

    @PutMapping("/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public StockResponseDTO updateStock(@PathVariable Long id, @Valid @RequestBody StockRequestDTO stockRequestDTO) {
        return stockService.update(id, stockRequestDTO);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStock(@PathVariable Long id) {
        stockService.delete(id);
    }
}