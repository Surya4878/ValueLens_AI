package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/platforms", "/api/platforms"})
@Tag(name = "Platforms & Packages", description = "Source platform configurations and Incture migration packages")
public class PlatformController {

    public record PlatformDto(String id, String name, String cardTitle, String description) {}
    public record MigrationPackageDto(String id, String name, BigDecimal price, int durationWeeks, String scopeSummary, String interfaceLimit, String applicationLimit) {}
    public record SizingResultDto(String recommendedEdition, int recommendedUnits, int additionalMessagePacks, int additionalEicTenants, boolean needsAem, String explanation) {}

    @GetMapping
    @Operation(summary = "Get Supported Source Platforms in canonical order")
    public ResponseEntity<ApiResponseDto<List<PlatformDto>>> getPlatforms() {
        List<PlatformDto> platforms = List.of(
                new PlatformDto("sap-pipo", "SAP PI/PO", "SAP PI/PO → SAP BTP", "Discover the business value of migrating and modernizing your SAP PI/PO landscape."),
                new PlatformDto("mulesoft", "MuleSoft", "MuleSoft → SAP BTP", "Discover the business value of migrating your MuleSoft integrations to SAP BTP Integration Suite."),
                new PlatformDto("sap-neo", "SAP CPI (Neo)", "SAP CPI (Neo) → SAP BTP", "Discover the business value of migrating and modernizing your SAP CPI (Neo) integrations."),
                new PlatformDto("boomi", "Boomi", "Boomi → SAP BTP", "Discover the business value of migrating your Boomi integrations to SAP BTP Integration Suite.")
        );
        return ResponseEntity.ok(ApiResponseDto.success("Platforms retrieved successfully", platforms));
    }

    @GetMapping("/{platformId}/packages")
    @Operation(summary = "Get Incture Migration Packages for Platform")
    public ResponseEntity<ApiResponseDto<List<MigrationPackageDto>>> getPackages(@PathVariable String platformId) {
        List<MigrationPackageDto> packages = switch (platformId.toLowerCase()) {
            case "mulesoft" -> List.of(
                    new MigrationPackageDto("starter", "Starter Package", BigDecimal.valueOf(29000), 8, "Up to 10 APIs / Mule flows", "Up to 10 APIs", "Up to 2 Applications"),
                    new MigrationPackageDto("silver", "SILVER (Small Scope)", BigDecimal.valueOf(68500), 14, "40 APIs with mapping conversion", "Up to 40 APIs", "Up to 5 Applications"),
                    new MigrationPackageDto("gold", "GOLD (Medium Scope)", BigDecimal.valueOf(135000), 20, "80 APIs with B2B/EDI & connectors", "Up to 80 APIs", "Up to 10 Applications"),
                    new MigrationPackageDto("platinum", "PLATINUM (Large Scope)", BigDecimal.valueOf(185000), 26, "120 APIs with complex DataWeave", "Up to 120 APIs", "Up to 15 Applications")
            );
            case "sap-neo", "sap-cpi-neo" -> List.of(
                    new MigrationPackageDto("silver", "SILVER (Small Scope)", BigDecimal.valueOf(25000), 8, "Up to 30 iFlows across Neo tenants", "Up to 30 iFlows", "Up to 3 Subaccounts"),
                    new MigrationPackageDto("gold", "GOLD (Medium Scope)", BigDecimal.valueOf(55000), 14, "Up to 75 iFlows with custom Groovy", "Up to 75 iFlows", "Up to 6 Subaccounts"),
                    new MigrationPackageDto("platinum", "PLATINUM (Large Scope)", BigDecimal.valueOf(70000), 18, "Up to 120 iFlows with complex security", "Up to 120 iFlows", "Up to 10 Subaccounts")
            );
            case "boomi" -> List.of(
                    new MigrationPackageDto("starter", "Starter Package", BigDecimal.valueOf(28000), 8, "Up to 15 Boomi Processes & 3 connectors", "Up to 15 Processes", "Up to 3 Connectors"),
                    new MigrationPackageDto("silver", "SILVER (Small Scope)", BigDecimal.valueOf(61000), 14, "Up to 45 Processes & 6 connectors", "Up to 45 Processes", "Up to 6 Connectors"),
                    new MigrationPackageDto("gold", "GOLD (Medium Scope)", BigDecimal.valueOf(127000), 20, "Up to 90 Processes with B2B/EDI", "Up to 90 Processes", "Up to 12 Connectors"),
                    new MigrationPackageDto("platinum", "PLATINUM (Large Scope)", BigDecimal.valueOf(180000), 26, "Up to 140 Processes with custom scripts", "Up to 140 Processes", "Up to 20 Connectors")
            );
            default -> List.of(
                    new MigrationPackageDto("starter", "Starter Package", BigDecimal.valueOf(19000), 6, "Up to 10 Golden Interfaces (Mixed complexity)", "Up to 10 Interfaces", "Up to 2 Applications"),
                    new MigrationPackageDto("silver", "SILVER (Small Scope)", BigDecimal.valueOf(65000), 12, "50 Interfaces with mixed complexity", "Up to 50 Interfaces", "Up to 5 Applications"),
                    new MigrationPackageDto("gold", "GOLD (Medium Scope)", BigDecimal.valueOf(110000), 18, "100 Interfaces with mixed complexity", "Up to 100 Interfaces", "Up to 10 Applications"),
                    new MigrationPackageDto("platinum", "PLATINUM (Large Scope)", BigDecimal.valueOf(145000), 24, "150 Interfaces with mixed complexity", "Up to 150 Interfaces", "Up to 15 Applications")
            );
        };
        return ResponseEntity.ok(ApiResponseDto.success("Packages retrieved successfully", packages));
    }

    @PostMapping("/sizing")
    @Operation(summary = "Determine BTP Edition and Tenant Sizing Deterministically")
    public ResponseEntity<ApiResponseDto<SizingResultDto>> calculateSizing(@RequestBody Map<String, Object> req) {
        int messageThroughput = req.containsKey("messageThroughput") ? Integer.parseInt(req.get("messageThroughput").toString()) : 200000;
        boolean needsAem = Boolean.parseBoolean(String.valueOf(req.getOrDefault("advancedEventMesh", false)));
        boolean needsAi = Boolean.parseBoolean(String.valueOf(req.getOrDefault("aiCapabilities", false)));
        boolean needsApiMgmt = Boolean.parseBoolean(String.valueOf(req.getOrDefault("apiManagement", false)));
        boolean needsB2b = Boolean.parseBoolean(String.valueOf(req.getOrDefault("b2bEdi", false)));
        boolean needsEic = Boolean.parseBoolean(String.valueOf(req.getOrDefault("privateRuntime", false)));

        String recommendedEdition;
        String explanation;
        int includedMessages;

        if (needsAem || needsAi || messageThroughput > 500000) {
            recommendedEdition = "Enhanced Edition";
            includedMessages = 500000;
            explanation = "Enhanced Edition is recommended based on advanced capabilities required (Advanced Event Mesh, Document AI, or Integration Suite AI) and high message scale.";
        } else if (needsApiMgmt || needsB2b || needsEic || messageThroughput > 50000) {
            recommendedEdition = "Standard Edition";
            includedMessages = 10000;
            explanation = "Standard Edition is recommended as enterprise baseline providing full API Lifecycle Management, B2B/EDI libraries, Integration Advisor, and Edge Integration Cell runtime.";
        } else {
            recommendedEdition = "Starter Edition";
            includedMessages = 50000;
            explanation = "Starter Edition is suitable for core Cloud Integration workflows and prebuilt accelerators within a 10 custom iFlow footprint.";
        }

        int excessMessages = Math.max(0, messageThroughput - includedMessages);
        int additionalMessagePacks = (int) Math.ceil((double) excessMessages / 10000);
        int additionalEicTenants = needsEic ? 1 : 0;
        int units = 1;

        SizingResultDto res = new SizingResultDto(
                recommendedEdition,
                units,
                additionalMessagePacks,
                additionalEicTenants,
                needsAem,
                explanation
        );

        return ResponseEntity.ok(ApiResponseDto.success("Sizing calculated successfully", res));
    }
}
