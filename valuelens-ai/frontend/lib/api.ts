import {
  ApiResponse,
  Assessment,
  RoiCalculationResult,
  ScenarioResponse,
  AiAnalysisResult,
  ChartInsightResponse,
  QuestionResponse,
  ReportPackage
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.error?.message) {
          errorMsg = parsed.error.message;
        } else if (parsed.message) {
          errorMsg = parsed.message;
        }
      } catch {
        if (errorBody) errorMsg = errorBody;
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected network error occurred');
  }
}

export const api = {
  // Assessments
  async getDemoAssessment(): Promise<Assessment> {
    const res = await fetchJson<ApiResponse<Assessment>>('/api/v1/assessments/demo');
    return res.data;
  },

  async getAssessment(id: string): Promise<Assessment> {
    const res = await fetchJson<ApiResponse<Assessment>>(`/api/v1/assessments/${id}`);
    return res.data;
  },

  async saveAssessment(assessment: Assessment): Promise<Assessment> {
    const res = await fetchJson<ApiResponse<Assessment>>('/api/v1/assessments', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
    return res.data;
  },

  // Deterministic Financial Calculations
  async calculateROI(assessment: Assessment): Promise<RoiCalculationResult> {
    const res = await fetchJson<ApiResponse<RoiCalculationResult>>('/api/v1/calculateROI', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
    return res.data;
  },

  // Scenario Simulator
  async calculateScenario(params: {
    assessmentId?: string;
    savingsFactor: number;
    migrationCostFactor: number;
    targetCostFactor: number;
    baselineCurrentTco?: number;
    baselineTargetTco?: number;
    baselineMigrationCost?: number;
  }): Promise<ScenarioResponse> {
    const res = await fetchJson<ApiResponse<ScenarioResponse>>('/api/v1/calculateScenario', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.data;
  },

  // AI Decision Intelligence
  async analyzeWithAI(params: {
    assessmentId?: string;
    assessment?: Assessment;
    calculations?: RoiCalculationResult;
    scenario?: Record<string, unknown>;
  }): Promise<AiAnalysisResult> {
    const res = await fetchJson<ApiResponse<AiAnalysisResult>>('/api/v1/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.data;
  },

  async analyzeAssessment(assessmentId: string): Promise<AiAnalysisResult> {
    return this.analyzeWithAI({ assessmentId });
  },

  async getChartInsight(chartId: string, chartData?: unknown, assessmentId?: string): Promise<ChartInsightResponse> {
    const res = await fetchJson<ApiResponse<ChartInsightResponse>>('/api/v1/ai/chart-insight', {
      method: 'POST',
      body: JSON.stringify({ chartId, chartData, assessmentId }),
    });
    return res.data;
  },

  async analyzeScenario(scenarioData: unknown): Promise<{ interpretation: string }> {
    const res = await fetchJson<ApiResponse<{ interpretation: string }>>('/api/v1/ai/scenario-analysis', {
      method: 'POST',
      body: JSON.stringify(scenarioData),
    });
    return res.data;
  },

  async askAiQuestion(assessmentId: string, question: string): Promise<QuestionResponse> {
    const res = await fetchJson<ApiResponse<QuestionResponse>>('/api/v1/ai/question', {
      method: 'POST',
      body: JSON.stringify({ assessmentId, question }),
    });
    return res.data;
  },

  async getExecutiveStory(assessmentId: string): Promise<{ story: string }> {
    const res = await fetchJson<ApiResponse<{ story: string }>>('/api/v1/ai/executive-story', {
      method: 'POST',
      body: JSON.stringify({ assessmentId }),
    });
    return res.data;
  },

  // Executive Reports
  async generateReport(assessmentId: string): Promise<ReportPackage> {
    const res = await fetchJson<ApiResponse<ReportPackage>>('/api/v1/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ assessmentId }),
    });
    return res.data;
  },

  async getReport(id: string): Promise<ReportPackage> {
    const res = await fetchJson<ApiResponse<ReportPackage>>(`/api/v1/reports/${id}`);
    return res.data;
  },

  getExportJsonUrl(assessmentId: string): string {
    return `${API_BASE_URL}/api/v1/export/json`;
  },

  getExportCsvUrl(assessmentId: string): string {
    return `${API_BASE_URL}/api/v1/export/csv`;
  }
};
