package com.valuelens.ai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequestDto {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address is required")
    private String email;

    @Size(max = 120, message = "Company name must not exceed 120 characters")
    private String companyName;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 100)
    private String requestType;

    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;

    @Size(max = 200)
    private String sourcePage;

    public ContactRequestDto() {}

    public ContactRequestDto(String fullName, String email, String companyName, String phone, String requestType, String message, String sourcePage) {
        this.fullName = fullName;
        this.email = email;
        this.companyName = companyName;
        this.phone = phone;
        this.requestType = requestType;
        this.message = message;
        this.sourcePage = sourcePage;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSourcePage() { return sourcePage; }
    public void setSourcePage(String sourcePage) { this.sourcePage = sourcePage; }
}
