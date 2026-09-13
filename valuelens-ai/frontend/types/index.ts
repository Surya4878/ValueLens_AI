export type PlatformType = 'SAP PI/PO' | 'MuleSoft' | 'SAP CPI (Neo)' | 'Boomi';

export type ValueOrigin = 'USER_PROVIDED' | 'CALCULATED' | 'DERIVED' | 'ESTIMATED' | 'CATALOG' | 'AI_INTERPRETED';

export type DecisionType = 'STRONGLY_FAVORABLE' | 'FAVORABLE' | 'CONDITIONALLY_FAVORABLE' | 'NEUTRAL' | 'UNFAVORABLE' | 'INSUFFICIENT_DATA';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CompanyInfo {
  companySize?: string;
  industry?: string;
  migrationTimeline?: string;
  integrationComplexity?: string;
  availabilityRequirements?: string;
  complianceRequirements?: string;
  customDevelopment?: string;
  monitoringMaturity?: string;
}

export interface EnvironmentAssessment {
  integrationVolume?: string;
  systemComplexity?: string;
  availabilityRequirements?: string;
  customDevelopment?: string;
  complianceRequirements?: string;
  monitoring?: string;
  simpleInterfaces?: number;
  mediumInterfaces?: number;
  complexInterfaces?: number;
  totalInterfaces?: number;
  numberOfApplications?: number;
}

export interface Volumetrics {
  currentMessageThroughput?: string;
  indicativeMessageThroughput?: string;
  apiCount?: number;
  b2bInterfaces?: number;
}

export interface LicensingCosts {
  sapPiPoLicenseCosts: number;
  thirdPartyAdapterLicenses: number;
  developmentEnvironmentLicenses: number;
  testingEnvironmentLicenses: number;
  subtotal?: number;
}

export interface InfrastructureCosts {
  hardwareServerCosts: number;
  storageBackupCosts: number;
  networkingConnectivity: number;
  dataCenterFacilities: number;
  subtotal?: number;
}

export interface SupportCosts {
  sapSupportMaintenance: number;
  thirdPartySupportContracts: number;
  systemMaintenanceUpgrades: number;
  dataCenterFacilities: number;
  subtotal?: number;
}

export interface OperationsCosts {
  administrativeStaffCosts: number;
  supportStaffCosts: number;
  trainingCertificationCosts: number;
  dataCenterFacilities: number;
  subtotal?: number;
}

export interface AnnualCostBreakdown {
  licensing: LicensingCosts;
  infrastructure: InfrastructureCosts;
  support: SupportCosts;
  operations: OperationsCosts;
}

export interface SourceSystem {
  sapPiPoAnnualCostBreakdown: AnnualCostBreakdown;
  companyInformation: CompanyInfo;
  environmentAssessment: EnvironmentAssessment;
  volumetrics: Volumetrics;
}

export interface TargetConfiguration {
  selectedEditionName: string;
  numberOfUnits: number;
  additionalMessagePacks: number;
  dataSpacePackages?: number;
  additionalEicTenants?: number;
  totalAnnualCost: number;
  calculationFormula: string;
}

export interface AdditionalTcoComponents {
  totalAdditionalTcoAnnual: number;
  categories?: Record<string, unknown>;
}

export interface TargetSystem {
  targetPlatform: string;
  configuration: TargetConfiguration;
  additionalTcoComponents: AdditionalTcoComponents;
}

export interface MigrationDetails {
  developmentCost: number;
  testingCost: number;
  architectureCost: number;
  projectManagementCost: number;
  trainingCost: number;
  deploymentCutoverCost: number;
  documentationCost: number;
  baseMigrationCost: number;
  contingencyCost: number;
  totalMigrationCost: number;
  currency: string;
  roiAnalysisPeriodYears: number;
}

export interface Assessment {
  id?: string;
  name: string;
  sourcePlatform: PlatformType;
  targetPlatform: string;
  status: string;
  currency: string;
  sourceSystem: SourceSystem;
  targetSystem: TargetSystem;
  migrationRelatedDetails: MigrationDetails;
}

export interface CostDriver {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface CalculationTrace {
  metric: string;
  formula: string;
  inputs: Record<string, unknown>;
  result: unknown;
  explanation: string;
}

export interface ConsistencyWarning {
  field: string;
  providedValue: number;
  calculatedValue: number;
  variance: number;
  message: string;
}

export interface DataQualityResult {
  score: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  completenessScore: number;
  consistencyScore: number;
  validationScore: number;
  estimationScore: number;
  positiveReasons: string[];
  flags: string[];
}

export interface ComplexityResult {
  score: number;
  classification: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  factorContributions: Record<string, unknown>;
}

export interface RoiCalculationResult {
  assessmentId?: string;
  calculationResultId?: string;
  currentPlatformTCO: number;
  targetPlatformTCO: number;
  migrationCost: number;
  annualSavings: number;
  savingsPercentage: number;
  breakEvenMonths: number | null;
  breakEvenStatus: 'REACHED' | 'NOT_REACHED' | 'IMMEDIATE';
  oneYearROI: number;
  threeYearROI: number;
  fiveYearROI: number;
  tenYearROI: number;
  oneYearNetBenefit: number;
  threeYearNetBenefit: number;
  fiveYearNetBenefit: number;
  tenYearNetBenefit: number;
  annualSavingsFormula: string;
  roiFormula: string;
  breakEvenFormula: string;
  licensingSubtotal: number;
  infrastructureSubtotal: number;
  supportSubtotal: number;
  operationsSubtotal: number;
  targetConfigurationCost: number;
  targetAdditionalTco: number;
  costDrivers: CostDriver[];
  complexityResult: ComplexityResult;
  dataQuality: DataQualityResult;
  consistencyWarnings: ConsistencyWarning[];
  calculationTraces: Record<string, CalculationTrace>;
  pricingVersion: string;
  calculationVersion: string;
  calculatedAt: string;
  currency: string;
  sourcePlatform?: string;
  recommendedMigrationPackage?: string;
  recommendedBtpEdition?: string;
  indicativeTimeline?: string;
}

export interface ScenarioOutcome {
  scenarioName: string;
  savingsFactor: number;
  migrationCostFactor: number;
  targetCostFactor: number;
  currentPlatformTco: number;
  targetPlatformTco: number;
  migrationCost: number;
  annualSavings: number;
  savingsPercentage: number;
  breakEvenMonths: number | null;
  breakEvenStatus: string;
  oneYearRoi: number;
  threeYearRoi: number;
  fiveYearRoi: number;
  tenYearRoi: number;
  fiveYearNetBenefit: number;
}

export interface ScenarioResponse {
  assessmentId?: string;
  customCase: ScenarioOutcome;
  bestCase: ScenarioOutcome;
  baseCase: ScenarioOutcome;
  worstCase: ScenarioOutcome;
  sensitivityWarning?: string;
}

export interface CostDriverInsight {
  name: string;
  impact: string;
  explanation: string;
}

export interface ChartInsight {
  chartId: string;
  finding: string;
  businessImpact: string;
}

export interface RiskInsight {
  severity: RiskSeverity;
  title: string;
  reason: string;
  potentialImpact: string;
  mitigation: string;
}

export interface Recommendation {
  priority: PriorityLevel;
  action: string;
  reason: string;
  expectedImpact: string;
  owner: string;
  timing: string;
}

export interface AiAnalysisResult {
  assessmentId?: string;
  calculationResultId?: string;
  decision: DecisionType;
  confidence: number;
  executiveSummary: string;
  financialAssessment: string;
  scenarioInterpretation?: string;
  aiStatus: string;
  statusMessage?: string;
  whatTheNumbersSay: string[];
  costDrivers: CostDriverInsight[];
  chartInsights: ChartInsight[];
  keyInsights: string[];
  risks: RiskInsight[];
  opportunities: string[];
  recommendations: Recommendation[];
  decisionFactors: string[];
  assumptions: string[];
  dataQuality?: { score: number; level: string };
  aiModel?: string;
  promptVersion?: string;
  timestamp?: string;
}

export interface ChartInsightResponse {
  chartId: string;
  finding: string;
  businessImpact: string;
  recommendation: string;
  aiStatus: string;
  detailedAnalysis?: string;
  keyMetrics?: { label: string; value: string; detail: string }[];
  actionRoadmap?: { phase: string; title: string; detail: string }[];
  riskSafeguards?: { risk: string; mitigation: string }[];
}

export interface QuestionResponse {
  question: string;
  answer: string;
  evidenceUsed: string[];
  recommendedAction: string;
  aiStatus: string;
}

export interface ReportPackage {
  reportId: string;
  title: string;
  reportVersion: string;
  generatedAt: string;
  assessment: Assessment;
  calculations: RoiCalculationResult;
  aiAnalysis: AiAnalysisResult;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
