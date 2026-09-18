package com.valuelens.ai.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

@Service
public class JwtSessionService {

    private static final Logger log = LoggerFactory.getLogger(JwtSessionService.class);
    public static final String SESSION_COOKIE_NAME = "valuelens_session";
    public static final String DEFAULT_SECRET = "ValueLensAiEnterpriseSecretKeyForAuthenticationMustBeAtLeast32BytesLong2026!";

    @Value("${app.auth.jwt-secret:" + DEFAULT_SECRET + "}")
    private String jwtSecret;

    @Value("${app.auth.jwt-expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${app.security.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @PostConstruct
    public void validateSecret() {
        if ("prod".equalsIgnoreCase(activeProfile) || "production".equalsIgnoreCase(activeProfile)) {
            if (DEFAULT_SECRET.equals(jwtSecret) || jwtSecret.length() < 32) {
                throw new IllegalStateException("CRITICAL SECURITY ERROR: Default or weak JWT_SECRET cannot be used in production.");
            }
        } else if (DEFAULT_SECRET.equals(jwtSecret)) {
            log.warn("DEVELOPMENT NOTICE: Using default JWT secret. Set JWT_SECRET in environment for production deployments.");
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String email, String fullName, String provider) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("fullName", fullName)
                .claim("provider", provider)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        Claims claims = parseToken(token);
        return claims != null && claims.getExpiration().after(new Date());
    }

    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims != null ? claims.getSubject() : null;
    }

    public String getEmailFromToken(String token) {
        Claims claims = parseToken(token);
        return claims != null ? (String) claims.get("email") : null;
    }

    public void setSessionCookie(HttpServletResponse response, String token, boolean rememberMe) {
        Duration maxAge = rememberMe ? Duration.ofDays(7) : Duration.ofMillis(jwtExpirationMs);

        ResponseCookie cookie = ResponseCookie.from(SESSION_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAge)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(SESSION_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public String extractToken(HttpServletRequest request) {
        // 1. Check Authorization: Bearer <token> header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }

        // 2. Check Cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (SESSION_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}