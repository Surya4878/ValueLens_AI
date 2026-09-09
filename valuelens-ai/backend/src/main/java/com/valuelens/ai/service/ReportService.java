package com.valuelens.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.AiAnalysisResponseDto;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.dto.RoiCalculationResponseDto;
import com.valuelens.ai.model.ExecutiveReportEntity;
import com.valuelens.ai.repository.ExecutiveReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ReportService {

    private final AssessmentService assessmentService;
    private final RoiCalculationService roiCalculationService;
    private final AiAnalysisService aiAnalysisService;
    private final ExecutiveReportRepository executiveReportRepository;
    private final ObjectMapper objectMapper;

    public ReportService(
            AssessmentService assessmentService,
            RoiCalculationService roiCalculationService,
            AiAnalysisService aiAnalysisService,
            ExecutiveReportRepository executiveReportRepository,
            ObjectMapper objectMapper
    ) {
        this.assessmentService = assessmentService;
        this.roiCalculationService = roiCalculationService;
        this.aiAnalysisService = aiAnalysisService;
        this.executiveReportRepository = executiveReportRepository;
        this.objectMapper = objectMapper;
    }

    public record ReportPackage(
            String reportId,
            String title,
            String reportVersion,
            LocalDateTime generatedAt,
            AssessmentDto assessment,
            RoiCalculationResponseDto calculations,
            AiAnalysisResponseDto aiAnalysis
    ) {}

    @Transactional
    public ReportPackage generateReport(String assessmentId) {
        AssessmentDto assessment = assessmentService.getAssessment(assessmentId);
        RoiCalculationResponseDto calculations = roiCalculationService.calculate(assessment);

        var aiReq = new com.valuelens.ai.dto.AiAnalysisRequestDto();
        aiReq.setAssessmentId(assessmentId);
        aiReq.setAssessment(assessment);
        aiReq.setCalculations(calculations);
        AiAnalysisResponseDto aiAnalysis = aiAnalysisService.analyze(aiReq);

        String reportId = "rep-" + UUID.randomUUID().toString().substring(0, 8);
        ExecutiveReportEntity entity = new ExecutiveReportEntity();
        entity.setId(reportId);
        entity.setAssessmentId(assessmentId);
        entity.setCalculationResultId(calculations.getCalculationResultId());
        entity.setAiAnalysisId(aiAnalysis.getCalculationResultId());
        entity.setTitle("Executive Migration Business Case: " + assessment.getSourcePlatform() + " to " + assessment.getTargetPlatform());
        entity.setReportVersion("v1.0-EXEC");
        entity.setCurrency(assessment.getCurrency());
        entity.setGeneratedAt(LocalDateTime.now());
        entity.setGeneratedBy("ValueLens AI Decision Engine");

        executiveReportRepository.save(entity);

        return new ReportPackage(
                reportId,
                entity.getTitle(),
                entity.getReportVersion(),
                entity.getGeneratedAt(),
                assessment,
                calculations,
                aiAnalysis
        );
    }

    public String exportJson(String assessmentId) {
        try {
            ReportPackage pkg = generateReport(assessmentId);
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(pkg);
        } catch (Exception e) {
            throw new RuntimeException("Failed to export JSON report", e);
        }
    }

    public String exportCsv(String assessmentId) {
        ReportPackage pkg = generateReport(assessmentId);
        var c = pkg.calculations();

        StringBuilder sb = new StringBuilder();
        sb.append("ValueLens AI - Executive Financial Export\n");
        sb.append("Generated At,").append(pkg.generatedAt()).append("\n");
        sb.append("Assessment ID,").append(pkg.assessment().getId()).append("\n");
        sb.append("Source Platform,").append(pkg.assessment().getSourcePlatform()).append("\n");
        sb.append("Target Platform,").append(pkg.assessment().getTargetPlatform()).append("\n\n");

        sb.append("Metric,Value (USD),Formula\n");
        sb.append("Current Platform Annual TCO,").append(c.getCurrentPlatformTCO()).append(",Licensing + Infra + Support + Ops\n");
        sb.append("Target Platform Annual TCO,").append(c.getTargetPlatformTCO()).append(",BTP Standard Edition + Messages + Addons\n");
        sb.append("Annual Operating Savings,").append(c.getAnnualSavings()).append(",Current TCO - Target TCO\n");
        sb.append("Savings Percentage,").append(c.getSavingsPercentage()).append("%,\n");
        sb.append("Total Migration Investment,").append(c.getMigrationCost()).append(",Base Migration + Contingency\n");
        sb.append("Break-even Period (Months),").append(c.getBreakEvenMonths()).append(",Migration Cost / Annual Savings * 12\n");
        sb.append("1-Year ROI,").append(c.getOneYearROI()).append("%,\n");
        sb.append("3-Year ROI,").append(c.getThreeYearROI()).append("%,\n");
        sb.append("5-Year ROI,").append(c.getFiveYearROI()).append("%,\n");
        sb.append("10-Year ROI,").append(c.getTenYearROI()).append("%,\n");
        sb.append("5-Year Net Benefit,").append(c.getFiveYearNetBenefit()).append(",5 * Annual Savings - Migration Cost\n");

        return sb.toString();
    }
}
