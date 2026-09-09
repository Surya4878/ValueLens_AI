package com.valuelens.ai.dto;

import java.util.List;

public class ChartInsightResponseDto {

    private String chartId;
    private String finding;
    private String businessImpact;
    private String recommendation;
    private String aiStatus = "AVAILABLE";
    private String detailedAnalysis;
    private List<MetricItem> keyMetrics;
    private List<ActionItem> actionRoadmap;
    private List<SafeguardItem> riskSafeguards;

    public ChartInsightResponseDto() {}

    public ChartInsightResponseDto(String chartId, String finding, String businessImpact, String recommendation) {
        this.chartId = chartId;
        this.finding = finding;
        this.businessImpact = businessImpact;
        this.recommendation = recommendation;
    }

    public static class MetricItem {
        private String label;
        private String value;
        private String detail;

        public MetricItem() {}
        public MetricItem(String label, String value, String detail) {
            this.label = label;
            this.value = value;
            this.detail = detail;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class ActionItem {
        private String phase;
        private String title;
        private String detail;

        public ActionItem() {}
        public ActionItem(String phase, String title, String detail) {
            this.phase = phase;
            this.title = title;
            this.detail = detail;
        }

        public String getPhase() { return phase; }
        public void setPhase(String phase) { this.phase = phase; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
    }

    public static class SafeguardItem {
        private String risk;
        private String mitigation;

        public SafeguardItem() {}
        public SafeguardItem(String risk, String mitigation) {
            this.risk = risk;
            this.mitigation = mitigation;
        }

        public String getRisk() { return risk; }
        public void setRisk(String risk) { this.risk = risk; }
        public String getMitigation() { return mitigation; }
        public void setMitigation(String mitigation) { this.mitigation = mitigation; }
    }

    public String getChartId() { return chartId; }
    public void setChartId(String chartId) { this.chartId = chartId; }
    public String getFinding() { return finding; }
    public void setFinding(String finding) { this.finding = finding; }
    public String getBusinessImpact() { return businessImpact; }
    public void setBusinessImpact(String businessImpact) { this.businessImpact = businessImpact; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getAiStatus() { return aiStatus; }
    public void setAiStatus(String aiStatus) { this.aiStatus = aiStatus; }
    public String getDetailedAnalysis() { return detailedAnalysis; }
    public void setDetailedAnalysis(String detailedAnalysis) { this.detailedAnalysis = detailedAnalysis; }
    public List<MetricItem> getKeyMetrics() { return keyMetrics; }
    public void setKeyMetrics(List<MetricItem> keyMetrics) { this.keyMetrics = keyMetrics; }
    public List<ActionItem> getActionRoadmap() { return actionRoadmap; }
    public void setActionRoadmap(List<ActionItem> actionRoadmap) { this.actionRoadmap = actionRoadmap; }
    public List<SafeguardItem> getRiskSafeguards() { return riskSafeguards; }
    public void setRiskSafeguards(List<SafeguardItem> riskSafeguards) { this.riskSafeguards = riskSafeguards; }
}

