package quantum_bill.stock.investor.document;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "stock_price_histories")
public class StockPriceHistory {
	@Id
	private String id;

	@Indexed
	private Long stockId;

	@Indexed
	private String symbol;

	private BigDecimal oldPrice;

	private BigDecimal newPrice;

	private BigDecimal changeAmount;

	private BigDecimal changePercent;

	private String direction;

	private String changeReason;

	private Long changedByUserId;

	@Indexed
	private LocalDateTime recordedAt;
}
