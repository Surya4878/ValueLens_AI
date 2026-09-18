package com.valuelens.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.auth.otp-expiration-minutes:10}")
    private int otpExpirationMinutes;

    @Value("${app.auth.otp-resend-cooldown-seconds:60}")
    private int resendCooldownSeconds;

    @Value("${app.auth.otp-max-attempts:5}")
    private int maxAttempts;

    /**
     * Generates a cryptographically secure 6-digit OTP code (e.g. "492815")
     */
    public String generateOtpCode() {
        int number = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(number);
    }

    /**
     * Hashes the 6-digit OTP code using BCrypt before database persistence
     */
    public String hashOtp(String otp) {
        return passwordEncoder.encode(otp);
    }

    /**
     * Checks if a user-supplied OTP matches the stored BCrypt hash
     */
    public boolean verifyOtpHash(String rawOtp, String hashedOtp) {
        if (rawOtp == null || hashedOtp == null) return false;
        return passwordEncoder.matches(rawOtp, hashedOtp);
    }

    public LocalDateTime calculateExpiry() {
        return LocalDateTime.now().plusMinutes(otpExpirationMinutes);
    }

    public boolean isExpired(LocalDateTime expiresAt) {
        return expiresAt == null || LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isCooldownActive(LocalDateTime lastSentAt) {
        if (lastSentAt == null) return false;
        return LocalDateTime.now().isBefore(lastSentAt.plusSeconds(resendCooldownSeconds));
    }

    public long getRemainingCooldownSeconds(LocalDateTime lastSentAt) {
        if (lastSentAt == null) return 0;
        LocalDateTime cooldownEnd = lastSentAt.plusSeconds(resendCooldownSeconds);
        long diff = java.time.Duration.between(LocalDateTime.now(), cooldownEnd).getSeconds();
        return Math.max(0, diff);
    }

    public boolean hasExceededMaxAttempts(int attempts) {
        return attempts >= maxAttempts;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public int getResendCooldownSeconds() {
        return resendCooldownSeconds;
    }
}
