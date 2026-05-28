package org.example.backend.dto.response;

import java.time.LocalDateTime;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;

public record UserDto(
    String fullName,
    String email,
    Role role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public UserDto(User user) {
        this(
            user.getFullName(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
