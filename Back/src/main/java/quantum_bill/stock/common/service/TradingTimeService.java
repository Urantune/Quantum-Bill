package quantum_bill.stock.common.service;

import org.springframework.stereotype.Service;
import quantum_bill.stock.common.dto.TradingTimeResponse;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class TradingTimeService {
	private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

	private final AtomicReference<LocalTime> openTime = new AtomicReference<>(LocalTime.of(10, 0));
	private final AtomicReference<LocalTime> closeTime = new AtomicReference<>(LocalTime.of(18, 0));

	public TradingTimeResponse current() {
		return new TradingTimeResponse(format(openTime.get()), format(closeTime.get()), isOpen());
	}

	public TradingTimeResponse update(String open, String close) {
		LocalTime parsedOpen = parse(open, "openTime");
		LocalTime parsedClose = parse(close, "closeTime");
		if (!parsedOpen.isBefore(parsedClose)) {
			throw new IllegalArgumentException("openTime must be before closeTime");
		}
		openTime.set(parsedOpen);
		closeTime.set(parsedClose);
		return current();
	}

	public boolean isOpen() {
		LocalTime now = LocalTime.now();
		LocalTime open = openTime.get();
		LocalTime close = closeTime.get();
		return !now.isBefore(open) && !now.isAfter(close);
	}

	public void assertOpen(String subject) {
		if (!isOpen()) {
			throw new IllegalStateException(subject + " is only allowed from " + format(openTime.get()) + " to " + format(closeTime.get()));
		}
	}

	private LocalTime parse(String value, String fieldName) {
		try {
			return LocalTime.parse(value, TIME_FORMAT);
		} catch (DateTimeParseException ex) {
			throw new IllegalArgumentException(fieldName + " must use HH:mm format");
		}
	}

	private String format(LocalTime time) {
		return time.format(TIME_FORMAT);
	}
}
