package com.valuelens.ai.controller;

import com.valuelens.ai.dto.*;
import com.valuelens.ai.exception.UnauthorizedException;
import com.valuelens.ai.service.AiAnalysisService;
import com.valuelens.ai.service.AssessmentService;
import com.valuelens.ai.service.JwtSessionService;
import com.valuelens.ai.service.RoiCalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
@Tag(name = "AI Decision Intelligence", description = "AI executive interpretations, chart insights, and contextual assistant")
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;
    private final AssessmentService assessmentService;
    private final RoiCalculationService roiCalculationService;
    private final JwtSessionService jwtSessionService;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public AiAnalysisController(
            AiAnalysisService aiAnalysisService,
            AssessmentService assessmentService,
            RoiCalculationService roiCalculationService,
            JwtSessionService jwtSessionService
    ) {
        this.aiAnalysisService = aiAnalysisService;
        this.assessmentService = assessmentService;
        this.roiCalculationService = roiCalculationService;
        this.jwtSessionService = jwtSessionService;
    }

    private String getAuthenticatedUserId(HttpServletRequest request) {
        String token = jwtSessionService.extractToken(request);
        if (token != null && jwtSessionService.validateToken(token)) {
            return jwtSessionService.getUserIdFromToken(token);
        }
        return null;
    }

    @PostMapping({"/api/v1/ai/analyze", "/api/ai/analyze"})
    @Operation(summary = "Analyze Assessment with AI", description = "Generates board-level executive decision, insights, risks, and recommendations")
    public ResponseEntity<ApiResponseDto<AiAnalysisResponseDto>> analyze(@RequestBody AiAnalysisRequestDto request, HttpServletRequest httpRequest) {
        String userId = getAuthenticatedUserId(httpRequest);

        // If assessment not included in body, load from assessmentId or fallback to demo
        if (request.getAssessment() == null && request.getAssessmentId() != null) {
            String id = request.getAssessmentId();
            if (!"demo-assessment-1".equals(id) && !"demo-sap-pipo-to-btp".equals(id)) {
                if (userId == null) {
                    throw new UnauthorizedException("Authentication required to analyze assessment.");
                }
                request.setAssessment(assessmentService.getAssessment(id, userId));
            } else {
                request.setAssessment(assessmentService.buildDemoAssessment());
            }
        } else if (request.getAssessment() == null) {
            request.setAssessment(assessmentService.buildDemoAssessment());
        }

        // If calculations not provided, compute deterministically first
        if (request.getCalculations() == null) {
            request.setCalculations(roiCalculationService.calculate(request.getAssessment()));
        }

        AiAnalysisResponseDto result = aiAnalysisService.analyze(request);
        return ResponseEntity.ok(ApiResponseDto.success("AI analysis completed successfully", result));
    }

    @PostMapping("/api/v1/ai/chart-insight")
    @Operation(summary = "Chart-Specific AI Insight", description = "Analyzes a specific dashboard chart")
    public ResponseEntity<ApiResponseDto<ChartInsightResponseDto>> getChartInsight(@RequestBody ChartInsightRequestDto request, HttpServletRequest httpRequest) {
        String userId = getAuthenticatedUserId(httpRequest);
        AssessmentDto assessment = null;
        if (request.getAssessmentId() != null) {
            String id = request.getAssessmentId();
            if (!"demo-assessment-1".equals(id) && !"demo-sap-pipo-to-btp".equals(id)) {
                if (userId != null) {
                    try {
                        assessment = assessmentService.getAssessment(id, userId);
                    } catch (Exception ignored) {}
                }
            }
        }
        if (assessment == null) {
            assessment = assessmentService.buildDemoAssessment();
        }
        RoiCalculationResponseDto calculations = roiCalculationService.calculate(assessment);
        ChartInsightResponseDto insight = aiAnalysisService.getChartInsight(request, assessment, calculations);
        return ResponseEntity.ok(ApiResponseDto.success("Chart insight generated successfully", insight));
    }

    @PostMapping("/api/v1/ai/scenario-analysis")
    @Operation(summary = "Scenario Delta AI Analysis", description = "Analyzes scenario changes and detects potential decision reversals")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> analyzeScenario(@RequestBody ScenarioResponseDto scenarioData) {
        String analysis = aiAnalysisService.analyzeScenario(scenarioData);
        return ResponseEntity.ok(ApiResponseDto.success("Scenario AI analysis completed", Map.of("interpretation", analysis)));
    }

    @PostMapping("/api/v1/ai/executive-story")
    @Operation(summary = "Generate Executive Story", description = "Generates a cohesive management presentation story narrative")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> generateExecutiveStory(@RequestBody(required = false) Map<String, String> request, HttpServletRequest httpRequest) {
        String assessmentId = request != null ? request.get("assessmentId") : null;
        String userId = getAuthenticatedUserId(httpRequest);
        AssessmentDto assessment = null;
        if (assessmentId != null && !assessmentId.isBlank() && !"demo-assessment-1".equals(assessmentId) && !"demo-sap-pipo-to-btp".equals(assessmentId)) {
            if (userId == null) {
                throw new UnauthorizedException("Authentication required to generate story for assessment.");
            }
            assessment = assessmentService.getAssessment(assessmentId, userId);
        }
        if (assessment == null) {
            assessment = assessmentService.buildDemoAssessment();
        }
        RoiCalculationResponseDto calculations = roiCalculationService.calculate(assessment);
        String story = aiAnalysisService.generateExecutiveStory(assessment, calculations);
        return ResponseEntity.ok(ApiResponseDto.success("Executive story generated", Map.of("story", story)));
    }

    @PostMapping("/api/v1/ai/question")
    @Operation(summary = "Contextual AI Assistant Question", description = "Answers executive questions grounded in the current assessment context")
    public ResponseEntity<ApiResponseDto<QuestionResponseDto>> answerQuestion(@RequestBody QuestionRequestDto request) {
        QuestionResponseDto answer = aiAnalysisService.answerQuestion(request);
        return ResponseEntity.ok(ApiResponseDto.success("Question answered successfully", answer));
    }

    @GetMapping("/api/v1/ai/debug")
    @Operation(summary = "Debug NVIDIA connectivity", description = "Tests direct NVIDIA NIM API connectivity from JVM (dev only)")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> debugNvidia() {
        if ("prod".equalsIgnoreCase(activeProfile) || "production".equalsIgnoreCase(activeProfile)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseDto.error("Endpoint disabled in production environment."));
        }
        String result = aiAnalysisService.debugNvidiaConnectivity();
        return ResponseEntity.ok(ApiResponseDto.success("Debug complete", Map.of("result", result)));
    }

    @PostMapping({"/api/v1/ai/recommend-edition", "/api/ai/recommend-edition"})
    @Operation(summary = "Recommend SAP BTP Edition with AI", description = "Analyzes customer landscape parameters and generates live AI recommendation")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> recommendEdition(@RequestBody(required = false) AssessmentDto assessment) {
        if (assessment == null) {
            assessment = assessmentService.buildDemoAssessment();
        }
        Map<String, Object> recommendation = aiAnalysisService.recommendEdition(assessment);
        return ResponseEntity.ok(ApiResponseDto.success("AI edition recommendation generated", recommendation));
    }
}