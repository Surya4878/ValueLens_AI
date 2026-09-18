package com.valuelens.ai.controller;

import com.valuelens.ai.exception.UnauthorizedException;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.JwtSessionService;
import com.valuelens.ai.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/export", "/api/export"})
@Tag(name = "Export APIs", description = "JSON and CSV report exports")
public class ExportController {

    private final ReportService reportService;
    private final AssessmentService assessmentService;
    private final JwtSessionService jwtSessionService;

    public ExportController(ReportService reportService, AssessmentService assessmentService, JwtSessionService jwtSessionService) {
        this.reportService = reportService;
        this.assessmentService = assessmentService;
        this.jwtSessionService = jwtSessionService;
    }

    private String getAuthenticatedUserId(HttpServletRequest request) {
        String token = jwtSessionService.extractToken(request);
        if (token != null && jwtSessionService.validateToken(token)) {
            return jwtSessionService.getUserIdFromToken(token);
        }
        return null;
    }

    private String sanitizeFilename(String input) {
        if (input == null) return "export";
        return input.replaceAll("[^a-zA-Z0-9_-]", "");
    }

    @PostMapping("/json")
    @Operation(summary = "Export Report as JSON")
    public ResponseEntity<String> exportJson(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        String userId = getAuthenticatedUserId(request);

        if (!"demo-sap-pipo-to-btp".equals(assessmentId) && !"demo-assessment-1".equals(assessmentId)) {
            if (userId == null) {
                throw new UnauthorizedException("Authentication required to export assessment data.");
            }
            assessmentService.getAssessment(assessmentId, userId);
        }

        String safeId = sanitizeFilename(assessmentId);
        String json = reportService.exportJson(assessmentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"valuelens-assessment-" + safeId + ".json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }

    @PostMapping("/csv")
    @Operation(summary = "Export Report as CSV")
    public ResponseEntity<String> exportCsv(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        String userId = getAuthenticatedUserId(request);

        if (!"demo-sap-pipo-to-btp".equals(assessmentId) && !"demo-assessment-1".equals(assessmentId)) {
            if (userId == null) {
                throw new UnauthorizedException("Authentication required to export assessment financials.");
            }
            assessmentService.getAssessment(assessmentId, userId);
        }

        String safeId = sanitizeFilename(assessmentId);
        String csv = reportService.exportCsv(assessmentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"valuelens-financials-" + safeId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}