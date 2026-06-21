package org.example.backend.dto.response.chat;

import java.time.Instant;

public record MessageDto(
        Long id,
        Long conversationId,
        Long senderId,
        String content,
        Instant sentAt,
        Instant readAt
) {}
