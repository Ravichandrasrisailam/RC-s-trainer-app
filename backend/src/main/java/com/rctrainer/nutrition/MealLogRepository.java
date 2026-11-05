package com.rctrainer.nutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
interface MealLogRepository extends JpaRepository<MealLog,UUID> {
    List<MealLog> findTop100ByUserIdOrderByLoggedAtDesc(UUID userId);
}
