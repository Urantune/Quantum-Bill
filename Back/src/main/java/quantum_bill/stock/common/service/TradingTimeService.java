package quantum_bill.stock.common.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import quantum_bill.stock.common.document.TradingTimeSetting;
import quantum_bill.stock.common.dto.TradingTimeResponse;
import quantum_bill.stock.common.repository.TradingTimeSettingRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class TradingTimeService {
	private static final String SETTING_ID = "MARKET_TRADING_TIME";
	private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");
	private final TradingTimeSettingRepository repository;
	private final AtomicReference<LocalTime> openTime = new AtomicReference<>(LocalTime.of(10, 0));
	private final AtomicReference<LocalTime> closeTime = new AtomicReference<>(LocalTime.of(18, 0));
	private final AtomicReference<LocalDateTime> updatedAt = new AtomicReference<>();

	public TradingTimeService(TradingTimeSettingRepository repository) {
		this.repository = repository;
	}

	@PostConstruct
	public void initialize() {
		TradingTimeSetting setting = repository.findById(SETTING_ID).orElseGet(this::createDefaultSetting);
		// Re-saving also removes obsolete fields from the singleton Mongo document.
		setting = repository.save(setting);
		apply(setting);
	}

	public TradingTimeResponse current() {
		repository.findById(SETTING_ID).ifPresent(this::apply);
		return response();
	}

	public TradingTimeResponse update(String open, String close) {
		LocalTime parsedOpen = parse(open, "openTime");
		LocalTime parsedClose = parse(close, "closeTime");
		if (!parsedOpen.isBefore(parsedClose)) {
			throw new IllegalArgumentException("openTime must be before closeTime");
		}
		TradingTimeSetting setting = repository.findById(SETTING_ID).orElseGet(this::newDefaultSetting);
		String nextTimeSet = format(parsedOpen) + "-" + format(parsedClose);
		boolean changed = !nextTimeSet.equals(setting.getTimeSet());

		if (changed) {
			setting.setTimeSet(nextTimeSet);
			setting.setDate(LocalDateTime.now());
			setting = repository.save(setting);
		}

		apply(setting);
		return response();
	}

	public boolean isOpen() {
		LocalDateTime now = LocalDateTime.now();
		return !now.toLocalTime().isBefore(openTime.get())
				&& !now.toLocalTime().isAfter(closeTime.get());
	}

	public void assertOpen(String subject) {
		if (!isOpen()) {
			throw new IllegalStateException(subject + " is only allowed from "
					+ format(openTime.get()) + " to " + format(closeTime.get()));
		}
	}

	private TradingTimeSetting createDefaultSetting() {
		return repository.save(newDefaultSetting());
	}

	private TradingTimeSetting newDefaultSetting() {
		TradingTimeSetting setting = new TradingTimeSetting();
		setting.setId(SETTING_ID);
		setting.setTimeSet("10:00-18:00");
		setting.setDate(LocalDateTime.now());
		return setting;
	}

	private void apply(TradingTimeSetting setting) {
		String[] range = setting.getTimeSet().split("-", 2);
		openTime.set(parse(range[0], "timeSet"));
		closeTime.set(parse(range[1], "timeSet"));
		updatedAt.set(setting.getDate());
	}

	private TradingTimeResponse response() {
		return new TradingTimeResponse(
				format(openTime.get()),
				format(closeTime.get()),
				isOpen(),
				updatedAt.get() == null ? null : updatedAt.get().toString()
		);
	}

	private LocalTime parse(String value, String fieldName) {
		try {
			return LocalTime.parse(value, TIME_FORMAT);
		} catch (DateTimeParseException | NullPointerException ex) {
			throw new IllegalArgumentException(fieldName + " must use HH:mm format");
		}
	}

	private String format(LocalTime time) {
		return time.format(TIME_FORMAT);
	}
}
