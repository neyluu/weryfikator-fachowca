package org.example.backend.dto.request;

import jakarta.validation.constraints.*;

public record UpdateAccountRequest(
    @Size(min = 3, max = 100)
    @Pattern(
        regexp = "^[\\p{L}]+([- ][\\p{L}]+)+$",
        message = "Podaj imię i nazwisko"
    )
    String fullName,
    @Email String email,
    @Size(min = 8) String newPassword,
    String currentPassword
) {}
