package com.valuelens.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ValueLensBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(ValueLensBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ValueLensBackendApplication.class, args);
        log.info("===============================================================");
        log.info(" VALUE LENS AI BACKEND STARTED SUCCESSFULLY");
        log.info(" Swagger UI: http://localhost:8080/swagger-ui.html");
        log.info(" API Docs:   http://localhost:8080/v3/api-docs");
        log.info("===============================================================");
    }
}
