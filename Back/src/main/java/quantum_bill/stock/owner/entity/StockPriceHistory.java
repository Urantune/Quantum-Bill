package quantum_bill.stock.owner.entity;

import quantum_bill.stock.admin.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "stock_price_histories")
public class StockPriceHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "stock_id", nullable = false)
	private Stock stock;

	@Column(name = "old_price", nullable = false, precision = 19, scale = 2)
	private BigDecimal oldPrice;

	@Column(name = "new_price", nullable = false, precision = 19, scale = 2)
	private BigDecimal newPrice;

	@Column(name = "change_reason")
	private String changeReason;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "changed_by")
	private User changedBy;

	@Column(name = "created_at")
	private LocalDateTime createdAt;
}
