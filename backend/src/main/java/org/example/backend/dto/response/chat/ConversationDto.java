package org.example.backend.dto.response.chat;

import java.time.Instant;

public record ConversationDto(
        Long id,
        Long otherUserId,
        MessageDto lastMessage,
        Instant createdAt
) {}
