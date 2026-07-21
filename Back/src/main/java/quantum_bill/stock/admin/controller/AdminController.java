package quantum_bill.stock.admin.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import quantum_bill.stock.admin.dto.AdjustWalletRequest;
import quantum_bill.stock.admin.service.AdminService;
import quantum_bill.stock.auth.dto.response.UserResponse;
import quantum_bill.stock.common.ApiMessage;
import quantum_bill.stock.owner.dto.WalletResponse;
import quantum_bill.stock.investor.dto.response.StockResponseDTO;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/health")
	public ApiMessage health() {
		return adminService.health();
	}

	@GetMapping("/users")
	public List<UserResponse> getUsers() {
		return adminService.getUsers();
	}

	@PostMapping("/owners/{userId}/approve")
	public UserResponse approveOwner(@PathVariable Long userId) {
		return adminService.approveOwner(userId);
	}

	@PostMapping("/users/{userId}/status")
	public UserResponse changeUserStatus(@PathVariable Long userId, @RequestParam String status) {
		return adminService.changeUserStatus(userId, status);
	}

	@PostMapping("/stocks/{stockId}/approve")
	public StockResponseDTO approveStock(@PathVariable Long stockId) {
		return adminService.approveStock(stockId);
	}

	@PostMapping("/stocks/{stockId}/reject")
	public StockResponseDTO rejectStock(@PathVariable Long stockId) {
		return adminService.rejectStock(stockId);
	}

	@PostMapping("/wallets/adjust")
	public WalletResponse adjustWallet(@Valid @RequestBody AdjustWalletRequest request) {
		return adminService.adjustWallet(request);
	}
}
