package com.rctrainer.nutrition;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@RestController @RequestMapping("/api/nutrition")
public class NutritionController {
    private final MealEstimateService estimator;
    private final MealLogRepository repository;
    public NutritionController(MealEstimateService estimator, MealLogRepository repository) {
        this.estimator=estimator; this.repository=repository;
    }
    public record EstimateRequest(@NotBlank @Size(max=500) String description) {}
    public record MealRequest(@NotBlank @Size(max=180) String name, @NotBlank String mealType,
        @DecimalMin("0") BigDecimal calories, @DecimalMin("0") BigDecimal protein,
        @DecimalMin("0") BigDecimal carbs, @DecimalMin("0") BigDecimal fats) {}
    public record MealResponse(UUID id,String name,String mealType,BigDecimal calories,
        BigDecimal protein,BigDecimal carbs,BigDecimal fats,Instant loggedAt) {}

    @PostMapping("/estimate")
    public MealEstimateService.Estimate estimate(@Valid @RequestBody EstimateRequest request) {
        return estimator.estimate(request.description());
    }
    @PostMapping("/meals") @ResponseStatus(HttpStatus.CREATED)
    public MealResponse log(Authentication auth,@Valid @RequestBody MealRequest r) {
        UUID user=(UUID)auth.getPrincipal();
        MealLog m=repository.save(new MealLog(user,r.name(),r.mealType(),r.calories(),r.protein(),r.carbs(),r.fats()));
        return new MealResponse(m.getId(),m.getName(),m.getMealType(),m.getCalories(),m.getProtein(),m.getCarbs(),m.getFats(),m.getLoggedAt());
    }
    @GetMapping("/meals")
    public List<MealResponse> meals(Authentication auth) {
        return repository.findTop100ByUserIdOrderByLoggedAtDesc((UUID)auth.getPrincipal()).stream()
            .map(m->new MealResponse(m.getId(),m.getName(),m.getMealType(),m.getCalories(),m.getProtein(),m.getCarbs(),m.getFats(),m.getLoggedAt())).toList();
    }
}

@org.springframework.stereotype.Service
class MealEstimateService {
    public record Estimate(String name,BigDecimal calories,BigDecimal protein,BigDecimal carbs,BigDecimal fats,
                           String disclaimer) {}
    private static final Map<String, double[]> FOODS=Map.of(
        "egg",new double[]{143,13,1,10},"chicken",new double[]{165,31,0,3.6},
        "rice",new double[]{130,2.7,28,0.3},"oats",new double[]{389,16.9,66,6.9},
        "banana",new double[]{89,1.1,23,0.3},"paneer",new double[]{265,18,1.2,20},
        "whey",new double[]{400,80,8,6},"milk",new double[]{61,3.2,4.8,3.3}
    );
    private final com.fasterxml.jackson.databind.ObjectMapper mapper;
    private final org.springframework.web.client.RestClient client = org.springframework.web.client.RestClient.create();
    private final String apiKey;
    MealEstimateService() {
        this(new com.fasterxml.jackson.databind.ObjectMapper(), "");
    }
    MealEstimateService(com.fasterxml.jackson.databind.ObjectMapper mapper,
        @org.springframework.beans.factory.annotation.Value("${app.ai.gemini-api-key:}") String apiKey) {
        this.mapper=mapper; this.apiKey=apiKey;
    }
    Estimate estimate(String description) {
        if (apiKey != null && !apiKey.isBlank()) {
            try { return estimateWithGemini(description); }
            catch (Exception ignored) { /* use explicit local estimate fallback when provider is unavailable */ }
        }
        return estimateFromFoodReference(description);
    }
    private Estimate estimateWithGemini(String description) throws Exception {
        String prompt = "Estimate nutrition for this meal. Return JSON only with keys name, calories, protein, carbs, fats. " +
            "Use grams for macros and kcal for calories. Do not invent exactness; estimate based on the described portion. " +
            "Meal: " + description;
        var body = mapper.createObjectNode();
        var parts = mapper.createArrayNode().add(mapper.createObjectNode().put("text", prompt));
        body.set("contents", mapper.createArrayNode().add(mapper.createObjectNode().set("parts", parts)));
        var response = client.post()
            .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey)
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .body(body).retrieve().body(com.fasterxml.jackson.databind.JsonNode.class);
        String text = response.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
        text = text.replaceAll("(?s)^```(?:json)?\\s*", "").replaceAll("\\s*```$", "").trim();
        var json = mapper.readTree(text);
        return new Estimate(json.path("name").asText(description),
            decimal(json,"calories"), decimal(json,"protein"), decimal(json,"carbs"), decimal(json,"fats"),
            "AI-generated approximate nutrition estimate. Verify portions and ingredients before relying on it.");
    }
    private BigDecimal decimal(com.fasterxml.jackson.databind.JsonNode node,String key) {
        if (!node.hasNonNull(key) || !node.get(key).isNumber() || node.get(key).asDouble() < 0)
            throw new IllegalArgumentException("AI returned an invalid nutrition value: " + key);
        return BigDecimal.valueOf(node.get(key).asDouble()).setScale(1,java.math.RoundingMode.HALF_UP);
    }
    private Estimate estimateFromFoodReference(String text) {
        String lower=text.toLowerCase(Locale.ROOT);
        double[] total=new double[4]; int matched=0;
        for(var entry:FOODS.entrySet()) if(lower.contains(entry.getKey())) {
            for(int i=0;i<4;i++) total[i]+=entry.getValue()[i]/100.0;
            matched++;
        }
        if(matched==0) throw new IllegalArgumentException("AI nutrition is unavailable and no supported food matched. Configure GEMINI_API_KEY or describe a supported food.");
        return new Estimate(text.length()>60?text.substring(0,57)+"...":text,
            BigDecimal.valueOf(total[0]).setScale(0,java.math.RoundingMode.HALF_UP),
            BigDecimal.valueOf(total[1]).setScale(1,java.math.RoundingMode.HALF_UP),
            BigDecimal.valueOf(total[2]).setScale(1,java.math.RoundingMode.HALF_UP),
            BigDecimal.valueOf(total[3]).setScale(1,java.math.RoundingMode.HALF_UP),
            "Fallback estimate from generic per-100g food values; portion sizes are not inferred. Configure GEMINI_API_KEY for AI estimates.");
    }
}

@Entity @Table(name="meal_log")
class MealLog {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="user_id",nullable=false) private UUID userId;
    @Column(name="meal_name",nullable=false) private String name;
    @Column(name="meal_type",nullable=false) private String mealType;
    @Column(nullable=false) private BigDecimal calories;
    @Column(name="protein_g",nullable=false) private BigDecimal protein;
    @Column(name="carbs_g",nullable=false) private BigDecimal carbs;
    @Column(name="fats_g",nullable=false) private BigDecimal fats;
    @Column(name="logged_at",nullable=false) private Instant loggedAt=Instant.now();
    protected MealLog(){}
    MealLog(UUID u,String n,String t,BigDecimal c,BigDecimal p,BigDecimal cb,BigDecimal f){userId=u;name=n;mealType=t;calories=c;protein=p;carbs=cb;fats=f;}
    UUID getId(){return id;} String getName(){return name;} String getMealType(){return mealType;}
    BigDecimal getCalories(){return calories;} BigDecimal getProtein(){return protein;} BigDecimal getCarbs(){return carbs;} BigDecimal getFats(){return fats;} Instant getLoggedAt(){return loggedAt;}
}
