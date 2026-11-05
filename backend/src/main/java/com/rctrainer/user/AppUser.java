package com.rctrainer.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity @Table(name = "app_user")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name="first_name", nullable=false, length=80) private String firstName;
    @Column(name="last_name", nullable=false, length=80) private String lastName;
    @Column(name="date_of_birth", nullable=false) private LocalDate dateOfBirth;
    @Column(nullable=false, unique=true, length=254) private String email;
    @Column(name="password_hash", nullable=false, length=100) private String passwordHash;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    @Column(name="updated_at", nullable=false) private Instant updatedAt = Instant.now();

    protected AppUser() {}
    public AppUser(String firstName,String lastName,LocalDate dob,String email,String passwordHash) {
        this.firstName=firstName; this.lastName=lastName; this.dateOfBirth=dob;
        this.email=email; this.passwordHash=passwordHash;
    }
    public UUID getId(){return id;} public String getEmail(){return email;}
    public String getPasswordHash(){return passwordHash;}
    public String getFirstName(){return firstName;} public String getLastName(){return lastName;}
}
