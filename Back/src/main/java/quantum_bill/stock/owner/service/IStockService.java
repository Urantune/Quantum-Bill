package quantum_bill.stock.owner.service;

import quantum_bill.stock.owner.dto.request.StockRequestDTO;
import quantum_bill.stock.owner.dto.response.StockResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IStockService {

    Page<StockResponseDTO> findAll(Pageable pageable);

    List<StockResponseDTO> findActive(String keyword);

    StockResponseDTO findById(Long id);

    StockResponseDTO save(StockRequestDTO stockRequestDTO);

    StockResponseDTO submitForApproval(StockRequestDTO stockRequestDTO);

    StockResponseDTO update(Long id, StockRequestDTO stockRequestDTO);

    void delete(Long id);
}
