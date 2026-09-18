package com.valuelens.ai;

import com.valuelens.ai.dto.LoginRequestDto;
import com.valuelens.ai.dto.RegisterStartRequestDto;
import com.valuelens.ai.dto.RegisterVerifyRequestDto;
import com.valuelens.ai.dto.UserResponseDto;
import com.valuelens.ai.model.EmailVerificationEntity;
import com.valuelens.ai.model.UserEntity;
import com.valuelens.ai.repository.EmailVerificationRepository;
import com.valuelens.ai.repository.PasswordResetRepository;
import com.valuelens.ai.repository.UserRepository;
import com.valuelens.ai.service.AuthService;
import com.valuelens.ai.service.EmailService;
import com.valuelens.ai.service.GoogleTokenVerifierService;
import com.valuelens.ai.service.JwtSessionService;
import com.valuelens.ai.service.MicrosoftTokenVerifierService;
import com.valuelens.ai.service.OtpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailVerificationRepository emailVerificationRepository;

    @Mock
    private PasswordResetRepository passwordResetRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private GoogleTokenVerifierService googleTokenVerifierService;

    @Mock
    private MicrosoftTokenVerifierService microsoftTokenVerifierService;

    private OtpService otpService;
    private JwtSessionService jwtSessionService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService();
        ReflectionTestUtils.setField(otpService, "otpExpirationMinutes", 10);
        ReflectionTestUtils.setField(otpService, "resendCooldownSeconds", 60);
        ReflectionTestUtils.setField(otpService, "maxAttempts", 5);

        jwtSessionService = new JwtSessionService();
        ReflectionTestUtils.setField(jwtSessionService, "jwtSecret", "ValueLensAiEnterpriseSecretKeyForAuthenticationMustBeAtLeast32BytesLong2026!");
        ReflectionTestUtils.setField(jwtSessionService, "jwtExpirationMs", 86400000L);

        authService = new AuthService(
                userRepository,
                emailVerificationRepository,
                passwordResetRepository,
                otpService,
                emailService,
                jwtSessionService,
                googleTokenVerifierService,
                microsoftTokenVerifierService
        );
    }

    @Test
    void testRegisterStart_Successful() {
        RegisterStartRequestDto dto = new RegisterStartRequestDto();
        dto.setFullName("Surya Prakash");
        dto.setEmail("architect@valuelens.demo");
        dto.setCompanyName("Incture Technologies");
        dto.setPassword("SecurePass123!");

        when(userRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(anyString())).thenReturn(Optional.empty());

        Map<String, Object> response = authService.registerStart(dto);

        assertTrue((Boolean) response.get("success"));
        assertTrue((Boolean) response.get("verificationRequired"));
        assertEquals("a******@valuelens.demo", response.get("email"));
        verify(emailVerificationRepository, times(1)).save(any(EmailVerificationEntity.class));
        verify(emailService, times(1)).sendVerificationOtp(eq("architect@valuelens.demo"), anyString());
    }

    @Test
    void testRegisterStart_AlreadyVerifiedUser_ThrowsException() {
        RegisterStartRequestDto dto = new RegisterStartRequestDto();
        dto.setEmail("existing@incture.com");
        dto.setPassword("Password123!");

        UserEntity user = new UserEntity();
        user.setEmail("existing@incture.com");
        user.setEmailVerified(true);

        when(userRepository.findByEmailIgnoreCase("existing@incture.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> authService.registerStart(dto));
    }

    @Test
    void testRegisterVerify_Successful() {
        String email = "test@company.com";
        String rawOtp = "123456";
        String hashedOtp = otpService.hashOtp(rawOtp);

        EmailVerificationEntity verification = new EmailVerificationEntity(
                "ev-1", email, hashedOtp, "Test User", "Test Co", "hashedPass", LocalDateTime.now().plusMinutes(10)
        );

        when(emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(email))
                .thenReturn(Optional.of(verification));
        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MockHttpServletResponse servletResponse = new MockHttpServletResponse();
        RegisterVerifyRequestDto verifyDto = new RegisterVerifyRequestDto(email, rawOtp);

        UserResponseDto userDto = authService.registerVerify(verifyDto, servletResponse);

        assertNotNull(userDto);
        assertEquals(email, userDto.getEmail());
        assertTrue(userDto.isEmailVerified());
        assertTrue(verification.isVerified());
        assertNotNull(servletResponse.getCookie("valuelens_session"));
    }

    @Test
    void testRegisterVerify_InvalidOtp_IncrementsAttempts() {
        String email = "test@company.com";
        String correctOtp = "123456";
        String wrongOtp = "999999";
        String hashedOtp = otpService.hashOtp(correctOtp);

        EmailVerificationEntity verification = new EmailVerificationEntity(
                "ev-1", email, hashedOtp, "Test User", "Test Co", "hashedPass", LocalDateTime.now().plusMinutes(10)
        );

        when(emailVerificationRepository.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(email))
                .thenReturn(Optional.of(verification));

        MockHttpServletResponse servletResponse = new MockHttpServletResponse();
        RegisterVerifyRequestDto verifyDto = new RegisterVerifyRequestDto(email, wrongOtp);

        assertThrows(IllegalArgumentException.class, () -> authService.registerVerify(verifyDto, servletResponse));
        assertEquals(1, verification.getAttempts());
    }

    @Test
    void testLogin_UnverifiedEmail_ThrowsException() {
        String email = "unverified@company.com";
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setEmailVerified(false);

        when(userRepository.findByEmailIgnoreCase(email)).thenReturn(Optional.of(user));

        LoginRequestDto loginDto = new LoginRequestDto(email, "Password123!");
        MockHttpServletResponse servletResponse = new MockHttpServletResponse();

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> authService.login(loginDto, servletResponse));
        assertTrue(ex.getMessage().contains("UNVERIFIED_EMAIL"));
    }
}
