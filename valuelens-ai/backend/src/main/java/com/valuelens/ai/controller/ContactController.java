package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.dto.ContactRequestDto;
import com.valuelens.ai.service.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);
    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/request-demo")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> requestDemo(@Valid @RequestBody ContactRequestDto dto) {
        log.info("Inbound demo request from: {} ({})", dto.getFullName(), dto.getEmail());
        emailService.sendContactOrDemoRequest(
                dto.getFullName(),
                dto.getEmail(),
                dto.getCompanyName(),
                dto.getPhone(),
                dto.getRequestType() != null && !dto.getRequestType().isBlank() ? dto.getRequestType() : "Request a Demo",
                dto.getMessage(),
                dto.getSourcePage() != null && !dto.getSourcePage().isBlank() ? dto.getSourcePage() : "/intswitch"
        );

        return ResponseEntity.ok(ApiResponseDto.success(
                "Thank you! Your demo request has been sent to our migration specialists. We will reach out shortly.",
                Map.of(
                    "success", true,
                    "email", dto.getEmail()
                )
        ));
    }

    @PostMapping("/inquiry")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> contactInquiry(@Valid @RequestBody ContactRequestDto dto) {
        log.info("Inbound contact inquiry from: {} ({})", dto.getFullName(), dto.getEmail());
        emailService.sendContactOrDemoRequest(
                dto.getFullName(),
                dto.getEmail(),
                dto.getCompanyName(),
                dto.getPhone(),
                dto.getRequestType() != null && !dto.getRequestType().isBlank() ? dto.getRequestType() : "Contact Us",
                dto.getMessage(),
                dto.getSourcePage() != null && !dto.getSourcePage().isBlank() ? dto.getSourcePage() : "Website"
        );

        return ResponseEntity.ok(ApiResponseDto.success(
                "Thank you! Your inquiry has been sent. Our team will contact you promptly.",
                Map.of(
                    "success", true,
                    "email", dto.getEmail()
                )
        ));
    }
}
