package com.valuelens.ai.calculator;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class MigrationComplexityCalculator {

    public enum ComplexityLevel {
        LOW,
        MEDIUM,
        HIGH,
        VERY_HIGH
    }

    public record ComplexityResult(
            int score,
            ComplexityLevel classification,
            Map<String, Object> factorContributions
    ) {}

    public ComplexityResult evaluate(
            int totalInterfaces,
            int complexInterfaces,
            long messageThroughput,
            String customDevelopment,
            String complianceRequirements
    ) {
        int interfaceScore;
        if (totalInterfaces < 100) interfaceScore = 10;
        else if (totalInterfaces <= 300) interfaceScore = 20;
        else if (totalInterfaces <= 800) interfaceScore = 25;
        else interfaceScore = 30;

        double complexRatio = totalInterfaces > 0 ? (double) complexInterfaces / totalInterfaces : 0.0;
        int ratioScore;
        if (complexRatio < 0.10) ratioScore = 5;
        else if (complexRatio <= 0.25) ratioScore = 15;
        else if (complexRatio <= 0.50) ratioScore = 20;
        else ratioScore = 25;

        int throughputScore;
        if (messageThroughput < 50000) throughputScore = 5;
        else if (messageThroughput <= 250000) throughputScore = 10;
        else throughputScore = 15;

        int customDevScore = switch (customDevelopment != null ? customDevelopment.toLowerCase() : "moderate") {
            case "simple", "low" -> 5;
            case "complex", "high", "heavy" -> 15;
            default -> 10;
        };

        int complianceScore = switch (complianceRequirements != null ? complianceRequirements.toLowerCase() : "standard") {
            case "regulated", "strict", "banking", "healthcare" -> 10;
            case "internal" -> 6;
            default -> 5;
        };

        int totalScore = interfaceScore + ratioScore + throughputScore + customDevScore + complianceScore;
        // Bound to 0 - 100
        totalScore = Math.min(100, Math.max(0, totalScore));

        ComplexityLevel level;
        if (totalScore < 35) level = ComplexityLevel.LOW;
        else if (totalScore <= 60) level = ComplexityLevel.MEDIUM;
        else if (totalScore <= 80) level = ComplexityLevel.HIGH;
        else level = ComplexityLevel.VERY_HIGH;

        Map<String, Object> contributions = new HashMap<>();
        contributions.put("interfaceCountContribution", interfaceScore);
        contributions.put("complexRatioContribution", ratioScore);
        contributions.put("throughputContribution", throughputScore);
        contributions.put("customDevContribution", customDevScore);
        contributions.put("complianceContribution", complianceScore);
        contributions.put("complexRatioPercentage", Math.round(complexRatio * 100.0));

        return new ComplexityResult(totalScore, level, contributions);
    }
}
