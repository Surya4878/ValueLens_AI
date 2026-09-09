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
        lic.setSapPiPoLicenseCosts(BigDecimal.valueOf(150000));
        lic.setThirdPartyAdapterLicenses(BigDecimal.valueOf(50000));
        lic.setDevelopmentEnvironmentLicenses(BigDecimal.valueOf(30000));
        lic.setTestingEnvironmentLicenses(BigDecimal.valueOf(20000));
        lic.setSubtotal(BigDecimal.valueOf(250000));

        // Infrastructure: 80k + 25k + 15k + 40k = 160k
        var inf = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getInfrastructure();
        inf.setHardwareServerCosts(BigDecimal.valueOf(80000));
        inf.setStorageBackupCosts(BigDecimal.valueOf(25000));
        inf.setNetworkingConnectivity(BigDecimal.valueOf(15000));
        inf.setDataCenterFacilities(BigDecimal.valueOf(40000));
        inf.setSubtotal(BigDecimal.valueOf(160000));

        // Support: 80k + 25k + 15k + 40k = 160k
        var sup = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getSupport();
        sup.setSapSupportMaintenance(BigDecimal.valueOf(80000));
        sup.setThirdPartySupportContracts(BigDecimal.valueOf(25000));
        sup.setSystemMaintenanceUpgrades(BigDecimal.valueOf(15000));
        sup.setDataCenterFacilities(BigDecimal.valueOf(40000));
        sup.setSubtotal(BigDecimal.valueOf(160000));

        // Operations: 80k + 25k + 15k + 40k = 160k
        var ops = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getOperations();
        ops.setAdministrativeStaffCosts(BigDecimal.valueOf(80000));
        ops.setSupportStaffCosts(BigDecimal.valueOf(25000));
        ops.setTrainingCertificationCosts(BigDecimal.valueOf(15000));
        ops.setDataCenterFacilities(BigDecimal.valueOf(40000));
        ops.setSubtotal(BigDecimal.valueOf(160000));

        // Company Information
        var comp = dto.getSourceSystem().getCompanyInformation();
        comp.setCompanySize("200");
        comp.setIndustry("Retail");
        comp.setMigrationTimeline("6months");

        // Environment Assessment
        var env = dto.getSourceSystem().getEnvironmentAssessment();
        env.setIntegrationVolume("medium");
        env.setSystemComplexity("moderate");
        env.setAvailabilityRequirements("high");
        env.setCustomDevelopment("moderate");
        env.setComplianceRequirements("regulated");
        env.setMonitoring("enhanced");
        env.setSimpleInterfaces(800);
        env.setMediumInterfaces(200);
        env.setComplexInterfaces(50);
        env.setTotalInterfaces(1050);

        // Volumetrics
        var vol = dto.getSourceSystem().getVolumetrics();
        vol.setCurrentMessageThroughput("200000");
        vol.setIndicativeMessageThroughput("300000");
        vol.setApiCount(45);
        vol.setB2bInterfaces(20);

        // Target System Configuration (Standard Edition: 3 units * $57,900 + 400 packs * $75.96 = $204,084 + $109,000 = $313,084)
        var targetConfig = dto.getTargetSystem().getConfiguration();
        targetConfig.setSelectedEditionName("SAP Integration Suite, Standard Edition");
        targetConfig.setNumberOfUnits(3);
        targetConfig.setAdditionalMessagePacks(400);
        targetConfig.setTotalAnnualCost(BigDecimal.valueOf(204084.00));
        targetConfig.setCalculationFormula("3 x $ 57,900.00 + 400 x $ 75.96");

        var targetAdd = dto.getTargetSystem().getAdditionalTcoComponents();
        targetAdd.setTotalAdditionalTcoAnnual(BigDecimal.valueOf(109000.00));

        // Migration Costs: 200k + 15k + 15k + 15k + 5k + 10k + 10k = 270k Base + 30k Contingency = 300k Total
        var mig = dto.getMigrationRelatedDetails();
        mig.setDevelopmentCost(BigDecimal.valueOf(200000));
        mig.setTestingCost(BigDecimal.valueOf(15000));
        mig.setArchitectureCost(BigDecimal.valueOf(15000));
        mig.setProjectManagementCost(BigDecimal.valueOf(15000));
        mig.setTrainingCost(BigDecimal.valueOf(5000));
        mig.setDeploymentCutoverCost(BigDecimal.valueOf(10000));
        mig.setDocumentationCost(BigDecimal.valueOf(10000));
        mig.setBaseMigrationCost(BigDecimal.valueOf(270000));
        mig.setContingencyCost(BigDecimal.valueOf(30000));
        mig.setTotalMigrationCost(BigDecimal.valueOf(300000));
        mig.setCurrency("USD");
        mig.setRoiAnalysisPeriodYears(5);

        return dto;
    }
}
