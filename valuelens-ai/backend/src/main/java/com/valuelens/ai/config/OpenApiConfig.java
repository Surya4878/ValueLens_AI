package com.valuelens.ai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI valueLensOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ValueLens AI API")
                        .description("AI-Powered Migration Economics & Decision Intelligence Engine for SAP Integration Suite transitions")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ValueLens Architecture Team")
                                .email("architecture@valuelens.ai"))
                        .license(new License()
                                .name("Enterprise Proprietary")));
    }
}
