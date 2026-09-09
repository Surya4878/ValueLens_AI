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

    @Test
    void testTargetTcoWithMultipleAddOns() {
        // Standard Edition: 1 unit * $64,068.00 = $64,068.00
        // Additional Messages: 50 packs * $84.00 = $4,200.00
        // Data Space Integration: 2 packages * $900.00 = $1,800.00
        // Additional EIC Tenants: 1 tenant * $41,460.00 = $41,460.00
        // Add-ons subtotal = $4,200 + $1,800 + $41,460 = $47,460.00
        // Configuration cost = $64,068 + $47,460 = $111,528.00
        // Additional Annual TCO = $109,000.00
        // Total Target TCO = $220,528.00
        var result = calculator.calculate(
                BigDecimal.valueOf(64068.00),
                1,
                BigDecimal.valueOf(84.00),
                50,
                BigDecimal.valueOf(900.00),
                2,
                BigDecimal.valueOf(41460.00),
                1,
                BigDecimal.valueOf(109000.00)
        );

        assertEquals(new BigDecimal("64068.00"), result.editionTotalCost());
        assertEquals(new BigDecimal("4200.00"), result.messagePacksTotalCost());
        assertEquals(new BigDecimal("1800.00"), result.dataSpaceTotalCost());
        assertEquals(new BigDecimal("41460.00"), result.additionalEicTotalCost());
        assertEquals(new BigDecimal("47460.00"), result.addOnsTotalCost());
        assertEquals(new BigDecimal("111528.00"), result.configurationAnnualCost());
        assertEquals(new BigDecimal("109000.00"), result.additionalAnnualTco());
        assertEquals(new BigDecimal("220528.00"), result.totalTargetTco());
    }
}
