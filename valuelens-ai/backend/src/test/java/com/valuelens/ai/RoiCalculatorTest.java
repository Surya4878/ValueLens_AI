package com.valuelens.ai;

import com.valuelens.ai.calculator.RoiCalculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RoiCalculatorTest {

    private RoiCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new RoiCalculator();
    }

    @Test
    void testDemoMultiPeriodRoi() {
        // Annual Savings: 416,916; Migration Cost: 300,000
        // 1-Yr ROI: ((416916 * 1 - 300000) / 300000) * 100 = 38.97%
        // 3-Yr ROI: ((416916 * 3 - 300000) / 300000) * 100 = 316.92%
        // 5-Yr ROI: ((416916 * 5 - 300000) / 300000) * 100 = 594.86%
        // 10-Yr ROI: ((416916 * 10 - 300000) / 300000) * 100 = 1289.72%
        var result = calculator.calculate(BigDecimal.valueOf(416916), BigDecimal.valueOf(300000));

        assertEquals(new BigDecimal("38.97"), result.oneYearRoi());
        assertEquals(new BigDecimal("316.92"), result.threeYearRoi());
        assertEquals(new BigDecimal("594.86"), result.fiveYearRoi());
        assertEquals(new BigDecimal("1289.72"), result.tenYearRoi());
    }
}
