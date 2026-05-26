package org.example.backend.dto.request;

import jakarta.validation.constraints.*;
import org.example.backend.entity.Role;

public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 50) String username,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    Role role
) {}
