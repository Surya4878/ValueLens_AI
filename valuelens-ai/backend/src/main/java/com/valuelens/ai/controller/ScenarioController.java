package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.dto.ScenarioRequestDto;
import com.valuelens.ai.dto.ScenarioResponseDto;
import com.valuelens.ai.service.ScenarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/calculateScenario", "/api/calculateScenario"})
@Tag(name = "Scenario Simulator", description = "Real-time deterministic sensitivity and scenario simulation")
public class ScenarioController {

    private final ScenarioService scenarioService;

    public ScenarioController(ScenarioService scenarioService) {
        this.scenarioService = scenarioService;
    }

    @PostMapping
    @Operation(summary = "Calculate Scenario Suite", description = "Calculates Best, Base, Worst, and Custom slider scenarios deterministically")
    public ResponseEntity<ApiResponseDto<ScenarioResponseDto>> calculateScenario(@RequestBody ScenarioRequestDto request) {
        ScenarioResponseDto response = scenarioService.calculateScenario(request);
        return ResponseEntity.ok(ApiResponseDto.success("Scenario calculations completed successfully", response));
    }
}
