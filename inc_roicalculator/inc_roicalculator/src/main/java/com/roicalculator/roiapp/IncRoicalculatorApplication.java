package com.roicalculator.roiapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IncRoicalculatorApplication {

	private static final Logger log =
			LoggerFactory.getLogger(ROICalcController.class);

	public static void main(String[] args) {
		SpringApplication.run(IncRoicalculatorApplication.class, args);
		log.info("-----Application is Running------");
	}

}
