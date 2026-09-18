package com.valuelens.ai.dto;

import java.time.LocalDateTime;

public class UserResponseDto {

    private String id;
    private String fullName;
    private String email;
    private String companyName;
    private String provider;
    private boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public UserResponseDto() {}

    public UserResponseDto(String id, String fullName, String email, String companyName, String provider, boolean emailVerified, LocalDateTime createdAt, LocalDateTime lastLoginAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.companyName = companyName;
        this.provider = provider;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
