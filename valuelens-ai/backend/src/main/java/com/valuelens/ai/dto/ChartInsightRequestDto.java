package com.valuelens.ai.dto;

public class ChartInsightRequestDto {

    private String assessmentId;
    private String chartId; // "tco-comparison", "cost-drivers", "migration-cost", "roi-timeline"
    private Object chartData;

    public ChartInsightRequestDto() {}

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    public String getChartId() { return chartId; }
    public void setChartId(String chartId) { this.chartId = chartId; }
    public Object getChartData() { return chartData; }
    public void setChartData(Object chartData) { this.chartData = chartData; }
}
