package quantum_bill.stock.auth.dto.response;

import quantum_bill.stock.investor.dto.response.StockResponseDTO;

public record CompanyListingRegistrationResponse(
        UserResponse account,
        StockResponseDTO stock
) {
}
