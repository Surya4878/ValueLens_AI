package com.valuelens.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.*;
import com.valuelens.ai.model.EmailVerificationEntity;
import com.valuelens.ai.model.PasswordResetEntity;
import com.valuelens.ai.model.UserEntity;
import com.valuelens.ai.repository.EmailVerificationRepository;
import com.valuelens.ai.repository.PasswordResetRepository;
import com.valuelens.ai.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final JwtSessionService jwtSessionService;
    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final MicrosoftTokenVerifierService microsoftTokenVerifierService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.auth.google-client-id:}")
    private String googleClientId;

    @Autowired
    public AuthService(UserRepository userRepository,
                       EmailVerificationRepository emailVerificationRepository,
                       PasswordResetRepository passwordResetRepository,
                       OtpService otpService,
                       EmailService emailService,
                       JwtSessionService jwtSessionService,
                       @Autowired(required = false) GoogleTokenVerifierService googleTokenVerifierService,
                       @Autowired(required = false) MicrosoftTokenVerifierService microsoftTokenVerifierService) {
        this.userRepository = userRepository;
        this.emailVerificationRepository = emailVerificationRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.jwtSessionService = jwtSessionService;
        this.googleTokenVerifierService = googleTokenVerifierService;
        this.microsoftTokenVerifierService = microsoftTokenVerifierService;
    }

    public AuthService(UserRepository userRepository,
                       EmailVerificationRepository emailVerificationRepository,
                       PasswordResetRepository passwordResetRepository,
                       OtpService otpService,
                       EmailService emailService,
                       JwtSessionService jwtSessionService) {
        this(userRepository, emailVerificationRepository, passwordResetRepository, otpService, emailService, jwtSessionService, null, null);
    }

    /**
     * Step 1: Start Registration -> Stores Pending Verification with BCrypt OTP & dispatches Email
     */
    @Transactional
    public Map<String, Object> registerStart(RegisterStartRequestDto dto) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();

        // Check if an existing verified user already exists
        Optional<UserEntity> existingUser = userRepository.findByEmailIgnoreCase(normalizedEmail);
        if (existingUser.isPresent() && existingUser.get().isEmailVerified()) {
            throw new IllegalArgumentException("An account with this work email already exists. Please sign in.");
        }

        // Check cooldown on existing pending verification
        Optional<EmailVerificationEntity> existingVerification = emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(normalizedEmail);
        if (existingVerification.isPresent() && otpService.isCooldownActive(existingVerification.get().getLastSentAt())) {
            long remaining = otpService.getRemainingCooldownSeconds(existingVerification.get().getLastSentAt());
            throw new IllegalStateException("Please wait " + remaining + " seconds before requesting another verification code.");
        }

        // Generate 6-digit OTP and secure hash
        String rawOtp = otpService.generateOtpCode();
        String hashedOtp = otpService.hashOtp(rawOtp);
        String passwordHash = passwordEncoder.encode(dto.getPassword());

        EmailVerificationEntity verification = existingVerification.orElseGet(EmailVerificationEntity::new);
        if (verification.getId() == null) {
            verification.setId("ev-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        }
        verification.setEmail(normalizedEmail);
        verification.setOtpHash(hashedOtp);
        verification.setFullName(dto.getFullName().trim());
        verification.setCompanyName(dto.getCompanyName() != null ? dto.getCompanyName().trim() : null);
        verification.setPasswordHash(passwordHash);
        verification.setExpiresAt(otpService.calculateExpiry());
        verification.setAttempts(0);
        verification.setVerified(false);
        verification.setLastSentAt(LocalDateTime.now());

        emailVerificationRepository.save(verification);

        // Dispatch OTP via EmailService
        emailService.sendVerificationOtp(normalizedEmail, rawOtp);

        return Map.of(
                "success", true,
                "verificationRequired", true,
                "email", maskEmail(normalizedEmail),
                "expiresInMinutes", 10,
                "cooldownSeconds", otpService.getResendCooldownSeconds()
        );
    }

    /**
     * Step 2: Verify OTP -> Creates permanent User record & authenticates session
     */
    @Transactional
    public UserResponseDto registerVerify(RegisterVerifyRequestDto dto, HttpServletResponse response) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();
        String rawOtp = dto.getOtp().trim();

        EmailVerificationEntity verification = emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No pending verification found for this email. Please register again."));

        if (verification.isVerified()) {
            throw new IllegalArgumentException("Email has already been verified. Please sign in.");
        }

        if (otpService.isExpired(verification.getExpiresAt())) {
            throw new IllegalStateException("Verification code has expired. Please request a new code.");
        }

        if (otpService.hasExceededMaxAttempts(verification.getAttempts())) {
            throw new IllegalStateException("Too many verification attempts. Please request a new code.");
        }

        boolean isValid = otpService.verifyOtpHash(rawOtp, verification.getOtpHash());
        if (!isValid) {
            verification.setAttempts(verification.getAttempts() + 1);
            emailVerificationRepository.save(verification);
            int remaining = otpService.getMaxAttempts() - verification.getAttempts();
            throw new IllegalArgumentException("Invalid verification code. " + Math.max(0, remaining) + " attempts remaining.");
        }

        // Mark verification successful
        verification.setVerified(true);
        emailVerificationRepository.save(verification);

        // Create or update permanent User record
        UserEntity user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElseGet(UserEntity::new);
        if (user.getId() == null) {
            user.setId("usr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        }
        user.setFullName(verification.getFullName());
        user.setEmail(normalizedEmail);
        user.setCompanyName(verification.getCompanyName());
        user.setPasswordHash(verification.getPasswordHash());
        user.setProvider("EMAIL");
        user.setEmailVerified(true);
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserEntity savedUser = userRepository.save(user);

        // Issue JWT session
        String token = jwtSessionService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getProvider());
        jwtSessionService.setSessionCookie(response, token, true);

        // Send welcome email
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());

        return toUserResponseDto(savedUser);
    }

    /**
     * Resend 6-Digit OTP with 60s cooldown
     */
    @Transactional
    public Map<String, Object> resendOtp(OtpResendRequestDto dto) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();

        EmailVerificationEntity verification = emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("No pending verification found for this email."));

        if (verification.isVerified()) {
            throw new IllegalArgumentException("Email is already verified. Please sign in.");
        }

        if (otpService.isCooldownActive(verification.getLastSentAt())) {
            long remaining = otpService.getRemainingCooldownSeconds(verification.getLastSentAt());
            throw new IllegalStateException("Please wait " + remaining + " seconds before requesting another code.");
        }

        String rawOtp = otpService.generateOtpCode();
        String hashedOtp = otpService.hashOtp(rawOtp);

        verification.setOtpHash(hashedOtp);
        verification.setExpiresAt(otpService.calculateExpiry());
        verification.setAttempts(0);
        verification.setLastSentAt(LocalDateTime.now());
        emailVerificationRepository.save(verification);

        emailService.sendVerificationOtp(normalizedEmail, rawOtp);

        return Map.of(
                "success", true,
                "message", "Verification code resent successfully",
                "email", maskEmail(normalizedEmail),
                "cooldownSeconds", otpService.getResendCooldownSeconds()
        );
    }

    /**
     * Normal Email/Password Login (NO OTP required once verified)
     */
    @Transactional
    public UserResponseDto login(LoginRequestDto dto, HttpServletResponse response) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();

        UserEntity user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Check if verified
        if (!user.isEmailVerified()) {
            throw new IllegalStateException("UNVERIFIED_EMAIL: Your email has not been verified. Please complete verification.");
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtSessionService.generateToken(user.getId(), user.getEmail(), user.getFullName(), user.getProvider());
        jwtSessionService.setSessionCookie(response, token, dto.isRememberMe());

        return toUserResponseDto(user);
    }

    /**
     * Google Authentication via official Google Identity Services credential
     */
    @Transactional
    public UserResponseDto googleAuth(GoogleAuthRequestDto dto, HttpServletResponse response) {
        if (googleTokenVerifierService == null) {
            throw new IllegalStateException("Google authentication verifier service is not configured.");
        }

        try {
            GoogleTokenVerifierService.VerifiedGoogleUser verified = googleTokenVerifierService.verifyToken(dto.getCredential());
            String email = verified.email();
            String name = verified.name();
            String googleSub = verified.sub();

            Optional<UserEntity> existingUser = userRepository.findByEmailIgnoreCase(email);
            UserEntity user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (user.getProviderUserId() == null) {
                    user.setProviderUserId(googleSub);
                }
                user.setEmailVerified(true);
            } else {
                user = new UserEntity();
                user.setId("usr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
                user.setEmail(email);
                user.setFullName(name);
                user.setProvider("GOOGLE");
                user.setProviderUserId(googleSub);
                user.setEmailVerified(true);
            }

            user.setLastLoginAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            UserEntity savedUser = userRepository.save(user);

            String token = jwtSessionService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getProvider());
            jwtSessionService.setSessionCookie(response, token, true);

            return toUserResponseDto(savedUser);
        } catch (IllegalArgumentException iae) {
            throw iae;
        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            throw new IllegalArgumentException("Google sign-in failed: " + e.getMessage());
        }
    }

    /**
     * Microsoft Authentication via Microsoft Entra ID
     */
    @Transactional
    public UserResponseDto microsoftAuth(MicrosoftAuthRequestDto dto, HttpServletResponse response) {
        if (microsoftTokenVerifierService == null) {
            throw new IllegalStateException("Microsoft authentication verifier service is not configured.");
        }

        try {
            MicrosoftTokenVerifierService.VerifiedMicrosoftUser verified = microsoftTokenVerifierService.verifyToken(dto.getToken());
            String email = verified.email();
            String name = verified.name();
            String msSub = verified.sub();

            Optional<UserEntity> existingUser = userRepository.findByEmailIgnoreCase(email);
            UserEntity user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (user.getProviderUserId() == null) {
                    user.setProviderUserId(msSub);
                }
                user.setEmailVerified(true);
            } else {
                user = new UserEntity();
                user.setId("usr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
                user.setEmail(email);
                user.setFullName(name);
                user.setProvider("MICROSOFT");
                user.setProviderUserId(msSub);
                user.setEmailVerified(true);
            }

            user.setLastLoginAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            UserEntity savedUser = userRepository.save(user);

            String token = jwtSessionService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getProvider());
            jwtSessionService.setSessionCookie(response, token, true);

            return toUserResponseDto(savedUser);
        } catch (IllegalArgumentException iae) {
            throw iae;
        } catch (Exception e) {
            log.error("Microsoft authentication failed: {}", e.getMessage());
            throw new IllegalArgumentException("Microsoft sign-in failed: " + e.getMessage());
        }
    }

    /**
     * Forgot Password (Rate-Limited, Anti-Enumeration protected)
     */
    @Transactional
    public Map<String, Object> forgotPassword(ForgotPasswordRequestDto dto) {
        String normalizedEmail = dto.getEmail().toLowerCase().trim();

        Optional<UserEntity> userOpt = userRepository.findByEmailIgnoreCase(normalizedEmail);
        if (userOpt.isPresent() && userOpt.get().isEmailVerified()) {
            String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
            String tokenHash = sha256(rawToken);

            PasswordResetEntity reset = new PasswordResetEntity(
                    "pr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16),
                    normalizedEmail,
                    tokenHash,
                    LocalDateTime.now().plusMinutes(30)
            );
            passwordResetRepository.save(reset);
            emailService.sendPasswordReset(normalizedEmail, rawToken);
        }

        return Map.of(
                "success", true,
                "message", "If an account exists for this email, you will receive password reset instructions shortly."
        );
    }

    /**
     * Reset Password with single-use token and password complexity enforcement
     */
    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequestDto dto) {
        String newPassword = dto.getNewPassword();
        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        boolean hasUppercase = newPassword.chars().anyMatch(Character::isUpperCase);
        boolean hasNumber = newPassword.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = newPassword.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);
        if (!hasUppercase || !hasNumber || !hasSpecial) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter, one number, and one special character.");
        }

        String tokenHash = sha256(dto.getToken().trim());

        PasswordResetEntity reset = passwordResetRepository.findByTokenHashAndUsedFalse(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Password reset link is invalid or has already been used."));

        if (LocalDateTime.now().isAfter(reset.getExpiresAt())) {
            throw new IllegalStateException("Password reset link has expired. Please request a new link.");
        }

        UserEntity user = userRepository.findByEmailIgnoreCase(reset.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Associated user account not found."));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        reset.setUsed(true);
        passwordResetRepository.save(reset);

        return Map.of(
                "success", true,
                "message", "Password has been reset successfully. You can now sign in with your new password."
        );
    }

    /**
     * Retrieve authenticated user from session cookie or Bearer token
     */
    public UserResponseDto getAuthenticatedUser(HttpServletRequest request) {
        String token = jwtSessionService.extractToken(request);
        if (token == null || !jwtSessionService.validateToken(token)) {
            return null;
        }

        String userId = jwtSessionService.getUserIdFromToken(token);
        if (userId == null) return null;

        return userRepository.findById(userId)
                .map(this::toUserResponseDto)
                .orElse(null);
    }

    /**
     * Invalidate session cookie on logout
     */
    public void logout(HttpServletResponse response) {
        jwtSessionService.clearSessionCookie(response);
    }

    private UserResponseDto toUserResponseDto(UserEntity user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCompanyName(),
                user.getProvider(),
                user.isEmailVerified(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 1) return name + "****@" + domain;
        return name.charAt(0) + "******@" + domain;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 algorithm error", e);
        }
    }
}