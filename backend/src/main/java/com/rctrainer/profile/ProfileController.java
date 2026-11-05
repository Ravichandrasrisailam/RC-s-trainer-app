package com.rctrainer.profile;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@RestController @RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileRepository repository;
    public ProfileController(ProfileRepository repository){this.repository=repository;}

    public record ProfileRequest(@NotNull @DecimalMin("100") @DecimalMax("230") BigDecimal heightCm,
        @NotNull @DecimalMin("30") @DecimalMax("300") BigDecimal weightKg,
        @NotNull Goal goal, @NotNull ActivityLevel activityLevel,
        @Min(3) @Max(6) int trainingDaysPerWeek,
        @Min(1000) @Max(30000) int stepTarget) {}
    public enum Goal { WEIGHT_LOSS, FAT_LOSS, MUSCLE_GAIN, RECOMPOSITION }
    public enum ActivityLevel { SEDENTARY, LIGHT, MODERATE, VERY_ACTIVE }
    public record ProfileResponse(BigDecimal heightCm, BigDecimal weightKg, Goal goal,
                                  ActivityLevel activityLevel, int trainingDaysPerWeek,
                                  int stepTarget, BigDecimal proteinTargetG) {}

    @PutMapping
    public ProfileResponse save(Authentication auth, @Valid @RequestBody ProfileRequest request) {
        UUID userId=(UUID)auth.getPrincipal();
        BigDecimal multiplier=request.goal()==Goal.MUSCLE_GAIN ? new BigDecimal("2.0") : new BigDecimal("1.8");
        BigDecimal protein=request.weightKg().multiply(multiplier).setScale(0, java.math.RoundingMode.HALF_UP);
        FitnessProfile profile=repository.findById(userId).orElseGet(()->new FitnessProfile(userId));
        profile.update(request.heightCm(), request.weightKg(), request.goal().name(),
            request.activityLevel().name(), request.trainingDaysPerWeek(), request.stepTarget(), protein);
        repository.save(profile);
        return new ProfileResponse(profile.getHeightCm(), profile.getWeightKg(), request.goal(),
            request.activityLevel(), profile.getTrainingDaysPerWeek(), profile.getStepTarget(), profile.getProteinTargetG());
    }

    @GetMapping
    public ProfileResponse get(Authentication auth) {
        FitnessProfile p=repository.findById((UUID)auth.getPrincipal())
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Profile not found"));
        return new ProfileResponse(p.getHeightCm(), p.getWeightKg(), Goal.valueOf(p.getGoal()),
            ActivityLevel.valueOf(p.getActivityLevel()), p.getTrainingDaysPerWeek(), p.getStepTarget(), p.getProteinTargetG());
    }
}

@Entity @Table(name="fitness_profile")
class FitnessProfile {
    @Id @Column(name="user_id") private UUID userId;
    @Column(name="height_cm",nullable=false) private BigDecimal heightCm;
    @Column(name="current_weight_kg",nullable=false) private BigDecimal weightKg;
    @Column(nullable=false) private String goal;
    @Column(name="activity_level",nullable=false) private String activityLevel="MODERATE";
    @Column(name="training_days_per_week",nullable=false) private int trainingDaysPerWeek=3;
    @Column(name="daily_step_target",nullable=false) private int stepTarget=10000;
    @Column(name="protein_target_g",nullable=false) private BigDecimal proteinTargetG;
    @Column(name="updated_at",nullable=false) private Instant updatedAt=Instant.now();
    protected FitnessProfile(){}
    FitnessProfile(UUID userId){this.userId=userId;}
    void update(BigDecimal h, BigDecimal w, String g, String a, int d, int s, BigDecimal p){
        heightCm=h; weightKg=w; goal=g; activityLevel=a; trainingDaysPerWeek=d;
        stepTarget=s; proteinTargetG=p; updatedAt=Instant.now();
    }
    BigDecimal getHeightCm(){return heightCm;} BigDecimal getWeightKg(){return weightKg;}
    String getGoal(){return goal;} String getActivityLevel(){return activityLevel;}
    int getTrainingDaysPerWeek(){return trainingDaysPerWeek;} int getStepTarget(){return stepTarget;}
    BigDecimal getProteinTargetG(){return proteinTargetG;}
}
