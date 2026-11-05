package com.rctrainer.progress;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController @RequestMapping("/api/progress")
public class ProgressController {
    private final ProgressRepository repository;
    private final ActivityRepository activityRepository;
    public ProgressController(ProgressRepository repository, ActivityRepository activityRepository){this.repository=repository;this.activityRepository=activityRepository;}
    public record WeightRequest(@NotNull @DecimalMin("30") @DecimalMax("300") BigDecimal weightKg){}
    public record StepsRequest(@Min(0) @Max(100000) int steps){}
    public record ProgressResponse(BigDecimal weightKg, LocalDate date, Integer steps){}

    @PostMapping("/weight") @ResponseStatus(HttpStatus.CREATED)
    public ProgressResponse weight(Authentication auth,@Valid @RequestBody WeightRequest r) {
        var log=repository.save(new WeightLog((UUID)auth.getPrincipal(),r.weightKg(),LocalDate.now()));
        return new ProgressResponse(log.getWeightKg(),log.getLoggedOn(),null);
    }
    @PostMapping("/steps")
    public ProgressResponse steps(Authentication auth,@Valid @RequestBody StepsRequest r) {
        var log=activityRepository.save(new ActivityLog((UUID)auth.getPrincipal(),r.steps(),LocalDate.now()));
        return new ProgressResponse(null,log.getDate(),log.getSteps());
    }
}

@Entity @Table(name="body_weight_log")
class WeightLog {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="user_id",nullable=false) private UUID userId;
    @Column(name="weight_kg",nullable=false) private BigDecimal weightKg;
    @Column(name="logged_on",nullable=false) private LocalDate loggedOn;
    protected WeightLog(){}
    WeightLog(UUID u,BigDecimal w,LocalDate d){userId=u;weightKg=w;loggedOn=d;}
    BigDecimal getWeightKg(){return weightKg;} LocalDate getLoggedOn(){return loggedOn;}
}
@Entity @Table(name="daily_activity")
class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="user_id",nullable=false) private UUID userId;
    @Column(nullable=false) private int steps;
    @Column(name="activity_date",nullable=false) private LocalDate date;
    protected ActivityLog(){}
    ActivityLog(UUID u,int s,LocalDate d){userId=u;steps=s;date=d;}
    int getSteps(){return steps;} LocalDate getDate(){return date;}
}
