package com.valuelens.ai.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.email.from:${spring.mail.username:noreply.businessvaluelensai@gmail.com}}")
    private String fromEmail;

    @Value("${app.contact.recipient-email:noreply.businessvaluelensai@gmail.com}")
    private String contactRecipientEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendVerificationOtp(String toEmail, String otp) {
        log.info("[ValueLens AI Email Service] Dispatching verification OTP to {}", maskEmail(toEmail));

        String subject = "Your Business ValueLens AI Verification Code: " + otp;
        String htmlBody = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d9e2ec; border-radius: 16px; background-color: #ffffff;\">"
                + "<div style=\"display: flex; align-items: center; margin-bottom: 20px;\">"
                + "<h2 style=\"color: #0070f2; margin: 0; font-size: 24px;\">Business ValueLens AI</h2>"
                + "</div>"
                + "<h3 style=\"color: #1d2d3e; font-size: 20px; margin-top: 0;\">Verify Your Email Address</h3>"
                + "<p style=\"color: #556b82; font-size: 15px; line-height: 1.5;\">Thank you for registering with Business ValueLens AI. Please use the 6-digit verification code below to complete your registration:</p>"
                + "<div style=\"background-color: #f0f4f8; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;\">"
                + "<span style=\"font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0070f2;\">" + otp + "</span>"
                + "</div>"
                + "<p style=\"color: #556b82; font-size: 13px;\">This code is valid for <strong>10 minutes</strong> and can only be used once. If you did not request this code, please ignore this email.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />"
                + "<p style=\"color: #8c9ba5; font-size: 12px; text-align: center;\">Incture Technologies - Business ValueLens AI - All rights reserved</p>"
                + "</div>";

        sendEmail(toEmail, subject, htmlBody);
    }

    public void sendPasswordReset(String toEmail, String resetToken) {
        String base = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl : "http://localhost:3000";
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        String resetUrl = base + "/forgot-password?token=" + resetToken;
        log.info("[ValueLens AI Email Service] Dispatching Password Reset link to {}", maskEmail(toEmail));

        String subject = "Reset Your Business ValueLens AI Password";
        String htmlBody = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d9e2ec; border-radius: 16px; background-color: #ffffff;\">"
                + "<h2 style=\"color: #0070f2; margin: 0 0 16px 0; font-size: 24px;\">Business ValueLens AI</h2>"
                + "<h3 style=\"color: #1d2d3e; font-size: 20px; margin-top: 0;\">Password Reset Request</h3>"
                + "<p style=\"color: #556b82; font-size: 15px; line-height: 1.5;\">We received a request to reset your password. Click the button below to choose a new password:</p>"
                + "<div style=\"text-align: center; margin: 28px 0;\">"
                + "<a href=\"" + resetUrl + "\" style=\"background-color: #0070f2; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;\">Reset Password</a>"
                + "</div>"
                + "<p style=\"color: #556b82; font-size: 13px;\">This link is valid for 30 minutes. If you did not request a password reset, you can safely ignore this email.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />"
                + "<p style=\"color: #8c9ba5; font-size: 12px; text-align: center;\">Incture Technologies - Business ValueLens AI</p>"
                + "</div>";

        sendEmail(toEmail, subject, htmlBody);
    }

    public void sendContactOrDemoRequest(String requesterName, String requesterEmail, String companyName, String phone, String requestType, String message, String sourcePage) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String cleanType = (requestType != null && !requestType.isBlank()) ? requestType : "Demo Request";
        String subject = "[ValueLens AI Lead] " + cleanType + " from " + requesterName + (companyName != null && !companyName.isBlank() ? " (" + companyName + ")" : "");

        String htmlBody = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d9e2ec; border-radius: 16px; background-color: #ffffff;\">"
                + "<div style=\"display: flex; align-items: center; margin-bottom: 20px;\">"
                + "<h2 style=\"color: #0070f2; margin: 0; font-size: 22px;\">Business ValueLens AI - Inbound Request</h2>"
                + "</div>"
                + "<div style=\"background-color: #f0f4f8; border-radius: 12px; padding: 20px; margin-bottom: 20px;\">"
                + "<p style=\"margin: 6px 0; font-size: 15px; color: #1d2d3e;\"><strong>Request Type:</strong> <span style=\"color: #0070f2; font-weight: bold;\">" + cleanType + "</span></p>"
                + "<p style=\"margin: 6px 0; font-size: 15px; color: #1d2d3e;\"><strong>Requester Name:</strong> " + requesterName + "</p>"
                + "<p style=\"margin: 6px 0; font-size: 15px; color: #1d2d3e;\"><strong>Email:</strong> <a href=\"mailto:" + requesterEmail + "\" style=\"color: #0070f2;\">" + requesterEmail + "</a></p>"
                + "<p style=\"margin: 6px 0; font-size: 15px; color: #1d2d3e;\"><strong>Company:</strong> " + (companyName != null && !companyName.isBlank() ? companyName : "Not specified") + "</p>"
                + (phone != null && !phone.isBlank() ? "<p style=\"margin: 6px 0; font-size: 15px; color: #1d2d3e;\"><strong>Phone:</strong> " + phone + "</p>" : "")
                + (sourcePage != null && !sourcePage.isBlank() ? "<p style=\"margin: 6px 0; font-size: 14px; color: #556b82;\"><strong>Source Page:</strong> " + sourcePage + "</p>" : "")
                + "<p style=\"margin: 6px 0; font-size: 13px; color: #556b82;\"><strong>Timestamp:</strong> " + timestamp + "</p>"
                + "</div>"
                + (message != null && !message.isBlank() ? "<div style=\"margin: 20px 0;\"><h4 style=\"margin: 0 0 8px 0; color: #1d2d3e; font-size: 15px;\">User Message / Requirements:</h4><div style=\"color: #334e68; background-color: #f8fafc; border-left: 4px solid #0070f2; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.6;\">" + message + "</div></div>" : "")
                + "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />"
                + "<p style=\"color: #8c9ba5; font-size: 12px; text-align: center;\">Incture Technologies - Business ValueLens AI</p>"
                + "</div>";

        String targetEmail = (contactRecipientEmail != null && !contactRecipientEmail.isBlank())
                ? contactRecipientEmail
                : "noreply.businessvaluelensai@gmail.com";

        log.info("[ValueLens AI Email Service] Forwarding {} lead from {} ({}) to {}", cleanType, requesterName, maskEmail(requesterEmail), targetEmail);
        sendEmail(targetEmail, subject, htmlBody);
    }

    public void sendWelcomeEmail(String toEmail, String fullName) {
        log.info("[ValueLens AI Email Service] Welcome email dispatched to {}", maskEmail(toEmail));
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@", 2);
        String name = parts[0];
        String domain = parts[1];
        String maskedName = name.length() <= 2 ? name.substring(0, 1) + "***" : name.charAt(0) + "***" + name.charAt(name.length() - 1);
        return maskedName + "@" + domain;
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        if (mailSender == null) {
            log.warn("JavaMailSender is not initialized. Outbound email skipped for {}", maskEmail(to));
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "Business ValueLens AI");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Successfully delivered email to {}", maskEmail(to));
        } catch (Exception e) {
            log.error("Failed to deliver email via SMTP to {}: {}", maskEmail(to), e.getMessage());
        }
    }
}
