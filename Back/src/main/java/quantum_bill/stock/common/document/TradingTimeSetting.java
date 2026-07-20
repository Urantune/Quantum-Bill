package quantum_bill.stock.common.document;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "timeset")
public class TradingTimeSetting {
	@Id
	private String id;

	private String timeSet;

	private LocalDateTime date;
}
