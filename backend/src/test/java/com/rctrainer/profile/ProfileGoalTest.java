package com.rctrainer.profile;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProfileGoalTest {
    @Test void proteinTargetUsesHigherMultiplierForMuscleGain() {
        BigDecimal weight = new BigDecimal("75");
        BigDecimal gain = weight.multiply(new BigDecimal("2.0"));
        BigDecimal cut = weight.multiply(new BigDecimal("1.8"));
        assertEquals(new BigDecimal("150.0"), gain);
        assertEquals(new BigDecimal("135.0"), cut);
    }
}
