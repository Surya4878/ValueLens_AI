package com.valuelens.ai.service;

import com.valuelens.ai.validation.DataConsistencyValidator.ConsistencyWarning;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataQualityService {

    public enum QualityLevel {
        HIGH,
        MEDIUM,
        LOW
    }

    public record QualityResult(
            int score,
            QualityLevel level,
            int completenessScore,
            int consistencyScore,
            int validationScore,
            int estimationScore,
            List<String> positiveReasons,
            List<String> flags
    ) {}

    public QualityResult evaluate(
            BigDecimal currentTco,
            BigDecimal targetTco,
            BigDecimal migrationCost,
            List<ConsistencyWarning> warnings,
            boolean hasCompanyInfo,
            boolean hasEnvironmentInfo,
            boolean hasVolumetrics,
            boolean hasEstimatedFields
    ) {
        int completeness = 0;
        int consistency = 100;
        int validation = 100;
        int estimation = 100;

        List<String> positives = new ArrayList<>();
        List<String> flags = new ArrayList<>();

        // Completeness evaluation (max 40 pts weighted)
        int compPoints = 0;
        if (currentTco != null && currentTco.compareTo(BigDecimal.ZERO) > 0) compPoints += 25;
        if (targetTco != null && targetTco.compareTo(BigDecimal.ZERO) > 0) compPoints += 25;
        if (migrationCost != null && migrationCost.compareTo(BigDecimal.ZERO) > 0) compPoints += 25;
        if (hasCompanyInfo) compPoints += 10;
        if (hasEnvironmentInfo) compPoints += 10;
        if (hasVolumetrics) compPoints += 5;
        completeness = Math.min(100, compPoints);

        if (completeness >= 90) {
            positives.add("Required financial and platform parameters are comprehensive");
        } else {
            flags.add("Some secondary environment or company profile parameters are unpopulated");
        }

        // Consistency evaluation (max 30 pts weighted)
        if (warnings != null && !warnings.isEmpty()) {
            int penalty = warnings.size() * 20;
            consistency = Math.max(20, 100 - penalty);
            flags.add("Data consistency engine detected " + warnings.size() + " subtotal variances");
        } else {
            positives.add("All cost line items and subtotals are internally consistent");
        }

        // Financial validation (max 20 pts weighted)
        if (targetTco != null && currentTco != null && targetTco.compareTo(currentTco) > 0) {
            validation -= 30;
            flags.add("Target annual TCO exceeds Current TCO (negative annual savings profile)");
        } else {
            positives.add("Target platform architecture produces positive operating margin");
        }

        // Estimation (max 10 pts weighted)
        if (hasEstimatedFields) {
            estimation = 70;
            flags.add("Certain operational assumptions are marked as user estimates");
        } else {
            positives.add("All figures verified against actual enterprise contracts/catalogs");
        }

        // Weighted Overall Score: Comp (40%) + Cons (30%) + Val (20%) + Est (10%)
        double rawOverall = (completeness * 0.40) + (consistency * 0.30) + (validation * 0.20) + (estimation * 0.10);
        int overallScore = (int) Math.round(rawOverall);
        overallScore = Math.min(100, Math.max(0, overallScore));

        QualityLevel level;
        if (overallScore >= 85) level = QualityLevel.HIGH;
        else if (overallScore >= 60) level = QualityLevel.MEDIUM;
        else level = QualityLevel.LOW;

        return new QualityResult(overallScore, level, completeness, consistency, validation, estimation, positives, flags);
    }
}
