package com.rctrainer.progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface ProgressRepository extends JpaRepository<WeightLog,UUID> {}
