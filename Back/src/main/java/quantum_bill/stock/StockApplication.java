package quantum_bill.stock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = {
		"quantum_bill.stock.admin.repository",
		"quantum_bill.stock.investor.repository",
		"quantum_bill.stock.owner.repository"
})
@EnableMongoRepositories(basePackages = {
		"quantum_bill.stock.owner.mongo",
		"quantum_bill.stock.common.repository"
})
public class StockApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockApplication.class, args);
	}
}
