package com.valuelens.ai;

import com.valuelens.ai.calculator.CurrentPlatformTcoCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CurrentPlatformTcoCalculatorTest {

    private CurrentPlatformTcoCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new CurrentPlatformTcoCalculator();
    }

    @Test
    void testDemoCurrentTcoCalculation() {
        // Licensing: 150k + 50k + 30k + 20k = 250k
        // Infrastructure: 80k + 25k + 15k + 40k = 160k
        // Support: 80k + 25k + 15k + 40k = 160k
        // Operations: 80k + 25k + 15k + 40k = 160k
        // Total = 730,000
        var result = calculator.calculate(
                BigDecimal.valueOf(150000), BigDecimal.valueOf(50000), BigDecimal.valueOf(30000), BigDecimal.valueOf(20000),
                BigDecimal.valueOf(80000), BigDecimal.valueOf(25000), BigDecimal.valueOf(15000), BigDecimal.valueOf(40000),
                BigDecimal.valueOf(80000), BigDecimal.valueOf(25000), BigDecimal.valueOf(15000), BigDecimal.valueOf(40000),
                BigDecimal.valueOf(80000), BigDecimal.valueOf(25000), BigDecimal.valueOf(15000), BigDecimal.valueOf(40000)
        );

        assertEquals(new BigDecimal("250000.00"), result.licensingSubtotal());
        assertEquals(new BigDecimal("160000.00"), result.infrastructureSubtotal());
        assertEquals(new BigDecimal("160000.00"), result.supportSubtotal());
        assertEquals(new BigDecimal("160000.00"), result.operationsSubtotal());
        assertEquals(new BigDecimal("730000.00"), result.totalCurrentTco());
    }
}
