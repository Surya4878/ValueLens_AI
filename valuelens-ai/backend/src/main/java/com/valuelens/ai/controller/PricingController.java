package com.valuelens.ai.controller;

import com.valuelens.ai.dto.ApiResponseDto;
import com.valuelens.ai.model.PricingCatalogEntity;
import com.valuelens.ai.service.PricingCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/pricing", "/api/pricing"})
@Tag(name = "Pricing Catalog", description = "Versioned SAP BTP Integration Suite pricing records")
public class PricingController {

    private final PricingCatalogService pricingCatalogService;

    public PricingController(PricingCatalogService pricingCatalogService) {
        this.pricingCatalogService = pricingCatalogService;
    }

    @GetMapping("/catalog")
    @Operation(summary = "Get Active Pricing Catalog for Platform")
    public ResponseEntity<ApiResponseDto<List<PricingCatalogEntity>>> getCatalog(
            @RequestParam(defaultValue = "SAP BTP Integration Suite") String platform) {
        List<PricingCatalogEntity> list = pricingCatalogService.getActiveCatalogForPlatform(platform);
        return ResponseEntity.ok(ApiResponseDto.success("Pricing catalog retrieved successfully", list));
    }
}
