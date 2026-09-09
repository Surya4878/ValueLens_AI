package com.valuelens.ai.controller;

import com.valuelens.ai.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    public ExportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/json")
    @Operation(summary = "Export Report as JSON")
    public ResponseEntity<String> exportJson(@RequestBody Map<String, String> body) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        String json = reportService.exportJson(assessmentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"valuelens-assessment-" + assessmentId + ".json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }

    @PostMapping("/csv")
    @Operation(summary = "Export Report as CSV")
    public ResponseEntity<String> exportCsv(@RequestBody Map<String, String> body) {
        String assessmentId = body.getOrDefault("assessmentId", "demo-sap-pipo-to-btp");
        String csv = reportService.exportCsv(assessmentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"valuelens-financials-" + assessmentId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
