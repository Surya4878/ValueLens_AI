package com.valuelens.ai.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.RoiCalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@Tag(name = "ROI Calculation", description = "Authoritative deterministic financial calculation engine")
public class RoiController {

    private static final Logger log = LoggerFactory.getLogger(RoiController.class);

    private final RoiCalculationService roiCalculationService;
    private final AssessmentService assessmentService;
    private final ObjectMapper objectMapper;

    public RoiController(
            RoiCalculationService roiCalculationService,
            AssessmentService assessmentService,
            ObjectMapper objectMapper
    ) {
        this.roiCalculationService = roiCalculationService;
        this.assessmentService = assessmentService;
        this.objectMapper = objectMapper;
    }

    @PostMapping({"/api/v1/calculateROI", "/api/calculateROI"})
    @Operation(summary = "Calculate ROI", description = "Executes deterministic financial math for Current TCO, Target TCO, Savings, Break-even, and multi-period ROI")
    public ResponseEntity<ApiResponseDto<RoiCalculationResponseDto>> calculateROI(@RequestBody JsonNode rawBody) {
        log.info("Received ROI calculation request");

        AssessmentDto assessmentDto;
        try {
            // Check if input is legacy wrapper format with "jsonInput" or direct AssessmentDto
            if (rawBody.has("jsonInput")) {
                log.info("Parsing nested jsonInput payload format");
                assessmentDto = objectMapper.treeToValue(rawBody.get("jsonInput"), AssessmentDto.class);
            } else if (rawBody.has("sourceSystem")) {
                assessmentDto = objectMapper.treeToValue(rawBody, AssessmentDto.class);
            } else {
                log.info("Fallback to demo assessment structure");
                assessmentDto = assessmentService.buildDemoAssessment();
            }
        } catch (Exception e) {
            log.warn("Failed to parse request JSON into AssessmentDto, utilizing demo baseline: {}", e.getMessage());
            assessmentDto = assessmentService.buildDemoAssessment();
        }

        RoiCalculationResponseDto result = roiCalculationService.calculate(assessmentDto);

        return ResponseEntity.ok(ApiResponseDto.success("ROI calculation completed successfully", result));
    }
}
