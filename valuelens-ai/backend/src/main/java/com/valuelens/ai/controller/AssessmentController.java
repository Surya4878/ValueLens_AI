package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.exception.UnauthorizedException;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.JwtSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/assessments", "/api/assessments"})
@Tag(name = "Assessments", description = "Assessment lifecycle, persistence, and demo loading")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final JwtSessionService jwtSessionService;

    public AssessmentController(AssessmentService assessmentService, JwtSessionService jwtSessionService) {
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

    @PostMapping
    @Operation(summary = "Create or Save Assessment")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> createAssessment(@RequestBody AssessmentDto dto, HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        if (userId == null) {
            throw new UnauthorizedException("Authentication required to save an assessment.");
        }
        AssessmentDto saved = assessmentService.saveAssessment(dto, userId);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment saved successfully", saved));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Assessment by ID")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> getAssessment(@PathVariable String id, HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        if ("demo-assessment-1".equals(id) || "demo-sap-pipo-to-btp".equals(id)) {
            return ResponseEntity.ok(ApiResponseDto.success("Demo assessment retrieved successfully", assessmentService.getAssessment(id, null)));
        }
        if (userId == null) {
            throw new UnauthorizedException("Authentication required to access private assessment.");
        }
        AssessmentDto dto = assessmentService.getAssessment(id, userId);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment retrieved successfully", dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Assessment by ID")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> updateAssessment(@PathVariable String id, @RequestBody AssessmentDto dto, HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        if (userId == null) {
            throw new UnauthorizedException("Authentication required to update an assessment.");
        }
        dto.setId(id);
        AssessmentDto saved = assessmentService.saveAssessment(dto, userId);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment updated successfully", saved));
    }

    @GetMapping("/demo")
    @Operation(summary = "Get Full Demo Assessment")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> getDemoAssessment() {
        AssessmentDto demo = assessmentService.buildDemoAssessment();
        return ResponseEntity.ok(ApiResponseDto.success("Demo assessment retrieved successfully", demo));
    }

    @GetMapping
    @Operation(summary = "List all Assessments for Authenticated User")
    public ResponseEntity<ApiResponseDto<List<AssessmentDto>>> listAssessments(HttpServletRequest request) {
        String userId = getAuthenticatedUserId(request);
        if (userId == null) {
            return ResponseEntity.ok(ApiResponseDto.success("Assessments listed successfully", List.of(assessmentService.buildDemoAssessment())));
        }
        return ResponseEntity.ok(ApiResponseDto.success("Assessments listed successfully", assessmentService.listAssessments(userId)));
    }
}