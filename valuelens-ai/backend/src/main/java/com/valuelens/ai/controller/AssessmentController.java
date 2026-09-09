package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.service.AssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/assessments", "/api/assessments"})
@Tag(name = "Assessments", description = "Assessment lifecycle, persistence, and demo loading")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    @Operation(summary = "Create or Save Assessment")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> createAssessment(@RequestBody AssessmentDto dto) {
        AssessmentDto saved = assessmentService.saveAssessment(dto);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment saved successfully", saved));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Assessment by ID")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> getAssessment(@PathVariable String id) {
        AssessmentDto dto = assessmentService.getAssessment(id);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment retrieved successfully", dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Assessment by ID")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> updateAssessment(@PathVariable String id, @RequestBody AssessmentDto dto) {
        dto.setId(id);
        AssessmentDto saved = assessmentService.saveAssessment(dto);
        return ResponseEntity.ok(ApiResponseDto.success("Assessment updated successfully", saved));
    }

    @GetMapping("/demo")
    @Operation(summary = "Get Full Demo Assessment")
    public ResponseEntity<ApiResponseDto<AssessmentDto>> getDemoAssessment() {
        AssessmentDto demo = assessmentService.buildDemoAssessment();
        return ResponseEntity.ok(ApiResponseDto.success("Demo assessment retrieved successfully", demo));
    }

    @GetMapping
    @Operation(summary = "List all Assessments")
    public ResponseEntity<ApiResponseDto<List<AssessmentDto>>> listAssessments() {
        return ResponseEntity.ok(ApiResponseDto.success("Assessments listed successfully", assessmentService.listAssessments()));
    }
}
