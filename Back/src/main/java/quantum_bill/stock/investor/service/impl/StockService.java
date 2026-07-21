package quantum_bill.stock.investor.service.impl;

import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.investor.dto.request.StockRequestDTO;
import quantum_bill.stock.investor.dto.response.StockResponseDTO;
import quantum_bill.stock.investor.document.StockPriceHistory;
import quantum_bill.stock.investor.entity.Stock;
import quantum_bill.stock.investor.mongo.StockPriceHistoryRepository;
import quantum_bill.stock.investor.repository.StockRepository;
import quantum_bill.stock.investor.service.IStockService;
import quantum_bill.stock.investor.exception.ResourceNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockService implements IStockService {

    private final StockRepository stockRepository;
    private final StockPriceHistoryRepository stockPriceHistoryRepository;
    private final UserRepository userRepository;

    public StockService(StockRepository stockRepository, StockPriceHistoryRepository stockPriceHistoryRepository, UserRepository userRepository) {
        this.stockRepository = stockRepository;
        this.stockPriceHistoryRepository = stockPriceHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Page<StockResponseDTO> findAll(Pageable pageable) {
        return stockRepository.findAll(pageable)
                .map(this::toResponseDTO);
    }

    @Override
    public List<StockResponseDTO> findActive(String keyword) {
        List<Stock> stocks;
        if (keyword == null || keyword.isBlank()) {
            stocks = stockRepository.findByStatus("ACTIVE");
        } else {
            stocks = stockRepository.findBySymbolContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(keyword, keyword)
                    .stream()
                    .filter(stock -> "ACTIVE".equals(stock.getStatus()))
                    .toList();
        }
        return stocks.stream().map(this::toResponseDTO).toList();
    }

    @Override
    public List<StockResponseDTO> findByCompanyUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return stockRepository.findByCreatedByIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponseDTO)
                .toList();
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
        stock.setCreatedBy(findCreator(stockRequestDTO.createdById()));
        stock.setCreatedAt(LocalDateTime.now());
        stock.setUpdatedAt(LocalDateTime.now());

        Stock savedStock = stockRepository.save(stock);
        return toResponseDTO(savedStock);
    }

    @Override
    public StockResponseDTO submitForApproval(StockRequestDTO stockRequestDTO) {
        Stock stock = new Stock();
        stock.setSymbol(stockRequestDTO.symbol().toUpperCase().trim());
        stock.setCompanyName(stockRequestDTO.companyName());
        stock.setIndustry(stockRequestDTO.industry());
        stock.setDescription(stockRequestDTO.description());
        stock.setCurrentPrice(stockRequestDTO.currentPrice());
        stock.setStatus("PENDING");
        stock.setCreatedBy(findCreator(stockRequestDTO.createdById()));
        stock.setCreatedAt(LocalDateTime.now());
        stock.setUpdatedAt(LocalDateTime.now());

        Stock savedStock = stockRepository.save(stock);
        return toResponseDTO(savedStock);
    }

    @Override
    public StockResponseDTO update(Long id, StockRequestDTO stockRequestDTO) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));

        if (stockRequestDTO.createdById() != null && stock.getCreatedBy() != null
                && !stockRequestDTO.createdById().equals(stock.getCreatedBy().getId())) {
            throw new IllegalArgumentException("You do not own this stock");
        }

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
    public StockResponseDTO setPrice(Long id, Long companyUserId, BigDecimal price) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));
        if (stock.getCreatedBy() == null || !companyUserId.equals(stock.getCreatedBy().getId())) {
            throw new IllegalArgumentException("You do not own this stock");
        }
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        BigDecimal oldPrice = stock.getCurrentPrice();
        stock.setCurrentPrice(price);
        stock.setUpdatedAt(LocalDateTime.now());
        Stock saved = stockRepository.save(stock);

        StockPriceHistory history = new StockPriceHistory();
        history.setStockId(saved.getId());
        history.setSymbol(saved.getSymbol());
        history.setOldPrice(oldPrice);
        history.setNewPrice(price);
        BigDecimal changeAmount = price.subtract(oldPrice);
        history.setChangeAmount(changeAmount);
        history.setChangePercent(calculateChangePercent(oldPrice, changeAmount));
        history.setDirection(getDirection(changeAmount));
        history.setChangeReason("MANUAL_PRICE_SET");
        history.setChangedByUserId(companyUserId);
        history.setRecordedAt(LocalDateTime.now());
        stockPriceHistoryRepository.save(history);

        return toResponseDTO(saved);
    }

    @Override
    public void delete(Long id, Long companyUserId) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + id));
        if (stock.getCreatedBy() == null || !companyUserId.equals(stock.getCreatedBy().getId())) {
            throw new IllegalArgumentException("You do not own this stock");
        }
        stockRepository.deleteById(id);
    }

    private quantum_bill.stock.admin.entity.User findCreator(Long userId) {
        if (userId == null) throw new IllegalArgumentException("createdById is required");
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
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
