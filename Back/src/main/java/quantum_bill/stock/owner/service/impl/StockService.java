package quantum_bill.stock.owner.service.impl;

import quantum_bill.stock.owner.dto.request.StockRequestDTO;
import quantum_bill.stock.owner.dto.response.StockResponseDTO;
import quantum_bill.stock.owner.document.StockPriceHistory;
import quantum_bill.stock.owner.entity.Stock;
import quantum_bill.stock.owner.mongo.StockPriceHistoryRepository;
import quantum_bill.stock.owner.repository.StockRepository;
import quantum_bill.stock.owner.service.IStockService;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class StockService implements IStockService {

    private final StockRepository stockRepository;
    private final StockPriceHistoryRepository stockPriceHistoryRepository;

    public StockService(StockRepository stockRepository, StockPriceHistoryRepository stockPriceHistoryRepository) {
        this.stockRepository = stockRepository;
        this.stockPriceHistoryRepository = stockPriceHistoryRepository;
    }

    @Override
    public Page<StockResponseDTO> findAll(Pageable pageable) {
        return stockRepository.findAll(pageable)
                .map(this::toResponseDTO);
    }

    @Override
    public StockResponseDTO findById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));
        return toResponseDTO(stock);
    }

    @Override
    public StockResponseDTO save(StockRequestDTO stockRequestDTO) {

        Stock stock = new Stock();
        stock.setSymbol(stockRequestDTO.symbol().toUpperCase().trim());
        stock.setCompanyName(stockRequestDTO.companyName());
        stock.setIndustry(stockRequestDTO.industry());
        stock.setDescription(stockRequestDTO.description());
        stock.setCurrentPrice(stockRequestDTO.currentPrice());
        stock.setStatus(stockRequestDTO.status() != null ? stockRequestDTO.status() : "ACTIVE");
        stock.setCreatedAt(LocalDateTime.now());
        stock.setUpdatedAt(LocalDateTime.now());

        Stock savedStock = stockRepository.save(stock);
        return toResponseDTO(savedStock);
    }

    @Override
    public StockResponseDTO update(Long id, StockRequestDTO stockRequestDTO) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));

        BigDecimal oldPrice = stock.getCurrentPrice();
        BigDecimal newPrice = stockRequestDTO.currentPrice();

        stock.setSymbol(stockRequestDTO.symbol().toUpperCase().trim());
        stock.setCompanyName(stockRequestDTO.companyName());
        stock.setIndustry(stockRequestDTO.industry());
        stock.setDescription(stockRequestDTO.description());
        stock.setCurrentPrice(newPrice);
        if (stockRequestDTO.status() != null) {
            stock.setStatus(stockRequestDTO.status());
        }
        stock.setUpdatedAt(LocalDateTime.now());

        Stock updatedStock = stockRepository.save(stock);
        savePriceHistoryIfPriceChanged(updatedStock, oldPrice, newPrice, stockRequestDTO);
        return toResponseDTO(updatedStock);
    }

    @Override
    public void delete(Long id) {
        if (!stockRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stock not found with id: " + id);
        }
        stockRepository.deleteById(id);
    }

    private StockResponseDTO toResponseDTO(Stock stock) {
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

    private void savePriceHistoryIfPriceChanged(
            Stock stock,
            BigDecimal oldPrice,
            BigDecimal newPrice,
            StockRequestDTO stockRequestDTO
    ) {
        if (oldPrice == null || newPrice == null || oldPrice.compareTo(newPrice) == 0) {
            return;
        }

        BigDecimal changeAmount = newPrice.subtract(oldPrice);

        StockPriceHistory history = new StockPriceHistory();
        history.setStockId(stock.getId());
        history.setSymbol(stock.getSymbol());
        history.setOldPrice(oldPrice);
        history.setNewPrice(newPrice);
        history.setChangeAmount(changeAmount);
        history.setChangePercent(calculateChangePercent(oldPrice, changeAmount));
        history.setDirection(getDirection(changeAmount));
        history.setChangeReason("STOCK_PRICE_UPDATE");
        history.setChangedByUserId(stockRequestDTO.createdById());
        history.setRecordedAt(LocalDateTime.now());

        stockPriceHistoryRepository.save(history);
    }

    private BigDecimal calculateChangePercent(BigDecimal oldPrice, BigDecimal changeAmount) {
        if (oldPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return changeAmount
                .multiply(BigDecimal.valueOf(100))
                .divide(oldPrice, 4, RoundingMode.HALF_UP);
    }

    private String getDirection(BigDecimal changeAmount) {
        if (changeAmount.compareTo(BigDecimal.ZERO) > 0) {
            return "UP";
        }
        if (changeAmount.compareTo(BigDecimal.ZERO) < 0) {
            return "DOWN";
        }
        return "UNCHANGED";
    }
}
