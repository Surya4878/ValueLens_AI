package com.valuelens.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valuelens.ai.dto.AssessmentDto;
import com.valuelens.ai.exception.AccessDeniedException;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AssessmentService(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    @Transactional
    public AssessmentDto saveAssessment(AssessmentDto dto) {
        return saveAssessment(dto, null);
    }

    @Transactional
    public AssessmentDto saveAssessment(AssessmentDto dto, String userId) {
        if (dto.getId() == null || dto.getId().isBlank()) {
            dto.setId("asmt-" + UUID.randomUUID().toString().substring(0, 8));
        }

        Optional<AssessmentEntity> existingOpt = assessmentRepository.findById(dto.getId());
        AssessmentEntity entity;
        if (existingOpt.isPresent()) {
            entity = existingOpt.get();
            // Ownership check: If assessment already has a userId and caller does not match, reject
            if (entity.getUserId() != null && !entity.getUserId().isBlank()) {
                if (userId == null || !entity.getUserId().equals(userId)) {
                    throw new AccessDeniedException("Access denied: You do not have permission to modify this assessment.");
                }
            }
        } else {
            entity = new AssessmentEntity();
            entity.setId(dto.getId());
            entity.setCreatedAt(LocalDateTime.now());
        }

        entity.setName(dto.getName() != null ? dto.getName() : "Enterprise Integration Assessment");
        entity.setSourcePlatform(dto.getSourcePlatform() != null ? dto.getSourcePlatform() : "SAP PI/PO");
        entity.setTargetPlatform(dto.getTargetPlatform() != null ? dto.getTargetPlatform() : "SAP BTP Integration Suite");
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "COMPLETED");
        entity.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "USD");
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setCreatedBy("Enterprise Architect");
        if (userId != null && !userId.isBlank()) {
            entity.setUserId(userId);
        }

        try {
            entity.setAssessmentData(objectMapper.writeValueAsString(dto));
        } catch (Exception ignored) {}

        assessmentRepository.save(entity);
        return dto;
    }

    public AssessmentDto getAssessment(String id) {
        return getAssessment(id, null);
    }

    public AssessmentDto getAssessment(String id, String userId) {
        // Public demo assessment baseline
        if ("demo-assessment-1".equals(id) || "demo-sap-pipo-to-btp".equals(id) || id == null || id.isBlank()) {
            return buildDemoAssessment();
        }

        Optional<AssessmentEntity> opt = assessmentRepository.findById(id);
        if (opt.isPresent()) {
            AssessmentEntity entity = opt.get();
            // Check ownership
            if (entity.getUserId() != null && !entity.getUserId().isBlank()) {
                if (userId == null || !entity.getUserId().equals(userId)) {
                    throw new AccessDeniedException("Access denied: You do not have permission to view this assessment.");
                }
            }
            if (entity.getAssessmentData() != null && !entity.getAssessmentData().isBlank()) {
                try {
                    return objectMapper.readValue(entity.getAssessmentData(), AssessmentDto.class);
                } catch (Exception ignored) {}
            }
            AssessmentDto dto = buildDemoAssessment();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setSourcePlatform(entity.getSourcePlatform());
            dto.setTargetPlatform(entity.getTargetPlatform());
            dto.setCurrency(entity.getCurrency());
            return dto;
        }

        throw new IllegalArgumentException("Assessment not found with id: " + id);
    }

    public List<AssessmentDto> listAssessments() {
        return listAssessments(null);
    }

    public List<AssessmentDto> listAssessments(String userId) {
        if (userId == null || userId.isBlank()) {
            return List.of(buildDemoAssessment());
        }

        List<AssessmentEntity> entities = assessmentRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        List<AssessmentDto> dtos = new ArrayList<>();
        for (AssessmentEntity entity : entities) {
            if (entity.getAssessmentData() != null && !entity.getAssessmentData().isBlank()) {
                try {
                    dtos.add(objectMapper.readValue(entity.getAssessmentData(), AssessmentDto.class));
                    continue;
                } catch (Exception ignored) {}
            }
            AssessmentDto fallback = new AssessmentDto();
            fallback.setId(entity.getId());
            fallback.setName(entity.getName());
            fallback.setSourcePlatform(entity.getSourcePlatform());
            fallback.setTargetPlatform(entity.getTargetPlatform());
            fallback.setStatus(entity.getStatus());
            fallback.setCurrency(entity.getCurrency());
            dtos.add(fallback);
        }
        return dtos;
    }

    public AssessmentDto buildDemoAssessment() {
        AssessmentDto dto = new AssessmentDto();
        dto.setId("demo-assessment-1");
        dto.setName("Enterprise SAP PI/PO to SAP BTP Migration Assessment");
        dto.setSourcePlatform("SAP PI/PO");
        dto.setTargetPlatform("SAP BTP Integration Suite");
        dto.setStatus("COMPLETED");
        dto.setCurrency("USD");

        // Licensing & Maintenance: $85,000
        var lic = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getLicensing();
        lic.setSapPiPoLicenseCosts(BigDecimal.valueOf(55000));
        lic.setThirdPartyAdapterLicenses(BigDecimal.valueOf(15000));
        lic.setDevelopmentEnvironmentLicenses(BigDecimal.valueOf(10000));
        lic.setTestingEnvironmentLicenses(BigDecimal.valueOf(5000));
        lic.setSubtotal(BigDecimal.valueOf(85000));

        // Infrastructure & Hosting: $35,000
        var inf = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getInfrastructure();
        inf.setHardwareServerCosts(BigDecimal.valueOf(18000));
        inf.setStorageBackupCosts(BigDecimal.valueOf(7000));
        inf.setNetworkingConnectivity(BigDecimal.valueOf(5000));
        inf.setDataCenterFacilities(BigDecimal.valueOf(5000));
        inf.setSubtotal(BigDecimal.valueOf(35000));

        // Operations & Administration: $45,000
        var ops = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getOperations();
        ops.setAdministrativeStaffCosts(BigDecimal.valueOf(25000));
        ops.setSupportStaffCosts(BigDecimal.valueOf(15000));
        ops.setTrainingCertificationCosts(BigDecimal.valueOf(5000));
        ops.setDataCenterFacilities(BigDecimal.ZERO);
        ops.setSubtotal(BigDecimal.valueOf(45000));

        // Support & External Contracts: $25,000
        var sup = dto.getSourceSystem().getSapPiPoAnnualCostBreakdown().getSupport();
        sup.setSapSupportMaintenance(BigDecimal.valueOf(15000));
        sup.setThirdPartySupportContracts(BigDecimal.valueOf(5000));
        sup.setSystemMaintenanceUpgrades(BigDecimal.valueOf(5000));
        sup.setDataCenterFacilities(BigDecimal.ZERO);
        sup.setSubtotal(BigDecimal.valueOf(25000));

        // Total Current TCO: $85,000 + $35,000 + $45,000 + $25,000 = $190,000

        // Company Information
        var comp = dto.getSourceSystem().getCompanyInformation();
        comp.setCompanySize("500");
        comp.setIndustry("Manufacturing / Retail");
        comp.setMigrationTimeline("4 Months (Incture Silver Package)");
        comp.setIntegrationComplexity("Moderate");

        // Environment Assessment (PO 7.5, 45 interfaces, 5 applications, SAP ECC backend, B2B/EDI: Yes, Ground-to-Ground: 20)
        var env = dto.getSourceSystem().getEnvironmentAssessment();
        env.setIntegrationVolume("medium");
        env.setSystemComplexity("moderate");
        env.setAvailabilityRequirements("high");
        env.setCustomDevelopment("moderate");
        env.setComplianceRequirements("standard");
        env.setMonitoring("standard");
        env.setSimpleInterfaces(20);
        env.setMediumInterfaces(15);
        env.setComplexInterfaces(10);
        env.setTotalInterfaces(45);

        // Volumetrics (Current 350,000, Expected 600,000, 25 KB payload)
        var vol = dto.getSourceSystem().getVolumetrics();
        vol.setCurrentMessageThroughput("350000");
        vol.setIndicativeMessageThroughput("600000");
        vol.setApiCount(45);
        vol.setB2bInterfaces(15);

        // Target System Configuration (Standard Edition: $64,068 + 59 message blocks * $84 = $4,956 -> $69,024)
        var targetConfig = dto.getTargetSystem().getConfiguration();
        targetConfig.setSelectedEditionName("SAP Integration Suite, Standard Edition");
        targetConfig.setNumberOfUnits(1);
        targetConfig.setAdditionalMessagePacks(59);
        targetConfig.setTotalAnnualCost(BigDecimal.valueOf(69024.00));
        targetConfig.setCalculationFormula("1 x $ 64,068.00 + 59 x $ 84.00");

        var targetAdd = dto.getTargetSystem().getAdditionalTcoComponents();
        targetAdd.setTotalAdditionalTcoAnnual(BigDecimal.ZERO);

        // Migration Costs: Incture Silver Package ($65,000 total indicative cost, 4 months timeline)
        // 39k Development (60%) + 13k Testing (20%) + 6.5k Architecture (10%) + 6.5k PM/Hypercare (10%) = 65k
        var mig = dto.getMigrationRelatedDetails();
        mig.setDevelopmentCost(BigDecimal.valueOf(39000));
        mig.setTestingCost(BigDecimal.valueOf(13000));
        mig.setArchitectureCost(BigDecimal.valueOf(6500));
        mig.setProjectManagementCost(BigDecimal.valueOf(6500));
        mig.setTrainingCost(BigDecimal.ZERO);
        mig.setDeploymentCutoverCost(BigDecimal.ZERO);
        mig.setDocumentationCost(BigDecimal.ZERO);
        mig.setBaseMigrationCost(BigDecimal.valueOf(65000));
        mig.setContingencyCost(BigDecimal.ZERO);
        mig.setTotalMigrationCost(BigDecimal.valueOf(65000));
        mig.setCurrency("USD");
        mig.setRoiAnalysisPeriodYears(5);

        return dto;
    }
}
