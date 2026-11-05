package com.rctrainer.auth;

import com.rctrainer.security.JwtService;
import com.rctrainer.user.AppUser;
import com.rctrainer.user.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.Period;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(AppUserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users=users; this.encoder=encoder; this.jwt=jwt;
    }
    public record RegisterRequest(@NotBlank @Size(max=80) String firstName,
        @NotBlank @Size(max=80) String lastName, @NotNull @Past LocalDate dob,
        @NotBlank @Email @Size(max=254) String email, @NotBlank @Size(min=8,max=72) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record TokenResponse(String token) {}

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse register(@Valid @RequestBody RegisterRequest request) {
        if (Period.between(request.dob(), LocalDate.now()).getYears() < 13)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You must be at least 13 to create an account");
        if (users.existsByEmailIgnoreCase(request.email()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        AppUser user = users.save(new AppUser(request.firstName().trim(), request.lastName().trim(),
            request.dob(), request.email().trim().toLowerCase(), encoder.encode(request.password())));
        return new TokenResponse(jwt.issue(user.getId(), user.getEmail()));
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(request.password(), user.getPasswordHash()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return new TokenResponse(jwt.issue(user.getId(), user.getEmail()));
    }
}
