package com.valuelens.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AssessmentDto {

    private String id;
    private String name;
    private String sourcePlatform = "SAP PI/PO";
    private String targetPlatform = "SAP BTP Integration Suite";
    private String status = "DRAFT";
    private String currency = "USD";

    @JsonProperty("sourceSystem")
    private SourceSystemDto sourceSystem = new SourceSystemDto();

    @JsonProperty("targetSystem")
    private TargetSystemDto targetSystem = new TargetSystemDto();

    @JsonProperty("migrationRelatedDetails")
    private MigrationDetailsDto migrationRelatedDetails = new MigrationDetailsDto();

    public AssessmentDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSourcePlatform() { return sourcePlatform; }
    public void setSourcePlatform(String sourcePlatform) { this.sourcePlatform = sourcePlatform; }
    public String getTargetPlatform() { return targetPlatform; }
    public void setTargetPlatform(String targetPlatform) { this.targetPlatform = targetPlatform; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public SourceSystemDto getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(SourceSystemDto sourceSystem) { this.sourceSystem = sourceSystem; }
    public TargetSystemDto getTargetSystem() { return targetSystem; }
    public void setTargetSystem(TargetSystemDto targetSystem) { this.targetSystem = targetSystem; }
    public MigrationDetailsDto getMigrationRelatedDetails() { return migrationRelatedDetails; }
    public void setMigrationRelatedDetails(MigrationDetailsDto migrationRelatedDetails) { this.migrationRelatedDetails = migrationRelatedDetails; }

    public int getTotalInterfaces() {
        if (sourceSystem != null && sourceSystem.getEnvironmentAssessment() != null) {
            return sourceSystem.getEnvironmentAssessment().getTotalInterfaces();
        }
        return 0;
    }

    public int getComplexInterfaces() {
        if (sourceSystem != null && sourceSystem.getEnvironmentAssessment() != null) {
            return sourceSystem.getEnvironmentAssessment().getComplexInterfaces();
        }
        return 0;
    }

    public String getMigrationTimeline() {
        if (sourceSystem != null && sourceSystem.getCompanyInformation() != null) {
            return sourceSystem.getCompanyInformation().getMigrationTimeline();
        }
        return "";
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SourceSystemDto {
        @JsonProperty("sapPiPoAnnualCostBreakdown")
        @JsonAlias({"annualCostBreakdown", "costBreakdown"})
        private AnnualCostBreakdownDto sapPiPoAnnualCostBreakdown = new AnnualCostBreakdownDto();

        @JsonProperty("companyInformation")
        private CompanyInfoDto companyInformation = new CompanyInfoDto();

        @JsonProperty("SAPPI/POEnvironmentAssessment")
        @JsonAlias({"environmentAssessment", "environment"})
        private EnvironmentAssessmentDto environmentAssessment = new EnvironmentAssessmentDto();

        @JsonProperty("volumetrics")
        private VolumetricsDto volumetrics = new VolumetricsDto();

        public AnnualCostBreakdownDto getSapPiPoAnnualCostBreakdown() { return sapPiPoAnnualCostBreakdown; }
        public void setSapPiPoAnnualCostBreakdown(AnnualCostBreakdownDto b) { this.sapPiPoAnnualCostBreakdown = b; }
        public CompanyInfoDto getCompanyInformation() { return companyInformation; }
        public void setCompanyInformation(CompanyInfoDto c) { this.companyInformation = c; }
        public EnvironmentAssessmentDto getEnvironmentAssessment() { return environmentAssessment; }
        public void setEnvironmentAssessment(EnvironmentAssessmentDto e) { this.environmentAssessment = e; }
        public VolumetricsDto getVolumetrics() { return volumetrics; }
        public void setVolumetrics(VolumetricsDto v) { this.volumetrics = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnnualCostBreakdownDto {
        private LicensingCostsDto licensing = new LicensingCostsDto();
        private InfrastructureCostsDto infrastructure = new InfrastructureCostsDto();
        private SupportCostsDto support = new SupportCostsDto();
        private OperationsCostsDto operations = new OperationsCostsDto();

        public LicensingCostsDto getLicensing() { return licensing; }
        public void setLicensing(LicensingCostsDto licensing) { this.licensing = licensing; }
        public InfrastructureCostsDto getInfrastructure() { return infrastructure; }
        public void setInfrastructure(InfrastructureCostsDto infrastructure) { this.infrastructure = infrastructure; }
        public SupportCostsDto getSupport() { return support; }
        public void setSupport(SupportCostsDto support) { this.support = support; }
        public OperationsCostsDto getOperations() { return operations; }
        public void setOperations(OperationsCostsDto operations) { this.operations = operations; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LicensingCostsDto {
        @JsonProperty("sapPiPoLicenseCosts")
        @JsonAlias({"licenseCosts", "sapLicenseCosts"})
        private BigDecimal sapPiPoLicenseCosts = BigDecimal.ZERO;

        @JsonProperty("thirdPartyAdapterLicenses")
        @JsonAlias({"adapterLicenses"})
        private BigDecimal thirdPartyAdapterLicenses = BigDecimal.ZERO;

        @JsonProperty("developmentEnvironmentLicenses")
        @JsonAlias({"devEnvLicenses"})
        private BigDecimal developmentEnvironmentLicenses = BigDecimal.ZERO;

        @JsonProperty("testingEnvironmentLicenses")
        @JsonAlias({"testEnvLicenses"})
        private BigDecimal testingEnvironmentLicenses = BigDecimal.ZERO;

        private BigDecimal subtotal;

        public BigDecimal getSapPiPoLicenseCosts() { return sapPiPoLicenseCosts; }
        public void setSapPiPoLicenseCosts(BigDecimal v) { this.sapPiPoLicenseCosts = v; }
        public BigDecimal getThirdPartyAdapterLicenses() { return thirdPartyAdapterLicenses; }
        public void setThirdPartyAdapterLicenses(BigDecimal v) { this.thirdPartyAdapterLicenses = v; }
        public BigDecimal getDevelopmentEnvironmentLicenses() { return developmentEnvironmentLicenses; }
        public void setDevelopmentEnvironmentLicenses(BigDecimal v) { this.developmentEnvironmentLicenses = v; }
        public BigDecimal getTestingEnvironmentLicenses() { return testingEnvironmentLicenses; }
        public void setTestingEnvironmentLicenses(BigDecimal v) { this.testingEnvironmentLicenses = v; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InfrastructureCostsDto {
        @JsonProperty("hardware&ServerCosts")
        @JsonAlias({"hardwareServerCosts", "hardwareAndServerCosts"})
        private BigDecimal hardwareServerCosts = BigDecimal.ZERO;

        @JsonProperty("storage&backupCosts")
        @JsonAlias({"storageBackupCosts", "storageAndBackupCosts"})
        private BigDecimal storageBackupCosts = BigDecimal.ZERO;

        @JsonProperty("networking&connectivity")
        @JsonAlias({"networkingConnectivity", "networkingAndConnectivity"})
        private BigDecimal networkingConnectivity = BigDecimal.ZERO;

        @JsonProperty("dataCenter&facilities")
        @JsonAlias({"dataCenterFacilities", "dataCenterAndFacilities"})
        private BigDecimal dataCenterFacilities = BigDecimal.ZERO;

        private BigDecimal subtotal;

        public BigDecimal getHardwareServerCosts() { return hardwareServerCosts; }
        public void setHardwareServerCosts(BigDecimal v) { this.hardwareServerCosts = v; }
        public BigDecimal getStorageBackupCosts() { return storageBackupCosts; }
        public void setStorageBackupCosts(BigDecimal v) { this.storageBackupCosts = v; }
        public BigDecimal getNetworkingConnectivity() { return networkingConnectivity; }
        public void setNetworkingConnectivity(BigDecimal v) { this.networkingConnectivity = v; }
        public BigDecimal getDataCenterFacilities() { return dataCenterFacilities; }
        public void setDataCenterFacilities(BigDecimal v) { this.dataCenterFacilities = v; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SupportCostsDto {
        @JsonProperty("SAPSupport&Maintainance")
        @JsonAlias({"sapSupportMaintenance", "supportMaintenance", "SAPSupport&Maintenance"})
        private BigDecimal sapSupportMaintenance = BigDecimal.ZERO;

        @JsonProperty("thirdPartySupportContracts")
        @JsonAlias({"thirdPartySupport"})
        private BigDecimal thirdPartySupportContracts = BigDecimal.ZERO;

        @JsonProperty("systemMaintainance&upgrades")
        @JsonAlias({"systemMaintenanceUpgrades", "systemMaintenance&upgrades"})
        private BigDecimal systemMaintenanceUpgrades = BigDecimal.ZERO;

        @JsonProperty("dataCenter&facilities")
        @JsonAlias({"dataCenterFacilities"})
        private BigDecimal dataCenterFacilities = BigDecimal.ZERO;

        private BigDecimal subtotal;

        public BigDecimal getSapSupportMaintenance() { return sapSupportMaintenance; }
        public void setSapSupportMaintenance(BigDecimal v) { this.sapSupportMaintenance = v; }
        public BigDecimal getThirdPartySupportContracts() { return thirdPartySupportContracts; }
        public void setThirdPartySupportContracts(BigDecimal v) { this.thirdPartySupportContracts = v; }
        public BigDecimal getSystemMaintenanceUpgrades() { return systemMaintenanceUpgrades; }
        public void setSystemMaintenanceUpgrades(BigDecimal v) { this.systemMaintenanceUpgrades = v; }
        public BigDecimal getDataCenterFacilities() { return dataCenterFacilities; }
        public void setDataCenterFacilities(BigDecimal v) { this.dataCenterFacilities = v; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OperationsCostsDto {
        @JsonProperty("administrativeStaffCosts")
        @JsonAlias({"adminStaffCosts"})
        private BigDecimal administrativeStaffCosts = BigDecimal.ZERO;

        @JsonProperty("supportStaffCosts")
        private BigDecimal supportStaffCosts = BigDecimal.ZERO;

        @JsonProperty("training&certificationCosts")
        @JsonAlias({"trainingCertificationCosts", "training&CertificationCosts"})
        private BigDecimal trainingCertificationCosts = BigDecimal.ZERO;

        @JsonProperty("dataCenter&facilities")
        @JsonAlias({"dataCenterFacilities"})
        private BigDecimal dataCenterFacilities = BigDecimal.ZERO;

        private BigDecimal subtotal;

        public BigDecimal getAdministrativeStaffCosts() { return administrativeStaffCosts; }
        public void setAdministrativeStaffCosts(BigDecimal v) { this.administrativeStaffCosts = v; }
        public BigDecimal getSupportStaffCosts() { return supportStaffCosts; }
        public void setSupportStaffCosts(BigDecimal v) { this.supportStaffCosts = v; }
        public BigDecimal getTrainingCertificationCosts() { return trainingCertificationCosts; }
        public void setTrainingCertificationCosts(BigDecimal v) { this.trainingCertificationCosts = v; }
        public BigDecimal getDataCenterFacilities() { return dataCenterFacilities; }
        public void setDataCenterFacilities(BigDecimal v) { this.dataCenterFacilities = v; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CompanyInfoDto {
        private String companySize = "";
        private String industry = "";
        private String migrationTimeline = "";
        private String integrationComplexity = "";
        private String availabilityRequirements = "";
        private String complianceRequirements = "";
        private String customDevelopment = "";
        private String monitoringMaturity = "";

        public String getCompanySize() { return companySize; }
        public void setCompanySize(String companySize) { this.companySize = companySize; }
        public String getIndustry() { return industry; }
        public void setIndustry(String industry) { this.industry = industry; }
        public String getMigrationTimeline() { return migrationTimeline; }
        public void setMigrationTimeline(String migrationTimeline) { this.migrationTimeline = migrationTimeline; }
        public String getIntegrationComplexity() { return integrationComplexity; }
        public void setIntegrationComplexity(String integrationComplexity) { this.integrationComplexity = integrationComplexity; }
        public String getAvailabilityRequirements() { return availabilityRequirements; }
        public void setAvailabilityRequirements(String availabilityRequirements) { this.availabilityRequirements = availabilityRequirements; }
        public String getComplianceRequirements() { return complianceRequirements; }
        public void setComplianceRequirements(String complianceRequirements) { this.complianceRequirements = complianceRequirements; }
        public String getCustomDevelopment() { return customDevelopment; }
        public void setCustomDevelopment(String customDevelopment) { this.customDevelopment = customDevelopment; }
        public String getMonitoringMaturity() { return monitoringMaturity; }
        public void setMonitoringMaturity(String monitoringMaturity) { this.monitoringMaturity = monitoringMaturity; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EnvironmentAssessmentDto {
        private String integrationVolume = "";
        private String systemComplexity = "";
        private String availabilityRequirements = "";
        private String customDevelopment = "";
        @JsonProperty("complainceRequirements")
        @JsonAlias({"complianceRequirements"})
        private String complianceRequirements = "";
        private String monitoring = "";
        private int simpleInterfaces = 0;
        private int mediumInterfaces = 0;
        private int complexInterfaces = 0;
        private int totalInterfaces = 0;

        public String getIntegrationVolume() { return integrationVolume; }
        public void setIntegrationVolume(String integrationVolume) { this.integrationVolume = integrationVolume; }
        public String getSystemComplexity() { return systemComplexity; }
        public void setSystemComplexity(String systemComplexity) { this.systemComplexity = systemComplexity; }
        public String getAvailabilityRequirements() { return availabilityRequirements; }
        public void setAvailabilityRequirements(String availabilityRequirements) { this.availabilityRequirements = availabilityRequirements; }
        public String getCustomDevelopment() { return customDevelopment; }
        public void setCustomDevelopment(String customDevelopment) { this.customDevelopment = customDevelopment; }
        public String getComplianceRequirements() { return complianceRequirements; }
        public void setComplianceRequirements(String complianceRequirements) { this.complianceRequirements = complianceRequirements; }
        public String getMonitoring() { return monitoring; }
        public void setMonitoring(String monitoring) { this.monitoring = monitoring; }
        public int getSimpleInterfaces() { return simpleInterfaces; }
        public void setSimpleInterfaces(int simpleInterfaces) { this.simpleInterfaces = simpleInterfaces; }
        public int getMediumInterfaces() { return mediumInterfaces; }
        public void setMediumInterfaces(int mediumInterfaces) { this.mediumInterfaces = mediumInterfaces; }
        public int getComplexInterfaces() { return complexInterfaces; }
        public void setComplexInterfaces(int complexInterfaces) { this.complexInterfaces = complexInterfaces; }
        public int getTotalInterfaces() { return totalInterfaces; }
        public void setTotalInterfaces(int totalInterfaces) { this.totalInterfaces = totalInterfaces; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumetricsDto {
        private String currentMessageThroughput = "";
        private String indicativeMessageThroughput = "";
        private int apiCount = 0;
        private int b2bInterfaces = 0;

        public String getCurrentMessageThroughput() { return currentMessageThroughput; }
        public void setCurrentMessageThroughput(String currentMessageThroughput) { this.currentMessageThroughput = currentMessageThroughput; }
        public String getIndicativeMessageThroughput() { return indicativeMessageThroughput; }
        public void setIndicativeMessageThroughput(String indicativeMessageThroughput) { this.indicativeMessageThroughput = indicativeMessageThroughput; }
        public int getApiCount() { return apiCount; }
        public void setApiCount(int apiCount) { this.apiCount = apiCount; }
        public int getB2bInterfaces() { return b2bInterfaces; }
        public void setB2bInterfaces(int b2bInterfaces) { this.b2bInterfaces = b2bInterfaces; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TargetSystemDto {
        private String targetPlatform = "SAP BTP Integration Suite";
        private TargetConfigurationDto configuration = new TargetConfigurationDto();
        private AdditionalTcoComponentsDto additionalTcoComponents = new AdditionalTcoComponentsDto();

        public String getTargetPlatform() { return targetPlatform; }
        public void setTargetPlatform(String targetPlatform) { this.targetPlatform = targetPlatform; }
        public TargetConfigurationDto getConfiguration() { return configuration; }
        public void setConfiguration(TargetConfigurationDto configuration) { this.configuration = configuration; }
        public AdditionalTcoComponentsDto getAdditionalTcoComponents() { return additionalTcoComponents; }
        public void setAdditionalTcoComponents(AdditionalTcoComponentsDto additionalTcoComponents) { this.additionalTcoComponents = additionalTcoComponents; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TargetConfigurationDto {
        private String selectedEditionName = "";
        private int numberOfUnits = 0;
        private int additionalMessagePacks = 0;
        private int dataSpacePackages = 0;
        private int additionalEicTenants = 0;
        private BigDecimal totalAnnualCost = BigDecimal.ZERO;
        private String calculationFormula = "";

        public String getSelectedEditionName() { return selectedEditionName; }
        public void setSelectedEditionName(String selectedEditionName) { this.selectedEditionName = selectedEditionName; }
        public int getNumberOfUnits() { return numberOfUnits; }
        public void setNumberOfUnits(int numberOfUnits) { this.numberOfUnits = numberOfUnits; }
        public int getAdditionalMessagePacks() { return additionalMessagePacks; }
        public void setAdditionalMessagePacks(int additionalMessagePacks) { this.additionalMessagePacks = additionalMessagePacks; }
        public int getDataSpacePackages() { return dataSpacePackages; }
        public void setDataSpacePackages(int dataSpacePackages) { this.dataSpacePackages = dataSpacePackages; }
        public int getAdditionalEicTenants() { return additionalEicTenants; }
        public void setAdditionalEicTenants(int additionalEicTenants) { this.additionalEicTenants = additionalEicTenants; }
        public BigDecimal getTotalAnnualCost() { return totalAnnualCost; }
        public void setTotalAnnualCost(BigDecimal totalAnnualCost) { this.totalAnnualCost = totalAnnualCost; }
        public String getCalculationFormula() { return calculationFormula; }
        public void setCalculationFormula(String calculationFormula) { this.calculationFormula = calculationFormula; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AdditionalTcoComponentsDto {
        private BigDecimal totalAdditionalTcoAnnual = BigDecimal.ZERO;
        private Map<String, Object> categories;

        public BigDecimal getTotalAdditionalTcoAnnual() { return totalAdditionalTcoAnnual; }
        public void setTotalAdditionalTcoAnnual(BigDecimal totalAdditionalTcoAnnual) { this.totalAdditionalTcoAnnual = totalAdditionalTcoAnnual; }
        public Map<String, Object> getCategories() { return categories; }
        public void setCategories(Map<String, Object> categories) { this.categories = categories; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MigrationDetailsDto {
        private BigDecimal developmentCost = BigDecimal.ZERO;
        private BigDecimal testingCost = BigDecimal.ZERO;
        private BigDecimal architectureCost = BigDecimal.ZERO;
        private BigDecimal projectManagementCost = BigDecimal.ZERO;
        private BigDecimal trainingCost = BigDecimal.ZERO;
        private BigDecimal deploymentCutoverCost = BigDecimal.ZERO;
        private BigDecimal documentationCost = BigDecimal.ZERO;
        private BigDecimal baseMigrationCost = BigDecimal.ZERO;
        private BigDecimal contingencyCost = BigDecimal.ZERO;
        private BigDecimal totalMigrationCost = BigDecimal.ZERO;
        private String currency = "USD";
        private int roiAnalysisPeriodYears = 5;

        public BigDecimal getDevelopmentCost() { return developmentCost; }
        public void setDevelopmentCost(BigDecimal developmentCost) { this.developmentCost = developmentCost; }
        public BigDecimal getTestingCost() { return testingCost; }
        public void setTestingCost(BigDecimal testingCost) { this.testingCost = testingCost; }
        public BigDecimal getArchitectureCost() { return architectureCost; }
        public void setArchitectureCost(BigDecimal architectureCost) { this.architectureCost = architectureCost; }
        public BigDecimal getProjectManagementCost() { return projectManagementCost; }
        public void setProjectManagementCost(BigDecimal projectManagementCost) { this.projectManagementCost = projectManagementCost; }
        public BigDecimal getTrainingCost() { return trainingCost; }
        public void setTrainingCost(BigDecimal trainingCost) { this.trainingCost = trainingCost; }
        public BigDecimal getDeploymentCutoverCost() { return deploymentCutoverCost; }
        public void setDeploymentCutoverCost(BigDecimal deploymentCutoverCost) { this.deploymentCutoverCost = deploymentCutoverCost; }
        public BigDecimal getDocumentationCost() { return documentationCost; }
        public void setDocumentationCost(BigDecimal documentationCost) { this.documentationCost = documentationCost; }
        public BigDecimal getBaseMigrationCost() { return baseMigrationCost; }
        public void setBaseMigrationCost(BigDecimal baseMigrationCost) { this.baseMigrationCost = baseMigrationCost; }
        public BigDecimal getContingencyCost() { return contingencyCost; }
        public void setContingencyCost(BigDecimal contingencyCost) { this.contingencyCost = contingencyCost; }
        public BigDecimal getTotalMigrationCost() { return totalMigrationCost; }
        public void setTotalMigrationCost(BigDecimal totalMigrationCost) { this.totalMigrationCost = totalMigrationCost; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public int getRoiAnalysisPeriodYears() { return roiAnalysisPeriodYears; }
        public void setRoiAnalysisPeriodYears(int roiAnalysisPeriodYears) { this.roiAnalysisPeriodYears = roiAnalysisPeriodYears; }
    }
}
