package quantum_bill.stock.owner.service.impl;

import quantum_bill.stock.owner.dto.request.StockRequestDTO;
import quantum_bill.stock.owner.dto.response.StockResponseDTO;
import quantum_bill.stock.owner.entity.Stock;
import quantum_bill.stock.admin.entity.User;
import quantum_bill.stock.owner.repository.StockRepository;
import quantum_bill.stock.admin.repository.UserRepository;
import quantum_bill.stock.owner.service.IStockService;
import quantum_bill.stock.owner.exception.ResourceNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class StockService implements IStockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
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

        stock.setSymbol(stockRequestDTO.symbol().toUpperCase().trim());
        stock.setCompanyName(stockRequestDTO.companyName());
        stock.setIndustry(stockRequestDTO.industry());
        stock.setDescription(stockRequestDTO.description());
        stock.setCurrentPrice(stockRequestDTO.currentPrice());
        if (stockRequestDTO.status() != null) {
            stock.setStatus(stockRequestDTO.status());
        }
        stock.setUpdatedAt(LocalDateTime.now());

        Stock updatedStock = stockRepository.save(stock);
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
}