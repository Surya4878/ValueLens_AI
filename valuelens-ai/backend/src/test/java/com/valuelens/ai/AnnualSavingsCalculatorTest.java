package com.valuelens.ai;

import com.valuelens.ai.calculator.AnnualSavingsCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AnnualSavingsCalculatorTest {

    private AnnualSavingsCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new AnnualSavingsCalculator();
    }

    @Test
    void testDemoAnnualSavings() {
        // Current: 730,000; Target: 313,084
        // Annual Savings: 730,000 - 313,084 = 416,916
        // Savings Percentage: 416,916 / 730,000 * 100 = 57.11%
        var result = calculator.calculate(BigDecimal.valueOf(730000), BigDecimal.valueOf(313084));

        assertEquals(new BigDecimal("416916.00"), result.annualSavings());
        assertEquals(new BigDecimal("57.11"), result.savingsPercentage());
    }
}
