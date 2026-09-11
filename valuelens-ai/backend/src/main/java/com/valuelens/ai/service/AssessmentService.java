package com.valuelens.ai.service;

import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.model.AssessmentEntity;
import com.valuelens.ai.repository.AssessmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final Map<String, AssessmentDto> inMemoryStore = new HashMap<>();

    public AssessmentService(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
        // Preload demo assessment into store
        AssessmentDto demo = buildDemoAssessment();
        inMemoryStore.put(demo.getId(), demo);
    }

    @Transactional
    public AssessmentDto saveAssessment(AssessmentDto dto) {
        if (dto.getId() == null || dto.getId().isBlank()) {
            dto.setId("asmt-" + UUID.randomUUID().toString().substring(0, 8));
        }

        AssessmentEntity entity = new AssessmentEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getName() != null ? dto.getName() : "Enterprise Integration Assessment");
        entity.setSourcePlatform(dto.getSourcePlatform() != null ? dto.getSourcePlatform() : "SAP PI/PO");
        entity.setTargetPlatform(dto.getTargetPlatform() != null ? dto.getTargetPlatform() : "SAP BTP Integration Suite");
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "COMPLETED");
        entity.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "USD");
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setCreatedBy("Enterprise Architect");

        assessmentRepository.save(entity);
        inMemoryStore.put(dto.getId(), dto);

        return dto;
    }

    public AssessmentDto getAssessment(String id) {
        if (inMemoryStore.containsKey(id)) {
            return inMemoryStore.get(id);
        }
        var opt = assessmentRepository.findById(id);
        if (opt.isPresent()) {
            AssessmentDto dto = buildDemoAssessment();
            dto.setId(opt.get().getId());
            dto.setName(opt.get().getName());
            dto.setSourcePlatform(opt.get().getSourcePlatform());
            dto.setTargetPlatform(opt.get().getTargetPlatform());
            dto.setCurrency(opt.get().getCurrency());
            return dto;
        }
        return buildDemoAssessment();
    }

    public List<AssessmentDto> listAssessments() {
        return new ArrayList<>(inMemoryStore.values());
    }

    public AssessmentDto buildDemoAssessment() {
        AssessmentDto dto = new AssessmentDto();
        dto.setId("demo-sap-pipo-to-btp");
        dto.setName("Retail Enterprise SAP PI/PO Migration Assessment");
        dto.setSourcePlatform("SAP PI/PO");
        dto.setTargetPlatform("SAP BTP Integration Suite");
        dto.setStatus("COMPLETED");
        dto.setCurrency("USD");

        // Licensing: 150k + 50k + 30k + 20k = 250k
        var lic = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getLicensing();
        lic.setSapPiPoLicenseCosts(BigDecimal.valueOf(45000));
        lic.setThirdPartyAdapterLicenses(BigDecimal.valueOf(10000));
        lic.setDevelopmentEnvironmentLicenses(BigDecimal.valueOf(10000));
        lic.setTestingEnvironmentLicenses(BigDecimal.valueOf(5000));
        lic.setSubtotal(BigDecimal.valueOf(70000));

        // Infrastructure: 15k + 5k + 5k + 5k = 30k
        var inf = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getInfrastructure();
        inf.setHardwareServerCosts(BigDecimal.valueOf(15000));
        inf.setStorageBackupCosts(BigDecimal.valueOf(5000));
        inf.setNetworkingConnectivity(BigDecimal.valueOf(5000));
        inf.setDataCenterFacilities(BigDecimal.valueOf(5000));
        inf.setSubtotal(BigDecimal.valueOf(30000));

        // Support: 15k + 5k + 5k = 25k
        var sup = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getSupport();
        sup.setSapSupportMaintenance(BigDecimal.valueOf(15000));
        sup.setThirdPartySupportContracts(BigDecimal.valueOf(5000));
        sup.setSystemMaintenanceUpgrades(BigDecimal.valueOf(5000));
        sup.setDataCenterFacilities(BigDecimal.ZERO);
        sup.setSubtotal(BigDecimal.valueOf(25000));

        // Operations: 12k + 8k = 20k
        var ops = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getOperations();
        ops.setAdministrativeStaffCosts(BigDecimal.valueOf(12000));
        ops.setSupportStaffCosts(BigDecimal.valueOf(8000));
        ops.setTrainingCertificationCosts(BigDecimal.ZERO);
        ops.setDataCenterFacilities(BigDecimal.ZERO);
        ops.setSubtotal(BigDecimal.valueOf(20000));

        // Company Information
        var comp = dto.getSourceSystem().getCompanyInformation();
        comp.setCompanySize("200");
        comp.setIndustry("Retail");
        comp.setMigrationTimeline("2 Months (Incture Starter Package)");

        // Environment Assessment
        var env = dto.getSourceSystem().getEnvironmentAssessment();
        env.setIntegrationVolume("low");
        env.setSystemComplexity("simple");
        env.setAvailabilityRequirements("high");
        env.setCustomDevelopment("low");
        env.setComplianceRequirements("standard");
        env.setMonitoring("standard");
        env.setSimpleInterfaces(10);
        env.setMediumInterfaces(0);
        env.setComplexInterfaces(0);
        env.setTotalInterfaces(10);

        // Volumetrics
        var vol = dto.getSourceSystem().getVolumetrics();
        vol.setCurrentMessageThroughput("50000");
        vol.setIndicativeMessageThroughput("50000");
        vol.setApiCount(10);
        vol.setB2bInterfaces(0);

        // Target System Configuration (Starter Edition: 1 unit * $20,736 = $20,736 + $25,000 = $45,736)
        var targetConfig = dto.getTargetSystem().getConfiguration();
        targetConfig.setSelectedEditionName("SAP Integration Suite, Starter Edition");
        targetConfig.setNumberOfUnits(1);
        targetConfig.setAdditionalMessagePacks(0);
        targetConfig.setTotalAnnualCost(BigDecimal.valueOf(20736.00));
        targetConfig.setCalculationFormula("1 x $ 20,736.00");

        var targetAdd = dto.getTargetSystem().getAdditionalTcoComponents();
        targetAdd.setTotalAdditionalTcoAnnual(BigDecimal.valueOf(25000.00));

        // Migration Costs: Incture Starter Package ($19,000 total indicative cost)
        // 11.4k Development (60%) + 3.8k IntSwitch Testing (20%) + 1.9k Setup/Architecture (10%) + 1.9k PM/Hypercare (10%) = 19k
        var mig = dto.getMigrationRelatedDetails();
        mig.setDevelopmentCost(BigDecimal.valueOf(11400));
        mig.setTestingCost(BigDecimal.valueOf(3800));
        mig.setArchitectureCost(BigDecimal.valueOf(1900));
        mig.setProjectManagementCost(BigDecimal.valueOf(1900));
        mig.setTrainingCost(BigDecimal.ZERO);
        mig.setDeploymentCutoverCost(BigDecimal.ZERO);
        mig.setDocumentationCost(BigDecimal.ZERO);
        mig.setBaseMigrationCost(BigDecimal.valueOf(19000));
        mig.setContingencyCost(BigDecimal.ZERO);
        mig.setTotalMigrationCost(BigDecimal.valueOf(19000));
        mig.setCurrency("USD");
        mig.setRoiAnalysisPeriodYears(5);

        return dto;
    }
}
