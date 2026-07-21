package quantum_bill.stock.investor.service;

import quantum_bill.stock.investor.dto.request.StockRequestDTO;
import quantum_bill.stock.investor.dto.response.StockResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface IStockService {

    Page<StockResponseDTO> findAll(Pageable pageable);

    List<StockResponseDTO> findActive(String keyword);

    List<StockResponseDTO> findByCompanyUser(Long userId);

    StockResponseDTO findById(Long id);

    StockResponseDTO save(StockRequestDTO stockRequestDTO);

    StockResponseDTO submitForApproval(StockRequestDTO stockRequestDTO);

    StockResponseDTO update(Long id, StockRequestDTO stockRequestDTO);

    StockResponseDTO setPrice(Long id, Long companyUserId, BigDecimal price);

    void delete(Long id, Long companyUserId);
}
