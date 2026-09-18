package com.valuelens.ai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OtpResendRequestDto {

    @NotBlank(message = "Work email is required")
    @Email(message = "Invalid work email format")
    private String email;

    public OtpResendRequestDto() {}

    public OtpResendRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
