package org.example.backend.dto.response;

import org.example.backend.entity.Role;
import org.example.backend.entity.User;

import java.time.LocalDateTime;

public record UserDto(
        String username,
        String email,
        Role role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public UserDto(User user) {
        this(
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
