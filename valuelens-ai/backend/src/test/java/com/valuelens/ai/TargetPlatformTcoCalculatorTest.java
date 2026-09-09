package com.valuelens.ai;

import com.valuelens.ai.calculator.TargetPlatformTcoCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TargetPlatformTcoCalculatorTest {

    private TargetPlatformTcoCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new TargetPlatformTcoCalculator();
    }

    @Test
    void testDemoTargetTcoCalculation() {
        // Standard Edition: 3 units * $57,900.00 = $173,700.00
        // Additional Messages: 400 packs * $75.96 = $30,384.00
        // Config Annual Cost: $173,700 + $30,384 = $204,084.00
        // Additional Annual TCO: $109,000.00
        // Total Target TCO: $313,084.00
        var result = calculator.calculate(
                BigDecimal.valueOf(57900.00),
                3,
                BigDecimal.valueOf(75.96),
                400,
                BigDecimal.valueOf(109000.00)
        );

        assertEquals(new BigDecimal("173700.00"), result.editionTotalCost());
        assertEquals(new BigDecimal("30384.00"), result.messagePacksTotalCost());
        assertEquals(new BigDecimal("204084.00"), result.configurationAnnualCost());
        assertEquals(new BigDecimal("109000.00"), result.additionalAnnualTco());
        assertEquals(new BigDecimal("313084.00"), result.totalTargetTco());
    }
}
