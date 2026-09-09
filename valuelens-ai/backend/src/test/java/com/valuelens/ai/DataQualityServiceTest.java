package com.valuelens.ai;

import com.valuelens.ai.service.DataQualityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DataQualityServiceTest {

    private DataQualityService service;

    @BeforeEach
    void setUp() {
        service = new DataQualityService();
    }

    @Test
    void testComprehensiveAssessmentYieldsHighQualityScore() {
        var result = service.evaluate(
                BigDecimal.valueOf(730000),
                BigDecimal.valueOf(313084),
                BigDecimal.valueOf(300000),
                List.of(),
                true, true, true, false
        );

        assertTrue(result.score() >= 85);
        assertEquals(DataQualityService.QualityLevel.HIGH, result.level());
    }
}
