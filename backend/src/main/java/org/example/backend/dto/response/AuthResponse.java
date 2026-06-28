package org.example.backend.dto.response;

public record AuthResponse(
    String token,
    String fullName,
    String email,
    String role
) {}
