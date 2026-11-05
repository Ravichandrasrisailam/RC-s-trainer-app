package com.rctrainer.nutrition;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MealEstimateServiceTest {
    private final MealEstimateService service = new MealEstimateService();

    @Test void estimatesKnownFoodTermsAndIncludesDisclaimer() {
        var result = service.estimate("2 eggs and rice");
        assertTrue(result.calories().signum() > 0);
        assertTrue(result.protein().signum() > 0);
        assertTrue(result.disclaimer().contains("estimate"));
    }

    @Test void rejectsUnknownMealDescriptionInsteadOfInventingMacros() {
        assertThrows(IllegalArgumentException.class, () -> service.estimate("a plate of something"));
    }
}
