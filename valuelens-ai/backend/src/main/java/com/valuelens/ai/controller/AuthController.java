package com.valuelens.ai.controller;

import com.valuelens.ai.dto.*;
import com.valuelens.ai.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@Tag(name = "Authentication", description = "Email/password, OTP verification, Google GIS, Microsoft, and Session Management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/start")
    @Operation(summary = "Start email registration, generate OTP, and dispatch email")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> registerStart(@Valid @RequestBody RegisterStartRequestDto dto) {
        Map<String, Object> result = authService.registerStart(dto);
        return ResponseEntity.ok(ApiResponseDto.success("Verification code sent to your email", result));
    }

    @PostMapping("/register/verify")
    @Operation(summary = "Verify OTP code and create permanent user account with session")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> registerVerify(@Valid @RequestBody RegisterVerifyRequestDto dto,
                                                                          HttpServletResponse response) {
        UserResponseDto user = authService.registerVerify(dto, response);
        return ResponseEntity.ok(ApiResponseDto.success("Email verified and account created successfully", user));
    }

    @PostMapping("/otp/resend")
    @Operation(summary = "Resend OTP verification code with 60s cooldown protection")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> resendOtp(@Valid @RequestBody OtpResendRequestDto dto) {
        Map<String, Object> result = authService.resendOtp(dto);
        return ResponseEntity.ok(ApiResponseDto.success("Verification code resent successfully", result));
    }

    @PostMapping("/login")
    @Operation(summary = "Email/password login (No OTP required once verified)")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> login(@Valid @RequestBody LoginRequestDto dto,
                                                                 HttpServletResponse response) {
        UserResponseDto user = authService.login(dto, response);
        return ResponseEntity.ok(ApiResponseDto.success("Signed in successfully", user));
    }

    @PostMapping("/google")
    @Operation(summary = "Authenticate with official Google Identity Services credential (No OTP)")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> googleAuth(@Valid @RequestBody GoogleAuthRequestDto dto,
                                                                      HttpServletResponse response) {
        UserResponseDto user = authService.googleAuth(dto, response);
        return ResponseEntity.ok(ApiResponseDto.success("Google authentication successful", user));
    }

    @PostMapping("/microsoft")
    @Operation(summary = "Authenticate with Microsoft Entra ID (No OTP)")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> microsoftAuth(@Valid @RequestBody MicrosoftAuthRequestDto dto,
                                                                         HttpServletResponse response) {
        UserResponseDto user = authService.microsoftAuth(dto, response);
        return ResponseEntity.ok(ApiResponseDto.success("Microsoft authentication successful", user));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> getMe(HttpServletRequest request) {
        UserResponseDto user = authService.getAuthenticatedUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponseDto.success("Authenticated user retrieved", user));
    }

    @GetMapping("/status")
    @Operation(summary = "Check authentication status")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> authStatus(HttpServletRequest request) {
        UserResponseDto user = authService.getAuthenticatedUser(request);
        boolean authenticated = (user != null);
        Map<String, Object> statusMap = new java.util.HashMap<>();
        statusMap.put("authenticated", authenticated);
        if (authenticated) {
            statusMap.put("user", user);
        }
        return ResponseEntity.ok(ApiResponseDto.success("Authentication status", statusMap));
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out user and clear session cookie")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponseDto.success("Logged out successfully", Map.of("message", "Session terminated")));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset link (anti-enumeration protected)")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto dto) {
        Map<String, Object> result = authService.forgotPassword(dto);
        return ResponseEntity.ok(ApiResponseDto.success(result.get("message").toString(), result));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using single-use token")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto dto) {
        Map<String, Object> result = authService.resetPassword(dto);
        return ResponseEntity.ok(ApiResponseDto.success(result.get("message").toString(), result));
    }
}
