package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.exception.UnauthorizedException;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.JwtSessionService;
import com.valuelens.ai.service.ReportService;
import com.valuelens.ai.service.ReportService.ReportPackage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/reports", "/api/reports"})
@Tag(name = "Executive Reports", description = "Report generation and retrieval")
public class ReportController {

    private final ReportService reportService;
    private final AssessmentService assessmentService;
    private final JwtSessionService jwtSessionService;

    public ReportController(ReportService reportService, AssessmentService assessmentService, JwtSessionService jwtSessionService) {
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

    @PostMapping("/generate")
    @Operation(summary = "Generate Executive Report")
    public ResponseEntity<ApiResponseDto<ReportPackage>> generateReport(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        String userId = getAuthenticatedUserId(request);

        if (!"demo-sap-pipo-to-btp".equals(assessmentId) && !"demo-assessment-1".equals(assessmentId)) {
            if (userId == null) {
                throw new UnauthorizedException("Authentication required to generate an executive report.");
            }
            assessmentService.getAssessment(assessmentId, userId);
        }

        ReportPackage pkg = reportService.generateReport(assessmentId);
        return ResponseEntity.ok(ApiResponseDto.success("Executive report generated successfully", pkg));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Executive Report by ID")
    public ResponseEntity<ApiResponseDto<ReportPackage>> getReport(@PathVariable String id, HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        if (!"demo-sap-pipo-to-btp".equals(id) && !"demo-assessment-1".equals(id)) {
            if (userId == null) {
                throw new UnauthorizedException("Authentication required to view an executive report.");
            }
            assessmentService.getAssessment(id, userId);
        }
        ReportPackage pkg = reportService.generateReport(id);
        return ResponseEntity.ok(ApiResponseDto.success("Report retrieved successfully", pkg));
    }
}