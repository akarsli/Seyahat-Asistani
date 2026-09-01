package com.holidaytrip.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableRetry
public class HolidayTripApplication {

	public static void main(String[] args) {
		SpringApplication.run(HolidayTripApplication.class, args);
	}
}
