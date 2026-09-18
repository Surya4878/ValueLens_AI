package com.valuelens.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequestDto {

    @NotBlank(message = "Google credential token is required")
    private String credential;

    public GoogleAuthRequestDto() {}

    public GoogleAuthRequestDto(String credential) {
        this.credential = credential;
    }

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }
}
