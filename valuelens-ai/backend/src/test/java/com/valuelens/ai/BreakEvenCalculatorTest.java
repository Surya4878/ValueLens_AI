package com.valuelens.ai;

import com.valuelens.ai.calculator.BreakEvenCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class BreakEvenCalculatorTest {

    private BreakEvenCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new BreakEvenCalculator();
    }

    @Test
    void testDemoBreakEven() {
        // Migration Cost: 300,000; Annual Savings: 416,916
        // Break-even Months = 300,000 / 416,916 * 12 = 8.6348 -> rounded 8.63 or 8.64
        var result = calculator.calculate(BigDecimal.valueOf(300000), BigDecimal.valueOf(416916));

        assertEquals(BreakEvenCalculator.BreakEvenStatus.REACHED, result.status());
        assertEquals(new BigDecimal("8.64"), result.breakEvenMonths());
    }

    @Test
    void testNegativeSavingsNeverReachesBreakEven() {
        var result = calculator.calculate(BigDecimal.valueOf(300000), BigDecimal.valueOf(-50000));
        assertEquals(BreakEvenCalculator.BreakEvenStatus.NOT_REACHED, result.status());
        assertNull(result.breakEvenMonths());
    }
}
