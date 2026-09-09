package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.service.ReportService;
import com.valuelens.ai.service.ReportService.ReportPackage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/reports", "/api/reports"})
@Tag(name = "Executive Reports", description = "Report generation and retrieval")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate Executive Report")
    public ResponseEntity<ApiResponseDto<ReportPackage>> generateReport(@RequestBody Map<String, String> body) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        ReportPackage pkg = reportService.generateReport(assessmentId);
        return ResponseEntity.ok(ApiResponseDto.success("Executive report generated successfully", pkg));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Executive Report by ID")
    public ResponseEntity<ApiResponseDto<ReportPackage>> getReport(@PathVariable String id) {
        ReportPackage pkg = reportService.generateReport(id);
        return ResponseEntity.ok(ApiResponseDto.success("Report retrieved successfully", pkg));
    }
}
