package com.valuelens.ai;

import com.valuelens.ai.validation.DataConsistencyValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DataConsistencyValidatorTest {

    private DataConsistencyValidator validator;

    @BeforeEach
    void setUp() {
        validator = new DataConsistencyValidator();
    }

    @Test
    void testConsistentDataProducesNoWarnings() {
        var warnings = validator.validate(
                BigDecimal.valueOf(250000), BigDecimal.valueOf(250000),
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(730000), BigDecimal.valueOf(730000),
                BigDecimal.valueOf(270000), BigDecimal.valueOf(270000),
                BigDecimal.valueOf(300000), BigDecimal.valueOf(300000),
                BigDecimal.valueOf(204084), BigDecimal.valueOf(204084)
        );

        assertTrue(warnings.isEmpty());
    }

    @Test
    void testInconsistentDataProducesWarningWithVariance() {
        var warnings = validator.validate(
                BigDecimal.valueOf(240000), BigDecimal.valueOf(250000), // $10k mismatch
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(160000), BigDecimal.valueOf(160000),
                BigDecimal.valueOf(730000), BigDecimal.valueOf(730000),
                BigDecimal.valueOf(270000), BigDecimal.valueOf(270000),
                BigDecimal.valueOf(300000), BigDecimal.valueOf(300000),
                BigDecimal.valueOf(204084), BigDecimal.valueOf(204084)
        );

        assertEquals(1, warnings.size());
        assertEquals("licensingSubtotal", warnings.get(0).field());
        assertEquals(new BigDecimal("10000"), warnings.get(0).variance());
    }
}
